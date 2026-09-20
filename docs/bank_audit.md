# Question bank audit

Bank: `src/lib/questions.ts` - 1178 questions.

## 1. Integrity

No problems found.

## 2. Answer-length cue

Method: option length measured in characters and, separately, in words. 'Strictly longest' means no other option ties it. The guessing strategies split ties at random, so a four-way tie contributes 0.25. Chance = 25%.


**By characters** (n = 1178)

- Key is strictly the longest option: 27.6%
- Key is strictly the shortest option: 10.3%
- Always pick the Nth longest: 1st=32.9%, 2th=28.1%, 3th=23.5%, 4th=15.5%
- 'Pick the visibly longest' (>10% longer than the runner-up): rule fires on 245 questions and is right 16.7% of the time there; guessing elsewhere the whole strategy scores 23.3%


**By words** (n = 1178)

- Key is strictly the longest option: 13.3%
- Key is strictly the shortest option: 12.2%
- Always pick the Nth longest: 1st=25.8%, 2th=23.5%, 3th=24.4%, 4th=26.2%
- 'Pick the visibly longest' (>10% longer than the runner-up): rule fires on 415 questions and is right 27.7% of the time there; guessing elsewhere the whole strategy scores 26.0%


Length is only one cue. Grammar agreement, absurd distractors and excess detail are reviewed by reading items, not by this script.


## 3. Topic coverage

A question counts for a topic only when the pattern matches the STEM or the CORRECT ANSWER. Matches confined to a distractor or an explanation are excluded.


