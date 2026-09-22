-- Cross-device persistence for the mock exam and for per-question history.
-- Safe to run more than once, and it does not touch existing rows.

-- 1. The four fields a mock exam records. Without them a history synced to another device
--    cannot tell a real-conditions mock from a review run, nor report unseen-question
--    performance. Existing rows keep NULL, which the app reads as "not recorded".
alter table public.exam_history add column if not exists real_conditions boolean;
alter table public.exam_history add column if not exists inconclusive     boolean;
alter table public.exam_history add column if not exists fresh_total      integer;
alter table public.exam_history add column if not exists fresh_correct    integer;

-- 2. Per-question history, with attempt and exposure kept apart.
--    seen_at    = the student ANSWERED this question (attempt)
--    exposed_at = the question was SHOWN with its answer (mock result page, practice reveal)
create table if not exists public.question_exposure (
    question_id text primary key,
    seen_at     bigint,
    exposed_at  bigint,
    updated_at  timestamptz not null default now()
);

-- Locked down here, not deferred to 20260922_personal_access.sql, the same way and for the
-- same reason 20260919_initial_schema.sql locks down error_log and exam_history: this table
-- has no user_id yet and no ownership policy can exist before that migration adds one, but a
-- rollout that stops between the two migrations must not leave it open in the meantime.
-- Row level security with zero policies denies every row to every non-owner role for
-- SELECT/INSERT/UPDATE/DELETE, but it does not govern TRUNCATE at all - and Supabase's
-- default privileges hand anon and authenticated ALL PRIVILEGES on this table at creation
-- time, TRUNCATE included. Revoking from PUBLIC, anon and authenticated closes exactly that
-- gap. Safe to run twice: enabling row level security and revoking a privilege that is
-- already gone are both no-ops.
alter table public.question_exposure enable row level security;

revoke all on public.question_exposure from public;

do $$
begin
    if exists (select 1 from pg_catalog.pg_roles where rolname = 'anon') then
        revoke all on public.question_exposure from anon;
    end if;
    if exists (select 1 from pg_catalog.pg_roles where rolname = 'authenticated') then
        revoke all on public.question_exposure from authenticated;
    end if;
end $$;

create index if not exists question_exposure_updated_at_idx
    on public.question_exposure (updated_at);
