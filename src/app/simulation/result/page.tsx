'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Question } from '@/types';
import styles from './Result.module.css';

interface ResultData {
    score: number;
    total: number;
    answers: Record<number, number>;
    questions: Question[]; // Note: In a real app we might refetch by ID
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

    const percentage = Math.round((data.score / data.total) * 100);
    const passed = percentage >= 70; // 70% passing score assumption

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Exam Results</h1>
                <Link href="/" className={styles.exitBtn}>Exit</Link>
            </header>

            <div className={styles.summaryCard}>
                <div className={styles.scoreCircle} style={{ borderColor: passed ? 'var(--success)' : 'var(--error)' }}>
                    <span className={styles.scoreValue}>{percentage}%</span>
                    <span className={styles.scoreLabel}>{data.score} / {data.total}</span>
                </div>
                <div className={styles.verdict}>
                    {passed ? (
                        <h2 style={{ color: 'var(--success)' }}>Passed! 🎉</h2>
                    ) : (
                        <h2 style={{ color: 'var(--error)' }}>Needs Improvement 📚</h2>
                    )}
                    <p>To pass the real RDN exam, you need consistency above 80% (scaled score 25/50).</p>
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
                                    <span className={styles.badgeSkip}><AlertTriangle size={14} /> Skipped</span>
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
