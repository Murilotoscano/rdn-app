-- Apply after 20260920_exam_fields_and_question_exposure.sql.
-- The guards run inside PostgreSQL's row lock, including writes from cached old clients.
-- They do not change table grants, RLS policies, or the app's existing access model.
begin;

create or replace function public.rdn_preserve_question_exposure()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
    new.seen_at := greatest(old.seen_at, new.seen_at);
    new.exposed_at := greatest(old.exposed_at, new.exposed_at);
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists rdn_preserve_question_exposure on public.question_exposure;
create trigger rdn_preserve_question_exposure before update on public.question_exposure
for each row execute function public.rdn_preserve_question_exposure();

create or replace function public.rdn_preserve_exam_history()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
    -- A completed exam ID identifies one immutable result. A legacy copy can fill
    -- missing metadata, but must not replace already recorded values (including 0/false).
    old.real_conditions := coalesce(old.real_conditions, new.real_conditions);
    old.inconclusive := coalesce(old.inconclusive, new.inconclusive);
    old.fresh_total := coalesce(old.fresh_total, new.fresh_total);
    old.fresh_correct := coalesce(old.fresh_correct, new.fresh_correct);
    return old;
end;
$$;

drop trigger if exists rdn_preserve_exam_history on public.exam_history;
create trigger rdn_preserve_exam_history before update on public.exam_history
for each row execute function public.rdn_preserve_exam_history();

create or replace function public.rdn_preserve_review_progress()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare
    incoming public.error_log%rowtype;
begin
    incoming := new;
    -- Review state follows the latest attempt, not whichever device uploads last.
    if coalesce(new.last_attempt_at, new.date_logged_at, 0)
        <= coalesce(old.last_attempt_at, old.date_logged_at, 0) then
        new := old;
    end if;
    -- Legacy records are snapshots, not events. Maxima prevent rollback and retry
    -- inflation; they cannot reconstruct two simultaneous offline attempts of one type.
    new.wrong_count := greatest(old.wrong_count, incoming.wrong_count);
    new.unsure_count := greatest(old.unsure_count, incoming.unsure_count);
    new.confident_count := greatest(old.confident_count, incoming.confident_count);
    new.attempts := greatest(old.attempts, incoming.attempts,
        coalesce(new.wrong_count, 0) + coalesce(new.unsure_count, 0) + coalesce(new.confident_count, 0));
    return new;
end;
$$;

drop trigger if exists rdn_preserve_review_progress on public.error_log;
create trigger rdn_preserve_review_progress before update on public.error_log
for each row execute function public.rdn_preserve_review_progress();

-- New clients refuse writes until the server guards exist. This exposes missing
-- migrations as an actionable sync error instead of reporting a successful backup.
create or replace function public.rdn_sync_protocol()
returns integer language sql stable security invoker set search_path = '' as $$
    select case when count(*) = 3 then 1 else 0 end::integer
    from pg_catalog.pg_trigger
    where not tgisinternal and tgenabled in ('O', 'A') and
        ((tgrelid = 'public.question_exposure'::regclass and tgname = 'rdn_preserve_question_exposure')
        or (tgrelid = 'public.exam_history'::regclass and tgname = 'rdn_preserve_exam_history')
        or (tgrelid = 'public.error_log'::regclass and tgname = 'rdn_preserve_review_progress'));
$$;

commit;
