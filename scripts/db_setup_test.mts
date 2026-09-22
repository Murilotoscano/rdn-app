/**
 * Applies the four migration FILES in order and checks the access rules they install,
 * across every setup order the rollout can actually meet:
 *   A. empty project, account created first;
 *   B. populated project migrated with no account and no session, claimed afterwards;
 *   C. populated project with the account already created, attributed automatically;
 *   D. populated project with two accounts: nothing may be attributed;
 *   E. partially attributed project: only the unowned rows may change;
 *   F. a signed-in user trying to create or capture unowned rows;
 *   G. a project restored with leftover permissive policies from an earlier, unrelated
 *      setup ("Acesso Público", "Allow all for anon", both USING(true)) - proves they are
 *      all removed, not merely the ones this project's own migrations created, and that two
 *      real signed-in users are fully isolated from each other across all three tables;
 *   H. the rollout halted right after 20260920, before question_exposure has an owner or a
 *      policy - proves row level security with zero policies denies anon and authenticated
 *      by default, so there is no anonymous-access window in that gap.
 * It also runs the read-only diagnostics and proves they change nothing.
 * Run: npm run test:db
 *
 * PostgreSQL runs for real (PGlite). What is simulated is the Supabase wrapper around it:
 * an `auth` schema with a `uid()` that reads the JWT claim, the `anon`, `authenticated` and
 * `service_role` roles, and - this part matters for the grant checks - Supabase's default
 * privileges, which grant every newly created function and table in `public` to those roles.
 * Without that line the grant tests pass on an environment stricter than the real project.
 * This is still not proof about the live project's network, PostgREST settings or keys.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const root = new URL('../', import.meta.url);
const migrationsDir = new URL('supabase/migrations/', root);
const diagnosticsDir = new URL('supabase/diagnostics/', root);
const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
const sqlOf = (file: string) => readFileSync(new URL(file, migrationsDir), 'utf8');
const diagnostic = (file: string) => readFileSync(new URL(file, diagnosticsDir), 'utf8');

let failures = 0;
const check = (name: string, ok: boolean, detail = '') => {
    console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' - ' + detail : ''}`);
    if (!ok) failures++;
};

const OWNER = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const TABLES = ['error_log', 'exam_history', 'question_exposure'] as const;

/** A database holding only what a Supabase project has before any migration runs. */
async function freshProject() {
    const db = new PGlite();
    await db.exec(`
        create schema if not exists auth;
        create table auth.users (id uuid primary key, email text, created_at timestamptz default now(),
            last_sign_in_at timestamptz);
        create function auth.uid() returns uuid language sql stable as $$
            select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
        $$;
        create role anon;
        create role authenticated;
        create role service_role;
        grant usage on schema public to anon, authenticated, service_role;
        -- Supabase grants usage on the auth schema to the API roles, but not select on
        -- auth.users. Both halves are reproduced so nothing passes for the wrong reason.
        grant usage on schema auth to anon, authenticated, service_role;
        grant execute on function auth.uid() to anon, authenticated, service_role;
        -- The line that makes every new function and table in public reachable by the API
        -- roles unless a migration revokes it explicitly.
        alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
        alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    `);
    return db;
}

/**
 * Mirrors what the pre-flight actually found on the restored project (jowjukppxkhjuijjjiwq):
 * error_log and exam_history exist, hold no rows, have row level security enabled, and carry
 * two permissive policies from an earlier, unrelated setup - not created by anything in
 * supabase/migrations - both named for a "for all" audience: "Acesso Público" and "Allow all
 * for anon", both `for all to public using (true) with check (true)`. question_exposure does
 * not exist yet. No account exists, no migration has been recorded, no rdn_* function exists.
 * Since PostgreSQL OR's every permissive policy on a table together, either name alone grants
 * every role full access to every row regardless of anything migration 4 adds afterwards -
 * this is the exact condition that made the fix in this commit necessary.
 */
async function legacyRestoredProject() {
    const legacyDb = await freshProject();
    await legacyDb.exec(`
        create table public.error_log (
            question_id      text primary key,
            domain           text,
            topic            text,
            mastered         boolean,
            repetition_stage integer,
            date_logged_at   bigint,
            next_review_at   bigint,
            last_attempt_at  bigint,
            answer_status    text,
            last_outcome     text,
            attempts         integer,
            wrong_count      integer,
            unsure_count     integer,
            confident_count  integer,
            error_reason     text,
            notes            text
        );
        create table public.exam_history (
            id                 text primary key,
            date               text,
            score              integer,
            total_questions    integer,
            domain_scores      jsonb,
            time_spent_seconds integer,
            mode               text
        );
        alter table public.error_log    enable row level security;
        alter table public.exam_history enable row level security;
        create policy "Acesso Público"     on public.error_log    for all to public using (true) with check (true);
        create policy "Allow all for anon" on public.error_log    for all to public using (true) with check (true);
        create policy "Acesso Público"     on public.exam_history for all to public using (true) with check (true);
        create policy "Allow all for anon" on public.exam_history for all to public using (true) with check (true);
    `);
    return legacyDb;
}

