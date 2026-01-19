'use client';

import clsx from 'clsx';
import { X, Flag } from 'lucide-react';
import styles from './ReviewModal.module.css';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalQuestions: number;
    answers: Record<number, number>; // index -> selected option index
    flags: Record<number, boolean>; // index -> is flagged
    onJumpTo: (index: number) => void;
    onFinish: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    totalQuestions,
    answers,
    flags,
    onJumpTo,
    onFinish
}: ReviewModalProps) {
    if (!isOpen) return null;

    const answeredCount = Object.keys(answers).length;
    const flaggedCount = Object.values(flags).filter(Boolean).length;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Revisão do Exame</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Respondidas</span>
                        <span className={styles.value}>{answeredCount}/{totalQuestions}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.label}>Marcadas</span>
                        <span className={styles.value}>{flaggedCount}</span>
                    </div>
                </div>

                <div className={styles.grid}>
                    {Array.from({ length: totalQuestions }).map((_, idx) => {
                        const isAnswered = answers[idx] !== undefined;
                        const isFlagged = flags[idx];

                        return (
                            <button
                                key={idx}
                                className={clsx(styles.gridItem, {
                                    [styles.answered]: isAnswered,
                                    [styles.flagged]: isFlagged,
                                })}
                                onClick={() => {
                                    onJumpTo(idx);
                                    onClose();
                                }}
                            >
                                {idx + 1}
                                {isFlagged && <Flag size={12} className={styles.flagIcon} fill="currentColor" />}
                            </button>
                        );
                    })}
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Voltar ao Exame
                    </button>
                    <button className={styles.finishBtn} onClick={onFinish}>
                        Finalizar Exame
                    </button>
                </div>
            </div>
        </div>
    );
}
