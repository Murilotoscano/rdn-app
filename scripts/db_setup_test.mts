/**
 * Applies the four migration FILES in order to two databases and checks the access rules:
 *   A. an empty project, the "new Supabase project" case;
 *   B. a project that already holds rows written before sign-in existed, migrated with no
 *      user session and no account yet, the "recover the old project" case.
 * Run: npm run test:db
 *
 * PostgreSQL runs for real (PGlite). What is simulated is the Supabase wrapper around it:
 * an `auth` schema with a `uid()` that reads the JWT claim, plus the `anon` and
 * `authenticated` roles that Supabase creates for every project. That is enough to prove
 * the policies behave as written, and not enough to prove anything about the live project's
 * network, PostgREST settings or key configuration.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const root = new URL('../', import.meta.url);
const migrationsDir = new URL('supabase/migrations/', root);
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
const sqlOf = (file: string) => readFileSync(new URL(file, migrationsDir), 'utf8');

let failures = 0;
const check = (name: string, ok: boolean, detail = '') => {
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' - ' + detail : ''}`);
    if (!ok) failures++;
};

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';

/** A database with only the parts of a Supabase project that exist before any migration. */
async function freshProject() {
    const db = new PGlite();
    await db.exec(`
        create schema if not exists auth;
        create table auth.users (id uuid primary key, email text);
        create function auth.uid() returns uuid language sql stable as $$
            select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
        $$;
        create role anon;
        create role authenticated;
    `);
    return db;
}

const signInAs = (db: PGlite, id: string | null) => db.exec(
    `select set_config('request.jwt.claim.sub', '${id ?? ''}', false)`);

const one = async <T = Record<string, unknown>,>(db: PGlite, sql: string) =>
    (await db.query<T>(sql)).rows[0];

check('Four migration files found, applied in filename order', files.length === 4, files.join(' -> '));

// ---------------------------------------------------------------------------
// A. Empty project
// ---------------------------------------------------------------------------
console.log('\nA. Empty project');
const db = await freshProject();
await db.exec(`insert into auth.users (id, email) values ('${OWNER}', 'owner@example.com')`);
await signInAs(db, OWNER);

for (const file of files) {
    try {
        await db.exec(sqlOf(file));
        check(`Applies on an empty database: ${file}`, true);
    } catch (error) {
        check(`Applies on an empty database: ${file}`, false, String(error));
    }
}

// Re-running everything must be safe: a half-finished run has to be repeatable.
try {
    for (const file of files) await db.exec(sqlOf(file));
    check('All four migrations are repeatable', true);
} catch (error) {
    check('All four migrations are repeatable', false, String(error));
}

const protocol = await one<{ version: number }>(db, 'select public.rdn_sync_protocol() as version');
check('rdn_sync_protocol() returns 1 once the guards are installed', protocol.version === 1);

const tables = ['error_log', 'exam_history', 'question_exposure'];
for (const table of tables) {
    const rls = await one<{ relrowsecurity: boolean }>(db,
        `select relrowsecurity from pg_class where oid = 'public.${table}'::regclass`);
    const policies = await one<{ count: number }>(db,
        `select count(*)::int as count from pg_policies where tablename = '${table}'`);
    const anonGrants = await one<{ count: number }>(db,
        `select count(*)::int as count from information_schema.role_table_grants
         where table_name = '${table}' and grantee = 'anon'`);
    check(`${table}: row level security on, owner policies present, anon has no grant`,
        rls.relrowsecurity && policies.count === 4 && anonGrants.count === 0,
        `rls=${rls.relrowsecurity} policies=${policies.count} anonGrants=${anonGrants.count}`);
}

// The owner writes, reads back, and sees their own row.
await db.exec(`set role authenticated`);
await db.exec(`insert into public.exam_history (id, date, score, total_questions, domain_scores,
    time_spent_seconds, mode, real_conditions, inconclusive, fresh_total, fresh_correct)
    values ('mock-db-1', now()::text, 96, 130, '{}'::jsonb, 10500, 'mock', true, false, 40, 31)`);
const ownerRows = await db.query<{ id: string; user_id: string }>('select id, user_id from public.exam_history');
check('Signed-in owner can write and read their own exam', ownerRows.rows.length === 1 &&
    ownerRows.rows[0].user_id === OWNER);

// A row with no owner cannot be written through the API even by a signed-in user: the
// column is nullable so recovery can store one, the policy is what refuses it.
let unownedRefused = false;
try {
    await db.exec(`insert into public.exam_history (id, date, score, total_questions, domain_scores,
        time_spent_seconds, mode, user_id)
        values ('mock-db-2', now()::text, 1, 1, '{}'::jsonb, 1, 'mock', null)`);
} catch { unownedRefused = true; }
check('An insert with no owner is refused by the insert policy', unownedRefused);

