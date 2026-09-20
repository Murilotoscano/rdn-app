"use client";

import { Question, CdrQuestion } from "@/types";
import { supabase, isSupabaseConfigured } from './supabaseClient';

// --- Types ---

export interface ErrorLogItem {
    // Identity
    questionId: string;
    domain: string;
    topic: string; // or "General"

    // Core Status
    mastered: boolean;
    repetitionStage: number; // 0, 1, 2, 3...

    // Dates (Epoch ms)
    dateLoggedAt: number;
    nextReviewAt: number;
    lastAttemptAt?: number;

    // Outcomes & Counts
    answerStatus: 'incorrect' | 'unsure' | 'confident';
    lastOutcome?: 'incorrect' | 'unsure' | 'confident';

    attempts: number;
    wrongCount: number;
    unsureCount: number;
    confidentCount: number;

    // Metadata
    errorReason?: string;
    notes?: string;
}

export interface CdrProgress {
    questionId: string;
    status: 'not attempted' | 'correct' | 'incorrect' | 'needs review' | 'mastered';
    notes: string;
    errorType?: string;
    markedForReview: boolean;
    attempts: number;
    lastAttemptedAt?: number;
}

export type SyncState = 'disabled' | 'ok' | 'error';

export interface SyncResult {
    state: SyncState;
    message: string;
}

/** Everything the app persists, in one portable envelope. */
export interface BackupFile {
    format: 'rdn-app-backup';
    version: number;
    exportedAt: string;
    data: {
        errorLog: ErrorLogItem[];
        examHistory: ExamResult[];
        cdrProgress: Record<string, CdrProgress>;
        customQuestions: CdrQuestion[];
        customProgress: Record<string, CdrProgress>;
        /** Question id -> last attempted (epoch ms). Absent in v1 backups. */
        seenQuestions?: Record<string, number>;
        exposedQuestions?: Record<string, number>;
    };
}

export interface BackupStatus {
    /** Review items plus exam results that exist only in this browser. */
    itemsAtRisk: number;
    neverBackedUp: boolean;
    daysSinceBackup: number | null;
    /** True when there is unsaved study progress and the reminder is not snoozed. */
    due: boolean;
    urgent: boolean;
}

export interface StorageSchema {
    schemaVersion: number;
    data: ErrorLogItem[];
}

export interface ExamResult {
    id: string;
    date: string;
    score: number;
    totalQuestions: number;
    domainScores: Record<string, { correct: number; total: number }>;
    timeSpentSeconds: number;
    mode: 'mock' | 'practice'; // Added mode to distinguish
    /** Taken under real exam rules (examRules.ts): only answered questions are scored. */
    realConditions?: boolean;
    /** Fewer than the minimum answered before time ran out: a fail on the real exam. */
    inconclusive?: boolean;
    /** Questions never attempted before this session, and how many of those were right. */
    freshTotal?: number;
    freshCorrect?: number;
}

interface FilterOptions {
    overdueOnly?: boolean;
    domain?: string;
    onlyUnsure?: boolean;
    onlyIncorrect?: boolean;
}

// --- Constants ---

const STORAGE_KEYS = {
    ERROR_LOG: 'rdn_error_log',
    EXAM_HISTORY: 'rdn_exam_history',
    CDR_PROGRESS: 'rdn_cdr_progress',
    CUSTOM_QUESTIONS: 'rdn_custom_questions',
    CUSTOM_PROGRESS: 'rdn_custom_progress',
    SEEN: 'rdn_seen_questions',
    EXPOSED: 'rdn_exposed_questions',
};

const BACKUP_FORMAT = 'rdn-app-backup';
const BACKUP_VERSION = 3; // v3 adds exposedQuestions; v1 and v2 files still import

const BACKUP_META_KEYS = {
    LAST_BACKUP_AT: 'rdn_last_backup_at',
    SNOOZED_UNTIL: 'rdn_backup_reminder_snoozed_until',
};

/** Nag only after a week, only once there is something worth losing, and snooze for 3 days. */
const REMIND_AFTER_DAYS = 7;
const SNOOZE_DAYS = 3;
const MIN_ITEMS_WORTH_BACKING_UP = 5;
const URGENT_AFTER_DAYS = 21;

const CURRENT_SCHEMA_VERSION = 2;
const INTERVALS_HOURS = [24, 72, 168, 336]; // 1d, 3d, 7d, 14d

// --- Helpers ---

const hoursToMs = (h: number) => h * 60 * 60 * 1000;

