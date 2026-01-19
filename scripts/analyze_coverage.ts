
import { SAMPLE_QUESTIONS } from '../src/lib/questions';

const analysis = {
    'Domain I': {
        'Topic A: Food Science': 0,
        'Topic B: Nutrition Science': 0,
        'Topic C: Education & Counseling': 0,
        'Topic D: Research': 0,
        'Other': 0
    },
    'Domain II': {
        'Topic A: Assessment': 0,
        'Topic B: Diagnosis': 0,
        'Topic C: Intervention': 0,
        'Topic D: Monitoring': 0,
        'Other': 0
    },
    'Domain III': {
        'Topic A: Functions of Management': 0,
        'Topic B: HR': 0,
        'Topic C: Financial': 0,
        'Topic D: Marketing': 0,
        'Topic E: Quality': 0,
        'Other': 0
    },
    'Domain IV': {
        'Topic A: Menu': 0,
        'Topic B: Production/Service': 0,
        'Topic C: Safety/Sanitation': 0,
        'Topic D: Equipment': 0,
        'Other': 0
    }
};

const topicKeywords: Record<string, Record<string, string[]>> = {
    'Domain I': {
        'Topic A: Food Science': ['food science', 'composition', 'additives', 'functional foods', 'preservation', 'packaging', 'ingredient', 'chemical', 'sensory', 'biotechnology', 'food technology', 'starch', 'sugar', 'baking', 'leavening'],
        'Topic B: Nutrition Science': ['macronutrients', 'micronutrients', 'metabolism', 'digestion', 'absorption', 'energy', 'vitamin', 'mineral', 'water', 'electrolytes', 'biochemistry', 'physiology', 'pathways', 'tca cycle', 'glycolysis'],
        'Topic C: Education & Counseling': ['education', 'counseling', 'behavior', 'learning', 'communication', 'cultural', 'interviewing', 'theories', 'hbm', 'transtheoretical', 'stages of change', 'educational', 'literacy', 'andragogy', 'pedagogy', 'motivational interviewing'],
        'Topic D: Research': ['research', 'statistics', 'study design', 'evidence', 'clinical trials', 'variables', 'cohort', 'epidemiology', 'bias', 'validity', 'reliability', 'p-value', 'mean', 'median', 'mode']
    },
    'Domain II': {
        'Topic A: Assessment': ['assessment', 'screening', 'anthropometrics', 'lab', 'clinical', 'history', 'examination', 'nfpe', 'bmi', 'weight', 'height', 'biochemical', 'diet history', 'intake', 'status'],
        'Topic B: Diagnosis': ['diagnosis', 'pes', 'problem', 'etiology', 'diagnostic', 'signs', 'symptoms', 'related to', 'evidenced by'],
        'Topic C: Intervention': ['intervention', 'prescription', 'enteral', 'parenteral', 'education', 'counseling', 'mnt', 'diet', 'meal plan', 'formula', 'delivery', 'supplements', 'feeding', 'tube', 'tpn', 'en', 'pn'],
        'Topic D: Monitoring': ['monitoring', 'evaluation', 'outcomes', 'indicators', 'progress', 'goals', 'reassessment', 'revise']
    },
    'Domain III': {
        'Topic A: Functions of Management': ['management', 'planning', 'organizing', 'leading', 'controlling', 'leadership', 'skills', 'roles', 'functions', 'strategic', 'policy', 'goals', 'mission', 'vision'],
        'Topic B: HR': ['hr', 'human resources', 'staffing', 'scheduling', 'labor', 'employment', 'hiring', 'interview', 'performance', 'job', 'description', 'training', 'development', 'laws', 'regulations', 'discipline', 'grievance'],
        'Topic C: Financial': ['financial', 'budget', 'cost', 'accounting', 'p&l', 'revenue', 'expense', 'break-even', 'inventory', 'pricing', 'fisc', 'audit', 'balance sheet', 'statement', 'profit'],
        'Topic D: Marketing': ['marketing', 'public relations', 'promotion', 'advertising', 'sales', 'customer', 'market', 'target', 'segmentation', 'brand', 'service'],
        'Topic E: Quality': ['quality', 'improvement', 'tqm', 'cqm', 'regulatory', 'accreditation', 'standards', 'joint commission', 'cms', 'audit', 'outcome', 'indicator', 'benchmark']
    },
    'Domain IV': {
        'Topic A: Menu': ['menu', 'planning', 'recipe', 'cycle', 'choice', 'seasonality', 'dietary', 'guidelines', 'patterns', 'customer', 'satisfaction'],
        'Topic B: Production/Service': ['production', 'procurement', 'purchasing', 'distribution', 'service', 'inventory', 'receiving', 'storage', 'cooking', 'assembly', 'forecasting', 'specification', 'delivery', 'system', 'conventional', 'commissary', 'ready-prepared', 'assembly-serve'],
        'Topic C: Safety/Sanitation': ['safety', 'sanitation', 'haccp', 'foodborne', 'illness', 'temperature', 'cleaning', 'regulations', 'osha', 'inspection', 'hazard', 'control', 'ccp', 'thermometer', ' cross-contamination'],
        'Topic D: Equipment': ['equipment', 'facility', 'layout', 'utilities', 'sustainability', 'energy', 'water', 'waste', 'design', 'maintenance', 'specifications', 'ergonomics', 'green']
    }
};

