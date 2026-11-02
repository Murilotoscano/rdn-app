const assert=require('node:assert/strict');
const {SAMPLE_QUESTIONS,REVIEW_HOLD_IDS,drawBlueprintExam}=require(process.cwd()+'/src/lib/questions.ts');
const keys={
 'm2-mnt-107':'≥ 92 mg/dL', 'm2-mnt-135':'Glucose absorbed from the dialysate',
 'm2-mnt-126':'Offer early oral feeding with a low-fat solid diet within 24–48 hours as tolerated',
 'm2-mnt-109':'Individualize carbohydrate intake and distribution across meals and snacks, with monitoring',
 'm2-renal-021':'Increased total ECF but reduced effective arterial volume, promoting sodium and water retention',
 'm2-renal-023':'Serum sodium approximately 135–145 mmol/L; BUN may rise with volume depletion',
 'm2-mnt-028':'Withhold enteral feeding while resuscitation is incomplete, then reassess after stabilization',
 'm2-gf-pnc-02':'4.5 mg/kg/min; assess persistent hyperglycemia and the overall regimen',
 'm2-gf-pnc-05':'Consider cycling PN, avoiding overfeeding and maximizing tolerated enteral intake with clinical monitoring',
 'm2-gf-pcos-08':'Possible insulin resistance, warranting appropriate metabolic assessment',
 'm2-gf-wic-06':'Eligible fruits and vegetables in forms authorized by the state WIC program, including eligible fresh produce',
 'm2-gf-mh-06':'Give prompt parenteral thiamine and do not delay emergency glucose if hypoglycemia is present',
 'm2-gf-bar-04':'Thiamine deficiency causing Wernicke encephalopathy',
 'm2-mnt-172':'Evaluate other causes, including coexisting iron deficiency, and manage the underlying inflammatory disease with the medical team'
};
for(const [id,key] of Object.entries(keys)){const q=SAMPLE_QUESTIONS.find(x=>x.id===id);assert(q,id);assert.equal(q.options[q.correctIndex],key,id);assert.equal(new Set(q.options).size,4,id);assert(!REVIEW_HOLD_IDS.has(id),id);assert(q.references?.every(x=>x.startsWith('https://'))&&q.references.length,id);}
assert.equal(Math.round((450000/70/1440)*10)/10,4.5);
for(let seed=0;seed<100;seed++)for(const item of drawBlueprintExam(145,seed)){const original=SAMPLE_QUESTIONS.find(q=>q.id===item.id);assert.equal(item.options[item.correctIndex],original.options[original.correctIndex]);assert(!REVIEW_HOLD_IDS.has(item.id));}
console.log('PASS 14 clinical keys, one calculation, source links and 100 mock shuffles');
