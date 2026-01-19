"use client";

import React, { useState, useEffect, Suspense } from "react";
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

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currIndex, setCurrIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [score, setScore] = useState(0);

    // Feedback logic
    const [showModal, setShowModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    useEffect(() => {
        async function load() {
            // Set limit to 30 for quick practice
            const limit = mode === 'quick' ? 30 : 10;
            const qs = await getQuestions(undefined, limit);
            setQuestions(qs);
            setLoading(false);
        }
        load();
    }, []);

    const handleAnswer = (idx: number, status: AnswerStatus) => {
        const q = questions[currIndex];
        const isCorrect = idx === q.correctIndex;

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

    const handleNext = () => {
        if (showModal) return; // Block next if modal open

        if (currIndex < questions.length - 1) {
            setCurrIndex(c => c + 1);
        } else {
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
