"use client";

import React, { useEffect, useState, Suspense } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { getQuestionsByIds } from "@/lib/questions";
import { store, ErrorLogItem } from "@/lib/store";
import { Question } from "@/types";
import QuestionCard, { AnswerStatus } from "@/components/Quiz/QuestionCard";
import FeedbackModal from "@/components/Quiz/FeedbackModal";
import styles from "../practice/practice.module.css";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ReviewContent() {
    const searchParams = useSearchParams();
    const filterMode = searchParams.get('filter') || 'all';

    const [dueItems, setDueItems] = useState<ErrorLogItem[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currIndex, setCurrIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);

    // Session stats
    const [recalledCount, setRecalledCount] = useState(0);

    // Feedback Capture State
    const [showFeedback, setShowFeedback] = useState(false);
    const [pendingOutcome, setPendingOutcome] = useState<{ idx: number, status: AnswerStatus, outcome: 'unsure' | 'incorrect' } | null>(null);

    useEffect(() => {
        async function load() {
            const filters: any = {};
            if (filterMode === 'overdue') filters.overdueOnly = true;
            if (filterMode === 'unsure') filters.onlyUnsure = true;
            if (filterMode === 'incorrect') filters.onlyIncorrect = true;

            const due = store.getDueReviews(filters);
            setDueItems(due);
            setLoading(false);
        }
        load();
    }, [filterMode]);

    useEffect(() => {
        async function fetchQuestions() {
            if (dueItems.length === 0) return;
            const qs = await getQuestionsByIds(dueItems.map(i => i.questionId));
            setQuestions(qs);
        }
        if (dueItems.length > 0) fetchQuestions();
    }, [dueItems]);

    const handleAnswer = (idx: number, status: AnswerStatus) => {
        const q = questions[currIndex];
        const isCorrect = idx === q.correctIndex;

        let outcome: 'confident' | 'unsure' | 'incorrect';
        if (!isCorrect) outcome = 'incorrect';
        else if (status === 'unsure') outcome = 'unsure';
        else outcome = 'confident';

        if (outcome === 'confident') {
            setRecalledCount(c => c + 1);
            store.processReviewOutcome(q.id, 'confident');
        } else {
            // Open Feedback Modal
            setPendingOutcome({ idx, status, outcome });
            setShowFeedback(true);
        }
    };

    const confirmFeedback = (reason: string, notes: string) => {
        if (!pendingOutcome) return;
        const q = questions[currIndex];

        store.processReviewOutcome(
            q.id,
            pendingOutcome.outcome,
            reason,
            notes
        );

        // Reset and close
        setShowFeedback(false);
        setPendingOutcome(null);
    };

    const handleNext = () => {
        if (showFeedback) return;

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
                <p>Checking reviews...</p>
            </div>
        );
    }

    if (dueItems.length === 0) {
        return (
            <div className={styles.resultCard}>
                <CheckCircle2 size={64} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                <h1>All Caught Up!</h1>
                <p>
                    {filterMode === 'all'
                        ? "You have no pending reviews for today."
                        : `No ${filterMode} reviews pending.`}
                </p>
                <div className={styles.actions}>
                    <Link href="/practice" className="btn btn-primary">Start New Practice</Link>
                    <Link href="/" className="btn">Dashboard</Link>
                </div>
            </div>
        );
    }

    if (questions.length === 0 && dueItems.length > 0) {
        return (
            <div className={styles.center}>
                <Loader2 className={styles.spin} size={48} />
                <p>Loading review cards...</p>
            </div>
        );
    }

    if (completed) {
        return (
            <div className={styles.resultCard}>
                <h1>Review Session Done!</h1>
                <p>You recalled {recalledCount} out of {questions.length} items.</p>
                <div className={styles.actions}>
                    <Link href="/" className="btn btn-primary">Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Link href="/" className={styles.backLink}>← Back</Link>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '8px' }}>
                <span className={styles.tag} style={{ background: '#e0e7ff', color: '#3730a3' }}>
                    Spaced Repetition Review
                </span>
                {filterMode !== 'all' && (
                    <span className={styles.tag} style={{ background: '#fee2e2', color: '#b91c1c', textTransform: 'capitalize' }}>
                        Filter: {filterMode}
                    </span>
                )}
            </div>

            <QuestionCard
                question={questions[currIndex]}
                currIndex={currIndex}
                total={questions.length}
                onAnswer={handleAnswer}
                onNext={handleNext}
            />

            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => { }}
                onConfirm={confirmFeedback}
                title={pendingOutcome?.outcome === 'unsure' ? "Why were you unsure?" : "Why did you miss this?"}
            />
        </div>
    );
}

export default function ReviewPage() {
    return (
        <AppLayout>
            <Suspense fallback={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Loader2 className="animate-spin" size={48} />
                </div>
            }>
                <ReviewContent />
            </Suspense>
        </AppLayout>
    );
}
