'use client';

import clsx from 'clsx';
import { Flag } from 'lucide-react';
import { Question } from '@/types';
import styles from './ExamQuestionCard.module.css';

interface Props {
    question: Question;
    selectedOption: number | undefined;
    isFlagged: boolean;
    onSelect: (idx: number) => void;
    onToggleFlag: () => void;
    questionIndex: number;
    totalQuestions: number;
}

export default function ExamQuestionCard({
    question,
    selectedOption,
    isFlagged,
    onSelect,
    onToggleFlag,
    questionIndex,
    totalQuestions
}: Props) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <span className={styles.number}>Questão {questionIndex + 1} de {totalQuestions}</span>
                    <span className={styles.domain}>{question.domain}</span>
                </div>
                <button
                    className={clsx(styles.flagBtn, { [styles.activeFlag]: isFlagged })}
                    onClick={onToggleFlag}
                    title="Marcar para revisão"
                >
                    <Flag size={18} fill={isFlagged ? "currentColor" : "none"} />
                    <span>{isFlagged ? 'Marcada' : 'Marcar'}</span>
                </button>
            </div>

            <div className={styles.body}>
                <h2 className={styles.text}>{question.text}</h2>

                <div className={styles.options}>
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className={clsx(styles.option, {
                                [styles.selected]: selectedOption === idx
                            })}
                            onClick={() => onSelect(idx)}
                        >
                            <span className={styles.letter}>{String.fromCharCode(65 + idx)}</span>
                            <span className={styles.content}>{opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
