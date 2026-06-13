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
        theoryGoal: "Goal: Expert application of Medical Nutrition Therapy (MNT) for complex endocrine and cardiovascular conditions, focusing on carbohydrate counting and lipid management.",
        practiceTitle: "App -> Domain 3",
        practiceGoal: "Goal: Solve 30 clinical case studies focusing on glycemic control, DASH diet implementation, and lipid profile analysis.",
        theoryContent: `
            <section>
                <h2>1. Diabetes Mellitus (DM): Diagnosis and MNT</h2>
                <p>Diabetes is a group of metabolic diseases characterized by hyperglycemia. MNT is the cornerstone of management.</p>
                <h3>Diagnostic Criteria</h3>
                <ul>
                    <li><strong>Fasting Plasma Glucose (FPG):</strong> ≥ 126 mg/dL.</li>
                    <li><strong>Hemoglobin A1c:</strong> ≥ 6.5%. (Pre-diabetes: 5.7% - 6.4%).</li>
                </ul>
            </section>
        `,
        questions: [
            {
                id: "q3-1",
                text: "A patient with Type 2 Diabetes is taught CHO counting. They plan to eat 1 cup of cooked pasta and 1 medium apple. How many CHO choices is this?",
                options: ["2", "3", "4", "5"],
                correctAnswer: 2,
                explanation: "1/3 cup cooked pasta = 1 choice (15g). 1 cup = 3 choices. 1 medium apple = 1 choice. Total = 4 choices (approx. 60g CHO)."
            }
        ]
    },
    4: {
        id: 4,
        title: "Clinical II - Renal & Critical Care",
        theoryTitle: "CKD Stages and Stress Metabolism",
        theoryGoal: "Goal: Master the complexities of renal nutrition across all CKD stages and the metabolic response to critical illness (Ebb & Flow phases).",
        practiceTitle: "App -> Domain 3",
        practiceGoal: "Goal: Complete 30 questions on GFR-based protein adjustments, electrolyte management in renal failure, and refeeding syndrome prevention.",
        theoryContent: `
            <section>
                <h2>1. Chronic Kidney Disease (CKD): MNT by Stage</h2>
                <p>Renal MNT is one of the most complex topics on the exam. Focus on GFR and protein/electrolyte adjustments.</p>
            </section>
        `,
        questions: []
    },
    5: {
        id: 5,
        title: "Nutrition Support",
        theoryTitle: "EN and PN Formulas & Calculations",
        theoryGoal: "Goal: High-precision calculation of enteral and parenteral nutrition requirements, including dextrose oxidation rates and lipid infusion strategies.",
        practiceTitle: "App -> Domain 3 (Calculations)",
        practiceGoal: "Goal: Perform 20 complex calculations for TPN orders, EN tube feeding rates, and free water deficit adjustments.",
        theoryContent: `
            <section>
                <h2>1. Enteral Nutrition (EN)</h2>
                <p><strong>"If the gut works, use it."</strong> EN is preferred over PN to maintain gut integrity and prevent bacterial translocation.</p>
            </section>
        `,
        questions: []
    },
    6: {
        id: 6,
        title: "Food Service Systems",
        theoryTitle: "Management & Production Flow",
        theoryGoal: "Goal: Evaluate various foodservice delivery systems, procurement strategies, and inventory management techniques (ABC analysis) for efficiency.",
        practiceTitle: "App -> Domain 4",
        practiceGoal: "Goal: Master 50 questions regarding inventory turnover ratios, production flow patterns, and food safety management.",
        theoryContent: `
            <section>
                <h2>1. Foodservice Systems</h2>
            </section>
        `,
        questions: []
    },
    7: {
        id: 7,
        title: "Leadership & HR",
        theoryTitle: "Management Theories & Styles",
        theoryGoal: "Goal: Synthesize leadership theories (Theory X/Y, Herzberg) and human resource regulations to effectively manage nutrition departments.",
        practiceTitle: "App -> Domain 4",
        practiceGoal: "Goal: Complete 50 questions on labor laws (FLSA, FMLA, ADA) and organizational behavior management strategies.",
        theoryContent: `
            <section>
                <h2>1. Traditional Management vs. Modern Leadership</h2>
            </section>
        `,
        questions: []
    },
    8: {
        id: 8,
        title: "Counseling & Behavioral Science",
        theoryTitle: "Theories of Change & MI",
        theoryGoal: "Goal: Master patient-centered counseling techniques, specifically the Transtheoretical Model and Motivational Interviewing (OARS) skills.",
        practiceTitle: "App -> Domain 2",
        practiceGoal: "Goal: Apply counseling stages to 40 patient scripts and scenarios to identify readiness for change.",
        theoryContent: `
            <section>
                <h2>1. Transtheoretical Model (Stages of Change)</h2>
            </section>
        `,
        questions: []
    },
    9: {
        id: 9,
        title: "Research & Statistical Analysis",
        theoryTitle: "Study Designs & Descriptive Stats",
        theoryGoal: "Goal: Critically appraise research methodologies, from Randomized Controlled Trials (RCTs) to longitudinal cohorts and statistical significance.",
        practiceTitle: "App -> Domain 1",
        practiceGoal: "Goal: Solve 30 questions on p-values, confidence intervals, and research design selection for nutrition studies.",
        theoryContent: `
            <section>
                <h2>1. Types of Research Designs</h2>
            </section>
        `,
        questions: []
    },
    10: {
        id: 10,
        title: "Final Review & Master Assessment",
        theoryTitle: "Exam Strategy & Deep Recall",
        theoryGoal: "Goal: Strategic preparation for the Computer Adaptive Test (CAT) format, focusing on domain weighting and ADIME critical thinking.",
        practiceTitle: "App -> General Simulation",
        practiceGoal: "Goal: Complete the 60-question Master Mini-Simulation to verify readiness across all RDN exam domains.",
        theoryContent: `
            <section>
                <h2>1. The RDN Exam Structure</h2>
            </section>
        `,
        questions: []
    }
};
