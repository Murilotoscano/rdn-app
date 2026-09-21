# Question bank audit

Bank: `src/lib/questions.ts` - 1179 questions.

## 1. Integrity

No problems found.

## 2. Answer-length cue

Method: option length measured in characters and, separately, in words. 'Strictly longest' means no other option ties it. The guessing strategies split ties at random, so a four-way tie contributes 0.25. Chance = 25%.


**By characters** (n = 1179)

- Key is strictly the longest option: 27.7%
- Key is strictly the shortest option: 10.2%
- Always pick the Nth longest: 1st=33.0%, 2th=28.1%, 3th=23.5%, 4th=15.5%
- 'Pick the visibly longest' (>10% longer than the runner-up): rule fires on 246 questions and is right 16.7% of the time there; guessing elsewhere the whole strategy scores 23.3%


**By words** (n = 1179)

- Key is strictly the longest option: 13.5%
- Key is strictly the shortest option: 12.3%
- Always pick the Nth longest: 1st=26.0%, 2th=23.5%, 3th=24.3%, 4th=26.2%
- 'Pick the visibly longest' (>10% longer than the runner-up): rule fires on 418 questions and is right 27.8% of the time there; guessing elsewhere the whole strategy scores 26.0%


**Absolute-qualifier cue** ('always', 'never', 'all', 'only', 'every', 'none'): dropping every option that contains one and guessing among the rest scores 27.2% (chance 25%); it isolates the key on its own in 0 question(s).


Length is only one cue. Grammar agreement, absurd distractors and excess detail are reviewed by reading items, not by this script.


## 3. Topic coverage

Regression cases: all 21 pass (including serum sodium versus food temperatures, LADA versus employment law, inventory versus employee turnover, and word-boundary checks for labor relations, PDSA and leadership).

A question counts for a topic only when the pattern matches the STEM or the CORRECT ANSWER. Matches confined to a distractor or an explanation are excluded.


