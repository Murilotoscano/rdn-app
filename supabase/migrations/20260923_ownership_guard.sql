-- Row-level ownership guard. Run after the other four migrations; does not touch them.
--
-- Why this exists: the real project's first sync created 191 error_log rows with
-- user_id IS NULL, even though the client was signed in, because src/lib/store.ts's bulk
-- .upsert() never sends user_id at all - it relies entirely on the column's
-- `default auth.uid()` from 20260922_personal_access.sql to fill it in. That default is not
-- a reliable substitute for ownership: a bulk upsert going through PostgREST does not apply
-- a column's DEFAULT the same way a single hand-written INSERT does for every shape of
-- request, and an old or cached build of the app can omit the column in ways this project
-- does not control. Once a row lands with user_id NULL, `auth.uid() = user_id` can never be
-- true again for it, so it becomes permanently invisible under row level security - and the
-- next upsert attempt against that same primary key hits the UPDATE arm of
-- INSERT ... ON CONFLICT DO UPDATE, whose USING clause the existing NULL-owned row fails,
-- which is exactly the reported error: "new row violates row-level security policy
-- (USING expression) for table "error_log"".
--
-- The fix does not depend on the client, or on a column default, at all: a BEFORE trigger
-- sets ownership on INSERT and locks it on UPDATE, for every row, regardless of what the
-- REST layer's generated statement looks like.
begin;

create or replace function public.rdn_enforce_ownership()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
    if TG_OP = 'INSERT' then
        -- A signed-in request with no owner set gets the signed-in user. A row that
        -- explicitly names a different owner is left alone here - the existing
        -- rdn_owner_write policy (`with check (auth.uid() = user_id)`) already refuses
        -- that outright, and duplicating the check here would only be one more place for
        -- the two to drift apart.
        if new.user_id is null and auth.uid() is not null then
            new.user_id := auth.uid();
        end if;
        return new;
    end if;

    if TG_OP = 'UPDATE' then
        -- auth.uid() is null exactly when there is no JWT: the SQL editor, a connection as
        -- the table owner, or a SECURITY INVOKER function called from either - which is
        -- always true for rdn_assign_orphan_rows(), the only place that legitimately moves
        -- a row from unowned to owned. That administrative path is left untouched here.
        --
        -- A signed-in request can never move a row's ownership, in either direction: not
        -- their own row to someone else, and not someone else's row to themselves (row
        -- level security's USING clause already keeps them from reaching a row they do not
        -- own in the first place, so this only ever fires on their own rows - but it holds
        -- regardless of that, rather than depending on it).
        if auth.uid() is not null then
            new.user_id := old.user_id;
        end if;
        return new;
    end if;

    return new;
end;
$$;

-- Named to sort alphabetically before rdn_preserve_* (e < p), so on UPDATE this runs first:
-- ownership is settled before question_exposure's guard touches seen_at/exposed_at/
-- updated_at, and before exam_history/error_log's guards decide what survives into the
-- final row. In practice the ordering does not change the outcome - the exam_history and
-- error_log guards return an old-based row whose user_id was never touched by either
-- trigger, and this guard's own UPDATE branch is unconditional on OLD.user_id regardless of
-- what a trigger before it did - but the order is pinned deliberately rather than left to
-- alphabetical accident, and 20260921_safe_cross_device_sync.sql is not modified to do it.
do $$
declare t text;
begin
    foreach t in array array['error_log', 'exam_history', 'question_exposure'] loop
        execute format('drop trigger if exists rdn_enforce_ownership on public.%I', t);
        execute format(
            'create trigger rdn_enforce_ownership before insert or update on public.%I
             for each row execute function public.rdn_enforce_ownership()', t);
    end loop;
end $$;

-- Functions are executable by PUBLIC unless told otherwise, and this one runs with the
-- caller's own privileges (SECURITY INVOKER) purely as the trigger machinery requires - it
-- is never meant to be called directly. Revoked the same way rdn_assign_orphan_rows is.
do $$
declare r text;
begin
    execute 'revoke all on function public.rdn_enforce_ownership() from public';
    foreach r in array array['anon', 'authenticated', 'service_role'] loop
        if exists (select 1 from pg_catalog.pg_roles where rolname = r) then
            execute format('revoke all on function public.rdn_enforce_ownership() from %I', r);
        end if;
    end loop;
end $$;

-- rdn_sync_protocol() re-defined here, not edited in 20260921_safe_cross_device_sync.sql:
-- that file already ran, and this project does not rewrite migration history. It now also
-- requires the three rdn_enforce_ownership triggers, alongside the three rdn_preserve_*
-- ones - six enabled triggers in total, still only ever reporting 0 or 1.
create or replace function public.rdn_sync_protocol()
returns integer language sql stable security invoker set search_path = '' as $$
    select case when count(*) = 6 then 1 else 0 end::integer
    from pg_catalog.pg_trigger
    where not tgisinternal and tgenabled in ('O', 'A') and
        ((tgrelid = 'public.question_exposure'::regclass
            and tgname in ('rdn_preserve_question_exposure', 'rdn_enforce_ownership'))
        or (tgrelid = 'public.exam_history'::regclass
            and tgname in ('rdn_preserve_exam_history', 'rdn_enforce_ownership'))
        or (tgrelid = 'public.error_log'::regclass
            and tgname in ('rdn_preserve_review_progress', 'rdn_enforce_ownership')));
$$;

commit;
