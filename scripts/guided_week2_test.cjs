const assert = require('node:assert/strict');
const root = process.cwd() + '/';
class MemoryStorage { constructor() { this.m=new Map(); } getItem(k){return this.m.get(k)??null} setItem(k,v){this.m.set(k,String(v))} removeItem(k){this.m.delete(k)} }
global.window=global;global.localStorage=new MemoryStorage();
const {store}=require(root+'src/lib/store.ts');
const data=require(root+'src/data/rdn_guided_days.json');
const {SAMPLE_QUESTIONS,REVIEW_HOLD_IDS}=require(root+'src/lib/questions.ts');
assert.deepEqual(data.days.map(x=>x.day),Array.from({length:35},(_,i)=>i+8));
const ids=new Set(),stems=new Set();
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const heldStems=new Set(SAMPLE_QUESTIONS.filter(q=>REVIEW_HOLD_IDS.has(q.id)).map(q=>norm(q.text)));
for(const day of data.days){
 assert.equal(day.minutes,[14,21,28,35,42].includes(day.day)?45:90);assert(day.objectives.length && day.theory.length>=2 && day.review.length && day.sources.length);
 for(const q of day.questions){assert(!ids.has(q.id));ids.add(q.id);assert(!stems.has(norm(q.stem)));stems.add(norm(q.stem));assert(!heldStems.has(norm(q.stem)),q.id);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.answer>=0&&q.answer<4);assert.equal(q.option_rationales.length,4);assert(q.option_rationales.every(Boolean));assert(q.sources.every(x=>x.startsWith('https://')));}
}
store.saveLessonProgress('first-week-1',{I01:3},false);
const q=data.days[0].questions[0]; store.saveLessonProgress('guided-day-8',{[q.id]:q.answer},false);
const backup=store.exportAll();assert.equal(backup.data.lessonProgress['first-week-1'].answers.I01,3);assert.equal(backup.data.lessonProgress['guided-day-8'].answers[q.id],q.answer);
global.localStorage=new MemoryStorage();store.saveLessonProgress('first-week-1',{I02:1},false);store.importAll(backup);
const restored=store.getLessonProgress();assert.equal(restored['first-week-1'].answers.I01,3);assert.equal(restored['first-week-1'].answers.I02,1);assert.equal(restored['guided-day-8'].answers[q.id],q.answer);
console.log(`PASS ${ids.size} unique guided questions, no exact held-stem reuse, and backup/merge across isolated stores`);
