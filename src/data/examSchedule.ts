/**
 * Countdown schedule for the exam sitting planned for 6 November 2026.
 *
 * It does not replace the 30-day plan: each week points at the existing days in
 * `studyPlanContent.ts`, so nothing is duplicated and any day already worked through
 * keeps its content. `forumFocus` lists the topics candidates report on public forums
 * (Reddit r/dietetics, r/RD2B). Those are recollections, not published frequencies and
 * not a guarantee that anything will be asked; they are here to order revision, while
 * the mock exams stay weighted to the 2022-2026 CDR matrix (21/45/21/13).
 */

export interface ScheduleWeek {
    week: number;
    dates: string;
    focus: string;
    domains: string;
    /** Days from the 30-day plan to work through this week. */
    days: number[];
    /** What to do inside the app, with the route to open. */
    activities: { label: string; href: string }[];
    /** Topics candidates report as recurring. Reported priorities, not measured ones. */
    forumFocus: string[];
    /**
     * Foodservice and management maths. Candidates report it as the block that decides the
     * management domains, and it rewards spacing rather than one late cram, so it starts in
     * week 1 and then runs on what you actually got wrong, through the existing review queue.
     */
    mathDrill: string;
    goal: string;
}

export const EXAM_DATE_LABEL = "Friday 6 November 2026";
export const SCHEDULE_START_LABEL = "Monday 21 September 2026";

