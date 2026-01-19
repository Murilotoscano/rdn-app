"use client";

import React, { useState } from "react";
import styles from "./QuestionCard.module.css";
import { Question } from "@/types";
import clsx from "clsx";
import { CheckCircle, XCircle } from "lucide-react";

export type AnswerStatus = 'confident' | 'unsure';

interface Props {
    question: Question;
    onAnswer: (index: number, status: AnswerStatus) => void;
    onNext: () => void;
    currIndex: number;
    total: number;
}

export default function QuestionCard({ question, onAnswer, onNext, currIndex, total }: Props) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

    // Reset state when question changes
    React.useEffect(() => {
        setSelected(null);
        setIsSubmitted(false);
        setTimeLeft(null);
        setIsCorrect(false);
        setAwaitingConfirmation(false);
    }, [question.id]);

    const handleSelect = (idx: number) => {
        if (isSubmitted) return;
        setSelected(idx);
    };

    const submit = () => {
        if (selected === null) return;

        setIsSubmitted(true);
        const correct = selected === question.correctIndex;
        setIsCorrect(correct);

        if (correct) {
            setAwaitingConfirmation(true);
        } else {
            // Incorrect: Report immediately (defaults to confident/neutral status as it's wrong anyway)
            onAnswer(selected, 'confident');
        }
    };

    const confirmStatus = (status: AnswerStatus) => {
        if (selected === null) return;
        setAwaitingConfirmation(false);
        onAnswer(selected, status);
    };

    // Auto-advance logic (Only if NOT awaiting confirmation)
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        let interval: NodeJS.Timeout;

        // Auto advance only if submitted, correct, AND confirmed (not awaiting)
        if (isSubmitted && isCorrect && !awaitingConfirmation) {
            setTimeLeft(3); // Faster auto-advance

            timer = setTimeout(() => {
                onNext();
            }, 3000);

            interval = setInterval(() => {
                setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);
        }

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [isSubmitted, isCorrect, awaitingConfirmation, onNext]);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span>Question {currIndex + 1} of {total}</span>
                <div className={styles.tags}>
                    <span className={styles.tag}>{question.domain}</span>
                    <span className={styles.tag}>{question.difficulty}</span>
                </div>
            </div>

            <h2 className={styles.questionText}>{question.text}</h2>

            <div className={styles.options}>
                {question.options.map((opt, idx) => {
                    let stateClass = "";

                    if (isSubmitted) {
                        if (idx === question.correctIndex) stateClass = styles.correct;
                        else if (idx === selected) stateClass = styles.incorrect;
                    } else {
                        if (idx === selected) stateClass = styles.selected;
                    }

                    return (
                        <button
                            key={idx}
                            className={clsx(styles.optionBtn, stateClass)}
                            onClick={() => handleSelect(idx)}
                            disabled={isSubmitted}
                        >
                            <span style={{ marginRight: 12, fontWeight: 700 }}>{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {isSubmitted && (
                <div className={styles.feedback}>
                    <div className={styles.feedbackTitle} style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                        {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                    </div>
                    <p style={{ lineHeight: 1.6 }}>{question.explanation}</p>
                </div>
            )}

            <div className={styles.actions}>
                {!isSubmitted ? (
                    <button
                        className="btn btn-primary"
                        onClick={submit}
                        disabled={selected === null}
                        style={{ width: '100%', opacity: selected === null ? 0.5 : 1 }}
                    >
                        Check Answer
                    </button>
                ) : (
                    <div style={{ width: '100%' }}>
                        {isCorrect && awaitingConfirmation ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>How confident were you?</p>
                                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => confirmStatus('confident')}
                                        style={{ flex: 1 }}
                                    >
                                        Confident
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => confirmStatus('unsure')}
                                        style={{ flex: 1, background: '#f59e0b', color: 'white', border: 'none' }}
                                    >
                                        Unsure / Guessed
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                                {isCorrect && timeLeft !== null && timeLeft > 0 && (
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        Next in {timeLeft}s...
                                    </span>
                                )}
                                <button className="btn btn-primary" onClick={onNext}>
                                    Next Question
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
