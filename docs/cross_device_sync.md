# Cross-device sync: rollout and validation

This change prevents an older device from overwriting newer completed-exam metadata,
question exposure, or review state. It covers the review queue, completed exams and
per-question attempted/exposed history. CDR progress, generated questions and their
progress remain in the downloadable backup.

The migrations were tested against PostgreSQL through PGlite (`npm run test:db`): from an
empty database, and from a database that already holds saved progress, both with no user
session, which is what the SQL editor provides. That run also checks the access rules and
the attribution of pre-existing rows. The migrations have **not been applied to a live
Supabase project as part of this change**. The automated tests
use a transport adapter and do not validate the live project's network, PostgREST
configuration, grants or RLS policies.

## Apply before releasing the app

0. **Export a backup from every device that has progress** (Profile > Export backup), before
   any configuration changes. Keep the files; step 8 restores from them if anything is lost.
1. Check the existing project first. A DNS failure alone does not prove deletion: a paused
   project usually still resolves and answers with an error. Open the Supabase dashboard and
   look for the project whose reference is the first label of the URL. If it is paused,
   restore it and keep its data; only create a new project if it is really gone.
2. Confirm which project the app points at. The anon key is a JWT whose `ref` claim must
   equal that first label of `NEXT_PUBLIC_SUPABASE_URL`; if they differ, the URL or the key
   belongs to another project.
3. In the hosting project's environment, set `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` for that project. Never commit key values, never paste
   them into a chat, and never use a service-role key in the browser.
4. **Create the single study account first**: Authentication > Users > Add user, with an
   email and a password you choose. Do this **before** step 5, because migration 4 attributes
   any rows the project already holds to the account when it is the only one in the project.
   The password is typed into the app on each device and is not stored in this repository.
5. Apply these files **in this order** through the SQL editor or the migration workflow:
   - `supabase/migrations/20260919_initial_schema.sql` (creates `error_log` and
     `exam_history`; a no-op on a project that already has them)
   - `supabase/migrations/20260920_exam_fields_and_question_exposure.sql`
   - `supabase/migrations/20260921_safe_cross_device_sync.sql`
   - `supabase/migrations/20260922_personal_access.sql` (ownership, row level security,
     removes the anonymous role's access)
6. If the account was created **after** migration 4 ran, the existing rows have no owner yet
   and are invisible to the app. They were not deleted. Claim them once, in the SQL editor:

   ```sql
   select public.rdn_assign_orphan_rows();
   ```

   It returns how many rows it attributed, and refuses rather than guessing when the project
   has no account or more than one; in that case pass the id explicitly,
   `select public.rdn_assign_orphan_rows('<user id>');`. It is safe to run twice: the second
   run claims nothing. Ordinary updates cannot do this job, because the merge guards from
   migration 3 answer an update by returning the stored row, so the function turns each guard
   off for its own statement and straight back on within the same transaction.
7. Run `select public.rdn_sync_protocol();` in the SQL editor. It must return `1`. That
   proves the three merge guards exist and are enabled; it does not prove the browser can
   reach the project. If it returns `0` right after step 6, a guard was left disabled by an
   interrupted run: re-apply `20260921_safe_cross_device_sync.sql`.
8. Rebuild and redeploy, because `NEXT_PUBLIC_*` values are baked in at build time. Then open
   Profile on the iMac, sign in, and press **Sync now**. If a device shows less than it
   should, import its backup from step 0 and sync again: imports merge, they do not replace.
9. Repeat the sign-in on the iPad using the same account.

## Who can read the data

The anon key is part of the published page, so it cannot protect anything by itself. After
migration 4 the three tables grant nothing to the anonymous role: every row belongs to a
`user_id`, row level security only lets that user read or write it, and the app signs in
from Profile. `npm run test:db` checks exactly this, including that a second signed-in user
sees none of the owner's rows and that the anonymous role is refused outright, cannot read a
recovered project, and cannot run the attribution function.

`user_id` is deliberately nullable. A row that reaches the table without an owner is kept and
can be claimed (step 6 above) instead of being rejected and lost, and nothing can create one
through the API anyway: the insert policy requires `auth.uid() = user_id`, which is never
true when either side is null.

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

The 14 persistence checks cover payloads and local/backup round trips. The 14
integration checks run the actual store and SQL migrations with two independent
device stores and real PostgreSQL, including that sync writes nothing without a
signed-in session. The 34 database checks (`npm run test:db`) cover the three setup
orders: an empty project, a populated project migrated before the account exists,
and a populated project with the account created first. They cover stale and overlapping uploads,
missing metadata, review conflicts, in-flight study actions, read/write failures,
pagination beyond 1,000 rows, backup restoration, repeatable migrations, and the
missing-migration guard. These checks do not replace the live device acceptance
check above.
