"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, BookOpen, CheckCircle, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./day.module.css";
import { studyPlanData } from "@/data/studyPlanContent";
import { store } from "@/lib/store";
import reviewHold from "@/data/review-hold.json";
const heldLessons = new Set(reviewHold);

const DayPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string, 10);
    const dayData = studyPlanData[id];

    const [practiceVisible, setPracticeVisible] = useState(false);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const practiceRef = useRef<HTMLDivElement>(null);
    const [orders, setOrders] = useState<Record<string, number[]>>({});
    const [loaded, setLoaded] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [storageError, setStorageError] = useState(false);

    useEffect(() => {
        const day = studyPlanData[id];
        if (!day) return;
        const stored = store.getLessonProgress()[String(id)];
        // Hydrate device-local progress only after the browser mounts.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAnswers(stored?.answers ?? {});
        setCompleted(stored?.completed ?? false);
        setOrders(Object.fromEntries(day.questions.map(q => {
            const order = q.options.map((_, i) => i);
            for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
            return [q.id, order];
        })));
        setLoaded(true);
    }, [id]);

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
        const next = { ...answers, [questionId]: optionIndex };
        setAnswers(next);
        try { store.saveLessonProgress(String(id), next, completed); setStorageError(false); } catch { setStorageError(true); }
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
                <p>Legacy lesson: content has not been fully validated. Some questions are held pending review.</p>
                <p>Lesson progress is saved on this device and included in your exported backup. It does not sync between devices.</p>
                {completed && <p>Completed on this device.</p>}
                {storageError && <p role="alert">Could not save progress on this device. Keep this page open and check browser storage.</p>}
                <p className={styles.subtitle}>{dayData.theoryTitle}</p>
            </header>

            <main className={styles.contentArea}>
                <div className={styles.theorySection}>
                    <div className={styles.sectionHeader}>
                        <BookOpen size={24} className={styles.sectionIcon} />
                        <h2 className={styles.sectionTitle}>Deep Study Content</h2>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #6366f1', marginBottom: '24px' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#475569' }}>Today&apos;s Objectives:</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>📚 <strong>Theory:</strong> {dayData.theoryGoal}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>✍️ <strong>Practice:</strong> {dayData.questions.filter(q => !heldLessons.has(q.id)).length} questions available in this lesson. Other items are held for review.</p>
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
                                I&apos;ve finished studying. Start Practice!
                            </button>
                        </div>
                    )}
                </div>

                {practiceVisible && (
                    <div ref={practiceRef} className={styles.practiceSection}>
                        <div className={styles.sectionHeader}>
                            <CheckCircle size={24} className={styles.sectionIconPractice} />
                            <h2 className={styles.sectionTitle}>Practice Questions ({dayData.questions.filter(q => !heldLessons.has(q.id)).length}; flagged items held for review)</h2>
                        </div>

                        {!loaded ? <p>Loading saved progress...</p> : dayData.questions.filter(q => !heldLessons.has(q.id)).length === 0 ? (
                            <p>No questions available for this day.</p>
                        ) : (
                            dayData.questions.filter(q => !heldLessons.has(q.id)).map((q, index) => {
                                const answered = answers[q.id] !== undefined;
                                const selectedOption = answers[q.id];
                                const isCorrect = selectedOption === q.correctAnswer;

                                return (
                                    <div key={q.id} className={styles.questionCard}>
                                        <h3 className={styles.questionText}>{index + 1}. {q.text}</h3>
                                        <div className={styles.optionsList}>
                                            {(orders[q.id] ?? []).map((optIdx) => {
                                                const opt = q.options[optIdx];
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
                                    try { store.saveLessonProgress(String(id), answers, true); setCompleted(true); router.push("/study-plan"); }
                                    catch { setStorageError(true); }
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
