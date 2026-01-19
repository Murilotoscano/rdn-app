"use client";

import { Question } from "@/types";

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

            item.dateLoggedAt = now; // Update timestamp on re-log
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

        // Track consecutive unsure logic
        const wasUnsure = item.lastOutcome === 'unsure';

        // Common updates
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
                // Mastered
                item.mastered = true;
                item.repetitionStage = nextStage;
                // Clean nextReviewAt for mastered items to avoid cluttering index, purely metadata now
                item.nextReviewAt = now;
            } else {
                item.repetitionStage = nextStage;
                item.nextReviewAt = now + hoursToMs(INTERVALS_HOURS[nextStage]);
            }

        } else if (outcome === 'unsure') {
            item.unsureCount++;
            item.mastered = false;

            // Strict Rule: If 2 consecutive unsures, reset stage.
            if (wasUnsure) {
                item.repetitionStage = 0;
            }
            // Else keep stage, but don't advance.

            // Schedule for tomorrow
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

        // Breakdown outcomes in due
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

        // Filter history by last N days (placeholder logic until dates are epoch in history too)
        // Assume history dates are ISO string
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        const recentHistory = history.filter(h => new Date(h.date).getTime() > cutoff);

        // 1. Accuracy (Overall from history)
        let totalCorrect = 0;
        let totalQuestions = 0;
        recentHistory.forEach(h => {
            totalCorrect += h.score; // Assuming score is number of correct
            totalQuestions += h.totalQuestions;
        });
        const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        // 2. Unsure Rate (From Log metadata - difficult to calc historically without event log, 
        //    so we use current snapshot of "unsureCount" vs "attempts" for active items?)
        //    Better: sum(unsureCount) / sum(attempts) across all log items
        let totalAttempts = 0;
        let totalUnsure = 0;
        let itemsWithRepeatErrors = 0;

        log.forEach(item => {
            totalAttempts += item.attempts;
            totalUnsure += item.unsureCount;
            if (item.wrongCount >= 2) itemsWithRepeatErrors++;
        });

        const unsureRate = totalAttempts > 0 ? (totalUnsure / totalAttempts) * 100 : 0;

        // 3. Repeat Error Rate (% of log items that are repeat offenders)
        const repeatErrorRate = log.length > 0 ? (itemsWithRepeatErrors / log.length) * 100 : 0;

        // 4. Domain Performance
        // Aggregate from history
        const domainStats: Record<string, { correct: number, total: number }> = {};

        recentHistory.forEach(h => {
            Object.entries(h.domainScores).forEach(([domain, score]) => {
                if (!domainStats[domain]) domainStats[domain] = { correct: 0, total: 0 };
                domainStats[domain].correct += score.correct;
                domainStats[domain].total += score.total;
            });
        });

        const domainPerformance = Object.entries(domainStats).map(([domain, stats]) => ({
            domain,
            accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
            total: stats.total
        })).sort((a, b) => a.accuracy - b.accuracy); // Ascending (weakest first)

        return {
            accuracy,
            unsureRate,
            repeatErrorRate,
            domainPerformance
        };
    },

    // --- Exam History ---

    saveExamResult: (result: ExamResult) => {
        if (typeof window === 'undefined') return;
        const history = store.getExamHistory();
        history.push(result);
        localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history));
    },

    getExamHistory: (): ExamResult[] => {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
        return data ? JSON.parse(data) : [];
    }
};
