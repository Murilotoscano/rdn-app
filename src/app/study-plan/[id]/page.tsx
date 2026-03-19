"use client";

import React, { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./day.module.css";
import { studyPlanData } from "@/data/studyPlanContent";

const DayPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string, 10);
    const dayData = studyPlanData[id];

    const [activeTab, setActiveTab] = useState<"theory" | "practice">("theory");
    const [answers, setAnswers] = useState<Record<string, number>>({});

    if (!dayData) {
        return (
            <div className={styles.container}>
                <p>Dia não encontrado.</p>
                <Link href="/study-plan" className={styles.backButton}>Voltar</Link>
            </div>
        );
    }

    const handleAnswer = (questionId: string, optionIndex: number) => {
        if (answers[questionId] !== undefined) return; // already answered
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/study-plan" className={styles.backButton}>
                    <ArrowLeft size={20} className="inline mr-2" />
                    Voltar para o Plano
                </Link>
                <h1 className={styles.title}>Dia {dayData.id}: {dayData.title}</h1>
                <p className={styles.subtitle}>{dayData.theoryTitle}</p>
            </header>

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === "theory" ? styles.active : ""}`}
                    onClick={() => setActiveTab("theory")}
                >
                    <BookOpen size={18} className="inline mr-2" />
                    Teoria
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === "practice" ? styles.active : ""}`}
                    onClick={() => setActiveTab("practice")}
                >
                    <CheckCircle size={18} className="inline mr-2" />
                    Prática ({dayData.questions.length})
                </button>
            </div>

            <main className={styles.contentArea}>
                {activeTab === "theory" && (
                    <div 
                        className={styles.theoryContent} 
                        dangerouslySetInnerHTML={{ __html: dayData.theoryContent as string }}
                    />
                )}

                {activeTab === "practice" && (
                    <div className={styles.practiceContent}>
                        {dayData.questions.length === 0 ? (
                            <p>Nenhuma questão disponível para este dia.</p>
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
                                                <strong>{isCorrect ? "✅ Correto!" : "❌ Incorreto."}</strong>
                                                <p style={{marginTop: "8px"}}>{q.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        <button 
                            className={styles.markCompleteBtn}
                            onClick={() => {
                                alert("Dia concluído com sucesso!");
                                router.push("/study-plan");
                            }}
                        >
                            Concluir Dia {dayData.id}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DayPage;