const signInAs = (db: PGlite, id: string | null) => db.exec(
    `select set_config('request.jwt.claim.sub', '${id ?? ''}', false)`);

const one = async <T = Record<string, unknown>,>(db: PGlite, sql: string) =>
    (await db.query<T>(sql)).rows[0];

/** Runs a statement as a role and reports whether PostgreSQL refused it. */
async function refused(db: PGlite, role: string, sql: string) {
    await db.exec('reset role');
    await db.exec(`set role ${role}`);
    let message = '';
    try { await db.query(sql); } catch (error) { message = String(error).split('\n')[0]; }
    await db.exec('reset role');
    return { refused: message !== '', message };
}

const legacyRows = (suffix: string) => `
    insert into public.exam_history (id, date, score, total_questions, domain_scores,
        time_spent_seconds, mode, real_conditions, inconclusive, fresh_total, fresh_correct)
        values ('old-mock-${suffix}', '2026-08-01', 101, 145, '{"1":20}'::jsonb, 10200, 'mock', true, false, 60, 41);
    insert into public.error_log (question_id, domain, wrong_count, unsure_count, confident_count,
        attempts, last_attempt_at, date_logged_at, repetition_stage)
        values ('m2-mnt-120', '2', 3, 1, 0, 4, 1756000000000, 1755000000000, 2);
    insert into public.question_exposure (question_id, seen_at, exposed_at)
        values ('m1-rc-023', 1756000000000, 1756000000000);
`;

const ownedCount = async (db: PGlite, id: string) => (await one<{ n: number }>(db, `
    select count(*)::int as n from (
        select user_id from public.error_log
        union all select user_id from public.exam_history
        union all select user_id from public.question_exposure) o
    where o.user_id = '${id}'`)).n;

const orphanCount = async (db: PGlite) => (await one<{ n: number }>(db, `
    select count(*)::int as n from (
        select user_id from public.error_log
        union all select user_id from public.exam_history
        union all select user_id from public.question_exposure) o
    where o.user_id is null`)).n;

check('Four migration files found, applied in filename order', files.length === 4, files.join(' -> '));

// ---------------------------------------------------------------------------
// A. Empty project, account created first
// ---------------------------------------------------------------------------
console.log('\nA. Empty project, account created first');
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

for (const table of TABLES) {
    const rls = await one<{ relrowsecurity: boolean }>(db,
        `select relrowsecurity from pg_class where oid = 'public.${table}'::regclass`);
    const policies = await one<{ count: number }>(db,
        `select count(*)::int as count from pg_policies where tablename = '${table}'`);
    const anonGrants = await one<{ count: number }>(db,
        `select count(*)::int as count from information_schema.role_table_grants
         where table_name = '${table}' and grantee in ('anon', 'PUBLIC')`);
    const authGrants = await one<{ count: number }>(db,
        `select count(*)::int as count from information_schema.role_table_grants
         where table_name = '${table}' and grantee = 'authenticated'`);
    check(`${table}: row level security on, owner policies present, no anon or PUBLIC grant`,
        rls.relrowsecurity && policies.count === 4 && anonGrants.count === 0,
        `rls=${rls.relrowsecurity} policies=${policies.count} anonGrants=${anonGrants.count}`);
    // Exactly the four CRUD grants - not the wider set (including TRUNCATE, which row level
    // security does not restrict) that Supabase's default privileges attach to every table
    // authenticated gets access to at creation time.
    check(`${table}: authenticated has exactly select/insert/update/delete, nothing wider`,
        authGrants.count === 4, `authenticatedGrants=${authGrants.count}`);
}

// --- Function grants. The administrative function must not be reachable over the API. ---
for (const role of ['anon', 'authenticated', 'service_role', 'public']) {
    const granted = await one<{ ok: boolean }>(db,
        `select has_function_privilege('${role}', 'public.rdn_assign_orphan_rows(uuid)', 'execute') as ok`);
    check(`rdn_assign_orphan_rows is not executable by ${role}`, granted.ok === false);
}
const protocolGrant = await one<{ ok: boolean }>(db,
    `select has_function_privilege('authenticated', 'public.rdn_sync_protocol()', 'execute') as ok`);
check('rdn_sync_protocol stays executable by authenticated, which the app needs', protocolGrant.ok === true);

for (const role of ['anon', 'authenticated']) {
    const attempt = await refused(db, role, `select public.rdn_assign_orphan_rows('${OWNER}')`);
    check(`${role} calling rdn_assign_orphan_rows is refused on the function itself`,
        attempt.refused && /permission denied for function/i.test(attempt.message),
        attempt.message.slice(0, 90));
}

const admin = await one<{ mode: string; settings: string | null }>(db, `
    select case when prosecdef then 'DEFINER' else 'INVOKER' end as mode,
           array_to_string(proconfig, ',') as settings
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rdn_assign_orphan_rows'`);
check('rdn_assign_orphan_rows runs as the caller, with a pinned search_path',
    admin.mode === 'INVOKER' && /^search_path=("")?$/.test(admin.settings ?? ''),
    `${admin.mode} ${admin.settings}`);