SAMPLE_QUESTIONS.forEach((q, index) => {
    let domainKey = 'Unknown';
    const debug = (index % 100 === 0);

    if (q.domain) {
        if (/Domain IV\b/.test(q.domain) || q.domain.includes('Foodservice')) domainKey = 'Domain IV';
        else if (/Domain III\b/.test(q.domain) || q.domain.includes('Management')) domainKey = 'Domain III';
        else if (/Domain II\b/.test(q.domain) || q.domain.includes('Clinical')) domainKey = 'Domain II';
        else if (/Domain I\b/.test(q.domain) || q.domain.includes('Principles')) domainKey = 'Domain I';
    }

    if (domainKey === 'Unknown') {
        if (q.moduleId === 'mod1') domainKey = 'Domain I';
        else if (q.moduleId === 'mod2') domainKey = 'Domain II';
        else if (q.moduleId === 'mod3') domainKey = 'Domain III';
        else if (q.moduleId === 'mod4') domainKey = 'Domain IV';
    }

    if (domainKey === 'Unknown') return;

    // Force-cast for typing since we did loose initial
    const anyAnalysis = analysis as any;

    let classified = false;

    // 1. Try Topic Check
    if (q.topic) {
        for (const [subTopic, keywords] of Object.entries(topicKeywords[domainKey])) {
            const cleanTopic = q.topic.toLowerCase();
            // Direct keyword match in topic string
            if (keywords.some(k => cleanTopic.includes(k))) {
                anyAnalysis[domainKey][subTopic]++;
                classified = true;
                break;
            }
            // Sub topic name match
            if (subTopic.toLowerCase().includes(cleanTopic)) {
                anyAnalysis[domainKey][subTopic]++;
                classified = true;
                break;
            }
        }
    }

    // 2. Try Tags Check
    if (!classified && q.tags) {
        for (const [subTopic, keywords] of Object.entries(topicKeywords[domainKey])) {
            if (q.tags.some(tag => keywords.some(k => tag.toLowerCase().includes(k)))) {
                anyAnalysis[domainKey][subTopic]++;
                classified = true;
                break;
            }
        }
    }

    // 3. Fallbacks
    if (!classified) {
        if (domainKey === 'Domain I' && q.id.includes('gap')) {
            anyAnalysis['Domain I']['Topic C: Education & Counseling']++;
            classified = true;
        } else if (domainKey === 'Domain III' && q.topic === 'Functions of Management') {
            anyAnalysis['Domain III']['Topic A: Functions of Management']++;
            classified = true;
        }
    }

    if (!classified) {
        anyAnalysis[domainKey]['Other']++;
    }
});

console.log(JSON.stringify(analysis, null, 2));

let total = 0;
for (const d of Object.values(analysis)) {
    for (const count of Object.values(d)) {
        total += count;
    }
}
console.log(`\nTotal Questions Analyzed: ${total}`);
