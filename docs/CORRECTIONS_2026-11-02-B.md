# Content corrections: second batch

The following fifteen held IDs were corrected and released following the November 2026 semantic audit. Existing records and scores remain untouched and reflect the question wording used at the time. An unheld item is not a certification of the entire question bank.

- **m1-gap-10:** distinguish negative reinforcement from punishment. [APA](https://dictionary.apa.org/negative-reinforcement).
- **m1-nn-020:** distinguish bile production by the liver from gallbladder release. [NIDDK](https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works).
- **m1-fs-007, m2-mnt-072:** distinguish oats’ avenin, gluten cross-contact, labeling and individual tolerance. [NIDDK](https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/eating-diet-nutrition).
- **m1-fs-009:** test aseptic packaging after UHT, including the unopened condition. [FDA](https://www.fda.gov/media/193438/download?attachment=).
- **m1-fs-025:** correct U.S. standard drink to about 0.6 fluid ounces or 14 g of ethanol. [NIAAA](https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink).
- **m1-nn2-004:** remove the false claim that B6 is uniquely toxic among water-soluble vitamins. [NIH ODS](https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/).
- **m2-mnt-128:** recognize hypertriglyceridemia and hypercalcemia as possible acute pancreatitis causes. [NIDDK](https://www.niddk.nih.gov/health-information/digestive-diseases/pancreatitis/symptoms-causes).
- **m2-mnt-180:** remove blanket kidney-disease contraindication for SGLT2 inhibitors. [FDA](https://www.fda.gov/drugs/drug-safety-and-availability/fda-revises-labels-sglt2-inhibitors-diabetes-include-warnings-about-too-much-acid-blood-and-serious).
- **dom2-ext2-007:** distinguish pancreatic enzyme testing from a routine CMP. [NIDDK](https://www.niddk.nih.gov/health-information/digestive-diseases/pancreatitis/diagnosis).
- **m2-mnt-130:** specify [KDIGO 2012](https://kdigo.org/wp-content/uploads/2016/10/KDIGO-2012-AKI-Guideline-English.pdf) and correct separate 48-hour, seven-day and urine-output criteria; the item is not presented as an exhaustive current definition.
- **m4-pdf-61:** distinguish commercial cooking-oil fires and Class K extinguishers; the answer key changed. [OSHA](https://www.osha.gov/etools/evacuation-plans-procedures/emergency-standards/portable-extinguishers/about).
- **m4-pdf-71:** distinguish processed egg products from shell eggs in agency oversight. [USDA FSIS](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/eggs/egg-products-and-food-safety), [FDA](https://www.fda.gov/food/food-export-lists/egg-and-egg-products-export-lists).
- **m4-gf-inf-01:** remove the incomplete powder-preparation instruction and defer to the validated neonatal protocol. [CDC](https://www.cdc.gov/infant-toddler-nutrition/formula-feeding/preparation-and-storage.html).
- **m4-gf-sus-01:** replace the old hierarchy with the current Wasted Food Scale for this question. [EPA](https://www.epa.gov/sustainable-management-food/wasted-food-scale).

Tests: `node --import tsx scripts/content_batch_test.cjs`, `scripts/numerical_batch_test.cjs`, and `scripts/lesson_audit_test.cjs` (each with `node --import tsx`), plus bank integrity and production build. Continue holding unresolved items pending their specific source and ambiguity review.
