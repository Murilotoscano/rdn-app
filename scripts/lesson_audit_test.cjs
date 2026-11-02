const assert = require('node:assert/strict');
const root = process.cwd() + '/';
class MemoryStorage { constructor() { this.m = new Map(); } getItem(k) { return this.m.get(k) ?? null; } setItem(k,v) { this.m.set(k,String(v)); } removeItem(k) { this.m.delete(k); } }
global.window = global; global.localStorage = new MemoryStorage();
const { store } = require(root+'src/lib/store.ts');
const { AVAILABLE_QUESTIONS, REVIEW_HOLD_IDS, drawBlueprintExam, getQuestions, getQuestionsByIds, SAMPLE_QUESTIONS } = require(root+'src/lib/questions.ts');
const material = require(root+'src/data/murilo_rdn_semana1_conteudo.json');
const plan = require(root+'src/data/murilo_rdn_plano_45_dias_estrutura.json');
async function main() {
 store.saveLessonProgress('first-week-1',{I01:3},false);
 const backup=store.exportAll(); assert.equal(backup.data.lessonProgress['first-week-1'].answers.I01,3);
 store.saveLessonProgress('first-week-1',{I02:1},true);
 store.importAll(backup); let restored=store.getLessonProgress()['first-week-1'];
 assert.deepEqual(restored.answers,{I01:3,I02:1}); assert.equal(restored.completed,true);
 assert.equal(backup.version,4);
 assert.equal(material.questions.length,60); assert.equal(new Set(material.questions.map(x=>x.id)).size,60);
 assert.equal(material.days.length,6); assert.equal(material.days.flat().length,60);
 for(const q of material.questions) assert(q.options.length===4 && q.answer>=0 && q.answer<4 && q.rationale && Array.isArray(q.sources));
 assert.equal(plan.weeks.flatMap(w=>w.days).length,45); assert.equal(plan.exam_date,null);
 assert(REVIEW_HOLD_IDS.has('m2-mnt-054')); assert(SAMPLE_QUESTIONS.some(q=>q.id==='m2-mnt-054'));
 assert(!AVAILABLE_QUESTIONS.some(q=>REVIEW_HOLD_IDS.has(q.id)));
 for(let seed=1;seed<=50;seed++) { const a=drawBlueprintExam(145,seed);assert.equal(a.length,145);assert(!a.some(q=>REVIEW_HOLD_IDS.has(q.id)));for(const q of a){const original=SAMPLE_QUESTIONS.find(x=>x.id===q.id);assert.equal(q.options[q.correctIndex],original.options[original.correctIndex]);} }
 assert(!(await getQuestions('2',25)).some(q=>REVIEW_HOLD_IDS.has(q.id)));
 assert.equal((await getQuestionsByIds(['m2-mnt-054'])).length,0);
 console.log('PASS lesson backup/merge, 60 questions and 45 days, quarantine and 50 shuffled mocks');
}
main().catch(e=>{console.error(e);process.exitCode=1});
