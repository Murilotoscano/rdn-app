'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { Question } from '@/types';
import Timer from './Timer';
import ExamQuestionCard from './ExamQuestionCard';
import ReviewModal from './ReviewModal';
import styles from './ExamInterface.module.css';

interface Props {
    questions: Question[];
}

export default function ExamInterface({ questions }: Props) {
    const router = useRouter();
    const [currIndex, setCurrIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [flags, setFlags] = useState<Record<number, boolean>>({});
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handleAnswer = (optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [currIndex]: optionIndex }));
    };

    const toggleFlag = () => {
        setFlags(prev => ({ ...prev, [currIndex]: !prev[currIndex] }));
    };

    const handleNext = () => {
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
        // Save results (logic to be moved to context or local storage later)
        // For now, simple console log and redirect
        console.log("Finished!", { answers, flags });

        // In a real app, we'd POST to API or save to LocalStorage
        // Calculate Score
        let score = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) score++;
        });

        // Store in localStorage for the result page to read
        const resultData = {
            score,
            total: questions.length,
            answers,
            questions, // Ideally don't store full questions in LS, but OK for MVP
            date: new Date().toISOString()
        };
        localStorage.setItem('lastExamResult', JSON.stringify(resultData));

        router.push('/simulation/result');
    }, [answers, flags, questions, router]);

    const currQuestion = questions[currIndex];

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Simulado RDN</h1>
                    <span className={styles.subtitle}>{currIndex + 1} de {questions.length}</span>
                </div>

                <div className={styles.headerRight}>
                    <Timer
                        durationInSeconds={150 * 60} // 2.5 hours
                        onTimeUp={handleFinish}
                    />
                    <button
                        className={styles.reviewBtn}
                        onClick={() => setIsReviewOpen(true)}
                    >
                        <Grid size={20} />
                        <span>Revisar</span>
                    </button>
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
                />
            </main>

            {/* Footer Controls */}
            <footer className={styles.footer}>
                <button
                    className={styles.navBtn}
                    onClick={handlePrev}
                    disabled={currIndex === 0}
                >
                    <ChevronLeft size={20} />
                    Anterior
                </button>

                <button
                    className={styles.navBtn}
                    onClick={() => setIsReviewOpen(true)} // Or maybe just "Mark"? Review seems better for mobile flow
                >
                    Ver Todas
                </button>

                {currIndex === questions.length - 1 ? (
                    <button className={styles.finishBtn} onClick={handleFinish}>
                        Finalizar Exame
                    </button>
                ) : (
                    <button className={styles.navBtn} onClick={handleNext}>
                        Próxima
                        <ChevronRight size={20} />
                    </button>
                )}
            </footer>

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                totalQuestions={questions.length}
                answers={answers}
                flags={flags}
                onJumpTo={setCurrIndex}
                onFinish={handleFinish}
            />
        </div>
    );
}