| Topic | n | Domains | Sample ids |
| --- | ---: | --- | --- |
| 1. Break-even point | 4 | I, III, IV | m1-calc-009, m3-gen-12, m4-pdf-70, m3-polish-13 |
| 2. EP/AP yield and purchasing quantities | 5 | I, IV | m1-calc-015, m1-calc-019, m4-pdf-30, m4-pdf-96 ... |
| 3. Forecasting and moving averages | 4 | I, IV | m1-calc-026, m4-pdf-28, m4-pdf-31, m4-gf-sus-06 |
| 4. Employee turnover rate | 0 | - |  |
| 5. Food cost, selling price, profit margin | 25 | I, III, IV | m1-calc-007, m1-calc-013, m1-calc-020, m1-calc-021 ... |
| 6. Meals per labor hour | 4 | III, IV | m3-mgmt-002, m4-gf-me-04, m3-gf-mplh-01, m3-gf-mplh-02 |
| 7. Foodservice temperatures | 18 | I, III, IV | m1-fs-013, m1-fs-019, dom3-fq-009, m3-fsl-014 ... |
| 8. Motion economy and work simplification | 5 | III, IV | m3-fsl-032, m4-gf-me-01, m4-gf-me-02, m4-gf-me-03 ... |
| 9. Indirect and fixed costs | 8 | I, III, IV | m1-calc-009, m1-calc-010, m3-gen-12, dom3-fq-001 ... |
| 10. Leadership styles in a crisis | 7 | III | m3-pdf-63, m3-pdf-73, dom3-ext-010, m3-mgmt-013 ... |
| 11. Commissary, transport and HACCP | 12 | III, IV | m3-fsl-007, m4-pdf-22, m4-pdf-23, m4-pdf-26 ... |
| 12. Labor relations and union arrangements | 16 | I, III | dom1-ext2-008, m3-pdf-04, m3-pdf-05, m3-pdf-08 ... |
| 13. FLSA and Civil Rights Act | 6 | III | m3-gen-03, m3-pdf-13, m3-pdf-74, dom3-ext-004 ... |
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
| 24. Parenteral nutrition calculations | 32 | II, III | dom2-dm-004, dom2-dm-008, m2-entp-013, m2-entp-014 ... |
| 25. Enteral volume, free water, fluid needs | 13 | I, II | m1-nn2-002, m2-mnt-130, m2-mnt-015, m2-renal-007 ... |
| 26. Intermittent vs continuous enteral delivery | 10 | II | m2-entp-006, m2-entp-016, m2-entp-019, m2-entp-022 ... |
| 27. Glycolysis, gluconeogenesis, glycogenolysis | 5 | I | dom1-ext-003, dom1-ext2-002, dom1-ext2-006, m1-gf-path-01 ... |
| 28. Pregnancy and lactation requirements | 18 | I, II, IV | m1-nn2-014, m1-rc-023, dom2-ext2-002, m2-mnt-106 ... |
| 29. Sodium and potassium reference intakes | 7 | I, II | m1-rc-006, m2-mnt-077, m2-mnt-084, m2-mnt-123 ... |
| 30. Warfarin and vitamin K | 5 | I, II | m1-nn-015, m1-nn2-009, m1-nn2-020, dom2-ext-011 ... |
| 31. Eating disorder terminology and assessment | 15 | II | dom2-dm-008, m2-mnt-194, m2-mnt-195, m2-mnt-016 ... |
| 32. PCOS | 13 | II | m2-mnt-117, m2-mnt-118, m2-mnt-119, m2-mnt-186 ... |
| 33. Addison disease | 3 | II | m2-gf-addi-01, m2-gf-addi-02, m2-gf-addi-03 |
| 34. Vegan and lacto-vegetarian nutrition | 4 | I | dom1-ext-006, m1-nn-006, m1-nn-007, m1-nn2-029 |
| 35. Physical signs of deficiency | 9 | I, II | m1-nn-027, dom2-ext-006, m2-mnt-052, m2-gf-hiv-01 ... |
| 36. FOCUS process improvement | 6 | III | m3-pdf-41, m3-pdf-58, dom3-fq-003, m3-mgmt-057 ... |
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
| 48. Management and leadership | 22 | III, IV | m3-pdf-02, m3-pdf-12, m3-pdf-62, m3-pdf-63 ... |
| 49. Best-answer applied cases (skill) | 170 | I, II, III, IV | m1-gap-20, m1-gap-21, m1-calc-026, dom1-ext-004 ... |
| 50. First-action prioritisation (skill) | 44 | I, II, III, IV | dom1-ext2-002, m1-rc-016, dom2-dm-004, dom2-ext-005 ... |

### Matched ids per topic

Ids below are AUTOMATIC matches of the documented pattern unless a note says the item was read and judged. A count is not evidence that the topic is adequately covered: it says how many items mention it in the stem or in the key.


**1. Break-even point** (4) - pattern: `break-?even`

- automatic: m1-calc-009, m3-gen-12, m4-pdf-70, m3-polish-13

**2. EP/AP yield and purchasing quantities** (5) - pattern: `edible portion|as purchased|yield (factor|test|percent)|\bEP\b|\bAP\b`

- automatic: m1-calc-015, m1-calc-019, m4-pdf-30, m4-pdf-96, dom4-ext-006

**3. Forecasting and moving averages** (4) - pattern: `forecast|moving average`

- automatic: m1-calc-026, m4-pdf-28, m4-pdf-31, m4-gf-sus-06

**4. Employee turnover rate** (0) - pattern: `\bturnover\b` + required context: `\b(?:employees?|staff|personnel|workforce|workers?|resign\w*|separatio`

- automatic: none

- reviewed by hand: `m3-pdf-64` - EXCLUDED: inventory or storage turnover does not assess employee turnover

- reviewed by hand: `dom3-ext-003` - EXCLUDED: inventory or storage turnover does not assess employee turnover

- reviewed by hand: `m3-fsl-003` - EXCLUDED: inventory or storage turnover does not assess employee turnover

- reviewed by hand: `m4-pdf-67` - EXCLUDED: inventory or storage turnover does not assess employee turnover

- reviewed by hand: `m4-gf-fp-08` - EXCLUDED: inventory or storage turnover does not assess employee turnover

**5. Food cost, selling price, profit margin** (25) - pattern: `food cost|cost per meal|selling price|profit margin|contribution margin|markup`

