
type Block =
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "trap"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "bullet"; items: string[] };

type Section = { title: string; color: string; content: Block[] };

const sections: Section[] = [
  {
    title: "1. Laboratory Values — Complete Reference",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Lab Test", "Normal Range", "Low Means", "High Means", "RDN Clinical Use"],
        rows: [
          ["Albumin", "3.5–5.0 g/dL", "Inflammation, liver disease, protein loss — NOT malnutrition directly", "Dehydration (hemoconcentration)", "Negative acute-phase protein. NOT used to diagnose malnutrition per AND/ASPEN 2012"],
          ["Prealbumin", "15–40 mg/dL", "Acute illness, inflammation, liver disease", "Dehydration", "Short half-life (2-3 days); also reflects inflammation. NOT a nutrition marker."],
          ["CRP", "< 1.0 mg/dL", "Low inflammation (normal)", "Active inflammation — explains low albumin/prealbumin", "Use CRP + albumin together: low albumin + HIGH CRP = inflammation; low albumin + normal CRP = possible malnutrition"],
          ["eGFR", "> 60 mL/min", "Reduced kidney function", "N/A", "CKD staging; guide protein restriction; adjust medications"],
          ["BUN", "7–20 mg/dL", "Malnutrition, overhydration, liver failure", "Dehydration, high protein intake, renal failure, GI bleed", "BUN:Cr ratio >20:1 = prerenal azotemia (dehydration or GI bleed)"],
          ["HbA1c", "< 5.7% normal", "Hemolytic anemia (falsely low)", "Diabetes ≥6.5%; prediabetes 5.7-6.4%", "Reflects 3-month average glucose; goal <7% general DM"],
          ["Potassium", "3.5–5.0 mEq/L", "Hypokalemia: arrhythmia, muscle weakness; purging (bulimia)", "Hyperkalemia: arrhythmia; CKD, ACE inhibitors", "Critical in CKD, eating disorders, refeeding syndrome"],
          ["Phosphorus", "2.5–4.5 mg/dL", "Hypophosphatemia: hallmark of REFEEDING SYNDROME; respiratory failure", "Hyperphosphatemia: CKD; calcification risk", "MOST critical electrolyte in refeeding syndrome monitoring"],
          ["Ferritin", "12–150 ng/mL (F)", "Iron deficiency (<12)", "Iron overload OR inflammation (falsely elevated in ACD)", "Acute-phase reactant; elevated ferritin does NOT rule out iron deficiency in inflammation"],
          ["TIBC", "250–370 mcg/dL", "ACD, liver disease, malnutrition (LOW)", "Iron deficiency (>400 mcg/dL) — HIGH", "INVERSE of iron stores; high TIBC = body trying to absorb more iron"],
          ["MMA", "< 0.4 mcmol/L", "Normal", "B12 deficiency ONLY — not folate", "KEY DIFFERENTIATOR: Elevated MMA = B12 deficiency. Normal MMA = folate deficiency."],
          ["Triglycerides", "< 150 mg/dL", "Malabsorption, malnutrition", ">500 mg/dL = pancreatitis risk; MetS criterion (≥150)", "Elevated in metabolic syndrome, diabetes, PN with excess lipids"],
        ]},
      { type: "trap", text: "Albumin and prealbumin are NOT recommended for nutrition assessment — they reflect inflammation, not nutrition status. The exam may try to trick you into using them as malnutrition markers." },
    ]
  },
  {
    title: "2. Malnutrition Diagnosis (AND/ASPEN Criteria)",
    color: "#C55A11",
    content: [
      { type: "bullet", items: [
        "Requires 2 of 6 criteria — albumin and prealbumin are NOT criteria",
        "Criteria: (1) Inadequate energy intake, (2) Weight loss, (3) Body fat loss on NFPE, (4) Muscle mass loss on NFPE, (5) Fluid accumulation (edema), (6) Reduced grip strength (severe only)",
      ]},
      { type: "table", headers: ["Etiology", "Inflammation Level", "Examples"],
        rows: [
          ["Starvation-related", "NONE", "Anorexia nervosa, famine — pure nutritional depletion; responds well to feeding"],
          ["Chronic disease-related", "Mild-moderate", "COPD, heart failure, CKD, stable cancer — feeding helps but inflammation limits response"],
          ["Acute disease/injury-related", "SEVERE (high)", "Sepsis, major burns, trauma, ICU patients — high protein needs; resistance to repletion"],
        ]},
      { type: "trap", text: "Exam may present ICU patient with low albumin and ask about malnutrition. The answer is ACUTE DISEASE-RELATED malnutrition (high inflammation), NOT starvation-related." },
    ]
  },
  {
    title: "3. Critical Care — ASPEN Guidelines",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Patient Type", "Energy Goal", "Protein Goal", "Key Notes"],
        rows: [
          ["General ICU (no organ dysfunction)", "25-35 kcal/kg actual body weight", "1.2-2.0 g/kg/day", "Start at low end; titrate up; indirect calorimetry is gold standard"],
          ["ICU on CRRT", "25-35 kcal/kg", "1.5-2.5 g/kg/day", "CRRT removes ~10-15g amino acids per session; higher protein compensates"],
          ["Obese ICU (BMI 30-50)", "11-14 kcal/kg ACTUAL body weight", "≥2 g/kg IBW", "Hypocaloric high-protein; mobilizes fat while preserving lean mass"],
          ["Obese ICU (BMI >50)", "22-25 kcal/kg IDEAL body weight", "2.5 g/kg IBW", "DIFFERENT formula from BMI 30-50 — most tested exam trap"],
          ["Burns (major)", "25-35 kcal/kg; maximum 2x REE", "1.5-2 g/kg OR 20-25% kcal", "EN within 4-6 hours; CHO 60%; high-dose vitamin C and zinc"],
          ["TBI — acute phase", "50-65% of REE", "1.5-2 g/kg", "Jejunal route preferred; avoid overfeeding (raises ICP)"],
          ["TBI — post-stabilization", "25-30 kcal/kg", "1.5-2 g/kg", "Advance when hemodynamically stable"],
          ["SCI — acute phase", "~10% BELOW predicted REE", "2 g/kg", "Reduced metabolic rate from muscle paralysis"],
          ["SCI — rehab tetraplegia", "23 kcal/kg", "Adequate", "Lowest energy of all SCI — greatest muscle loss"],
          ["SCI — rehab paraplegia", "28 kcal/kg", "Adequate", "Higher than tetraplegia — preserved upper body muscle"],
          ["Pressure ulcer Stage I-II", "30-35 kcal/kg", "1.25-1.5 g/kg", "Vitamin C + zinc; fluid 30 mL/kg"],
          ["Pressure ulcer Stage III-IV", "35-40 kcal/kg", "1.5-2.0 g/kg", "Aggressive protein; consider EN if oral inadequate"],
          ["Pneumonia + sepsis", "25-35 kcal/kg", "2.0 g/kg", "Highest protein goal for non-renal conditions"],
        ]},
      { type: "trap", text: "CRITICAL: Obese ICU BMI 30-50 uses ACTUAL weight (11-14 kcal/kg). BMI >50 uses IDEAL body weight (22-25 kcal/kg). These are DIFFERENT formulas — do not confuse them." },
    ]
  },
  {
    title: "4. Renal Disease",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Stage", "eGFR", "Protein Goal", "Energy", "Key Restrictions"],
        rows: [
          ["CKD 3-5 (no DM)", "15-60", "0.55-0.6 g/kg", "25-35 kcal/kg", "Phosphorus, sodium, potassium as labs indicate"],
          ["CKD 3-5 (with DM)", "15-60", "0.6-0.8 g/kg", "25-35 kcal/kg", "Same + glucose control"],
          ["Hemodialysis (5D)", "<15 on HD", "1.0-1.2 g/kg", "25-35 kcal/kg", "Fluid restriction; P, K, Na restrict"],
          ["Peritoneal Dialysis", "<15 on PD", "1.2-1.5 g/kg", "25-35 kcal/kg MINUS dialysate glucose", "300-800 kcal/day from dialysate — subtract from prescription"],
          ["AKI", "Abrupt decline", "0.8-1.0 non-dialysis; 1.5-1.7 on RRT", "20-30 kcal/kg", "Do NOT restrict protein — catabolism is severe"],
        ]},
      { type: "trap", text: "Peritoneal dialysis: dialysate glucose contributes 300-800 kcal/day — SUBTRACT from energy prescription to avoid overfeeding." },
      { type: "trap", text: "Dietary calcium PROTECTS against calcium oxalate kidney stones by binding oxalate in the gut. Low calcium INCREASES stone risk. Do NOT restrict calcium in stone formers." },
      { type: "table", headers: ["Kidney Stone Type", "Risk Factors", "Dietary Treatment"],
        rows: [
          ["Calcium oxalate (75-80%)", "Low fluid, HIGH oxalate, HIGH sodium, HIGH animal protein, LOW calcium", "Normal calcium (1000-1200 mg/day from food); low sodium; low animal protein; high fluid (2.5+ L/day); low oxalate"],
          ["Uric acid (5-10%)", "Low urine pH, high purine intake, gout, metabolic syndrome", "Low purine diet (limit organ meats, shellfish, beer); alkalinize urine; high fluid"],
          ["Struvite (10-15%)", "Urinary tract infections (urease-producing bacteria)", "Treat underlying UTI; no specific diet; high fluid"],
        ]},
    ]
  },
  {
    title: "5. Diabetes",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Category", "Fasting Glucose", "2-hr OGTT", "HbA1c"],
        rows: [
          ["Normal", "< 100 mg/dL", "< 140 mg/dL", "< 5.7%"],
          ["Prediabetes", "100-125 mg/dL", "140-199 mg/dL", "5.7-6.4%"],
          ["Diabetes", "≥ 126 mg/dL (confirmed x2)", "≥ 200 mg/dL", "≥ 6.5% (confirmed x2)"],
        ]},
      { type: "table", headers: ["Insulin Type", "Onset", "Peak", "Duration", "Clinical Use"],
        rows: [
          ["Rapid-acting (Lispro, Aspart, Glulisine)", "10-15 min", "1-2 hr", "3-5 hr", "Given WITH meals — covers meal carbohydrates"],
          ["Short-acting Regular (Humulin R)", "30-60 min", "2-4 hr", "6-8 hr", "Give 30 min before meals; used in IV infusions"],
          ["NPH (Intermediate)", "1-3 hr", "6-10 hr", "12-18 hr", "Has PEAK — can cause hypoglycemia at peak time"],
          ["Long-acting (Glargine, Detemir)", "1-2 hr", "No pronounced peak", "20-24 hr", "Basal coverage; NO peak = less hypoglycemia risk"],
        ]},
      { type: "trap", text: "Hypoglycemia treatment: 15-15 rule — 15g fast-acting CHO, wait 15 min, recheck. Use 4 oz OJ, glucose tablets, or regular soda. Peanut butter (fat+protein) DELAYS absorption = WRONG. Diet soda = no carbs = WRONG." },
      { type: "bullet", items: [
        "GDM screening: ALL pregnant women at 24-28 weeks with 75g OGTT",
        "GDM carbohydrate minimum: 175 g/day (fetal brain development)",
        "Neonatal hypoglycemia mechanism: maternal hyperglycemia → fetal hyperinsulinemia → at birth, maternal glucose stops but fetal insulin remains elevated → hypoglycemia",
        "Metformin mechanism: biguanide; reduces hepatic glucose production; can cause B12 deficiency (monitor B12)",
      ]},
    ]
  },
  {
    title: "6. Cardiovascular Disease",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["BP Category", "Systolic", "Diastolic"],
        rows: [
          ["Normal", "< 120 mmHg", "AND < 80 mmHg"],
          ["Elevated", "120-129 mmHg", "AND < 80 mmHg"],
          ["Stage 1 Hypertension", "130-139 mmHg", "OR 80-89 mmHg"],
          ["Stage 2 Hypertension", "≥ 140 mmHg", "OR ≥ 90 mmHg"],
        ]},
      { type: "trap", text: "2017 ACC/AHA lowered HTN threshold from 140/90 to 130/80. A patient with 134/85 is now STAGE 1 HTN (not pre-hypertension). Common exam trap." },
      { type: "table", headers: ["Topic", "Recommendation"],
        rows: [
          ["Saturated fat", "< 7% of total calories (cardioprotective diet)"],
          ["Dietary cholesterol", "< 200 mg/day"],
          ["Plant sterols/stanols", "2-3 g/day → reduces LDL by 10-15%"],
          ["DASH sodium", "1,500-2,300 mg/day; rich in K, Ca, Mg, fiber"],
          ["Heart failure fluid", "< 2 L/day; protein 1.12-1.37 g/kg"],
          ["TLC diet sodium", "≤ 2,000 mg/day"],
          ["Omega-3 for TG", "EPA + DHA 1-4 g/day reduces TG by 20-50%"],
        ]},
    ]
  },
  {
    title: "7. Enteral & Parenteral Nutrition",
    color: "#C55A11",
    content: [
      { type: "bullet", items: [
        "IF THE GUT WORKS, USE IT — enteral always preferred over parenteral",
        "GRV <500 mL without signs of intolerance = do NOT hold feeds (ASPEN 2016)",
        "Head of bed: 30-45 degrees to prevent aspiration",
        "Post-pyloric (NJ, PEJ): bypasses duodenum → must use hydrolyzed/elemental formula",
        "Gut atrophy after ≥2 weeks NPO → bacterial translocation → use EN to maintain gut integrity",
      ]},
      { type: "table", headers: ["PN Component", "Calories/g", "Key Details"],
        rows: [
          ["Dextrose (IV)", "3.4 kcal/g (NOT 4 kcal/g)", "Max GIR: 0.36 g/kg/hr to prevent hyperglycemia"],
          ["Amino acids", "4 kcal/g", "Nitrogen = AA grams ÷ 6.25"],
          ["Lipid emulsion 10%", "1.1 kcal/mL", "Max rate 0.11 g/kg/hr"],
          ["Lipid emulsion 20%", "2.0 kcal/mL", "Max dose: 2.5 g/kg/day standard; 1 g/kg critically ill"],
        ]},
      { type: "table", headers: ["NPC:N Ratio", "Clinical Situation"],
        rows: [
          ["80:1 to 100:1", "Critically ill (high stress) — more protein relative to non-protein calories"],
          ["100:1 to 150:1", "Mild-moderate stress / anabolic — balanced"],
          ["150:1 to 200:1", "Stable/maintenance — less catabolism; lower protein needs"],
        ]},
      { type: "trap", text: "IV dextrose = 3.4 kcal/g, NOT 4 kcal/g (enteral carbohydrate). This difference matters in PN calculations. Also: PPN osmolarity must be <900-1,100 mOsm/L for peripheral vein." },
    ]
  },
  {
    title: "8. Eating Disorders & Refeeding Syndrome",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Feature", "Anorexia Nervosa", "Bulimia Nervosa", "ARFID"],
        rows: [
          ["Body weight", "LOW (BMI <18.5 required)", "NORMAL or above-normal", "Varies; failure to thrive in children"],
          ["Body image disturbance", "YES", "YES", "NO — restriction based on sensory properties"],
          ["Physical signs", "Lanugo, bradycardia, hypotension, amenorrhea, osteoporosis", "Dental erosion, parotid enlargement, Russell's sign", "Micronutrient deficiencies specific to avoided foods"],
          ["Electrolytes", "Hypokalemia (purging subtype), low estrogen, anemia", "Hypokalemia, hypochloremia, hypomagnesemia from purging", "Varies by avoided foods"],
        ]},
      { type: "subtitle", text: "Refeeding Syndrome — Mechanism & Prevention" },
      { type: "bullet", items: [
        "Mechanism: starvation → intracellular phosphorus/K/Mg depleted → reintroduce CHO → insulin → glucose enters cells → drags P, K, Mg intracellularly → serum levels drop precipitously",
        "Primary concern: HYPOPHOSPHATEMIA (can cause cardiac arrhythmia, respiratory failure, seizures, hemolysis)",
        "Risk factors: BMI <16 kg/m² OR weight loss >15% UBW in 3-6 months (major risk criteria)",
        "Prevention: correct electrolytes FIRST; supplement thiamin BEFORE refeeding; start at 25-50% of goal; advance slowly",
        "Monitor: phosphorus, potassium, magnesium, thiamin DAILY for first week",
      ]},
      { type: "trap", text: "Giving IV dextrose to a chronic alcoholic WITHOUT thiamin first can precipitate acute Wernicke's encephalopathy. Always give thiamin BEFORE glucose in suspected thiamin-deficient patients." },
    ]
  },
  {
    title: "9. GI Disorders",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Feature", "Crohn's Disease", "Ulcerative Colitis"],
        rows: [
          ["Location", "Any part of GI tract (mouth to anus)", "Colon and rectum ONLY"],
          ["Pattern", "Skip lesions (normal tissue between inflamed areas)", "Continuous from rectum proximally"],
          ["Depth", "Transmural (full thickness)", "Mucosal and submucosal only"],
          ["Complications", "Fistulas, strictures, abscesses, anal fissures", "Toxic megacolon, colorectal cancer risk"],
          ["Kidney stone risk", "Calcium oxalate (fat malabsorption → hyperoxaluria)", "Less common"],
          ["Surgical cure", "NOT curative — disease can recur in remaining bowel", "Colectomy IS curative"],
        ]},
      { type: "table", headers: ["Condition", "Key MNT Points"],
        rows: [
          ["IBD flare", "Low residue, low fat, high protein; supplement vit D, zinc, B12, folate, iron, Mg, Ca"],
          ["IBS — FODMAP", "Eliminate 6-8 weeks; reintroduce by category; apples + wheat = HIGH FODMAP"],
          ["Celiac disease", "Safe: rice, corn, quinoa, amaranth, buckwheat, sorghum, teff, millet; <20 ppm FDA threshold"],
          ["GERD", "Avoid: caffeine, alcohol, chocolate, peppermint, citrus, high-fat; no lying down 3h after eating; elevate HOB 6-9 inches"],
          ["Pancreatitis — mild", "Oral diet as tolerated; NPO only if cannot eat"],
          ["Pancreatitis — severe", "EN within 48h via NASOJEJUNAL route; 25-35 kcal/kg; 1.2-1.5 g/kg protein"],
          ["Chronic pancreatitis", "PERT with ALL meals and snacks; fat-soluble vitamin supplementation"],
          ["Ileostomy", "Monitor B12, vit D, electrolytes; restrict oxalates; progress clear → low residue → regular"],
          ["Liver disease (cirrhosis)", "Mifflin-St Jeor x DRY WEIGHT + 20%; protein 1.0-1.2 g/kg; sodium <2000 mg; 4-6 meals + late evening snack"],
        ]},
      { type: "trap", text: "HEPATIC ENCEPHALOPATHY: Do NOT restrict protein. Protein restriction worsens sarcopenia and mortality. Maintain adequate protein; use vegetable/dairy proteins (lower ammoniagenic potential); treat the CAUSE." },
    ]
  },
  {
    title: "10. Nutritional Anemias",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Feature", "Iron Deficiency", "B12 Deficiency", "Folate Deficiency", "Anemia of Chronic Disease"],
        rows: [
          ["RBC morphology", "Microcytic hypochromic", "Macrocytic oval", "Macrocytic", "Normocytic normochromic"],
          ["Ferritin", "LOW (most sensitive)", "Normal", "Normal", "ELEVATED (falsely — acute-phase reactant)"],
          ["TIBC", "HIGH (>400)", "Normal", "Normal", "LOW"],
          ["MMA", "Normal", "ELEVATED — key differentiator", "NORMAL", "Normal"],
          ["Homocysteine", "Normal", "ELEVATED", "ELEVATED", "Normal"],
          ["Neuro symptoms", "None", "Peripheral neuropathy; subacute combined degeneration", "NONE — key difference from B12", "None"],
          ["Treatment", "Ferrous sulfate + vitamin C", "IM B12 or high-dose oral 1000 mcg (pernicious anemia)", "Folic acid — but RULE OUT B12 first", "Treat underlying disease; EPO in CKD"],
        ]},
      { type: "trap", text: "Folate corrects macrocytic anemia but MASKS ongoing B12 neurological damage (subacute combined degeneration). Always check B12 BEFORE starting folate supplementation." },
    ]
  },
  {
    title: "Quick Reference — Domain II Most Tested Numbers",
    color: "#C55A11",
    content: [
      { type: "table", headers: ["Scenario", "Energy", "Protein", "Other"],
        rows: [
          ["General ICU", "25-35 kcal/kg ABW", "1.2-2.0 g/kg", "EN within 24-48h"],
          ["CRRT", "25-35 kcal/kg", "1.5-2.5 g/kg", "CRRT removes ~10-15g AA/session"],
          ["Obese ICU BMI 30-50", "11-14 kcal/kg ABW", "≥2 g/kg IBW", "Hypocaloric high-protein"],
          ["Obese ICU BMI >50", "22-25 kcal/kg IBW", "2.5 g/kg IBW", "DIFFERENT from BMI 30-50"],
          ["Burns", "25-35 kcal/kg; max 2x REE", "1.5-2 g/kg or 20-25%", "EN within 4-6h; CHO 60%"],
          ["Pressure ulcer III-IV", "35-40 kcal/kg", "1.5-2.0 g/kg", "Vitamin C + zinc"],
          ["CKD pre-dialysis", "25-35 kcal/kg", "0.55-0.6 g/kg", "Restrict P, K, Na"],
          ["Hemodialysis", "25-35 kcal/kg", "1.0-1.2 g/kg", "Fluid restriction"],
          ["Peritoneal dialysis", "25-35 minus dialysate", "1.2-1.5 g/kg", "300-800 kcal from dialysate"],
          ["Cirrhosis", "MSJ x dry weight + 20%", "1.0-1.2 g/kg", "Sodium <2000; 4-6 meals + late snack"],
          ["Pancreatitis severe", "25-35 kcal/kg", "1.2-1.5 g/kg", "EN within 48h; jejunal route"],
          ["Heart failure", "Individualized", "1.12-1.37 g/kg", "Fluid <2 L/day; Na 1500-2000 mg"],
          ["Refeeding risk", "Start 25-50% of goal", "Correct electrolytes first", "BMI <16 OR weight loss >15% UBW in 3-6 months"],
          ["Hypoglycemia", "N/A", "N/A", "15g fast CHO; 4 oz OJ; NOT peanut butter or diet soda"],
          ["NAFLD weight loss", "N/A", "N/A", "7-10% body weight for histological improvement"],
        ]},
    ]
  },
];

export default function Domain2Page() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/study-guides" style={{ color: "#C55A11", textDecoration: "none", fontSize: 14 }}>← Study Guides</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ background: "#C55A11", color: "#fff", borderRadius: 10, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>D2</div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Domain II — Nutrition Care & MNT</h1>
          <div style={{ color: "#C55A11", fontWeight: 600, fontSize: 14 }}>45% of the RDN Exam — highest priority domain</div>
        </div>
      </div>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>Master this domain and you pass the exam. Covers all clinical nutrition therapy, lab interpretation, and nutrition support.</p>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: section.color, borderBottom: `2px solid ${section.color}`, paddingBottom: 8, marginBottom: 16 }}>{section.title}</h2>
          {section.content.map((block, bi) => {
            if (block.type === "table") return (
              <div key={bi} style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr>{block.headers.map((h, i) => <th key={i} style={{ background: "#1F3864", color: "#fff", padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                  <tbody>{block.rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#FEF4EE" : "#fff" }}>
                      {row.map((cell, ci) => <td key={ci} style={{ padding: "8px 12px", borderBottom: "1px solid #e0e0e0", verticalAlign: "top", fontSize: 13 }}>{cell}</td>)}
                    </tr>
                  ))}</tbody>
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
