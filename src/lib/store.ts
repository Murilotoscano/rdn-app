"use client";

import { Question, CdrQuestion } from "@/types";
import { supabase } from './supabaseClient';

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
};

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

    syncUpErrorLog: async (data: ErrorLogItem[]) => {
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
            console.log("Error log synced to Supabase");
        } catch (e) {
            console.error("Failed to sync error log to Supabase", e);
        }
    },

    syncUpExamHistory: async (history: ExamResult[]) => {
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
                    mode: item.mode
                })));

            if (error) throw error;
            console.log("Exam history synced to Supabase");
        } catch (e) {
            console.error("Failed to sync exam history to Supabase", e);
        }
    },

    syncDown: async () => {
        if (typeof window === 'undefined') return;

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
                const localHistory = store.getExamHistory();
                const mergedHistory = [...localHistory];

                remoteHistory.forEach(remote => {
                    const idx = mergedHistory.findIndex(h => h.id === remote.id);
                    const transformed: ExamResult = {
                        id: remote.id,
                        date: remote.date,
                        score: remote.score,
                        totalQuestions: remote.total_questions,
                        domainScores: remote.domain_scores,
                        timeSpentSeconds: remote.time_spent_seconds,
                        mode: remote.mode
                    };

                    if (idx >= 0) {
                        mergedHistory[idx] = transformed;
                    } else {
                        mergedHistory.push(transformed);
                    }
                });

                localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(mergedHistory));
            }

            console.log("Sync down complete.");
            return true;
        } catch (e) {
            console.error("Failed to sync down from Supabase", e);
            return false;
        }
    },

    fullSync: async () => {
        const localErrorLog = store.getErrorLog();
        const localHistory = store.getExamHistory();
        
        await store.syncUpErrorLog(localErrorLog);
        await store.syncUpExamHistory(localHistory);
        
        return await store.syncDown();
    },

    // 1. Log Error (from Practice Mode)
    logError: (question: Question, status: 'incorrect' | 'unsure', reason?: string, notes?: string) => {
        const log = store.getErrorLog();
        const idx = log.findIndex(item => item.questionId === question.id);
        const now = Date.now();
        const nextReview = now + hoursToMs(INTERVALS_HOURS[0]); // +24h

        if (idx >= 0) {
            // Existing item
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

            log[idx] = item;
        } else {
            // New item
            const newItem: ErrorLogItem = {
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
            };
            log.push(newItem);
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
    getDueReviews: (filters?: FilterOptions): ErrorLogItem[] => {
        const log = store.getErrorLog();
        const now = Date.now();

        let due = log.filter(item => !item.mastered && item.nextReviewAt <= now);

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

    getReviewCounts: () => {
        const log = store.getErrorLog();
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
        const data = localStorage.getItem('rdn_cdr_progress');
        return data ? JSON.parse(data) : {};
    },

    saveCdrProgress: (progress: Record<string, CdrProgress>) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('rdn_cdr_progress', JSON.stringify(progress));
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
        const data = localStorage.getItem('rdn_custom_questions');
        return data ? JSON.parse(data) : [];
    },

    saveCustomQuestions: (questions: CdrQuestion[]) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('rdn_custom_questions', JSON.stringify(questions));
    },

    addCustomQuestions: (newQuestions: CdrQuestion[]) => {
        const current = store.getCustomQuestions();
        const filteredNew = newQuestions.filter(nq => !current.some(cq => cq.id === nq.id));
        store.saveCustomQuestions([...current, ...filteredNew]);
    },

    // --- Custom Generated Questions Progress ---
    getCustomProgress: (): Record<string, CdrProgress> => {
        if (typeof window === 'undefined') return {};
        const data = localStorage.getItem('rdn_custom_progress');
        return data ? JSON.parse(data) : {};
    },

    saveCustomProgress: (progress: Record<string, CdrProgress>) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('rdn_custom_progress', JSON.stringify(progress));
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
