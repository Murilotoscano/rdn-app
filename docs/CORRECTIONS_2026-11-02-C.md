# Corrections: legacy lesson questions

Nineteen lesson IDs were corrected and released from the hold after review of the described issue. Existing saved lesson answers retain their original indices and are not a historical record of the revised wording; historical completion and scores are not recalculated. One question, `q24-1`, was revised but remains held pending a source-specific review of atmospheric steam and browning. These changes do not certify the legacy lesson theory.

- **q3-1, q19-2:** supply explicit amounts or prescribed factor so the carbohydrate and protein calculations are determinate.
- **q5-2:** distinguish ASPEN 2020 initiation and monitoring recommendations for refeeding risk from the previous universal percentage; do not delay emergency glucose treatment. [ASPEN consensus](https://doi.org/10.1002/ncp.10474).
- **q7-2:** name the Blanchard SLII model and its D1/S1 terminology. [Blanchard](https://www.blanchard.com/about-us/pressroom/advantexe-partnership).
- **q8-3, q10-1:** qualify ordering privileges and scope; specify a stable patient and absent prior assessment for the first-action item.
- **q16-2:** individualize nutrition in CF-related diabetes instead of imposing a high-fat/high-energy plan for everyone. [CF Foundation](https://www.cff.org/medical-professionals/nutritional-considerations-new-era-cf-foundation-position-paper).
- **q18-2:** distinguish 28 days after conception from obstetric gestational age. [CDC](https://archive.cdc.gov/www_cdc_gov/ncbddd/birthdefects/surveillancemanual/resource-library/glossary.html).
- **q23-1, q23-3:** state the FDA 2026 maximum cooling limits and use properly cooled rice in the reheating example. [FDA Food Code 2026](https://www.fda.gov/media/194741/download), sections 3-501.14 and 3-403.11.
- **q23-2:** avoid claiming Listeria is the only organism that grows in refrigeration. [FDA](https://www.fda.gov/food/people-risk-foodborne-illness/ready-eat-foods-food-safety-moms-be).
- **q24-2:** identify 304 as commonly known as 18/8, without suggesting other stainless grades are always prohibited. [FDA Food Code 2026](https://www.fda.gov/media/194741/download), sections 4-101.11 and 4-101.15.
- **q25-2, q25-3:** qualify CMS deeming and distinguish process from structural measures. [CMS](https://www.cms.gov/medicare/health-safety-standards/quality-safety-oversight-general-information/accrediting-organizations-aos).
- **q26-1:** distinguish SNAP and WIC without treating one federal poverty threshold as a universal complete eligibility test. [USDA SNAP](https://www.fns.usda.gov/snap/recipient/eligibility), [USDA WIC](https://www.fns.usda.gov/wic/wic-eligibility-requirements).
- **q27-2:** identify the reaction of reducing sugar with amino groups, including free amino acids; **q27-3:** require a complete tested pressure-canning process for low-acid foods. [NCHFP](https://nchfp.uga.edu/how/general/ensuring-safe-canned-foods/).
- **q30-1, q30-2:** avoid inferring performance from perceived CAT difficulty or converting raw domain percentages into scaled points; date 2026 domain weights.

Regression check: `node --import tsx scripts/lesson_content_batch_test.cjs`. Continue holding unresolved questions and avoid assuming older results have been rescored.
