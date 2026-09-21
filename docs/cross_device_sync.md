# Cross-device sync: rollout and validation

This change prevents an older device from overwriting newer completed-exam metadata,
question exposure, or review state. It covers the review queue, completed exams and
per-question attempted/exposed history. CDR progress, generated questions and their
progress remain in the downloadable backup.

The migrations were tested against PostgreSQL through PGlite. They have **not been
applied to the live Supabase project as part of this change**. The automated tests
use a transport adapter and do not validate the live project's network, PostgREST
configuration, grants or RLS policies.

## Apply before releasing the app

1. Export the existing study record from Profile on each device with local progress.
2. Confirm the intended Supabase project is active and its URL is reachable. In the
   hosting project's environment, verify `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` against that project. Do not commit key values or
   use a service-role key in the browser.
3. Apply these files in order through the normal database migration workflow or
   the project's SQL editor:
   - `supabase/migrations/20260920_exam_fields_and_question_exposure.sql`
   - `supabase/migrations/20260921_safe_cross_device_sync.sql`
4. Run `select public.rdn_sync_protocol();` in the SQL editor. The result must be `1`.
   This checks that all three merge guards are installed and enabled; it does not
   by itself prove that the browser can access the project.
5. Release the app with the verified environment values. Public Next.js environment
   values are included at build time, so changing them requires a new build.
6. Open Profile and select **Sync now**. Success must follow the complete download,
   merge, upload and readback flow. A missing migration or failed request produces
   **Cloud sync incomplete**, while retaining local progress.

Both migrations can be repeated. The new migration uses a transaction and changes
no existing access policies. Its triggers also protect uploads from a cached older
app version. If the UI needs to be rolled back, leave the additive columns, table
and merge guards in place so old clients remain protected.

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
npm run audit:bank
npm run build
```

The 14 persistence checks cover payloads and local/backup round trips. The 13
integration checks run the actual store and SQL migrations with two independent
device stores and real PostgreSQL. They cover stale and overlapping uploads,
missing metadata, review conflicts, in-flight study actions, read/write failures,
pagination beyond 1,000 rows, backup restoration, repeatable migrations, and the
missing-migration guard. These checks do not replace the live device acceptance
check above.