- automatic: m1-calc-007, m1-calc-013, m1-calc-020, m1-calc-021, m1-calc-023, m3-gen-06, m3-gen-12, m3-pdf-72, dom3-fq-004, dom3-fq-009, m3-fsl-003, m3-fsl-013, m4-pdf-03, m4-pdf-06, m4-pdf-39, m4-pdf-64, m4-pdf-80, m4-pdf-81, m4-pdf-82, m4-pdf-86, m3-polish-13, m3-polish-14, m3-polish-19, m3-polish-27, m4-gf-sus-08

**6. Meals per labor hour** (4) - pattern: `meals per labor|labor hour|productivity`

- automatic: m3-mgmt-002, m4-gf-me-04, m3-gf-mplh-01, m3-gf-mplh-02

**7. Foodservice temperatures** (18) - pattern: `\b(?:1[0-9]{2}|[4-9][0-9])\s?(?:°|degrees?\s?)(?:F|C|Fahrenheit|Celsius)\b|danger zone|internal temperature|ho`

- automatic: m1-fs-013, m1-fs-019, dom3-fq-009, m3-fsl-014, m3-fsl-015, m3-fsl-024, m4-pdf-47, m4-pdf-59, m4-pdf-84, m4-pdf-90, m4-pdf-91, dom4-ext-001, dom4-ext-004, dom4-ext-007, m4-gf-dist-05, m4-gf-dist-07, m4-gf-dist-08, m4-gf-first-05

- reviewed by hand: `m2-renal-004` - EXCLUDED: '155 mmol/L' is serum sodium, not a food temperature

- reviewed by hand: `m4-pdf-90` - INCLUDED: minimum internal cooking temperature for poultry

- reviewed by hand: `m4-pdf-47` - INCLUDED: defines the temperature danger zone

**8. Motion economy and work simplification** (5) - pattern: `motion economy|work simplification|process flow chart|pathway chart`

- automatic: m3-fsl-032, m4-gf-me-01, m4-gf-me-02, m4-gf-me-03, m4-gf-me-04

**9. Indirect and fixed costs** (8) - pattern: `fixed cost|indirect cost|overhead|variable cost`

- automatic: m1-calc-009, m1-calc-010, m3-gen-12, dom3-fq-001, dom3-fq-004, m4-pdf-70, m3-polish-13, m3-polish-22

**10. Leadership styles in a crisis** (7) - pattern: `autocratic|situational leadership|hersey|leadership style`

- automatic: m3-pdf-63, m3-pdf-73, dom3-ext-010, m3-mgmt-013, m3-mgmt-014, m3-mgmt-016, m3-mgmt-027

**11. Commissary, transport and HACCP** (12) - pattern: `commissary|cook-?chill|satellite|critical control point|HACCP`

- automatic: m3-fsl-007, m4-pdf-22, m4-pdf-23, m4-pdf-26, m4-pdf-32, m4-pdf-35, m4-pdf-54, m4-pdf-72, dom4-ext-002, dom4-ext-007, m4-gf-dist-05, m4-gf-dist-08

**12. Labor relations and union arrangements** (16) - pattern: `union shop|agency shop|closed shop|collective bargaining|right-to-work|picket|arbitration|arbitrator|\bmediati`

- automatic: dom1-ext2-008, m3-pdf-04, m3-pdf-05, m3-pdf-08, m3-pdf-11, m3-pdf-13, m3-pdf-14, m3-pdf-19, m3-pdf-85, dom3-ext-009, m3-mgmt-009, m3-mgmt-010, m3-mgmt-012, m3-mgmt-023, m3-mgmt-030, m3-mgmt-043

**13. FLSA and Civil Rights Act** (6) - pattern: `fair labor standards|\bFLSA\b|civil rights act|title vii|minimum wage|overtime pay|\bovertime\b|\bFMLA\b|famil` + required context: `employ|labor|labour|hiring|discriminat|accommodat|wage|leave|workplace`

- automatic: m3-gen-03, m3-pdf-13, m3-pdf-74, dom3-ext-004, m3-mgmt-011, m3-mgmt-026

- reviewed by hand: `m2-mnt-120` - EXCLUDED: 'LADA' contains ADA but is a diabetes subtype, not the Americans with Disabilities Act

- reviewed by hand: `m3-pdf-74` - INCLUDED: FMLA leave entitlement

- reviewed by hand: `m3-mgmt-026` - INCLUDED: Civil Rights Act Title VII protected classes

