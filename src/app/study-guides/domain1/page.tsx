type Block =
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "trap"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "bullet"; items: string[] };

type Section = { title: string; color: string; content: Block[] };

const sections: Section[] = [
  {
    title: "1. Dietary Reference Intakes (DRIs)",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["DRI Value", "Definition", "Population Coverage", "When Used"],
        rows: [
          ["EAR", "Meets needs of 50% of healthy individuals", "50% of population", "Group assessment; basis for RDA; NOT for individual counseling"],
          ["RDA", "EAR + 2SD; meets 97-98% of healthy individuals", "97-98% of population", "Individual goal for counseling; Nutrition Facts label"],
          ["AI", "Used when insufficient evidence for EAR; observed intake of healthy populations", "Assumed adequate for most", "Goal when no RDA exists; less confidence than RDA"],
          ["UL", "Highest intake unlikely to pose risk of adverse effects", "Nearly 0% risk below UL", "Assess risk of excess from supplements or fortified foods"],
          ["AMDR", "Range associated with reduced chronic disease risk", "Population recommendation", "CHO: 45-65%; Fat: 20-35%; Protein: 10-35%"],
        ]},
      { type: "trap", text: "EAR covers only 50% of the population. If a patient's intake = EAR, there is a 50% chance their needs are NOT met. Always use RDA for individual counseling." },
      { type: "table", headers: ["Macronutrient", "AMDR", "Calories/g", "Key Notes"],
        rows: [
          ["Carbohydrate", "45-65%", "4 kcal/g", "Minimum 130 g/day for brain glucose; fiber AI: 25g women, 38g men"],
          ["Protein", "10-35%", "4 kcal/g", "RDA: 0.8 g/kg/day adults; higher for athletes, illness, elderly"],
          ["Fat", "20-35%", "9 kcal/g", "Saturated fat <10% (DGA 2020); trans fat: as low as possible"],
          ["Alcohol", "No AMDR", "7 kcal/g", "Empty calories; not essential; 1 drink = 12oz beer / 5oz wine / 1.5oz spirits"],
        ]},
    ]
  },
  {
    title: "2. Macronutrients",
    color: "#2E75B6",
    content: [
      { type: "subtitle", text: "Carbohydrate Digestion & Absorption" },
      { type: "table", headers: ["Carbohydrate", "Enzyme", "Absorption Transporter", "Notes"],
        rows: [
          ["Glucose", "None needed (monosaccharide)", "SGLT-1 (Na-dependent active transport)", "Requires sodium cotransport — basis of oral rehydration therapy"],
          ["Galactose", "None needed", "SGLT-1 (Na-dependent active transport)", "Same transporter as glucose; competes"],
          ["Fructose", "None needed", "GLUT5 (facilitated diffusion)", "No energy required; passive; slower absorption"],
          ["Lactose", "Lactase (brush border)", "After hydrolysis: SGLT-1", "Lactase deficiency → fermentation by colonic bacteria → gas, bloating, diarrhea"],
          ["Sucrose", "Sucrase", "After hydrolysis: SGLT-1 + GLUT5", "Most common dietary disaccharide"],
          ["Starch (amylopectin)", "Salivary + pancreatic amylase", "After hydrolysis: SGLT-1", "Branched (alpha-1,4 and alpha-1,6 bonds); faster digestion"],
          ["Cellulose", "NONE — humans lack beta-glucosidase", "NOT absorbed — passes through", "Beta-1,4 bonds (vs alpha-1,4 in starch) = indigestible"],
        ]},
      { type: "trap", text: "Cellulose is indigestible because it has BETA-1,4 glycosidic bonds. Humans only have enzymes for ALPHA bonds (starch). This structural difference makes cellulose dietary fiber." },
      { type: "subtitle", text: "Fat Digestion & Absorption" },
      { type: "bullet", items: [
        "CCK released by fat + protein in duodenum → gallbladder contracts → bile released → fat emulsified",
        "Pancreatic lipase + colipase hydrolyzes TG → 2-monoglyceride + 2 free fatty acids",
        "Micelles form → cross intestinal brush border → reassembled into TG inside enterocyte",
        "Packaged into CHYLOMICRONS → exit via LACTEALS → thoracic duct → left subclavian vein",
        "MCT (medium-chain triglycerides) bypass this: go directly into portal blood — used in malabsorption",
      ]},
      { type: "trap", text: "Fat does NOT go into portal blood — it goes through lymph via chylomicrons. EXCEPTION: MCT goes directly to portal blood without chylomicron formation." },
      { type: "subtitle", text: "Amino Acids — Key Classifications" },
      { type: "table", headers: ["Category", "Amino Acids", "Clinical Relevance"],
        rows: [
          ["Essential (9)", "Histidine, Isoleucine, Leucine, Lysine, Methionine, Phenylalanine, Threonine, Tryptophan, Valine", "Must obtain from diet; deficiency = protein malnutrition"],
          ["PURELY Ketogenic (only 2)", "Leucine and Lysine ONLY", "Cannot contribute to gluconeogenesis; converted only to acetyl-CoA or acetoacetate"],
          ["Complete plant proteins", "Quinoa, soy, buckwheat, hemp, chia, spirulina, amaranth", "All other plant proteins are incomplete"],
          ["Legume limiting AA", "Methionine (and cysteine)", "Pair legumes + grains for complementation"],
          ["Grain limiting AA", "Lysine", "Pair grains + legumes for complementation"],
        ]},
    ]
  },
  {
    title: "3. Water-Soluble Vitamins",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Vitamin", "Deficiency Disease/Signs", "Toxicity", "Key Exam Fact"],
        rows: [
          ["Thiamin (B1)", "Beriberi: Wet (cardiac — high-output HF, edema) vs Dry (neurological — peripheral neuropathy); Wernicke-Korsakoff (confusion, ataxia, ophthalmoplegia)", "Not established", "ALWAYS give thiamin BEFORE IV glucose in alcoholism — glucose without thiamin precipitates Wernicke's encephalopathy"],
          ["Riboflavin (B2)", "Angular stomatitis, cheilosis, glossitis (magenta tongue), corneal vascularization", "Not established", "Destroyed by UV light — milk in opaque containers; riboflavin turns urine bright yellow"],
          ["Niacin (B3)", "Pellagra: 4 Ds — Dermatitis (sun-exposed; Casal's necklace), Diarrhea, Dementia, Death", "Niacin flush, hepatotoxicity, hyperglycemia (nicotinic acid pharmacological dose)", "60 mg tryptophan = 1 NE (niacin equivalent); corn diets cause pellagra (low tryptophan + bound niacin)"],
          ["B6 (Pyridoxine)", "Microcytic anemia, peripheral neuropathy, glossitis; seen with isoniazid (TB drug)", "Sensory neuropathy (>200 mg/day supplements)", "Isoniazid depletes B6 → always supplement B6 with INH therapy"],
          ["Biotin (B7)", "Hair loss, skin rash, neurological symptoms; raw egg white consumption (avidin)", "Not established", "Avidin in RAW egg whites binds biotin irreversibly; COOKING denatures avidin — eggs must be cooked"],
          ["Folate (B9)", "Megaloblastic macrocytic anemia; neural tube defects; elevated homocysteine", "Masks B12 neurological damage", "ALWAYS rule out B12 before supplementing folate — folate corrects anemia but hides B12 neurological damage"],
          ["B12 (Cobalamin)", "Megaloblastic anemia; subacute combined degeneration of spinal cord; elevated MMA AND homocysteine", "Not established", "Elevated MMA = B12 deficiency SPECIFICALLY (not folate); pernicious anemia = intrinsic factor deficiency"],
          ["Vitamin C", "Scurvy: perifollicular hemorrhages, corkscrew hairs, gingival bleeding, poor wound healing", "GI distress; oxalate/uric acid kidney stones at >2g/day", "Enhances non-heme iron absorption; collagen synthesis (hydroxylates proline and lysine)"],
        ]},
      { type: "trap", text: "Folate vs B12: Both cause macrocytic anemia and elevated homocysteine. ONLY B12 deficiency elevates MMA. Always check MMA to differentiate. Never supplement folate without ruling out B12 first." },
    ]
  },
  {
    title: "4. Fat-Soluble Vitamins",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Vitamin", "Activation Pathway", "Deficiency", "Toxicity", "Key Fact"],
        rows: [
          ["Vitamin A", "Retinol (animal) or beta-carotene (plant provitamin A) → retinal, retinoic acid", "Night blindness (earliest); xerophthalmia; hyperkeratosis; impaired immunity", "Teratogenic >10,000 IU/day in pregnancy; hepatotoxicity; pseudotumor cerebri", "Beta-carotene does NOT cause toxicity (conversion is regulated); retinol supplements ARE toxic in excess"],
          ["Vitamin D", "Skin (UVB) → D3 → Liver → 25-OH-D3 (calcidiol, storage form) → Kidney → 1,25-(OH)2-D3 (calcitriol, active form)", "Children: rickets; Adults: osteomalacia; CKD: cannot make calcitriol", "Hypercalcemia → kidney stones, soft tissue calcification; UL: 4,000 IU/day", "CKD impairs FINAL activation step → need calcitriol prescription; breastfed infants need 400 IU/day supplement"],
          ["Vitamin E", "Absorbed with fat → chylomicrons → VLDL; stored in adipose, liver, cell membranes", "Rare; hemolytic anemia in premature infants; peripheral neuropathy with fat malabsorption", "Increased bleeding risk (antagonizes vitamin K); UL: 1,000 mg/day", "Primary lipid antioxidant — protects PUFA in cell membranes from oxidation"],
          ["Vitamin K", "K1 (phylloquinone) from plants; K2 (menaquinone) from gut bacteria and animal foods; short half-life", "Coagulopathy; hemorrhagic disease of newborn (give K shot at birth)", "No UL from food; interferes with warfarin", "Warfarin patients: CONSISTENT intake, NOT elimination; grapefruit inhibits warfarin metabolism (CYP3A4)"],
        ]},
    ]
  },
  {
    title: "5. Minerals",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Mineral", "Absorption", "Key Functions", "Deficiency", "Key Interactions"],
        rows: [
          ["Iron", "Fe2+ (ferrous) via DMT-1 in duodenum; heme iron 15-35%; non-heme 2-20%", "Hemoglobin, myoglobin, cytochromes, immune function", "Microcytic hypochromic anemia; fatigue; pica; koilonychia", "Vitamin C ENHANCES non-heme absorption; phytates, tannins, calcium INHIBIT"],
          ["Calcium", "Active (TRPV6 + calbindin, vitamin D-dependent) in duodenum; 30% from food", "Bone/teeth (99% in hydroxyapatite); muscle contraction; nerve transmission; clotting", "Osteoporosis; tetany; rickets (with vit D deficiency); increased PTH", "Oxalates and phytates INHIBIT; vitamin D and lactose ENHANCE; correct serum Ca for albumin: +0.8 per 1g/dL drop below 4"],
          ["Zinc", "ZIP4 transporter; 15-40% absorbed; regulated by metallothionein", "Protein synthesis; wound healing; immune; taste/smell (gustin); insulin packaging", "Dysgeusia; poor wound healing; growth retardation; alopecia; impaired immunity", "Phytates = major inhibitor; EXCESS ZINC causes copper deficiency (induces metallothionein)"],
          ["Iodine", "Nearly complete absorption as iodide; actively transported into thyroid", "T3 and T4 synthesis; regulates metabolic rate and development", "Goiter; hypothyroidism; cretinism (maternal deficiency)", "Goitrogens: raw cruciferous vegetables, soy, cassava — block iodine uptake; cooking inactivates goitrogens"],
          ["Selenium", "High bioavailability (~80%); urinary excretion regulates homeostasis", "Glutathione peroxidase (antioxidant); T4 → T3 conversion; immune function", "Keshan disease (cardiomyopathy); impaired immunity", "Brazil nuts = richest source (1 nut = ~80 mcg vs RDA 55 mcg); excess → selenosis (hair loss, brittle nails)"],
        ]},
      { type: "trap", text: "Phytates inhibit zinc, iron, calcium, and magnesium — but NOT vitamin C. Common exam distractor includes vitamin C in this list. It is wrong." },
      { type: "trap", text: "Excess zinc supplementation CAUSES copper deficiency by inducing metallothionein in enterocytes, which sequesters copper and prevents its absorption." },
    ]
  },
  {
    title: "6. GI Hormones",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Hormone", "Stimulus", "Actions", "Exam Trap"],
        rows: [
          ["Gastrin", "Protein in stomach; distension; vagal stimulation", "Stimulates gastric acid (HCl) and pepsinogen secretion; promotes gastric motility", "Zollinger-Ellison syndrome = gastrin-secreting tumor → massive acid → refractory peptic ulcers"],
          ["Secretin", "ACID (low pH) in duodenum — KEY trigger", "Stimulates BICARBONATE from pancreas; inhibits gastric acid; stimulates bile from liver", "Secretin released by ACID (not fat/protein). Its job: NEUTRALIZE acid. Exam loves this distinction."],
          ["CCK", "FAT + PROTEIN in duodenum (both needed)", "Stimulates BILE from gallbladder; stimulates PANCREATIC ENZYMES; slows gastric emptying; promotes satiety", "CCK = fat AND protein (not acid). Mnemonic: CCK Contracts the Cholecyst (gallbladder)"],
          ["GLP-1", "Food in distal gut (L cells)", "Stimulates insulin (incretin effect — glucose-dependent); suppresses glucagon; slows gastric emptying; promotes satiety", "GLP-1 INCREASES after RYGB bypass (paradox); GLP-1 agonists = semaglutide/Ozempic"],
          ["Ghrelin", "FASTING / empty stomach", "STIMULATES hunger (hypothalamus); promotes fat storage; stimulates GH release", "ONLY gut hormone that STIMULATES hunger. Elevated in anorexia and after dieting. LOW after RYGB."],
          ["Leptin", "Proportional to fat mass; feeding; insulin", "Suppresses appetite (long-term satiety); increases energy expenditure", "Leptin RESISTANCE = hallmark of obesity (high leptin but no response)"],
        ]},
      { type: "trap", text: "GHRELIN is the ONLY gut hormone that STIMULATES hunger. All others (GLP-1, PYY, CCK, leptin) suppress appetite. Also: Secretin = acid stimulus; CCK = fat+protein stimulus. Do not confuse." },
    ]
  },
  {
    title: "7. Food Science",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Reaction", "Reactants", "Conditions", "Prevention"],
        rows: [
          ["Maillard (non-enzymatic browning)", "Amino acid + reducing sugar", "HEAT required; higher pH and moisture influence", "Lower pH; reduce reducing sugars or protein; lower temperature"],
          ["Caramelization", "SUGAR only (no protein)", "High heat; no protein needed", "Control temperature; add acid to slow"],
          ["Enzymatic browning", "Polyphenols + O2 (polyphenol oxidase enzyme)", "Oxygen exposure; tissue disruption (cutting); pH 5-7 optimal", "Acid (lemon juice); blanching (denatures enzyme); oxygen exclusion; refrigeration"],
        ]},
      { type: "trap", text: "Maillard = amino acid + reducing sugar + HEAT. Caramelization = SUGAR only. Enzymatic browning = requires polyphenol oxidase enzyme + oxygen (prevented by acid or heat)." },
      { type: "table", headers: ["Topic", "Critical Fact"],
        rows: [
          ["C. botulinum spores", "Destroyed ONLY at 250°F/121°C at 15 psi — requires pressure canning. Water bath canning (212°F max) is INSUFFICIENT for low-acid foods"],
          ["HTST pasteurization", "72°C for 15 seconds; requires refrigeration"],
          ["UHT pasteurization", "138°C for 2 seconds; shelf-stable without refrigeration until opened"],
          ["Water activity (Aw)", "Scale 0-1; <0.85 inhibits most bacteria; <0.60 inhibits molds; lower Aw = more shelf stable"],
          ["Gluten formation", "Gliadin + glutenin + water + mixing; bread flour = highest protein content"],
          ["Starch retrogradation", "Gelatinized starch recrystallizes on cooling; causes bread staling; increases resistant starch"],
          ["Fire Class K", "Cooking oils/fats; WET CHEMICAL extinguisher ONLY; NEVER water (causes explosive steam/oil spray)"],
          ["Irradiation", "Radura symbol; destroys pathogens; does NOT make food radioactive"],
        ]},
    ]
  },
  {
    title: "8. Research Methods",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Study Design", "Key Feature", "Evidence Level", "Calculates"],
        rows: [
          ["Systematic Review/Meta-Analysis", "Pools data from multiple RCTs; highest evidence when well-conducted", "Grade I (Strong)", "N/A — synthesizes other studies"],
          ["RCT (Randomized Controlled Trial)", "Random assignment; gold standard for causality; can blind participants and researchers", "Grade I-II", "Relative risk (RR), absolute risk reduction"],
          ["Cohort Study", "Follows exposed vs unexposed groups over time; prospective or retrospective", "Grade II-III", "Relative risk (RR), incidence"],
          ["Case-Control", "Compares cases (with disease) to controls (without); looks backward at exposures", "Grade III", "Odds Ratio (OR) only"],
          ["Cross-Sectional", "Snapshot in time; measures exposure and outcome simultaneously", "Grade III-IV", "Prevalence"],
          ["Ecological", "Group-level data; not individual; generates hypotheses", "Grade IV", "Ecological correlations"],
        ]},
      { type: "table", headers: ["Statistical Concept", "Definition", "Exam Application"],
        rows: [
          ["Sensitivity", "True positive rate: TP/(TP+FN); probability of positive test in someone WITH disease", "High sensitivity = good for RULING OUT disease (negative test reliable); SnNout"],
          ["Specificity", "True negative rate: TN/(TN+FP); probability of negative test in someone WITHOUT disease", "High specificity = good for RULING IN disease (positive test reliable); SpPin"],
          ["Odds Ratio (OR)", "Ratio of odds of exposure in cases vs controls; used in case-control studies", "Say 'X times the ODDS' NOT 'X times more likely' — this is the most common OR interpretation error"],
          ["Relative Risk (RR)", "Ratio of risk in exposed vs unexposed; used in cohort and RCT", "RR=2.0 means exposed group has 2x the RISK of developing disease"],
          ["P-value", "Probability results occurred by chance assuming null hypothesis is true", "p<0.05 = statistically significant; does NOT measure clinical importance"],
          ["Positive skew", "Tail extends RIGHT; mean > median > mode", "Income data; disease severity (most mild, few severe outliers pull mean up)"],
          ["Normal MMA", "MMA normal = folate deficiency; MMA elevated = B12 deficiency", "KEY differentiator when both B12 and folate deficiency cause elevated homocysteine"],
        ]},
      { type: "trap", text: "Odds Ratio ≠ Relative Risk. Say 'OR of 3.0 means 3 times the ODDS of exposure' — NOT '3 times more likely.' Case-control studies calculate OR; cohort studies calculate RR." },
    ]
  },
  {
    title: "Quick Reference — Domain I Most Tested Numbers",
    color: "#2E75B6",
    content: [
      { type: "table", headers: ["Topic", "Critical Number/Fact"],
        rows: [
          ["Brain glucose minimum", "130 g/day carbohydrate"],
          ["Fiber AI", "25 g/day women; 38 g/day men"],
          ["Alcohol calories", "7 kcal/g (between CHO=4 and fat=9)"],
          ["Purely ketogenic AAs", "ONLY leucine and lysine"],
          ["Complete plant proteins", "Quinoa, soy, buckwheat, hemp, chia, spirulina, amaranth"],
          ["Legume limiting AA", "Methionine (pair with grains)"],
          ["Vitamin D activation", "Skin → liver (calcidiol) → kidney (calcitriol = active)"],
          ["B12 unique marker", "Elevated MMA = B12 deficiency specifically (not folate)"],
          ["Folate supplement rule", "Always rule out B12 FIRST before supplementing folate"],
          ["Thiamin + alcohol", "Give thiamin BEFORE IV glucose; prevents Wernicke's"],
          ["Biotin + raw eggs", "Avidin binds biotin; cooking denatures avidin — cook eggs"],
          ["Phytate rule", "Inhibits zinc, iron, calcium, Mg — NOT vitamin C"],
          ["Zinc excess → copper deficiency", "Excess zinc induces metallothionein → blocks copper absorption"],
          ["Secretin stimulus", "ACID in duodenum (not fat/protein)"],
          ["CCK stimulus", "FAT + PROTEIN in duodenum (not acid)"],
          ["Ghrelin", "ONLY hunger-stimulating gut hormone; low after RYGB; high in anorexia"],
          ["Maillard requires", "Amino acid + reducing sugar + HEAT"],
          ["C. botulinum prevention", "250°F/121°C at 15 psi — pressure canning ONLY"],
          ["Fire Class K", "Cooking oils; WET CHEMICAL extinguisher only; NEVER water"],
          ["FTE formula", "(Positions × Hours × Days) / 40"],
          ["Depreciation formula", "(Cost − Salvage) / Useful life years"],
          ["5-week moving average", "Sum of last 5 periods / 5 (use LAST 5, not all available data)"],
        ]},
    ]
  },
];

