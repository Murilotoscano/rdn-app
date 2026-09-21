'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { Question } from '@/types';
import { store } from '@/lib/store';
import { EXAM_MINUTES, EXAM_MIN_ANSWERED } from '@/lib/examRules';
import Timer from './Timer';
import ExamQuestionCard from './ExamQuestionCard';
import ReviewModal from './ReviewModal';
import styles from './ExamInterface.module.css';

interface Props {
    questions: Question[];
    /** Ids of questions this student had never attempted before this exam. */
    freshIds: Set<string>;
    /**
     * Real exam rules: no going back, no skipping, no flag-and-review, answer to advance,
     * and only answered questions are scored. Off keeps the older review-friendly mock.
     */
    realConditions: boolean;
    freshHistoryAvailable?: boolean;
}

export default function ExamInterface({ questions, freshIds, realConditions, freshHistoryAvailable = true }: Props) {
    const router = useRouter();
    const [currIndex, setCurrIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [startedAt] = useState(() => Date.now());
    // The timer's onTimeUp and the Finish button can both fire; only score once.
    const finishedRef = useRef(false);
    const [flags, setFlags] = useState<Record<number, boolean>>({});
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const answeredCurrent = answers[currIndex] !== undefined;
    const isLast = currIndex === questions.length - 1;

    const handleAnswer = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currIndex]: optionIndex }));
    };

    const toggleFlag = () => {
        setFlags(prev => ({ ...prev, [currIndex]: !prev[currIndex] }));
    };

    const handleNext = () => {
        // The real exam will not advance without a response.
        if (realConditions && !answeredCurrent) return;
        if (currIndex < questions.length - 1) {
            setCurrIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currIndex > 0) {
            setCurrIndex(prev => prev - 1);
        }
    };

    const handleFinish = useCallback(() => {
        if (finishedRef.current) return;
        finishedRef.current = true;

        // Under real rules an unanswered question was never reached (time ran out), so it is
        // not scored, exactly as on the adaptive exam. In review mode every question counts
        // and a skip is logged as "unsure".
        const scored = questions
            .map((q, idx) => ({ q, answer: answers[idx] }))
            .filter(({ answer }) => !realConditions || answer !== undefined);

        let score = 0;
        let freshTotal = 0;
        let freshCorrect = 0;
        const domainScores: Record<string, { correct: number; total: number }> = {};
        const misses: { question: Question; status: 'incorrect' | 'unsure'; reason?: string }[] = [];

        for (const { q, answer } of scored) {
            if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
            domainScores[q.domain].total++;

            const correct = answer === q.correctIndex;
            const fresh = freshIds.has(q.id);
            if (fresh) freshTotal++;

            if (correct) {
                score++;
                domainScores[q.domain].correct++;
                if (fresh) freshCorrect++;
            } else {
                // A skipped question is "unsure" rather than "incorrect": no wrong belief to correct.
                misses.push({
                    question: q,
                    status: answer === undefined ? 'unsure' : 'incorrect',
                    reason: answer === undefined ? 'Skipped on mock exam' : 'Missed on mock exam'
                });
            }
        }

        const answeredCount = Object.keys(answers).length;
        const inconclusive = realConditions && answeredCount < EXAM_MIN_ANSWERED;
        const date = new Date().toISOString();

        // Without this the mock never reaches getStats(), so accuracy and the dashboard's
        // readiness score stay pinned at 0 no matter how many exams are taken.
        store.saveExamResult({
            id: `mock-${Date.now()}`,
            date,
            score,
            totalQuestions: scored.length,
            domainScores,
            timeSpentSeconds: Math.round((Date.now() - startedAt) / 1000),
            mode: 'mock',
            realConditions,
            inconclusive,
            freshTotal: freshHistoryAvailable ? freshTotal : undefined,
            freshCorrect: freshHistoryAvailable ? freshCorrect : undefined
        });

        // And this is what puts the mock's misses into the review queue.
        store.logErrorsBatch(misses);
        // Attempts and exposure are different facts. Answered items are attempts; every item
        // in the exam is exposed, because the result page prints the correct answer for all
        // of them, including the ones time ran out on.
        store.markSeen(questions.filter((_, idx) => answers[idx] !== undefined).map(q => q.id));
        store.markExposed(questions.map(q => q.id));

        const resultData = {
            score,
            total: scored.length,
            answers,
            questions, // Ideally don't store full questions in LS, but OK for MVP
            date,
            realConditions,
            inconclusive,
            answeredCount,
            freshTotal: freshHistoryAvailable ? freshTotal : undefined,
            freshCorrect: freshHistoryAvailable ? freshCorrect : undefined
        };
        localStorage.setItem('lastExamResult', JSON.stringify(resultData));

        router.push('/simulation/result');
    }, [answers, questions, router, startedAt, freshIds, realConditions, freshHistoryAvailable]);

    const currQuestion = questions[currIndex];

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>RDN Mock Exam</h1>
                    <span className={styles.subtitle}>
                        {currIndex + 1} of {questions.length}
                        {realConditions ? ' · Exam conditions · fixed form, not adaptive' : ' · Review mode'}
                    </span>
                </div>

                <div className={styles.headerRight}>
                    <Timer
                        durationInSeconds={EXAM_MINUTES * 60}
                        startedAt={startedAt}
                        onTimeUp={handleFinish}
                    />
                    {!realConditions && (
                        <button
                            className={styles.reviewBtn}
                            onClick={() => setIsReviewOpen(true)}
                        >
                            <Grid size={20} />
                            <span>Review</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <ExamQuestionCard
                    question={currQuestion}
                    selectedOption={answers[currIndex]}
                    isFlagged={!!flags[currIndex]}
                    onSelect={handleAnswer}
                    onToggleFlag={toggleFlag}
                    questionIndex={currIndex}
                    totalQuestions={questions.length}
                    showFlag={!realConditions}
                    showDomain={!realConditions}
                />
            </main>

            {/* Footer Controls */}
            <footer className={styles.footer}>
                {realConditions ? (
                    <span className={styles.subtitle}>
                        {answeredCurrent ? 'Answer locked in when you continue.' : 'Select an answer to continue.'}
                    </span>
                ) : (
                    <>
                        <button
                            className={styles.navBtn}
                            onClick={handlePrev}
                            disabled={currIndex === 0}
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </button>

                        <button
                            className={styles.navBtn}
                            onClick={() => setIsReviewOpen(true)}
                        >
                            Review All
                        </button>
                    </>
                )}

                {isLast ? (
                    <button
                        className={styles.finishBtn}
                        onClick={handleFinish}
                        disabled={realConditions && !answeredCurrent}
                    >
                        End Exam
                    </button>
                ) : (
                    <button
                        className={styles.navBtn}
                        onClick={handleNext}
                        disabled={realConditions && !answeredCurrent}
                    >
                        Next
                        <ChevronRight size={20} />
                    </button>
                )}
            </footer>

            {!realConditions && (
                <ReviewModal
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    totalQuestions={questions.length}
                    answers={answers}
                    flags={flags}
                    onJumpTo={setCurrIndex}
                    onFinish={handleFinish}
                />
            )}
        </div>
    );
}