**14. Can sizes, yields and case packs** (6) - pattern: `#10 can|#303|can size|case pack`

- automatic: m1-calc-002, m1-calc-003, m1-calc-018, m4-gf-can-01, m4-gf-can-02, m4-gf-can-03

**15. Additives, antioxidants, preservatives, emulsifiers** (9) - pattern: `\bBHA\b|\bBHT\b|tocopherol|lecithin|pectin|sulfite|benzoate|propionate|nitrite|sequestrant|emulsifier|humectan`

- automatic: dom1-ext-010, dom1-fs-003, m1-fs-008, m1-fs-022, m4-pdf-71, m1-gf-add-01, m1-gf-add-02, m1-gf-add-03, m1-gf-add-04

**16. Processing, preservation, packaging** (10) - pattern: `pasteuri|irradiat|retort|aseptic|water activity|modified atmosphere|blanch|canning|high pressure processing`

- automatic: m1-fs-002, m1-fs-009, m1-fs-019, m1-fs-021, m1-fs-027, m3-pdf-63, m3-mgmt-014, m2-gf-hiv-03, m2-gf-pnc-10, m4-gf-inf-05

**17. MNT for PKU** (8) - pattern: `\bPKU\b|phenylketonuria|phenylalanine`

- automatic: m1-fs-023, m2-mnt-041, m2-mnt-054, m2-mnt-198, m2-gf-pku-01, m2-gf-pku-02, m2-gf-pku-03, m2-gf-pku-04

**18. MNT for cystic fibrosis** (8) - pattern: `cystic fibrosis|pancreatic enzyme`

- automatic: m1-nn-020, dom2-ext-004, m2-mnt-082, m2-renal-005, m2-gf-resp-02, m2-gf-resp-03, m2-gf-resp-07, m2-gf-panc-04

**19. MNT for MSUD** (4) - pattern: `\bMSUD\b|maple syrup urine|branched-chain amino acid`

- automatic: m2-mnt-042, m2-gf-msud-01, m2-gf-msud-02, m2-gf-msud-03

**20. Differentiating anemias** (23) - pattern: `anemia|ferritin|\bMCV\b|megaloblastic|koilonychia`

- automatic: dom1-ext-006, m1-nn-024, m1-nn2-013, m2-mnt-036, m2-mnt-064, m2-mnt-065, m2-mnt-066, m2-mnt-067, m2-mnt-085, m2-mnt-134, m2-mnt-166, m2-mnt-167, m2-mnt-168, m2-mnt-169, m2-mnt-170, m2-mnt-171, m2-mnt-172, m2-mnt-179, m2-renal-014, m2-renal-017, m2-gf-pnc-09, m2-gf-bar-01, m2-gf-nfpe-05

**21. Renal physiology and labs** (16) - pattern: `\bGFR\b|creatinine|\bBUN\b|dialysis|nephron|glomerul`

- automatic: dom2-ext-007, dom2-ext-013, m2-mnt-130, m2-mnt-131, m2-mnt-132, m2-mnt-133, m2-mnt-135, m2-mnt-148, m2-renal-004, m2-renal-020, m2-renal-023, m2-renal-026, m2-renal-030, m2-gf-enf-04, m2-gf-fld-05, m3-gf-tele-05

**22. Celiac disease and food choices** (11) - pattern: `celiac|gluten`

- automatic: dom1-ext-004, m1-fs-006, m1-fs-007, dom2-dm-002, m2-mnt-072, m2-mnt-073, m2-mnt-074, m2-mnt-178, m2-mnt-205, m2-gf-fa-08, m2-gf-fa-09

**23. Nutrition diagnosis in pressure injuries** (8) - pattern: `pressure (injury|ulcer)`

- automatic: dom2-dm-003, m2-mnt-013, m2-mnt-014, m2-mnt-026, m2-gf-cw-01, m2-gf-cw-04, m2-gf-cw-05, m2-gf-cw-06

**24. Parenteral nutrition calculations** (32) - pattern: `NPC:N|nitrogen|dextrose|osmolarity|parenteral`

