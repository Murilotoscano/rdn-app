# Question bank: source of truth and maintenance

## Where the questions live

`src/lib/questions.ts` is the **single source of truth**. The array
`SAMPLE_QUESTIONS: Question[]` is what the app imports, and every correction lands there.

The 57 `*.json` files in `src/lib/` (`domain2_gapfill_*.json`, `domain1_extra*.json`, and
friends) are **historical generation inputs**. Nothing imports them, and they have not been
updated since the corrections that began with commit `c539c6b`. They are missing:

- the answer-option length balancing (587 questions),
- the 17 content corrections, including four wrong answer keys,
- the removal of options and explanations that referenced other options by letter,
- every question added or revised afterwards.

**Regenerating `questions.ts` from those JSON files would silently undo all of it.** If a
future batch is generated, append to the bank rather than rebuilding it, and run the audit
below before committing.

## Audit

```bash
python3 scripts/bank_audit.py                      # summary
python3 scripts/bank_audit.py --markdown docs/bank_audit.md
```

The script checks three things and documents its own method: integrity (unique ids, four
distinct options, valid `correctIndex`, no option that points at another option by letter,
no non-Latin characters), the answer-length cue (measured in characters and in words, with
tie handling stated), and topic coverage (a question counts for a topic only when the
pattern matches the stem or the correct answer, never a distractor or an explanation).

## Rules that the bank has to keep satisfying

1. **Options are shuffled at runtime** (`src/lib/shuffle.ts`), so no option may refer to
   another by letter ("Both B and C"), and no explanation may say "Option A is wrong".
   Explanations refer to content instead.
2. **One defensible best answer per item.** When two options are both defensible, the item
   is rewritten, not left for the student to guess at.
3. **Date the guidance when it changes the answer.** Items affected by the Dietary
   Guidelines 2025-2030, the 2024 school meal rule or Public Law 119-69 name the edition,
   the programme and the date in the stem or the explanation.
4. **Mock exams are drawn to the CDR 2022-2026 matrix** (Domain I 21%, II 45%, III 21%,
   IV 13%) by `sampleByBlueprint`, and the mock is a fixed 145-question form, not a
   reproduction of the adaptive exam.
5. **Nothing from a real exam.** CDR exam content is confidential. Candidate recollections
   on public forums are used only to order revision by topic, never copied as items.
