-- ===========================================================================
-- PRE-FLIGHT INSPECTION - READ ONLY
--
-- Paste into the SQL editor of the OLD project and run it BEFORE changing anything.
-- It only reads: every statement is a SELECT, over system catalogs and over the three
-- application tables. It creates nothing, alters nothing, deletes nothing, grants and
-- revokes nothing. Running it twice changes nothing either.
--
-- Row counts use query_to_xml, which runs the SELECT it is given, so tables that do not
-- exist are simply reported as absent instead of raising an error. That matters here:
-- the real schema of an old project is unknown until this has been run.
--
-- Run the sections one at a time, or all at once if the editor returns several results.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Do the three tables exist, and how many rows does each hold?
--    Expected on a project that was in use: three rows, is_table = true, some row counts.
--    A table missing here means the app never wrote it, or this is a different project.
-- ---------------------------------------------------------------------------
select
    t.name                                                      as table_name,
    (c.oid is not null)                                         as is_table,
    coalesce(c.relrowsecurity, false)                           as rls_enabled,
    coalesce(c.relforcerowsecurity, false)                      as rls_forced,
    case when c.oid is null then null else
        (xpath('/row/cnt/text()',
               query_to_xml(format('select count(*) as cnt from public.%I', t.name),
                            false, true, '')))[1]::text::bigint
    end                                                         as total_rows,
    case when c.oid is null then null else exists (
        select 1 from information_schema.columns ic
        where ic.table_schema = 'public' and ic.table_name = t.name and ic.column_name = 'user_id'
    ) end                                                       as has_user_id_column,
    case when c.oid is null or not exists (
            select 1 from information_schema.columns ic
            where ic.table_schema = 'public' and ic.table_name = t.name and ic.column_name = 'user_id')
        then null else
        (xpath('/row/cnt/text()',
               query_to_xml(format('select count(*) as cnt from public.%I where user_id is null', t.name),
                            false, true, '')))[1]::text::bigint
    end                                                         as rows_without_owner
from (values ('error_log'), ('exam_history'), ('question_exposure')) as t(name)
left join pg_catalog.pg_class c
       on c.relname = t.name
      and c.relnamespace = 'public'::regnamespace
      and c.relkind = 'r'
order by t.name;

-- ---------------------------------------------------------------------------
-- 2. Full column list of whatever those tables actually are.
--    Compare against supabase/migrations/20260919 and 20260920 before assuming
--    the migrations will apply cleanly. Unexpected columns or types are drift.
-- ---------------------------------------------------------------------------
select table_name, ordinal_position, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('error_log', 'exam_history', 'question_exposure')
order by table_name, ordinal_position;

-- ---------------------------------------------------------------------------
-- 3. Row level security policies currently on those tables.
--    Expected on an untouched old project: no rows at all (RLS never configured).
-- ---------------------------------------------------------------------------
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('error_log', 'exam_history', 'question_exposure')
order by tablename, policyname;

-- ---------------------------------------------------------------------------
-- 4. Triggers on those tables, and whether they are enabled.
--    tgenabled: O = enabled, D = disabled, A/R = replica settings.
--    Expected on an untouched old project: no rows. After migration 3: the three
--    rdn_preserve_* triggers, enabled.
-- ---------------------------------------------------------------------------
select c.relname as table_name, tg.tgname as trigger_name, tg.tgenabled as enabled_flag,
       p.proname as function_name
from pg_catalog.pg_trigger tg
join pg_catalog.pg_class c on c.oid = tg.tgrelid
join pg_catalog.pg_proc p on p.oid = tg.tgfoid
where not tg.tgisinternal
  and c.relnamespace = 'public'::regnamespace
  and c.relname in ('error_log', 'exam_history', 'question_exposure')
order by c.relname, tg.tgname;

-- ---------------------------------------------------------------------------
-- 5. rdn_* functions already present, with their owner, security mode and grants.
--    Expected on an untouched old project: no rows.
--    security_mode should read INVOKER for every rdn_* function.
-- ---------------------------------------------------------------------------
select p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as function_signature,
       pg_get_userbyid(p.proowner)                                          as owner,
       case when p.prosecdef then 'DEFINER' else 'INVOKER' end              as security_mode,
       p.proconfig                                                          as settings,
       coalesce(array_to_string(p.proacl, ' | '), '(default: PUBLIC may execute)') as grants
from pg_catalog.pg_proc p
join pg_catalog.pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'rdn\_%'
order by 1;

-- ---------------------------------------------------------------------------
-- 6. Table grants per role. This is what the published anon key can reach.
--    Expected AFTER migration 4: no anon rows, and only authenticated + owner.
--    Any 'anon' row here on the old project means the data is world-readable today.
-- ---------------------------------------------------------------------------
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('error_log', 'exam_history', 'question_exposure')
group by table_name, grantee
order by table_name, grantee;

-- ---------------------------------------------------------------------------
-- 7. How many accounts the project has. The automatic attribution in migration 4
--    only runs when this is exactly 1. Emails are shown so the account can be
--    recognised; no other auth data is read.
-- ---------------------------------------------------------------------------
select count(*) as user_count from auth.users;

select id, email, created_at, last_sign_in_at
from auth.users
order by created_at
limit 10;

-- ---------------------------------------------------------------------------
-- 8. Environment fingerprint, to record which project and version this was run on.
-- ---------------------------------------------------------------------------
select current_database()                as database,
       current_user                      as run_as,
       version()                         as postgres_version,
       (select count(*) from pg_catalog.pg_extension where extname = 'pgsodium') as has_pgsodium,
       now()                             as inspected_at;