// A different signed-in user sees nothing and cannot touch the row.
await db.exec(`reset role`);
await signInAs(db, OTHER);
await db.exec(`set role authenticated`);
const otherRows = await db.query('select id from public.exam_history');
check('Another signed-in user sees none of the owner\'s rows', otherRows.rows.length === 0);
const updated = await db.query(`update public.exam_history set score = 0 where id = 'mock-db-1' returning id`);
check('Another signed-in user cannot modify the owner\'s row', updated.rows.length === 0);

// The anonymous role, which is what the published anon key grants, is refused outright.
await db.exec(`reset role`);
await db.exec(`set role anon`);
let anonBlocked = false;
try { await db.query('select id from public.exam_history'); }
catch { anonBlocked = true; }
check('The anonymous role cannot read the tables at all', anonBlocked);
await db.exec(`reset role`);

// The owner's data survived every check above.
await signInAs(db, OWNER);
await db.exec(`set role authenticated`);
const final = await one<{ score: number; fresh_correct: number }>(db,
    `select score, fresh_correct from public.exam_history where id = 'mock-db-1'`);
check('Owner data is unchanged after the other-user attempts', final.score === 96 && final.fresh_correct === 31);
await db.exec(`reset role`);

// ---------------------------------------------------------------------------
// B. Existing project with saved progress, migrated with no session and no account
// ---------------------------------------------------------------------------
console.log('\nB. Existing project with saved progress, no session, no account yet');
const old = await freshProject();
for (const file of files.slice(0, 3)) await old.exec(sqlOf(file));

// What the app saved before any of this existed. Written with no JWT, as a restored
// project's rows are: auth.uid() is null here, exactly as in the SQL editor.
await old.exec(`
    insert into public.exam_history (id, date, score, total_questions, domain_scores,
        time_spent_seconds, mode, real_conditions, inconclusive, fresh_total, fresh_correct)
        values ('old-mock-1', '2026-08-01', 101, 145, '{"1":20}'::jsonb, 10200, 'mock', true, false, 60, 41);
    insert into public.error_log (question_id, domain, wrong_count, unsure_count, confident_count,
        attempts, last_attempt_at, date_logged_at, repetition_stage)
        values ('m2-mnt-120', '2', 3, 1, 0, 4, 1756000000000, 1755000000000, 2);
    insert into public.question_exposure (question_id, seen_at, exposed_at)
        values ('m1-rc-023', 1756000000000, 1756000000000);
`);
const before = await one<{ updated_at: string }>(old,
    `select updated_at::text from public.question_exposure where question_id = 'm1-rc-023'`);

const users = await one<{ count: number }>(old, 'select count(*)::int as count from auth.users');
check('Starting point: rows present, no account, no session',
    users.count === 0 &&
    (await one<{ c: number }>(old, 'select count(*)::int as c from public.exam_history')).c === 1);

try {
    await old.exec(sqlOf(files[3]));
    check('Migration 4 applies to a populated database with no session', true);
} catch (error) {
    check('Migration 4 applies to a populated database with no session', false, String(error));
}

const kept = await one<{ score: number; wrong: number; seen: string; owner: string | null }>(old, `
    select (select score from public.exam_history where id = 'old-mock-1') as score,
           (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong,
           (select seen_at::text from public.question_exposure where question_id = 'm1-rc-023') as seen,
           (select user_id::text from public.exam_history where id = 'old-mock-1') as owner`);
check('Saved progress is still there, waiting for an owner',
    kept.score === 101 && kept.wrong === 3 && kept.seen === '1756000000000' && kept.owner === null);

const protocolB = await one<{ version: number }>(old, 'select public.rdn_sync_protocol() as version');
check('The merge guards are installed and enabled after migration 4', protocolB.version === 1);

// Before anything is claimed, the rows are invisible through the API.
await signInAs(old, OTHER);
await old.exec(`set role authenticated`);
const orphanVisible = await old.query('select id from public.exam_history');
check('Unowned rows are not readable by a signed-in stranger', orphanVisible.rows.length === 0);

// The anonymous role cannot claim them either: the function is not executable by PUBLIC.
await old.exec(`reset role`);
await old.exec(`set role anon`);
let anonCannotClaim = false;
try { await old.query(`select public.rdn_assign_orphan_rows('${OWNER}')`); }
catch { anonCannotClaim = true; }
check('The anonymous role cannot run the assignment function', anonCannotClaim);
await old.exec(`reset role`);

// No account yet, and two accounts later: refuse rather than guess whose history it is.
let noAccountRefused = false;
try { await old.query('select public.rdn_assign_orphan_rows()'); }
catch { noAccountRefused = true; }
check('With no account at all, assignment refuses instead of dropping the rows', noAccountRefused);

await old.exec(`insert into auth.users (id, email) values
    ('${OWNER}', 'owner@example.com'), ('${OTHER}', 'someone@example.com')`);
let ambiguousRefused = false;
try { await old.query('select public.rdn_assign_orphan_rows()'); }
catch { ambiguousRefused = true; }
check('With more than one account, assignment refuses to guess an owner', ambiguousRefused);