function migrateErrorLogIfNeeded(raw: any): ErrorLogItem[] {
    if (!raw) return [];

    // Case 1: Array (V1 legacy or simple array)
    if (Array.isArray(raw)) {
        // Simple heuristic migration
        return raw.map((item: any) => ({
            questionId: item.questionId,
            domain: item.domain,
            topic: item.topic || "General",
            mastered: !!item.mastered,
            repetitionStage: item.repetitionStage || 0,

            dateLoggedAt: typeof item.dateLoggedAt === 'number' ? item.dateLoggedAt : (item.dateLogged ? Date.parse(item.dateLogged) : Date.now()),
            nextReviewAt: typeof item.nextReviewAt === 'number' ? item.nextReviewAt : (item.nextReview ? Date.parse(item.nextReview) : Date.now()),

            attempts: item.attempts || 1,
            wrongCount: item.wrongCount || (item.answerStatus === 'incorrect' ? 1 : 0),
            unsureCount: item.unsureCount || (item.answerStatus === 'unsure' ? 1 : 0),
            confidentCount: item.confidentCount || 0,

            answerStatus: item.answerStatus || 'incorrect',
            lastOutcome: item.answerStatus || 'incorrect',
            lastAttemptAt: Date.now(),
            errorReason: item.errorReason,
            notes: item.notes
        }));
    }

    // Case 2: Schema Object (V2)
    if (raw.schemaVersion === 2 && Array.isArray(raw.data)) {
        return raw.data;
    }

    return [];
}

/** Records one miss against the log in place, restarting its spaced-repetition cycle. */
function applyErrorToLog(
    log: ErrorLogItem[],
    question: Question,
    status: 'incorrect' | 'unsure',
    reason?: string,
    notes?: string
) {
    const now = Date.now();
    const nextReview = now + hoursToMs(INTERVALS_HOURS[0]); // +24h
    const idx = log.findIndex(item => item.questionId === question.id);

    if (idx >= 0) {
        const item = log[idx];

        item.dateLoggedAt = now;
        item.attempts += 1;
        item.lastAttemptAt = now;
        item.lastOutcome = status;
        item.answerStatus = status;

        // Restart cycle
        item.repetitionStage = 0;
        item.mastered = false;
        item.nextReviewAt = nextReview;

        if (status === 'incorrect') item.wrongCount++;
        else item.unsureCount++;

        if (reason) item.errorReason = reason;
        if (notes) item.notes = notes;
    } else {
        log.push({
            questionId: question.id,
            domain: question.domain,
            topic: question.topic || "General",
            dateLoggedAt: now,
            repetitionStage: 0,
            nextReviewAt: nextReview,
            mastered: false,

            answerStatus: status,
            lastOutcome: status,
            lastAttemptAt: now,

            attempts: 1,
            wrongCount: status === 'incorrect' ? 1 : 0,
            unsureCount: status === 'unsure' ? 1 : 0,
            confidentCount: 0,

            errorReason: reason,
            notes: notes
        });
    }
}

// --- Store Implementation ---

