-- Personal access control. Run LAST, after the other three migrations.
--
-- Why this exists: the anon key shipped in a public web app is readable by anyone who opens
-- the site, so "anon can write" means "the internet can write". These tables are therefore
-- owned by a signed-in user and readable only by that user. Sign in once per device from
-- Profile; supabase-js keeps the session in that browser.
begin;

alter table public.error_log        add column if not exists user_id uuid not null default auth.uid();
alter table public.exam_history     add column if not exists user_id uuid not null default auth.uid();
alter table public.question_exposure add column if not exists user_id uuid not null default auth.uid();

-- Recovering a project that already holds rows written before sign-in existed: when the
-- project has exactly one user, those rows are assigned to them. With zero or several users
-- nothing is touched, and the rows stay until they are assigned deliberately.
do $$
declare owner_id uuid;
begin
    if (select count(*) from auth.users) = 1 then
        select id into owner_id from auth.users;
        update public.error_log        set user_id = owner_id where user_id is null;
        update public.exam_history     set user_id = owner_id where user_id is null;
        update public.question_exposure set user_id = owner_id where user_id is null;
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
