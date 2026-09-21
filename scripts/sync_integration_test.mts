/** Real store + real PostgreSQL migrations, with an in-memory PostgREST transport.
 * No live Supabase credentials, network requests, or user data are used.
 * Run: npm run test:sync
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { PGlite } from '@electric-sql/pglite';

const root = new URL('../', import.meta.url);
const initialMigration = readFileSync(new URL('supabase/migrations/20260920_exam_fields_and_question_exposure.sql', root), 'utf8');
const safeMigration = readFileSync(new URL('supabase/migrations/20260921_safe_cross_device_sync.sql', root), 'utf8');
const source = readFileSync(new URL('src/lib/store.ts', root), 'utf8');
const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;

async function database(safe = true) {
    const db = new PGlite();
    // The pre-existing table contract used by store.ts. Production has these tables already.
    await db.exec(`
        create table error_log (
            question_id text primary key, domain text, topic text, mastered boolean,
            repetition_stage integer, date_logged_at bigint, next_review_at bigint,
            last_attempt_at bigint, answer_status text, last_outcome text, attempts integer,
            wrong_count integer, unsure_count integer, confident_count integer,
            error_reason text, notes text
        );
        create table exam_history (
            id text primary key, date text, score integer, total_questions integer,
            domain_scores jsonb, time_spent_seconds integer, mode text
        );
    `);
    await db.exec(initialMigration);
    if (safe) await db.exec(safeMigration);
    return db;
}

function transport(db: PGlite) {
    const controls = { readFailure: false, writeFailure: false, writes: 0, signedOut: false,
        beforeRead: null as null | (() => void) };
    const client = {
        // Sync now requires a signed-in user, because the tables grant nothing to the
        // anonymous role. The harness stands in for a session that Supabase Auth would hold.
        auth: {
            async getSession() {
                return controls.signedOut
                    ? { data: { session: null }, error: null }
                    : { data: { session: { user: { id: '11111111-1111-4111-8111-111111111111' } } }, error: null };
            }
        },
        async rpc(name: string) {
            assert.equal(name, 'rdn_sync_protocol');
            try {
                const result = await db.query<{ version: number }>('select public.rdn_sync_protocol() as version');
                return { data: result.rows[0].version, error: null };
            } catch (error) { return { data: null, error }; }
        },
        from(table: string) {
            assert.ok(['question_exposure', 'exam_history', 'error_log'].includes(table));
            const primary = table === 'exam_history' ? 'id' : 'question_id';
            return {
                async upsert(rows: Record<string, unknown>[]) {
                    if (controls.writeFailure) return { error: { message: 'write permission denied' } };
                    try {
                        for (const row of rows) {
                            const cols = Object.keys(row).filter(k => row[k] !== undefined);
                            assert.ok(cols.every(k => /^[a-z_]+$/.test(k)));
                            const vals = cols.map(k => row[k] !== null && typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k]);
                            await db.query(`insert into public.${table} (${cols.join(',')})
                                values (${cols.map((_, i) => '$' + (i + 1)).join(',')})
                                on conflict (${primary}) do update set
                                ${cols.filter(k => k !== primary).map(k => `${k}=excluded.${k}`).join(',')}`, vals);
                            controls.writes++;
                        }
                        return { error: null };
                    } catch (error) { return { error }; }
                },
                select() {
                    return {
                        order(key: string) {
                            assert.equal(key, primary);
                            return {
                                async range(from: number, to: number) {
                                    const callback = controls.beforeRead;
                                    controls.beforeRead = null;
                                    callback?.();
                                    if (controls.readFailure) return { data: null, error: { message: 'offline' } };
                                    const result = await db.query(`select * from public.${table} order by ${primary} limit $1 offset $2`, [to - from + 1, from]);
                                    return { data: result.rows, error: null };
                                }
                            };
                        }
                    };
                }
            };
        }
    };
    return { client, controls };
}

function device(db: PGlite) {
    const memory = new Map<string, string>();
    const timers = new Map<number, () => void>();
    let timerId = 0, notifications = 0;
    const remote = transport(db);
    const context = vm.createContext({
        exports: {}, console, Event,
        window: { dispatchEvent() { notifications++; } },
        localStorage: {
            getItem: (k: string) => memory.get(k) ?? null,
            setItem: (k: string, v: string) => memory.set(k, String(v)),
            removeItem: (k: string) => memory.delete(k),
        },
        setTimeout: (fn: () => void) => { timers.set(++timerId, fn); return timerId; },
        clearTimeout: (id: number) => timers.delete(id),
        require: (id: string) => {
            assert.equal(id, './supabaseClient');
            return { supabase: remote.client, isSupabaseConfigured: true };
        }
    });
    vm.runInContext(js, context, { filename: 'store.cjs' });
    const store = context.exports.store as typeof import('../src/lib/store').store;
    return { store, memory, ...remote, notifications: () => notifications, timers };
}

let passed = 0;
async function check(name: string, fn: () => unknown | Promise<unknown>) {
    await fn(); passed++; console.log('PASS ' + name);
}
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const exam = {
    id: 'mock-shared', date: '2026-09-20T12:00:00.000Z', score: 80, total_questions: 100,
    domain_scores: {}, time_spent_seconds: 9000, mode: 'mock', real_conditions: true,
    inconclusive: false, fresh_total: 40, fresh_correct: 31
};
const legacy = { ...exam, real_conditions: null, inconclusive: null, fresh_total: null, fresh_correct: null };
const db = await database();
try {
    const a = device(db), b = device(db);
    a.store.applyRemoteExamHistory([exam]);
    a.store.applyExposurePayload([{ question_id: 'shared', seen_at: 2000, exposed_at: 2000 }]);
    b.store.applyRemoteExamHistory([legacy]);
    b.store.applyExposurePayload([{ question_id: 'shared', seen_at: null, exposed_at: 1000 }]);

    await check('A uploads, stale B performs fullSync, and exam/attempt facts survive on both', async () => {
        assert.equal((await a.store.fullSync()).state, 'ok');
        assert.equal((await b.store.fullSync()).state, 'ok');
        assert.equal(b.store.getExamHistory()[0].freshCorrect, 31);
        assert.equal(b.store.getExamHistory()[0].freshTotal, 40);
        assert.equal(b.store.getExamHistory()[0].inconclusive, false);
        assert.equal(b.store.getSeen().shared, 2000);
        assert.equal((await a.store.fullSync()).state, 'ok');
        assert.equal(a.store.getExamHistory()[0].freshCorrect, 31);
    });
    await check('Database guards protect writes from cached clients that still upload first', async () => {
        await b.client.from('exam_history').upsert([{ ...legacy, score: 1 }]);
        await b.client.from('question_exposure').upsert([{ question_id: 'shared', seen_at: null, exposed_at: 500 }]);
        const rows = await db.query<typeof exam>('select * from exam_history');
        assert.equal(rows.rows[0].score, 80);
        assert.equal(rows.rows[0].fresh_correct, 31);
        const exposure = await db.query<{ seen_at: number; exposed_at: number }>('select * from question_exposure where question_id=$1', ['shared']);
        assert.equal(exposure.rows[0].seen_at, 2000);
        assert.equal(exposure.rows[0].exposed_at, 2000);
    });
    await check('Unknown metadata can be filled without treating zero/false as missing', async () => {
        await a.client.from('exam_history').upsert([{ ...legacy, id: 'legacy-fill' }]);
        await a.client.from('exam_history').upsert([{ ...exam, id: 'legacy-fill', fresh_total: 0, fresh_correct: 0, real_conditions: false }]);
        await b.client.from('exam_history').upsert([{ ...exam, id: 'legacy-fill' }]);
        const row = (await db.query<typeof exam>('select * from exam_history where id=$1', ['legacy-fill'])).rows[0];
        assert.equal(row.fresh_total, 0); assert.equal(row.real_conditions, false);
    });
    await check('Overlapping device syncs merge independent seen/exposed facts without rollback', async () => {
        a.store.applyExposurePayload([{ question_id: 'overlap', seen_at: 3000, exposed_at: null }]);
        b.store.applyExposurePayload([{ question_id: 'overlap', seen_at: null, exposed_at: 4000 }, { question_id: 'only-b', seen_at: 5000 }]);
        await Promise.all([a.store.fullSync(), b.store.fullSync()]);
        await a.store.fullSync(); await b.store.fullSync();
        for (const d of [a, b]) {
            assert.equal(d.store.getSeen().overlap, 3000);
            assert.equal(d.store.getExposed().overlap, 4000);
            assert.equal(d.store.getSeen()['only-b'], 5000);
        }
    });
    const review = { question_id: 'review', domain: 'Domain II', topic: 'Nutrition Support', mastered: true,
        repetition_stage: 4, date_logged_at: 1000, next_review_at: 3000, last_attempt_at: 3000,
        answer_status: 'confident', last_outcome: 'confident', attempts: 5, wrong_count: 1, unsure_count: 0, confident_count: 4 };
    await check('Stale review snapshots cannot reset mastery, scheduling, or counters', async () => {
        await a.client.from('error_log').upsert([review]);
        await b.client.from('error_log').upsert([{ ...review, last_attempt_at: 1000, mastered: false, repetition_stage: 0, attempts: 1, confident_count: 0 }]);
        await b.store.fullSync();
        const item = b.store.getErrorLog().find(x => x.questionId === 'review')!;
        assert.equal(item.mastered, true); assert.equal(item.attempts, 5); assert.equal(item.lastAttemptAt, 3000);
    });
    await check('A newer local review survives the initial remote read and reaches the other device', async () => {
        const item = b.store.getErrorLog().find(x => x.questionId === 'review')!;
        b.store.saveErrorLog([{ ...item, lastAttemptAt: 6000, dateLoggedAt: 6000, mastered: false,
            lastOutcome: 'incorrect', answerStatus: 'incorrect', wrongCount: 2, attempts: 6 }]);
        await b.store.fullSync(); await a.store.fullSync();
        const next = a.store.getErrorLog().find(x => x.questionId === 'review')!;
        assert.equal(next.lastAttemptAt, 6000); assert.equal(next.mastered, false); assert.equal(next.attempts, 6);
    });
    await check('A study action during an in-flight sync is uploaded before it reports success', async () => {
        b.controls.beforeRead = () => b.store.markSeen(['during-sync']);
        assert.equal((await b.store.fullSync()).state, 'ok');
        await a.store.fullSync(); assert.ok(a.store.getSeen()['during-sync']);
        assert.ok(b.notifications() > 0);
    });
    await check('Read failure causes no uploads and keeps local progress', async () => {
        const writes = b.controls.writes; b.controls.readFailure = true;
        b.store.markSeen(['offline-progress']);
        assert.equal((await b.store.fullSync()).state, 'error');
        assert.equal(b.controls.writes, writes); assert.ok(b.store.getSeen()['offline-progress']);
        b.controls.readFailure = false;
        assert.equal((await b.store.fullSync()).state, 'ok'); await a.store.fullSync();
        assert.ok(a.store.getSeen()['offline-progress']);
    });
    await check('Write failure cannot report Synced or advance the successful-sync timestamp', async () => {
        const last = b.store.getCloudStatus().lastSuccessAt; b.controls.writeFailure = true;
        assert.equal((await b.store.fullSync()).state, 'error');
        assert.equal(b.store.getCloudStatus().lastSuccessAt, last);
        assert.equal(b.store.getCloudStatus().result.state, 'error'); b.controls.writeFailure = false;
    });
    await check('Question history beyond the default 1,000-row limit is restored', async () => {
        await db.exec(`insert into question_exposure(question_id,seen_at,exposed_at)
            select 'bulk-' || lpad(i::text,4,'0'), 7000, 8000 from generate_series(1,1179) i`);
        const c = device(db); assert.equal((await c.store.fullSync()).state, 'ok');
        assert.equal(c.store.getSeen()['bulk-1179'], 7000);
        assert.equal(c.store.getExposed()['bulk-1179'], 8000);
    });
    await check('Backup restore enriches a legacy exam, remains idempotent, and preserves false/zero', () => {
        const c = device(db); c.store.applyRemoteExamHistory([legacy]);
        c.store.importAll(clone(a.store.exportAll())); c.store.importAll(clone(a.store.exportAll()));
        const items = c.store.getExamHistory().filter(x => x.id === exam.id);
        assert.equal(items.length, 1); assert.equal(items[0].freshTotal, 40);
        assert.equal(c.store.getExamHistory().find(x => x.id === 'legacy-fill')!.realConditions, false);
    });
    await check('Both migrations are repeatable and preserve stored results', async () => {
        await db.exec(initialMigration); await db.exec(safeMigration);
        assert.equal((await db.query<{ fresh_correct: number }>('select fresh_correct from exam_history where id=$1', [exam.id])).rows[0].fresh_correct, 31);
    });
    const unprotected = await database(false);
    try {
        await check('Missing safety migration blocks all client uploads and health-check success', async () => {
            const c = device(unprotected); c.store.applyRemoteExamHistory([exam]);
            c.store.markSeen(['local-only']);
            assert.equal((await c.store.fullSync()).state, 'error');
            assert.equal((await c.store.checkRemote()).state, 'error');
            assert.equal((await c.store.syncUpExamHistory(c.store.getExamHistory())).state, 'error');
            assert.equal((await c.store.syncUpExposure()).state, 'error');
            assert.equal(c.controls.writes, 0); assert.ok(c.store.getSeen()['local-only']);
        });
    } finally { await unprotected.close(); }

    // Signed out, every path must stop before touching the server and say why, because the
    // tables give the anonymous role nothing and a refusal would otherwise look like a bug.
    const guarded = await database();
    try {
        const c = device(guarded);
        c.controls.signedOut = true;
        await check('Without a session, sync reports disabled and writes nothing', async () => {
            c.store.markSeen(['local-only']);
            const result = await c.store.fullSync();
            assert.equal(result.state, 'disabled');
            assert.match(result.message, /Sign in/i);
            assert.equal(c.controls.writes, 0);
            assert.ok(c.store.getSeen()['local-only']);
        });
    } finally { await guarded.close(); }

    console.log(`\n${passed} store/PostgreSQL integration checks passed. Live Supabase and physical-device checks remain separate.`);
} finally { await db.close(); }
