const assert=require('node:assert/strict');
const {SAMPLE_QUESTIONS,REVIEW_HOLD_IDS,drawBlueprintExam}=require(process.cwd()+'/src/lib/questions.ts');
const keys={
 'm1-gap-10':'The consequences of the behavior (positive or negative reinforcement)',
 'm1-nn-020':'Slows gastric emptying and stimulates gallbladder bile release and pancreatic enzyme secretion',
 'm1-fs-007':'Amaranth, millet, teff, buckwheat, and quinoa are all gluten-free whole grains',
 'm1-fs-009':'Aseptic packaging that prevents recontamination before opening',
 'm1-fs-025':'Beer 12 oz (5% ABV), Wine 5 oz (12% ABV), Spirits 1.5 oz (80 proof)',
 'm1-nn2-004':'Neurological damage (peripheral neuropathy)',
 'm2-mnt-072':'Quinoa', 'm2-mnt-128':'Gallstones and heavy alcohol use',
 'm2-mnt-180':'Increased urinary frequency, urinary/genital infections, and risk of dehydration',
 'dom2-ext2-007':'Amylase and Lipase (serum enzymes)',
 'm2-mnt-130':'Creatinine increase ≥0.3 mg/dL within 48 hours, or ≥1.5 times baseline within 7 days, or urine output <0.5 mL/kg/hour for 6 hours',
 'm4-pdf-61':'Class K', 'm4-pdf-71':'USDA Food Safety and Inspection Service (FSIS)',
 'm4-gf-inf-01':'Powdered formula is not commercially sterile and may carry Cronobacter sakazakii',
 'm4-gf-sus-01':'Source reduction, by preventing surplus food from being generated'
};
for(const [id,key] of Object.entries(keys)){const q=SAMPLE_QUESTIONS.find(x=>x.id===id);assert(q,id);assert.equal(q.options[q.correctIndex],key,id);assert.equal(new Set(q.options).size,4,id);assert(!REVIEW_HOLD_IDS.has(id),id);assert(q.references?.every(x=>x.startsWith('https://'))&&q.references.length,id);}
const q=id=>SAMPLE_QUESTIONS.find(x=>x.id===id);
assert(!q('m2-mnt-180').explanation.includes('contraindicated with kidney problems'));
assert(q('m2-mnt-130').explanation.includes('prior 7 days'));
assert(q('m1-fs-025').explanation.includes('0.6 fluid oz'));
assert(!q('m1-fs-007').explanation.includes('technically capable of forming gluten'));
for(let seed=0;seed<100;seed++)for(const item of drawBlueprintExam(145,seed)){const orig=q(item.id);assert.equal(item.options[item.correctIndex],orig.options[orig.correctIndex]);assert(!REVIEW_HOLD_IDS.has(item.id));}
console.log('PASS 15 source-linked corrections and 100 mock shuffles');