// --- The owner writes, reads back, and sees their own row. ---
await db.exec(`set role authenticated`);
await db.exec(`insert into public.exam_history (id, date, score, total_questions, domain_scores,
    time_spent_seconds, mode, real_conditions, inconclusive, fresh_total, fresh_correct)
    values ('mock-db-1', now()::text, 96, 130, '{}'::jsonb, 10500, 'mock', true, false, 40, 31)`);
const ownerRows = await db.query<{ id: string; user_id: string }>('select id, user_id from public.exam_history');
check('Signed-in owner can write and read their own exam', ownerRows.rows.length === 1 &&
    ownerRows.rows[0].user_id === OWNER);
await db.exec(`reset role`);

// --- The nullable column must not let the client create new unowned rows. ---
const apiInserts: [string, string][] = [
    ['exam_history', `insert into public.exam_history (id, date, score, total_questions, domain_scores,
        time_spent_seconds, mode, user_id) values ('x1', 'd', 1, 1, '{}'::jsonb, 1, 'mock', null)`],
    ['error_log', `insert into public.error_log (question_id, wrong_count, attempts, user_id)
        values ('x1', 1, 1, null)`],
    ['question_exposure', `insert into public.question_exposure (question_id, seen_at, exposed_at, user_id)
        values ('x1', 1, 1, null)`],
];
for (const [table, sql] of apiInserts) {
    const attempt = await refused(db, 'authenticated', sql);
    check(`${table}: an insert with user_id null is refused through the API`, attempt.refused,
        attempt.message.slice(0, 70));
}
for (const [table, sql] of apiInserts) {
    const attempt = await refused(db, 'authenticated', sql.replace('null)', `'${OTHER}')`));
    check(`${table}: an insert under another user's id is refused`, attempt.refused,
        attempt.message.slice(0, 70));
}

// Updating an owned row to no owner, or to someone else. The exam_history and error_log
// merge guards answer an update by returning the stored row, so those attempts are
// neutralised before the policy is reached; question_exposure reaches the policy and is
// rejected. Either way the check that matters is that ownership did not move.
await signInAs(db, OWNER);
const transfers: [string, string][] = [
    ['exam_history', `update public.exam_history set user_id = %V where id = 'mock-db-1'`],
    ['error_log', `update public.error_log set user_id = %V, last_attempt_at = 9999999999999 where question_id = 'seed-1'`],
    ['question_exposure', `update public.question_exposure set user_id = %V where question_id = 'seed-1'`],
];
await db.exec(`insert into public.error_log (question_id, wrong_count, attempts, last_attempt_at, user_id)
    values ('seed-1', 1, 1, 1000, '${OWNER}')`);
await db.exec(`insert into public.question_exposure (question_id, seen_at, exposed_at, user_id)
    values ('seed-1', 1000, 1000, '${OWNER}')`);
for (const [table, template] of transfers) {
    await refused(db, 'authenticated', template.replace('%V', 'null'));
    await refused(db, 'authenticated', template.replace('%V', `'${OTHER}'`));
    const stillMine = await one<{ n: number }>(db,
        `select count(*)::int as n from public.${table} where user_id = '${OWNER}'`);
    const moved = await one<{ n: number }>(db,
        `select count(*)::int as n from public.${table} where user_id is null or user_id = '${OTHER}'`);
    check(`${table}: a row cannot be un-owned or handed to another user through the API`,
        stillMine.n > 0 && moved.n === 0, `mine=${stillMine.n} moved=${moved.n}`);
}

// --- A different signed-in user sees nothing and cannot touch the row. ---
await signInAs(db, OTHER);
await db.exec(`set role authenticated`);
const otherRows = await db.query('select id from public.exam_history');
check('Another signed-in user sees none of the owner\'s rows', otherRows.rows.length === 0);
const updated = await db.query(`update public.exam_history set score = 0 where id = 'mock-db-1' returning id`);
check('Another signed-in user cannot modify the owner\'s row', updated.rows.length === 0);
await db.exec(`reset role`);

const anonRead = await refused(db, 'anon', 'select id from public.exam_history');
check('The anonymous role cannot read the tables at all', anonRead.refused);

await signInAs(db, OWNER);
await db.exec(`set role authenticated`);
const final = await one<{ score: number; fresh_correct: number }>(db,
    `select score, fresh_correct from public.exam_history where id = 'mock-db-1'`);
check('Owner data is unchanged after every attempt above', final.score === 96 && final.fresh_correct === 31);
await db.exec(`reset role`);

// ---------------------------------------------------------------------------
// B. Populated project, no account and no session during the migration
// ---------------------------------------------------------------------------
console.log('\nB. Populated project, migrated before the account exists');
const old = await freshProject();
for (const file of files.slice(0, 3)) await old.exec(sqlOf(file));
await old.exec(legacyRows('1'));
const before = await one<{ updated_at: string }>(old,
    `select updated_at::text from public.question_exposure where question_id = 'm1-rc-023'`);