// The study account is the only one, which is the documented setup.
await old.exec(`delete from auth.users where id = '${OTHER}'`);
const assigned = await one<{ n: number }>(old, 'select public.rdn_assign_orphan_rows() as n');
check('Assignment claims every unowned row, past the merge guards', assigned.n === 3, `rows=${assigned.n}`);

const after = await one<{ score: number; wrong: number; attempts: number; stage: number; updated_at: string; owners: number }>(old, `
    select (select score from public.exam_history where id = 'old-mock-1') as score,
           (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong,
           (select attempts from public.error_log where question_id = 'm2-mnt-120') as attempts,
           (select repetition_stage from public.error_log where question_id = 'm2-mnt-120') as stage,
           (select updated_at::text from public.question_exposure where question_id = 'm1-rc-023') as updated_at,
           (select count(*)::int from (
               select user_id from public.exam_history
               union all select user_id from public.error_log
               union all select user_id from public.question_exposure) o
            where o.user_id = '${OWNER}') as owners`);
check('All three tables now belong to the account', after.owners === 3);
check('Assignment changed ownership only, not the saved values',
    after.score === 101 && after.wrong === 3 && after.attempts === 4 && after.stage === 2 &&
    after.updated_at === before.updated_at,
    `score=${after.score} wrong=${after.wrong} attempts=${after.attempts} updated_at unchanged=${after.updated_at === before.updated_at}`);

const again = await one<{ n: number }>(old, 'select public.rdn_assign_orphan_rows() as n');
check('Running the assignment again claims nothing', again.n === 0);

const protocolC = await one<{ version: number }>(old, 'select public.rdn_sync_protocol() as version');
check('The guards are back on after the assignment', protocolC.version === 1);

// The recovered history is what the app reads on the next sign-in.
await signInAs(old, OWNER);
await old.exec(`set role authenticated`);
const recovered = await one<{ exams: number; errors: number; exposure: number }>(old, `
    select (select count(*)::int from public.exam_history) as exams,
           (select count(*)::int from public.error_log) as errors,
           (select count(*)::int from public.question_exposure) as exposure`);
check('The owner reads the recovered history through row level security',
    recovered.exams === 1 && recovered.errors === 1 && recovered.exposure === 1);

// Anon is still shut out on the recovered project too.
await old.exec(`reset role`);
await old.exec(`set role anon`);
let anonBlockedB = false;
try { await old.query('select id from public.exam_history'); }
catch { anonBlockedB = true; }
check('The anonymous role cannot read the recovered project either', anonBlockedB);
await old.exec(`reset role`);

// ---------------------------------------------------------------------------
// C. The documented order: the account exists before the migrations run
// ---------------------------------------------------------------------------
console.log('\nC. Existing project with saved progress, account created first');
const doc = await freshProject();
for (const file of files.slice(0, 3)) await doc.exec(sqlOf(file));
await doc.exec(`
    insert into public.exam_history (id, date, score, total_questions, domain_scores,
        time_spent_seconds, mode) values ('old-mock-2', '2026-08-02', 99, 145, '{}'::jsonb, 10100, 'mock');
    insert into public.error_log (question_id, wrong_count, attempts, last_attempt_at)
        values ('m3-fsl-009', 2, 2, 1756100000000);
    insert into public.question_exposure (question_id, seen_at, exposed_at)
        values ('m2-gf-first-02', 1756100000000, 1756100000000);
    insert into auth.users (id, email) values ('${OWNER}', 'owner@example.com');
`);
// The SQL editor has no session even when the account exists: auth.uid() stays null.
try {
    await doc.exec(sqlOf(files[3]));
    check('Migration 4 applies with rows present and the account already created', true);
} catch (error) {
    check('Migration 4 applies with rows present and the account already created', false, String(error));
}
const autoOwned = await one<{ owned: number; score: number; wrong: number }>(doc, `
    select (select count(*)::int from (
               select user_id from public.exam_history
               union all select user_id from public.error_log
               union all select user_id from public.question_exposure) o
            where o.user_id = '${OWNER}') as owned,
           (select score from public.exam_history where id = 'old-mock-2') as score,
           (select wrong_count from public.error_log where question_id = 'm3-fsl-009') as wrong`);
check('Migration 4 attributes the existing history with no manual step',
    autoOwned.owned === 3 && autoOwned.score === 99 && autoOwned.wrong === 2,
    `owned=${autoOwned.owned} score=${autoOwned.score} wrong=${autoOwned.wrong}`);
await signInAs(doc, OWNER);
await doc.exec(`set role authenticated`);
const readBack = await one<{ c: number }>(doc, `select count(*)::int as c from public.exam_history`);
check('The owner signs in and finds that history', readBack.c === 1);
await doc.exec(`reset role`);

console.log(failures === 0
    ? `\nSetup verified on an empty project and on two populated ones: ${files.length} migrations, access rules, owner isolation and recovery of pre-existing history.`
    : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
