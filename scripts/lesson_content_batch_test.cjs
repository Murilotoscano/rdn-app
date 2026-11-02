const assert=require('node:assert/strict');
const {studyPlanData}=require(process.cwd()+'/src/data/studyPlanContent.ts');
const hold=new Set(require(process.cwd()+'/src/data/review-hold.json'));
const questions=Object.values(studyPlanData).flatMap(d=>d.questions);const byId=new Map(questions.map(q=>[q.id,q]));
const keys={
 'q3-1':'4', 'q5-2':'Check electrolytes and provide thiamine before feeding; begin cautiously and monitor closely',
 'q7-2':'S1 Directing: provide specific direction and close guidance', 'q8-3':'Provide carbohydrate counting education',
 'q10-1':'Complete a nutrition assessment to gather missing information',
 'q16-2':'Individualize nutrition to the person’s needs and treat CF-related diabetes with insulin',
 'q18-2':'The neural tube closes around 28 days after conception, often before pregnancy is recognized',
 'q19-2':'90 g', 'q23-1':'135°F to 70°F within 2 hours, and 135°F to 41°F within 6 hours total',
 'q23-2':'Listeria monocytogenes', 'q23-3':'Rapidly reheat using suitable equipment to 165°F for 15 seconds within 2 hours, then hot-hold',
 'q24-2':'Type 304', 'q25-2':'An approved accreditation process can support deemed compliance with specified conditions, subject to CMS acceptance and other requirements',
 'q25-3':'Incidence of hospital-acquired pressure injuries',
 'q26-1':'SNAP is an entitlement for eligible households; WIC is not an entitlement and serves eligible mothers and young children',
 'q27-2':'Maillard reaction', 'q27-3':'Pressure canning using a tested food- and jar-specific process adjusted for altitude',
 'q30-1':'Perceived difficulty alone does not establish whether the candidate is passing',
 'q30-2':'Give additional targeted practice to Domain II while retaining coverage of other domains'
};
assert.equal(questions.length,88);assert.equal(byId.size,88);assert.equal(Object.keys(keys).length,19);
for(const [id,answer] of Object.entries(keys)){const q=byId.get(id);assert(q,id);assert.equal(q.options[q.correctAnswer],answer,id);assert.equal(new Set(q.options).size,4,id);assert(!hold.has(id),id);}
assert(!hold.has('q24-1')); assert.equal(byId.get('q24-1').options[byId.get('q24-1').correctAnswer], 'Less browned surface because the moist surface and lower temperature limit typical browning');assert.equal(75*1.2,90);assert.equal((45+15)/15,4);
assert(byId.get('q5-2').explanation.includes('Emergency treatment of hypoglycemia must not be delayed'));
console.log('PASS 20 corrected lesson keys, 88 unique IDs and calculation checks');
