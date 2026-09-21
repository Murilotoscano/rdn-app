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

-- question_exposure and the four mock columns are added by 20260920_exam_fields_and_question_exposure.sql.
commit;
