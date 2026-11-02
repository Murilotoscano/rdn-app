# Corrections: first calculation batch

The following IDs were corrected and released from the review hold after recalculating the stated inputs and checking the keyed answer and four alternatives. Their IDs remain unchanged; past answers and scores reflect the previous item wording and are not retroactively recalculated.

| ID | Correction |
|---|---|
| m1-calc-010 | Round break-even to 2,834 whole units. |
| m1-calc-013 | Ask explicitly for per-meal variance. |
| m1-calc-018 | Specify drained mass and per-can yield; do not equate fluid volume with weight. |
| m1-calc-021 | Specify a combined 82% food-and-labor target. |
| m1-calc-023 | Correct the contribution share to 98% and distinguish it from net profit. |
| m1-calc-025 | Specify cooked serving weights and whole-pound purchase; minimum 71 lb. |
| dom4-ext-006 | Specify cooked turkey requirement before applying yield. |
| m2-entp-030 | Make factors and absence of additives explicit; answer 2,000 mOsm/L under those assumptions. This arithmetic exercise is not a clinical access protocol. |
| m1-rc-011 | Correct disease-free population to 9,900. |
| m3-polish-27 | Correct nearest-cent selling price to $6.06. |

Four changes made in commit f682cd8 were also checked and released: m2-mnt-103 (minimum fasting threshold), m2-mnt-156 (Mifflin calculation), m4-pdf-30 (EP and AP unit-price comparison), m4-pdf-90 (165°F instantaneous in [FDA Food Code 2022](https://www.fda.gov/media/164194/download), section 3-401.11). The CDR 2 discrepancy remains unresolved. Unreleased flags remain on the hold list; absence of a hold does not certify an item or predict an exam result.

Run `node --import tsx scripts/numerical_batch_test.cjs` and `node --import tsx scripts/lesson_audit_test.cjs` alongside the project regression suite.
