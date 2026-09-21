/**
 * Empty-project rehearsal: applies the four migration FILES in order to a database that
 * starts with nothing, then checks the access rules they install.
 * Run: npm run test:db
 *
 * PostgreSQL runs for real (PGlite). What is simulated is the Supabase wrapper around it:
 * an `auth` schema with a `uid()` that reads the JWT claim, plus the `anon` and
 * `authenticated` roles that Supabase creates for every project. That is enough to prove
 * the policies behave as written, and not enough to prove anything about the live project's
 * network, PostgREST settings or key configuration.
 */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const root = new URL('../', import.meta.url);
const migrationsDir = new URL('supabase/migrations/', root);
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

let failures = 0;
const check = (name: string, ok: boolean, detail = '') => {
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' - ' + detail : ''}`);
    if (!ok) failures++;
};

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';

const db = new PGlite();

// The parts of a Supabase project that exist before any migration runs.
await db.exec(`
    create schema if not exists auth;
    create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    create role anon;
    create role authenticated;
    insert into auth.users (id, email) values ('${OWNER}', 'owner@example.com');
    select set_config('request.jwt.claim.sub', '${OWNER}', false);
`);

check('Four migration files found, applied in filename order', files.length === 4, files.join(' -> '));

for (const file of files) {
    const sql = readFileSync(new URL(file, migrationsDir), 'utf8');
    try {
        await db.exec(sql);
        check(`Applies on an empty database: ${file}`, true);
    } catch (error) {
        check(`Applies on an empty database: ${file}`, false, String(error));
    }
}

// Re-running everything must be safe: a half-finished run has to be repeatable.
try {
    for (const file of files) await db.exec(readFileSync(new URL(file, migrationsDir), 'utf8'));
    check('All four migrations are repeatable', true);
} catch (error) {
    check('All four migrations are repeatable', false, String(error));
}

const one = async <T = Record<string, unknown>,>(sql: string) => (await db.query<T>(sql)).rows[0];

const protocol = await one<{ version: number }>('select public.rdn_sync_protocol() as version');
check('rdn_sync_protocol() returns 1 once the guards are installed', protocol.version === 1);

const tables = ['error_log', 'exam_history', 'question_exposure'];
for (const table of tables) {
    const rls = await one<{ relrowsecurity: boolean }>(
        `select relrowsecurity from pg_class where oid = 'public.${table}'::regclass`);
    const policies = await one<{ count: number }>(
        `select count(*)::int as count from pg_policies where tablename = '${table}'`);
    const anonGrants = await one<{ count: number }>(
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

// A different signed-in user sees nothing and cannot touch the row.
await db.exec(`reset role`);
await db.exec(`select set_config('request.jwt.claim.sub', '${OTHER}', false)`);
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
await db.exec(`select set_config('request.jwt.claim.sub', '${OWNER}', false)`);
await db.exec(`set role authenticated`);
const final = await one<{ score: number; fresh_correct: number }>(
    `select score, fresh_correct from public.exam_history where id = 'mock-db-1'`);
check('Owner data is unchanged after the other-user attempts', final.score === 96 && final.fresh_correct === 31);
await db.exec(`reset role`);

console.log(failures === 0
    ? `\nEmpty-database setup verified: ${files.length} migrations, access rules and owner isolation.`
    : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