- automatic: dom2-dm-004, dom2-dm-008, m2-entp-013, m2-entp-014, m2-entp-015, m2-entp-016, m2-entp-017, m2-entp-018, m2-entp-020, m2-entp-023, m2-entp-024, m2-entp-025, m2-entp-026, m2-entp-027, m2-entp-028, m2-entp-030, dom2-ext-013, dom2-ext2-009, m2-mnt-135, m2-gf-pnc-01, m2-gf-pnc-02, m2-gf-pnc-03, m2-gf-pnc-04, m2-gf-pnc-05, m2-gf-pnc-06, m2-gf-pnc-07, m2-gf-pnc-08, m2-gf-pnc-09, m2-gf-pnc-10, m2-gf-panc-01, m3-gf-sop-04, m2-gf-first-02

**25. Enteral volume, free water, fluid needs** (13) - pattern: `free water|fluid need|mL/kg|flush|formula volume`

- automatic: m1-nn2-002, m2-mnt-130, m2-mnt-015, m2-renal-007, m2-renal-008, m2-gf-enc-03, m2-gf-enc-05, m2-gf-enc-08, m2-gf-enf-09, m2-gf-fld-01, m2-gf-fld-07, m2-gf-fld-08, m2-gf-sci-05

**26. Intermittent vs continuous enteral delivery** (10) - pattern: `bolus|continuous (feed|infusion)|infusion rate|mL/hour`

- automatic: m2-entp-006, m2-entp-016, m2-entp-019, m2-entp-022, dom2-ext2-004, m2-gf-ena-03, m2-gf-ena-10, m2-gf-enc-10, m2-gf-pnc-02, m2-gf-first-03

**27. Glycolysis, gluconeogenesis, glycogenolysis** (5) - pattern: `glycolysis|gluconeogenesis|glycogenolysis|glycogenesis|Cori Cycle`

- automatic: dom1-ext-003, dom1-ext2-002, dom1-ext2-006, m1-gf-path-01, m1-gf-path-02

**28. Pregnancy and lactation requirements** (18) - pattern: `pregnan|lactation|breastfeed|gestational`

- automatic: m1-nn2-014, m1-rc-023, dom2-ext2-002, m2-mnt-106, m2-mnt-107, m2-mnt-108, m2-mnt-109, m2-mnt-110, m2-mnt-164, m2-mnt-165, m2-gf-fa-10, m2-gf-pcos-06, m2-gf-wic-01, m2-gf-wic-02, m2-gf-wic-03, m2-gf-wic-08, m4-gf-cacfp-03, m2-gf-pku-04

**29. Sodium and potassium reference intakes** (7) - pattern: `sodium intake|potassium intake|2,?300 mg|sodium restriction|adequate intake for (?:sodium|potassium)`

- automatic: m1-rc-006, m2-mnt-077, m2-mnt-084, m2-mnt-123, m2-mnt-153, m2-gf-mh-02, m1-gf-dga-04

**30. Warfarin and vitamin K** (5) - pattern: `warfarin|vitamin K`

- automatic: m1-nn-015, m1-nn2-009, m1-nn2-020, dom2-ext-011, m2-renal-018

**31. Eating disorder terminology and assessment** (15) - pattern: `anorexia nervosa|bulimia|binge|ARFID|refeeding`

- automatic: dom2-dm-008, m2-mnt-194, m2-mnt-195, m2-mnt-016, m2-mnt-017, m2-mnt-018, m2-mnt-019, m2-mnt-020, m2-mnt-021, m2-mnt-027, m2-mnt-030, m2-gf-mh-04, m2-gf-mh-07, m2-gf-pnc-08, m2-gf-first-02

**32. PCOS** (13) - pattern: `polycystic|\bPCOS\b`

- automatic: m2-mnt-117, m2-mnt-118, m2-mnt-119, m2-mnt-186, m2-mnt-187, m2-gf-pcos-01, m2-gf-pcos-02, m2-gf-pcos-03, m2-gf-pcos-04, m2-gf-pcos-05, m2-gf-pcos-06, m2-gf-pcos-07, m2-gf-pcos-08

**33. Addison disease** (3) - pattern: `addison|adrenal`

- automatic: m2-gf-addi-01, m2-gf-addi-02, m2-gf-addi-03

**34. Vegan and lacto-vegetarian nutrition** (4) - pattern: `vegan|vegetarian|complementary protein`