check('Starting point: rows present, no account, no session',
    (await one<{ c: number }>(old, 'select count(*)::int as c from auth.users')).c === 0 &&
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
check('The merge guards are installed and enabled after migration 4',
    (await one<{ v: number }>(old, 'select public.rdn_sync_protocol() as v')).v === 1);

await signInAs(old, OTHER);
await old.exec(`set role authenticated`);
check('Unowned rows are not readable by a signed-in stranger',
    (await old.query('select id from public.exam_history')).rows.length === 0);
await old.exec(`reset role`);

const anonClaim = await refused(old, 'anon', `select public.rdn_assign_orphan_rows('${OWNER}')`);
check('The anonymous role cannot run the assignment function', anonClaim.refused);

let noAccountRefused = false;
try { await old.query('select public.rdn_assign_orphan_rows()'); } catch { noAccountRefused = true; }
check('With no account at all, assignment refuses instead of dropping the rows', noAccountRefused);

await old.exec(`insert into auth.users (id, email) values ('${OWNER}', 'owner@example.com')`);
const assigned = await one<{ n: number }>(old, 'select public.rdn_assign_orphan_rows() as n');
check('Assignment claims every unowned row, past the merge guards', assigned.n === 3, `rows=${assigned.n}`);

const after = await one<{ score: number; wrong: number; attempts: number; stage: number; updated_at: string }>(old, `
    select (select score from public.exam_history where id = 'old-mock-1') as score,
           (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong,
           (select attempts from public.error_log where question_id = 'm2-mnt-120') as attempts,
           (select repetition_stage from public.error_log where question_id = 'm2-mnt-120') as stage,
           (select updated_at::text from public.question_exposure where question_id = 'm1-rc-023') as updated_at`);
check('All three tables now belong to the account', await ownedCount(old, OWNER) === 3);
check('Assignment changed ownership only, not the saved values',
    after.score === 101 && after.wrong === 3 && after.attempts === 4 && after.stage === 2 &&
    after.updated_at === before.updated_at,
    `score=${after.score} wrong=${after.wrong} attempts=${after.attempts} updated_at unchanged=${after.updated_at === before.updated_at}`);
check('Running the assignment again claims nothing',
    (await one<{ n: number }>(old, 'select public.rdn_assign_orphan_rows() as n')).n === 0);
check('The guards are back on after the assignment',
    (await one<{ v: number }>(old, 'select public.rdn_sync_protocol() as v')).v === 1);

await signInAs(old, OWNER);
await old.exec(`set role authenticated`);
const recovered = await one<{ exams: number; errors: number; exposure: number }>(old, `
    select (select count(*)::int from public.exam_history) as exams,
           (select count(*)::int from public.error_log) as errors,
           (select count(*)::int from public.question_exposure) as exposure`);
check('The owner reads the recovered history through row level security',
    recovered.exams === 1 && recovered.errors === 1 && recovered.exposure === 1);
await old.exec(`reset role`);
check('The anonymous role cannot read the recovered project either',
    (await refused(old, 'anon', 'select id from public.exam_history')).refused);

// ---------------------------------------------------------------------------
// C. Populated project, account created before the migrations (documented order)
// ---------------------------------------------------------------------------
console.log('\nC. Populated project, account created first');
const doc = await freshProject();
for (const file of files.slice(0, 3)) await doc.exec(sqlOf(file));
await doc.exec(legacyRows('2'));
await doc.exec(`insert into auth.users (id, email) values ('${OWNER}', 'owner@example.com')`);
try {
    await doc.exec(sqlOf(files[3]));
    check('Migration 4 applies with rows present and the account already created', true);
} catch (error) {
    check('Migration 4 applies with rows present and the account already created', false, String(error));
}
const autoValues = await one<{ score: number; wrong: number }>(doc, `
    select (select score from public.exam_history where id = 'old-mock-2') as score,
           (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong`);
check('Migration 4 attributes the existing history with no manual step',
    await ownedCount(doc, OWNER) === 3 && autoValues.score === 101 && autoValues.wrong === 3,
    `owned=${await ownedCount(doc, OWNER)} score=${autoValues.score} wrong=${autoValues.wrong}`);
await signInAs(doc, OWNER);
await doc.exec(`set role authenticated`);
check('The owner signs in and finds that history',
    (await one<{ c: number }>(doc, `select count(*)::int as c from public.exam_history`)).c === 1);
await doc.exec(`reset role`);

// ---------------------------------------------------------------------------
// D. Populated project with two accounts: nothing may be attributed
// ---------------------------------------------------------------------------
console.log('\nD. Populated project with two accounts');
const two = await freshProject();
for (const file of files.slice(0, 3)) await two.exec(sqlOf(file));
await two.exec(legacyRows('3'));
await two.exec(`insert into auth.users (id, email) values
    ('${OWNER}', 'owner@example.com'), ('${OTHER}', 'someone@example.com')`);
try {
    await two.exec(sqlOf(files[3]));
    check('Migration 4 applies with two accounts present', true);
} catch (error) {
    check('Migration 4 applies with two accounts present', false, String(error));
}
check('With two accounts, migration 4 attributes nothing at all',
    await orphanCount(two) === 3 && await ownedCount(two, OWNER) === 0 && await ownedCount(two, OTHER) === 0,
    `orphans=${await orphanCount(two)}`);
let ambiguous = { refused: false, message: '' };
try { await two.query('select public.rdn_assign_orphan_rows()'); }
catch (error) { ambiguous = { refused: true, message: String(error).split('\n')[0] }; }
check('Calling assignment with two accounts refuses, and says why',
    ambiguous.refused && /has 2 users/.test(ambiguous.message), ambiguous.message.slice(0, 110));
const intactD = await one<{ score: number; wrong: number; seen: string }>(two, `
    select (select score from public.exam_history where id = 'old-mock-3') as score,
           (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong,
           (select seen_at::text from public.question_exposure where question_id = 'm1-rc-023') as seen`);
check('The three rows are intact and still unowned after the refusal',
    intactD.score === 101 && intactD.wrong === 3 && intactD.seen === '1756000000000' &&
    await orphanCount(two) === 3);
const named = await one<{ n: number }>(two, `select public.rdn_assign_orphan_rows('${OWNER}') as n`);
check('Naming the owner explicitly is what resolves the ambiguous case', named.n === 3);
const unknown = await refused(two, 'postgres', `select public.rdn_assign_orphan_rows('33333333-3333-4333-8333-333333333333')`);
check('An id that is not an account in this project is refused', unknown.refused,
    unknown.message.slice(0, 80));

// ---------------------------------------------------------------------------
// E. Partially attributed project
// ---------------------------------------------------------------------------
console.log('\nE. Partially attributed project');
const part = await freshProject();
for (const file of files.slice(0, 3)) await part.exec(sqlOf(file));
await part.exec(legacyRows('4'));
await part.exec(`insert into auth.users (id, email) values ('${OWNER}', 'owner@example.com')`);
await part.exec(sqlOf(files[3]));
// A second wave of rows arrives unowned, as a restore from an old backup would.
await part.exec(`
    insert into public.exam_history (id, date, score, total_questions, domain_scores,
        time_spent_seconds, mode, user_id)
        values ('restored-1', '2026-07-01', 88, 145, '{}'::jsonb, 9000, 'mock', null);
    insert into public.error_log (question_id, wrong_count, attempts, last_attempt_at, user_id)
        values ('m3-fsl-009', 5, 5, 1750000000000, null);
    insert into public.question_exposure (question_id, seen_at, exposed_at, user_id)
        values ('m4-gf-first-05', 1750000000000, 1750000000000, null);
`);
const ownedBefore = await one<{ id: string; score: number; wrong: number; owner: string }>(part, `
    select (select id from public.exam_history where user_id = '${OWNER}' limit 1) as id,
           (select score from public.exam_history where id = 'old-mock-4') as score,
           (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong,
           (select user_id::text from public.error_log where question_id = 'm2-mnt-120') as owner`);
const mixedBefore = await orphanCount(part);
const claimedE = await one<{ n: number }>(part, 'select public.rdn_assign_orphan_rows() as n');
check('Only the unowned rows are claimed on a partially attributed database',
    mixedBefore === 3 && claimedE.n === 3, `orphans before=${mixedBefore} claimed=${claimedE.n}`);
const afterE = await one<{ wrong: number; owner: string; restored: number; score: number; orphans: number }>(part, `
    select (select wrong_count from public.error_log where question_id = 'm2-mnt-120') as wrong,
           (select user_id::text from public.error_log where question_id = 'm2-mnt-120') as owner,
           (select score from public.exam_history where id = 'restored-1') as restored,
           (select score from public.exam_history where id = 'old-mock-4') as score,
           (select count(*)::int from public.exam_history where user_id is null) as orphans`);
check('Rows that already had an owner keep it, with their values untouched',
    afterE.owner === ownedBefore.owner && afterE.wrong === ownedBefore.wrong &&
    afterE.wrong === 3 && afterE.restored === 88 && afterE.score === 101 && afterE.orphans === 0,
    `wrong=${afterE.wrong} restored=${afterE.restored} orphans=${afterE.orphans}`);
check('Nothing is left unowned afterwards', await orphanCount(part) === 0);

// ---------------------------------------------------------------------------
// F. A signed-in user trying to create or capture unowned rows
// ---------------------------------------------------------------------------
console.log('\nF. A signed-in user against unowned rows');
const hostile = await freshProject();
for (const file of files.slice(0, 3)) await hostile.exec(sqlOf(file));
await hostile.exec(legacyRows('5'));
await hostile.exec(sqlOf(files[3]));           // no account yet: the three rows stay unowned
await signInAs(hostile, OTHER);                // a signed-in user who owns nothing here
check('Setup: three unowned rows exist', await orphanCount(hostile) === 3);

const attacks: [string, string][] = [
    ['run the assignment function', `select public.rdn_assign_orphan_rows('${OTHER}')`],
    ['run it with no argument', `select public.rdn_assign_orphan_rows()`],
    ['read the unowned rows', `select * from public.exam_history`],
    ['disable a merge guard', `alter table public.exam_history disable trigger rdn_preserve_exam_history`],
    ['insert an unowned row', `insert into public.error_log (question_id, wrong_count, user_id) values ('h1', 1, null)`],
    ['change the ownership column type', `alter table public.exam_history alter column user_id drop default`],
];
for (const [label, sql] of attacks) {
    const attempt = await refused(hostile, 'authenticated', sql);
    const readBlocked = label === 'read the unowned rows'
        ? (await (async () => { await hostile.exec('set role authenticated');
              const r = await hostile.query('select * from public.exam_history');
              await hostile.exec('reset role'); return r.rows.length === 0; })())
        : false;
    check(`A signed-in user cannot ${label}`, attempt.refused || readBlocked,
        attempt.message.slice(0, 70) || 'returns no rows');
}
// The capture attempt that row level security has to stop: claim what you cannot see.
await hostile.exec('set role authenticated');
const captured = await hostile.query(
    `update public.exam_history set user_id = '${OTHER}' where user_id is null returning id`);
await hostile.exec('reset role');
check('A signed-in user cannot take ownership of rows they cannot see', captured.rows.length === 0);
check('The three rows are still unowned and unchanged after every attempt',
    await orphanCount(hostile) === 3 &&
    (await one<{ s: number }>(hostile, `select score as s from public.exam_history where id = 'old-mock-5'`)).s === 101);

// ---------------------------------------------------------------------------
// G. The actual restored project: legacy permissive policies, then two real users
// ---------------------------------------------------------------------------
console.log('\nG. Restored project with legacy public-access policies, then two users');
const legacy = await legacyRestoredProject();

// Before any migration: this is the vulnerable state. Confirm it exists, so the scenario
// is proven to start from the reported condition rather than an assumption of it.
const legacyBefore = await one<{ policies: number; anonSelect: boolean }>(legacy, `
    select (select count(*)::int from pg_policies
            where schemaname = 'public' and tablename in ('error_log', 'exam_history')) as policies,
           has_table_privilege('anon', 'public.error_log', 'select') as "anonSelect"`);
check('Starting point: two legacy USING(true) policies exist, and anon can select',
    legacyBefore.policies === 4 && legacyBefore.anonSelect === true,
    `policies=${legacyBefore.policies} anonSelect=${legacyBefore.anonSelect}`);
const anonReadsLegacy = await refused(legacy, 'anon', 'select question_id from public.error_log');
check('Before migration 4, anon can actually read through the legacy policy',
    !anonReadsLegacy.refused, anonReadsLegacy.message.slice(0, 70) || '(read succeeded)');

for (const file of files) await legacy.exec(sqlOf(file));

const legacyAfter = await one<{ names: string[] }>(legacy, `
    select array_agg(policyname order by tablename, policyname) as names
    from pg_policies where schemaname = 'public'
    and tablename in ('error_log', 'exam_history', 'question_exposure')`);
const perTableCounts: (readonly [string, number])[] = [];
for (const table of TABLES) {
    const n = (await one<{ n: number }>(legacy, `select count(*)::int as n from pg_policies
        where schemaname = 'public' and tablename = '${table}'`)).n;
    perTableCounts.push([table, n] as const);
}
check('Exactly 4 policies per table, and no legacy policy survives',
    perTableCounts.every(([, n]) => n === 4) &&
    (legacyAfter.names ?? []).every(name => name.startsWith('rdn_owner_')),
    `counts=${JSON.stringify(perTableCounts)} names=${JSON.stringify(legacyAfter.names)}`);

for (const table of TABLES) {
    const grants = await one<{ anon: number; auth: number }>(legacy, `
        select
            (select count(*)::int from information_schema.role_table_grants
             where table_schema = 'public' and table_name = '${table}' and grantee = 'anon') as anon,
            (select count(*)::int from information_schema.role_table_grants
             where table_schema = 'public' and table_name = '${table}' and grantee = 'authenticated') as auth`);
    check(`${table}: anon has zero grants and authenticated has exactly the four it needs after migration 4`,
        grants.anon === 0 && grants.auth === 4, `anon=${grants.anon} authenticated=${grants.auth}`);

    // authenticated must not still hold what Supabase's default privileges hand every new
    // table at creation time (TRUNCATE, REFERENCES, TRIGGER, on top of the four CRUD ones).
    // TRUNCATE in particular is not governed by row level security at all: a role that keeps
    // it can empty the whole table regardless of ownership. Confirmed by direct measurement
    // before this fix - see the migration file's comment - that an additive grant on top of
    // the inherited ALL grant leaves TRUNCATE in place.
    for (const extra of ['truncate', 'references', 'trigger']) {
        const has = await one<{ ok: boolean }>(legacy,
            `select has_table_privilege('authenticated', 'public.${table}', '${extra}') as ok`);
        check(`${table}: authenticated has no ${extra} privilege (not governed by row level security)`,
            has.ok === false);
    }
}
const anonAfter = await refused(legacy, 'anon', 'select question_id from public.error_log');
check('After migration 4, anon can no longer read error_log at all', anonAfter.refused);
for (const priv of ['select', 'insert', 'update', 'delete']) {
    const has = await one<{ ok: boolean }>(legacy,
        `select has_table_privilege('anon', 'public.error_log', '${priv}') as ok`);
    check(`anon has no ${priv} privilege on error_log after migration 4`, has.ok === false);
}

// Two real users, three tables: everything item 3 asked for, in one matrix.
const USER_A = '44444444-4444-4444-8444-444444444444';
const USER_B = '55555555-5555-4555-8555-555555555555';
await legacy.exec(`insert into auth.users (id, email) values
    ('${USER_A}', 'a@example.com'), ('${USER_B}', 'b@example.com')`);

const rowsByTable: Record<typeof TABLES[number], { insertA: string; select: string; idCol: string; updateCol: string }> = {
    error_log: {
        idCol: 'question_id',
        updateCol: 'wrong_count',
        insertA: `insert into public.error_log (question_id, wrong_count, attempts, user_id)
            values ('two-user-1', 1, 1, '${USER_A}')`,
        select: `select question_id from public.error_log where question_id = 'two-user-1'`,
    },
    exam_history: {
        idCol: 'id',
        updateCol: 'score',
        insertA: `insert into public.exam_history (id, date, score, total_questions, domain_scores,
            time_spent_seconds, mode, user_id)
            values ('two-user-1', '2026-09-01', 90, 145, '{}'::jsonb, 9000, 'mock', '${USER_A}')`,
        select: `select id from public.exam_history where id = 'two-user-1'`,
    },
    question_exposure: {
        idCol: 'question_id',
        updateCol: 'seen_at',
        insertA: `insert into public.question_exposure (question_id, seen_at, exposed_at, user_id)
            values ('two-user-1', 1000, 1000, '${USER_A}')`,
        select: `select question_id from public.question_exposure where question_id = 'two-user-1'`,
    },
};

await signInAs(legacy, USER_A);
await legacy.exec('set role authenticated');
for (const table of TABLES) await legacy.exec(rowsByTable[table].insertA);
await legacy.exec('reset role');

for (const table of TABLES) {
    const { idCol, select, updateCol } = rowsByTable[table];

    await signInAs(legacy, USER_A);
    await legacy.exec('set role authenticated');
    const ownRead = await legacy.query(select);
    await legacy.exec('reset role');
    check(`${table}: user A can read their own row`, ownRead.rows.length === 1);

    await signInAs(legacy, USER_B);
    await legacy.exec('set role authenticated');
    const bSelect = await legacy.query(select);
    await legacy.exec('reset role');
    check(`${table}: user B cannot read A's row (ler)`, bSelect.rows.length === 0);

    await legacy.exec('set role authenticated');
    const bUpdate = await legacy.query(
        `update public.${table} set ${updateCol} = 0
         where ${idCol} = 'two-user-1' returning ${idCol}`);
    await legacy.exec('reset role');
    check(`${table}: user B cannot alter A's row (alterar)`, bUpdate.rows.length === 0);

    await legacy.exec('set role authenticated');
    const bDelete = await legacy.query(`delete from public.${table} where ${idCol} = 'two-user-1' returning ${idCol}`);
    await legacy.exec('reset role');
    check(`${table}: user B cannot delete A's row (apagar)`, bDelete.rows.length === 0);

    await legacy.exec('set role authenticated');
    const bTransfer = await legacy.query(
        `update public.${table} set user_id = '${USER_B}' where ${idCol} = 'two-user-1' returning ${idCol}`);
    await legacy.exec('reset role');
    check(`${table}: user B cannot transfer A's row to themselves (transferir)`, bTransfer.rows.length === 0);

    // Same statement as A's own insert (user_id = A), only a different row id - but this
    // time it runs signed in as B. auth.uid() = B while the row claims user_id = A, so the
    // WITH CHECK clause (auth.uid() = user_id) must reject it.
    await signInAs(legacy, USER_B);
    const insertAsB = rowsByTable[table].insertA.replace('two-user-1', 'two-user-2');
    const bInsert = await refused(legacy, 'authenticated', insertAsB);
    check(`${table}: user B cannot insert a row claiming to be A (inserir)`, bInsert.refused,
        bInsert.message.slice(0, 70));
}

await signInAs(legacy, USER_A);
await legacy.exec('set role authenticated');
const stillA: { rows: unknown[] }[] = [];
for (const t of TABLES) stillA.push(await legacy.query(rowsByTable[t].select));
await legacy.exec('reset role');
check('After every attempt from B, A\'s rows in all three tables are intact',
    stillA.every(r => r.rows.length === 1));

// ---------------------------------------------------------------------------
// H. Rollout halted right after 20260920, before ownership exists
// ---------------------------------------------------------------------------
console.log('\nH. Rollout halted before migration 4 (question_exposure has no owner yet)');
const halted = await freshProject();
await halted.exec(sqlOf(files[0]));
await halted.exec(sqlOf(files[1])); // question_exposure is created here, with no user_id and no policy
const haltedRls = await one<{ rls: boolean; policies: number }>(halted, `
    select relrowsecurity as rls,
           (select count(*)::int from pg_policies where schemaname = 'public' and tablename = 'question_exposure') as policies
    from pg_class where oid = 'public.question_exposure'::regclass`);
check('question_exposure is born with row level security on and zero policies',
    haltedRls.rls === true && haltedRls.policies === 0, JSON.stringify(haltedRls));

for (const role of ['anon', 'authenticated']) {
    // A SELECT that row level security filters down to nothing does not raise an error -
    // it succeeds and returns zero rows. That is the correct, secure behaviour (the same
    // the app relies on everywhere else in this suite), so the read case is checked by row
    // count rather than by expecting an exception; only the write case is expected to throw.
    await halted.exec('reset role');
    await halted.exec(`set role ${role}`);
    const readResult = await halted.query('select * from public.question_exposure');
    await halted.exec('reset role');
    check(`${role} reads zero rows from question_exposure while the rollout is stopped mid-way`,
        readResult.rows.length === 0);

    const insertAttempt = await refused(halted, role,
        `insert into public.question_exposure (question_id, seen_at, exposed_at) values ('h', 1, 1)`);
    check(`${role} cannot write question_exposure while the rollout is stopped mid-way`, insertAttempt.refused,
        insertAttempt.message.slice(0, 70));
}
// Resuming the rollout must still work normally from this halted state.
await halted.exec(sqlOf(files[2]));
try {
    await halted.exec(sqlOf(files[3]));
    check('Resuming the rollout from the halted state applies migration 4 cleanly', true);
} catch (error) {
    check('Resuming the rollout from the halted state applies migration 4 cleanly', false, String(error));
}
check('question_exposure has its 4 owner policies once the rollout resumes and finishes',
    (await one<{ n: number }>(halted, `select count(*)::int as n from pg_policies
        where schemaname = 'public' and tablename = 'question_exposure'`)).n === 4);

// ---------------------------------------------------------------------------
// The diagnostics must report the truth and change nothing.
// ---------------------------------------------------------------------------
console.log('\nDiagnostics');
const snapshot = (target: PGlite) => one<{ fingerprint: string }>(target, `
    select md5(string_agg(line, '|' order by line)) as fingerprint from (
        select relname || ':' || relrowsecurity::text || ':' || coalesce(array_to_string(relacl, ','), '-') as line
        from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r'
        union all
        select 'policy:' || tablename || ':' || policyname from pg_policies where schemaname = 'public'
        union all
        select 'proc:' || proname || ':' || coalesce(array_to_string(proacl, ','), '-')
        from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public'
        union all
        select 'rows:' || (select count(*) from public.exam_history)::text || ':' ||
               (select count(*) from public.error_log)::text || ':' ||
               (select count(*) from public.question_exposure)::text
    ) catalog_lines`);

for (const [name, target, expectOrphans] of [
    ['a finished project', doc, 0], ['a project with unowned rows', hostile, 3],
] as const) {
    const fingerprintBefore = (await snapshot(target)).fingerprint;
    let ran = true;
    try { await target.exec(diagnostic('preflight_readonly.sql')); await target.exec(diagnostic('orphan_rows.sql')); }
    catch (error) { ran = false; check(`Diagnostics run on ${name}`, false, String(error).split('\n')[0]); }
    if (ran) check(`Diagnostics run on ${name}`, true);
    const fingerprintAfter = (await snapshot(target)).fingerprint;
    check(`Diagnostics changed nothing on ${name}`, fingerprintBefore === fingerprintAfter);

    const counted = await one<{ total: number }>(target, `
        select (select count(*) from public.error_log where user_id is null)
             + (select count(*) from public.exam_history where user_id is null)
             + (select count(*) from public.question_exposure where user_id is null) as total`);
    check(`The orphan count on ${name} is the expected ${expectOrphans}`, Number(counted.total) === expectOrphans,
        `counted=${counted.total}`);
}

// The pre-flight has to be safe to paste into a project whose schema is unknown.
const bare = await freshProject();
try {
    await bare.exec(diagnostic('preflight_readonly.sql'));
    check('The pre-flight runs on a project that has none of the three tables', true);
} catch (error) {
    check('The pre-flight runs on a project that has none of the three tables', false,
        String(error).split('\n')[0]);
}
const writes = diagnostic('preflight_readonly.sql')
    .split('\n').filter(line => !line.trim().startsWith('--')).join('\n')
    .match(/\b(insert|update|delete|drop|alter|create|grant|revoke|truncate)\b/gi);
check('The pre-flight file contains no write statement outside its comments', writes === null,
    writes ? writes.join(',') : '');

console.log(failures === 0
    ? `\nSetup verified across eight project states: ${files.length} migrations, grants, access rules, attribution, legacy-policy removal, two-user isolation and read-only diagnostics.`
    : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