export default function Domain1Page() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/study-guides" style={{ color: "#2E75B6", textDecoration: "none", fontSize: 14 }}>← Study Guides</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ background: "#2E75B6", color: "#fff", borderRadius: 10, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>D1</div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Domain I — Principles of Dietetics</h1>
          <div style={{ color: "#2E75B6", fontWeight: 600, fontSize: 14 }}>21% of the RDN Exam</div>
        </div>
      </div>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>Covers food science, normal nutrition, anatomy/physiology, education theories, research methods, and calculations.</p>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: section.color, borderBottom: `2px solid ${section.color}`, paddingBottom: 8, marginBottom: 16 }}>{section.title}</h2>
          {section.content.map((block, bi) => {
            if (block.type === "table") return (
              <div key={bi} style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>{block.headers.map((h, i) => <th key={i} style={{ background: "#1F3864", color: "#fff", padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} style={{ background: ri % 2 === 0 ? "#EEF4FB" : "#fff" }}>
                        {row.map((cell, ci) => <td key={ci} style={{ padding: "8px 12px", borderBottom: "1px solid #e0e0e0", verticalAlign: "top" }}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            if (block.type === "trap") return (
              <div key={bi} style={{ background: "#FFF0F0", border: "1px solid #ffcccc", borderLeft: "4px solid #C00000", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
                <strong style={{ color: "#C00000" }}>EXAM TRAP: </strong><span style={{ color: "#C00000" }}>{block.text}</span>
              </div>
            );
            if (block.type === "subtitle") return <h3 key={bi} style={{ fontSize: 15, fontWeight: 700, color: "#1F3864", margin: "16px 0 8px" }}>{block.text}</h3>;
            if (block.type === "bullet") return (
              <ul key={bi} style={{ margin: "0 0 12px 0", paddingLeft: 20 }}>
                {block.items.map((item, ii) => <li key={ii} style={{ fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>{item}</li>)}
              </ul>
            );
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