- automatic: dom1-ext-006, m1-nn-006, m1-nn-007, m1-nn2-029

**35. Physical signs of deficiency** (9) - pattern: `koilonychia|corkscrew|glossitis|cheilosis|Bitot|physical exam|temporalis|muscle wasting|fat loss`

- automatic: m1-nn-027, dom2-ext-006, m2-mnt-052, m2-gf-hiv-01, m2-gf-cnis-04, m2-gf-nfpe-01, m2-gf-nfpe-02, m2-gf-nfpe-03, m2-gf-nfpe-05

**36. FOCUS process improvement** (6) - pattern: `FOCUS-PDSA|FOCUS model|\bPDSA\b|\bPDCA\b|FADE model|continuous quality improvement`

- automatic: m3-pdf-41, m3-pdf-58, dom3-fq-003, m3-mgmt-057, m3-mgmt-058, m3-polish-16

**37. B-vitamin deficiencies** (34) - pattern: `thiamin|riboflavin|niacin|pyridoxine|B12|folate|beriberi|pellagra`

- automatic: dom1-ext-001, dom1-ext-006, dom1-ext-015, m1-fs-011, m1-nn-013, m1-nn-023, m1-nn-024, m1-nn-025, m1-nn-026, m1-nn-027, m1-nn-028, m1-nn2-001, m1-nn2-002, m2-mnt-058, m2-mnt-065, m2-mnt-066, m2-mnt-074, m2-mnt-075, m2-mnt-085, m2-mnt-086, m2-mnt-093, m2-mnt-124, m2-mnt-169, m2-mnt-170, m2-mnt-178, m2-mnt-179, m2-mnt-204, m2-gf-mh-04, m2-gf-mh-06, m2-gf-bar-01, m2-gf-bar-04, m2-gf-bar-09, m2-gf-pcos-04, m2-gf-first-02

**38. Education, needs assessment, program planning** (5) - pattern: `needs assessment|program planning|logic model|learning objective|formative evaluation|summative`

- automatic: m1-gap-07, m1-gap-17, m3-pdf-59, m3-gf-pp-01, m3-gf-pp-03

**39. Counseling and motivational interviewing** (26) - pattern: `motivational interviewing|stages of change|transtheoretical|OARS|sustain talk|counseling`

- automatic: m1-gap-03, m1-gap-05, m1-gap-11, m1-gap-12, m1-gap-15, m1-gap-18, m1-gap-19, m1-gap-20, m1-gap-22, m1-gap-25, dom1-ext-004, dom1-ext-009, dom1-ext2-010, m1-nn-007, dom2-dm-005, m2-mnt-102, m2-mnt-112, m2-gf-enf-07, m2-gf-hiv-08, m2-gf-mh-01, m2-gf-mh-02, m2-gf-mh-05, m2-gf-gout-05, m3-gf-eth-05, m3-gf-tele-01, m2-gf-pku-04

**40. Dietary assessment and anthropometry** (23) - pattern: `24-hour recall|food frequency|diet history|anthropometric|BMI|skinfold|waist circumference`

- automatic: m1-rc-004, m1-rc-018, dom2-dm-005, dom2-ext-001, dom2-ext2-005, m2-mnt-081, m2-mnt-082, m2-mnt-104, m2-mnt-188, m2-mnt-003, m2-mnt-004, m2-mnt-019, m2-mnt-027, m3-fsl-008, m3-mgmt-020, m2-gf-enc-02, m2-gf-mh-04, m2-gf-resp-01, m2-gf-resp-09, m2-gf-ms-01, m2-gf-ms-02, m2-gf-pcos-01, m2-gf-first-02

**41. Cross-sectional, RCT and cohort designs** (11) - pattern: `cross-sectional|randomized controlled|cohort|case-control`

- automatic: dom1-ext-002, dom1-ext-011, m1-rc-001, m1-rc-002, m1-rc-003, m1-rc-004, m1-rc-028, m1-polish-02, m1-polish-06, m1-polish-11, m1-polish-28

**42. Null hypothesis** (3) - pattern: `null hypothesis|type I error|type II error`

- automatic: m1-gf-stat-01, m1-gf-stat-02, m1-gf-stat-03

- reviewed by hand: `m1-gf-stat-01` - INCLUDED: asks the student to state the null hypothesis

