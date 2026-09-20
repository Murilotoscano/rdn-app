import React from "react";

export interface DayContent {
    id: number;
    title: string;
    theoryTitle: string;
    theoryGoal: string;
    theoryContent: string;
    practiceTitle: string;
    practiceGoal: string;
    questions: Question[];
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export const studyPlanData: Record<number, DayContent> = {
    1: {
        id: 1,
        title: "Food Science Foundations",
        theoryTitle: "Properties of Water, Carbs, Proteins & Lipids",
        theoryGoal: "Goal: Master the biochemical properties of macronutrients, water activity (aw), and critical reactions like Maillard browning and starch retrogradation for Domain 1.",
        practiceTitle: "App -> Domain 1",
        practiceGoal: "Goal: Complete 40 advanced questions on food science biochemistry and functional ingredient properties.",
        theoryContent: `
            <section>
                <h2>1. Water: The Foundation of Food Science</h2>
                <p>Water is the most abundant component in most foods and a critical medium for all biochemical reactions. For the RDN exam, understanding water's role in shelf-stability and microbial growth is paramount.</p>
                
                <h3>A. Water Activity ($a_w$) vs. Total Moisture Content</h3>
                <p>Moisture content is the absolute amount of water, while <strong>Water Activity ($a_w$)</strong> measures the "energy status" or availability of water for microbial growth and chemical reactions. It is defined as the ratio of the vapor pressure of water in a food to the vapor pressure of pure water at the same temperature ($P/P_0$).</p>
                <ul>
                    <li><strong>Pure Water:</strong> $a_w = 1.00$</li>
                    <li><strong>Bacterial Growth Limit:</strong> Most bacteria require $a_w > 0.91$.</li>
                    <li><strong>Yeast Growth Limit:</strong> Most yeasts require $a_w > 0.87$.</li>
                    <li><strong>Mold Growth Limit:</strong> Most molds require $a_w > 0.80$.</li>
                    <li><strong>Lower Limit for Life:</strong> Some osmophilic yeasts and xerophilic molds can grow at $a_w$ as low as 0.60.</li>
                </ul>
                <p><em>Exam Tip:</em> To lower $a_w$ without freezing, we add <strong>humectants</strong> (sugar, salt, polyols like sorbitol). This binds the "Free Water" into "Bound Water."</p>

                <h3>B. Free vs. Bound Water</h3>
                <ul>
                    <li><strong>Free Water:</strong> Retains its properties as a solvent, can be frozen, and is available for microbial growth.</li>
                    <li><strong>Bound Water:</strong> Chemically or physically bound to other molecules (like proteins or carbs). It does not freeze at 0°C, does not act as a solvent, and does not contribute to $a_w$.</li>
                </ul>

                <h3>C. Boiling Point and Altitude</h3>
                <p>The boiling point of water (100°C at sea level) decreases as altitude increases because atmospheric pressure is lower. For every 500-foot increase in elevation, the boiling point drops by approximately 1°F.</p>
                <p><strong>Impact on Cooking:</strong> Foods take longer to cook at high altitudes because the maximum temperature the water can reach is lower. Conversely, <strong>pressure cookers</strong> increase the boiling point by increasing atmospheric pressure, allowing faster cooking.</p>
            </section>

            <section>
                <h2>2. Carbohydrates: Structure and Function</h2>
                <h3>A. Simple Sugars (Monosaccharides & Disaccharides)</h3>
                <p>Sugars provide sweetness, but also contribute to texture (tenderness), browning, and preservation.</p>
                <ul>
                    <li><strong>Sweetness Scale:</strong> Fructose (sweetest) > Sucrose (benchmark 100) > Glucose > Galactose > Maltose > Lactose (least sweet).</li>
                    <li><strong>Invert Sugar:</strong> A mixture of glucose and fructose formed by the hydrolysis of sucrose. It is more soluble and sweeter than sucrose, and helps prevent crystallization in candies.</li>
                </ul>

                <h3>B. Starches: Amylose vs. Amylopectin</h3>
                <p>Starch consists of two molecules that behave differently during cooking:</p>
                <ul>
                    <li><strong>Amylose (Linear):</strong> Responsible for <strong>gelation</strong> (forming a rigid gel after cooling). High amylose starches (like cornstarch) make firm gels.</li>
                    <li><strong>Amylopectin (Branched):</strong> Responsible for thickening but does not form a gel. Waxy starches (waxy corn, waxy rice) are 100% amylopectin and are stable during freezing/thawing.</li>
                </ul>

                <h3>C. Retrogradation and Syneresis</h3>
                <p><strong>Retrogradation</strong> occurs when starch molecules (primarily amylose) in a cooked, cooled gel rearrange into a more crystalline structure. This causes the texture to become "gritty" or "stale" (e.g., stale bread).</p>
                <p><strong>Syneresis (Weeping)</strong> is the expulsion of liquid from a gel, often following retrogradation or when a gel is cut or sits too long.</p>

                <h3>D. Browning Reactions</h3>
                <ul>
                    <li><strong>Maillard Reaction:</strong> A non-enzymatic browning between a <strong>reducing sugar</strong> (all monosaccharides, lactose, maltose) and an <strong>amino acid</strong>. Requires heat and a slightly alkaline environment. (e.g., crust of bread, seared steak).</li>
                    <li><strong>Caramelization:</strong> The decomposition of sugars at high temperatures (above 160°C). No protein required.</li>
                    <li><strong>Enzymatic Browning:</strong> Reaction between phenolic compounds and oxygen, catalyzed by polyphenol oxidase (e.g., sliced apples turning brown). Prevented by acid (lemon juice), vacuum packing, or blanching.</li>
                </ul>
            </section>

            <section>
                <h2>3. Proteins: Denaturation and Coagulation</h2>
                <p>Proteins are polymers of amino acids linked by peptide bonds. Their functionality depends on their unique 3D shapes.</p>
                
                <h3>A. Principles of Denaturation</h3>
                <p>Denaturation is the unfolding of the protein molecule, exposing hydrophobic groups. This is caused by heat, acid, agitation, or enzymes. Once denatured, proteins often <strong>coagulate</strong> (clump together), changing from liquid to solid (e.g., egg whites hardening).</p>

                <h3>B. Eggs: The Universal Functional Ingredient</h3>
                <ul>
                    <li><strong>Emulsification:</strong> Lecithin in the yolk acts as a bridge between oil and water.</li>
                    <li><strong>Binding/Coagulation:</strong> Proteins set and hold ingredients together.</li>
                    <li><strong>Foaming:</strong> Egg white proteins denature via agitation to trap air. Sugar stabilizes foams; acid (cream of tartar) helps denature proteins to increase volume and stability.</li>
                </ul>

                <h3>C. Meat Science</h3>
                <p>Meat consists of muscle fibers, connective tissue (collagen and elastin), and fat.</p>
                <ul>
                    <li><strong>Collagen:</strong> Structural protein that turns into <strong>gelatin</strong> when heated slowly with moisture. Used in tough cuts (chuck, brisket).</li>
                    <li><strong>Elastin:</strong> Rubbery connective tissue that does not tenderize with heat ("gristle"). Must be removed.</li>
                    <li><strong>Myoglobin:</strong> The primary pigment in meat. Changes from Purplish-red (Deoxyminoglobin) -> Bright Red (Oxymyoglobin) -> Brownish-red (Metmyoglobin) when exposed to oxygen over time.</li>
                </ul>
            </section>

            <section>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 5px solid #6366f1;">
                    <h2 style="margin-top: 0;">Exam Master Recall: The "10-Minute" Challenge</h2>
                    <p>Can you explain the difference between <strong>Sol</strong> (solid in liquid), <strong>Gel</strong> (liquid in solid), and <strong>Emulsion</strong> (liquid in liquid)? Knowing these colloidal states is an RDN exam favorite.</p>
                </div>
            </section>
        `,
        questions: [
            {
                id: "q1-1",
                text: "Which of the following would be the most effective humectant to add to a food product to lower its water activity ($a_w$)?",
                options: ["Cellulose", "Sorbitol", "Hydrogenated Oil", "Lecithin"],
                correctAnswer: 1,
                explanation: "Sorbitol is a polyol that acts as a humectant by binding free water molecules, thereby effectively lowering the water activity ($a_w$) of a product."
            },
            {
                id: "q1-2",
                text: "What process causes the 'weeping' or leaking of liquid from a starch gel that has been stored in the refrigerator?",
                options: ["Gelatinization", "Retrogradation", "Syneresis", "Dextrinization"],
                correctAnswer: 2,
                explanation: "Syneresis is the expulsion of liquid from a gel. It often occurs as a result of retrogradation, where starch molecules rearrange and push out the trapped water."
            }
        ]
    },
    2: {
        id: 2,
        title: "Vitamins, Minerals & Digestion",
        theoryTitle: "Metabolism and Absorption",
        theoryGoal: "Goal: Analyze the entire digestive pathway, enzymatic functions, and the clinical manifestations of micro-nutrient deficiencies and toxicities.",
        practiceTitle: "App -> Domain 1 & 2",
        practiceGoal: "Goal: Achieve 85% accuracy on 40 questions covering metabolism, absorption sites, and vitamin-mineral interactions.",
        theoryContent: `
            <section>
                <h2>1. The Physiology of Digestion</h2>
                <p>Digestion is the mechanical and chemical breakdown of food. For the RDN exam, you must know the specific enzymes, hormones, and absorption sites.</p>
                
                <h3>A. The Mouth and Esophagus</h3>
                <p>Mechanical digestion begins with mastication. Chemical digestion starts with <strong>Salivary Amylase</strong> (breaks down starch into dextrins and maltose).</p>
                
                <h3>B. The Stomach: Chemical Powerhouse</h3>
                <ul>
                    <li><strong>HCl:</strong> Denatures proteins and activates pepsinogen to <strong>pepsin</strong>.</li>
                    <li><strong>Intrinsic Factor:</strong> Essential for B12 absorption in the ileum.</li>
                    <li><strong>Gastrin:</strong> Hormone that stimulates HCl secretion.</li>
                    <li><strong>Mucus:</strong> Protects the stomach lining from self-digestion.</li>
                </ul>

                <h3>C. The Small Intestine: Primary Absorption Site</h3>
                <p>Most digestion and nearly all absorption occurs here. It is divided into the Duodenum, Jejunum, and Ileum.</p>
                <ul>
                    <li><strong>Duodenum:</strong> Most chemical digestion occurs here. Receives bile (from gallbladder) and pancreatic juice.</li>
                    <li><strong>Jejunum:</strong> Primary site for protein and carbohydrate absorption.</li>
                    <li><strong>Ileum:</strong> Absorption of Vitamin B12 and Bile Salts. <em>Critical Note:</em> If the ileum is resected, B12 and fat-soluble vitamin deficiencies are common.</li>
                </ul>
            </section>

            <section>
                <h2>2. Vitamins: Fat-Soluble (A, D, E, K)</h2>
                <h3>Vitamin A (Retinol/Beta-Carotene)</h3>
                <ul>
                    <li><strong>Function:</strong> Vision (rhodopsin), immune function, epithelial health.</li>
                    <li><strong>Deficiency:</strong> Nyctalopia (night blindness - reversible), Xerophthalmia (total blindness - irreversible), Bitot's spots.</li>
                    <li><strong>Toxicity:</strong> Teratogenic (birth defects), liver damage.</li>
                </ul>

                <h3>Vitamin D (Calciferol)</h3>
                <ul>
                    <li><strong>Function:</strong> Calcium and phosphorus absorption; bone mineralization.</li>
                    <li><strong>Deficiency:</strong> Rickets (children), Osteomalacia (adults).</li>
                    <li><strong>Source:</strong> Sunlight (7-dehydrocholesterol -> D3), fatty fish, fortified milk.</li>
                </ul>

                <h3>Vitamin K (Phylloquinone/Menaquinone)</h3>
                <ul>
                    <li><strong>Function:</strong> Blood clotting (synthesis of prothrombin).</li>
                    <li><strong>Source:</strong> Green leafy vegetables, gut bacterial synthesis.</li>
                    <li><strong>Drug Interaction:</strong> Patients on <strong>Warfarin (Coumadin)</strong> must keep Vitamin K intake consistent (not low, but consistent).</li>
                </ul>
            </section>
        `,
        questions: [
            {
                id: "q2-1",
                text: "A patient with a resection of the distal ileum is at highest risk for which deficiency?",
                options: ["Vitamin C", "Iron", "Vitamin B12", "Calcium"],
                correctAnswer: 2,
                explanation: "The distal ileum is the specific site for the absorption of the Vitamin B12-Intrinsic Factor complex."
            }
        ]
    },
    3: {
        id: 3,
        title: "Clinical I - Diabetes & CVD",
        theoryTitle: "Medical Nutrition Therapy for DM and CVD",
        theoryGoal: "Goal: Master diagnostic criteria, carbohydrate counting, insulin action, and the lipid targets that drive cardiovascular MNT.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on diabetes and cardiovascular MNT, targeting 80% accuracy before moving on.",
        theoryContent: `
            <section>
                <h2>1. Diagnosing Diabetes</h2>
                <p>Four criteria establish the diagnosis. Any one is sufficient, but it should be confirmed by repeat testing unless the patient has unequivocal hyperglycemia.</p>
                <ul>
                    <li><strong>Fasting plasma glucose:</strong> 126 mg/dL or higher (fasting = no intake for 8 hours)</li>
                    <li><strong>2-hour OGTT:</strong> 200 mg/dL or higher after a 75 g glucose load</li>
                    <li><strong>A1C:</strong> 6.5% or higher</li>
                    <li><strong>Random glucose:</strong> 200 mg/dL or higher with classic symptoms of hyperglycemia</li>
                </ul>
                <p><strong>Prediabetes:</strong> fasting glucose 100-125 mg/dL, 2-hour OGTT 140-199 mg/dL, or A1C 5.7-6.4%.</p>
                <p><em>Exam trap:</em> A1C reflects roughly 2-3 months of average glycemia. It is unreliable in conditions that alter red cell lifespan, such as hemolytic anemia, recent transfusion, pregnancy, and chronic kidney disease.</p>
            </section>

            <section>
                <h2>2. Carbohydrate Counting</h2>
                <p>One carbohydrate choice equals <strong>15 g of carbohydrate</strong>. This is the single most tested calculation in diabetes MNT.</p>
                <ul>
                    <li>1/3 cup cooked pasta or rice = 1 choice</li>
                    <li>1 slice bread = 1 choice</li>
                    <li>1 small piece fruit = 1 choice</li>
                    <li>1 cup milk = 1 choice</li>
                    <li>1/2 cup starchy vegetable (corn, peas, potato) = 1 choice</li>
                    <li>Non-starchy vegetables = essentially free in small portions</li>
                </ul>
                <h3>Insulin-to-Carbohydrate Ratio</h3>
                <p>Rule of 500: divide 500 by the total daily insulin dose to estimate the grams of carbohydrate covered by 1 unit of rapid-acting insulin.</p>
                <h3>Correction Factor</h3>
                <p>Rule of 1800: divide 1800 by the total daily dose to estimate how many mg/dL one unit will lower blood glucose.</p>
            </section>

            <section>
                <h2>3. Insulin Action Profiles</h2>
                <ul>
                    <li><strong>Rapid (lispro, aspart, glulisine):</strong> onset 15 min, peak 1-2 h, duration 3-5 h. Give at the meal.</li>
                    <li><strong>Short (regular):</strong> onset 30-60 min, peak 2-4 h, duration 5-8 h. Give 30 min before the meal.</li>
                    <li><strong>Intermediate (NPH):</strong> onset 2-4 h, peak 4-10 h, duration 10-16 h. The peak is where nocturnal hypoglycemia happens.</li>
                    <li><strong>Long (glargine, detemir, degludec):</strong> onset 2-4 h, essentially peakless, duration 20-24 h or more.</li>
                </ul>
                <p><em>Clinical reasoning:</em> When a question describes hypoglycemia at a particular time of day, map it against the peak of the insulin the patient is taking.</p>
            </section>

            <section>
                <h2>4. Hypoglycemia: The Rule of 15</h2>
                <p>Blood glucose below 70 mg/dL: give 15 g of fast-acting carbohydrate, wait 15 minutes, recheck. Repeat until above 70, then follow with a meal or snack containing protein.</p>
                <p>15 g equals 4 oz juice or regular soda, 1 tablespoon honey, 3-4 glucose tablets, or 8 oz milk.</p>
                <p><em>Exam trap:</em> Do NOT treat with chocolate or ice cream. The fat delays gastric emptying and slows glucose absorption exactly when speed matters.</p>
            </section>

            <section>
                <h2>5. Cardiovascular Disease MNT</h2>
                <h3>Lipid Targets and Meaning</h3>
                <ul>
                    <li><strong>LDL:</strong> the primary atherogenic particle and the main treatment target</li>
                    <li><strong>HDL:</strong> low is a risk factor; below 40 mg/dL in men, below 50 mg/dL in women</li>
                    <li><strong>Triglycerides:</strong> 150 mg/dL or higher is elevated; above 500 raises pancreatitis risk</li>
                </ul>
                <h3>Dietary Levers, Strongest First</h3>
                <ul>
                    <li>Replace saturated fat with unsaturated fat. This lowers LDL more reliably than cutting total fat.</li>
                    <li>Eliminate industrial trans fat, which raises LDL and lowers HDL simultaneously.</li>
                    <li>Soluble fiber 10-25 g/day (oats, barley, legumes, psyllium) lowers LDL.</li>
                    <li>Plant stanols and sterols 2 g/day block cholesterol absorption.</li>
                    <li>For triglycerides specifically: cut added sugar and alcohol first.</li>
                </ul>
                <h3>DASH Pattern</h3>
                <p>Rich in fruits, vegetables, whole grains, low-fat dairy; limited saturated fat, sweets and sodium. Sodium 2,300 mg/day, with 1,500 mg for greater blood pressure reduction.</p>
                <p><em>Exam trap:</em> Dietary cholesterol has a far weaker effect on serum LDL than saturated and trans fat. Questions that make eggs the villain are usually testing whether you know this.</p>
            </section>
 `,
        questions: [
            {
                id: "q3-1",
                text: "A patient with Type 2 Diabetes is taught CHO counting. They plan to eat 1 cup of cooked pasta and 1 medium apple. How many CHO choices is this?",
                options: ["2", "3", "4", "5"],
                correctAnswer: 2,
                explanation: "1/3 cup cooked pasta = 1 choice (15g). 1 cup = 3 choices. 1 medium apple = 1 choice. Total = 4 choices (approx. 60g CHO)."
            },
            {
                id: "q3-2",
                text: "A patient on NPH insulin at breakfast reports repeated episodes of shakiness and sweating in the mid to late afternoon. What is the most likely explanation?",
                options: ["The long-acting basal insulin is peaking", "The morning NPH dose is peaking 4 to 10 hours after administration", "The patient is experiencing the dawn phenomenon", "The rapid-acting insulin from breakfast is still active"],
                correctAnswer: 1,
                explanation: "NPH peaks 4 to 10 hours after injection, which places a breakfast dose squarely in the mid to late afternoon. Long-acting analogs are essentially peakless. The dawn phenomenon is early morning HYPERglycemia, not afternoon hypoglycemia. Rapid-acting insulin is cleared within 3 to 5 hours and would not still be acting in the afternoon."
            },
            {
                id: "q3-3",
                text: "A patient with a blood glucose of 58 mg/dL is alert and able to swallow. Which treatment best follows the Rule of 15?",
                options: ["A candy bar containing chocolate and nuts", "4 ounces of regular fruit juice, then recheck in 15 minutes", "A glass of diet soda", "A high-protein shake"],
                correctAnswer: 1,
                explanation: "4 oz of juice supplies about 15 g of fast-acting carbohydrate; recheck in 15 minutes and repeat if still below 70 mg/dL. Chocolate and nuts contain fat that delays gastric emptying and slows glucose absorption. Diet soda contains no carbohydrate. A protein shake raises glucose far too slowly for an acute episode."
            },
            {
                id: "q3-4",
                text: "Which dietary change lowers LDL cholesterol most effectively?",
                options: ["Replacing saturated fat with unsaturated fat", "Eliminating all dietary cholesterol", "Reducing total fat to under 15% of calories", "Increasing dietary protein to 30% of calories"],
                correctAnswer: 0,
                explanation: "Substituting unsaturated for saturated fat is the best-supported dietary lever for LDL. Dietary cholesterol has a much weaker effect on serum LDL than saturated and trans fat. Very low total fat diets tend to raise triglycerides and lower HDL as calories shift to carbohydrate. High protein intake does not specifically target LDL."
            }
        ]
    },
    4: {
        id: 4,
        title: "Clinical II - Renal & Critical Care",
        theoryTitle: "CKD Stages and Stress Metabolism",
        theoryGoal: "Goal: Command the CKD staging system, dialysis-specific nutrient shifts, and the metabolic phases of critical illness.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on renal disease and critical care, focusing on electrolyte and protein calculations.",
        theoryContent: `
            <section>
                <h2>1. CKD Staging by eGFR</h2>
                <ul>
                    <li><strong>Stage 1:</strong> eGFR 90 or above with evidence of kidney damage</li>
                    <li><strong>Stage 2:</strong> eGFR 60-89</li>
                    <li><strong>Stage 3a:</strong> eGFR 45-59 &nbsp; <strong>Stage 3b:</strong> eGFR 30-44</li>
                    <li><strong>Stage 4:</strong> eGFR 15-29</li>
                    <li><strong>Stage 5:</strong> eGFR below 15, or on dialysis</li>
                </ul>
            </section>

            <section>
                <h2>2. Protein: The Most Tested Reversal</h2>
                <p>This is where most renal questions live, because the direction of the recommendation flips at dialysis.</p>
                <ul>
                    <li><strong>CKD not on dialysis (stages 3-5):</strong> 0.55-0.60 g/kg/day, to slow progression and reduce uremic load</li>
                    <li><strong>Hemodialysis:</strong> 1.0-1.2 g/kg/day, because amino acids are lost into the dialysate</li>
                    <li><strong>Peritoneal dialysis:</strong> 1.2-1.3 g/kg/day, because protein losses across the peritoneum are even higher</li>
                    <li><strong>Acute kidney injury on CRRT:</strong> up to 1.5-2.0 g/kg/day</li>
                </ul>
                <p><em>Exam trap:</em> Restricting protein in a dialysis patient is a classic wrong answer. Dialysis REMOVES protein, so needs go up, not down.</p>
            </section>

            <section>
                <h2>3. Electrolyte and Mineral Management</h2>
                <h3>Potassium</h3>
                <p>Restricted (typically 2,000-3,000 mg/day) when hyperkalemia is present. High-potassium foods: potatoes, tomatoes, oranges, bananas, melons, avocado, beans, milk, salt substitutes (potassium chloride). Leaching (double-boiling) potatoes reduces potassium content.</p>
                <h3>Phosphorus</h3>
                <p>Restricted to 800-1,000 mg/day. The critical distinction is bioavailability: <strong>inorganic phosphate additives</strong> in processed foods and colas are 90-100% absorbed, while organic phosphorus in plant foods is only 20-50% absorbed because of phytate. Teaching label reading for PHOS additives beats simply banning dairy.</p>
                <p>Phosphate binders must be taken <strong>with meals</strong> to bind dietary phosphorus in the gut. Taking them between meals is a common patient error.</p>
                <h3>Sodium and Fluid</h3>
                <p>Sodium 2,000-2,300 mg/day. Fluid for anuric hemodialysis patients: roughly 1,000 mL plus urine output. Interdialytic weight gain should stay under about 5% of dry weight.</p>
            </section>

            <section>
                <h2>4. Renal Bone and Mineral Disorder</h2>
                <p>Failing kidneys cannot convert 25-hydroxyvitamin D to its active 1,25-dihydroxy form, so calcium absorption falls. Phosphorus retention plus low calcium drives secondary hyperparathyroidism, which pulls calcium from bone.</p>
                <p>Kidneys also produce <strong>erythropoietin</strong>; its loss causes the normocytic anemia of CKD.</p>
            </section>

            <section>
                <h2>5. Metabolic Response to Critical Illness</h2>
                <h3>Ebb Phase (first 24-48 hours)</h3>
                <p>Reduced cardiac output and perfusion, decreased metabolic rate, hyperglycemia from catecholamine release. Goal: resuscitate, not feed aggressively.</p>
                <h3>Flow Phase (days 3-10 and beyond)</h3>
                <p>Hypermetabolism and hypercatabolism. Counter-regulatory hormones (cortisol, catecholamines, glucagon) drive gluconeogenesis, insulin resistance and muscle proteolysis. Negative nitrogen balance is expected and cannot be fully reversed by feeding.</p>
                <h3>Feeding Targets in Critical Illness</h3>
                <ul>
                    <li>Energy: 25-30 kcal/kg/day, ideally measured by indirect calorimetry</li>
                    <li>Protein: 1.2-2.0 g/kg/day</li>
                    <li>Route: enteral within 24-48 hours if hemodynamically stable</li>
                    <li>Permissive underfeeding of ENERGY may be appropriate early, but protein should still be met</li>
                </ul>
                <p><em>Exam trap:</em> Overfeeding a critically ill patient causes hyperglycemia, hypercapnia, hepatic steatosis and delayed ventilator weaning. More calories is not better.</p>
            </section>
 `,
        questions: [
            {
                id: "q4-1",
                text: "A 70 kg patient on maintenance hemodialysis asks about protein. What is the appropriate daily recommendation?",
                options: ["38 to 42 g (0.55 to 0.6 g/kg)", "70 to 84 g (1.0 to 1.2 g/kg)", "28 g (0.4 g/kg)", "140 g (2.0 g/kg)"],
                correctAnswer: 1,
                explanation: "Hemodialysis removes amino acids into the dialysate, so protein needs INCREASE to 1.0 to 1.2 g/kg, or 70 to 84 g for this patient. The 0.55 to 0.6 g/kg range applies to CKD before dialysis. A 0.4 g/kg intake would be dangerously low. A 2.0 g/kg intake applies to acute kidney injury on continuous renal replacement therapy, not maintenance hemodialysis."
            },
            {
                id: "q4-2",
                text: "A CKD patient has hyperphosphatemia despite taking a phosphate binder. Which question is most important to ask?",
                options: ["Are you taking the binder with your meals?", "Are you taking the binder with water only?", "Are you taking the binder at bedtime?", "Are you crushing the binder before taking it?"],
                correctAnswer: 0,
                explanation: "Phosphate binders work by binding dietary phosphorus in the gastrointestinal tract, so they must be taken WITH meals and snacks. Taking them with water alone, at bedtime, or away from food means there is no dietary phosphorus present to bind, which is one of the most common reasons for treatment failure."
            },
            {
                id: "q4-3",
                text: "Which phosphorus source is most completely absorbed and therefore most important to limit in CKD?",
                options: ["Phosphorus in whole grains and legumes", "Inorganic phosphate additives in processed foods and colas", "Phosphorus in fresh fruit", "Phosphorus in leafy greens"],
                correctAnswer: 1,
                explanation: "Inorganic phosphate additives are 90 to 100% absorbed, while organic phosphorus bound in plant foods as phytate is only 20 to 50% absorbed because humans lack phytase. This is why label reading for PHOS-containing additives is more effective than blanket restriction of nutritious plant foods."
            },
            {
                id: "q4-4",
                text: "A ventilated ICU patient on day 5 of critical illness is receiving 40 kcal/kg per day and has rising carbon dioxide with difficulty weaning. What is the most likely problem?",
                options: ["Underfeeding causing respiratory muscle weakness", "Overfeeding causing excess carbon dioxide production", "Inadequate protein delivery", "Excessive fat in the formula"],
                correctAnswer: 1,
                explanation: "40 kcal/kg substantially exceeds the recommended 25 to 30 kcal/kg for critical illness. Overfeeding drives lipogenesis and raises carbon dioxide production, increasing ventilatory demand and delaying weaning. Underfeeding would cause a different picture, with low respiratory quotient. Protein and fat composition matter far less than total energy excess here."
            }
        ]
    },
    5: {
        id: 5,
        title: "Nutrition Support",
        theoryTitle: "EN and PN Formulas & Calculations",
        theoryGoal: "Goal: Choose the right route and formula, and execute the parenteral calculations that appear on nearly every exam form.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on enteral and parenteral nutrition, with emphasis on calculation items.",
        theoryContent: `
            <section>
                <h2>1. Route Selection: The Decision Tree</h2>
                <p><strong>If the gut works, use it.</strong> Enteral nutrition preserves mucosal integrity, reduces bacterial translocation, and carries far lower infectious risk than parenteral.</p>
                <ul>
                    <li><strong>Under 4-6 weeks:</strong> nasogastric, or nasojejunal if aspiration risk or gastroparesis</li>
                    <li><strong>Over 4-6 weeks:</strong> PEG (gastrostomy), or jejunostomy if the stomach must be bypassed</li>
                    <li><strong>Gut unusable:</strong> parenteral nutrition</li>
                </ul>
                <p>Absolute contraindications to enteral feeding: bowel obstruction, bowel ischemia, high-output fistula distal to the access site, severe hemodynamic instability.</p>
            </section>

            <section>
                <h2>2. Formula Selection</h2>
                <ul>
                    <li><strong>Standard polymeric:</strong> 1.0-1.2 kcal/mL, intact protein, for a functioning GI tract</li>
                    <li><strong>Calorie dense:</strong> 1.5-2.0 kcal/mL, for fluid restriction</li>
                    <li><strong>Semi-elemental:</strong> hydrolyzed peptides plus MCT, for malabsorption and short bowel</li>
                    <li><strong>Renal:</strong> calorie dense, low potassium, phosphorus and magnesium</li>
                    <li><strong>Immune-modulating:</strong> arginine, omega-3, nucleotides, for elective major surgery - avoid arginine formulas in severe sepsis</li>
                </ul>
                <h3>Free Water in Formula</h3>
                <p>1.0 kcal/mL is about 85% water. 1.5 kcal/mL is about 76-78%. 2.0 kcal/mL is about 70%. Formula volume is NOT free water, and forgetting this is the classic cause of hypernatremia.</p>
            </section>

            <section>
                <h2>3. Parenteral Nutrition Calculations</h2>
                <h3>Energy Yields</h3>
                <ul>
                    <li><strong>Dextrose (monohydrate):</strong> 3.4 kcal/g - not 4</li>
                    <li><strong>Amino acids:</strong> 4 kcal/g</li>
                    <li><strong>Lipid emulsion 20%:</strong> 2.0 kcal/mL &nbsp;|&nbsp; 10%: 1.1 kcal/mL &nbsp;|&nbsp; 30%: 3.0 kcal/mL</li>
                </ul>
                <h3>Worked Example</h3>
                <p>A 2,000 mL bag containing 15% dextrose, 4% amino acids, plus 250 mL of 20% lipid:</p>
                <ul>
                    <li>Dextrose: 2,000 mL x 0.15 = 300 g x 3.4 = <strong>1,020 kcal</strong></li>
                    <li>Amino acids: 2,000 mL x 0.04 = 80 g x 4 = <strong>320 kcal</strong></li>
                    <li>Lipid: 250 mL x 2.0 = <strong>500 kcal</strong></li>
                    <li>Total = <strong>1,840 kcal</strong> with 80 g protein</li>
                </ul>
                <h3>Glucose Infusion Rate</h3>
                <p>GIR (mg/kg/min) = grams dextrose x 1,000 divided by kg divided by 1,440. Keep at or below about <strong>4-5 mg/kg/min</strong> in adults; exceeding it causes hyperglycemia and hepatic steatosis.</p>
                <h3>Osmolarity Limit</h3>
                <p>Peripheral PN must stay at or below about <strong>900 mOsm/L</strong>. Anything higher needs central access.</p>
            </section>

            <section>
                <h2>4. Refeeding Syndrome</h2>
                <p>Reintroducing carbohydrate after starvation releases insulin, which drives <strong>phosphorus, potassium and magnesium</strong> intracellularly. The hallmark is falling phosphorus.</p>
                <p><strong>High risk:</strong> BMI under 16, minimal intake for more than 5-10 days, alcohol use disorder, anorexia nervosa, large recent weight loss.</p>
                <p><strong>Prevention:</strong> start at roughly 25% of goal, give thiamine BEFORE or with the first carbohydrate load, check electrolytes daily and replete aggressively, advance over 3-5 days.</p>
            </section>
 `,
        questions: [
            {
                id: "q5-1",
                text: "A parenteral formulation provides 2,000 mL of 15% dextrose. How many kilocalories does the dextrose supply?",
                options: ["1,200 kcal", "1,020 kcal", "300 kcal", "1,360 kcal"],
                correctAnswer: 1,
                explanation: "2,000 mL at 15% supplies 300 g of dextrose. Dextrose monohydrate yields 3.4 kcal/g, not 4, so 300 x 3.4 = 1,020 kcal. Using 4 kcal/g gives 1,200 kcal, which is the single most common error on this calculation. The 300 figure is the grams, not the calories."
            },
            {
                id: "q5-2",
                text: "A severely malnourished patient with a BMI of 14 is started on tube feeding at full goal rate. On day 2 he becomes confused and weak with a phosphorus of 1.1 mg/dL. What should have been done differently?",
                options: ["A calorie-dense formula should have been selected", "Feeding should have started at about 25% of goal with thiamine and daily electrolyte monitoring", "A jejunal route should have been used", "Protein should have been restricted"],
                correctAnswer: 1,
                explanation: "This is refeeding syndrome. High-risk patients require a cautious start at roughly 25% of estimated needs, thiamine before or with the first carbohydrate load, and daily monitoring with repletion of phosphorus, potassium and magnesium. Formula concentration and route of access do not drive the intracellular electrolyte shift, and protein is not the trigger; carbohydrate is."
            },
            {
                id: "q5-3",
                text: "A patient receives 1,500 mL daily of a 1.5 kcal/mL formula plus 120 mL of water flushes. Serum sodium is 151 mEq/L. What is the most likely cause?",
                options: ["Excess sodium in the formula", "Inadequate free water provision", "Refeeding syndrome", "Excess protein in the formula"],
                correctAnswer: 1,
                explanation: "A 1.5 kcal/mL formula is only about 76 to 78% water, so 1,500 mL supplies roughly 1,150 mL of water. Adding 120 mL of flushes still leaves the patient well short of typical requirements. Enteral formulas are relatively low in sodium. Refeeding syndrome causes LOW phosphorus, potassium and magnesium, not high sodium."
            }
        ]
    },
    6: {
        id: 6,
        title: "Food Service Systems",
        theoryTitle: "Production Systems, Procurement & Inventory",
        theoryGoal: "Goal: Distinguish the four production systems by their trade-offs, and execute inventory and cost calculations.",
        practiceTitle: "App -> Domain IV (Foodservice Systems)",
        practiceGoal: "Goal: Complete 40 Domain IV questions on production systems, procurement and inventory control.",
        theoryContent: `
            <section>
                <h2>1. The Four Production Systems</h2>
                <ul>
                    <li><strong>Conventional (cook-serve):</strong> produced and served on site. Highest quality and freshness; uneven peak workload at meal times.</li>
                    <li><strong>Ready-prepared (cook-chill / cook-freeze):</strong> cooked, chilled, stored, rethermalized at service. Separates production from service in <strong>TIME</strong>. Even workload; requires blast chillers.</li>
                    <li><strong>Commissary (central kitchen):</strong> bulk production distributed to satellites. Separates production from service in <strong>LOCATION</strong>. Uniform product; food safety risk in transport.</li>
                    <li><strong>Assembly-serve (convenience):</strong> purchase fully prepared, heat and serve. Lowest labor and equipment cost; highest food cost and most limited menu.</li>
                </ul>
                <p><em>Exam trap:</em> Ready-prepared separates in TIME. Commissary separates in LOCATION. That single distinction answers most questions on this topic.</p>
            </section>

            <section>
                <h2>2. Supplier Types</h2>
                <ul>
                    <li><strong>Manufacturer:</strong> lowest price, high minimums</li>
                    <li><strong>Wholesaler / distributor:</strong> BUYS and OWNS inventory (takes title); one-stop shopping with delivery</li>
                    <li><strong>Broker:</strong> NEVER takes title; acts as agent and earns commission</li>
                    <li><strong>Group purchasing organization:</strong> negotiates volume contracts</li>
                </ul>
                <p><em>Exam trap:</em> The broker-versus-wholesaler distinction is title to goods. A broker never owns the product.</p>
                <h3>FOB Terms</h3>
                <ul>
                    <li><strong>FOB Origin:</strong> title passes when goods leave the supplier. BUYER bears transit risk and freight.</li>
                    <li><strong>FOB Destination:</strong> title passes on arrival at your dock. SELLER bears transit risk and freight.</li>
                </ul>
            </section>

            <section>
                <h2>3. Inventory Control</h2>
                <h3>Valuation Methods</h3>
                <ul>
                    <li><strong>FIFO:</strong> oldest cost used first; matches physical rotation of perishables</li>
                    <li><strong>LIFO:</strong> newest cost first; not appropriate for perishable rotation</li>
                    <li><strong>Weighted average:</strong> weights BOTH unit price AND number of units purchased - not a simple average of prices</li>
                </ul>
                <h3>ABC Analysis</h3>
                <ul>
                    <li><strong>A items:</strong> 10-20% of items, 60-80% of value. Tight control, perpetual inventory.</li>
                    <li><strong>B items:</strong> 20-30% of items, 15-25% of value. Moderate control.</li>
                    <li><strong>C items:</strong> 50-60% of items, 5-10% of value. Minimal control, bulk ordering.</li>
                </ul>
                <h3>Key Formulas</h3>
                <ul>
                    <li><strong>Food cost:</strong> opening inventory + purchases - closing inventory</li>
                    <li><strong>Inventory turnover:</strong> food cost / average inventory. Target 2-3 times per month.</li>
                    <li><strong>Reorder point:</strong> safety stock + (average daily usage x lead time in days)</li>
                    <li><strong>AP to EP:</strong> EP needed / yield % = AP to purchase</li>
                    <li><strong>Food cost %:</strong> (food cost / food sales) x 100</li>
                    <li><strong>Selling price:</strong> food cost / target food cost %</li>
                </ul>
            </section>

            <section>
                <h2>4. Receiving</h2>
                <p><strong>Standard receiving:</strong> compare delivered goods against the invoice while the driver waits.</p>
                <p><strong>Blind receiving:</strong> the receiver counts without seeing quantities or prices. Most ACCURATE, most EXPENSIVE, prevents collusion.</p>
                <p>Five steps: compare purchase order to invoice, inspect, accept or reject, complete records, store immediately using FIFO.</p>
            </section>
 `,
        questions: [
            {
                id: "q6-1",
                text: "A hospital cooks food, chills it rapidly, stores it for up to several days, and rethermalizes it on the unit at service time. Which production system is this?",
                options: ["Conventional", "Ready-prepared (cook-chill)", "Commissary", "Assembly-serve"],
                correctAnswer: 1,
                explanation: "Cooking, chilling, storing and rethermalizing later is ready-prepared, which separates production from service in TIME. Conventional produces and serves immediately. Commissary separates production from service in LOCATION, with a central kitchen supplying satellites. Assembly-serve does no significant cooking on site."
            },
            {
                id: "q6-2",
                text: "A foodservice operation has monthly food cost of $42,000 and average inventory value of $15,000. What is the inventory turnover rate and how should it be interpreted?",
                options: ["2.8 turns per month, within the normal range of 2 to 3", "0.36 turns per month, indicating excessive inventory", "6.3 turns per month, indicating stockout risk", "2.8 turns per year, indicating excessive inventory"],
                correctAnswer: 0,
                explanation: "Turnover equals food cost divided by average inventory: 42,000 / 15,000 = 2.8 turns per month, which sits within the typical target of 2 to 3. Inverting the ratio gives 0.36 and misreads the formula. The 6.3 figure does not follow from these numbers, and reading the result as annual rather than monthly misstates the period being measured."
            },
            {
                id: "q6-3",
                text: "Which statement correctly distinguishes a broker from a wholesaler?",
                options: ["A broker takes title to goods; a wholesaler does not", "A broker never takes title and earns commission; a wholesaler buys and owns inventory", "Both take title, but a broker delivers faster", "Neither takes title; both act as agents"],
                correctAnswer: 1,
                explanation: "The defining difference is ownership. A broker acts as an agent, never taking title, and is compensated by commission from the manufacturer. A wholesaler or distributor purchases goods, takes title, holds inventory and resells. Delivery speed is not the distinguishing feature."
            }
        ]
    },
    7: {
        id: 7,
        title: "Leadership & HR",
        theoryTitle: "Management Theories, Styles & Employment Law",
        theoryGoal: "Goal: Map the POSDC functions, match leadership style to staff readiness, and recognize the employment laws that generate exam scenarios.",
        practiceTitle: "App -> Domain III (Management)",
        practiceGoal: "Goal: Complete 40 Domain III questions on management functions, leadership styles and human resources law.",
        theoryContent: `
            <section>
                <h2>1. Management Functions (POSDC)</h2>
                <ul>
                    <li><strong>Planning:</strong> setting goals and deciding how to reach them. Budgets, policies, disaster plans.</li>
                    <li><strong>Organizing:</strong> arranging resources and structure. Org charts, job duties, workflow design, scheduling.</li>
                    <li><strong>Staffing:</strong> recruiting, selecting, training, evaluating. FTE calculation, job descriptions.</li>
                    <li><strong>Directing:</strong> guiding and motivating. Delegation, feedback, conflict resolution.</li>
                    <li><strong>Controlling:</strong> measuring performance against standards and correcting deviations.</li>
                </ul>
                <p><em>Exam trap:</em> Planning SETS the standard. Controlling MEASURES against it and corrects. They are sequential, and scenario questions hinge on which one is happening.</p>
            </section>

            <section>
                <h2>2. Leadership Styles</h2>
                <ul>
                    <li><strong>Autocratic:</strong> leader decides alone. Best in emergencies or with new staff.</li>
                    <li><strong>Democratic / participative:</strong> involves staff, but the MANAGER makes the final decision.</li>
                    <li><strong>Consensus:</strong> requires UNANIMOUS agreement before deciding.</li>
                    <li><strong>Laissez-faire:</strong> minimal direction; for highly skilled, self-directed professionals.</li>
                    <li><strong>Transformational:</strong> inspires through vision; for culture change.</li>
                    <li><strong>Transactional:</strong> rewards and punishments tied to performance.</li>
                </ul>
                <p><em>Exam trap:</em> Participative is NOT consensus. Participative gathers input and the manager decides; consensus requires everyone to agree. This is the most commonly confused pair on the exam.</p>
            </section>

            <section>
                <h2>3. Hersey-Blanchard Situational Leadership</h2>
                <p>Match your style to the follower's readiness, which combines ABILITY and WILLINGNESS.</p>
                <ul>
                    <li><strong>M1</strong> low ability, high willingness &rarr; <strong>S1 Telling.</strong> High task, low relationship. Specific step-by-step direction.</li>
                    <li><strong>M2</strong> low-moderate ability, low willingness &rarr; <strong>S2 Selling / Coaching.</strong> High task AND high relationship. Explain why.</li>
                    <li><strong>M3</strong> high ability, variable willingness &rarr; <strong>S3 Participating.</strong> Low task, high relationship. Build confidence.</li>
                    <li><strong>M4</strong> high ability, high willingness &rarr; <strong>S4 Delegating.</strong> Low task, low relationship. Hand it over and step back.</li>
                </ul>
            </section>

            <section>
                <h2>4. Motivation Theories</h2>
                <ul>
                    <li><strong>Theory X:</strong> workers are lazy and need control. Authoritarian, tight supervision.</li>
                    <li><strong>Theory Y:</strong> workers are self-directed and seek responsibility. Basis for Management by Objectives.</li>
                    <li><strong>Theory Z (Ouchi):</strong> belonging, collective decisions, long-term employment.</li>
                    <li><strong>Maslow:</strong> physiological, safety, social, esteem, self-actualization. Lower needs must be met first.</li>
                    <li><strong>Herzberg two-factor:</strong> HYGIENE factors (salary, conditions, policy) prevent dissatisfaction but do not motivate. MOTIVATORS (achievement, recognition, growth) create satisfaction.</li>
                </ul>
                <p><em>Exam trap:</em> Raising pay when hygiene factors are already adequate will not motivate. Herzberg questions usually test exactly this.</p>
            </section>

            <section>
                <h2>5. Employment Law</h2>
                <ul>
                    <li><strong>Title VII (1964):</strong> no discrimination by race, color, religion, sex, national origin</li>
                    <li><strong>ADA (1990):</strong> reasonable accommodation for qualified individuals with disabilities</li>
                    <li><strong>FLSA (1938):</strong> minimum wage, overtime at 1.5x after 40 hours, child labor</li>
                    <li><strong>ADEA (1967):</strong> protects workers aged 40 and over</li>
                    <li><strong>FMLA (1993):</strong> 12 weeks unpaid job-protected leave</li>
                    <li><strong>OSHA (1970):</strong> workplace safety; fatalities reported within 8 hours</li>
                </ul>
                <h3>Illegal vs Legal Interview Questions</h3>
                <ul>
                    <li>Illegal: "Do you have children?" &rarr; Legal: "Can you work the required hours?"</li>
                    <li>Illegal: "Where were you born?" &rarr; Legal: "Are you authorized to work in the US?"</li>
                    <li>Illegal: "Do you have a disability?" &rarr; Legal: "Can you perform the essential functions with or without accommodation?"</li>
                </ul>
                <h3>FTE Calculation</h3>
                <p>FTE = (positions x hours per shift x days per week) / 40. Example: 10 positions x 8 h x 7 days = 560 / 40 = <strong>14 FTE</strong>.</p>
            </section>
 `,
        questions: [
            {
                id: "q7-1",
                text: "A manager holds a staff meeting to gather input on a new tray line layout, listens to all suggestions, then makes the final decision herself. Which leadership style is this?",
                options: ["Consensus", "Democratic / participative", "Autocratic", "Laissez-faire"],
                correctAnswer: 1,
                explanation: "Gathering input while retaining the final decision is participative or democratic leadership. Consensus would require unanimous agreement from the group before proceeding. Autocratic leadership would involve no staff input at all. Laissez-faire would mean the manager hands the decision entirely to the team without direction."
            },
            {
                id: "q7-2",
                text: "A newly hired clinical dietitian is enthusiastic but has never performed nutrition-focused physical exams. Using Hersey-Blanchard, which leadership style fits?",
                options: ["S1 Telling, with specific step-by-step direction", "S4 Delegating, giving the task and stepping back", "S3 Participating, involving her in decisions", "S2 Selling, focused on rebuilding her motivation"],
                correctAnswer: 0,
                explanation: "High willingness with low ability is maturity level M1, which calls for S1 Telling: high task direction and close supervision with specific instructions. Delegating suits M4, where both ability and willingness are high. Participating suits M3, where ability is high but confidence varies. Selling addresses M2, where motivation has dropped, but this employee is already enthusiastic."
            },
            {
                id: "q7-3",
                text: "A foodservice department needs 12 positions covered 8 hours a day, 7 days a week. How many FTEs are required?",
                options: ["12.0 FTE", "16.8 FTE", "21.0 FTE", "8.4 FTE"],
                correctAnswer: 1,
                explanation: "FTE equals positions times hours times days, divided by 40. Here 12 x 8 x 7 = 672 hours per week, divided by 40 = 16.8 FTE. Answering 12.0 confuses positions with FTEs and ignores seven-day coverage. The other figures do not follow from the formula."
            },
            {
                id: "q7-4",
                text: "An employee is transferred to a lower-visibility role after the manager hears a rumor that he has a chronic illness. Which law is most likely violated?",
                options: ["Fair Labor Standards Act", "Americans with Disabilities Act", "Family and Medical Leave Act", "National Labor Relations Act"],
                correctAnswer: 1,
                explanation: "The ADA prohibits adverse employment action based on a disability, including a perceived or rumored one, and requires an interactive accommodation process rather than unilateral reassignment. The FLSA governs wages and overtime. FMLA governs protected leave, which is not what occurred here. The NLRA protects union organizing activity."
            }
        ]
    },
    8: {
        id: 8,
        title: "Counseling & Behavioral Science",
        theoryTitle: "Theories of Change, Motivational Interviewing & Education",
        theoryGoal: "Goal: Match a counseling strategy to the client's stage of change, and apply adult learning and literacy principles.",
        practiceTitle: "App -> Domain I (Food and Nutrition Sciences)",
        practiceGoal: "Goal: Complete 40 Domain I questions on education, counseling theory and behavior change.",
        theoryContent: `
            <section>
                <h2>1. Transtheoretical Model (Stages of Change)</h2>
                <ul>
                    <li><strong>Precontemplation:</strong> no intention to change within 6 months. Often unaware of the problem. Intervention: raise awareness, provide information, do not push an action plan.</li>
                    <li><strong>Contemplation:</strong> aware and considering change within 6 months, but ambivalent. Intervention: explore pros and cons, resolve ambivalence.</li>
                    <li><strong>Preparation:</strong> intends to act within 30 days, may have taken small steps. Intervention: set goals, build a concrete plan.</li>
                    <li><strong>Action:</strong> has made changes within the last 6 months. Intervention: reinforce, problem-solve barriers.</li>
                    <li><strong>Maintenance:</strong> sustained change beyond 6 months. Intervention: relapse prevention.</li>
                </ul>
                <p><em>Exam trap:</em> Handing a detailed meal plan to a precontemplative client is the classic wrong answer. Match the intervention to the stage.</p>
            </section>

            <section>
                <h2>2. Motivational Interviewing</h2>
                <p>Collaborative, client-centered, and designed to resolve ambivalence by evoking the client's OWN reasons for change rather than supplying yours.</p>
                <p><strong>OARS techniques:</strong></p>
                <ul>
                    <li><strong>O</strong>pen-ended questions</li>
                    <li><strong>A</strong>ffirmations</li>
                    <li><strong>R</strong>eflective listening</li>
                    <li><strong>S</strong>ummarizing</li>
                </ul>
                <p>Core principles: express empathy, develop discrepancy between current behavior and goals, roll with resistance rather than confronting it, and support self-efficacy.</p>
                <p><em>Exam trap:</em> Confrontation and warning of consequences produce resistance. If an option has the dietitian telling the client what they must do, it is almost certainly wrong on an MI question.</p>
            </section>

            <section>
                <h2>3. Other Behavior Change Theories</h2>
                <ul>
                    <li><strong>Health Belief Model:</strong> perceived susceptibility, severity, benefits, barriers, cues to action, self-efficacy</li>
                    <li><strong>Social Cognitive Theory:</strong> reciprocal determinism among person, behavior and environment; observational learning; self-efficacy</li>
                    <li><strong>Theory of Planned Behavior:</strong> attitude + subjective norms + perceived behavioral control &rarr; intention &rarr; behavior</li>
                </ul>
            </section>

            <section>
                <h2>4. Adult Learning and Education</h2>
                <p><strong>Andragogy</strong> (adult learning) assumes learners are self-directed, problem-centered, internally motivated, and bring experience to draw on. <strong>Pedagogy</strong> is teacher-directed and content-centered.</p>
                <h3>Readability and Health Literacy</h3>
                <ul>
                    <li>General population: aim for <strong>8th grade</strong> reading level</li>
                    <li>Low literacy populations: aim for <strong>6th grade</strong></li>
                    <li>The <strong>SMOG</strong> index is the tool commonly cited for calculating readability</li>
                    <li><strong>Teach-back</strong> confirms understanding: ask the client to explain it in their own words</li>
                </ul>
                <h3>Learning Domains</h3>
                <ul>
                    <li><strong>Cognitive:</strong> knowledge and thinking</li>
                    <li><strong>Affective:</strong> attitudes, values, feelings</li>
                    <li><strong>Psychomotor:</strong> physical skills, such as using a glucometer</li>
                </ul>
            </section>

            <section>
                <h2>5. Writing Objectives and the NCP</h2>
                <p>Behavioral objectives should be SMART: specific, measurable, achievable, relevant, time-bound.</p>
                <p><strong>Nutrition Care Process:</strong> Assessment &rarr; Diagnosis &rarr; Intervention &rarr; Monitoring and Evaluation.</p>
                <p>The diagnosis is written as a <strong>PES statement</strong>: Problem related to Etiology as evidenced by Signs and symptoms. The intervention must target the ETIOLOGY, not the sign.</p>
            </section>
 `,
        questions: [
            {
                id: "q8-1",
                text: "A client says he knows he should cut back on soda and has been thinking about it for months, but has not started and is not sure it is worth it. Which stage of change is he in?",
                options: ["Precontemplation", "Contemplation", "Preparation", "Action"],
                correctAnswer: 1,
                explanation: "Awareness of the problem combined with ambivalence and no concrete steps places him in contemplation. Precontemplation would mean no intention and often no awareness. Preparation implies intent to act within about 30 days, usually with small steps already taken. Action means the change has already been made within the last six months."
            },
            {
                id: "q8-2",
                text: "Which response best reflects motivational interviewing when a client expresses resistance to changing his diet?",
                options: ["Explain the health consequences of not changing in detail", "Reflect what he said and ask what he sees as the benefits and drawbacks of changing", "Provide a printed meal plan and schedule a follow-up", "Tell him his lab values leave him no choice"],
                correctAnswer: 1,
                explanation: "Reflective listening paired with exploring the client's own pros and cons rolls with resistance and evokes change talk, which is the core of motivational interviewing. Detailing consequences and telling him he has no choice are confrontational and typically strengthen resistance. Handing over a meal plan skips the readiness question entirely and rarely produces adherence in an ambivalent client."
            },
            {
                id: "q8-3",
                text: "A PES statement reads: Excessive carbohydrate intake related to lack of knowledge of carbohydrate counting as evidenced by A1C of 9.2% and 3-day food record. Which intervention correctly targets the etiology?",
                options: ["Recheck A1C in 3 months", "Provide carbohydrate counting education", "Refer for a 3-day food record", "Increase insulin dosing"],
                correctAnswer: 1,
                explanation: "The etiology is lack of knowledge of carbohydrate counting, so education on carbohydrate counting addresses the cause directly. Rechecking A1C is monitoring and evaluation, not intervention. Repeating the food record is assessment. Adjusting insulin is a medical intervention outside the dietitian's diagnosis and does not address the knowledge deficit identified."
            }
        ]
    },
    9: {
        id: 9,
        title: "Research & Statistical Analysis",
        theoryTitle: "Study Designs, Statistics & Evidence Grading",
        theoryGoal: "Goal: Rank study designs by strength of evidence and interpret the statistics that appear in exam stems.",
        practiceTitle: "App -> Domain I (Food and Nutrition Sciences)",
        practiceGoal: "Goal: Complete 40 Domain I questions on research methods, study design and statistical interpretation.",
        theoryContent: `
            <section>
                <h2>1. Hierarchy of Evidence</h2>
                <p>From strongest to weakest:</p>
                <ol>
                    <li><strong>Systematic review / meta-analysis</strong> of RCTs</li>
                    <li><strong>Randomized controlled trial</strong> - the only design that establishes causation</li>
                    <li><strong>Cohort study</strong> - prospective, follows exposed and unexposed forward; yields incidence and relative risk</li>
                    <li><strong>Case-control study</strong> - retrospective, starts with disease and looks back; yields odds ratio. Efficient for RARE diseases.</li>
                    <li><strong>Cross-sectional study</strong> - snapshot at one point in time; yields PREVALENCE</li>
                    <li><strong>Case series / case report</strong></li>
                    <li><strong>Expert opinion</strong></li>
                </ol>
                <p><em>Exam trap:</em> Only an RCT supports causal claims. Observational designs show association. Questions that ask which design "proves" something are testing this.</p>
            </section>

            <section>
                <h2>2. Key Design Concepts</h2>
                <ul>
                    <li><strong>Randomization:</strong> distributes confounders evenly between groups</li>
                    <li><strong>Blinding:</strong> single (subject), double (subject and investigator), triple (adds analyst)</li>
                    <li><strong>Placebo control:</strong> isolates the treatment effect</li>
                    <li><strong>Crossover:</strong> each subject serves as their own control; requires a washout period</li>
                    <li><strong>Intention-to-treat:</strong> analyze subjects in their assigned group regardless of adherence; preserves randomization</li>
                </ul>
                <h3>Qualitative vs Quantitative</h3>
                <p>Qualitative research produces narrative, non-numerical data: focus groups, in-depth interviews, ethnography. Quantitative produces numerical data: surveys with scales, RCTs, cohort studies.</p>
            </section>

            <section>
                <h2>3. Descriptive Statistics</h2>
                <ul>
                    <li><strong>Mean:</strong> arithmetic average; sensitive to outliers</li>
                    <li><strong>Median:</strong> middle value; preferred for SKEWED data such as income or length of stay</li>
                    <li><strong>Mode:</strong> most frequent value; the only measure usable for nominal data</li>
                    <li><strong>Standard deviation:</strong> spread around the mean</li>
                </ul>
                <p>In a normal distribution: about 68% of values fall within 1 SD, 95% within 2 SD, 99.7% within 3 SD.</p>
                <h3>Levels of Measurement</h3>
                <ul>
                    <li><strong>Nominal:</strong> categories with no order (sex, diagnosis)</li>
                    <li><strong>Ordinal:</strong> ordered categories with unequal intervals (Likert scale, CKD stage)</li>
                    <li><strong>Interval:</strong> equal intervals, no true zero (degrees Celsius)</li>
                    <li><strong>Ratio:</strong> equal intervals with a true zero (weight, height, kcal)</li>
                </ul>
            </section>

            <section>
                <h2>4. Inferential Statistics</h2>
                <ul>
                    <li><strong>p value:</strong> probability of data at least this extreme IF the null hypothesis were true. p less than 0.05 is conventionally significant. It is NOT the probability that the result occurred by chance, and it says nothing about effect size or clinical importance.</li>
                    <li><strong>Type I error (alpha):</strong> rejecting a TRUE null hypothesis - a false positive</li>
                    <li><strong>Type II error (beta):</strong> failing to reject a FALSE null hypothesis - a false negative</li>
                    <li><strong>Power:</strong> 1 minus beta; the ability to detect a real effect. Increased by larger sample size.</li>
                    <li><strong>Confidence interval:</strong> if a 95% CI for a relative risk crosses 1.0, the result is not statistically significant</li>
                </ul>
                <h3>Choosing a Test</h3>
                <ul>
                    <li><strong>t-test:</strong> compares means of TWO groups</li>
                    <li><strong>ANOVA:</strong> compares means of THREE OR MORE groups</li>
                    <li><strong>Chi-square:</strong> compares categorical/nominal data</li>
                    <li><strong>Correlation (r):</strong> strength and direction of a linear relationship, from -1 to +1</li>
                </ul>
                <p><em>Exam trap:</em> Statistical significance is not clinical significance. A trivial difference can reach p less than 0.05 with a large enough sample.</p>
            </section>

            <section>
                <h2>5. Validity and Reliability</h2>
                <ul>
                    <li><strong>Validity:</strong> the tool measures what it claims to measure</li>
                    <li><strong>Reliability:</strong> the tool gives consistent results on repetition</li>
                    <li><strong>Sensitivity:</strong> correctly identifies those WITH the condition (few false negatives)</li>
                    <li><strong>Specificity:</strong> correctly identifies those WITHOUT it (few false positives)</li>
                </ul>
                <p>A good SCREENING tool prioritizes sensitivity, because missing a case is worse than a false alarm that later gets ruled out.</p>
            </section>
 `,
        questions: [
            {
                id: "q9-1",
                text: "Researchers want to study risk factors for a rare form of pediatric liver disease. Which study design is most efficient?",
                options: ["Randomized controlled trial", "Case-control study", "Prospective cohort study", "Cross-sectional survey"],
                correctAnswer: 1,
                explanation: "Case-control designs start with people who already have the disease and look backward for exposures, which makes them the efficient choice for RARE conditions. A prospective cohort would require following an enormous population for years to accumulate enough cases. An RCT cannot ethically assign risk factors. A cross-sectional survey measures prevalence at one point and would capture too few cases."
            },
            {
                id: "q9-2",
                text: "A study reports a relative risk of 1.4 with a 95% confidence interval of 0.9 to 2.1. How should this be interpreted?",
                options: ["A statistically significant 40% increase in risk", "Not statistically significant, because the interval crosses 1.0", "A statistically significant decrease in risk", "The result proves causation"],
                correctAnswer: 1,
                explanation: "A 95% confidence interval for a relative risk that includes 1.0 means no effect cannot be excluded, so the result is not statistically significant despite the point estimate of 1.4. Since the interval spans values both below and above 1.0, no direction of effect is established. Causation cannot be claimed from a relative risk in an observational design regardless of significance."
            },
            {
                id: "q9-3",
                text: "A researcher compares mean serum vitamin D across four different supplementation groups. Which statistical test is appropriate?",
                options: ["Independent t-test", "ANOVA", "Chi-square", "Pearson correlation"],
                correctAnswer: 1,
                explanation: "ANOVA compares means across three or more groups. A t-test handles exactly two groups and would require multiple comparisons here, inflating Type I error. Chi-square is for categorical data, not continuous means. Correlation measures the linear relationship between two continuous variables rather than comparing group means."
            }
        ]
    },
    10: {
        id: 10,
        title: "Cycle 1 Review & Assessment",
        theoryTitle: "Exam Strategy, Recall & Full-Length Practice",
        theoryGoal: "Goal: Consolidate Cycle 1, learn the test-taking patterns that decide close questions, and take a timed assessment.",
        practiceTitle: "App -> Mock Exam (145 questions, blueprint weighted)",
        practiceGoal: "Goal: Take a full 145-question timed mock exam, then review every missed item and log the reason for each error.",
        theoryContent: `
            <section>
                <h2>1. How the Exam Is Built</h2>
                <p>The CDR RD exam is computer adaptive. It delivers between 125 and 145 questions in 3 hours, and it stops once it can determine pass or fail with confidence. If fewer than 125 are answered when time runs out, the exam is scored as a fail. A scaled score of <strong>25</strong> is passing on a 1-50 scale.</p>
                <p><strong>Domain weighting:</strong></p>
                <ul>
                    <li>Domain I - Food and Nutrition Sciences: <strong>21%</strong></li>
                    <li>Domain II - Nutrition Care for Individuals and Groups: <strong>45%</strong></li>
                    <li>Domain III - Management of Food and Nutrition Programs: <strong>21%</strong></li>
                    <li>Domain IV - Foodservice Systems: <strong>13%</strong></li>
                </ul>
                <p>Because the exam is adaptive, questions do not get easier when you struggle, and you cannot go back. Answer every question.</p>
            </section>

            <section>
                <h2>2. Test-Taking Patterns That Decide Close Questions</h2>
                <ul>
                    <li><strong>Read the last line first.</strong> The stem often buries the actual question after a long vignette. Know what is being asked before you process the details.</li>
                    <li><strong>Identify the qualifier.</strong> BEST, FIRST, MOST APPROPRIATE, INITIAL. Several options may be defensible; only one is first.</li>
                    <li><strong>Assessment before intervention.</strong> When a question asks what to do first and one option is gathering more information, that is usually correct unless the scenario is an emergency.</li>
                    <li><strong>Stay in scope.</strong> Options where the dietitian prescribes medication or orders tests are usually wrong.</li>
                    <li><strong>Eliminate absolutes.</strong> Always, never, all, only are rarely correct in clinical reasoning.</li>
                    <li><strong>Do not change an answer</strong> without a concrete reason you misread something.</li>
                </ul>
            </section>

            <section>
                <h2>3. Cycle 1 Rapid Recall</h2>
                <h3>Calculations You Must Know Cold</h3>
                <ul>
                    <li>Dextrose = <strong>3.4 kcal/g</strong>; protein and carbohydrate 4; fat 9; alcohol 7</li>
                    <li>20% lipid = 2.0 kcal/mL</li>
                    <li>1 carbohydrate choice = <strong>15 g</strong></li>
                    <li>Nitrogen balance = (protein g / 6.25) - (UUN + 4)</li>
                    <li>FTE = (positions x hours x days) / 40</li>
                    <li>Inventory turnover = food cost / average inventory (target 2-3 per month)</li>
                    <li>Depreciation = (cost - salvage) / useful life. SUBTRACT salvage first.</li>
                </ul>
                <h3>Temperature Set</h3>
                <ul>
                    <li>Danger zone: <strong>41-135 F</strong></li>
                    <li>Cooling: 135 to 70 F in <strong>2 hours</strong>, then 70 to 41 F in <strong>4 more</strong> (6 total)</li>
                    <li>Poultry and all reheating: <strong>165 F</strong>; ground meat 155 F; whole muscle 145 F</li>
                    <li>Hot hold above 135 F; cold hold at or below 41 F</li>
                </ul>
                <h3>Protein Reversals</h3>
                <ul>
                    <li>CKD no dialysis <strong>0.55-0.6</strong> &rarr; hemodialysis <strong>1.0-1.2</strong> &rarr; peritoneal <strong>1.2-1.3</strong></li>
                    <li>Cirrhosis: <strong>1.2-1.5</strong> g/kg. Do NOT restrict protein for encephalopathy.</li>
                </ul>
            </section>

            <section>
                <h2>4. Today's Assessment Protocol</h2>
                <ol>
                    <li>Take the full 145-question mock exam under timed conditions, without notes.</li>
                    <li>Do not review answers until the whole exam is finished.</li>
                    <li>Review every missed item and record WHY you missed it: concept gap, misread the question, confused two options, or guessed.</li>
                    <li>Check the Stats page for your weakest domain and let that drive Cycle 2.</li>
                </ol>
                <p><em>Do not chase a score today.</em> The purpose is a clean diagnostic. Errors you log now become the spaced repetition queue that carries you through the next two cycles.</p>
            </section>
 `,
        questions: [
            {
                id: "q10-1",
                text: "A question stem describes a hospitalized patient and asks what the dietitian should do FIRST. Which option is most likely correct?",
                options: ["Recommend a specific enteral formula and rate", "Complete a nutrition assessment to gather missing information", "Order a serum prealbumin level", "Recommend the physician start an appetite stimulant"],
                correctAnswer: 1,
                explanation: "When a question asks what to do first and no emergency is described, assessment precedes intervention in the Nutrition Care Process. Recommending a specific formula and rate is intervention, which comes after assessment establishes needs. Ordering labs is outside the dietitian's independent scope in most settings. Recommending a medication is a medical decision outside the dietetics scope of practice."
            },
            {
                id: "q10-2",
                text: "On the CDR RD exam, what scaled score is required to pass?",
                options: ["25 on a scale of 1 to 50", "70 out of 100", "145 out of 145", "80 on a scale of 1 to 100"],
                correctAnswer: 0,
                explanation: "The CDR uses a scaled score with 25 as the passing standard on a 1 to 50 scale, which is why raw percentage targets are only an approximation. The exam is adaptive and delivers 125 to 145 questions, so a fixed raw score out of a fixed total does not apply, and no percentage-based cutoff is published as the official standard."
            }
        ]
    },
    11: {
        id: 11,
        title: "GI Disorders",
        theoryTitle: "IBD, Celiac, IBS, Short Bowel & Diverticular Disease",
        theoryGoal: "Goal: Separate the GI conditions that look alike on paper, and match each to its specific nutrition therapy.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on gastrointestinal disease, then review every miss.",
        theoryContent: `
            <section>
                <h2>1. Crohn Disease vs Ulcerative Colitis</h2>
                <p>This distinction drives the nutrition consequences, so learn it structurally.</p>
                <ul>
                    <li><strong>Crohn:</strong> anywhere from mouth to anus, most often the TERMINAL ILEUM. Transmural (full thickness). Skip lesions. Fistulas and strictures common. Because the terminal ileum is involved, expect <strong>B12 and bile salt malabsorption</strong>.</li>
                    <li><strong>Ulcerative colitis:</strong> colon and rectum ONLY, continuous, mucosa and submucosa only. Bloody diarrhea. Expect iron deficiency from blood loss; B12 absorption is intact.</li>
                </ul>
                <h3>Nutrition Therapy</h3>
                <p>Flare: low residue, low fiber, small frequent meals; consider enteral formula. Remission: liberalize and advance fiber as tolerated. Monitor iron, B12, folate, vitamin D, calcium and zinc.</p>
                <p>Corticosteroids add risk of bone loss and hyperglycemia. Sulfasalazine interferes with <strong>folate</strong>.</p>
            </section>

            <section>
                <h2>2. Celiac Disease</h2>
                <p>Autoimmune reaction to gluten in wheat, rye and barley, causing villous atrophy in the small intestine.</p>
                <ul>
                    <li><strong>Diagnosis:</strong> tissue transglutaminase IgA while still EATING gluten, confirmed by biopsy. Testing after starting a gluten-free diet produces false negatives.</li>
                    <li><strong>Safe grains:</strong> rice, corn, quinoa, amaranth, buckwheat, millet, sorghum, teff. Oats are safe only if certified gluten-free.</li>
                    <li><strong>Labeling:</strong> gluten-free requires less than <strong>20 ppm</strong>.</li>
                    <li>Secondary lactose intolerance is common early, and usually resolves as villi heal.</li>
                </ul>
                <p><em>Exam trap:</em> Persistent symptoms and antibodies after a year gluten-free is most often INADVERTENT EXPOSURE from cross-contact or hidden sources, not refractory disease.</p>
            </section>

            <section>
                <h2>3. Irritable Bowel Syndrome</h2>
                <p>Functional disorder with no structural damage. First-line nutrition therapy is the <strong>low FODMAP</strong> approach.</p>
                <p>FODMAPs are fermentable oligosaccharides, disaccharides, monosaccharides and polyols: wheat, onion, garlic, legumes, lactose, excess fructose, and sugar alcohols ending in -ol.</p>
                <p>The protocol is three phases: <strong>elimination</strong> (2-6 weeks), <strong>reintroduction</strong> to identify personal triggers, and <strong>personalization</strong>. It is NOT meant to be permanent, because long-term restriction harms the microbiome and nutrient adequacy.</p>
            </section>

            <section>
                <h2>4. Short Bowel Syndrome</h2>
                <p>Consequences depend on WHAT was resected.</p>
                <ul>
                    <li><strong>Ileum resected:</strong> loses B12 and bile salt reabsorption. Expect B12 deficiency, fat malabsorption, and oxalate kidney stones (unabsorbed fat binds calcium, freeing oxalate for absorption).</li>
                    <li><strong>Ileocecal valve lost:</strong> rapid transit and bacterial overgrowth.</li>
                    <li><strong>Colon intact:</strong> salvages energy via short-chain fatty acids; restrict oxalate.</li>
                </ul>
                <p>Therapy: small frequent meals, separate fluids from solids, oral rehydration solution rather than plain water or hypotonic juice, MCT if colon is present, and parenteral support if remaining bowel is inadequate.</p>
            </section>

            <section>
                <h2>5. GERD and Diverticular Disease</h2>
                <p><strong>GERD:</strong> avoid triggers (chocolate, peppermint, caffeine, alcohol, high fat, citrus, tomato), small meals, stay upright 2-3 hours after eating, weight loss, elevate the head of the bed.</p>
                <p><strong>Diverticulosis:</strong> HIGH fiber (25-35 g/day) to prevent progression.</p>
                <p><strong>Diverticulitis (acute):</strong> clear liquids and low fiber during the flare, then advance back to high fiber after resolution.</p>
                <p><em>Exam trap:</em> Nuts, seeds and popcorn are no longer restricted in diverticular disease. That recommendation was reversed by evidence.</p>
            </section>
 `,
        questions: [
            {
                id: "q11-1",
                text: "A patient with Crohn disease involving the terminal ileum has fatigue and a macrocytic anemia. Which deficiency is most likely?",
                options: ["Iron", "Vitamin B12", "Vitamin C", "Zinc"],
                correctAnswer: 1,
                explanation: "The terminal ileum is the sole absorption site for the vitamin B12-intrinsic factor complex, so ileal Crohn disease characteristically produces B12 deficiency with macrocytic anemia. Iron deficiency causes a MICROcytic anemia and is more typical of ulcerative colitis with chronic blood loss. Vitamin C deficiency causes bleeding gums and poor healing. Zinc deficiency causes taste changes and dermatitis, not macrocytic anemia."
            },
            {
                id: "q11-2",
                text: "A patient has been gluten-free for 12 months but still has symptoms and positive tissue transglutaminase antibodies. What is the most likely explanation?",
                options: ["Refractory celiac disease", "Ongoing inadvertent gluten exposure from cross-contact or hidden sources", "The original diagnosis was wrong", "Concurrent lactose intolerance"],
                correctAnswer: 1,
                explanation: "Continued gluten exposure, often from cross-contact or hidden sources in sauces, medications and supplements, is by far the most common cause and calls for a detailed dietary review. Refractory celiac disease is rare and is a diagnosis of exclusion made only after exposure is ruled out. Reconsidering the diagnosis comes later. Lactose intolerance can cause residual symptoms but does not elevate tissue transglutaminase antibodies."
            },
            {
                id: "q11-3",
                text: "A patient with an ileal resection develops recurrent kidney stones. Which mechanism explains this?",
                options: ["Unabsorbed fat binds calcium, leaving oxalate free to be absorbed and form stones", "Excess calcium absorption from the remaining colon", "Increased uric acid production from bowel resection", "Loss of magnesium causing calcium phosphate precipitation"],
                correctAnswer: 0,
                explanation: "After ileal resection, unabsorbed fatty acids bind calcium in the gut lumen. Calcium would normally bind oxalate and carry it out in stool, so when it is occupied by fat, free oxalate is absorbed and forms calcium oxalate stones. Calcium absorption decreases rather than increases in this setting. Uric acid production is unrelated to the resection, and magnesium loss is not the mechanism behind enteric hyperoxaluria."
            },
            {
                id: "q11-4",
                text: "Which statement about the low FODMAP diet is most accurate?",
                options: ["It should be followed permanently once symptoms improve", "It is a three-phase protocol ending in personalization, not lifelong restriction", "It eliminates all carbohydrate sources", "It is first-line therapy for inflammatory bowel disease"],
                correctAnswer: 1,
                explanation: "The low FODMAP approach runs in three phases: elimination for two to six weeks, systematic reintroduction to identify personal triggers, and personalization to the least restrictive sustainable diet. Permanent restriction harms microbiome diversity and nutrient adequacy. It does not eliminate all carbohydrate, only specific fermentable types. It is first-line for irritable bowel syndrome, a functional disorder, not for inflammatory bowel disease."
            }
        ]
    },
    12: {
        id: 12,
        title: "Liver, Gallbladder & Pancreas",
        theoryTitle: "Cirrhosis, Encephalopathy, Cholestasis & Pancreatic Insufficiency",
        theoryGoal: "Goal: Reverse the outdated protein myth in liver disease and manage pancreatic exocrine insufficiency correctly.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on hepatobiliary and pancreatic disease.",
        theoryContent: `
            <section>
                <h2>1. Cirrhosis: The Protein Reversal</h2>
                <p>Cirrhotic patients are profoundly catabolic and sarcopenic. Their liver cannot store glycogen, so an overnight fast is metabolically equivalent to several days of starvation in a healthy person.</p>
                <ul>
                    <li><strong>Protein: 1.2-1.5 g/kg/day.</strong> Do NOT restrict.</li>
                    <li><strong>Energy: 30-35 kcal/kg/day</strong></li>
                    <li><strong>Late evening snack</strong> with 50 g carbohydrate reduces overnight catabolism. This is one of the highest-yield interventions in cirrhosis.</li>
                    <li>4-6 small meals rather than three large ones</li>
                </ul>
                <p><em>Exam trap:</em> Protein restriction for hepatic encephalopathy is obsolete and harmful. Encephalopathy is treated with <strong>lactulose</strong> (traps ammonia as ammonium for excretion) and <strong>rifaximin</strong> (reduces ammonia-producing gut bacteria), NOT by removing protein. Branched-chain amino acids are reserved for refractory cases.</p>
            </section>

            <section>
                <h2>2. Complications of Cirrhosis</h2>
                <ul>
                    <li><strong>Ascites:</strong> sodium restriction to 2,000 mg/day plus diuretics. Fluid restriction only if serum sodium falls below about 125 mEq/L.</li>
                    <li><strong>Esophageal varices:</strong> from portal hypertension. Avoid rough or sharp-textured foods during active bleeding risk.</li>
                    <li><strong>Steatorrhea and fat malabsorption:</strong> from reduced bile. Supplement fat-soluble vitamins; consider MCT.</li>
                    <li><strong>Sarcopenia:</strong> the strongest nutritional predictor of mortality and transplant outcome.</li>
                </ul>
                <p>Weight is unreliable in ascites and edema. Use mid-arm muscle circumference, handgrip strength and dry weight.</p>
            </section>

            <section>
                <h2>3. Nonalcoholic Fatty Liver Disease</h2>
                <p>Strongly linked to insulin resistance, obesity and metabolic syndrome. Treatment is weight loss.</p>
                <ul>
                    <li><strong>3-5%</strong> weight loss improves steatosis</li>
                    <li><strong>7-10%</strong> weight loss is needed to improve steatohepatitis and fibrosis</li>
                    <li>Reduce added sugar, especially fructose; adopt a Mediterranean pattern; eliminate alcohol</li>
                </ul>
            </section>

            <section>
                <h2>4. Gallbladder Disease</h2>
                <p>Bile emulsifies fat. Cholecystokinin triggers gallbladder contraction in response to dietary fat, which is what produces pain in cholelithiasis.</p>
                <ul>
                    <li><strong>Acute cholecystitis:</strong> low fat diet to minimize gallbladder stimulation</li>
                    <li><strong>Post-cholecystectomy:</strong> bile now drips continuously rather than being released in a bolus. Start low fat and gradually liberalize as tolerated; most patients return to a normal diet.</li>
                    <li><strong>Risk factors:</strong> female, forty, fertile, overweight, and RAPID weight loss. Very low calorie dieting and bariatric surgery both raise gallstone risk.</li>
                </ul>
            </section>

            <section>
                <h2>5. Pancreatic Disease</h2>
                <h3>Acute Pancreatitis</h3>
                <ul>
                    <li><strong>Mild:</strong> begin oral low fat feeding as soon as pain improves and nausea resolves. Do NOT wait for amylase and lipase to normalize.</li>
                    <li><strong>Severe:</strong> EARLY enteral nutrition within 24-48 hours. Enteral beats parenteral for infection, organ failure and mortality. Nasogastric is generally non-inferior to nasojejunal.</li>
                </ul>
                <p><em>Exam trap:</em> Prolonged bowel rest is obsolete. If an option says keep NPO for a week, it is wrong.</p>
                <h3>Chronic Pancreatitis</h3>
                <p>Exocrine insufficiency causes steatorrhea and fat-soluble vitamin deficiency. Cornerstone is <strong>pancreatic enzyme replacement with every fat-containing meal and snack</strong>, dosed by lipase units, plus vitamins A, D, E and K. With adequate enzymes, severe fat restriction is unnecessary and counterproductive.</p>
                <p>Diabetes secondary to chronic pancreatitis (type 3c) destroys both beta AND alpha cells, so glucagon counterregulation is lost and <strong>hypoglycemia risk is high</strong>.</p>
            </section>
 `,
        questions: [
            {
                id: "q12-1",
                text: "A patient with cirrhosis and grade 2 hepatic encephalopathy is admitted. What is the appropriate protein recommendation?",
                options: ["Restrict to 0.5 g/kg until encephalopathy resolves", "Maintain 1.2 to 1.5 g/kg and treat the encephalopathy with lactulose", "Eliminate protein for 48 hours", "Restrict to 0.8 g/kg indefinitely"],
                correctAnswer: 1,
                explanation: "Protein restriction in hepatic encephalopathy is obsolete and worsens the sarcopenia that predicts mortality. Adequate protein at 1.2 to 1.5 g/kg is maintained while the encephalopathy is treated with lactulose and rifaximin. Restricting or eliminating protein accelerates muscle breakdown, which actually releases more ammonia and can worsen the encephalopathy it was meant to treat."
            },
            {
                id: "q12-2",
                text: "Why is a late evening snack recommended in cirrhosis?",
                options: ["It prevents nocturnal hypoglycemia caused by diuretics", "Reduced hepatic glycogen storage makes an overnight fast highly catabolic", "It reduces ammonia production overnight", "It improves absorption of fat-soluble vitamins"],
                correctAnswer: 1,
                explanation: "A cirrhotic liver stores little glycogen, so an overnight fast shifts the body into fat and protein catabolism far faster than in a healthy person. A late evening snack providing about 50 g of carbohydrate blunts that catabolism and helps preserve muscle. Diuretics do not cause nocturnal hypoglycemia. The snack is not primarily an ammonia or absorption intervention."
            },
            {
                id: "q12-3",
                text: "A patient with chronic pancreatitis has steatorrhea despite taking pancreatic enzymes. Which question is most important?",
                options: ["Are you taking the enzymes with every meal and snack that contains fat?", "Are you taking the enzymes on an empty stomach?", "Are you avoiding all dietary fat?", "Are you taking the enzymes only at bedtime?"],
                correctAnswer: 0,
                explanation: "Pancreatic enzymes must be taken with every fat-containing meal and snack, and dosed adequately by lipase units, because they work only when mixed with food in the gut. Taking them on an empty stomach or at bedtime means no substrate is present. Avoiding all dietary fat is not the goal and would worsen energy deficit and fat-soluble vitamin status; proper enzyme dosing is what allows fat to be tolerated."
            }
        ]
    },
    13: {
        id: 13,
        title: "Renal Deep Dive",
        theoryTitle: "Dialysis, Electrolytes, Transplant & Nephrolithiasis",
        theoryGoal: "Goal: Move beyond CKD staging into dialysis-specific management, electrolyte emergencies and stone prevention.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on renal disease, prioritizing electrolyte and protein calculations.",
        theoryContent: `
            <section>
                <h2>1. Protein Across the Renal Continuum</h2>
                <ul>
                    <li><strong>CKD stages 3-5, no dialysis:</strong> 0.55-0.60 g/kg</li>
                    <li><strong>Hemodialysis:</strong> 1.0-1.2 g/kg (amino acids lost to dialysate)</li>
                    <li><strong>Peritoneal dialysis:</strong> 1.2-1.3 g/kg (higher peritoneal losses)</li>
                    <li><strong>AKI on CRRT:</strong> up to 1.5-2.0 g/kg</li>
                    <li><strong>Post-transplant, acute:</strong> 1.3-1.5 g/kg for surgical healing and steroid catabolism</li>
                    <li><strong>Post-transplant, stable:</strong> 0.8-1.0 g/kg</li>
                </ul>
                <p>At least 50% should be high biological value protein.</p>
            </section>

            <section>
                <h2>2. Peritoneal Dialysis Specifics</h2>
                <p>The dialysate contains dextrose, which is ABSORBED. This supplies unintended calories, frequently causing weight gain and hypertriglyceridemia, and it must be counted in the energy prescription.</p>
                <p>Because PD runs continuously, potassium is cleared more steadily, so potassium restriction is often LESS strict than in hemodialysis and hypokalemia can even occur.</p>
            </section>

            <section>
                <h2>3. Electrolyte Emergencies</h2>
                <h3>Hyperkalemia</h3>
                <p>Above 5.5 mEq/L is concerning; above 6.5 is a cardiac emergency with peaked T waves and arrhythmia risk. Restrict to 2,000-3,000 mg/day.</p>
                <p>High-potassium foods: potatoes, tomatoes, oranges, bananas, melons, avocado, dried fruit, beans, milk, bran, and <strong>salt substitutes</strong> (potassium chloride, a frequently missed source).</p>
                <p>Leaching: peel, slice thin, soak in large volumes of warm water, then boil in fresh water. Reduces potassium meaningfully but not completely.</p>
                <h3>Phosphorus</h3>
                <p>Target 800-1,000 mg/day. The key concept is <strong>bioavailability</strong>: inorganic phosphate ADDITIVES are 90-100% absorbed, organic plant phosphorus only 20-50% because of phytate. Teach label reading for PHOS ingredients.</p>
                <p>Binders must be taken <strong>WITH meals</strong>. Calcium acetate and sevelamer are common; sevelamer avoids adding a calcium load.</p>
            </section>

            <section>
                <h2>4. Renal Anemia and Bone Disease</h2>
                <p>Failing kidneys stop producing <strong>erythropoietin</strong>, causing normocytic normochromic anemia. Treated with erythropoiesis-stimulating agents plus IV iron; ensure adequate iron stores first, since ESAs need substrate.</p>
                <p>Kidneys also fail to activate vitamin D (1-alpha hydroxylation), lowering calcium absorption. Combined with phosphorus retention, this drives <strong>secondary hyperparathyroidism</strong> and renal osteodystrophy. Managed with active vitamin D analogs, binders and calcimimetics.</p>
            </section>

            <section>
                <h2>5. Kidney Stones</h2>
                <ul>
                    <li><strong>Calcium oxalate (most common):</strong> fluid 2.5-3 L/day, NORMAL dietary calcium (restricting calcium increases oxalate absorption and makes stones worse), limit oxalate (spinach, rhubarb, nuts, beets, tea, chocolate), limit sodium and animal protein</li>
                    <li><strong>Uric acid:</strong> alkalinize urine, limit purines, generous fluid</li>
                    <li><strong>Struvite:</strong> associated with urea-splitting infection; treat the infection</li>
                    <li><strong>Cystine:</strong> genetic; very high fluid intake and urine alkalinization</li>
                </ul>
                <p><em>Exam trap:</em> Low calcium diets INCREASE calcium oxalate stone risk. Adequate dietary calcium binds oxalate in the gut so it leaves in the stool.</p>
            </section>
 `,
        questions: [
            {
                id: "q13-1",
                text: "A patient on peritoneal dialysis has gained 6 kg over 3 months with rising triglycerides. What is the most likely nutrition-related contributor?",
                options: ["Excess dietary protein", "Dextrose absorbed from the peritoneal dialysate", "Inadequate potassium restriction", "Phosphate binder side effects"],
                correctAnswer: 1,
                explanation: "Peritoneal dialysate contains dextrose that is absorbed across the peritoneum, supplying calories that are easy to overlook and commonly producing weight gain and hypertriglyceridemia. These calories must be counted in the energy prescription. Protein intake at recommended levels does not explain this pattern, potassium does not drive weight gain, and phosphate binders do not add meaningful calories."
            },
            {
                id: "q13-2",
                text: "A patient with recurrent calcium oxalate kidney stones asks whether to avoid dairy. What is the most appropriate advice?",
                options: ["Eliminate all dairy to reduce calcium intake", "Maintain normal dietary calcium, since restricting it increases oxalate absorption", "Take high-dose calcium supplements between meals", "Replace dairy with spinach and almond products"],
                correctAnswer: 1,
                explanation: "Dietary calcium binds oxalate in the gut so it is excreted in stool rather than absorbed. Restricting calcium therefore raises urinary oxalate and increases stone formation. Calcium is best obtained from food consumed WITH meals; supplements taken between meals do not bind dietary oxalate as effectively. Spinach and almonds are high-oxalate foods and would worsen the problem."
            },
            {
                id: "q13-3",
                text: "Which potassium source is most frequently overlooked when counseling a hyperkalemic dialysis patient?",
                options: ["Salt substitutes containing potassium chloride", "White rice", "Egg whites", "Refined white bread"],
                correctAnswer: 0,
                explanation: "Salt substitutes are typically potassium chloride and can deliver a very large potassium load, yet patients often consider them a healthy choice because they are reducing sodium. White rice, egg whites and refined white bread are all low in potassium and are commonly recommended within a renal diet."
            }
        ]
    },
    14: {
        id: 14,
        title: "Endocrine & Metabolic",
        theoryTitle: "Thyroid, Adrenal, PCOS, Metabolic Syndrome & Gout",
        theoryGoal: "Goal: Cover the endocrine conditions beyond diabetes that appear reliably on the exam.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on endocrine and metabolic disorders.",
        theoryContent: `
            <section>
                <h2>1. Thyroid Disorders</h2>
                <ul>
                    <li><strong>Hypothyroidism:</strong> high TSH, low T4. Weight gain, cold intolerance, fatigue, constipation. Lower metabolic rate.</li>
                    <li><strong>Hyperthyroidism:</strong> low TSH, high T4. Weight loss despite good intake, heat intolerance, tachycardia. INCREASED energy and protein needs.</li>
                </ul>
                <p><strong>Levothyroxine counseling:</strong> take on an empty stomach, 30-60 minutes before breakfast, and separate by at least 4 hours from calcium, iron, soy and high-fiber foods, all of which impair absorption. This is a very common exam item.</p>
                <p><strong>Goitrogens</strong> (cruciferous vegetables, soy, cassava) interfere with iodine uptake, but only matter in the setting of iodine deficiency and are largely inactivated by cooking.</p>
            </section>

            <section>
                <h2>2. Adrenal Disorders</h2>
                <ul>
                    <li><strong>Cushing syndrome (cortisol excess):</strong> central obesity, moon face, buffalo hump, muscle wasting, hyperglycemia, hypertension, bone loss. Nutrition: adequate protein, control sodium and simple carbohydrate, calcium and vitamin D.</li>
                    <li><strong>Addison disease (adrenal insufficiency):</strong> weight loss, fatigue, generalized hyperpigmentation, HYPOtension, HYPOnatremia, HYPERkalemia. Nutrition: liberal sodium, adequate fluid.</li>
                </ul>
                <p><em>Exam trap:</em> Addison and Cushing move sodium and potassium in OPPOSITE directions. Addison loses sodium and retains potassium.</p>
            </section>

            <section>
                <h2>3. Metabolic Syndrome</h2>
                <p>Diagnosed with any <strong>THREE of five</strong>:</p>
                <ul>
                    <li>Waist circumference above 102 cm in men, 88 cm in women</li>
                    <li>Triglycerides 150 mg/dL or higher</li>
                    <li>HDL below 40 mg/dL in men, below 50 mg/dL in women</li>
                    <li>Blood pressure 130/85 mm Hg or higher</li>
                    <li>Fasting glucose 100 mg/dL or higher</li>
                </ul>
                <p>Treatment: 5-10% weight loss, 150 minutes weekly of moderate activity plus resistance training, Mediterranean pattern, and reduced added sugar and alcohol for triglycerides specifically.</p>
            </section>

            <section>
                <h2>4. PCOS</h2>
                <p><strong>Rotterdam criteria:</strong> two of three - oligo/anovulation, clinical or biochemical hyperandrogenism, polycystic ovarian morphology - after excluding other causes.</p>
                <p>Insulin resistance is central: hyperinsulinemia drives ovarian androgen production and suppresses sex hormone binding globulin, raising free testosterone.</p>
                <p>Therapy: 5-10% weight loss can restore ovulation; low glycemic index pattern; regular activity improves insulin sensitivity even without weight loss; metformin (monitor <strong>vitamin B12</strong> long term).</p>
                <p><strong>Acanthosis nigricans</strong> on the posterior neck is a physical marker of significant insulin resistance.</p>
            </section>

            <section>
                <h2>5. Gout</h2>
                <ul>
                    <li><strong>Limit:</strong> organ meats, red meat, and seafood such as anchovies, sardines, mussels and scallops</li>
                    <li><strong>Limit:</strong> beer and spirits; fructose and high-fructose corn syrup (fructose metabolism depletes ATP and generates uric acid)</li>
                    <li><strong>Encourage:</strong> low-fat dairy (uricosuric), coffee, cherries, generous fluid</li>
                    <li><strong>Target:</strong> serum urate below 6 mg/dL</li>
                </ul>
                <p><em>Exam trap:</em> Purine-rich VEGETABLES (spinach, asparagus, mushrooms, cauliflower) are NOT associated with gout risk and need not be restricted, despite appearing on outdated food lists.</p>
                <p>Thiazide and loop diuretics raise serum urate; losartan is mildly uricosuric and is often preferred when hypertension and gout coexist.</p>
            </section>
 `,
        questions: [
            {
                id: "q14-1",
                text: "A patient starting levothyroxine asks how to take it. What is the most appropriate counseling?",
                options: ["Take it with breakfast and a calcium supplement for better tolerance", "Take it on an empty stomach 30 to 60 minutes before breakfast, separated from calcium and iron by at least 4 hours", "Take it at bedtime with a high-fiber snack", "Take it with orange juice to improve absorption"],
                correctAnswer: 1,
                explanation: "Levothyroxine absorption is impaired by food generally and by calcium, iron, soy and fiber specifically, so it is taken on an empty stomach 30 to 60 minutes before breakfast with those products separated by at least four hours. Taking it alongside calcium, with a high-fiber snack, or with juice all reduce absorption and can leave the patient undertreated despite an adequate prescribed dose."
            },
            {
                id: "q14-2",
                text: "A patient presents with hypotension, hyperpigmentation, hyponatremia and hyperkalemia. Which condition does this suggest, and what is the nutrition implication?",
                options: ["Cushing syndrome; restrict sodium", "Addison disease; liberalize sodium and ensure adequate fluid", "Hyperthyroidism; increase iodine", "Metabolic syndrome; restrict carbohydrate"],
                correctAnswer: 1,
                explanation: "Low sodium with high potassium, hypotension and generalized hyperpigmentation is the classic picture of Addison disease, where aldosterone deficiency causes sodium wasting and potassium retention. Liberal sodium and adequate fluid are indicated. Cushing syndrome moves these values in the opposite direction, with sodium retention and potassium loss. Hyperthyroidism and metabolic syndrome do not produce this electrolyte pattern."
            },
            {
                id: "q14-3",
                text: "A patient with gout asks whether he should stop eating spinach and asparagus. What is the most accurate response?",
                options: ["Yes, all purine-rich foods must be restricted equally", "No, purine-rich vegetables are not associated with gout risk; focus on organ meats, certain seafood, alcohol and fructose", "Yes, but only during acute flares", "No, but he should eliminate all dairy instead"],
                correctAnswer: 1,
                explanation: "Prospective studies show purine-rich vegetables do not raise gout risk, so restricting them removes nutritious foods for no benefit. The dietary targets that do matter are organ meats, certain seafood, beer and spirits, and fructose. Low-fat dairy is protective through a uricosuric effect, so eliminating it would be counterproductive."
            }
        ]
    },
    15: {
        id: 15,
        title: "Oncology, HIV & Immune",
        theoryTitle: "Cachexia, Nutrition Impact Symptoms & Immunocompromised Care",
        theoryGoal: "Goal: Manage treatment-related symptoms, distinguish cachexia from starvation, and apply food safety for the immunocompromised.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on oncology, HIV and immune-related nutrition.",
        theoryContent: `
            <section>
                <h2>1. Cancer Cachexia vs Simple Starvation</h2>
                <ul>
                    <li><strong>Starvation:</strong> preserved lean mass early, fat used first, metabolic rate DROPS, fully reversible with feeding.</li>
                    <li><strong>Cachexia:</strong> driven by tumor-derived inflammatory cytokines. Loss of muscle regardless of intake, metabolic rate often ELEVATED, insulin resistance, and NOT fully reversible by nutrition alone.</li>
                </ul>
                <p>Cachexia care combines nutrition, symptom control, physical activity and treatment of the underlying disease, with realistic goal setting. Promising more than nutrition can deliver damages trust.</p>
                <h3>Needs</h3>
                <p>Energy 25-35 kcal/kg. Protein at least 1.0 g/kg, moving toward <strong>1.5 g/kg</strong> with muscle loss or inflammation.</p>
            </section>

            <section>
                <h2>2. Nutrition Impact Symptoms</h2>
                <ul>
                    <li><strong>Mucositis:</strong> soft, moist, bland foods at room or cool temperature. Avoid acidic, spicy, rough textures and alcohol-based rinses. Use salt and baking soda rinses.</li>
                    <li><strong>Xerostomia:</strong> sauces, gravies, broths; sip fluids with meals; sugar-free gum; saliva substitutes.</li>
                    <li><strong>Dysgeusia (metallic taste):</strong> plastic utensils, marinades, cold or room-temperature foods, alternative protein sources.</li>
                    <li><strong>Nausea:</strong> cool bland foods (less aroma), eat slowly, avoid cooking odors, time meals away from treatment, proactive antiemetics.</li>
                    <li><strong>Early satiety and anorexia:</strong> small frequent nutrient-dense meals eaten BY THE CLOCK, not by appetite; fortify foods.</li>
                    <li><strong>Radiation enteritis:</strong> low fat, low insoluble fiber, assess lactose tolerance, aggressive fluid and electrolyte replacement.</li>
                </ul>
            </section>

            <section>
                <h2>3. The Neutropenic Diet Question</h2>
                <p>Restrictive neutropenic diets have <strong>not</strong> been shown to reduce infection compared with standard safe food handling, and they worsen intake and quality of life in patients already struggling to eat.</p>
                <p>Current guidance emphasizes food safety: thorough washing, safe cooking temperatures, avoiding unpasteurized products, raw or undercooked animal foods, and raw sprouts.</p>
                <p><em>Exam trap:</em> If an option requires permanently avoiding all fresh fruits and vegetables, it is wrong.</p>
            </section>

            <section>
                <h2>4. Assessment Tool</h2>
                <p>The <strong>Patient-Generated Subjective Global Assessment (PG-SGA)</strong> was built for oncology. It captures weight history, intake, nutrition impact symptoms, functional status and physical exam, and produces both a category and a numeric score that triages intervention.</p>
            </section>

            <section>
                <h2>5. HIV Nutrition</h2>
                <ul>
                    <li><strong>Energy (WHO):</strong> about +10% in asymptomatic infection, +20-30% when symptomatic</li>
                    <li><strong>Protein:</strong> roughly 1.0-1.4 g/kg to preserve lean mass</li>
                    <li><strong>Wasting syndrome:</strong> involuntary loss over 10% of body weight with chronic diarrhea or fever - an AIDS-defining condition</li>
                    <li><strong>Lipodystrophy:</strong> central and visceral fat accumulation with peripheral loss, plus dyslipidemia and insulin resistance, linked to certain antiretrovirals. Manage cardiovascular risk.</li>
                </ul>
                <p><strong>Food safety</strong> is critical when CD4 falls below 200 cells/mm3.</p>
                <p><em>Exam trap:</em> <strong>St. John's wort</strong> induces cytochrome P450 3A4 and markedly lowers antiretroviral levels, risking virologic failure and resistance. It is contraindicated.</p>
            </section>
 `,
        questions: [
            {
                id: "q15-1",
                text: "A patient with advanced lung cancer has lost 14% of body weight over 3 months despite consuming adequate calories, with muscle wasting and elevated C-reactive protein. What does this represent?",
                options: ["Simple starvation that will reverse with increased intake", "Cancer cachexia, which nutrition support alone cannot fully reverse", "Refeeding syndrome", "Dehydration from treatment"],
                correctAnswer: 1,
                explanation: "Ongoing muscle loss despite adequate intake, together with elevated inflammatory markers, defines cancer cachexia, a cytokine-driven syndrome that nutrition support alone cannot fully reverse. Simple starvation responds predictably to added calories, which is exactly what is not happening. Refeeding syndrome is an acute electrolyte complication of reintroducing nutrition. Dehydration causes acute weight change without this muscle wasting and inflammatory profile."
            },
            {
                id: "q15-2",
                text: "A neutropenic patient asks whether she must avoid all fresh fruits and vegetables. What is the evidence-based response?",
                options: ["Yes, all fresh produce must be avoided until counts recover", "No; thorough washing and standard food safety practices are recommended instead of restrictive neutropenic diets", "Yes, but canned fruit in syrup is acceptable", "No, but all produce must be peeled and cooked"],
                correctAnswer: 1,
                explanation: "Trials and systematic reviews have not shown that restrictive neutropenic diets reduce infection compared with standard safe food handling, while the restrictions themselves reduce intake and quality of life. Guidance emphasizes thorough washing, safe temperatures and avoiding unpasteurized or undercooked animal foods rather than eliminating fresh produce."
            },
            {
                id: "q15-3",
                text: "A patient on antiretroviral therapy reports taking St. John's wort. What is the appropriate response?",
                options: ["It is safe and may help with treatment-related mood changes", "It induces cytochrome P450 enzymes and can cause antiretroviral failure; it is contraindicated", "It should be taken with food to reduce nausea", "It enhances antiretroviral absorption"],
                correctAnswer: 1,
                explanation: "St. John's wort is a potent inducer of cytochrome P450 3A4 and P-glycoprotein, markedly lowering plasma levels of protease inhibitors and non-nucleoside reverse transcriptase inhibitors. The consequences are virologic failure and emergent resistance, so it is contraindicated and requires prompt counseling rather than advice about timing or food."
            }
        ]
    },
    16: {
        id: 16,
        title: "Pulmonary & Critical Care",
        theoryTitle: "COPD, Cystic Fibrosis, ARDS & Ventilator Management",
        theoryGoal: "Goal: Apply the overfeeding principle in respiratory disease and manage cystic fibrosis nutrition correctly.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on pulmonary disease and critical care nutrition.",
        theoryContent: `
            <section>
                <h2>1. COPD</h2>
                <p>Two opposite phenotypes appear on the exam. Underweight patients have increased work of breathing and early satiety from diaphragmatic flattening; overweight patients have added mechanical load.</p>
                <h3>For the Underweight COPD Patient</h3>
                <ul>
                    <li>Small, frequent, calorie- and protein-dense meals</li>
                    <li>Rest before eating; eating itself raises oxygen demand</li>
                    <li>Limit fluids at meals to reduce gastric fullness</li>
                    <li>Energy 25-30 kcal/kg; protein 1.2-1.7 g/kg to preserve respiratory muscle</li>
                </ul>
                <h3>The Respiratory Quotient Question</h3>
                <p>RQ = CO2 produced / O2 consumed. Carbohydrate 1.0, protein 0.8, fat 0.7, mixed substrate about 0.85. An RQ above 1.0 indicates net <strong>lipogenesis from overfeeding</strong>.</p>
                <p><em>Exam trap:</em> Specialty high-fat, low-carbohydrate pulmonary formulas are largely obsolete. <strong>Avoiding overfeeding of total calories matters far more than the fat-to-carbohydrate ratio.</strong></p>
            </section>

            <section>
                <h2>2. Cystic Fibrosis</h2>
                <p>Thick secretions obstruct pancreatic ducts, causing exocrine insufficiency, so fat and fat-soluble vitamins are malabsorbed regardless of intake.</p>
                <ul>
                    <li><strong>Energy:</strong> 110-200% of the estimate for age and sex</li>
                    <li><strong>Fat:</strong> HIGH, roughly 35-40% of calories</li>
                    <li><strong>Pancreatic enzymes</strong> with every fat-containing meal and snack, dosed by lipase units</li>
                    <li><strong>Fat-soluble vitamins A, D, E and K</strong> in water-miscible forms, with level monitoring</li>
                    <li><strong>Generous salt</strong>, because sweat sodium losses are high</li>
                </ul>
                <p><strong>CF-related diabetes:</strong> maintain the high-calorie, high-fat diet and control glucose with INSULIN. Do not restrict intake, because nutritional status predicts lung function and survival.</p>
            </section>

            <section>
                <h2>3. Critical Care Feeding</h2>
                <ul>
                    <li><strong>Timing:</strong> enteral within 24-48 hours if hemodynamically stable</li>
                    <li><strong>Energy:</strong> 25-30 kcal/kg, ideally measured by indirect calorimetry</li>
                    <li><strong>Protein:</strong> 1.2-2.0 g/kg, higher in burns, trauma and CRRT</li>
                    <li><strong>Head of bed 30-45 degrees</strong> is the best-supported aspiration prevention measure</li>
                    <li>Routine gastric residual volume monitoring has fallen out of favor; it does not reduce aspiration and causes unnecessary feeding interruptions</li>
                </ul>
                <p><strong>Vasopressors:</strong> feeding during escalating vasopressor doses raises the risk of non-occlusive mesenteric ischemia. New distension with absent bowel sounds and worsening acidosis means HOLD feeding and escalate.</p>
            </section>

            <section>
                <h2>4. Respiratory Muscle and Weaning</h2>
                <p>The diaphragm is skeletal muscle. Protein-energy malnutrition catabolizes it, reducing inspiratory force and vital capacity and prolonging ventilator dependence. Nutritional repletion is part of weaning strategy.</p>
                <p>Overfeeding works against weaning by raising CO2 production. Both underfeeding and overfeeding delay extubation, which is why measured rather than assumed needs matter here.</p>
            </section>

            <section>
                <h2>5. Fever and Hypermetabolism</h2>
                <p>Basal metabolic rate rises roughly <strong>7-13% per degree Celsius</strong> above normal body temperature. Recognizing this prevents systematic underfeeding of febrile patients, since reduced activity from bed rest does not offset the hypermetabolic response in acute infection.</p>
            </section>
 `,
        questions: [
            {
                id: "q16-1",
                text: "A ventilated COPD patient receiving 35 kcal/kg has a measured respiratory quotient of 1.05 and is difficult to wean. What does this indicate?",
                options: ["Predominant fat oxidation", "Overfeeding with net lipogenesis, raising carbon dioxide production", "Underfeeding with protein catabolism", "A need for a high-fat pulmonary formula"],
                correctAnswer: 1,
                explanation: "An RQ above 1.0 signals net lipogenesis, meaning excess carbohydrate is being converted to fat and generating carbon dioxide, which increases ventilatory demand. Combined with 35 kcal/kg, this indicates overfeeding, and the correct response is to reduce total energy. Pure fat oxidation gives an RQ near 0.7, and underfeeding produces a low RQ. Switching formulas addresses substrate ratio rather than the total calorie excess that is the actual problem."
            },
            {
                id: "q16-2",
                text: "An adult with cystic fibrosis is newly diagnosed with CF-related diabetes. What is the appropriate nutrition approach?",
                options: ["Restrict calories and fat to improve glycemic control", "Maintain the high-calorie, high-fat diet and manage glucose with insulin", "Begin a ketogenic diet", "Restrict protein to protect the kidneys"],
                correctAnswer: 1,
                explanation: "In CF-related diabetes, nutritional status remains the strongest predictor of lung function and survival, so the high-calorie, high-fat, high-salt diet is maintained and glucose is controlled with insulin rather than by restricting intake. Restricting calories and fat would worsen the malnutrition that drives lung decline. A ketogenic diet conflicts with the energy density these patients require, and protein restriction has no indication here."
            },
            {
                id: "q16-3",
                text: "A critically ill patient on escalating vasopressors develops new abdominal distension, absent bowel sounds and worsening metabolic acidosis while receiving trophic enteral feeding. What is the appropriate action?",
                options: ["Increase the rate to meet full caloric needs", "Hold enteral feeding and notify the team to evaluate for bowel ischemia", "Add a promotility agent and continue", "Change to a fiber-containing formula"],
                correctAnswer: 1,
                explanation: "This combination in a patient on escalating vasopressors raises concern for non-occlusive mesenteric ischemia, a rare but catastrophic complication of feeding a hypoperfused gut. Feeding should be held and the team notified urgently. Increasing the rate adds substrate demand to potentially ischemic bowel, a promotility agent does not address perfusion, and fiber increases luminal bulk and fermentation in a compromised bowel."
            }
        ]
    },
    17: {
        id: 17,
        title: "Pediatric Nutrition & Growth",
        theoryTitle: "Infant Feeding, Growth Charts, Failure to Thrive & Inborn Errors",
        theoryGoal: "Goal: Read growth charts correctly, sequence infant feeding milestones, and recognize the inborn errors that appear on the exam.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on pediatric nutrition and growth assessment.",
        theoryContent: `
            <section>
                <h2>1. Growth Assessment</h2>
                <ul>
                    <li><strong>Birth to 24 months:</strong> use <strong>WHO</strong> growth standards (based on breastfed infants, describes how children SHOULD grow)</li>
                    <li><strong>2 to 20 years:</strong> use <strong>CDC</strong> growth charts</li>
                    <li>Weight-for-length is used under 2 years; BMI-for-age from 2 years</li>
                </ul>
                <h3>BMI-for-Age Cutoffs (2-20 years)</h3>
                <ul>
                    <li>Underweight: below 5th percentile</li>
                    <li>Healthy weight: 5th to 84th</li>
                    <li>Overweight: 85th to 94th</li>
                    <li>Obesity: 95th percentile or above</li>
                </ul>
                <p><em>Key principle:</em> A single point on a growth chart means little. <strong>Crossing two or more major percentile lines</strong> is the red flag.</p>
                <h3>Growth Milestones</h3>
                <p>Birth weight DOUBLES by about 4-6 months and TRIPLES by 12 months. Length increases about 50% in the first year.</p>
            </section>

            <section>
                <h2>2. Infant Feeding</h2>
                <ul>
                    <li>Exclusive breastfeeding for about <strong>6 months</strong>; continue with complementary foods to 12 months and beyond</li>
                    <li><strong>Vitamin D 400 IU/day</strong> for all breastfed infants starting shortly after birth</li>
                    <li><strong>Iron:</strong> stores deplete around 4-6 months; iron-rich complementary foods or supplementation</li>
                    <li><strong>No honey before 12 months</strong> - infant botulism risk from C. botulinum spores</li>
                    <li><strong>No cow milk before 12 months</strong> - GI blood loss, renal solute load, poor iron</li>
                    <li>Whole milk from 12-24 months, then low-fat after 2 years</li>
                    <li><strong>Early allergen introduction</strong> around 4-6 months REDUCES allergy risk (LEAP trial)</li>
                </ul>
                <p>Readiness for solids: good head control, sits with support, loss of extrusion reflex, interest in food - around 6 months.</p>
            </section>

            <section>
                <h2>3. Failure to Thrive / Faltering Growth</h2>
                <p>Weight crossing two major percentile lines downward, or weight-for-length below the 5th percentile.</p>
                <p><strong>Catch-up growth</strong> requires energy and protein ABOVE normal for age. Calculate using ideal weight for current length rather than actual weight, so that the prescription targets where the child should be.</p>
                <p>Always evaluate for organic causes (malabsorption, cardiac, renal, endocrine) alongside psychosocial and feeding-practice causes.</p>
            </section>

            <section>
                <h2>4. Inborn Errors of Metabolism</h2>
                <ul>
                    <li><strong>PKU:</strong> cannot convert phenylalanine to tyrosine. Restrict phenylalanine; TYROSINE becomes conditionally essential. Avoid <strong>aspartame</strong> (a phenylalanine source). Lifelong therapy; strict control especially critical in pregnancy (maternal PKU syndrome).</li>
                    <li><strong>Galactosemia:</strong> cannot metabolize galactose. Eliminate ALL lactose and galactose, including breast milk. Use soy formula.</li>
                    <li><strong>Maple syrup urine disease:</strong> cannot metabolize branched-chain amino acids (leucine, isoleucine, valine). Urine smells of maple syrup.</li>
                </ul>
                <p><em>Exam trap:</em> In galactosemia, breastfeeding is CONTRAINDICATED because human milk contains lactose. In PKU, limited breastfeeding can continue alongside phenylalanine-free formula with careful monitoring.</p>
            </section>

            <section>
                <h2>5. Common Pediatric Issues</h2>
                <ul>
                    <li><strong>Iron deficiency anemia:</strong> most common nutrient deficiency in children. Excess cow milk intake is a classic cause. Pair iron with vitamin C; separate from dairy and tea.</li>
                    <li><strong>Constipation:</strong> fiber in grams = age in years + 5</li>
                    <li><strong>Dental caries:</strong> avoid the bottle in bed and prolonged juice sipping</li>
                    <li><strong>Choking hazards under 4:</strong> whole grapes, hot dog rounds, nuts, popcorn, hard candy, raw carrot</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q17-1",
                text: "A 9-month-old has dropped from the 50th to the 10th percentile for weight over 4 months. Which statement is most accurate?",
                options: ["This is normal variation and requires no action", "Crossing two or more major percentile lines warrants evaluation for faltering growth", "Only weight below the 3rd percentile is concerning", "Growth charts are unreliable under 12 months"],
                correctAnswer: 1,
                explanation: "Growth trajectory matters more than any single point, and crossing two or more major percentile lines downward is the recognized red flag prompting evaluation for both organic and psychosocial causes. Waiting until weight falls below the 3rd percentile delays intervention. Growth charts are the standard assessment tool in infancy, with WHO standards used from birth to 24 months."
            },
            {
                id: "q17-2",
                text: "Which food is contraindicated before 12 months of age due to infection risk?",
                options: ["Honey", "Pureed sweet potato", "Iron-fortified infant cereal", "Mashed avocado"],
                correctAnswer: 0,
                explanation: "Honey can contain Clostridium botulinum spores, which germinate in the immature infant gut and cause infant botulism, so it is contraindicated before 12 months. Pureed vegetables, iron-fortified cereal and avocado are all appropriate complementary foods once the infant shows developmental readiness around six months."
            },
            {
                id: "q17-3",
                text: "An infant is diagnosed with classic galactosemia. What is the appropriate feeding recommendation?",
                options: ["Continue breastfeeding with close monitoring", "Discontinue breast milk and all lactose sources; use a soy-based formula", "Use a phenylalanine-free formula", "Restrict branched-chain amino acids"],
                correctAnswer: 1,
                explanation: "Human milk contains lactose, which is hydrolyzed to glucose and galactose, so breastfeeding is contraindicated in classic galactosemia and a soy-based formula is used. Phenylalanine-free formula treats PKU, a different disorder. Restricting branched-chain amino acids treats maple syrup urine disease. Confusing these three inborn errors is a common exam trap."
            }
        ]
    },
    18: {
        id: 18,
        title: "Pregnancy & Lactation",
        theoryTitle: "Weight Gain, Nutrient Needs, GDM & Maternal Conditions",
        theoryGoal: "Goal: Command the IOM weight gain ranges, trimester energy increments and the nutrients that carry the strongest evidence.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on maternal nutrition, gestational diabetes and lactation.",
        theoryContent: `
            <section>
                <h2>1. Gestational Weight Gain (IOM/NAM)</h2>
                <p>Based on PREPREGNANCY BMI. This table is tested almost every form.</p>
                <ul>
                    <li><strong>Underweight (BMI under 18.5):</strong> 28-40 lb</li>
                    <li><strong>Normal (18.5-24.9):</strong> 25-35 lb</li>
                    <li><strong>Overweight (25-29.9):</strong> 15-25 lb</li>
                    <li><strong>Obese (30 or above):</strong> 11-20 lb</li>
                    <li><strong>Twins, normal BMI:</strong> 37-54 lb</li>
                </ul>
                <p>Typical pattern: 1-4 lb total in the first trimester, then about 1 lb per week in the second and third for normal-weight women.</p>
            </section>

            <section>
                <h2>2. Energy and Protein</h2>
                <ul>
                    <li><strong>First trimester:</strong> no increase</li>
                    <li><strong>Second trimester:</strong> +340 kcal/day</li>
                    <li><strong>Third trimester:</strong> +452 kcal/day</li>
                    <li><strong>Lactation:</strong> +330 kcal/day in the first 6 months, +400 thereafter</li>
                    <li><strong>Protein:</strong> 1.1 g/kg/day in pregnancy and lactation</li>
                </ul>
            </section>

            <section>
                <h2>3. Critical Nutrients</h2>
                <ul>
                    <li><strong>Folate/folic acid:</strong> 600 mcg DFE in pregnancy; 400 mcg supplemental preconception to prevent neural tube defects, which close by day 28 - BEFORE most women know they are pregnant. Women with a prior affected pregnancy need 4,000 mcg.</li>
                    <li><strong>Iron:</strong> 27 mg/day. Plasma volume expands more than red cell mass, so a physiologic dilutional drop in hemoglobin is expected.</li>
                    <li><strong>Calcium:</strong> 1,000 mg (1,300 if under 19). Absorption efficiency increases; the DRI does not.</li>
                    <li><strong>Iodine:</strong> 220 mcg pregnancy, 290 lactation - essential for fetal neurodevelopment.</li>
                    <li><strong>Choline:</strong> 450 mg pregnancy, 550 lactation - brain development.</li>
                    <li><strong>DHA:</strong> 200-300 mg/day for fetal brain and retina.</li>
                    <li><strong>Vitamin A:</strong> avoid high-dose supplements and retinoids - TERATOGENIC.</li>
                </ul>
                <h3>Food Safety in Pregnancy</h3>
                <p>Avoid unpasteurized dairy and juice, deli meats unless heated to steaming, raw or undercooked meat, eggs and seafood, and high-mercury fish (shark, swordfish, king mackerel, tilefish). Target 8-12 oz weekly of low-mercury fish.</p>
                <p><strong>Listeria</strong> is the pathogen of greatest concern; it grows at refrigerator temperatures and crosses the placenta.</p>
            </section>

            <section>
                <h2>4. Gestational Diabetes</h2>
                <ul>
                    <li>Screen at <strong>24-28 weeks</strong>, earlier if high risk</li>
                    <li>Carbohydrate distributed across 3 meals and 2-3 snacks; smaller breakfast because morning insulin resistance peaks</li>
                    <li>Minimum <strong>175 g carbohydrate</strong> daily to prevent ketosis</li>
                    <li>Insulin is first-line pharmacotherapy if diet fails</li>
                    <li>Postpartum: retest at 4-12 weeks; GDM carries substantially elevated lifetime type 2 diabetes risk</li>
                </ul>
            </section>

            <section>
                <h2>5. Maternal Conditions and Lactation</h2>
                <ul>
                    <li><strong>Hyperemesis gravidarum:</strong> severe, causing weight loss and dehydration. Risk of <strong>thiamine deficiency and Wernicke encephalopathy</strong> - give thiamine before glucose-containing IV fluids.</li>
                    <li><strong>Preeclampsia:</strong> hypertension with proteinuria after 20 weeks. Sodium restriction is NOT the treatment; delivery is definitive.</li>
                    <li><strong>Lactation:</strong> milk volume depends mainly on demand and removal, not maternal intake. Adequate fluid to thirst.</li>
                    <li><strong>Breastfeeding contraindications:</strong> maternal HIV in settings with safe formula access, active untreated tuberculosis, certain medications and chemotherapy, and infant galactosemia.</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q18-1",
                text: "A woman with a prepregnancy BMI of 27 kg/m2 asks about weight gain. What is the recommended range?",
                options: ["25 to 35 lb", "15 to 25 lb", "11 to 20 lb", "28 to 40 lb"],
                correctAnswer: 1,
                explanation: "A BMI of 27 falls in the overweight category of 25 to 29.9, for which the recommended gestational gain is 15 to 25 lb. The 25 to 35 lb range applies to normal weight, 11 to 20 lb to obesity, and 28 to 40 lb to underweight. Using prepregnancy BMI rather than current weight is the critical step in answering these items."
            },
            {
                id: "q18-2",
                text: "Why is preconception folic acid supplementation emphasized rather than starting once pregnancy is confirmed?",
                options: ["Folate absorption is better before pregnancy", "The neural tube closes by about day 28, before most women know they are pregnant", "Folate needs decrease after the first trimester", "Supplements are contraindicated during pregnancy"],
                correctAnswer: 1,
                explanation: "Neural tube closure is complete by roughly day 28 of gestation, which is often before a pregnancy is recognized, so supplementation must already be in place to prevent neural tube defects. Absorption does not differ meaningfully by timing, folate needs remain elevated throughout pregnancy at 600 mcg DFE, and supplementation is recommended rather than contraindicated."
            },
            {
                id: "q18-3",
                text: "A woman with gestational diabetes asks about carbohydrate intake. What is the minimum daily amount recommended?",
                options: ["100 g", "130 g", "175 g", "250 g"],
                correctAnswer: 2,
                explanation: "A minimum of 175 g of carbohydrate daily is recommended in pregnancy to supply fetal brain glucose needs and prevent ketosis, which is why very low carbohydrate approaches are inappropriate in gestational diabetes. The 130 g figure is the general adult RDA for carbohydrate, not the pregnancy minimum, and 100 g would risk ketosis."
            }
        ]
    },
    19: {
        id: 19,
        title: "Geriatrics & Long-Term Care",
        theoryTitle: "Sarcopenia, Dysphagia, Malnutrition Criteria & Pressure Injuries",
        theoryGoal: "Goal: Assess malnutrition with the AND/ASPEN criteria and manage the syndromes that dominate long-term care.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on geriatric nutrition, malnutrition assessment and wound care.",
        theoryContent: `
            <section>
                <h2>1. AND/ASPEN Malnutrition Criteria</h2>
                <p>Diagnosis requires <strong>TWO OR MORE</strong> of six characteristics:</p>
                <ol>
                    <li>Insufficient energy intake</li>
                    <li>Weight loss</li>
                    <li>Loss of subcutaneous fat</li>
                    <li>Loss of muscle mass</li>
                    <li>Fluid accumulation (which can mask weight loss)</li>
                    <li>Reduced grip strength</li>
                </ol>
                <p><em>Exam trap:</em> <strong>Albumin and prealbumin are NOT criteria.</strong> They are negative acute phase reactants that fall with inflammation regardless of intake. If an option uses albumin to diagnose malnutrition, it is wrong.</p>
                <h3>Significant Weight Loss Thresholds</h3>
                <ul>
                    <li>1-2% in 1 week &nbsp;|&nbsp; 5% in 1 month &nbsp;|&nbsp; 7.5% in 3 months &nbsp;|&nbsp; 10% in 6 months</li>
                </ul>
                <p>Percent weight change = (usual weight - current weight) / usual weight x 100.</p>
            </section>

            <section>
                <h2>2. Sarcopenia and Protein in Aging</h2>
                <p>Older adults develop <strong>anabolic resistance</strong>: they need more protein per meal to trigger the same muscle protein synthesis.</p>
                <ul>
                    <li><strong>Target 1.0-1.2 g/kg/day</strong>, higher with acute illness or wounds - above the 0.8 g/kg RDA</li>
                    <li><strong>Distribute 25-30 g of protein per meal</strong> rather than loading it at dinner</li>
                    <li>Pair with resistance exercise, which is the strongest single intervention for sarcopenia</li>
                </ul>
                <p>Other age-related shifts: reduced thirst sensation, decreased gastric acid (impairs B12 and iron absorption), reduced skin synthesis of vitamin D, altered taste and smell, polypharmacy.</p>
            </section>

            <section>
                <h2>3. Dysphagia</h2>
                <p>The IDDSI framework runs 0-7, with drinks 0-4 and foods 3-7.</p>
                <ul>
                    <li>0 Thin &nbsp; 1 Slightly thick &nbsp; 2 Mildly thick (nectar) &nbsp; 3 Moderately thick (honey) &nbsp; 4 Extremely thick (pudding)</li>
                    <li>4 Pureed &nbsp; 5 Minced and moist &nbsp; 6 Soft and bite-sized &nbsp; 7 Regular</li>
                </ul>
                <p>Signs: coughing or wet voice after swallowing, pocketing, prolonged meal times, recurrent pneumonia. <strong>Silent aspiration</strong> produces no cough and is common after stroke.</p>
                <p>Refer to speech-language pathology for formal evaluation before advancing textures. Monitor hydration closely, since thickened liquids are frequently under-consumed.</p>
            </section>

            <section>
                <h2>4. Pressure Injuries</h2>
                <ul>
                    <li><strong>Energy:</strong> 30-35 kcal/kg</li>
                    <li><strong>Protein:</strong> 1.25-1.5 g/kg, upper end for stage 3 and 4</li>
                    <li><strong>Vitamin C:</strong> cofactor for collagen hydroxylation</li>
                    <li><strong>Zinc:</strong> only if deficiency is suspected. Cap around 40 mg elemental daily short term - prolonged high-dose zinc induces <strong>copper deficiency</strong> with microcytic anemia and neutropenia</li>
                    <li><strong>Arginine-containing specialized supplements</strong> may help stage 3-4 wounds</li>
                </ul>
                <p><strong>Braden Scale</strong> assesses pressure injury risk across sensory perception, moisture, activity, mobility, nutrition, and friction and shear.</p>
            </section>

            <section>
                <h2>5. Long-Term Care Principles</h2>
                <ul>
                    <li><strong>Liberalized diets</strong> are preferred in long-term care. Restrictive therapeutic diets reduce intake and quality of life, and the resulting weight loss usually outweighs any metabolic benefit.</li>
                    <li>Feeding tubes in <strong>advanced dementia</strong> have NOT been shown to prolong survival, prevent aspiration or improve pressure injuries. Careful hand feeding is preferred, and this is a goals-of-care conversation.</li>
                    <li>Unintended weight loss is a federally tracked quality indicator in nursing homes.</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q19-1",
                text: "Which combination supports a diagnosis of malnutrition using AND/ASPEN criteria?",
                options: ["Low serum albumin and low prealbumin", "Unintentional weight loss plus documented loss of muscle mass", "Elevated C-reactive protein alone", "BMI of 24 with normal intake"],
                correctAnswer: 1,
                explanation: "The AND/ASPEN framework requires two or more of six clinical characteristics: insufficient intake, weight loss, loss of subcutaneous fat, loss of muscle mass, fluid accumulation, and reduced grip strength. Weight loss plus muscle loss meets that standard. Albumin and prealbumin are explicitly NOT criteria, because they are negative acute phase reactants driven by inflammation. C-reactive protein indicates inflammation without describing nutritional status."
            },
            {
                id: "q19-2",
                text: "A 75 kg older adult recovering from hip fracture surgery needs protein guidance. Which recommendation is most appropriate?",
                options: ["60 g per day (0.8 g/kg)", "90 g per day, distributed as 25 to 30 g per meal", "45 g per day to protect kidney function", "180 g per day"],
                correctAnswer: 1,
                explanation: "Older adults experience anabolic resistance and need 1.0 to 1.2 g/kg or more with acute illness, which is about 90 g for a 75 kg patient, and distributing 25 to 30 g per meal better stimulates muscle protein synthesis than loading protein at one meal. The 0.8 g/kg RDA is calibrated to healthy young adults. Restricting to 0.6 g/kg without renal indication accelerates sarcopenia, and 180 g exceeds any recommendation."
            },
            {
                id: "q19-3",
                text: "A family asks about a feeding tube for their mother with advanced dementia who is eating poorly. What does the evidence support?",
                options: ["Tube feeding prolongs survival and prevents aspiration in advanced dementia", "Tube feeding has not been shown to prolong survival, prevent aspiration or improve pressure injuries; careful hand feeding is preferred", "Tube feeding is required once oral intake falls below 50%", "Tube feeding reliably improves quality of life"],
                correctAnswer: 1,
                explanation: "Evidence consistently shows that tube feeding in advanced dementia does not prolong survival, prevent aspiration pneumonia, or improve pressure injuries, and it introduces burdens including restraint use and tube-related complications. Careful hand feeding is the recommended approach, framed within a goals-of-care conversation rather than triggered by an intake threshold."
            }
        ]
    },
    20: {
        id: 20,
        title: "Nutrition Support Mastery",
        theoryTitle: "Access, Complications, Calculations & Transitions",
        theoryGoal: "Goal: Consolidate enteral and parenteral nutrition into exam-ready decision rules and calculations.",
        practiceTitle: "App -> Domain II (Nutrition Care)",
        practiceGoal: "Goal: Complete 40 Domain II questions on nutrition support, then take a 50-question mixed checkpoint.",
        theoryContent: `
            <section>
                <h2>1. Access Decision Rules</h2>
                <ul>
                    <li>Under 4-6 weeks &rarr; nasoenteric. Over 4-6 weeks &rarr; PEG or jejunostomy.</li>
                    <li>Aspiration risk or gastroparesis &rarr; POST-PYLORIC, with CONTINUOUS infusion (the small bowel has no reservoir)</li>
                    <li>Gastric outlet obstruction &rarr; jejunostomy</li>
                    <li>Ascites or significant coagulopathy &rarr; relative contraindications to PEG</li>
                    <li>Progressive neuromuscular disease (ALS) &rarr; place PEG EARLY, before forced vital capacity drops below about 50%</li>
                    <li>Feeding may begin within about <strong>4 hours</strong> of uncomplicated PEG placement</li>
                    <li>Verify blindly placed tubes <strong>radiographically</strong>. Auscultation is unreliable and abandoned.</li>
                </ul>
                <p>Bolus feeding is for the STOMACH only. Never bolus into the jejunum.</p>
            </section>

            <section>
                <h2>2. Enteral Complications</h2>
                <ul>
                    <li><strong>Diarrhea:</strong> check MEDICATIONS first - sorbitol-containing elixirs, liquid potassium chloride, antibiotics. Formula is rarely the cause.</li>
                    <li><strong>Clogged tube:</strong> warm water with gentle push-pull. Never cola or cranberry juice (acid precipitates protein).</li>
                    <li><strong>Aspiration:</strong> head of bed 30-45 degrees is the best-supported measure.</li>
                    <li><strong>Hypernatremia:</strong> free water deficit. Remember formula is only 70-85% water.</li>
                    <li><strong>Phenytoin:</strong> binds to formula. Hold feeding 1-2 hours before and after each dose.</li>
                    <li><strong>Hang time:</strong> open/decanted 4-8 hours; closed ready-to-hang 24-48 hours per label.</li>
                </ul>
            </section>

            <section>
                <h2>3. Parenteral Essentials</h2>
                <ul>
                    <li><strong>Dextrose 3.4 kcal/g</strong>; amino acids 4 kcal/g; 20% lipid 2.0 kcal/mL</li>
                    <li><strong>GIR</strong> = g dextrose x 1,000 / kg / 1,440. Keep at or below 4-5 mg/kg/min.</li>
                    <li><strong>PPN osmolarity limit</strong> about 900 mOsm/L; above that requires central access</li>
                    <li><strong>Essential fatty acid deficiency:</strong> after 2-4 weeks fat-free. Dry scaly dermatitis, alopecia, poor healing. Prevent with 2-4% of calories as linoleic acid.</li>
                    <li><strong>Copper deficiency:</strong> microcytic anemia plus neutropenia with low ceruloplasmin</li>
                    <li><strong>Calcium-phosphate precipitation</strong> is the dangerous incompatibility; pharmacy adds phosphate before calcium</li>
                    <li><strong>Abrupt discontinuation</strong> risks rebound hypoglycemia - taper</li>
                    <li><strong>PNALD:</strong> cycle PN, avoid overfeeding, maximize any enteral intake</li>
                </ul>
            </section>

            <section>
                <h2>4. Refeeding Syndrome Checklist</h2>
                <p>Falling <strong>phosphorus, potassium and magnesium</strong>. High risk: BMI under 16, minimal intake over 5-10 days, alcohol use disorder, anorexia nervosa.</p>
                <p>Start at about 25% of goal, give <strong>thiamine before or with</strong> the first carbohydrate, monitor and replete daily, advance over 3-5 days.</p>
            </section>

            <section>
                <h2>5. Transitioning Off Support</h2>
                <ul>
                    <li>Begin weaning enteral support when oral intake consistently meets about 50-75% of needs</li>
                    <li>Cycle enteral feeding to nights so daytime appetite returns</li>
                    <li>Discontinue when oral intake reliably meets 75% or more for several days</li>
                    <li>Transitioning off PN requires enteral or oral tolerance first; overlap the two</li>
                    <li>Formal swallow evaluation before advancing textures in any neurologically impaired patient</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q20-1",
                text: "A patient receiving continuous tube feeding develops 6 loose stools daily. Stool studies are negative for C. difficile. Medications include a sorbitol-containing liquid stool softener and liquid potassium chloride. What is the most likely cause?",
                options: ["The osmolality of the enteral formula", "Sorbitol and hyperosmolar liquid medications", "Lactose intolerance from the formula", "Excess formula fiber"],
                correctAnswer: 1,
                explanation: "Sorbitol is a non-absorbable sugar alcohol that draws water into the bowel lumen, and liquid potassium chloride is strongly hyperosmolar; medications are the most common cause of diarrhea in tube-fed patients. Standard polymeric formulas are near-isotonic and rarely responsible. Commercial enteral formulas are lactose-free. Excess fiber tends to cause bloating or constipation rather than osmotic diarrhea."
            },
            {
                id: "q20-2",
                text: "A 70 kg patient receives parenteral nutrition containing 400 g of dextrose over 24 hours. What is the glucose infusion rate?",
                options: ["2.8 mg/kg/min, below recommended minimums", "4.0 mg/kg/min, near the upper recommended limit", "6.9 mg/kg/min, within the safe range", "0.4 mg/kg/min, negligible"],
                correctAnswer: 1,
                explanation: "Glucose infusion rate equals grams times 1,000 divided by kilograms divided by 1,440 minutes: 400,000 mg / 70 kg / 1,440 = about 4.0 mg/kg/min, which sits near the recommended ceiling of 4 to 5 mg/kg/min. Exceeding that range causes hyperglycemia, lipogenesis and hepatic steatosis. The other values reflect arithmetic errors of roughly a factor of two or ten."
            },
            {
                id: "q20-3",
                text: "A patient has been on fat-free parenteral nutrition for 4 weeks and develops dry scaly dermatitis, alopecia and poor wound healing. Which deficiency is most likely?",
                options: ["Zinc deficiency", "Essential fatty acid deficiency", "Selenium deficiency", "Copper deficiency"],
                correctAnswer: 1,
                explanation: "Essential fatty acid deficiency develops after roughly two to four weeks of fat-free parenteral nutrition, producing dry scaly dermatitis, alopecia and impaired healing, and is prevented by supplying 2 to 4% of calories as linoleic acid. Zinc deficiency causes a perioral and perianal rash with taste changes. Selenium deficiency causes cardiomyopathy and myopathy. Copper deficiency causes microcytic anemia with neutropenia."
            }
        ]
    },
    21: {
        id: 21,
        title: "Menu Development & Engineering",
        theoryTitle: "Menu Types, the Engineering Matrix & Forecasting",
        theoryGoal: "Goal: Classify menu types, place items on the engineering matrix, and act on each quadrant correctly.",
        practiceTitle: "App -> Domain IV (Foodservice Systems)",
        practiceGoal: "Goal: Complete 40 Domain IV questions on menu planning, engineering and forecasting.",
        theoryContent: `
            <section>
                <h2>1. Menu Types</h2>
                <ul>
                    <li><strong>Static (fixed):</strong> same every day. Fast food; maximum consistency.</li>
                    <li><strong>Cycle:</strong> rotates on a set schedule (7, 14, 21 days) then repeats. Hospitals, schools, corrections - captive repeat audiences. Reduces planning labor.</li>
                    <li><strong>A la carte:</strong> each item priced separately; every item must stand on its own profitability.</li>
                    <li><strong>Table d'hote (prix fixe):</strong> complete meal at a fixed price; predictable food cost.</li>
                    <li><strong>Du jour:</strong> changes daily with season and availability.</li>
                    <li><strong>Selective (patient menu):</strong> patients choose per component. Improves satisfaction, intake and plate waste.</li>
                </ul>
            </section>

            <section>
                <h2>2. Menu Engineering Matrix</h2>
                <p>Plot every item on POPULARITY versus <strong>CONTRIBUTION MARGIN</strong> (selling price minus variable food cost) - NOT food cost percentage.</p>
                <ul>
                    <li><strong>STAR</strong> - high popularity, high margin &rarr; KEEP and PROTECT. Feature prominently, maintain quality, do not casually change the price.</li>
                    <li><strong>PLOW HORSE</strong> - high popularity, LOW margin &rarr; INCREASE PROFITABILITY. Raise price modestly, reduce portion, substitute lower-cost ingredients, move to a less prominent menu position.</li>
                    <li><strong>PUZZLE</strong> - LOW popularity, high margin &rarr; INCREASE SALES. Reposition on the menu, rename, add description, train servers to upsell, bundle.</li>
                    <li><strong>DOG</strong> - low popularity, low margin &rarr; ELIMINATE or redesign.</li>
                </ul>
                <p><em>Exam trap:</em> An item with a LOW food cost percentage can still have a LOW contribution margin if its selling price is low. Margin is dollars, not percentage.</p>
            </section>

            <section>
                <h2>3. Forecasting and Production Records</h2>
                <ul>
                    <li><strong>Moving average:</strong> sum of the last N periods divided by N. Example: 115, 119, 123, 120, 121 &rarr; 598 / 5 = 119.6, round to 120.</li>
                    <li><strong>Popularity index:</strong> portions of one item sold / total portions sold</li>
                    <li><strong>Production records</strong> document forecast, prepared, served and leftover, and are the feedback loop that improves the next forecast</li>
                </ul>
                <h3>Recipe Math</h3>
                <ul>
                    <li><strong>Conversion factor</strong> = desired yield / original yield; multiply each ingredient</li>
                    <li><strong>AP to EP:</strong> EP needed / yield % = AP to purchase. Example: 6.5 lb EP beef at 65% yield = 10 lb AP</li>
                    <li><strong>Standardized recipes</strong> are the foundation of consistent quality, accurate costing and reliable nutrient analysis</li>
                </ul>
            </section>

            <section>
                <h2>4. Menu Planning Constraints</h2>
                <p>Balance variety in color, texture, temperature, shape, flavor and preparation method. Also consider:</p>
                <ul>
                    <li>Equipment capacity - do not schedule three oven-dependent items in one meal period</li>
                    <li>Labor skill and staffing pattern</li>
                    <li>Budget and target food cost percentage</li>
                    <li>Clientele preferences, cultural and religious needs</li>
                    <li>Regulatory requirements (school meal patterns, CACFP, long-term care)</li>
                </ul>
            </section>

            <section>
                <h2>5. Pricing Methods</h2>
                <ul>
                    <li><strong>Factor / markup:</strong> selling price = food cost / target food cost %. A $3.50 item at a 35% target prices at $10.00.</li>
                    <li><strong>Contribution margin pricing:</strong> price = food cost + required contribution per cover</li>
                    <li><strong>Prime cost:</strong> food cost + direct labor</li>
                </ul>
                <p><strong>Food cost %</strong> = (food cost / food sales) x 100.</p>
            </section>
 `,
        questions: [
            {
                id: "q21-1",
                text: "A menu item sells in high volume but generates a low contribution margin. Which category does it occupy and what is the correct action?",
                options: ["Star; keep and protect it", "Plow horse; raise the price modestly or reduce production cost", "Puzzle; reposition and promote it", "Dog; remove it from the menu"],
                correctAnswer: 1,
                explanation: "High popularity paired with low contribution margin defines a plow horse, and the goal is to improve profitability without killing demand through a modest price increase, portion adjustment or ingredient substitution. A star has both high popularity and high margin. A puzzle has high margin but low sales and needs promotion. A dog is low on both and is a candidate for elimination."
            },
            {
                id: "q21-2",
                text: "A recipe yields 50 servings and you need 125 servings. What is the conversion factor?",
                options: ["2.5", "0.4", "75", "1.5"],
                correctAnswer: 0,
                explanation: "The conversion factor equals desired yield divided by original yield: 125 / 50 = 2.5, and each ingredient is multiplied by that factor. Inverting the ratio gives 0.4 and would shrink the recipe. The figure 75 is the difference in servings, not a multiplier, and 1.5 does not follow from these numbers."
            },
            {
                id: "q21-3",
                text: "You need 6.5 lb of cooked beef and the yield is 65%. How much should be purchased as-purchased?",
                options: ["4.2 lb", "10 lb", "6.5 lb", "13 lb"],
                correctAnswer: 1,
                explanation: "As-purchased quantity equals edible portion needed divided by yield percentage: 6.5 / 0.65 = 10 lb. Multiplying by the yield instead of dividing gives 4.2 lb and would leave you short. Purchasing 6.5 lb ignores cooking and trim loss entirely, and 13 lb reflects doubling rather than applying the yield factor."
            }
        ]
    },
    22: {
        id: 22,
        title: "Financial Management & Cost Control",
        theoryTitle: "Budgets, Break-Even, Depreciation & Cost Analysis",
        theoryGoal: "Goal: Execute the financial calculations that appear on nearly every exam form.",
        practiceTitle: "App -> Domain III (Management)",
        practiceGoal: "Goal: Complete 40 Domain III questions on financial management, focusing on calculation items.",
        theoryContent: `
            <section>
                <h2>1. Budget Types</h2>
                <ul>
                    <li><strong>Operational budget:</strong> day-to-day recurring expenses - food, labor (wages plus benefits), disposables, office supplies, utilities</li>
                    <li><strong>Capital budget:</strong> long-term assets with a useful life over 1 year and cost above a threshold (commonly $500-$5,000) - ovens, refrigerators, blast chillers, computers, renovations</li>
                </ul>
                <p><em>Exam trap:</em> Kitchen EQUIPMENT is capital. Food, labor and supplies are operational. This distinction is tested repeatedly.</p>
                <h3>Budgeting Approaches</h3>
                <ul>
                    <li><strong>Incremental:</strong> last year's budget adjusted by a percentage</li>
                    <li><strong>Zero-based:</strong> every expense justified from zero each cycle</li>
                    <li><strong>Fixed:</strong> set regardless of volume &nbsp;|&nbsp; <strong>Flexible:</strong> adjusts with volume</li>
                </ul>
            </section>

            <section>
                <h2>2. Cost Behavior</h2>
                <ul>
                    <li><strong>Fixed costs:</strong> unchanged with volume - rent, insurance, salaried management, depreciation</li>
                    <li><strong>Variable costs:</strong> change directly with volume - food, disposables, hourly labor tied to covers</li>
                    <li><strong>Semi-variable:</strong> contain both - utilities, some labor</li>
                </ul>
                <p><strong>Contribution margin per unit</strong> = selling price - variable cost per unit</p>
            </section>

            <section>
                <h2>3. The Core Calculations</h2>
                <h3>Break-Even</h3>
                <p>Units = fixed costs / contribution margin per unit.</p>
                <p>Example: fixed costs $12,000; selling price $15; variable cost $9. Margin = $6. Break-even = 12,000 / 6 = <strong>2,000 units</strong>.</p>
                <h3>Straight-Line Depreciation</h3>
                <p>(Purchase cost - salvage value) / useful life in years.</p>
                <p>Example: $10,000 oven, $1,250 salvage, 10 years = (10,000 - 1,250) / 10 = <strong>$875/year</strong>.</p>
                <p><em>Exam trap:</em> SUBTRACT salvage FIRST. Answering $1,000 by dividing cost alone is the designed distractor.</p>
                <h3>Food Cost</h3>
                <ul>
                    <li>Food cost for a period = opening inventory + purchases - closing inventory</li>
                    <li>Food cost % = (food cost / food sales) x 100</li>
                    <li>Selling price = food cost / target food cost %</li>
                </ul>
                <h3>Labor</h3>
                <ul>
                    <li>FTE = (positions x hours x days) / 40</li>
                    <li>Productivity: meals per labor hour, or labor minutes per meal</li>
                </ul>
            </section>

            <section>
                <h2>4. Financial Statements</h2>
                <ul>
                    <li><strong>Income statement (P&amp;L):</strong> revenue minus expenses over a PERIOD</li>
                    <li><strong>Balance sheet:</strong> assets = liabilities + equity at a POINT IN TIME</li>
                    <li><strong>Cash flow statement:</strong> cash in and out</li>
                </ul>
                <p><strong>Variance analysis</strong> compares budgeted to actual. A FAVORABLE variance means actual came in better than budget; unfavorable means worse. Investigate the cause rather than only reporting the number.</p>
            </section>

            <section>
                <h2>5. Revenue and Reimbursement</h2>
                <ul>
                    <li><strong>MNT is reimbursed by Medicare Part B</strong> for diabetes, chronic kidney disease (non-dialysis), and up to 36 months post kidney transplant, with a physician referral</li>
                    <li>Standard benefit: 3 hours in the first year, 2 hours in subsequent years, with additional hours if the physician documents a change in condition</li>
                    <li><strong>DRG</strong> (diagnosis-related group) pays a fixed amount per admission, which creates a financial incentive to reduce length of stay - and makes nutrition intervention that shortens stay valuable</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q22-1",
                text: "A foodservice operation has fixed costs of $18,000 per month. Each meal sells for $12 with a variable cost of $7. What is the monthly break-even volume?",
                options: ["1,500 meals", "3,600 meals", "2,571 meals", "1,059 meals"],
                correctAnswer: 1,
                explanation: "Contribution margin per meal is selling price minus variable cost, or $12 minus $7 = $5. Break-even units equal fixed costs divided by contribution margin: 18,000 / 5 = 3,600 meals. Dividing by the selling price of $12 gives 1,500 and ignores variable cost. Dividing by $7 gives 2,571 and uses the wrong figure entirely."
            },
            {
                id: "q22-2",
                text: "A combi oven costs $24,000, has a salvage value of $4,000, and a useful life of 8 years. What is the annual straight-line depreciation?",
                options: ["$3,000", "$2,500", "$2,000", "$3,500"],
                correctAnswer: 1,
                explanation: "Straight-line depreciation subtracts salvage value before dividing by useful life: (24,000 minus 4,000) / 8 = $2,500 per year. Dividing the full $24,000 by 8 gives $3,000 and is the most common error, because it ignores the salvage value entirely. The other figures do not follow from the formula."
            },
            {
                id: "q22-3",
                text: "A hospital is replacing its walk-in refrigerator. Which budget does this expense belong to?",
                options: ["Operational budget, because refrigeration supports daily food service", "Capital budget, because it is a long-term asset above the cost threshold", "Neither; equipment replacement is expensed as maintenance", "Operational budget, because it recurs annually"],
                correctAnswer: 1,
                explanation: "A walk-in refrigerator is a long-term asset with a useful life well beyond one year and a cost above typical capitalization thresholds, so it belongs in the capital budget and is depreciated over its useful life. The operational budget covers recurring day-to-day expenses such as food, labor and disposable supplies. Routine repairs are maintenance, but full replacement of the unit is a capital purchase."
            }
        ]
    },
    23: {
        id: 23,
        title: "Food Safety, HACCP & Sanitation",
        theoryTitle: "Pathogens, Temperatures, HACCP Principles & Sanitizers",
        theoryGoal: "Goal: Lock in the temperature set, the seven HACCP principles, and the pathogens with unique behavior.",
        practiceTitle: "App -> Domain IV (Foodservice Systems)",
        practiceGoal: "Goal: Complete 40 Domain IV questions on food safety, HACCP and sanitation.",
        theoryContent: `
            <section>
                <h2>1. The Temperature Set (Memorize Cold)</h2>
                <ul>
                    <li><strong>Danger zone:</strong> 41-135 F. Limit cumulative exposure to under 4 hours total.</li>
                    <li><strong>Cooling, stage 1:</strong> 135 &rarr; 70 F within <strong>2 hours</strong></li>
                    <li><strong>Cooling, stage 2:</strong> 70 &rarr; 41 F within <strong>4 more hours</strong> (6 total)</li>
                    <li><strong>Poultry, stuffing, reheating:</strong> 165 F</li>
                    <li><strong>Ground meat:</strong> 155 F for 15 seconds</li>
                    <li><strong>Whole muscle beef, pork, fish:</strong> 145 F (plus 3 minute rest for roasts)</li>
                    <li><strong>Hot holding:</strong> above 135 F &nbsp;|&nbsp; <strong>Cold holding:</strong> at or below 41 F</li>
                    <li><strong>C. botulinum spores:</strong> 250 F at 15 psi - PRESSURE canning only. Water bath is insufficient for low-acid foods.</li>
                </ul>
                <p><em>Exam trap:</em> Steam tables, chafing dishes and heat lamps HOLD. They cannot REHEAT. Reheat to 165 F first, then transfer.</p>
            </section>

            <section>
                <h2>2. HACCP - Seven Principles in Order</h2>
                <ol>
                    <li><strong>Hazard analysis</strong> - identify biological, chemical and physical hazards at each step</li>
                    <li><strong>Identify CCPs</strong> - steps where control is ESSENTIAL, the last chance to prevent the hazard</li>
                    <li><strong>Establish critical limits</strong> - objective and MEASURABLE: temperature, time, pH, water activity</li>
                    <li><strong>Establish monitoring</strong> - how, by whom, how often</li>
                    <li><strong>Establish corrective actions</strong> - predetermined, addressing both the food and the cause</li>
                    <li><strong>Establish verification</strong> - supervisor log review, calibration, annual plan review</li>
                    <li><strong>Record keeping</strong></li>
                </ol>
                <p>Not every step is a CCP. Cooking is almost always a CCP for biological hazards in raw proteins.</p>
            </section>

            <section>
                <h2>3. Pathogens With Unique Behavior</h2>
                <ul>
                    <li><strong>Listeria monocytogenes:</strong> GROWS AT REFRIGERATOR TEMPERATURES - unique. Deli meats, soft cheeses, smoked fish. Crosses the placenta; high risk in pregnancy.</li>
                    <li><strong>Staphylococcus aureus:</strong> produces a HEAT-STABLE TOXIN. Cooking does not destroy it once formed. Rapid onset, 1-6 hours. From an infected food handler.</li>
                    <li><strong>Clostridium botulinum:</strong> anaerobic; improperly canned low-acid foods, garlic in oil. Neurologic symptoms; most potent toxin known.</li>
                    <li><strong>Salmonella:</strong> poultry, eggs, produce. Most common. Destroyed by cooking to 165 F.</li>
                    <li><strong>E. coli O157:H7:</strong> undercooked ground beef, unpasteurized juice. Very low infectious dose; hemolytic uremic syndrome.</li>
                    <li><strong>Norovirus:</strong> leading cause of outbreaks. Exclude ill workers 48-72 hours AFTER symptoms resolve.</li>
                </ul>
            </section>

            <section>
                <h2>4. Sanitizers</h2>
                <ul>
                    <li><strong>Chlorine 50-200 ppm:</strong> works against SPORES, inexpensive. Corrosive; inactivated by organic matter; less effective at high pH and high temperature. Use tepid water.</li>
                    <li><strong>Quaternary ammonium 200-400 ppm:</strong> stable across temperature and pH, non-corrosive, residual action. NOT effective against spores. <strong>NEVER mix with detergents</strong> - it neutralizes the sanitizer.</li>
                    <li><strong>Iodine 12.5-25 ppm:</strong> COLOR INDICATOR - amber means active, colorless means depleted. Stains plastic; inactivated above 120 F.</li>
                </ul>
                <p><strong>Cleaning removes soil. Sanitizing reduces pathogens.</strong> You must clean BEFORE you sanitize.</p>
                <p>Three-compartment sink: wash (110 F minimum) &rarr; rinse &rarr; sanitize &rarr; AIR DRY. Never towel dry.</p>
            </section>

            <section>
                <h2>5. Storage, Personnel and Fire</h2>
                <ul>
                    <li><strong>Storage order top to bottom</strong> by final cook temperature: ready-to-eat, seafood (145), whole muscle (145), ground meat (155), poultry (165) on the BOTTOM</li>
                    <li>Store food 6 inches off the floor, away from walls, FIFO rotation</li>
                    <li><strong>Handwashing:</strong> 20 seconds, at a designated handwashing sink only</li>
                    <li><strong>Gloves do not replace handwashing</strong></li>
                    <li><strong>Class K fire extinguisher</strong> for cooking oils - WET CHEMICAL only. NEVER water on an oil fire.</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q23-1",
                text: "A large batch of chili is cooked and must be cooled. Which cooling parameters comply with the FDA Food Code?",
                options: ["135 to 70 F within 2 hours, then 70 to 41 F within 4 additional hours", "135 to 41 F within 2 hours total", "135 to 70 F within 6 hours, then 70 to 41 F within 2 hours", "Any cooling rate is acceptable if the product is refrigerated"],
                correctAnswer: 0,
                explanation: "The two-stage rule requires cooling from 135 to 70 F within 2 hours, then from 70 to 41 F within 4 additional hours, for 6 hours total. The first stage is the more critical one because it passes through the range of most rapid bacterial growth. Compressing the entire process into 2 hours is not the standard, and reversing the stage times allows dangerous time in the upper danger zone."
            },
            {
                id: "q23-2",
                text: "Which pathogen is unique because it grows at refrigeration temperatures?",
                options: ["Salmonella", "Listeria monocytogenes", "Staphylococcus aureus", "Clostridium perfringens"],
                correctAnswer: 1,
                explanation: "Listeria monocytogenes is able to multiply at refrigerator temperatures, which is why ready-to-eat foods such as deli meats, soft cheeses and smoked fish carry risk even when properly refrigerated, and why pregnant women are counseled to heat deli meats. Salmonella, Staphylococcus aureus and Clostridium perfringens all require warmer conditions for meaningful growth."
            },
            {
                id: "q23-3",
                text: "A cook places cooked rice that has been sitting at room temperature for 3 hours onto a steam table to bring it back to a safe temperature. What is wrong with this action?",
                options: ["Nothing; steam tables are designed for reheating", "Steam tables hold food but cannot reheat it; the rice must be reheated to 165 F first", "The rice should have been reheated to 145 F", "Rice does not require temperature control"],
                correctAnswer: 1,
                explanation: "Steam tables, chafing dishes and heat lamps are holding equipment and cannot bring food through the danger zone quickly enough to be safe. Reheating must reach 165 F using an oven, stovetop or microwave before transfer to holding. Cooked rice is a time and temperature control for safety food, notably associated with Bacillus cereus, so it does require control."
            }
        ]
    },
    24: {
        id: 24,
        title: "Equipment & Facility Design",
        theoryTitle: "Equipment Selection, Workflow, Materials & Ventilation",
        theoryGoal: "Goal: Match equipment to production needs and apply the design rules that govern sanitation and safety.",
        practiceTitle: "App -> Domain IV (Foodservice Systems)",
        practiceGoal: "Goal: Complete 40 Domain IV questions on equipment and facility design.",
        theoryContent: `
            <section>
                <h2>1. Ovens and Cooking Equipment</h2>
                <ul>
                    <li><strong>Convection:</strong> fan circulates heated air; 25-30% faster than conventional. Most versatile and most common.</li>
                    <li><strong>Steam:</strong> fast, even, excellent nutrient retention. CANNOT brown - no Maillard reaction without dry heat.</li>
                    <li><strong>Combination (combi):</strong> convection, steam, or both. Most versatile single unit; most expensive; requires training.</li>
                    <li><strong>Microwave:</strong> heats water molecules; fast for individual portions. Does not brown; uneven in dense foods.</li>
                    <li><strong>Deck:</strong> conductive heat from a stone or steel deck. Best bottom crust for pizza and hearth breads; long preheat.</li>
                    <li><strong>Tilting skillet (braising pan):</strong> the most versatile single piece in many kitchens - sauté, braise, simmer, griddle.</li>
                </ul>
            </section>

            <section>
                <h2>2. Materials and Construction</h2>
                <ul>
                    <li><strong>Stainless steel Type 304 (18/8):</strong> 18% chromium, 8% nickel. Food CONTACT surfaces. Excellent corrosion resistance, non-magnetic. NSF preferred.</li>
                    <li><strong>Type 430:</strong> no nickel, slightly magnetic, less corrosion resistant, lower cost. NON-food-contact surfaces.</li>
                    <li><strong>Gauge:</strong> LOWER number = THICKER metal. 14 gauge heavy duty, 16 general, 18 light duty.</li>
                    <li><strong>Flooring:</strong> quarry tile is the standard - durable, slip resistant; grout must be sealed periodically. Epoxy is seamless with no grout lines.</li>
                    <li><strong>Coving:</strong> the sealed curved floor-to-wall junction that eliminates the right-angle corner so it can be cleaned and harbors no pests.</li>
                </ul>
                <p><strong>NSF certification</strong> indicates equipment meets sanitation design standards. <strong>UL</strong> indicates electrical safety.</p>
            </section>

            <section>
                <h2>3. Workflow and Layout</h2>
                <p>Design follows the path of food: <strong>receiving &rarr; storage &rarr; preparation &rarr; production &rarr; service &rarr; warewashing &rarr; waste</strong>.</p>
                <p>The goals are to minimize backtracking, shorten worker travel, and ensure that soiled warewashing traffic never crosses clean food production - a cross-contamination pathway.</p>
                <ul>
                    <li><strong>Work aisle</strong> (one worker, one station): about 3.5-4 ft</li>
                    <li><strong>Traffic aisle</strong> (through traffic, carts): about 4-5 ft or more</li>
                </ul>
                <h3>Project Phases</h3>
                <p><strong>Feasibility study</strong> (go / no-go decision) &rarr; schematic design &rarr; design development &rarr; construction documents &rarr; bidding &rarr; construction administration.</p>
            </section>

            <section>
                <h2>4. Lighting and Ventilation</h2>
                <ul>
                    <li><strong>10 footcandles:</strong> walk-in storage, cleaning areas</li>
                    <li><strong>20 footcandles:</strong> service areas, handwashing, warewashing</li>
                    <li><strong>50+ footcandles:</strong> food preparation involving knives and inspection</li>
                </ul>
                <p><strong>Type I hood:</strong> required over equipment producing GREASE-laden vapors - fryers, ranges, griddles, broilers. Includes baffle filters and fire suppression.</p>
                <p><strong>Type II hood:</strong> heat and moisture only - dishwashers, steamers.</p>
                <p>Kitchens are kept at slight NEGATIVE pressure relative to the dining room so odors do not migrate outward.</p>
            </section>

            <section>
                <h2>5. Energy and Maintenance</h2>
                <ul>
                    <li>Food PREPARATION equipment is the largest energy consumer; refrigeration is second</li>
                    <li><strong>Cardboard</strong> is the most commonly recycled material by volume in foodservice</li>
                    <li>A <strong>low-flow pre-rinse spray valve</strong> at the dish station is typically the fastest-payback water conservation measure</li>
                    <li><strong>Preventive maintenance schedules</strong> extend equipment life and reduce emergency downtime; calibrate thermometers regularly</li>
                    <li><strong>Lockout/tagout</strong> before servicing any powered equipment</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q24-1",
                text: "Which oven type cannot brown food, and why?",
                options: ["Convection, because the fan cools the surface", "Steam, because moist heat does not produce the Maillard reaction", "Deck, because heat comes only from below", "Combi, because it cycles between modes"],
                correctAnswer: 1,
                explanation: "A steam oven operates at a maximum of about 100 degrees Celsius in a saturated moist environment, which prevents the surface drying and high temperatures the Maillard browning reaction requires. Convection browns very effectively because circulating dry air accelerates surface dehydration. Deck ovens brown well, particularly the bottom crust, and combi ovens can brown by running in convection mode."
            },
            {
                id: "q24-2",
                text: "Which stainless steel type is specified for food contact surfaces?",
                options: ["Type 430", "Type 304", "Type 201", "Galvanized steel"],
                correctAnswer: 1,
                explanation: "Type 304 stainless, also called 18/8 for its 18% chromium and 8% nickel content, is the standard for food contact surfaces because the nickel provides superior corrosion resistance against acidic foods and sanitizers. Type 430 contains no nickel, is slightly magnetic and less corrosion resistant, so it is used for non-food-contact surfaces. Galvanized steel is never appropriate for food contact because zinc can leach into acidic foods."
            },
            {
                id: "q24-3",
                text: "A kitchen designer places the warewashing area so that soiled dish carts must pass through the production line. What is the primary concern?",
                options: ["Increased equipment cost", "Cross-contamination from soiled traffic crossing clean food production", "Excessive lighting requirements", "Reduced dining room capacity"],
                correctAnswer: 1,
                explanation: "Routing soiled dish traffic through clean production is a cross-contamination pathway and violates the principle that workflow should move in one direction from receiving to waste removal without clean and soiled streams intersecting. It also lengthens travel distance and creates congestion, but the food safety risk is the governing concern in layout review."
            }
        ]
    },
    25: {
        id: 25,
        title: "Quality Improvement & Regulatory",
        theoryTitle: "QI Tools, Accreditation, Agencies & Informatics",
        theoryGoal: "Goal: Select the right QI tool for a given problem and map each regulatory agency to its authority.",
        practiceTitle: "App -> Domain III (Management)",
        practiceGoal: "Goal: Complete 40 Domain III questions on quality improvement and regulatory compliance.",
        theoryContent: `
            <section>
                <h2>1. Quality Improvement Tools - Match Tool to Problem</h2>
                <ul>
                    <li><strong>PDCA / PDSA:</strong> Plan-Do-Check/Study-Act. The core iterative improvement cycle.</li>
                    <li><strong>Pareto chart:</strong> the 80/20 rule. Ranked bars plus a cumulative line. Use it to decide WHICH problem to attack first.</li>
                    <li><strong>Fishbone (Ishikawa):</strong> cause-and-effect. The 6 Ms - Man, Machine, Method, Material, Measurement, Mother Nature. Use it to find WHY a problem occurs.</li>
                    <li><strong>Control chart:</strong> plots a process over time with statistical limits. Distinguishes random variation from special-cause variation.</li>
                    <li><strong>Flowchart:</strong> maps the actual process to expose redundancy and delay.</li>
                    <li><strong>Force field analysis:</strong> forces driving change versus forces resisting it (Lewin).</li>
                    <li><strong>Lean:</strong> eliminates waste. <strong>Six Sigma DMAIC:</strong> Define-Measure-Analyze-Improve-Control, targeting fewer than 3.4 defects per million.</li>
                    <li><strong>Kaizen:</strong> continuous small improvements, bottom-up, no-blame.</li>
                </ul>
                <p><em>Exam trap:</em> Pareto tells you WHICH problem to work on. Fishbone tells you WHY it happens. Questions hinge on that distinction.</p>
            </section>

            <section>
                <h2>2. Regulatory Agencies</h2>
                <ul>
                    <li><strong>The Joint Commission (TJC):</strong> accredits healthcare organizations. Holds CMS <strong>DEEMING AUTHORITY</strong> - accreditation means automatic Medicare/Medicaid compliance. Conducts UNANNOUNCED surveys, so continuous readiness is required. Requires nutrition screening within 24 hours of admission.</li>
                    <li><strong>CMS:</strong> administers Medicare and Medicaid; sets Conditions of Participation.</li>
                    <li><strong>FDA:</strong> food labeling, GRAS, dietary supplements (DSHEA 1994), gluten-free labeling under 20 ppm. Regulates all food EXCEPT meat, poultry and processed eggs.</li>
                    <li><strong>USDA:</strong> meat, poultry and processed egg inspection (FSIS); administers SNAP, WIC, NSLP, CACFP.</li>
                    <li><strong>OSHA:</strong> workplace safety. Fatalities reported within <strong>8 hours</strong>; hospitalizations, amputations and eye loss within <strong>24 hours</strong>.</li>
                    <li><strong>State and local health departments:</strong> conduct restaurant and facility inspections.</li>
                </ul>
            </section>

            <section>
                <h2>3. Documentation and Informatics</h2>
                <ul>
                    <li><strong>ADIME</strong> is the standard nutrition documentation format: Assessment, Diagnosis, Intervention, Monitoring and Evaluation</li>
                    <li><strong>HIPAA</strong> protects Protected Health Information. Apply the MINIMUM NECESSARY standard - access only what the task requires.</li>
                    <li><strong>Electronic health records</strong> support clinical decision support, standardized language and outcomes tracking</li>
                    <li>The <strong>Nutrition Care Process Terminology</strong> standardizes language so outcomes can be aggregated and compared across sites</li>
                </ul>
            </section>

            <section>
                <h2>4. Outcomes and Indicators</h2>
                <ul>
                    <li><strong>Structure</strong> measures resources - staffing ratios, equipment</li>
                    <li><strong>Process</strong> measures what was done - percent screened within 24 hours</li>
                    <li><strong>Outcome</strong> measures results - pressure injury incidence, readmission rate, unintended weight loss</li>
                </ul>
                <p><strong>Sentinel event:</strong> an unexpected occurrence involving death or serious injury. Triggers a <strong>root cause analysis</strong>, which examines SYSTEM failures rather than assigning individual blame.</p>
                <p><strong>Benchmarking</strong> compares performance against internal history, competitors, or best-in-class organizations.</p>
            </section>

            <section>
                <h2>5. Professional Standards</h2>
                <ul>
                    <li><strong>Scope of Practice</strong> defines what an RDN may do; state licensure may further restrict it</li>
                    <li><strong>Standards of Practice</strong> address care delivery; <strong>Standards of Professional Performance</strong> address professional behavior</li>
                    <li><strong>Code of Ethics</strong> governs professional conduct</li>
                    <li>CDR requires continuing professional education on a 5-year cycle, guided by a Professional Development Portfolio with a learning plan</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q25-1",
                text: "A manager has data showing 12 distinct causes of late tray delivery and needs to decide where to focus improvement efforts first. Which tool is most appropriate?",
                options: ["Fishbone diagram", "Pareto chart", "Control chart", "Force field analysis"],
                correctAnswer: 1,
                explanation: "A Pareto chart ranks causes by frequency with a cumulative line, applying the 80/20 principle to identify the vital few causes responsible for most of the problem, which is exactly the prioritization decision described. A fishbone diagram explores WHY a problem occurs but does not rank causes by impact. A control chart monitors process stability over time. Force field analysis weighs forces for and against a proposed change."
            },
            {
                id: "q25-2",
                text: "What does it mean that The Joint Commission holds deeming authority from CMS?",
                options: ["TJC accreditation automatically satisfies Medicare and Medicaid participation requirements", "TJC can revoke a state license directly", "TJC sets reimbursement rates for nutrition services", "TJC conducts announced surveys on a fixed schedule"],
                correctAnswer: 0,
                explanation: "Deeming authority means an organization accredited by TJC is deemed to meet CMS Conditions of Participation, so it does not undergo a separate CMS survey for that purpose. TJC does not issue or revoke state licenses, which is a state function, and it does not set reimbursement rates, which CMS does. TJC surveys are unannounced, which is why continuous survey readiness is required."
            },
            {
                id: "q25-3",
                text: "Which measure is an OUTCOME indicator rather than a process indicator?",
                options: ["Percentage of patients screened for nutrition risk within 24 hours", "Incidence of hospital-acquired pressure injuries", "Number of dietitians per 100 beds", "Frequency of diet manual review"],
                correctAnswer: 1,
                explanation: "Pressure injury incidence measures a result of care, making it an outcome indicator. The percentage screened within 24 hours measures whether a step was performed, which is a process indicator. Staffing ratios and the existence of a reviewed diet manual describe resources and systems in place, which are structure indicators."
            }
        ]
    },
    26: {
        id: 26,
        title: "Community & Public Health Nutrition",
        theoryTitle: "Federal Programs, Assessment, Dietary Guidance & Food Security",
        theoryGoal: "Goal: Match each federal program to its population and eligibility, and apply population-level assessment tools.",
        practiceTitle: "App -> Domain III (Management)",
        practiceGoal: "Goal: Complete 40 questions spanning community nutrition, federal programs and public health.",
        theoryContent: `
            <section>
                <h2>1. Federal Nutrition Programs</h2>
                <ul>
                    <li><strong>SNAP:</strong> low-income households; EBT card. Eligibility at or below <strong>130% FPL</strong>. CANNOT buy hot prepared foods, alcohol, tobacco, vitamins or non-food items.</li>
                    <li><strong>WIC:</strong> pregnant, postpartum and breastfeeding women, infants and children under 5. At or below <strong>185% FPL</strong> AND at nutritional risk. Nutrition education is REQUIRED. NOT an entitlement - funding is capped.</li>
                    <li><strong>NSLP / SBP:</strong> school children. Free at or below 130% FPL; reduced price 130-185% FPL.</li>
                    <li><strong>CACFP:</strong> child and adult day care. At least ONE whole grain-rich product per day required. Whole milk for ages 1-2, low-fat or fat-free for 2 and older.</li>
                    <li><strong>Older Americans Act / Meals on Wheels:</strong> age 60 and over; congregate and home-delivered meals. NO income test.</li>
                    <li><strong>TEFAP:</strong> USDA commodity foods through food banks.</li>
                </ul>
                <p><em>Exam trap:</em> SNAP is an ENTITLEMENT (everyone eligible receives it); WIC is NOT - it operates on capped appropriations.</p>
            </section>

            <section>
                <h2>2. Food Security</h2>
                <ul>
                    <li><strong>High food security</strong> &rarr; marginal &rarr; <strong>low</strong> (reduced quality and variety, intake largely maintained) &rarr; <strong>very low</strong> (disrupted eating patterns and reduced intake)</li>
                    <li><strong>Food desert:</strong> limited physical access to affordable, nutritious food</li>
                    <li><strong>Food swamp:</strong> abundant access to energy-dense, nutrient-poor options</li>
                </ul>
                <p>Screen with the validated two-item Hunger Vital Sign about worrying food would run out and food not lasting.</p>
            </section>

            <section>
                <h2>3. Population Assessment: The ABCDs</h2>
                <ul>
                    <li><strong>A</strong>nthropometric - height, weight, BMI, circumferences, growth charts</li>
                    <li><strong>B</strong>iochemical - laboratory values</li>
                    <li><strong>C</strong>linical - physical examination, medical history</li>
                    <li><strong>D</strong>ietary - 24-hour recall, food frequency questionnaire, food record</li>
                </ul>
                <h3>Dietary Assessment Methods</h3>
                <ul>
                    <li><strong>24-hour recall:</strong> quick, low burden, relies on memory; a single day does not represent usual intake</li>
                    <li><strong>Food frequency questionnaire:</strong> captures USUAL intake over time; good for ranking individuals in epidemiology; poor for absolute quantification</li>
                    <li><strong>Food record / diary:</strong> does not rely on memory, but the act of recording CHANGES behavior (reactivity)</li>
                    <li><strong>Direct observation:</strong> most accurate, most resource-intensive</li>
                </ul>
                <p><strong>NHANES</strong> combines interview and physical examination and is the primary source of US nutrition surveillance data.</p>
            </section>

            <section>
                <h2>4. Dietary Reference Intakes</h2>
                <ul>
                    <li><strong>EAR:</strong> meets the needs of 50% of the group. Used to assess GROUP adequacy and to set the RDA.</li>
                    <li><strong>RDA:</strong> meets the needs of 97-98% of individuals. Used as an INDIVIDUAL intake goal.</li>
                    <li><strong>AI:</strong> used when evidence is insufficient to set an EAR/RDA.</li>
                    <li><strong>UL:</strong> highest intake likely to pose no risk.</li>
                </ul>
                <p><em>Exam trap:</em> Use the EAR to assess the prevalence of inadequacy in a GROUP. Use the RDA as a goal for an INDIVIDUAL. Reversing these is a classic error.</p>
            </section>

            <section>
                <h2>5. Program Planning and Health Promotion</h2>
                <ul>
                    <li><strong>Primary prevention:</strong> prevent disease before it occurs - education, fortification, immunization</li>
                    <li><strong>Secondary prevention:</strong> early detection - screening</li>
                    <li><strong>Tertiary prevention:</strong> limit disability in existing disease - MNT for diabetes complications</li>
                </ul>
                <p><strong>Needs assessment</strong> precedes program design. <strong>Healthy People</strong> sets national objectives. Evaluate programs on structure, process and outcome.</p>
                <p>The <strong>Social-Ecological Model</strong> frames influences at individual, interpersonal, organizational, community and policy levels - useful when a question asks about population-level rather than individual intervention.</p>
            </section>
 `,
        questions: [
            {
                id: "q26-1",
                text: "Which statement correctly distinguishes SNAP from WIC?",
                options: ["Both are entitlement programs with identical income limits", "SNAP is an entitlement at 130% FPL; WIC is not an entitlement and serves those at 185% FPL with nutritional risk", "WIC is an entitlement; SNAP is capped", "Neither requires an income test"],
                correctAnswer: 1,
                explanation: "SNAP is an entitlement, meaning everyone who qualifies receives benefits, with eligibility generally at or below 130% of the federal poverty level. WIC operates on capped annual appropriations, so it is not an entitlement, and it requires both income at or below 185% FPL and documented nutritional risk. Both programs do apply income tests."
            },
            {
                id: "q26-2",
                text: "A public health dietitian wants to estimate the prevalence of inadequate calcium intake in a community. Which DRI value should be used?",
                options: ["RDA", "EAR", "AI", "UL"],
                correctAnswer: 1,
                explanation: "The Estimated Average Requirement is the correct reference for assessing the prevalence of inadequacy in a GROUP, because it represents the median requirement and allows estimation of what proportion falls below it. The RDA is set high enough to cover 97 to 98% of individuals and is intended as a goal for an INDIVIDUAL, so using it for group assessment overstates inadequacy. The AI is used when evidence is insufficient to establish an EAR, and the UL addresses excessive intake."
            },
            {
                id: "q26-3",
                text: "Which dietary assessment method is most subject to reactivity, where the act of measurement changes the behavior being measured?",
                options: ["24-hour recall", "Food frequency questionnaire", "Multi-day food record", "Retrospective diet history"],
                correctAnswer: 2,
                explanation: "A multi-day food record requires the participant to document intake as it happens, and that real-time recording commonly prompts people to simplify or alter what they eat, which is reactivity. Retrospective methods such as the 24-hour recall, food frequency questionnaire and diet history capture intake after the fact, so they carry recall bias but cannot change the behavior already performed."
            }
        ]
    },
    27: {
        id: 27,
        title: "Food Science Deep Dive",
        theoryTitle: "Functional Properties, Reactions, Preservation & Additives",
        theoryGoal: "Goal: Explain WHY ingredients behave as they do, which is what Domain I application questions actually test.",
        practiceTitle: "App -> Domain I (Food and Nutrition Sciences)",
        practiceGoal: "Goal: Complete 40 Domain I questions on food science and functional properties.",
        theoryContent: `
            <section>
                <h2>1. Water Activity and Preservation</h2>
                <p><strong>Water activity (aw)</strong> is free water available for microbial growth, on a 0-1.0 scale.</p>
                <ul>
                    <li>Bacteria generally need aw above <strong>0.85</strong></li>
                    <li>Yeasts above about 0.88; molds tolerate down to about 0.70</li>
                    <li>Lowering aw by drying, salting or adding sugar preserves food without heat</li>
                </ul>
                <h3>pH and Acidity</h3>
                <ul>
                    <li>Most bacteria prefer pH 4.6-7.0</li>
                    <li><strong>pH 4.6</strong> is the critical line: foods ABOVE it are low-acid and require PRESSURE canning at 250 F to destroy C. botulinum spores. Below 4.6, water bath canning suffices.</li>
                </ul>
            </section>

            <section>
                <h2>2. Protein Functionality</h2>
                <ul>
                    <li><strong>Denaturation:</strong> unfolding by heat, acid, salt or mechanical action. Irreversible; precedes coagulation.</li>
                    <li><strong>Coagulation:</strong> denatured proteins bond into a network - egg sets, custard thickens</li>
                    <li><strong>Gluten:</strong> glutenin (elasticity) plus gliadin (extensibility), formed when wheat flour is hydrated and worked. Fat SHORTENS gluten strands, producing tenderness - which is why it is called shortening. Sugar and acid also tenderize.</li>
                    <li><strong>Egg functions:</strong> emulsifier (lecithin in yolk), leavening (whipped whites), binding, thickening, coating, clarifying.</li>
                    <li><strong>Collagen &rarr; gelatin:</strong> moist heat converts tough connective tissue to gelatin, which is why braising tenderizes.</li>
                </ul>
                <p><em>Exam trap:</em> Fresh pineapple, papaya, kiwi, figs and ginger contain proteolytic enzymes that prevent gelatin from setting. Cooking or canning inactivates them.</p>
            </section>

            <section>
                <h2>3. Carbohydrate Functionality</h2>
                <ul>
                    <li><strong>Gelatinization:</strong> starch granules absorb water and swell with heat, thickening the mixture</li>
                    <li><strong>Retrogradation:</strong> on cooling, starch molecules realign and expel water (syneresis) - this is staling, and it creates resistant starch</li>
                    <li><strong>Dextrinization:</strong> dry heat browns starch, as in toasting or making a roux</li>
                    <li><strong>Waxy starches</strong> (waxy corn) resist retrogradation, so they are used for frozen products</li>
                </ul>
                <h3>The Browning Reactions</h3>
                <ul>
                    <li><strong>Maillard:</strong> amino acid + reducing sugar with heat. Bread crust, seared meat, roasted coffee. Requires PROTEIN.</li>
                    <li><strong>Caramelization:</strong> sugar alone at high heat. NO protein involved.</li>
                    <li><strong>Enzymatic browning:</strong> polyphenol oxidase on cut apples, potatoes, avocado. Prevented by acid (lemon juice), blanching, or excluding oxygen.</li>
                </ul>
            </section>

            <section>
                <h2>4. Lipid Functionality</h2>
                <ul>
                    <li><strong>Smoke point:</strong> refined oils higher, unrefined and those with free fatty acids lower. Repeated frying LOWERS it.</li>
                    <li><strong>Hydrogenation:</strong> adds hydrogen to unsaturated fat, raising melting point and creating trans fat in partial hydrogenation</li>
                    <li><strong>Rancidity:</strong> oxidative (oxygen and light attacking double bonds) or hydrolytic (water splitting off free fatty acids). Antioxidants such as BHA, BHT and tocopherols delay oxidative rancidity.</li>
                    <li><strong>Emulsions:</strong> lecithin and mono- and diglycerides stabilize oil and water. Mayonnaise is oil-in-water.</li>
                    <li><strong>Plasticity</strong> allows solid fats to be creamed, incorporating air for leavening</li>
                </ul>
            </section>

            <section>
                <h2>5. Cooking Methods and Pigments</h2>
                <ul>
                    <li><strong>Dry heat</strong> (roast, broil, saute, fry, grill) browns; best for tender cuts</li>
                    <li><strong>Moist heat</strong> (braise, stew, steam, poach, simmer) converts collagen to gelatin; best for tough cuts</li>
                </ul>
                <h3>Plant Pigments</h3>
                <ul>
                    <li><strong>Chlorophyll (green):</strong> acid turns it olive-drab; brief cooking uncovered preserves color</li>
                    <li><strong>Anthocyanin (red/purple):</strong> red in acid, blue-green in alkali</li>
                    <li><strong>Anthoxanthin (white):</strong> white in acid, yellow in alkali</li>
                    <li><strong>Carotenoid (orange/yellow):</strong> most stable to pH and heat</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q27-1",
                text: "A cook prepares a gelatin dessert with fresh pineapple and it fails to set. What is the explanation?",
                options: ["Pineapple is too acidic for gelatin to set", "Fresh pineapple contains bromelain, a proteolytic enzyme that digests the gelatin protein", "The sugar content prevents gel formation", "Pineapple has too high a water content"],
                correctAnswer: 1,
                explanation: "Fresh pineapple contains bromelain, a protease that breaks down the gelatin protein network before it can set. Papaya, kiwi, figs and ginger contain similar enzymes. Canned pineapple works because the heat of canning denatures the enzyme. Acidity, sugar and water content are not the mechanism, and gelatin sets successfully in many acidic and sweetened preparations."
            },
            {
                id: "q27-2",
                text: "Which browning reaction requires the presence of protein?",
                options: ["Caramelization", "Maillard reaction", "Enzymatic browning", "Dextrinization"],
                correctAnswer: 1,
                explanation: "The Maillard reaction occurs between an amino group from protein and a reducing sugar under heat, producing the browning and flavor of bread crust, seared meat and roasted coffee. Caramelization involves sugar alone with no protein. Enzymatic browning is driven by polyphenol oxidase acting on phenolic compounds in cut produce. Dextrinization is the dry-heat breakdown of starch."
            },
            {
                id: "q27-3",
                text: "A low-acid vegetable with a pH of 5.8 is being home canned. Which method is required for safety?",
                options: ["Boiling water bath for 30 minutes", "Pressure canning at 250 F (15 psi)", "Refrigeration after water bath processing", "Freezing after blanching"],
                correctAnswer: 1,
                explanation: "Foods with a pH above 4.6 are low-acid and can support Clostridium botulinum spore germination in the anaerobic environment of a sealed jar. Destroying those spores requires 250 degrees Fahrenheit, achievable only with pressure canning at 15 psi. A boiling water bath reaches only 212 F and is insufficient. Refrigeration or freezing are valid preservation methods but do not make water bath canning of a low-acid food safe."
            }
        ]
    },
    28: {
        id: 28,
        title: "Nutrient Metabolism Deep Dive",
        theoryTitle: "Macronutrient Metabolism, Micronutrient Interactions & Deficiencies",
        theoryGoal: "Goal: Connect biochemical pathways to the clinical signs that exam questions describe.",
        practiceTitle: "App -> Domain I (Food and Nutrition Sciences)",
        practiceGoal: "Goal: Complete 40 Domain I questions on metabolism, vitamins and minerals.",
        theoryContent: `
            <section>
                <h2>1. Energy Yields and Metabolic Basics</h2>
                <ul>
                    <li>Carbohydrate 4 kcal/g &nbsp;|&nbsp; Protein 4 &nbsp;|&nbsp; Fat 9 &nbsp;|&nbsp; Alcohol 7 &nbsp;|&nbsp; <strong>Dextrose monohydrate 3.4</strong></li>
                    <li><strong>Respiratory quotient:</strong> carbohydrate 1.0, protein 0.8, fat 0.7, mixed 0.85. Above 1.0 means lipogenesis from overfeeding.</li>
                    <li><strong>Thermic effect of food:</strong> about 10% of intake; protein highest at 20-30%</li>
                </ul>
                <h3>Fed vs Fasted</h3>
                <p>Fed state: insulin drives glycogenesis, lipogenesis and protein synthesis. Fasting: glucagon drives glycogenolysis (hours), then gluconeogenesis, then ketogenesis as fat becomes the dominant fuel. Glycogen stores last roughly 24 hours.</p>
                <p>The brain normally requires glucose but adapts to ketones during prolonged fasting, which spares muscle protein.</p>
            </section>

            <section>
                <h2>2. Protein Quality and Nitrogen</h2>
                <ul>
                    <li><strong>Complete proteins</strong> supply all nine indispensable amino acids: animal sources, soy, quinoa</li>
                    <li><strong>Limiting amino acid:</strong> lysine in grains, methionine in legumes - which is why they complement each other</li>
                    <li><strong>PDCAAS and DIAAS</strong> score protein quality; DIAAS is the newer, more precise method</li>
                    <li><strong>Nitrogen balance</strong> = (protein intake g / 6.25) - (UUN + 4). Positive in growth and recovery; negative in catabolic stress.</li>
                </ul>
            </section>

            <section>
                <h2>3. Fat-Soluble Vitamins</h2>
                <ul>
                    <li><strong>A:</strong> vision, immunity, epithelium. Deficiency: night blindness, xerophthalmia, Bitot spots. Toxicity: teratogenic, hepatotoxic, raised intracranial pressure.</li>
                    <li><strong>D:</strong> calcium absorption. Deficiency: rickets in children, osteomalacia in adults. Activated by the kidney (1-alpha hydroxylation) - which fails in CKD.</li>
                    <li><strong>E:</strong> antioxidant. Deficiency: hemolytic anemia, neuropathy. High doses may interfere with vitamin K and anticoagulation.</li>
                    <li><strong>K:</strong> clotting factors II, VII, IX, X. Interacts with <strong>warfarin</strong> - the counseling point is CONSISTENCY of intake, not avoidance of greens.</li>
                </ul>
            </section>

            <section>
                <h2>4. Water-Soluble Vitamins</h2>
                <ul>
                    <li><strong>B1 thiamine:</strong> beriberi (wet = cardiac, dry = neurologic); Wernicke-Korsakoff in alcohol use disorder. <strong>Give thiamine BEFORE glucose.</strong></li>
                    <li><strong>B2 riboflavin:</strong> cheilosis, angular stomatitis, magenta tongue. Destroyed by LIGHT.</li>
                    <li><strong>B3 niacin:</strong> pellagra - the 4 Ds: dermatitis, diarrhea, dementia, death. Made from tryptophan.</li>
                    <li><strong>B6 pyridoxine:</strong> transamination. Isoniazid induces deficiency. Toxicity causes sensory neuropathy.</li>
                    <li><strong>B9 folate:</strong> neural tube defects; megaloblastic anemia WITHOUT neurologic signs.</li>
                    <li><strong>B12:</strong> requires intrinsic factor, absorbed in the terminal ileum. Megaloblastic anemia WITH neurologic signs. Depleted by metformin, proton pump inhibitors, gastric bypass, ileal disease.</li>
                    <li><strong>C:</strong> collagen hydroxylation. Scurvy - bleeding gums, poor healing, perifollicular hemorrhage. Enhances non-heme iron absorption.</li>
                </ul>
                <p><em>Exam trap:</em> Folate corrects the ANEMIA of B12 deficiency while the neurologic damage progresses. Always confirm B12 status before treating megaloblastic anemia with folate.</p>
            </section>

            <section>
                <h2>5. Minerals and Interactions</h2>
                <ul>
                    <li><strong>Iron:</strong> heme (animal, well absorbed) vs non-heme (plant, enhanced by vitamin C and meat factor; inhibited by phytate, tannins, calcium). Deficiency causes microcytic hypochromic anemia.</li>
                    <li><strong>Zinc:</strong> taste, immunity, wound healing. High-dose zinc induces <strong>COPPER deficiency</strong>.</li>
                    <li><strong>Copper:</strong> deficiency causes microcytic anemia WITH neutropenia and low ceruloplasmin.</li>
                    <li><strong>Calcium and iron</strong> compete - separate supplements.</li>
                    <li><strong>Selenium:</strong> deficiency causes cardiomyopathy (Keshan disease).</li>
                    <li><strong>Iodine:</strong> goiter, cretinism.</li>
                    <li><strong>Magnesium:</strong> deficiency causes refractory hypokalemia and hypocalcemia - you must correct magnesium first.</li>
                </ul>
            </section>
 `,
        questions: [
            {
                id: "q28-1",
                text: "A patient with megaloblastic anemia is treated with folic acid alone. Six weeks later the anemia has resolved but he has developed numbness and gait instability. What happened?",
                options: ["Folic acid caused peripheral neuropathy directly", "An underlying B12 deficiency was masked; folate corrected the anemia while neurologic damage progressed", "The dose of folic acid was too low", "This represents an unrelated condition"],
                correctAnswer: 1,
                explanation: "Folate corrects the hematologic manifestation of vitamin B12 deficiency without addressing the neurologic damage, which continues and may become irreversible. This is why B12 status must be confirmed before treating megaloblastic anemia with folate alone. Folic acid does not cause neuropathy directly, and the resolving anemia shows the dose was adequate for the hematologic effect."
            },
            {
                id: "q28-2",
                text: "A patient on warfarin asks about eating spinach and kale. What is the appropriate counseling?",
                options: ["Avoid all vitamin K-containing foods completely", "Keep vitamin K intake CONSISTENT from day to day rather than avoiding these foods", "Double the intake of green vegetables to counteract the medication", "Take a high-dose vitamin K supplement daily"],
                correctAnswer: 1,
                explanation: "Warfarin works by antagonizing vitamin K-dependent clotting factors, and the dose is titrated to the patient's habitual vitamin K intake. What destabilizes the INR is VARIABILITY, so the counseling point is consistency rather than avoidance. Eliminating these foods removes valuable nutrients and can itself require dose adjustment. Deliberately increasing or supplementing vitamin K would counteract the anticoagulation and raise clotting risk."
            },
            {
                id: "q28-3",
                text: "A patient with persistent hypokalemia does not respond to repeated potassium repletion. Which electrolyte should be checked and corrected?",
                options: ["Magnesium", "Chloride", "Phosphorus", "Calcium"],
                correctAnswer: 0,
                explanation: "Hypomagnesemia causes renal potassium wasting and makes hypokalemia refractory to replacement, so magnesium must be corrected before potassium repletion will hold. Magnesium deficiency also produces resistant hypocalcemia through impaired parathyroid hormone release. Chloride, phosphorus and calcium abnormalities do not create this specific pattern of potassium repletion failure."
            }
        ]
    },
    29: {
        id: 29,
        title: "Targeted Weakness Review",
        theoryTitle: "Data-Driven Review of Your Own Error Log",
        theoryGoal: "Goal: Stop studying what you already know. Let your own error data decide today's content.",
        practiceTitle: "App -> Daily Review + your weakest domain",
        practiceGoal: "Goal: Clear the entire spaced repetition queue, then drill 40 questions in your weakest domain from the Stats page.",
        theoryContent: `
            <section>
                <h2>1. Today Is Different</h2>
                <p>Every other day in this plan told you what to study. Today your own data decides. By now the app holds a record of every question you missed, why you missed it, and how you perform by domain.</p>
                <p><strong>Work in this order:</strong></p>
                <ol>
                    <li>Open <strong>Stats</strong>. Note your accuracy and the Domain Performance ranking, which lists your weakest domain first.</li>
                    <li>Clear the entire <strong>Daily Review</strong> queue. Do not skip overdue items - those are the ones you have failed more than once.</li>
                    <li>Drill 40 questions in your weakest domain using the Modules page.</li>
                    <li>Re-read the Study Guide for that domain, focusing on the exam trap callouts.</li>
                </ol>
            </section>

            <section>
                <h2>2. Diagnose the TYPE of Error</h2>
                <p>When you logged each miss you chose a reason. Those categories call for different fixes, and treating them all the same is why people plateau.</p>
                <ul>
                    <li><strong>Concept gap</strong> - you did not know the material. Fix: go back to the source content, not more questions. Questions test knowledge; they do not build it.</li>
                    <li><strong>Misread the question</strong> - you knew it but answered a different question. Fix: read the LAST line first, then circle the qualifier (BEST, FIRST, INITIAL, MOST APPROPRIATE).</li>
                    <li><strong>Confused options</strong> - two answers looked equally right. Fix: this is almost always a pair you have not fully separated. Write the distinction out in one sentence.</li>
                    <li><strong>Guessed</strong> - even when correct, this is a gap. Correct-but-unsure is tracked separately in the app for exactly this reason.</li>
                </ul>
                <p>If more than about a third of your misses are "misread," your problem is test-taking process, not knowledge, and more content review will not fix it.</p>
            </section>

            <section>
                <h2>3. The Pairs That Generate Most Confusion</h2>
                <p>If "confused options" dominates your log, start here.</p>
                <ul>
                    <li><strong>Participative vs consensus</strong> - manager decides after input, vs unanimous agreement required</li>
                    <li><strong>Ready-prepared vs commissary</strong> - separated in TIME vs separated in LOCATION</li>
                    <li><strong>Broker vs wholesaler</strong> - never takes title vs owns inventory</li>
                    <li><strong>EAR vs RDA</strong> - group assessment vs individual goal</li>
                    <li><strong>Cerebral salt wasting vs SIADH</strong> - volume depleted (give salt) vs euvolemic (restrict fluid)</li>
                    <li><strong>Early vs late dumping</strong> - 10-30 min osmotic vs 1-3 h reactive hypoglycemia</li>
                    <li><strong>Addison vs Cushing</strong> - sodium and potassium move in opposite directions</li>
                    <li><strong>Folate vs B12 deficiency</strong> - both megaloblastic; only B12 has neurologic signs</li>
                    <li><strong>Sensitivity vs specificity</strong> - finds true cases vs excludes true negatives</li>
                    <li><strong>Pareto vs fishbone</strong> - WHICH problem vs WHY it happens</li>
                </ul>
            </section>

            <section>
                <h2>4. Protein Prescription Master List</h2>
                <p>More exam questions turn on a protein number than on any other single value. Recite this list until it is automatic.</p>
                <ul>
                    <li>Healthy adult RDA <strong>0.8</strong> &nbsp;|&nbsp; Older adult <strong>1.0-1.2</strong></li>
                    <li>CKD no dialysis <strong>0.55-0.6</strong> &nbsp;|&nbsp; Hemodialysis <strong>1.0-1.2</strong> &nbsp;|&nbsp; Peritoneal <strong>1.2-1.3</strong> &nbsp;|&nbsp; AKI on CRRT <strong>1.5-2.0</strong></li>
                    <li>Cirrhosis <strong>1.2-1.5</strong> (never restrict for encephalopathy)</li>
                    <li>Critical illness <strong>1.2-2.0</strong> &nbsp;|&nbsp; Burns <strong>1.5-2.0</strong> &nbsp;|&nbsp; TBI <strong>1.5-2.5</strong></li>
                    <li>Pressure injury <strong>1.25-1.5</strong> &nbsp;|&nbsp; Cancer <strong>1.0-1.5</strong> &nbsp;|&nbsp; HIV <strong>1.0-1.4</strong></li>
                    <li>Pregnancy and lactation <strong>1.1</strong> &nbsp;|&nbsp; Post bariatric <strong>60-80 g minimum</strong></li>
                </ul>
            </section>

            <section>
                <h2>5. Close Today Deliberately</h2>
                <p>Before you stop, write down the three topics you were least confident about today. Those three go into tomorrow's warm-up, before the final mock exam.</p>
                <p>Do not end on a run of missed questions. Finish with a short set in a domain you perform well in, so the last thing you rehearse is retrieval that succeeds.</p>
            </section>
 `,
        questions: [
            {
                id: "q29-1",
                text: "A student's error log shows that 40% of missed questions were marked misread the question rather than concept gap. What is the most appropriate response?",
                options: ["Increase daily content review hours", "Work on test-taking process: read the final line first and identify the qualifier before evaluating options", "Switch to a different question bank", "Accept it as normal test anxiety"],
                correctAnswer: 1,
                explanation: "A high proportion of misread errors indicates a process problem rather than a knowledge problem, so additional content review will not address the cause. The fix is a deliberate reading protocol: locate the actual question in the final line, identify the qualifier such as BEST or FIRST, and only then evaluate options. Changing question banks does not alter how the student reads, and dismissing the pattern forfeits the most correctable source of lost points."
            },
            {
                id: "q29-2",
                text: "Which pairing correctly distinguishes cerebral salt wasting from SIADH?",
                options: ["Both are treated with fluid restriction", "Cerebral salt wasting is volume depleted and treated with salt and volume replacement; SIADH is euvolemic and treated with fluid restriction", "SIADH causes hypernatremia; cerebral salt wasting causes hyponatremia", "Both are treated with hypertonic saline in all cases"],
                correctAnswer: 1,
                explanation: "Both conditions produce hyponatremia, and volume status is what separates them. Cerebral salt wasting involves true volume depletion with high urine output and is treated by replacing salt and volume, whereas SIADH occurs in a euvolemic or mildly hypervolemic patient and is treated by restricting fluid. Applying the wrong treatment worsens the patient, which is why this pair is so heavily tested."
            }
        ]
    },
    30: {
        id: 30,
        title: "Final Integration & Full Mock Exam",
        theoryTitle: "Full-Length Timed Assessment & Exam-Day Readiness",
        theoryGoal: "Goal: Simulate exam conditions end to end, then convert the result into a final week action plan.",
        practiceTitle: "App -> Mock Exam (145 questions, blueprint weighted)",
        practiceGoal: "Goal: Complete a full timed mock exam, review every miss, and build a focused plan for the remaining days.",
        theoryContent: `
            <section>
                <h2>1. Today's Protocol</h2>
                <ol>
                    <li>Take the full <strong>145-question mock exam</strong> in one sitting, timed, no notes, no phone.</li>
                    <li>Do not review anything until the whole exam is finished.</li>
                    <li>Review every missed item and log the reason.</li>
                    <li>Compare your Domain Performance to where you were on Day 10.</li>
                </ol>
                <p>Take it at the same time of day your real exam is scheduled. Your body learns to be alert on a schedule, and this is a free advantage.</p>
            </section>

            <section>
                <h2>2. Interpreting Your Result</h2>
                <p>The mock is blueprint-weighted (21/45/21/13), so the domain breakdown is meaningful rather than a random sample. Read it this way:</p>
                <ul>
                    <li><strong>Consistently 75-80% or above across domains:</strong> you are in a strong position. Shift to maintenance - daily review queue plus light drilling.</li>
                    <li><strong>One domain well below the others:</strong> that is your final week. A weak Domain II costs the most, since it is 45% of the exam.</li>
                    <li><strong>Even performance in the 60s:</strong> breadth is the issue, not one topic. Prioritize the highest-yield material: protein prescriptions, temperatures, calculations, and the confusion pairs.</li>
                </ul>
                <p>Remember the scoring: CDR uses a scaled score with <strong>25</strong> as passing on a 1-50 scale, and the exam is adaptive, delivering 125-145 questions. Raw percentage from any practice bank is an approximation, not a prediction.</p>
            </section>

            <section>
                <h2>3. The Highest-Yield Facts, One Last Time</h2>
                <h3>Temperatures</h3>
                <p>Danger zone 41-135 F. Cooling 135&rarr;70 in 2 h, 70&rarr;41 in 4 more. Poultry and all reheating 165. Ground 155. Whole muscle 145. Hot hold above 135, cold hold at or below 41. C. botulinum spores 250 F at 15 psi.</p>
                <h3>Calculations</h3>
                <p>Dextrose 3.4 kcal/g. 20% lipid 2.0 kcal/mL. 1 CHO choice 15 g. GIR max 4-5 mg/kg/min. PPN max 900 mOsm/L. FTE = (positions x hours x days)/40. Depreciation = (cost - salvage)/life. Break-even = fixed costs / contribution margin. Conversion factor = desired/original yield. AP = EP / yield %.</p>
                <h3>Reversals That Trap People</h3>
                <ul>
                    <li>Dialysis INCREASES protein needs</li>
                    <li>Cirrhosis does NOT get protein restriction</li>
                    <li>Chronic spinal cord injury has REDUCED energy needs</li>
                    <li>Low calcium diets INCREASE oxalate stone risk</li>
                    <li>Purine-rich VEGETABLES do not raise gout risk</li>
                    <li>Neutropenic diets are not supported; use food safety instead</li>
                    <li>Albumin is NOT a malnutrition criterion</li>
                    <li>Nuts and seeds are not restricted in diverticular disease</li>
                    <li>Early allergen introduction REDUCES allergy risk</li>
                </ul>
            </section>

            <section>
                <h2>4. Exam Day Logistics</h2>
                <ul>
                    <li>Bring two forms of ID; confirm the testing center address the day before</li>
                    <li>Eat a normal meal with protein and complex carbohydrate - do not experiment with anything new</li>
                    <li>Moderate caffeine, matching your usual amount; both excess and withdrawal impair performance</li>
                    <li>Arrive early enough that traffic cannot affect you</li>
                    <li>Sleep matters more than one final cramming session. Stop studying the night before.</li>
                </ul>
                <h3>During the Exam</h3>
                <ul>
                    <li>You CANNOT go back. Commit to each answer and move on.</li>
                    <li>You have 3 hours for up to 145 questions, about 74 seconds each, and you must answer at least 125 before time runs out, which means averaging under 86 seconds. If a question passes about 90 seconds, choose your best option and move on.</li>
                    <li>Answer every question. There is no penalty for a wrong answer.</li>
                    <li>Adaptive tests are designed to feel hard. Difficulty rising is a sign you are performing WELL, not failing.</li>
                    <li>Do not try to track your score as you go. It is not possible and it costs you attention.</li>
                </ul>
            </section>

            <section>
                <h2>5. After Today</h2>
                <p>Whatever days remain before your exam, structure them like this rather than adding new material:</p>
                <ul>
                    <li><strong>Daily:</strong> clear the spaced repetition queue. This is non-negotiable and it is the single highest-return habit in the app.</li>
                    <li><strong>Most days:</strong> 30-40 questions in your weakest domain.</li>
                    <li><strong>Twice more:</strong> a full timed mock, ideally one week apart.</li>
                    <li><strong>Final 48 hours:</strong> review only your own error log and the exam trap callouts. Learn no new topics.</li>
                </ul>
                <p>You have worked through the whole blueprint. The remaining gain is in retrieval and consistency, not in new content.</p>
            </section>
 `,
        questions: [
            {
                id: "q30-1",
                text: "During an adaptive exam, a candidate notices the questions feel progressively harder. What does this most likely indicate?",
                options: ["The candidate is failing and the exam is compensating", "The candidate is answering correctly, so the algorithm is presenting harder items", "The exam has malfunctioned", "The candidate should slow down substantially"],
                correctAnswer: 1,
                explanation: "A computer adaptive test raises item difficulty after correct responses in order to locate the candidate's ability level precisely, so increasing difficulty generally signals good performance. Interpreting it as failure creates anxiety that harms the rest of the exam. It is not a malfunction, and slowing down substantially risks running out of time without improving accuracy."
            },
            {
                id: "q30-2",
                text: "A candidate scores 78% on Domains I, III and IV but 61% on Domain II with two weeks remaining. How should the final two weeks be prioritized?",
                options: ["Review all four domains equally to maintain balance", "Concentrate on Domain II, since it represents 45% of the exam and is the weakest area", "Focus on Domain IV, since it has the fewest questions to master", "Stop practicing and rest to avoid burnout"],
                correctAnswer: 1,
                explanation: "Domain II carries 45% of the exam weight, so a 17-point deficit there costs far more scaled points than the same deficit in any other domain. Concentrating remaining effort where weight and weakness intersect produces the largest gain. Equal review ignores that weighting, Domain IV is both the smallest domain and already strong, and stopping entirely forfeits two weeks of available improvement."
            }
        ]
    }
};
