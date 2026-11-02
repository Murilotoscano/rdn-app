const assert = require('node:assert/strict');
const {SAMPLE_QUESTIONS, REVIEW_HOLD_IDS, drawBlueprintExam} = require(process.cwd()+'/src/lib/questions.ts');
const expected = {
 'm1-calc-010':'2,834 units', 'm1-calc-013':'$27.33 per meal — $2.33 over budget per meal',
 'm1-calc-018':'3 cans', 'm1-calc-021':'$3.35', 'm1-calc-023':'98%',
 'm1-calc-025':'71 lb', 'dom4-ext-006':'50.0 lb', 'm2-entp-030':'about 2,000 mOsm/L',
 'm1-rc-011':'792 false positives', 'm3-polish-27':'$6.06',
 'm2-mnt-103':'126 mg/dL', 'm2-mnt-156':'1,624 kcal/day', 'm4-pdf-30':'$0.40', 'm4-pdf-90':'165°F'
};
for (const [id,answer] of Object.entries(expected)) {
 const q=SAMPLE_QUESTIONS.find(x=>x.id===id); assert(q,id); assert.equal(q.options[q.correctIndex],answer,id); assert.equal(REVIEW_HOLD_IDS.has(id),false,id);
 assert.equal(new Set(q.options).size,4,id);
}
assert.equal(Math.ceil(85000/(42-12)),2834); assert.equal(Math.round((820/30-25)*100)/100,2.33);
assert.equal(Math.ceil((16*16)/((6*16+10)*.9)),3);assert.equal(((1.75+1)/.82).toFixed(2),'3.35');
assert.equal(((9.5-2.5)*350/2500)*100,98);assert.equal(Math.ceil((300*3/16)/.8),71);
assert.equal(200*3/16/.75,50);assert.equal((500*5+50*10)/1.5,2000);
assert.equal(9900*.08,792);assert.equal((2/.33).toFixed(2),'6.06');
for(let seed=0;seed<100;seed++) for(const q of drawBlueprintExam(145,seed)) {
 const original=SAMPLE_QUESTIONS.find(x=>x.id===q.id);assert.equal(q.options[q.correctIndex],original.options[original.correctIndex]);assert(!REVIEW_HOLD_IDS.has(q.id));
}
console.log('PASS 14 released keys, 10 independent calculations and 100 mock shuffles');
