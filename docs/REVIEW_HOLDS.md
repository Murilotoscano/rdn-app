# Review holds and study progress

`src/data/review-hold.json` is a conservative list of question IDs flagged in the November 2026 first-pass content audit. It includes confirmed defects and issues that still need source or ambiguity adjudication. A hold does not mean every listed key is wrong. Existing question IDs, error logs, exposure and exam history remain intact.

`AVAILABLE_QUESTIONS` excludes held IDs from new main-bank practice, mock forms and review questions; held IDs are also excluded from actionable review counts. Held lesson questions are hidden. CDR item 2 is separately excluded from CDR scoring because the official September 2024 key and its rationale conflict with the app's key. Do not change it by inference. Historical scores are not retroactively recalculated.

Before releasing a held item, review its complete stem, options, key and rationale against current primary sources, record the source/date and relevant scope, verify a unique best answer and add regression tests. The existence of an unheld item is not scientific certification. Full audit reports remain private with the project owner.

The new first-week material is authored foundation practice, not official CDR questions or a calibrated readiness test. The 45-day plan has no assumed exam date. The current mock uses the 2022–2026 domain weights; the 2027 outline requires separate mapping.

Lesson responses store original option indices in `rdn_lesson_progress`, so display shuffling does not change saved answers. Lesson progress is device-local, is included in version-4 profile backups and merges on import; it does not sync through Supabase. Existing v1–v3 backups remain importable. Do not clear storage or migrate existing progress without explicit authorization.

Checks: `node --import tsx scripts/lesson_audit_test.cjs`, `npm run test:persistence`, `npm run test:sync`, `npm run test:db`, `npx tsc --noEmit --incremental false` and `npm run build`. Local PostgreSQL simulations do not verify the live Supabase installation or a second device. `next-pwa` generates `public/sw.js` on production builds; a cached installed iPad PWA may take time or user action to pick up a deployment, and should be checked on the device without clearing data.
