type Block =
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "trap"; text: string }
  | { type: "key"; text: string }
  | { type: "subtitle"; text: string }
  | { type: "text"; text: string }
  | { type: "bullet"; items: string[] };

type Section = { title: string; color: string; content: Block[] };

const sections: Section[] = [
  {
    title: "Domain Overview",
    color: "#375623",
    content: [
      { type: "table", headers: ["Topic Area", "Key Subtopics", "Exam Weight"],
        rows: [
          ["Management Functions", "POSDC: Planning, Organizing, Staffing, Directing, Controlling", "High"],
          ["Leadership & Decision Making", "Styles, HBL model, Theory X/Y/Z, Mintzberg roles", "High"],
          ["Human Resources", "Employment laws, hiring, interviewing, performance, discipline", "High"],
          ["Financial Management", "Budget types, depreciation, break-even, food cost, FTE", "High"],
          ["Quality Improvement", "PDCA, TQM, Lean, Six Sigma, FOCUS-PDSA, accreditation", "Medium"],
          ["Marketing & Strategic Planning", "4 Ps, SWOT, VALS, segmentation, Delphi method", "Medium"],
          ["Systems Theory", "Inputs/outputs/transformation, feedback, equifinality, subsystems", "Medium"],
          ["Organizational Behavior", "Motivation theories, Maslow, communication, conflict", "Medium"],
          ["Cultural Competence", "ETHNIC, LEARN, BATHE, GREET, Campinha-Bacote model", "Medium"],
          ["Federal Nutrition Programs", "SNAP, WIC, NSLP, CACFP, Meals on Wheels, TEFAP", "Medium"],
        ]},
    ]
  },
  {
    title: "SECTION 1: MANAGEMENT FUNCTIONS (POSDC)",
    color: "#375623",
    content: [
      { type: "text", text: "The five functions of management describe what managers DO. Every management activity falls into one of these functions." },
      { type: "table", headers: ["Function", "Definition", "RDN Examples", "Key Tools"],
        rows: [
          ["Planning", "Setting goals and determining best course of action; deciding WHAT, HOW, WHEN, and WHO", "Annual budget development; policy writing; menu planning; disaster preparedness plan; strategic goals", "SWOT analysis; MBO; standing plans vs single-use plans; mission/vision/goals"],
          ["Organizing", "Arranging resources and establishing relationships to achieve goals; creating structure", "Organizational charts; scheduling; assigning duties; allocating equipment; workflow design; reporting relationships", "Span of control; centralized vs decentralized; line vs staff authority; delegation"],
          ["Staffing", "Recruiting, selecting, training, and developing human resources", "Writing job descriptions; interviewing; onboarding; FTE calculation; performance evaluations; succession planning", "Job description vs specification; FTE formula; orientation vs training; progressive discipline"],
          ["Directing (Leading)", "Guiding, supervising, and motivating staff to accomplish goals", "Giving feedback; delegating tasks; resolving conflict; coaching; running department meetings", "Leadership styles; motivation theories; communication; delegation; conflict resolution"],
          ["Controlling", "Monitoring performance vs standards and taking corrective action when off-track", "Comparing actual vs budgeted food cost; plate waste audits; patient satisfaction review; meal temperature checks; QI metrics", "Performance standards; variance analysis; quality indicators; benchmarking; corrective action plans"],
        ]},
      { type: "trap", text: "CONTROLLING is often confused with PLANNING. Planning SETS the standard; Controlling MEASURES performance AGAINST that standard and corrects deviations. 'Comparing actual food cost to budget and adjusting' = Controlling." },
    ]
  },
  {
    title: "SECTION 2: LEADERSHIP STYLES & THEORIES",
    color: "#375623",
    content: [
      { type: "subtitle", text: "2.1 Leadership Styles" },
      { type: "table", headers: ["Style", "Decision Making", "Best Used When", "Limitation", "Exam Scenario"],
        rows: [
          ["Autocratic (Authoritarian)", "Manager decides alone; top-down; no staff input", "Emergency situations; new/unskilled staff; time pressure; high-stakes decisions", "Reduces creativity; lowers morale; causes resentment in skilled staff", "Manager makes all scheduling decisions without consulting staff"],
          ["Democratic (Participative)", "Manager involves staff in discussion; considers input; manager makes FINAL decision", "Experienced staff; complex problems; when buy-in improves implementation", "Time-consuming; can create confusion about final authority", "Manager held team meeting about new menu, then made the final decision"],
          ["Consensus", "Group must reach UNANIMOUS agreement before any decision is made", "High-stakes decisions requiring complete team commitment", "Very time-consuming; paralyzed if one person disagrees", "Manager sought unanimous agreement from staff before deciding weekend coverage"],
          ["Laissez-faire (Free-rein)", "Minimal direction; staff self-direct with maximum autonomy", "Highly skilled, experienced, self-motivated professionals; research settings", "Chaos with unskilled staff; accountability diffusion", "Manager gave team project goals and let them figure out how to achieve them"],
          ["Transformational", "Inspires through vision and charisma; motivates beyond self-interest", "Culture change; organizational transformation; motivating during difficult periods", "Dependent on charisma; not effective for routine supervision", "New CNM shared inspiring vision for nutrition services that energized the whole team"],
          ["Transactional", "Uses rewards and punishments based on performance outcomes", "Routine tasks; clear performance standards; short-term goals", "Does not inspire innovation; purely extrinsic motivation", "Manager offered bonuses for meeting targets and discipline for missing them"],
        ]},
      { type: "trap", text: "PARTICIPATIVE does NOT equal CONSENSUS. Participative = staff involved in discussion, manager decides. Consensus = ALL must agree before any decision. This is the most common exam trap in leadership." },
      { type: "subtitle", text: "2.2 Hersey-Blanchard Situational Leadership (HBL)" },
      { type: "table", headers: ["Maturity", "Competence", "Willingness", "Style", "Approach"],
        rows: [
          ["M1 — Low", "Low ability", "High willingness (eager)", "S1 — Telling/Directing", "High task, low relationship; step-by-step instructions; close supervision"],
          ["M2 — Low-Moderate", "Low-moderate ability", "Low willingness (discouraged)", "S2 — Selling/Coaching", "High task AND high relationship; explain WHY and HOW; supportive and directive simultaneously"],
          ["M3 — Moderate-High", "High ability", "Variable willingness (lacks confidence)", "S3 — Participating/Supporting", "Low task, high relationship; involve in decisions; encourage; build confidence"],
          ["M4 — High", "High ability", "High willingness (confident)", "S4 — Delegating", "Low task AND low relationship; give task, step back; periodic check-ins only"],
        ]},
      { type: "subtitle", text: "2.3 Management Theories" },
      { type: "table", headers: ["Theory", "Assumptions", "Management Approach", "Theorist"],
        rows: [
          ["Theory X", "Workers are lazy; dislike work; must be coerced and controlled; motivated only by money", "Authoritarian; micromanagement; tight control; centralized; close supervision", "McGregor (1960)"],
          ["Theory Y", "Workers are naturally motivated; seek responsibility; self-direction possible when committed", "Participative; decentralized; MBO; delegate; involve in decisions; trust and empower", "McGregor (1960)"],
          ["Theory Z", "Employees motivated by belonging; loyalty; collective decisions; holistic concern for well-being", "Japanese-style; consensus decisions; lifetime employment; cross-functional careers; strong culture", "Ouchi (1981)"],
          ["Maslow's Hierarchy", "5-level needs pyramid; lower needs must be met before higher needs motivate", "Physiological -> Safety -> Social -> Esteem -> Self-actualization; D-needs vs B-needs", "Maslow (1943)"],
          ["Herzberg Two-Factor", "Hygiene factors (salary, conditions) prevent dissatisfaction but do NOT motivate; Motivators (achievement, recognition, growth) create satisfaction", "Ensure hygiene factors adequate; then focus on motivators (job content) for true motivation", "Herzberg (1959)"],
          ["Scientific Management", "Time-and-motion studies; one best way; standardize work; financial incentives drive performance", "Task analysis; efficiency; piece-rate pay; rigid procedure adherence; motion economy principles", "Taylor (1911)"],
        ]},
      { type: "subtitle", text: "2.4 Mintzberg's 10 Managerial Roles" },
      { type: "table", headers: ["Category", "Role", "Definition", "Example"],
        rows: [
          ["Interpersonal", "Figurehead", "Symbolic head; ceremonial duties", "CNM attends hospital gala, represents nutrition dept"],
          ["Interpersonal", "Leader", "Motivating, hiring, training, directing subordinates", "CNM conducts performance reviews; coaches struggling staff"],
          ["Interpersonal", "Liaison", "Maintains external network outside vertical chain", "CNM coordinates with pharmacy, nursing on interdisciplinary committee"],
          ["Informational", "Monitor", "Scans environment for information; tracks developments", "CNM reviews patient satisfaction data and industry publications"],
          ["Informational", "Disseminator", "Transmits information to subordinates inside org", "CNM shares new ASPEN guidelines with clinical dietitian team"],
          ["Informational", "Spokesperson", "Represents org to outsiders; transmits info externally", "CNM presents department quality data to hospital board"],
          ["Decisional", "Entrepreneur", "Initiates change; seeks improvement opportunities", "CNM proposes new malnutrition screening protocol hospital-wide"],
          ["Decisional", "Disturbance Handler", "Responds to unexpected crises and conflicts", "CNM addresses conflict between dietitian and nursing staff"],
          ["Decisional", "Resource Allocator", "Decides who gets what resources", "CNM allocates new FTEs and equipment budget across teams"],
          ["Decisional", "Negotiator", "Represents org in negotiations with others", "CNM negotiates contract terms with new food vendor"],
        ]},
    ]
  },
  {
    title: "SECTION 3: HUMAN RESOURCES & EMPLOYMENT LAW",
    color: "#375623",
    content: [
      { type: "subtitle", text: "3.1 Employment Laws" },
      { type: "table", headers: ["Law", "Year", "Coverage", "Key Provision", "RDN Application"],
        rows: [
          ["Civil Rights Act Title VII", "1964", "Race, color, religion, sex, national origin", "Applies to 15+ employees; established EEOC; covers hiring, firing, pay, promotion, training", "Cannot make employment decisions based on any protected characteristic"],
          ["ADA (Americans with Disabilities Act)", "1990", "Qualified individuals with physical or mental disabilities", "Must provide reasonable accommodation unless undue hardship; interactive process required", "Transferring someone due to disability = ADA violation; must attempt accommodation first"],
          ["FLSA (Fair Labor Standards Act)", "1938", "Minimum wage, overtime, child labor, recordkeeping", "Non-exempt employees: 1.5x pay for hours >40/week; exempt (managers, professionals) = no overtime", "RDNs as professionals may be exempt; hourly foodservice workers are non-exempt"],
          ["ADEA (Age Discrimination)", "1967", "Workers 40+ years old", "Applies to 20+ employees; age cannot factor into hiring, promotion, termination", "Cannot ask age during interview; cannot force retirement based on age"],
          ["Equal Pay Act", "1963", "Pay equality by sex for equal work", "Same job, same establishment must pay equally; seniority/merit exceptions allowed", "Male and female RDNs in same role must receive equal pay"],
          ["OSHA", "1970", "Workplace safety and health", "Maintain safe environment; report fatalities within 8 hours; SDS (Safety Data Sheets) required; no retaliation", "Kitchen safety; bloodborne pathogen training; PPE; chemical safety"],
          ["FMLA", "1993", "Family and medical leave", "50+ employees; 12 weeks unpaid job-protected leave for qualifying events; employee must have 12 months and 1,250 hrs worked", "RDN on FMLA must be reinstated to same or equivalent position"],
          ["NLRA / Wagner Act", "1935", "Employee right to organize and bargain collectively", "Created NLRB; prohibits unfair labor practices by employers; employees may strike", "Cannot discipline employee for union organizing activities"],
          ["Taft-Hartley Act", "1947", "Restricts union activities; allows right-to-work states", "Prohibits closed shops; allows states to ban mandatory union membership", "In right-to-work states, employees cannot be required to join union"],
          ["HIPAA", "1996", "Protected Health Information (PHI)", "Minimum necessary standard; Notice of Privacy Practices; covered entities must protect PHI", "Patient nutrition data = PHI; cannot share without authorization; secure EHR"],
        ]},
      { type: "subtitle", text: "3.2 Illegal vs Legal Interview Questions" },
      { type: "table", headers: ["Topic", "ILLEGAL", "LEGAL"],
        rows: [
          ["Age", "'How old are you?' 'What year were you born?'", "'Are you 18 or older?' (if legally required)"],
          ["Family/Children", "'Do you have children?' 'Are you pregnant?' 'Who watches your kids?'", "'Can you work the required hours?' 'Can you travel as required?'"],
          ["Religion", "'What religion are you?' 'Do you observe religious holidays?'", "'Can you work weekends?' After conditional offer: 'Do you need religious accommodations?'"],
          ["National Origin", "'Where were you born?' 'Are you a citizen?'", "'Are you legally authorized to work in the US?' 'Are you fluent in Spanish?' (if job requires)"],
          ["Disability", "'Do you have disabilities?' 'Have you been hospitalized?' 'What medications do you take?'", "'Can you perform the essential functions of this job with or without reasonable accommodation?'"],
          ["Marital Status", "'Are you married?' 'Are you divorced?'", "N/A — never relevant to employment"],
          ["Arrests", "'Have you ever been arrested?'", "'Have you ever been convicted of [specific relevant crime]?'"],
        ]},
      { type: "trap", text: "If an interviewer asks an illegal question, the correct response is to INTERRUPT and stop the question — not allow it, not answer it yourself, not 'try to reassure the candidate.' Allowing illegal questions exposes the organization to legal liability." },
      { type: "subtitle", text: "3.3 Progressive Discipline" },
      { type: "table", headers: ["Step", "Action", "Documentation", "Note"],
        rows: [
          ["Step 1", "Verbal warning: informal discussion of problem and expectations", "Supervisor documents in personal notes; NOT in official personnel file", "Steps may be SKIPPED for serious violations: theft, harassment, violence, falsification"],
          ["Step 2", "Written warning: formal document placed in personnel file", "Specific behaviors; dates; prior warning; expectations; consequences; employee signature", "Gross misconduct warrants immediate termination without progressive steps"],
          ["Step 3", "Suspension: paid or unpaid time off as investigation or disciplinary measure", "HR involvement recommended; suspension terms; expected return date documented", "Paid suspension during investigation protects employee rights; unpaid = punitive"],
          ["Step 4", "Termination: separation from employment", "Complete documentation trail required; HR and legal review; exit interview; reference policy", "Without documentation from Steps 1-3, termination is legally very risky"],
        ]},
    ]
  },
  {
    title: "SECTION 4: FINANCIAL MANAGEMENT",
    color: "#375623",
    content: [
      { type: "subtitle", text: "4.1 Budget Types" },
      { type: "table", headers: ["Budget Type", "What It Covers", "Time Frame", "Key Characteristics"],
        rows: [
          ["Operating (Operational)", "Day-to-day expenses: food costs, labor (wages + benefits), supplies, utilities, linen", "Annual; reviewed monthly", "Most common budget managed by RDNs; variable costs change with volume; fixed costs stay constant"],
          ["Capital", "Major long-term investments; items >1 year useful life above cost threshold ($500-$5,000)", "Multi-year planning (3-5 year capital plan)", "Depreciated over useful life; requires executive approval; examples: ovens, refrigerators, computers, renovations"],
          ["Cash", "Tracks cash inflows and outflows; ensures adequate cash for operations", "Monthly or quarterly", "Organization can be profitable but still have cash flow problems; 'cash is king'"],
          ["Zero-Based", "Every budget line justified from zero each year; no automatic rollover from prior year", "Annual", "Eliminates inefficiencies; time-consuming; prevents 'use it or lose it' behavior"],
          ["Incremental", "Prior year's budget used as base; adjustments for volume/price changes", "Annual", "Most common in healthcare; easier but may perpetuate historical inefficiencies"],
        ]},
      { type: "trap", text: "Food, labor, and disposable supplies = OPERATIONAL expenses. Kitchen equipment (ovens, refrigerators, dishwashers, computers) = CAPITAL expenses. The exam frequently tests this distinction." },
      { type: "subtitle", text: "4.2 Key Financial Formulas" },
      { type: "table", headers: ["Formula", "Equation", "Interpretation / Example"],
        rows: [
          ["Food Cost %", "(Food Cost / Food Sales) x 100", "Target 28-35%; lower = more profitable. Cost $3 / Sale $10 = 30%"],
          ["Food Cost (Monthly)", "Opening Inventory + Purchases - Closing Inventory", "Opening $15k + Purchases $28k - Closing $13k = $30k food cost"],
          ["Selling Price from Food Cost %", "Food Cost / Target Food Cost %", "Cost $3.00 / 0.30 = $10.00 selling price"],
          ["Markup Factor", "1 / Target Food Cost %", "1 / 0.30 = 3.33; multiply cost by 3.33 to get price"],
          ["Contribution Margin (CM)", "Selling Price - Variable Cost per unit", "Price $15 - Variable cost $9 = $6 CM per unit"],
          ["Break-Even Units", "Fixed Costs / CM per unit", "Fixed $10,000 / $6 CM = 1,667 units to break even"],
          ["Break-Even Sales $", "Fixed Costs / CM Ratio; CMR = CM / Selling Price", "$10,000 / ($6/$15) = $10,000 / 0.40 = $25,000 revenue to break even"],
          ["Inventory Turnover", "Food Cost for Period / Average Inventory Value", "Normal = 2-3 times/month. Monthly cost $30,000 / Avg inventory $12,000 = 2.5 turns"],
          ["Straight-Line Depreciation", "(Purchase Cost - Salvage Value) / Useful Life (years)", "($10,000 - $1,250) / 10 years = $875 depreciation per year"],
          ["FTE (Full-Time Equivalent)", "(Positions x Hours/shift x Days/week) / 40", "10 positions x 8 hrs x 7 days = 560/40 = 14.0 FTE"],
          ["Daily Coverage FTE", "FTE x 1.55 (to cover days off, vacations, sick leave)", "14 FTE x 1.55 = 21.7 positions needed to cover 14 FTE daily"],
          ["Current Ratio", "Current Assets / Current Liabilities", ">2:1 = financially healthy; <1:1 = cannot cover short-term obligations"],
          ["5-Week Moving Average (forecasting)", "Sum of most recent 5 weeks / 5", "Weeks: 115+119+123+120+121 = 598/5 = 119.6 -> round to 120 covers needed"],
        ]},
    ]
  },
  {
    title: "SECTION 5: QUALITY IMPROVEMENT & REGULATORY COMPLIANCE",
    color: "#375623",
    content: [
      { type: "subtitle", text: "5.1 QI Frameworks" },
      { type: "table", headers: ["Framework", "Steps", "Key Feature", "Application"],
        rows: [
          ["PDCA / PDSA", "Plan -> Do -> Check/Study -> Act (continuous cycle)", "Most widely used QI cycle; iterative and continuous; never-ending loop", "Any process improvement in clinical nutrition or foodservice"],
          ["FOCUS-PDSA", "Find-Organize-Clarify-Understand-Select + PDSA", "Structured pre-PDSA preparation for complex problems", "Major hospital QI initiatives; thorough problem analysis before intervening"],
          ["TQM (Total Quality Management)", "Customer focus; continuous improvement; employee involvement; data-driven decisions; process thinking", "Philosophy and culture, not just tools; quality = everyone's responsibility; Deming's 14 points", "Organizational culture change; requires leadership commitment"],
          ["Kaizen", "Small, incremental improvements involving all staff; 5S (Sort, Set in order, Shine, Standardize, Sustain); Gemba (go to where work happens)", "Bottom-up; frontline workers identify and solve problems; no-blame culture; eliminate waste", "Kitchen workflow improvement; lean foodservice operations"],
          ["Six Sigma (DMAIC)", "Define-Measure-Analyze-Improve-Control", "Statistical; goal <3.4 defects per million; reduces variation", "High-volume, high-defect processes; requires statistical training; often combined with Lean"],
          ["FADE", "Focus-Analyze-Develop-Execute", "Simpler 4-step model for straightforward QI problems", "Smaller departments; less complex improvement projects"],
        ]},
      { type: "subtitle", text: "5.2 QI Tools" },
      { type: "table", headers: ["Tool", "Purpose", "Key Detail"],
        rows: [
          ["Pareto Chart", "Identify the vital few causes that account for most problems (80/20 rule)", "Ranked bar chart with cumulative percentage line; 80% of problems from 20% of causes; prioritizes which problems to tackle first"],
          ["Fishbone (Ishikawa)", "Root cause analysis — WHY is the problem occurring?", "Cause-and-effect diagram; 6 Ms: Man, Machine, Method, Material, Measurement, Mother Nature; major causes as bones; problem as fish head"],
          ["Control Chart", "Monitor process stability over time; distinguish random from special cause variation", "Time-series with UCL, LCL, and center line; points outside limits = investigate; used to determine if process is 'in control'"],
          ["Histogram", "Display frequency distribution of data", "Bars touching (continuous data); shows shape (normal, skewed, bimodal); x = variable, y = frequency"],
          ["Scatter Diagram", "Test relationship/correlation between two variables", "Dot plot; direction and strength of correlation visible from pattern; does NOT prove causation"],
          ["Flowchart", "Map current or ideal process; identify bottlenecks and redundancies", "Boxes (steps), diamonds (decisions), arrows (flow), ovals (start/stop); used before and after improvement"],
          ["Force Field Analysis", "Identify driving forces (FOR change) and restraining forces (AGAINST change)", "Lewin's Change Model; helps plan change strategies; increase driving forces or decrease restraining forces"],
          ["Delphi Method", "Reach expert consensus without in-person meeting; anonymous iterative questionnaires", "Multiple rounds until consensus; eliminates groupthink; good for forecasting and complex decisions with no clear answer"],
          ["Nominal Group Technique", "Structured group; all write ideas independently, share in round-robin, then vote", "Equalizes participation; reduces dominant personality effect; good for controversial topics"],
        ]},
      { type: "subtitle", text: "5.3 Regulatory Agencies" },
      { type: "table", headers: ["Agency", "Primary Role", "Key Powers", "RDN Relevance"],
        rows: [
          ["The Joint Commission (TJC)", "Accredits healthcare organizations; sets quality/safety standards", "Unannounced surveys; CMS DEEMING AUTHORITY (accreditation = automatic Medicare/Medicaid compliance); can revoke accreditation", "Nutrition screening within 24h of admission required; malnutrition recognition standards; TJC accreditation = CMS survey not needed"],
          ["CMS (Centers for Medicare & Medicaid)", "Sets Conditions of Participation; administers Medicare/Medicaid", "Determines hospital eligibility for reimbursement; surveys non-TJC accredited hospitals; investigates complaints", "Nutrition services are Conditions of Participation; RDN must meet standards for Medicare/Medicaid reimbursement"],
          ["FDA", "Regulates food safety, labeling, drugs, medical devices, dietary supplements", "GRAS status; Nutrition Facts label; FSMA; DSHEA (1994) for dietary supplements; food additive approval; gluten-free labeling", "Nutrition Facts label requirements; allergen labeling (Big 9); GF label = <20 ppm; DSHEA: supplements not FDA-approved before sale"],
          ["USDA", "Food safety for meat/poultry/eggs; federal nutrition programs; dietary guidelines", "FSIS inspects meat and poultry; administers SNAP, WIC, NSLP, CACFP, TEFAP; Dietary Guidelines every 5 years (with HHS)", "Federal nutrition assistance programs; school lunch standards; commodity foods"],
          ["OSHA", "Workplace safety and health standards", "Requires safe workplace; investigate fatalities (report within 8 hours); issue fines; SDS required; cannot retaliate", "Kitchen burns/slips/cuts; bloodborne pathogens for clinical staff; chemical SDS in foodservice"],
          ["State Health Departments", "License and inspect foodservice establishments", "Issue permits; conduct inspections; issue violations; can close operations", "Hospital kitchen inspections; food handler certification; state-specific regulations"],
        ]},
      { type: "trap", text: "TJC DEEMING AUTHORITY: Joint Commission accreditation = automatic CMS compliance. Hospitals choose between TJC accreditation OR direct CMS survey — NOT both. TJC surveys are UNANNOUNCED." },
    ]
  },
  {
    title: "SECTION 6: MARKETING, STRATEGIC PLANNING & FEDERAL PROGRAMS",
    color: "#375623",
    content: [
      { type: "subtitle", text: "6.1 Marketing Mix — 4 Ps" },
      { type: "table", headers: ["P", "Definition", "Nutrition Examples", "Key Concept"],
        rows: [
          ["Product", "The service or good offered; tangible and intangible features", "Clinical nutrition counseling; diabetes education program; meal delivery; wellness classes", "Product life cycle: introduction, growth, maturity, decline; differentiate from competitors"],
          ["Price", "Amount charged; pricing strategy; perceived value", "Outpatient fees; insurance reimbursement; sliding scale; package pricing", "Price signals quality; too low reduces perceived value; must cover costs and margin"],
          ["Place (Distribution)", "How and where the service is delivered; accessibility", "Outpatient clinic; telehealth; hospital-based vs community; home visits; school programs", "Convenience drives utilization; multiple delivery channels; telehealth expanded access"],
          ["Promotion", "How you communicate the service to potential users", "Social media; physician referral programs; health fairs; hospital newsletter; brochures", "Message must match target audience; use channels where audience is; physician relationships drive referrals"],
        ]},
      { type: "subtitle", text: "6.2 Market Segmentation & VALS" },
      { type: "table", headers: ["Type", "Basis", "Examples", "Key Detail"],
        rows: [
          ["Demographic", "Age, sex, income, education, occupation, family size", "Pediatric services; geriatric programs; WIC (income-based); women's health", "Most common and measurable; good for designing targeted programs"],
          ["Geographic", "Location, region, urban/rural, country", "Programs for specific zip codes; immigrant population programs", "Hospital service area mapping; community needs assessment by geography"],
          ["Psychographic (VALS)", "Values, attitudes, lifestyle, interests, personality", "VALS types: Innovators (high resources), Thinkers (ideals), Achievers (goals), Experiencers, Believers, Strivers, Makers, Survivors", "VALS = Values and Lifestyle Segmentation; understand patient motivation for change"],
          ["Behavioral", "Usage patterns, benefits sought, readiness, occasion", "Repeat diet program users; post-diagnosis teachable moments; patients seeking weight loss vs disease management", "Stage of change assessment; motivational interviewing; target teachable moments"],
        ]},
      { type: "subtitle", text: "6.3 Federal Nutrition Programs" },
      { type: "table", headers: ["Program", "Population", "Agency", "Key Facts", "What's Restricted/Required"],
        rows: [
          ["SNAP", "Low-income individuals and families (<=130% FPL)", "USDA FNS", "EBT card; largest federal food assistance program; monthly benefit based on household size and income", "CANNOT buy: hot prepared foods, alcohol, tobacco, vitamins, non-food items. CAN buy: cold prepared foods, seeds/plants to grow food"],
          ["WIC", "Pregnant, postpartum, breastfeeding women; infants <1 yr; children 1-5 yrs (<=185% FPL)", "USDA FNS", "Specific food packages (milk, eggs, cheese, juice, cereal, beans, infant formula); nutrition education REQUIRED; breastfeeding support", "Not an entitlement (limited funding; waiting lists possible); must be found at 'nutritional risk'"],
          ["NSLP / SBP", "K-12 students in public and nonprofit private schools", "USDA FNS", "Free (<=130% FPL) / Reduced (130-185% FPL) / Paid meals; schools receive cash reimbursement + commodity foods", "Must meet USDA nutrition standards: calorie limits by grade, sodium limits, whole grains, fruits and vegetables"],
          ["CACFP", "Children in daycare, family daycare homes; adults in adult daycare; emergency shelters", "USDA FNS", "Reimburses providers for meals and snacks; meal pattern requirements include all food groups", "REQUIRED: >=1 whole grain-rich product per day. NOT required: all dairy must be low-fat (whole milk for ages 1-2), 50% protein, fresh produce at every meal"],
          ["Meals on Wheels (NSIP)", "Homebound elderly 60+ (Older Americans Act)", "Administration for Community Living", "Home-delivered meals (5 days/week); congregate meals at senior centers; social contact; welfare check", "No income requirement; reduces food insecurity, social isolation, hospitalizations"],
          ["TEFAP", "Low-income households via food banks/pantries", "USDA FNS", "USDA commodity foods (agricultural surpluses) distributed through food banks", "Supplements commercial food bank donations; helps clear agricultural surplus"],
        ]},
      { type: "trap", text: "CACFP exam traps: REQUIRED = at least 1 whole grain-rich product per day. NOT REQUIRED = all dairy must be low-fat (whole milk IS allowed for ages 1-2); NOT REQUIRED = 50% from protein; NOT REQUIRED = fresh produce at every meal (frozen and canned count)." },
      { type: "trap", text: "SNAP cannot buy hot prepared foods (why a hot rotisserie chicken at deli counter may not be SNAP-eligible) but CAN buy a cold rotisserie chicken. This is a common question." },
    ]
  },
  {
    title: "SECTION 7: SYSTEMS THEORY & ORGANIZATIONAL STRUCTURE",
    color: "#375623",
    content: [
      { type: "table", headers: ["Concept", "Definition", "Foodservice Example"],
        rows: [
          ["Open system", "Interacts with environment; takes in inputs, produces outputs", "Hospital foodservice takes in food, labor, money; produces meals, nutrition services, waste"],
          ["Inputs", "Resources entering the system", "Food, labor, equipment, money, patient orders, recipes, policies, technology"],
          ["Transformation", "Conversion of inputs into outputs through operations", "Purchase -> store -> prepare -> cook -> plate -> deliver -> serve meals"],
          ["Outputs", "Products and services leaving the system", "Meals served; improved nutrition status; patient satisfaction; waste; financial results"],
          ["Feedback", "Information returned to system about outputs; used to adjust", "Internal: plate waste, cost reports, meal census. External: patient satisfaction surveys, inspections, accreditation"],
          ["Equifinality", "Different systems can reach same outcome through different paths", "Two hospitals achieve excellent nutrition outcomes using different models (cook-chill vs cook-serve)"],
          ["Synergy", "Whole > sum of parts; integration creates more value", "Nutrition + pharmacy + nursing collaboration produces better outcomes than each working alone"],
          ["Entropy", "Tendency toward disorder without active management", "Without ongoing management, processes deteriorate, quality declines; requires constant management energy"],
        ]},
      { type: "subtitle", text: "Organizational Structures" },
      { type: "table", headers: ["Structure", "Description", "Advantages", "Disadvantages"],
        rows: [
          ["Centralized", "Decision-making concentrated at top; few people decide", "Consistency; strong control; standardization; efficient for routine decisions", "Slow to respond to local needs; reduced autonomy; frustrates skilled staff"],
          ["Decentralized", "Decision-making distributed; lower-level managers have autonomy", "Faster response; higher satisfaction; develops management talent; creative", "Inconsistency; duplication; harder to control; requires more skilled managers everywhere"],
          ["Line", "Simple hierarchy; direct chain of command; one supervisor per employee", "Simple; clear authority; fast decisions; clear accountability", "Specialists not used; inflexible; overloads top; limited perspective"],
          ["Functional", "Grouped by specialty (all dietitians together, etc.)", "Deep expertise; efficiency in specialized work; career development within specialty", "Silos; slow cross-functional decisions; no one owns the patient experience end-to-end"],
          ["Line and Staff", "Line managers have direct authority; staff specialists provide advisory support", "Benefits of both line and functional; flexible; specialists support without replacing line authority", "Can confuse authority; staff may overstep; potential conflict between line and staff"],
          ["Matrix", "Employees report to functional manager AND project manager simultaneously", "Efficient resource use; well-rounded employees; integrates expertise", "Dual authority = confusion; potential manager conflict; requires sophisticated staff"],
        ]},
    ]
  },
  {
    title: "DOMAIN III QUICK REFERENCE — MOST TESTED FACTS",
    color: "#375623",
    content: [
      { type: "table", headers: ["Topic", "Critical Fact", "Context"],
        rows: [
          ["Controlling vs Planning", "Planning SETS the standard; Controlling MEASURES against it and corrects deviations", "Comparing actual food cost to budget and adjusting = Controlling"],
          ["Participative vs Consensus", "Participative = staff discuss, manager decides; Consensus = ALL must agree unanimously", "Most common leadership exam trap — know the distinction"],
          ["HBL M1-S1", "Low ability + high willingness = Telling/Directing (high task, low relationship)", "New eager employee: tell them exactly what to do, step by step"],
          ["HBL M2-S2", "Low ability + low willingness = Selling/Coaching (high task AND high relationship)", "Discouraged employee: explain WHY and provide emotional support"],
          ["HBL M3-S3", "High ability + low willingness = Participating/Supporting (low task, high relationship)", "Capable but unconfident employee: involve in decisions, encourage"],
          ["HBL M4-S4", "High ability + high willingness = Delegating (low task AND low relationship)", "Expert motivated employee: give task, step back, minimal oversight"],
          ["Theory X", "Workers lazy; need coercion and control; money-motivated", "Authoritarian management style; McGregor 1960"],
          ["Theory Y", "Workers self-directed when committed; basis for MBO and participation", "Modern management; participative; McGregor 1960"],
          ["Theory Z", "Japanese; lifetime employment; collective decisions; holistic care", "Ouchi 1981; strong organizational culture; loyalty"],
          ["Herzberg Hygiene", "Salary, working conditions, policies PREVENT dissatisfaction but do NOT motivate", "To motivate: use motivators (achievement, recognition, responsibility, growth)"],
          ["ADA violation", "Transferring/firing someone due to disability (real or perceived) = ADA violation", "Must engage in interactive accommodation process first"],
          ["FLSA exempt", "Managers and professionals (including RDNs) may be exempt from overtime", "Non-exempt = hourly foodservice workers; must track hours; 1.5x after 40 hrs"],
          ["Illegal interview question", "Family, age, religion, national origin, disability, marital status, pregnancy", "INTERRUPT and stop the question; do not allow or answer it"],
          ["Capital vs Operational", "Capital = equipment/buildings/land; Operational = food/labor/disposable supplies", "Kitchen oven IS capital; food supplies ARE operational"],
          ["FTE formula", "(Positions x Hours x Days per week) / 40", "10 pos x 8 hrs x 7 days = 560/40 = 14 FTE"],
          ["Straight-line depreciation", "(Cost - Salvage) / Useful Life; ALWAYS subtract salvage first", "($10,000 - $1,250) / 10 = $875/year"],
          ["Break-even units", "Fixed costs / (Selling price - Variable cost)", "FC $10,000 / ($15-$9) = $10,000/$6 = 1,667 units"],
          ["Inventory turnover", "Food cost for period / Average inventory value; normal = 2-3x/month", "Monthly cost $30,000 / Avg inventory $12,000 = 2.5 turns"],
          ["TJC deeming authority", "TJC accreditation = automatic CMS compliance (no separate CMS survey needed)", "Hospitals choose TJC OR direct CMS survey; TJC surveys are UNANNOUNCED"],
          ["Pareto Chart", "80/20 rule; 80% of problems from 20% of causes; prioritize vital few", "Ranked bar chart with cumulative line; identify most impactful problems to fix first"],
          ["Fishbone diagram", "Root cause analysis; 6 Ms: Man, Machine, Method, Material, Measurement, Mother Nature", "WHY is the problem occurring; brainstorm all possible causes"],
          ["Delphi method", "Anonymous iterative expert surveys until consensus; no in-person meeting", "Eliminates groupthink; good for long-range forecasting with no clear answer"],
          ["CACFP required", ">=1 whole grain-rich product per day is the ONLY required specific item", "NOT required: all low-fat dairy, 50% protein, fresh produce at every meal"],
          ["WIC income limit", "<=185% federal poverty level (more generous than SNAP at 130%)", "Not an entitlement — limited funding; waiting lists possible"],
          ["SNAP restriction", "Cannot buy hot prepared foods, alcohol, tobacco, vitamins, non-food items", "CAN buy cold prepared foods, seeds and plants to grow food"],
          ["Campinha-Bacote starting point", "Cultural DESIRE is the motivating force for cultural competence", "Without desire, other components (awareness, knowledge, skill, encounters) are not pursued"],
          ["Equifinality", "Different paths can lead to same organizational outcome", "No single right way to organize; accept diverse approaches"],
          ["Entropy", "Systems tend toward disorder without active management", "Requires constant management energy to maintain order and quality"],
        ]},
    ]
  }
];

