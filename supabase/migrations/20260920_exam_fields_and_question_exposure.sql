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

create index if not exists question_exposure_updated_at_idx
    on public.question_exposure (updated_at);
