"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { getQuestions } from "@/lib/questions";
import { store } from "@/lib/store";
import { Question } from "@/types";
import QuestionCard, { AnswerStatus } from "@/components/Quiz/QuestionCard";
import FeedbackModal from "@/components/Quiz/FeedbackModal";
import styles from "./practice.module.css";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PendingAction {
    idx: number;
    status: AnswerStatus;
    outcome: 'incorrect' | 'unsure';
}

function PracticeContent() {
    const params = useSearchParams();
    const mode = params.get("mode") || "quick";
    const domainId = params.get("id") || undefined;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currIndex, setCurrIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [startedAt] = useState(() => Date.now());
    // Per-question outcome, keyed by question id. A ref rather than state because the last
    // question's result must be readable by saveSession in the same interaction that records it.
    const outcomesRef = useRef<Record<string, boolean>>({});

    // Feedback logic
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    useEffect(() => {
        async function load() {
            const limit = mode === 'quick' ? 30 : 25;
            // domainId comes from /modules (?mode=domain&id=2); it was previously dropped,
            // so every "study one domain" link served questions from all four.
            const qs = await getQuestions(domainId, limit);
            setQuestions(qs);
            setLoading(false);
        }
        load();
    }, [mode, domainId]);

    const handleAnswer = (idx: number, status: AnswerStatus) => {
        const q = questions[currIndex];
        const isCorrect = idx === q.correctIndex;

        // Answering correctly but unsure still counts as correct for scoring; the uncertainty
        // is captured separately in the error log.
        outcomesRef.current[q.id] = isCorrect;

        if (isCorrect && status === 'confident') {
            setScore(s => s + 1);
            // No log needed for correct confident in practice mode (or maybe log as correct? Req only asks for errors/unsure)
        } else {
            // Capture reason
            let outcome: 'incorrect' | 'unsure' = 'incorrect';
            if (isCorrect && status === 'unsure') {
                setScore(s => s + 1);
                outcome = 'unsure';
            }

            setPendingAction({ idx, status, outcome });
            setShowModal(true);
        }
    };

    const handleFeedbackConfirm = (reason: string, notes: string) => {
        if (!pendingAction) return;

        const q = questions[currIndex];
        store.logError(q, pendingAction.outcome, reason, notes);

        setShowModal(false);
        setPendingAction(null);
    };

    const saveSession = () => {
        const outcomes = outcomesRef.current;
        const answered = questions.filter(q => q.id in outcomes);
        if (answered.length === 0) return;

        // Real per-domain tallies. Averaging the session score across domains would wash out
        // the weak-domain signal that Stats ranks on.
        const domainScores: Record<string, { correct: number; total: number }> = {};
        let finalScore = 0;

        answered.forEach(q => {
            if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
            domainScores[q.domain].total++;
            if (outcomes[q.id]) {
                domainScores[q.domain].correct++;
                finalScore++;
            }
        });

        store.saveExamResult({
            id: `practice-${Date.now()}`,
            date: new Date().toISOString(),
            score: finalScore,
            totalQuestions: answered.length,
            domainScores,
            timeSpentSeconds: Math.round((Date.now() - startedAt) / 1000),
            mode: 'practice'
        });
    };

    const handleNext = () => {
        if (showModal) return; // Block next if modal open

        if (currIndex < questions.length - 1) {
            setCurrIndex(c => c + 1);
        } else {
            saveSession();
            setCompleted(true);
        }
    };

    if (loading) {
        return (
            <div className={styles.center}>
                <Loader2 className={styles.spin} size={48} />
                <p>Loading questions...</p>
            </div>
        );
    }

    if (completed) {
        return (
            <div className={styles.resultCard}>
                <h1>Session Completed! 🎉</h1>
                <div className={styles.scoreCircle}>
                    {Math.round((score / questions.length) * 100)}%
                </div>
                <p>You got {score} out of {questions.length} questions correct.</p>
                <div className={styles.actions}>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Practice Again
                    </button>
                    <Link href="/" className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>← Back</Link>
            <QuestionCard
                question={questions[currIndex]}
                currIndex={currIndex}
                total={questions.length}
                onAnswer={handleAnswer}
                onNext={handleNext}
            />

            <FeedbackModal
                isOpen={showModal}
                onClose={() => { }} // Block close without selection
                onConfirm={handleFeedbackConfirm}
                title={pendingAction?.outcome === 'unsure' ? "Why were you unsure?" : "Why did you miss this?"}
            />
        </div>
    );
}

export default function PracticePage() {
    return (
        <AppLayout>
            <Suspense fallback={
                <div className={styles.center}>
                    <Loader2 className={styles.spin} size={48} />
                </div>
            }>
                <PracticeContent />
            </Suspense>
        </AppLayout>
    );
}
