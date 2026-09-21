-- Personal access control. Run LAST, after the other three migrations.
--
-- Why this exists: the anon key shipped in a public web app is readable by anyone who opens
-- the site, so "anon can write" means "the internet can write". These tables are therefore
-- owned by a signed-in user and readable only by that user. Sign in once per device from
-- Profile; supabase-js keeps the session in that browser.
begin;

-- The column is nullable on purpose.
--   * The SQL editor has no JWT, so auth.uid() is null while this runs. A NOT NULL column
--     with that default cannot be added to a table that already holds rows, which is
--     exactly the case when an existing project is being recovered.
--   * Rows that arrive without an owner must remain storable so they can be claimed later
--     (rdn_assign_orphan_rows below) instead of being rejected and lost.
-- Nothing can reach the API without an owner regardless: the insert policy checks
-- auth.uid() = user_id, and auth.uid() = null is never true.
alter table public.error_log         add column if not exists user_id uuid default auth.uid();
alter table public.exam_history      add column if not exists user_id uuid default auth.uid();
alter table public.question_exposure add column if not exists user_id uuid default auth.uid();

-- An earlier revision of this file created the column as NOT NULL. Undo that, so a database
-- that was set up with it can still take in unowned rows during a recovery.
alter table public.error_log         alter column user_id drop not null;
alter table public.exam_history      alter column user_id drop not null;
alter table public.question_exposure alter column user_id drop not null;

-- Assigns every unowned row to one account. Separate from the migration because the account
-- may be created after the tables, and because a recovery may need to run it again by hand.
--
-- The merge guards installed by 20260921 exist to stop a stale device from rewriting saved
-- progress, and they do that by returning the stored row: an ordinary UPDATE that sets
-- user_id is therefore discarded on exam_history and error_log. This one deliberate
-- assignment turns each guard off for its own statement and back on immediately, inside the
-- caller's transaction, so a failure anywhere rolls the whole thing back and rdn_sync_protocol()
-- would report 0 rather than leave a guard silently off.
create or replace function public.rdn_assign_orphan_rows(target uuid default null)
returns integer language plpgsql security invoker set search_path = '' as $$
declare
    owner_id uuid := target;
    candidates integer;
    guard record;
    installed boolean;
    moved integer;
    assigned integer := 0;
begin
    if owner_id is null then
        select count(*) into candidates from auth.users;
        if candidates <> 1 then
            raise exception
                'Cannot choose an owner automatically: the project has % users. Create the study account first, or pass its id: select public.rdn_assign_orphan_rows(''<user id>'');',
                candidates;
        end if;
        select id into owner_id from auth.users;
    elsif not exists (select 1 from auth.users where id = owner_id) then
        raise exception 'No user % exists in this project.', owner_id;
    end if;

    for guard in select * from (values
        ('error_log',         'rdn_preserve_review_progress'),
        ('exam_history',      'rdn_preserve_exam_history'),
        ('question_exposure', 'rdn_preserve_question_exposure')) as g(tbl, trg)
    loop
        installed := exists (
            select 1 from pg_catalog.pg_trigger
            where tgrelid = ('public.' || guard.tbl)::regclass and tgname = guard.trg);

        if installed then
            execute format('alter table public.%I disable trigger %I', guard.tbl, guard.trg);
        end if;

        execute format('update public.%I set user_id = $1 where user_id is null', guard.tbl)
            using owner_id;
        get diagnostics moved = row_count;
        assigned := assigned + moved;

        if installed then
            execute format('alter table public.%I enable trigger %I', guard.tbl, guard.trg);
        end if;
    end loop;

    return assigned;
end;
$$;

-- Functions are executable by PUBLIC unless told otherwise, and PUBLIC includes anon.
revoke all on function public.rdn_assign_orphan_rows(uuid) from public;

-- Recovering a project that already holds rows written before sign-in existed: when the
-- account already exists and is the only one, those rows are assigned here. Otherwise they
-- keep user_id null, stay in the table, and are claimed by calling the function by hand
-- after the account is created. Unowned rows are invisible through the API either way.
do $$
begin
    if (select count(*) from auth.users) = 1 then
        perform public.rdn_assign_orphan_rows();
    end if;
end $$;

alter table public.error_log         enable row level security;
alter table public.exam_history      enable row level security;
alter table public.question_exposure enable row level security;

do $$
declare t text;
begin
    foreach t in array array['error_log', 'exam_history', 'question_exposure'] loop
        execute format('drop policy if exists rdn_owner_read on public.%I', t);
        execute format('drop policy if exists rdn_owner_write on public.%I', t);
        execute format('drop policy if exists rdn_owner_update on public.%I', t);
        execute format('drop policy if exists rdn_owner_delete on public.%I', t);
        execute format('create policy rdn_owner_read on public.%I for select to authenticated using (auth.uid() = user_id)', t);
        execute format('create policy rdn_owner_write on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
        execute format('create policy rdn_owner_update on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
        execute format('create policy rdn_owner_delete on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
        -- The anonymous role keeps no access at all: no policy, and no grant.
        execute format('revoke all on public.%I from anon', t);
        execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    end loop;
end $$;

commit;