export const store = {
    // Reads raw storage and migrates if needed
    getErrorLog: (): ErrorLogItem[] => {
        if (typeof window === 'undefined') return [];

        try {
            const rawStr = localStorage.getItem(STORAGE_KEYS.ERROR_LOG);
            if (!rawStr) return [];

            const raw = JSON.parse(rawStr);
            return migrateErrorLogIfNeeded(raw);
        } catch (e) {
            console.error("Failed to parse error log", e);
            return [];
        }
    },

    saveErrorLog: (data: ErrorLogItem[]) => {
        if (typeof window === 'undefined') return;

        const storageObj: StorageSchema = {
            schemaVersion: CURRENT_SCHEMA_VERSION,
            data: data
        };
        localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(storageObj));
        
        // Background sync to Supabase
        store.syncUpErrorLog(data);
    },

    saveExamResult: (result: ExamResult) => {
        if (typeof window === 'undefined') return;
        const history = store.getExamHistory();
        history.push(result);
        localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history));

        // Background sync to Supabase
        store.syncUpExamHistory(history);
    },

    getExamHistory: (): ExamResult[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
        return data ? JSON.parse(data) : [];
    },

    // --- Supabase Sync Methods ---

    syncUpErrorLog: async (data: ErrorLogItem[]): Promise<SyncResult> => {
        if (!isSupabaseConfigured) return { state: 'disabled', message: 'Remote sync not configured' };
        try {
            // Upsert all items. questionId is the primary key.
            const { error } = await supabase
                .from('error_log')
                .upsert(data.map(item => ({
                    question_id: item.questionId,
                    domain: item.domain,
                    topic: item.topic,
                    mastered: item.mastered,
                    repetition_stage: item.repetitionStage,
                    date_logged_at: item.dateLoggedAt,
                    next_review_at: item.nextReviewAt,
                    last_attempt_at: item.lastAttemptAt,
                    answer_status: item.answerStatus,
                    last_outcome: item.lastOutcome,
                    attempts: item.attempts,
                    wrong_count: item.wrongCount,
                    unsure_count: item.unsureCount,
                    confident_count: item.confidentCount,
                    error_reason: item.errorReason,
                    notes: item.notes
                })));

            if (error) throw error;
            return { state: 'ok', message: 'Error log synced' };
        } catch (e) {
            console.error("Failed to sync error log to Supabase", e);
            return { state: 'error', message: e instanceof Error ? e.message : 'Sync failed' };
        }
    },

    syncUpExamHistory: async (history: ExamResult[]): Promise<SyncResult> => {
        if (!isSupabaseConfigured) return { state: 'disabled', message: 'Remote sync not configured' };
        try {
            const { error } = await supabase
                .from('exam_history')
                .upsert(history.map(item => ({
                    id: item.id,
                    date: item.date,
                    score: item.score,
                    total_questions: item.totalQuestions,
                    domain_scores: item.domainScores,
                    time_spent_seconds: item.timeSpentSeconds,
                    mode: item.mode,
                    // Without these a synced-down history cannot tell a real-conditions mock
                    // from a review run, nor report performance on unseen questions.
                    real_conditions: item.realConditions ?? null,
                    inconclusive: item.inconclusive ?? null,
                    fresh_total: item.freshTotal ?? null,
                    fresh_correct: item.freshCorrect ?? null
                })));

            if (error) throw error;
            return { state: 'ok', message: 'Exam history synced' };
        } catch (e) {
            console.error("Failed to sync exam history to Supabase", e);
            return { state: 'error', message: e instanceof Error ? e.message : 'Sync failed' };
        }
    },

    /**
     * The rows that carry per-question history to another device. One row per question,
     * with the two facts kept apart: seenAt is an ATTEMPT (the student answered it) and
     * exposedAt is EXPOSURE (it was shown with its answer). A question can be exposed
     * without ever being attempted, which is what happens to mock items that time ran out on.
     */
    buildExposurePayload: (): { question_id: string; seen_at: number | null; exposed_at: number | null }[] => {
        const seen = store.getSeen();
        const exposed = store.getExposed();
        const ids = new Set<string>([...Object.keys(seen), ...Object.keys(exposed)]);
        return [...ids].map(id => ({
            question_id: id,
            seen_at: seen[id] ?? null,
            exposed_at: exposed[id] ?? null
        }));
    },

    /**
     * Merges remote rows into the local maps, newest timestamp wins and nothing is deleted.
     * Re-running it is harmless, which is what makes reconnecting, reloading and restoring a
     * backup safe: the maps are keyed by question id, so a repeat cannot duplicate an attempt.
     */
    applyExposurePayload: (rows: { question_id: string; seen_at?: number | null; exposed_at?: number | null }[]) => {
        if (typeof window === 'undefined' || !rows?.length) return;
        const seen = store.getSeen();
        const exposed = store.getExposed();
        for (const row of rows) {
            if (!row?.question_id) continue;
            const s = typeof row.seen_at === 'number' ? row.seen_at : 0;
            const e = typeof row.exposed_at === 'number' ? row.exposed_at : 0;
            if (s > (seen[row.question_id] ?? 0)) seen[row.question_id] = s;
            if (e > (exposed[row.question_id] ?? 0)) exposed[row.question_id] = e;
        }
        localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(seen));
        localStorage.setItem(STORAGE_KEYS.EXPOSED, JSON.stringify(exposed));
    },

    /**
     * Merges exam rows coming from another device. A remote row that predates the four mock
     * columns must not erase what this device already knows, so a missing field falls back to
     * the local value. Keyed by exam id, so re-running it cannot duplicate a session.
     */
    applyRemoteExamHistory: (rows: Record<string, any>[]) => {
        if (typeof window === 'undefined' || !rows?.length) return;
        const merged = [...store.getExamHistory()];
        for (const remote of rows) {
            const idx = merged.findIndex(h => h.id === remote.id);
            const local = idx >= 0 ? merged[idx] : undefined;
            const transformed: ExamResult = {
                id: remote.id,
                date: remote.date,
                score: remote.score,
                totalQuestions: remote.total_questions,
                domainScores: remote.domain_scores,
                timeSpentSeconds: remote.time_spent_seconds,
                mode: remote.mode,
                realConditions: remote.real_conditions ?? local?.realConditions,
                inconclusive: remote.inconclusive ?? local?.inconclusive,
                freshTotal: remote.fresh_total ?? local?.freshTotal,
                freshCorrect: remote.fresh_correct ?? local?.freshCorrect
            };
            if (idx >= 0) merged[idx] = transformed; else merged.push(transformed);
        }
        localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(merged));
    },

    syncUpExposure: async (): Promise<SyncResult> => {
        if (!isSupabaseConfigured) return { state: 'disabled', message: 'Remote sync not configured' };
        const payload = store.buildExposurePayload();
        if (payload.length === 0) return { state: 'ok', message: 'No question history to sync' };
        try {
            const { error } = await supabase.from('question_exposure').upsert(payload);
            if (error) throw error;
            return { state: 'ok', message: 'Question history synced' };
        } catch (e) {
            console.error('Failed to sync question exposure to Supabase', e);
            return { state: 'error', message: e instanceof Error ? e.message : 'Sync failed' };
        }
    },

    syncDownExposure: async (): Promise<SyncResult> => {
        if (!isSupabaseConfigured) return { state: 'disabled', message: 'Remote sync not configured' };
        try {
            const { data, error } = await supabase.from('question_exposure').select('*');
            if (error) throw error;
            store.applyExposurePayload(data ?? []);
            return { state: 'ok', message: 'Question history restored' };
        } catch (e) {
            console.error('Failed to sync question exposure from Supabase', e);
            return { state: 'error', message: e instanceof Error ? e.message : 'Sync failed' };
        }
    },

    syncDown: async (): Promise<SyncResult> => {
        if (typeof window === 'undefined') return { state: 'disabled', message: 'Not in a browser' };
        if (!isSupabaseConfigured) return { state: 'disabled', message: 'Remote sync not configured' };

        try {
            console.log("Starting sync down from Supabase...");
            
            // 1. Fetch Error Log
            const { data: remoteErrorLog, error: err1 } = await supabase
                .from('error_log')
                .select('*');
            
            if (err1) throw err1;

            if (remoteErrorLog && remoteErrorLog.length > 0) {
                const localData = store.getErrorLog();
                const mergedErrorLog: ErrorLogItem[] = [...localData];
                
                remoteErrorLog.forEach(remote => {
                    const idx = mergedErrorLog.findIndex(l => l.questionId === remote.question_id);
                    const transformed: ErrorLogItem = {
                        questionId: remote.question_id,
                        domain: remote.domain,
                        topic: remote.topic,
                        mastered: remote.mastered,
                        repetitionStage: remote.repetition_stage,
                        dateLoggedAt: remote.date_logged_at,
                        nextReviewAt: remote.next_review_at,
                        lastAttemptAt: remote.last_attempt_at,
                        answerStatus: remote.answer_status, // Fixed mapping
                        lastOutcome: remote.last_outcome,
                        attempts: remote.attempts,
                        wrongCount: remote.wrong_count,
                        unsureCount: remote.unsure_count,
                        confidentCount: remote.confident_count,
                        errorReason: remote.error_reason,
                        notes: remote.notes
                    };

                    if (idx >= 0) {
                        mergedErrorLog[idx] = transformed;
                    } else {
                        mergedErrorLog.push(transformed);
                    }
                });
                
                const storageObj: StorageSchema = {
                    schemaVersion: CURRENT_SCHEMA_VERSION,
                    data: mergedErrorLog
                };
                localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(storageObj));
            }

            // 2. Fetch Exam History
            const { data: remoteHistory, error: err2 } = await supabase
                .from('exam_history')
                .select('*');

            if (err2) throw err2;

            if (remoteHistory && remoteHistory.length > 0) {
                store.applyRemoteExamHistory(remoteHistory);
            }

            return { state: 'ok', message: 'Sync complete' };
        } catch (e) {
            console.error("Failed to sync down from Supabase", e);
            return { state: 'error', message: e instanceof Error ? e.message : 'Sync failed' };
        }
    },

    /**
     * Pushes local data up, then pulls remote down. Reports the real outcome so the UI can
     * say "not backed up" instead of showing a timestamp after every request failed.
     */
    fullSync: async (): Promise<SyncResult> => {
        if (!isSupabaseConfigured) return { state: 'disabled', message: 'Remote sync not configured' };

        const results = [
            await store.syncUpErrorLog(store.getErrorLog()),
            await store.syncUpExamHistory(store.getExamHistory()),
            await store.syncUpExposure(),
            await store.syncDown(),
            await store.syncDownExposure(),
        ];

        const failed = results.find(r => r.state === 'error');
        if (failed) return failed;
        return { state: 'ok', message: 'Synced' };
    },

    /**
     * Probes the remote before claiming it works. Credentials being present in .env is not
     * the same as the project still existing, which is exactly how a dead backend can look
     * healthy in the UI while every write silently fails.
     */
    checkRemote: async (): Promise<SyncResult> => {
        if (!isSupabaseConfigured) {
            return { state: 'disabled', message: 'Cloud sync is not configured' };
        }
        try {
            const { error } = await supabase.from('exam_history').select('id').limit(1);
            if (error) throw error;
            return { state: 'ok', message: 'Cloud sync is working' };
        } catch (e) {
            return {
                state: 'error',
                message: e instanceof Error ? e.message : 'Cloud backend is unreachable'
            };
        }
    },

    // --- Backup / Restore (works with no server) ---

    /**
     * Every question attempted at least once. The error log only holds misses, so it
     * cannot measure coverage: a perfect run would read as 0% complete.
     *
     * On first read the set is seeded from what already exists, so progress made before
     * this was tracked is not lost: every logged question except mock-exam skips (shown
     * but never answered), plus the answered items of the last mock. Earlier correct
     * answers were never recorded anywhere, so coverage starts as a lower bound.
     */
    getSeen: (): Record<string, number> => {
        if (typeof window === 'undefined') return {};
        const raw = localStorage.getItem(STORAGE_KEYS.SEEN);
        if (raw) {
            try { return JSON.parse(raw); } catch { /* fall through and reseed */ }
        }

        const seen: Record<string, number> = {};
        for (const item of store.getErrorLog()) {
            if (item.errorReason === 'Skipped on mock exam') continue;
            seen[item.questionId] = item.lastAttemptAt ?? item.dateLoggedAt ?? Date.now();
        }
        try {
            const last = JSON.parse(localStorage.getItem('lastExamResult') || 'null');
            if (last?.questions && last?.answers) {
                const at = Date.parse(last.date) || Date.now();
                for (const idx of Object.keys(last.answers)) {
                    const q = last.questions[Number(idx)];
                    if (q?.id) seen[q.id] = Math.max(seen[q.id] ?? 0, at);
                }
            }
        } catch { /* a malformed last result only means a smaller seed */ }

        localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(seen));
        return seen;
    },

    markSeen: (questionIds: string[]) => {
        if (typeof window === 'undefined' || questionIds.length === 0) return;
        const seen = store.getSeen();
        const now = Date.now();
        for (const id of questionIds) seen[id] = now;
        localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(seen));
    },

    /**
     * Questions the student has actually been SHOWN, whether or not they answered.
     * A mock exam reveals every item (answered or not) on its result page, and practice
     * reveals the key when the answer is checked, so those questions are no longer new.
     * Kept apart from getSeen(), which holds attempts, because "I have seen this" and
     * "I have answered this" mean different things for both drawing and reporting.
     */
    getExposed: (): Record<string, number> => {
        if (typeof window === 'undefined') return {};
        try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPOSED) || '{}'); }
        catch { return {}; }
    },

    markExposed: (questionIds: string[]) => {
        if (typeof window === 'undefined' || questionIds.length === 0) return;
        const exposed = store.getExposed();
        const now = Date.now();
        for (const id of questionIds) exposed[id] = now;
        localStorage.setItem(STORAGE_KEYS.EXPOSED, JSON.stringify(exposed));
    },

    /** Anything already attempted OR merely shown: what "unseen first" must avoid. */
    getSeenOrExposed: (): Record<string, number> => {
        const merged = { ...store.getSeen() };
        for (const [id, at] of Object.entries(store.getExposed())) {
            if (at > (merged[id] ?? 0)) merged[id] = at;
        }
        return merged;
    },

    /**
     * Two different numbers, reported separately: questions ATTEMPTED (answered at least
     * once) and questions EXPOSED (shown with their answer, including mock items that ran
     * out of time and were revealed on the result page).
     */
    getCoverage: (validIds: Set<string>) => {
        const seen = store.getSeen();
        const exposedOnly = store.getExposed();
        let attempted = 0, exposed = 0;
        for (const id of Object.keys(seen)) if (validIds.has(id)) attempted++;
        const union = new Set<string>([...Object.keys(seen), ...Object.keys(exposedOnly)]);
        for (const id of union) if (validIds.has(id)) exposed++;
        return { attempted, exposed, total: validIds.size };
    },

    recordBackup: () => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(BACKUP_META_KEYS.LAST_BACKUP_AT, new Date().toISOString());
        localStorage.removeItem(BACKUP_META_KEYS.SNOOZED_UNTIL);
    },

    snoozeBackupReminder: () => {
        if (typeof window === 'undefined') return;
        const until = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000;
        localStorage.setItem(BACKUP_META_KEYS.SNOOZED_UNTIL, String(until));
    },

    /**
     * Decides whether to prompt for a backup. Keyed on study activity rather than the clock
     * alone: a week away from the app is not a reason to nag, an unsaved week of work is.
     */
    getBackupStatus: (): BackupStatus => {
        const idle: BackupStatus = {
            itemsAtRisk: 0, neverBackedUp: true, daysSinceBackup: null, due: false, urgent: false
        };
        if (typeof window === 'undefined') return idle;

        const log = store.getErrorLog();
        const history = store.getExamHistory();
        const itemsAtRisk = log.length + history.length;

        const lastBackupRaw = localStorage.getItem(BACKUP_META_KEYS.LAST_BACKUP_AT);
        const lastBackupAt = lastBackupRaw ? Date.parse(lastBackupRaw) : null;
        const neverBackedUp = lastBackupAt === null || Number.isNaN(lastBackupAt);

        const now = Date.now();
        const daysSinceBackup = neverBackedUp
            ? null
            : Math.floor((now - lastBackupAt!) / (24 * 60 * 60 * 1000));

        if (itemsAtRisk < MIN_ITEMS_WORTH_BACKING_UP) {
            return { ...idle, itemsAtRisk, neverBackedUp, daysSinceBackup };
        }

        const snoozedUntil = Number(localStorage.getItem(BACKUP_META_KEYS.SNOOZED_UNTIL) ?? 0);
        if (snoozedUntil > now) {
            return { itemsAtRisk, neverBackedUp, daysSinceBackup, due: false, urgent: false };
        }

        // Has anything actually happened since the last export?
        const lastActivityAt = Math.max(
            0,
            ...log.map(i => i.lastAttemptAt ?? i.dateLoggedAt ?? 0),
            ...history.map(h => Date.parse(h.date) || 0)
        );
        const hasUnsavedWork = neverBackedUp || lastActivityAt > lastBackupAt!;

        const due = hasUnsavedWork && (neverBackedUp || daysSinceBackup! >= REMIND_AFTER_DAYS);
        const urgent = due && (daysSinceBackup === null
            ? itemsAtRisk >= 50
            : daysSinceBackup >= URGENT_AFTER_DAYS);

        return { itemsAtRisk, neverBackedUp, daysSinceBackup, due, urgent };
    },

    /** Snapshots every persisted key into one portable object. */
    exportAll: (): BackupFile => ({
        format: BACKUP_FORMAT,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        data: {
            errorLog: store.getErrorLog(),
            examHistory: store.getExamHistory(),
            cdrProgress: store.getCdrProgress(),
            customQuestions: store.getCustomQuestions(),
            customProgress: store.getCustomProgress(),
            seenQuestions: store.getSeen(),
            exposedQuestions: store.getExposed(),
        }
    }),

    /**
     * Merges a backup into local storage, keeping whichever copy of each record was touched
     * most recently. Merging rather than replacing means restoring onto a device that already
     * has newer progress cannot silently throw that progress away.
     */
    importAll: (raw: unknown): { added: number; updated: number; examsAdded: number } => {
        const file = raw as Partial<BackupFile>;
        if (!file || file.format !== BACKUP_FORMAT || !file.data) {
            throw new Error('Not an RDN backup file.');
        }

        const incoming = file.data;
        let added = 0;
        let updated = 0;

        const log = store.getErrorLog();
        for (const item of incoming.errorLog ?? []) {
            const idx = log.findIndex(l => l.questionId === item.questionId);
            if (idx === -1) {
                log.push(item);
                added++;
            } else if ((item.lastAttemptAt ?? 0) > (log[idx].lastAttemptAt ?? 0)) {
                log[idx] = item;
                updated++;
            }
        }
        store.saveErrorLog(log);

        const history = store.getExamHistory();
        const seen = new Set(history.map(h => h.id));
        const newExams = (incoming.examHistory ?? []).filter(h => !seen.has(h.id));
        if (newExams.length > 0) {
            localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify([...history, ...newExams]));
        }

        // Progress maps are keyed by question id, so a plain merge is enough.
        store.saveCdrProgress({ ...(incoming.cdrProgress ?? {}), ...store.getCdrProgress() });
        store.saveCustomProgress({ ...(incoming.customProgress ?? {}), ...store.getCustomProgress() });
        store.addCustomQuestions(incoming.customQuestions ?? []);

        const seenMap = store.getSeen();
        for (const [id, at] of Object.entries(incoming.seenQuestions ?? {})) {
            if (at > (seenMap[id] ?? 0)) seenMap[id] = at;
        }
        localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(seenMap));

        // v1 and v2 backups carry no exposure map. Their attempts stay attempts; nothing is
        // invented about which questions were merely shown.
        const exposedMap = store.getExposed();
        for (const [id, at] of Object.entries(incoming.exposedQuestions ?? {})) {
            if (at > (exposedMap[id] ?? 0)) exposedMap[id] = at;
        }
        localStorage.setItem(STORAGE_KEYS.EXPOSED, JSON.stringify(exposedMap));

        return { added, updated, examsAdded: newExams.length };
    },

    // 1. Log Error (from Practice Mode)
    logError: (question: Question, status: 'incorrect' | 'unsure', reason?: string, notes?: string) => {
        const log = store.getErrorLog();
        applyErrorToLog(log, question, status, reason, notes);
        store.saveErrorLog(log);
    },

    /**
     * Logs many misses in one write. A finished mock exam can produce 40+ entries, and
     * calling logError per question would trigger one Supabase round trip each.
     */
    logErrorsBatch: (entries: { question: Question; status: 'incorrect' | 'unsure'; reason?: string }[]) => {
        if (entries.length === 0) return;

        const log = store.getErrorLog();
        for (const { question, status, reason } of entries) {
            applyErrorToLog(log, question, status, reason);
        }
        store.saveErrorLog(log);
    },

    // 2. Process Review Outcome (from Review Mode)
    processReviewOutcome: (questionId: string, outcome: 'confident' | 'unsure' | 'incorrect', reason?: string, notes?: string) => {
        const log = store.getErrorLog();
        const idx = log.findIndex(item => item.questionId === questionId);
        if (idx === -1) return;

        const item = log[idx];
        const now = Date.now();

        const wasUnsure = item.lastOutcome === 'unsure';

        item.attempts++;
        item.lastAttemptAt = now;
        item.lastOutcome = outcome;
        item.answerStatus = outcome;
        if (reason) item.errorReason = reason;
        if (notes) item.notes = notes;

        if (outcome === 'confident') {
            item.confidentCount++;

            const nextStage = item.repetitionStage + 1;
            if (nextStage >= INTERVALS_HOURS.length) {
                item.mastered = true;
                item.repetitionStage = nextStage;
                item.nextReviewAt = now;
            } else {
                item.repetitionStage = nextStage;
                item.nextReviewAt = now + hoursToMs(INTERVALS_HOURS[nextStage]);
            }

        } else if (outcome === 'unsure') {
            item.unsureCount++;
            item.mastered = false;

            if (wasUnsure) {
                item.repetitionStage = 0;
            }
            item.nextReviewAt = now + hoursToMs(INTERVALS_HOURS[0]);

        } else { // incorrect
            item.wrongCount++;
            item.mastered = false;
            item.repetitionStage = 0;
            item.nextReviewAt = now + hoursToMs(INTERVALS_HOURS[0]);
        }

        store.saveErrorLog(log);
    },

    // 3. Retrieval with Filters
    /**
     * Pass validIds (the ids currently in the bank) to drop orphans: log entries for
     * questions that were later removed. They can never be shown, so counting them
     * leaves a review permanently "due" and stalls the review screen on its loader.
     * The store cannot import the bank itself; it is loaded on every page via the
     * backup reminder, and the bank is 1.3 MB.
     */
    getDueReviews: (filters?: FilterOptions, validIds?: Set<string>): ErrorLogItem[] => {
        const log = store.getErrorLog();
        const now = Date.now();

        let due = log.filter(item =>
            !item.mastered && item.nextReviewAt <= now && (!validIds || validIds.has(item.questionId)));

        if (filters) {
            if (filters.overdueOnly) {
                const oneDayAgo = now - hoursToMs(24);
                due = due.filter(item => item.nextReviewAt < oneDayAgo);
            }
            if (filters.domain) {
                due = due.filter(item => item.domain === filters.domain);
            }
            if (filters.onlyUnsure) {
                due = due.filter(item => item.answerStatus === 'unsure');
            }
            if (filters.onlyIncorrect) {
                due = due.filter(item => item.answerStatus === 'incorrect');
            }
        }

        return due.sort((a, b) => a.nextReviewAt - b.nextReviewAt);
    },

    getReviewCounts: (validIds?: Set<string>) => {
        const log = store.getErrorLog().filter(item => !validIds || validIds.has(item.questionId));
        const now = Date.now();

        const due = log.filter(item => !item.mastered && item.nextReviewAt <= now);
        const mastered = log.filter(item => item.mastered).length;
        const total = log.length;

        const oneDayAgo = now - hoursToMs(24);
        const overdue = due.filter(item => item.nextReviewAt < oneDayAgo).length;

        const dueUnsure = due.filter(i => i.answerStatus === 'unsure').length;
        const dueIncorrect = due.filter(i => i.answerStatus === 'incorrect').length;

        return {
            due: due.length,
            overdue,
            mastered,
            total,
            dueUnsure,
            dueIncorrect
        };
    },

    // --- Stats & KPIs ---

    getStats: (days: number = 30) => {
        const history = store.getExamHistory();
        const log = store.getErrorLog();

        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const recentHistory = history.filter((h: ExamResult) => new Date(h.date).getTime() > cutoff);

        let totalCorrect = 0;
        let totalQuestions = 0;
        recentHistory.forEach((h: ExamResult) => {
            totalCorrect += h.score; 
            totalQuestions += h.totalQuestions;
        });
        const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        let totalAttempts = 0;
        let totalUnsure = 0;
        let itemsWithRepeatErrors = 0;

        log.forEach(item => {
            totalAttempts += item.attempts;
            totalUnsure += item.unsureCount;
            if (item.wrongCount >= 2) itemsWithRepeatErrors++;
        });

        const unsureRate = totalAttempts > 0 ? (totalUnsure / totalAttempts) * 100 : 0;
        const repeatErrorRate = log.length > 0 ? (itemsWithRepeatErrors / log.length) * 100 : 0;

        const domainStats: Record<string, { correct: number, total: number }> = {};

        recentHistory.forEach((h: ExamResult) => {
            Object.entries(h.domainScores).forEach(([domain, score]: [string, any]) => {
                if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
                domainStats[domain].correct += score.correct;
                domainStats[domain].total += score.total;
            });
        });

        const domainPerformance = Object.entries(domainStats).map(([domain, stats]) => ({
            domain,
            accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
            total: stats.total
        })).sort((a, b) => a.accuracy - b.accuracy); 

        return {
            accuracy,
            unsureRate,
            repeatErrorRate,
            domainPerformance
        };
    },

    // --- CDR Practice Module Progress ---
    getCdrProgress: (): Record<string, CdrProgress> => {
        if (typeof window === 'undefined') return {};
        const data = localStorage.getItem(STORAGE_KEYS.CDR_PROGRESS);
        return data ? JSON.parse(data) : {};
    },

    saveCdrProgress: (progress: Record<string, CdrProgress>) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.CDR_PROGRESS, JSON.stringify(progress));
    },

    updateCdrQuestionProgress: (questionId: string, updates: Partial<CdrProgress>) => {
        const progress = store.getCdrProgress();
        const existing = progress[questionId] || {
            questionId,
            status: 'not attempted',
            notes: '',
            markedForReview: false,
            attempts: 0
        };
        progress[questionId] = {
            ...existing,
            ...updates,
            lastAttemptedAt: Date.now()
        };
        store.saveCdrProgress(progress);
    },

    // --- Custom Generated Questions ---
    getCustomQuestions: (): CdrQuestion[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
        return data ? JSON.parse(data) : [];
    },

    saveCustomQuestions: (questions: CdrQuestion[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
    },

    addCustomQuestions: (newQuestions: CdrQuestion[]) => {
        const current = store.getCustomQuestions();
        const filteredNew = newQuestions.filter(nq => !current.some(cq => cq.id === nq.id));
        store.saveCustomQuestions([...current, ...filteredNew]);
    },

    // --- Custom Generated Questions Progress ---
    getCustomProgress: (): Record<string, CdrProgress> => {
        if (typeof window === 'undefined') return {};
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PROGRESS);
        return data ? JSON.parse(data) : {};
    },

    saveCustomProgress: (progress: Record<string, CdrProgress>) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.CUSTOM_PROGRESS, JSON.stringify(progress));
    },

    updateCustomQuestionProgress: (questionId: string, updates: Partial<CdrProgress>) => {
        const progress = store.getCustomProgress();
        const existing = progress[questionId] || {
            questionId,
            status: 'not attempted',
            notes: '',
            markedForReview: false,
            attempts: 0
        };
        progress[questionId] = {
            ...existing,
            ...updates,
            lastAttemptedAt: Date.now()
        };
        store.saveCustomProgress(progress);
    }
};
