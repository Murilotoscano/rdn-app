# Nutrition-support corrections: fifth batch

Thirteen question IDs were revised and released after review of the specified defects. Past responses and scores remain associated with the earlier wording and are not recalculated. Other held items remain under review; unheld questions are not independently certified by this change.

- **m2-entp-004, m2-entp-010:** remove the claim that jejunal access or short-bowel syndrome universally requires hydrolyzed formula. [ESPEN 2023](https://www.espen.org/files/ESPEN-Guidelines/ESPEN_guideline_on_chronic_intestinal_failure_in_adults.pdf).
- **m2-entp-014, m2-entp-028:** state the cited ASPEN peripheral-PN threshold of 900 mOsm/L and consider the whole formulation. [ASPEN practice tool](https://nutritioncare.org/wp-content/uploads/2024/12/PN-Myths-Practice-Tool.pdf).
- **m2-entp-020, m2-entp-025:** make lipid-dose and linoleic-acid calculations explicitly use given targets, rather than treating a product-dependent maximum or total lipid as a universal fatty-acid rule. [ASPEN resources](https://nutritioncare.org/news/parenteral-nutrition-therapy-assessment-tools-and-guidelines/).
- **m2-entp-027:** identify the specific Intralipid 20% label contraindication instead of treating all acute pancreatitis as a blanket contraindication for every lipid emulsion. [FDA 2023 label](https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/017643s083%2C018449s050s051%2C019942s021%2C020248s027s028lbl.pdf).
- **m2-mnt-054:** specify phenylalanine and tyrosine restriction in tyrosinemia I with specialist management. [GeneReviews](https://www.ncbi.nlm.nih.gov/books/NBK1515/).
- **m2-mnt-075:** monitor fluid/electrolyte depletion with high-output ileostomy; a stoma does not prove terminal ileal resection. [UOAA](https://www.ostomy.org/wp-content/uploads/2022/10/UOAA_Living_with_an_Ileostomy_Guide-2022-10.pdf).
- **m2-mnt-084:** identify the cited TLC sodium limit as 2,300 mg/day, with individualized clinical targets. [NHLBI](https://www.nhlbi.nih.gov/health/TLC-Therapeutic-Lifestyle-Changes-Lower-Cholesterol).
- **m2-mnt-001:** date the ASPEN 2022 12–25 kcal/kg/day guideline range for the first 7–10 ICU days and calculate the 80 kg range. [ASPEN](https://nutritioncare.org/wp-content/uploads/2024/12/Adult-Crit-Ill-Patient-Guidelines-Factsheet.pdf).
- **m2-mnt-080:** accurately describe the ASPEN/SCCM 2016 position on routine omega-3/borage-oil formulations in ARDS. [Guideline E3](https://doi.org/10.1177/0148607115621863).
- **m2-mnt-167:** distinguish transferrin saturation from total iron-binding capacity. [CDC](https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2001/DataFiles/L40FE_B.htm).

Run `node --import tsx scripts/support_batch_test.cjs` and earlier regression tests. The cited recommendations have dates and scopes; they are not substitutes for current patient-specific guidance.
