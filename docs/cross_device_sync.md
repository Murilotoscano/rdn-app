# Cross-device sync: rollout and validation

This change prevents an older device from overwriting newer completed-exam metadata,
question exposure, or review state. It covers the review queue, completed exams and
per-question attempted/exposed history. CDR progress, generated questions and their
progress remain in the downloadable backup.

The migrations were tested against PostgreSQL through PGlite (`npm run test:db`), including
against a database seeded with the exact legacy state a pre-flight found on the project this
was written for: two tables already present, with permissive policies from an earlier,
unrelated setup that an earlier version of this migration would have missed. That run checks
the access rules, the attribution of pre-existing rows, and the function and table grants
against Supabase's own default privileges. The migrations have **not been applied to a live
Supabase project as part of this change**. The automated tests use a transport adapter and a
simulated PostgreSQL wrapper; they do not validate the live project's actual network,
PostgREST configuration, or the exact grants and policies present on it today - only the
pre-flight in step 2 below reads that.

## Apply before releasing the app

Follow these in order. Steps 0 to 2 only read; nothing is changed before step 3.

0. **Export a backup from every device that has progress** (Profile > Export backup). Do this
   before anything else, and keep the files: step 9 restores from them if a device ends up
   showing less than it should. If the project itself already holds history, also take a
   database backup from the dashboard before step 5.
1. **Find out what the old project actually is.** A DNS failure alone does not prove deletion:
   a paused project usually still resolves and answers with an error. Open the Supabase
   dashboard and look for the project whose reference is the first label of the URL. If it is
   paused, restore it and keep its data; only create a new project if it is really gone.
2. **Inspect before changing anything.** Paste `supabase/diagnostics/preflight_readonly.sql`
   into the SQL editor of that project and run it. It is read-only: every statement is a
   SELECT, and `npm run test:db` checks both that the file contains no write statement and
   that running it leaves the catalog and the row counts identical. Read the result before
   continuing:
   - **Section 1** says whether the three tables exist and how much history is in them.
   - **Section 2** is the real column list. Compare it with migrations 1 and 2. Do not apply
     the migrations to an old project whose schema you have not looked at: they are written
     for the schema in this repository, and an old project may differ.
   - **Section 6** shows who can read those tables today. An `anon` row there means the data
     is reachable by anyone with the published key, which migration 4 is what fixes.
   - **Section 7** is the account count, which decides whether attribution can be automatic.
3. Confirm which project the app points at. The anon key is a JWT whose `ref` claim must
   equal that first label of `NEXT_PUBLIC_SUPABASE_URL`; if they differ, the URL or the key
   belongs to another project.
4. **Create the single study account**: Authentication > Users > Add user, with an email and
   a password you choose. Do this **before** step 5: migration 4 attributes existing rows
   automatically only when the project has exactly one account at that moment. The password
   is typed into the app on each device and is not stored in this repository.
