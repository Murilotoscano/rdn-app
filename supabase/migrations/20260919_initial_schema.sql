-- Base tables the app has always assumed. Run this first on an EMPTY project; on a project
-- that already has these tables it changes nothing, because every statement is conditional.
-- Column names match what src/lib/store.ts sends and reads.
begin;

create table if not exists public.error_log (
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

create table if not exists public.exam_history (
    id                 text primary key,
    date               text,
    score              integer,
    total_questions    integer,
    domain_scores      jsonb,
    time_spent_seconds integer,
    mode               text
);

-- Closed the moment these tables exist, not deferred to 20260922_personal_access.sql. On an
-- empty Supabase project, `alter default privileges in schema public grant all on tables to
-- anon, authenticated, service_role` runs automatically at creation time - not just SELECT/
-- INSERT/UPDATE/DELETE, but TRUNCATE, REFERENCES and TRIGGER too, none of which row level
-- security governs. A rollout that stops right after this migration must not leave these
-- tables open to the published anon key in the meantime, so both are locked down here:
--   - row level security on, with no policy yet - denies every row to every non-owner role
--     for SELECT/INSERT/UPDATE/DELETE;
--   - every privilege revoked from PUBLIC, anon and authenticated - closes what row level
--     security does not reach, in particular TRUNCATE.
-- 20260922_personal_access.sql re-grants authenticated exactly SELECT/INSERT/UPDATE/DELETE
-- once user_id and the ownership policies exist. Until then the app has no cloud access at
-- all, on either table; that is the intended fail-closed state between migrations, not a bug.
alter table public.error_log    enable row level security;
alter table public.exam_history enable row level security;

revoke all on public.error_log    from public;
revoke all on public.exam_history from public;

do $$
begin
    if exists (select 1 from pg_catalog.pg_roles where rolname = 'anon') then
        revoke all on public.error_log    from anon;
        revoke all on public.exam_history from anon;
    end if;
    if exists (select 1 from pg_catalog.pg_roles where rolname = 'authenticated') then
        revoke all on public.error_log    from authenticated;
        revoke all on public.exam_history from authenticated;
    end if;
end $$;

-- question_exposure and the four mock columns are added by 20260920_exam_fields_and_question_exposure.sql.
commit;
