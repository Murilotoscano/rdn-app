const assert=require('node:assert/strict');
const {SAMPLE_QUESTIONS,REVIEW_HOLD_IDS,drawBlueprintExam}=require(process.cwd()+'/src/lib/questions.ts');
const keys={
 'm2-entp-004':'A standard polymeric formula can be appropriate; formula choice depends on the patient and tolerance',
 'm2-entp-010':'Choose based on anatomy and tolerance; polymeric formula may be used and alternatives considered when indicated',
 'm2-entp-014':'900 mOsm/L', 'm2-entp-020':'75 g/day', 'm2-entp-025':'40 kcal',
 'm2-entp-027':'Known hypersensitivity to egg, soybean, peanut or an ingredient in the product',
 'm2-entp-028':'To help assess peripheral versus central access using the actual formulation and applicable guidance',
 'm2-mnt-054':'Phenylalanine and tyrosine, with individualized metabolic management',
 'm2-mnt-075':'Fluid and electrolyte depletion', 'm2-mnt-084':'No more than 2,300 mg',
 'm2-mnt-001':'960–2,000 kcal/day',
 'm2-mnt-080':'No recommendation for routine use was made because evidence was conflicting',
 'm2-mnt-167':'Serum iron divided by TIBC, multiplied by 100'
};
for(const [id,key] of Object.entries(keys)){const q=SAMPLE_QUESTIONS.find(x=>x.id===id);assert(q,id);assert.equal(q.options[q.correctIndex],key,id);assert.equal(new Set(q.options).size,4,id);assert(!REVIEW_HOLD_IDS.has(id),id);assert(q.references?.every(x=>x.startsWith('https://'))&&q.references.length,id);}
assert.equal(75*1,75);assert.equal(2000*.02,40);assert.equal(80*12,960);assert.equal(80*25,2000);
for(let seed=0;seed<100;seed++)for(const item of drawBlueprintExam(145,seed)){const q=SAMPLE_QUESTIONS.find(x=>x.id===item.id);assert.equal(item.options[item.correctIndex],q.options[q.correctIndex]);assert(!REVIEW_HOLD_IDS.has(item.id));}
console.log('PASS 13 nutrition-support keys, calculations, references and 100 mock shuffles');