| Topic | n | Domains | Sample ids |
| --- | ---: | --- | --- |
| 1. Break-even point | 4 | I, III, IV | m1-calc-009, m3-gen-12, m4-pdf-70, m3-polish-13 |
| 2. EP/AP yield and purchasing quantities | 5 | I, IV | m1-calc-015, m1-calc-019, m4-pdf-30, m4-pdf-96 ... |
| 3. Forecasting and moving averages | 4 | I, IV | m1-calc-026, m4-pdf-28, m4-pdf-31, m4-gf-sus-06 |
| 4. Employee turnover rate | 5 | III, IV | m3-pdf-64, dom3-ext-003, m3-fsl-003, m4-pdf-67 ... |
| 5. Food cost, selling price, profit margin | 25 | I, III, IV | m1-calc-007, m1-calc-013, m1-calc-020, m1-calc-021 ... |
| 6. Meals per labor hour | 4 | III, IV | m3-mgmt-002, m4-gf-me-04, m3-gf-mplh-01, m3-gf-mplh-02 |
| 7. Foodservice temperatures | 12 | II, IV | dom2-ext-008, m2-renal-004, m4-pdf-22, m4-pdf-47 ... |
| 8. Motion economy and work simplification | 5 | III, IV | m3-fsl-032, m4-gf-me-01, m4-gf-me-02, m4-gf-me-03 ... |
| 9. Indirect and fixed costs | 8 | I, III, IV | m1-calc-009, m1-calc-010, m3-gen-12, dom3-fq-001 ... |
| 10. Leadership styles in a crisis | 7 | III | m3-pdf-63, m3-pdf-73, dom3-ext-010, m3-mgmt-013 ... |
| 11. Commissary, transport and HACCP | 12 | III, IV | m3-fsl-007, m4-pdf-22, m4-pdf-23, m4-pdf-26 ... |
| 12. Labor relations and union arrangements | 13 | III | m3-pdf-04, m3-pdf-05, m3-pdf-08, m3-pdf-13 ... |
| 13. FLSA and Civil Rights Act | 8 | II, III, IV | m2-mnt-120, m3-gen-03, m3-pdf-13, m3-pdf-74 ... |
| 14. Can sizes, yields and case packs | 6 | I, IV | m1-calc-002, m1-calc-003, m1-calc-018, m4-gf-can-01 ... |
| 15. Additives, antioxidants, preservatives, emulsifiers | 9 | I, IV | dom1-ext-010, dom1-fs-003, m1-fs-008, m1-fs-022 ... |
| 16. Processing, preservation, packaging | 10 | I, II, III, IV | m1-fs-002, m1-fs-009, m1-fs-019, m1-fs-021 ... |
| 17. MNT for PKU | 8 | I, II | m1-fs-023, m2-mnt-041, m2-mnt-054, m2-mnt-198 ... |
| 18. MNT for cystic fibrosis | 8 | I, II | m1-nn-020, dom2-ext-004, m2-mnt-082, m2-renal-005 ... |
| 19. MNT for MSUD | 4 | II | m2-mnt-042, m2-gf-msud-01, m2-gf-msud-02, m2-gf-msud-03 |
| 20. Differentiating anemias | 23 | I, II | dom1-ext-006, m1-nn-024, m1-nn2-013, m2-mnt-036 ... |
| 21. Renal physiology and labs | 16 | II, III | dom2-ext-007, dom2-ext-013, m2-mnt-130, m2-mnt-131 ... |
| 22. Celiac disease and food choices | 11 | I, II | dom1-ext-004, m1-fs-006, m1-fs-007, dom2-dm-002 ... |
| 23. Nutrition diagnosis in pressure injuries | 8 | II | dom2-dm-003, m2-mnt-013, m2-mnt-014, m2-mnt-026 ... |
| 24. Parenteral nutrition calculations | 31 | II, III | dom2-dm-004, dom2-dm-008, m2-entp-013, m2-entp-014 ... |
| 25. Enteral volume, free water, fluid needs | 13 | I, II | m1-nn2-002, m2-mnt-130, m2-mnt-015, m2-renal-007 ... |
| 26. Intermittent vs continuous enteral delivery | 10 | II | m2-entp-006, m2-entp-016, m2-entp-019, m2-entp-022 ... |
| 27. Glycolysis, gluconeogenesis, glycogenolysis | 5 | I | dom1-ext-003, dom1-ext2-002, dom1-ext2-006, m1-gf-path-01 ... |
| 28. Pregnancy and lactation requirements | 18 | I, II, IV | m1-nn2-014, m1-rc-023, dom2-ext2-002, m2-mnt-106 ... |
| 29. Sodium and potassium reference intakes | 15 | I, II | m1-rc-006, dom2-ext-008, m2-mnt-077, m2-mnt-084 ... |
| 30. Warfarin and vitamin K | 5 | I, II | m1-nn-015, m1-nn2-009, m1-nn2-020, dom2-ext-011 ... |
| 31. Eating disorder terminology and assessment | 14 | II | dom2-dm-008, m2-mnt-194, m2-mnt-195, m2-mnt-016 ... |
| 32. PCOS | 13 | II | m2-mnt-117, m2-mnt-118, m2-mnt-119, m2-mnt-186 ... |
| 33. Addison disease | 3 | II | m2-gf-addi-01, m2-gf-addi-02, m2-gf-addi-03 |
| 34. Vegan and lacto-vegetarian nutrition | 4 | I | dom1-ext-006, m1-nn-006, m1-nn-007, m1-nn2-029 |
| 35. Physical signs of deficiency | 9 | I, II | m1-nn-027, dom2-ext-006, m2-mnt-052, m2-gf-hiv-01 ... |
| 36. FOCUS process improvement | 5 | III | m3-pdf-41, m3-pdf-58, dom3-fq-003, m3-mgmt-057 ... |
| 37. B-vitamin deficiencies | 34 | I, II | dom1-ext-001, dom1-ext-006, dom1-ext-015, m1-fs-011 ... |
| 38. Education, needs assessment, program planning | 5 | I, II, III | m1-gap-07, m1-gap-17, m3-pdf-59, m3-gf-pp-01 ... |
| 39. Counseling and motivational interviewing | 26 | I, II, III | m1-gap-03, m1-gap-05, m1-gap-11, m1-gap-12 ... |
| 40. Dietary assessment and anthropometry | 23 | I, II, III | m1-rc-004, m1-rc-018, dom2-dm-005, dom2-ext-001 ... |
| 41. Cross-sectional, RCT and cohort designs | 11 | I | dom1-ext-002, dom1-ext-011, m1-rc-001, m1-rc-002 ... |
| 42. Null hypothesis | 3 | I | m1-gf-stat-01, m1-gf-stat-02, m1-gf-stat-03 |
| 43. Causation versus association | 5 | I | dom1-ext-007, m1-rc-005, m1-rc-006, m1-rc-017 ... |
| 44. Prevalence and epidemiology | 11 | I, II | m1-rc-005, m1-rc-011, m1-rc-013, m1-rc-014 ... |
| 45. Medical terminology | 8 | I, II | m2-mnt-051, m2-mnt-130, m2-mnt-202, m2-gf-ena-01 ... |
| 46. Communication and technology in education | 8 | I, II, III | m1-gap-02, m1-gap-20, m1-gap-24, m3-gf-tele-01 ... |
| 47. Choosing a communication channel | 15 | I, III | m1-gap-02, m1-gap-08, m1-gap-20, dom1-ext-013 ... |
| 48. Management and leadership | 6 | III | m3-pdf-02, m3-pdf-69, m3-pdf-76, m3-pdf-80 ... |
| 49. Best-answer applied cases (skill) | 170 | I, II, III, IV | m1-gap-20, m1-gap-21, m1-calc-026, dom1-ext-004 ... |
| 50. First-action prioritisation (skill) | 44 | I, II, III, IV | dom1-ext2-002, m1-rc-016, dom2-dm-004, dom2-ext-005 ... |

**Under 4 questions (operational alert, not proof of mastery):** 33. Addison disease (3), 42. Null hypothesis (3)