- reviewed by hand: `m1-gf-stat-03` - INCLUDED: interpretation of failing to reject

**43. Causation versus association** (5) - pattern: `causation|correlation|confounder|odds ratio|relative risk`

- automatic: dom1-ext-007, m1-rc-005, m1-rc-006, m1-rc-017, m1-polish-07

**44. Prevalence and epidemiology** (11) - pattern: `prevalence|incidence|mortality|morbidity`

- automatic: m1-rc-005, m1-rc-011, m1-rc-013, m1-rc-014, m1-rc-015, m1-rc-016, m2-mnt-081, m1-polish-02, m1-polish-26, m1-polish-28, m3-gf-pp-04

**45. Medical terminology** (8) - pattern: `medical terminology|prefix|suffix|dysphagia|-emia|hepatomegaly|oliguria|pancytopenia`

- automatic: m2-mnt-051, m2-mnt-130, m2-mnt-202, m2-gf-ena-01, m2-gf-tbi-08, m1-gf-term-01, m1-gf-term-02, m1-gf-term-04

**46. Communication and technology in education** (8) - pattern: `teach-back|health literacy|telehealth|readability|handout|learning style`

- automatic: m1-gap-02, m1-gap-20, m1-gap-24, m3-gf-tele-01, m3-gf-tele-02, m3-gf-tele-03, m3-gf-tele-04, m2-gf-dga-06

**47. Choosing a communication channel** (15) - pattern: `interpreter|literacy|cultural|channel|written material`

- automatic: m1-gap-02, m1-gap-08, m1-gap-20, dom1-ext-013, m3-gen-07, m3-pdf-25, m3-pdf-26, m3-pdf-29, m3-pdf-34, m3-pdf-39, m3-fsl-009, m3-mgmt-053, m3-mgmt-054, m3-mgmt-055, m3-mgmt-056

**48. Management and leadership** (22) - pattern: `\bleadership\b|\bdelegat|span of control|Theory [XYZ]\b|management skill|scalar principle|chain of command`

- automatic: m3-pdf-02, m3-pdf-12, m3-pdf-62, m3-pdf-63, m3-pdf-69, m3-pdf-73, m3-pdf-75, m3-pdf-76, m3-pdf-80, dom3-ext-010, m3-mgmt-004, m3-mgmt-013, m3-mgmt-014, m3-mgmt-015, m3-mgmt-027, m3-mgmt-032, m3-mgmt-033, m3-mgmt-034, m3-mgmt-037, m3-mgmt-042, m3-mgmt-045, m4-pdf-63

**49. Best-answer applied cases (skill)** (170) - pattern: `\bBEST\b|most appropriate|most likely`

