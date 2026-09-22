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

-- This function is administrative: it must be reachable from the SQL editor (which connects
-- as the table owner) and from nowhere else. Two separate grants have to be removed.
--
--   * PostgreSQL grants EXECUTE on every new function to PUBLIC.
--   * Supabase additionally ships `alter default privileges in schema public grant all on
--     functions to anon, authenticated, service_role`, which writes an explicit grant per
--     role when the function is created. Revoking from PUBLIC does not remove those, so
--     without the loop below the function stays callable over PostgREST as /rpc/.
--
-- Roles are revoked only if they exist, so this also applies to a plain PostgreSQL database.
do $$
declare r text;
begin
    execute 'revoke all on function public.rdn_assign_orphan_rows(uuid) from public';
    foreach r in array array['anon', 'authenticated', 'service_role'] loop
        if exists (select 1 from pg_catalog.pg_roles where rolname = r) then
            execute format('revoke all on function public.rdn_assign_orphan_rows(uuid) from %I', r);
        end if;
    end loop;
end $$;

-- rdn_sync_protocol stays callable by the app: the client asks it whether the merge guards
-- exist before uploading anything. It reads no data, returning only 0 or 1, and the grant is
-- written out here so it is deliberate rather than inherited from default privileges.
do $$
declare r text;
begin
    execute 'revoke all on function public.rdn_sync_protocol() from public';
    foreach r in array array['anon', 'authenticated', 'service_role'] loop
        if exists (select 1 from pg_catalog.pg_roles where rolname = r) then
            execute format('grant execute on function public.rdn_sync_protocol() to %I', r);
        end if;
    end loop;
end $$;

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
declare
    t text;
    pol record;
begin
    foreach t in array array['error_log', 'exam_history', 'question_exposure'] loop
        -- Remove every policy already on this table, not only ones named rdn_owner_*.
        -- A restored or hand-configured project can carry permissive policies under any
        -- name: this one arrived with "Acesso Público" and "Allow all for anon", both
        -- FOR ALL TO PUBLIC USING (true) WITH CHECK (true). PostgreSQL OR's permissive
        -- policies together, so as long as one USING(true) policy exists, it alone grants
        -- full access to every row and every role no matter how many owner-only policies
        -- are added afterwards - the rdn_owner_* policies below would have been additive,
        -- not restrictive. Dropping by a fixed list of names misses anything not on that
        -- list, so every existing policy is read from pg_policies and dropped by its real
        -- name before the owner-only policies are created.
        for pol in
            select policyname from pg_policies
            where schemaname = 'public' and tablename = t
        loop
            execute format('drop policy if exists %I on public.%I', pol.policyname, t);
        end loop;

        execute format('create policy rdn_owner_read on public.%I for select to authenticated using (auth.uid() = user_id)', t);
        execute format('create policy rdn_owner_write on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
        execute format('create policy rdn_owner_update on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
        execute format('create policy rdn_owner_delete on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
        -- The anonymous role keeps no access at all: no policy, and no grant. PUBLIC is
        -- revoked too, so no future role inherits access by simply existing.
        execute format('revoke all on public.%I from public', t);
        if exists (select 1 from pg_catalog.pg_roles where rolname = 'anon') then
            execute format('revoke all on public.%I from anon', t);
        end if;
        -- authenticated is revoked before being re-granted, not merely granted on top of
        -- whatever it already had. Supabase's own default privileges
        -- ("alter default privileges in schema public grant all on tables to ... authenticated")
        -- hand every new table ALL PRIVILEGES at creation time - not just SELECT/INSERT/
        -- UPDATE/DELETE, but TRUNCATE, REFERENCES and TRIGGER too. Row level security does
        -- not govern TRUNCATE at all: measured directly, a role holding only the inherited
        -- TRUNCATE grant can empty the whole table regardless of whose rows they are or
        -- what any owner-only policy says. Granting the four needed privileges without
        -- revoking first would have left that grant in place, unrestricted by RLS.
        if exists (select 1 from pg_catalog.pg_roles where rolname = 'authenticated') then
            execute format('revoke all on public.%I from authenticated', t);
        end if;
        execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    end loop;
end $$;

commit;
