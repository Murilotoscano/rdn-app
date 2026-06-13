"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, BookOpen, CheckCircle, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./day.module.css";
import { studyPlanData } from "@/data/studyPlanContent";

const DayPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string, 10);
    const dayData = studyPlanData[id];

    const [practiceVisible, setPracticeVisible] = useState(false);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const practiceRef = useRef<HTMLDivElement>(null);

    if (!dayData) {
        return (
            <div className={styles.container}>
                <p>Day not found.</p>
                <Link href="/study-plan" className={styles.backButton}>Go Back</Link>
            </div>
        );
    }

    const handleAnswer = (questionId: string, optionIndex: number) => {
        if (answers[questionId] !== undefined) return; // already answered
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const startPractice = () => {
        setPracticeVisible(true);
        setTimeout(() => {
            practiceRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/study-plan" className={styles.backButton}>
                    <ArrowLeft size={20} className="inline mr-2" />
                    Back to Plan
                </Link>
                <h1 className={styles.title}>Day {dayData.id}: {dayData.title}</h1>
                <p className={styles.subtitle}>{dayData.theoryTitle}</p>
            </header>

            <main className={styles.contentArea}>
                <div className={styles.theorySection}>
                    <div className={styles.sectionHeader}>
                        <BookOpen size={24} className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Deep Study Content</h2>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #6366f1', marginBottom: '24px' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#475569' }}>Today's Objectives:</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>📚 <strong>Theory:</strong> {dayData.theoryGoal}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>✍️ <strong>Practice:</strong> {dayData.practiceGoal}</p>
                    </div>
                    
                    <div 
                        className={styles.theoryContent} 
                        dangerouslySetInnerHTML={{ __html: dayData.theoryContent }}
                    />

                    {!practiceVisible && (
                        <div className={styles.startPracticeContainer}>
                            <button 
                                className={styles.startPracticeBtn}
                                onClick={startPractice}
                            >
                                <GraduationCap size={20} className="mr-2" />
                                I've finished studying. Start Practice!
                            </button>
                        </div>
                    )}
                </div>

                {practiceVisible && (
                    <div ref={practiceRef} className={styles.practiceSection}>
                        <div className={styles.sectionHeader}>
                            <CheckCircle size={24} className={styles.sectionIconPractice} />
                            <h2 className={styles.sectionTitle}>Practice Questions ({dayData.questions.length})</h2>
                        </div>

                        {dayData.questions.length === 0 ? (
                            <p>No questions available for this day.</p>
                        ) : (
                            dayData.questions.map((q, index) => {
                                const answered = answers[q.id] !== undefined;
                                const selectedOption = answers[q.id];
                                const isCorrect = selectedOption === q.correctAnswer;

                                return (
                                    <div key={q.id} className={styles.questionCard}>
                                        <h3 className={styles.questionText}>{index + 1}. {q.text}</h3>
                                        <div className={styles.optionsList}>
                                            {q.options.map((opt, optIdx) => {
                                                let btnClass = styles.optionButton;
                                                if (answered) {
                                                    if (optIdx === q.correctAnswer) {
                                                        btnClass += ` ${styles.correct}`;
                                                    } else if (optIdx === selectedOption) {
                                                        btnClass += ` ${styles.incorrect}`;
                                                    }
                                                }

                                                return (
                                                    <button 
                                                        key={optIdx}
                                                        className={btnClass}
                                                        onClick={() => handleAnswer(q.id, optIdx)}
                                                        disabled={answered}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        
                                        {answered && (
                                            <div className={styles.explanation}>
                                                <strong>{isCorrect ? "✅ Correct!" : "❌ Incorrect."}</strong>
                                                <p style={{marginTop: "8px"}}>{q.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        <div className={styles.completionSection}>
                            <button 
                                className={styles.markCompleteBtn}
                                onClick={() => {
                                    alert("Day completed successfully!");
                                    router.push("/study-plan");
                                }}
                            >
                                Finish Day {dayData.id}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DayPage;