5. Apply these files **in this order** through the SQL editor or the migration workflow:
   - `supabase/migrations/20260919_initial_schema.sql` (creates `error_log` and
     `exam_history`; a no-op on a project that already has them)
   - `supabase/migrations/20260920_exam_fields_and_question_exposure.sql`
   - `supabase/migrations/20260921_safe_cross_device_sync.sql`
   - `supabase/migrations/20260922_personal_access.sql` (ownership, row level security,
     removes the anonymous role's access)
6. **Validate the attribution.** Run `select public.rdn_sync_protocol();`. It must return `1`,
   which proves the three merge guards exist and are enabled. If it returns `0` a guard was
   left disabled by an interrupted run: re-apply `20260921_safe_cross_device_sync.sql`.
7. **Run the post-migration diagnostic**: `supabase/diagnostics/orphan_rows.sql`, also
   read-only. The expected result is `0` orphan rows in all three tables.

   If it reports orphans, the account was created after migration 4 ran. The rows were not
   deleted; they have no owner, and row level security hides them because the policies
   compare `auth.uid()` with `user_id` and null never matches. With **exactly one account**
   in the project, claim them once:

   ```sql
   select public.rdn_assign_orphan_rows();
   ```

   It returns how many rows it attributed, and is safe to run twice. With no account or more
   than one it refuses instead of guessing, because nothing in the row says whose history it
   is; decide who the owner is and pass the id explicitly,
   `select public.rdn_assign_orphan_rows('<user id>')`. Re-run the diagnostic afterwards and
   expect `0 / 0 / 0`. Ordinary updates cannot do this job: the merge guards from migration 3
   answer an update by returning the stored row, so the function turns each guard off for its
   own statement and back on within the same transaction.
8. Only now connect the app. Rebuild and redeploy, because `NEXT_PUBLIC_*` values are baked in
   at build time. Then open Profile on the iMac, sign in, and press **Sync now**.
9. If a device shows less than it should, import its backup from step 0 and sync again:
   imports merge, they do not replace. Repeat the sign-in on the iPad using the same account.

## Who can read the data

The anon key is part of the published page, so it cannot protect anything by itself. After
migration 4 the three tables grant nothing to the anonymous role: every row belongs to a
`user_id`, row level security only lets that user read or write it, and the app signs in
from Profile. `npm run test:db` checks exactly this, including that a second signed-in user
sees none of the owner's rows and that the anonymous role is refused outright, cannot read a
recovered project, and cannot run the attribution function.

`user_id` is deliberately nullable. A row that reaches the table without an owner is kept and
can be claimed (step 7 above) instead of being rejected and lost, and nothing can create one
through the API anyway: the insert policy requires `auth.uid() = user_id`, which is never true
when either side is null. The tests cover each half of that separately: a signed-in user
cannot insert a row with a null owner or with somebody else's id, cannot un-own or hand over
a row they own, and cannot take over a row they cannot see.

`rdn_assign_orphan_rows` is administrative and is **not** reachable through the API. Two
grants have to be removed for that to be true, and only one of them is obvious: PostgreSQL
grants EXECUTE on every new function to PUBLIC, and Supabase additionally ships
`alter default privileges in schema public grant all on functions to anon, authenticated,
service_role`, which writes a separate grant per role at creation time. Revoking PUBLIC alone
leaves the function callable at `/rest/v1/rpc/rdn_assign_orphan_rows` with the published key.
Migration 4 revokes both, and the test harness reproduces Supabase's default privileges so the
check cannot pass against an environment that is stricter than the real project. The function
stays SECURITY INVOKER with `search_path` pinned to empty and fully qualified references: run
by anyone other than the table owner it would fail on the very first statement, so the grant
and the ownership requirement both have to be defeated, not just one. `rdn_sync_protocol` is
the one function the app does call; it reads no data and returns only 0 or 1.

Migration 4 removes **every** policy already on `error_log`, `exam_history` and
`question_exposure`, not only ones it recognises by name. The pre-flight on the restored
project found two left over from an earlier, unrelated setup - `Acesso Público` and `Allow
all for anon`, both `for all to public using (true) with check (true)` - that an
earlier version of this migration would have missed, because it only dropped policies named
`rdn_owner_*`. PostgreSQL combines every permissive policy on a table with OR, so one
leftover `using (true)` policy grants full access to everyone regardless of how many
owner-only policies exist alongside it. The migration now enumerates whatever is actually in
`pg_policies` for each table and drops it by its real name before creating the four it needs;
`npm run test:db` reproduces that exact starting state and confirms all four are exactly
`rdn_owner_read/write/update/delete` afterwards, with nothing else surviving.

The same fix applies to grants, for the same reason. Supabase's default privileges hand
`authenticated` every privilege on a new table, not only the four the app uses -
`TRUNCATE`, `REFERENCES` and `TRIGGER` come with it. Row level security does not govern
`TRUNCATE` at all: measured directly, a role that keeps that grant can empty the whole table
in one statement regardless of whose rows they are, with every owner-only policy still in
place and irrelevant. Granting `select, insert, update, delete` on top of that inherited
grant, without revoking it first, would have left `TRUNCATE` in place. Migration 4 now
revokes everything from `authenticated` before granting back exactly those four.
`question_exposure` also enables row level security the moment it is created in migration 2,
before it has an owner or a policy, so a rollout that stops between migrations 2 and 4 has no
anonymous-access window in the meantime: row level security with zero policies denies every
row to every non-owner role, independently of whatever table grants exist at that point.

## Device acceptance check

Use the same deployed app URL on iMac and iPad; browser storage is specific to the
origin. Keep the app open until synchronization finishes before switching devices.

1. On iMac, answer a practice question and finish an exam. Sync from Profile.
2. On iPad, return to the app and sync. Confirm the completed exam, domain totals,
   review queue, and attempted/exposed counts match the iMac. The four exam fields
   must retain `false` and `0` as values, rather than treating them as missing.
3. Answer a different question on iPad, sync, then return to iMac. Confirm the new
   history appears there without losing previous history.
4. Disconnect one device, study, then reconnect and sync. A failed sync must not
   advance the last successful-sync time. Local work should reach the other device
   after reconnection.
5. Start an exam while the cloud is unavailable. The timer must not run during
   preparation. **Continue on this device** starts the exam with local history and
   omits unseen-question accuracy from the result. When cloud configuration is
   absent, local exams also omit that metric. A successful sync before the draw
   allows the metric and draws unseen questions from the merged history.

An in-progress exam is not transferred between devices. Finish it on the device
where it started. Background sync runs after local changes and when the app gains
focus, becomes visible or reconnects; browser suspension can delay those requests.

## Merge rules and limits

- Attempted and exposed timestamps merge independently by their maximum value.
  Neither a missing value nor an older value can erase either fact.
- A completed exam ID identifies an immutable result. Missing metadata can be
  filled later; existing metadata, including `false` and `0`, is preserved.
- Review state follows the newest attempt timestamp. Outcome counts merge by
  maxima so stale snapshots and retries cannot decrease or inflate them. The
  existing snapshot format cannot reconstruct two concurrent offline attempts of
  the same outcome on the same question; those totals may undercount. It also
  assumes device clocks are reasonably aligned. Exact concurrent event accounting
  would require a separate event-based data model.
- Remote reads use ordered pages of 500 rows, including when the history exceeds
  the usual 1,000-row response limit. Local changes made during a sync trigger
  another pass before success is reported.
- File backups remain useful for CDR/generated-question data and for offline
  transfer. Restoring a backup fills missing exam metadata without duplicating IDs.

## Automated verification

```sh
npm ci
npm run test:persistence
npm run test:sync
npm run test:db
npm run audit:bank
npm run build
```

The 14 persistence checks cover payloads and local/backup round trips. The 14 integration
checks run the actual store and SQL migrations with two independent device stores and real
PostgreSQL. They cover stale and overlapping uploads, missing metadata, review conflicts,
in-flight study actions, read/write failures, pagination beyond 1,000 rows, backup
restoration, repeatable migrations, the missing-migration guard, and that sync writes
nothing without a signed-in session.

The 124 database checks (`npm run test:db`) cover eight project states: an empty project;
a populated project migrated before the account exists; a populated project with the
account created first; a populated project with two accounts, where nothing may be
attributed; a partially attributed project, where only the unowned rows may change; a
signed-in user trying to create or capture unowned rows; a project restored with permissive
policies left over from an earlier, unrelated setup, followed by a full CRUD matrix between
two real signed-in users across all three tables; and a rollout halted between migrations 2
and 4. They check the function grants and the table grants against Supabase's own default
privileges (not a bare PostgreSQL database, which would pass this check for the wrong
reason), and run both read-only diagnostics to confirm they report the truth and change
nothing. These checks do not replace the live device acceptance check above.