export default function DomainIIIPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/study-guides" style={{ color: "#375623", textDecoration: "none", fontSize: 14 }}>← Study Guides</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ background: "#375623", color: "#fff", borderRadius: 10, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>D3</div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Domain III — Management</h1>
          <div style={{ color: "#375623", fontWeight: 600, fontSize: 14 }}>21% of the RDN Exam</div>
        </div>
      </div>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>Covers management functions, leadership theories, human resources law, financial management, quality improvement, and federal nutrition programs.</p>
      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: section.color, borderBottom: `2px solid ${section.color}`, paddingBottom: 8, marginBottom: 16 }}>{section.title}</h2>
          {section.content.map((block, bi) => {
            if (block.type === "table") return (
              <div key={bi} style={{ overflowX: "auto", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr>{block.headers.map((h, i) => <th key={i} style={{ background: "#1F3864", color: "#fff", padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                  <tbody>{block.rows.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? "#EFF5EA" : "#fff" }}>
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
            if (block.type === "key") return (
              <div key={bi} style={{ background: "#EFF5EA", border: "1px solid #37562355", borderLeft: "4px solid #375623", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 }}>
                <strong style={{ color: "#375623" }}>KEY POINT: </strong><span style={{ color: "#333" }}>{block.text}</span>
              </div>
            );
            if (block.type === "subtitle") return <h3 key={bi} style={{ fontSize: 15, fontWeight: 700, color: "#1F3864", margin: "16px 0 8px" }}>{block.text}</h3>;
            if (block.type === "text") return <p key={bi} style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 12 }}>{block.text}</p>;
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