- automatic: m1-gap-20, m1-gap-21, m1-calc-026, dom1-ext-004, dom1-fs-001, m1-fs-008, m1-fs-014, m1-nn2-007, m1-nn2-014, m1-nn2-022, m1-rc-021, dom2-dm-001, dom2-dm-002, dom2-dm-005, dom2-dm-006, dom2-dm-010, m2-entp-003, m2-entp-004, m2-entp-006, m2-entp-007, m2-entp-009, m2-entp-010, m2-entp-022, dom2-ext-005, dom2-ext-010, dom2-ext2-003, dom2-ext2-008, dom2-ext2-009, m2-mnt-032, m2-mnt-034, m2-mnt-038, m2-mnt-046, m2-mnt-051, m2-mnt-056, m2-mnt-057, m2-mnt-061, m2-mnt-062, m2-mnt-064, m2-mnt-065, m2-mnt-066, m2-mnt-069, m2-mnt-070, m2-mnt-077, m2-mnt-079, m2-mnt-083, m2-mnt-085, m2-mnt-086, m2-mnt-088, m2-mnt-091, m2-mnt-101, m2-mnt-121, m2-mnt-122, m2-mnt-126, m2-mnt-153, m2-mnt-168, m2-mnt-169, m2-mnt-173, m2-mnt-175, m2-mnt-190, m2-mnt-191, m2-mnt-195, m2-mnt-202, m2-mnt-004, m2-mnt-013, m2-mnt-021, m2-mnt-028, m2-renal-012, m2-renal-025, m3-pdf-17, m3-pdf-63, m3-fsl-005, m3-fsl-018, m3-fsl-019, m3-fsl-020, m3-mgmt-015, m3-mgmt-016, m3-mgmt-024, m3-mgmt-036, m3-mgmt-055, m3-mgmt-059, m4-pdf-25, m4-pdf-44, m4-pdf-75, m4-pdf-92, dom4-ext-010, m1-polish-11, m3-polish-25, m2-gf-ena-01, m2-gf-ena-02, m2-gf-ena-03, m2-gf-ena-05, m2-gf-ena-06, m2-gf-ena-08, m2-gf-ena-10, m2-gf-enc-01, m2-gf-enc-03, m2-gf-enc-05, m2-gf-enc-06, m2-gf-enc-07, m2-gf-enc-08, m2-gf-enc-09, m2-gf-enc-10, m2-gf-enf-01, m2-gf-enf-02, m2-gf-enf-05, m2-gf-enf-06, m2-gf-enf-08, m2-gf-enf-09, m2-gf-enf-10, m2-gf-fld-04, m2-gf-fld-05, m2-gf-fa-02, m2-gf-fa-06, m2-gf-fa-08, m2-gf-fa-10, m2-gf-hiv-04, m2-gf-hiv-06, m2-gf-hiv-07, m2-gf-mh-04, m2-gf-mh-08, m2-gf-pnc-01, m2-gf-pnc-03, m2-gf-pnc-04, m2-gf-pnc-05, m2-gf-pnc-07, m2-gf-pnc-09, m2-gf-resp-01, m2-gf-resp-02, m2-gf-resp-04, m2-gf-resp-07, m2-gf-resp-08, m2-gf-resp-10, m2-gf-cw-01, m2-gf-bar-01, m2-gf-bar-02, m2-gf-bar-08, m2-gf-cnis-01, m2-gf-cnis-02, m2-gf-cnis-03, m2-gf-cnis-04, m2-gf-cnis-05, m2-gf-cnis-06, m2-gf-cnis-07, m2-gf-cnis-09, m2-gf-ms-04, m2-gf-ms-07, m2-gf-gout-05, m2-gf-gout-08, m2-gf-tbi-02, m2-gf-tbi-06, m2-gf-sci-01, m2-gf-sci-03, m2-gf-panc-01, m2-gf-panc-03, m2-gf-panc-04, m2-gf-burn-02, m2-gf-burn-08, m2-gf-pcos-01, m2-gf-pcos-08, m4-gf-fp-04, m4-gf-saf-05, m4-gf-sus-06, m4-gf-sus-08, m4-gf-dist-02, m4-gf-dist-08, m3-gf-eth-02, m3-gf-pp-04, m4-gf-me-03, m2-gf-msud-03, m2-gf-pku-01

**50. First-action prioritisation (skill)** (44) - pattern: `\bFIRST\b|initial step|first step`

- automatic: dom1-ext2-002, m1-rc-016, dom2-dm-004, dom2-ext-005, dom2-ext2-008, m2-mnt-100, m2-mnt-106, m2-mnt-118, m2-mnt-149, m2-mnt-162, m2-mnt-164, m2-mnt-182, m2-mnt-187, m2-mnt-025, m2-mnt-028, m3-pdf-54, m3-pdf-71, dom3-ext-001, m3-fsl-005, m3-mgmt-005, m4-pdf-05, m4-pdf-08, m4-pdf-36, dom4-ext-004, m2-gf-ena-09, m2-gf-enc-03, m2-gf-enc-05, m2-gf-fld-08, m2-gf-fa-07, m2-gf-fa-10, m2-gf-panc-01, m2-gf-burn-06, m3-gf-nslp-06, m3-gf-sop-03, m3-gf-tele-03, m2-gf-dga-05, m3-gf-pp-01, m2-gf-first-01, m2-gf-first-03, m4-gf-first-04, m4-gf-first-05, m4-gf-first-06, m2-gf-first-07, m3-gf-first-08

- reviewed by hand: `m2-gf-first-02` - INCLUDED: asks which plan comes first in a refeeding-risk admission


**Under 4 questions (operational alert, not proof of mastery):** 4. Employee turnover rate (0), 33. Addison disease (3), 42. Null hypothesis (3)
