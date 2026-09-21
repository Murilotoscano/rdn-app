/**
 * Local payload/backup checks: npm run test:persistence
 *
 * It exercises the real store functions against a localStorage stub, moving data from
 * "device A" to "device B" through exactly the payloads the Supabase sync sends and reads.
 * What it does NOT do is talk to a Supabase project: the configured host does not resolve,
 * so the network leg and the SQL migration are unverified in a live environment.
 */
class MemoryStorage {
    private data = new Map<string, string>();
    getItem(k: string) { return this.data.has(k) ? this.data.get(k)! : null; }
    setItem(k: string, v: string) { this.data.set(k, String(v)); }
    removeItem(k: string) { this.data.delete(k); }
    clear() { this.data.clear(); }
    snapshot() { return new Map(this.data); }
    restore(s: Map<string, string>) { this.data = new Map(s); }
}

const storage = new MemoryStorage();
(globalThis as any).window = globalThis;
(globalThis as any).localStorage = storage;

const { store } = await import('../src/lib/store');

let failures = 0;
const check = (name: string, ok: boolean, detail = '') => {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' - ' + detail : ''}`);
    if (!ok) failures++;
};

// ---------------------------------------------------------------- device A
const examId = 'mock-test-1';
store.saveExamResult({
    id: examId,
    date: new Date().toISOString(),
    score: 96,
    totalQuestions: 130,
    domainScores: { 'Domain I': { correct: 20, total: 27 }, 'Domain II': { correct: 45, total: 60 } },
    timeSpentSeconds: 10500,
    mode: 'mock',
    realConditions: true,
    inconclusive: false,
    freshTotal: 40,
    freshCorrect: 31
});
store.markSeen(['q-answered']);                       // attempt
store.markExposed(['q-answered', 'q-shown-only']);    // exposure (mock revealed both)

const examRows = store.getExamHistory().map(item => ({
    id: item.id, date: item.date, score: item.score, total_questions: item.totalQuestions,
    domain_scores: item.domainScores, time_spent_seconds: item.timeSpentSeconds, mode: item.mode,
    real_conditions: item.realConditions ?? null, inconclusive: item.inconclusive ?? null,
    fresh_total: item.freshTotal ?? null, fresh_correct: item.freshCorrect ?? null
}));
const exposureRows = store.buildExposurePayload();
const backup = store.exportAll();
const deviceA = storage.snapshot();

check('A: the four mock fields are written locally',
    examRows[0].real_conditions === true && examRows[0].inconclusive === false &&
    examRows[0].fresh_total === 40 && examRows[0].fresh_correct === 31);
check('A: upload payload separates attempt from exposure',
    exposureRows.length === 2 &&
    exposureRows.find(r => r.question_id === 'q-shown-only')!.seen_at === null &&
    typeof exposureRows.find(r => r.question_id === 'q-shown-only')!.exposed_at === 'number');

// ---------------------------------------------------------------- device B
storage.clear();
store.applyRemoteExamHistory(examRows);
store.applyExposurePayload(exposureRows);

const bExam = store.getExamHistory().find(h => h.id === examId)!;
check('B: mock fields survive the round trip',
    bExam.realConditions === true && bExam.inconclusive === false &&
    bExam.freshTotal === 40 && bExam.freshCorrect === 31);
check('B: a question answered on A counts as attempted on B', !!store.getSeen()['q-answered']);
check('B: a question only shown on A counts as exposed, not attempted',
    !store.getSeen()['q-shown-only'] && !!store.getExposed()['q-shown-only']);
check('B: the unseen-first draw avoids both', Object.keys(store.getSeenOrExposed()).length === 2);

// re-sync (reconnect / reload) must be idempotent
store.applyRemoteExamHistory(examRows);
store.applyExposurePayload(exposureRows);
check('B: re-syncing does not duplicate the exam', store.getExamHistory().filter(h => h.id === examId).length === 1);
check('B: re-syncing does not duplicate attempts', Object.keys(store.getSeen()).length === 1);

// a legacy row, written before the four columns existed, must not erase what B knows
store.applyRemoteExamHistory([{
    id: examId, date: bExam.date, score: bExam.score, total_questions: bExam.totalQuestions,
    domain_scores: bExam.domainScores, time_spent_seconds: bExam.timeSpentSeconds, mode: 'mock'
}]);
const afterLegacy = store.getExamHistory().find(h => h.id === examId)!;
check('B: a legacy row without the new columns keeps the local values',
    afterLegacy.realConditions === true && afterLegacy.freshTotal === 40);

// device B answers something new, then A pulls it back
store.markSeen(['q-answered-on-b']);
store.markExposed(['q-answered-on-b']);
const rowsFromB = store.buildExposurePayload();
storage.restore(deviceA);
store.applyExposurePayload(rowsFromB);
check('A: history from B merges back without losing A history',
    !!store.getSeen()['q-answered'] && !!store.getSeen()['q-answered-on-b'] &&
    !!store.getExposed()['q-shown-only']);

// restoring a backup on a third device
storage.clear();
const imported = store.importAll(JSON.parse(JSON.stringify(backup)));
check('C: restoring a backup brings attempts and exposure back',
    !!store.getSeen()['q-answered'] && !!store.getExposed()['q-shown-only'],
    `examsAdded=${imported.examsAdded}`);
check('C: restoring the same backup twice does not duplicate the exam',
    (store.importAll(JSON.parse(JSON.stringify(backup))), store.getExamHistory().filter(h => h.id === examId).length === 1));
check('C: backup keeps the four mock fields',
    store.getExamHistory().find(h => h.id === examId)?.freshCorrect === 31);

// a v2 backup (no exposure map) must still import, without inventing exposure
storage.clear();
const v2 = JSON.parse(JSON.stringify(backup));
v2.version = 2;
delete v2.data.exposedQuestions;
store.importAll(v2);
check('C: a v2 backup imports and invents no exposure',
    !!store.getSeen()['q-answered'] && Object.keys(store.getExposed()).length === 0);

console.log(failures === 0 ? '\nAll persistence checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