export const SCHEDULE_WEEKS: ScheduleWeek[] = [
    {
        week: 1,
        dates: "Sep 21 - 27",
        focus: "Diagnostic mock, then food science, micronutrients, research and counselling",
        domains: "Domain I",
        days: [1, 2, 9, 8],
        activities: [
            { label: "Day 1: take a diagnostic mock under exam conditions", href: "/simulation" },
            { label: "Practice: Domain I question sets", href: "/practice?mode=domain&id=1" },
            { label: "Review queue: every miss from the diagnostic", href: "/review" },
        ],
        forumFocus: [
            "Medical terminology: prefixes and suffixes",
            "Study designs, null hypothesis, causation vs association",
            "Food additives: antioxidants, preservatives, emulsifiers",
            "Glycolysis, gluconeogenesis, glycogenesis, glycogenolysis",
        ],
        mathDrill: "Start here: 10 cost and yield items on three separate days (break-even, food cost %, selling price, EP/AP yield, meals per labor hour). Use Practice > Domain III and Domain IV and note which formula failed.",
        goal: "Get a clean baseline, then read every stem correctly and separate the four glucose pathways.",
    },
    {
        week: 2,
        dates: "Sep 28 - Oct 4",
        focus: "Clinical core: diabetes, cardiovascular, renal, GI and liver",
        domains: "Domain II",
        days: [3, 4, 11, 12, 13, 10],
        activities: [
            { label: "Practice: Domain II question sets", href: "/practice?mode=domain&id=2" },
            { label: "Review queue daily, before new material", href: "/review" },
        ],
        forumFocus: [
            "Differentiating the anemias",
            "Renal labs and how the kidney works",
            "Celiac disease: which foods are appropriate",
            "Nutrition diagnosis for a pressure injury",
        ],
        mathDrill: "15 minutes, twice this week: redo only the maths items you missed in week 1, from the review queue.",
        goal: "Read a lab panel and pick the food or intervention that fits the condition.",
    },
    {
        week: 3,
        dates: "Oct 5 - 11",
        focus: "Nutrition support calculations, pulmonary care, food science and metabolism",
        domains: "Domain II and Domain I",
        days: [5, 20, 16, 27, 28],
        activities: [
            { label: "Practice: Domain II, focusing on enteral and parenteral items", href: "/practice?mode=domain&id=2" },
            { label: "Review queue: repeat every calculation you missed", href: "/review" },
        ],
        forumFocus: [
            "Parenteral nutrition: grams of nitrogen, dextrose, osmolarity",
            "Enteral formula volume, free water and added fluid needs",
            "Intermittent versus continuous delivery rates",
            "Refeeding syndrome: risk, thiamine, starting energy",
        ],
        mathDrill: "Nutrition support maths is this week's main block, so keep foodservice maths to one 15-minute session of missed items.",
        goal: "Run every nutrition support calculation without notes, twice, at exam pace.",
    },
    {
        week: 4,
        dates: "Oct 12 - 18",
        focus: "Endocrine, oncology, paediatrics, pregnancy and geriatrics, then the second mock",
        domains: "Domain II",
        days: [14, 15, 17, 18, 19],
        activities: [
            { label: "Mock exam under exam conditions (Sat Oct 17)", href: "/simulation" },
            { label: "Practice: Domain II question sets", href: "/practice?mode=domain&id=2" },
            { label: "Review queue: misses and anything answered while unsure", href: "/review" },
        ],
        forumFocus: [
            "PKU, MSUD and other inborn errors: which foods are allowed",
            "Cystic fibrosis and enzyme timing",
            "Pregnancy and lactation micronutrients",
            "PCOS and Addison disease",
        ],
        mathDrill: "Two sessions of 10 items, weighted to whatever the diagnostic and the week 1 drill exposed.",
        goal: "Second mock result, compared with the diagnostic on unseen questions rather than overall.",
    },
    {
        week: 5,
        dates: "Oct 19 - 25",
        focus: "Management, finance, quality improvement and community programmes",
        domains: "Domain III",
        days: [7, 22, 25, 26],
        activities: [
            { label: "Practice: Domain III question sets", href: "/practice?mode=domain&id=3" },
            { label: "Review queue daily", href: "/review" },
        ],
        forumFocus: [
            "Break-even point, food cost, selling price, profit margin",
            "Employee turnover rate and meals per labor hour",
            "Leadership style in a crisis; delegation and span of control",
            "WIC, SNAP, school meals, CACFP and the Older Americans Act",
        ],
        mathDrill: "Daily this week: management maths is the domain focus, so work fresh items rather than repeats.",
        goal: "Every management formula on paper in under a minute, and each federal programme matched to its population.",
    },
    {
        week: 6,
        dates: "Oct 26 - Nov 1",
        focus: "Foodservice systems, menus, purchasing, safety and layout, then the third mock",
        domains: "Domain IV",
        days: [6, 21, 23, 24],
        activities: [
            { label: "Mock exam under exam conditions (Sat Oct 31)", href: "/simulation" },
            { label: "Practice: Domain IV question sets", href: "/practice?mode=domain&id=4" },
            { label: "Review queue: food safety and calculation misses first", href: "/review" },
        ],
        forumFocus: [
            "EP/AP yield and purchase quantities; can sizes and case packs",
            "Forecasting and moving averages",
            "Service and safety temperatures; HACCP and commissary transport",
            "Motion economy and work simplification",
        ],
        mathDrill: "Daily: yields, forecasting, can sizes and case packs, plus every maths item missed on mock 2.",
        goal: "Third mock, with the foodservice maths done cleanly under time pressure.",
    },
    {
        week: 7,
        dates: "Nov 2 - 6",
        focus: "Final mock, targeted weakness review, then taper",
        domains: "All four",
        days: [29, 30],
        activities: [
            { label: "Final mock under exam conditions (Mon Nov 2)", href: "/simulation" },
            { label: "Review queue only from Nov 3: misses and unsure answers", href: "/review" },
            { label: "Nov 5: light review of your own notes, no long mock", href: "/study-plan/29" },
        ],
        forumFocus: [
            "Whatever the mocks exposed, in order of how often you missed it",
            "First-action and best-answer items: read the question, decide the priority",
        ],
        mathDrill: "One short session before mock 4, then only the items you missed on it. No new formulas after Nov 4.",
        goal: "Nov 6 is exam day. Nothing new after Nov 4, and no full-length mock the day before.",
    },
];
