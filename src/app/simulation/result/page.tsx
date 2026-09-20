'use client';

import { MIN_FRESH_FOR_VERDICT } from "@/lib/targets";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Question } from '@/types';
import styles from './Result.module.css';
import { PRACTICE_TARGET_PCT } from '@/lib/targets';
import { EXAM_MIN_ANSWERED, EXAM_MINUTES } from '@/lib/examRules';



interface ResultData {
    score: number;
    total: number;
    answers: Record<number, number>;
    questions: Question[]; // Note: In a real app we might refetch by ID
    // Absent on results saved before exam conditions existed.
    realConditions?: boolean;
    inconclusive?: boolean;
    answeredCount?: number;
    freshTotal?: number;
    freshCorrect?: number;
}

export default function ResultPage() {
    const [data, setData] = useState<ResultData | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('lastExamResult');
        if (stored) {
            setData(JSON.parse(stored));
        }
    }, []);

    if (!data) return <div className={styles.loading}>Loading results...</div>;

    const percentage = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;

    // A score on questions already seen partly measures memory. When enough of the exam was
    // new, judge on those; otherwise judge on everything and say so.
    const freshTotal = data.freshTotal ?? 0;
    const freshPct = freshTotal > 0 ? Math.round(((data.freshCorrect ?? 0) / freshTotal) * 100) : null;
    const judgeOnFresh = freshPct !== null && freshTotal >= MIN_FRESH_FOR_VERDICT;
    const verdictPct = judgeOnFresh ? freshPct : percentage;
    const onTarget = !data.inconclusive && verdictPct >= PRACTICE_TARGET_PCT;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Exam Results</h1>
                <Link href="/" className={styles.exitBtn}>Exit</Link>
            </header>

            <div className={styles.summaryCard}>
                <div className={styles.scoreCircle} style={{ borderColor: onTarget ? 'var(--success)' : 'var(--error)' }}>
                    <span className={styles.scoreValue}>{percentage}%</span>
                    <span className={styles.scoreLabel}>{data.score} / {data.total}</span>
                </div>
                <div className={styles.verdict}>
                    {data.inconclusive ? (
                        <h2 style={{ color: 'var(--error)' }}>Inconclusive ⏱️</h2>
                    ) : onTarget ? (
                        <h2 style={{ color: 'var(--success)' }}>On Target 🎯</h2>
                    ) : (
                        <h2 style={{ color: 'var(--error)' }}>Below Target 📚</h2>
                    )}
                    {data.inconclusive && (
                        <p style={{ fontWeight: 600 }}>
                            You answered {data.answeredCount ?? data.total} questions before time ran out.
                            The real exam requires at least {EXAM_MIN_ANSWERED} in {EXAM_MINUTES / 60} hours,
                            and fewer is scored as a fail. Pace for about {Math.floor((EXAM_MINUTES * 60) / EXAM_MIN_ANSWERED)} seconds per question or less.
                        </p>
                    )}
                    {freshPct !== null && (
                        <p>
                            <strong>{freshPct}%</strong> on the {freshTotal} question{freshTotal === 1 ? '' : 's'} new to you
                            ({data.freshCorrect}/{freshTotal}).{' '}
                            {judgeOnFresh
                                ? 'The verdict uses this number, since questions you have seen before can be answered from memory.'
                                : `Too few new questions to judge on alone, so the verdict uses the overall score.`}
                        </p>
                    )}
                    {data.freshTotal === 0 && (
                        <p>Every question in this exam was one you had attempted before, so this score partly reflects memory.</p>
                    )}
                    <p>
                        Aim to score {PRACTICE_TARGET_PCT}% or higher consistently across mock exams.
                        This is a practice benchmark, not a prediction: this mock is a fixed
                        145-question form, while the real exam is computer adaptive and reports
                        a scaled score, with 25 on a 1-50 scale required to pass.
                    </p>
                </div>
            </div>

            <div className={styles.reviewList}>
                <h3>Question by Question Review</h3>
                {data.questions.map((q, idx) => {
                    const userAnswer = data.answers[idx];
                    const isCorrect = userAnswer === q.correctIndex;
                    const isSkipped = userAnswer === undefined;

                    return (
                        <div key={idx} className={styles.reviewItem}>
                            <div className={styles.itemHeader}>
                                <span className={styles.qNum}>#{idx + 1}</span>
                                {isSkipped ? (
                                    <span className={styles.badgeSkip}>
                                        <AlertTriangle size={14} /> {data.realConditions ? 'Not reached' : 'Skipped'}
                                    </span>
                                ) : isCorrect ? (
                                    <span className={styles.badgeCorrect}><CheckCircle size={14} /> Correct</span>
                                ) : (
                                    <span className={styles.badgeWrong}><XCircle size={14} /> Incorrect</span>
                                )}
                                <span className={styles.domain}>{q.domain}</span>
                            </div>
                            <p className={styles.qText}>{q.text}</p>

                            {!isCorrect && (
                                <div className={styles.explanation}>
                                    <strong>Correct Answer: {q.options[q.correctIndex]}</strong>
                                    <p>{q.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
