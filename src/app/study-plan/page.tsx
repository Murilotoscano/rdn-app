"use client";

import React from "react";
import { BookOpen, CheckCircle, Lightbulb, TrendingUp, ArrowLeft } from "lucide-react";
import styles from "./study-plan.module.css";
import Link from "next/link";
import clsx from "clsx";

const StudyPlanPage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Link>
                <h1 className={styles.title}>Plano de Estudos RDN 🚀</h1>
                <p className={styles.subtitle}>Seu roteiro de 30 dias para a aprovação.</p>
            </header>

            {/* Dicas Pro Section */}
            <section className={styles.proTip}>
                <Lightbulb size={24} className="text-[#f59e0b]" />
                <div>
                    <h3 className={styles.proTipTitle}>Como achar o "Ouro" nos PDFs</h3>
                    <ul className={styles.proTipList}>
                        <li><strong>Final de Capítulo:</strong> Procure por "Summary" ou "Key Points".</li>
                        <li><strong>Caixas Coloridas:</strong> Fórmulas e definições importantes.</li>
                        <li><strong>Tabelas:</strong> Comparativos de doenças/nutrientes caem muito na prova.</li>
                    </ul>
                </div>
            </section>

            <h2 className={styles.cycleTitle}>Ciclo 1: Fundação (Dias 1-10)</h2>

            <div className={styles.grid}>
                {days.map((day) => (
                    <Link href={`/study-plan/${day.id}`} key={day.id} className={styles.card} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.dayBadge}>DIA {day.id}</span>
                            <span className={styles.timeBadge}>2h Total</span>
                        </div>
                        <h3 className={styles.cardTitle}>{day.title}</h3>

                        <div className={styles.taskContainer}>
                            {/* Theory Block */}
                            <div className={clsx(styles.taskSection, styles.theory)}>
                                <div className={styles.taskHeader}>
                                    <BookOpen size={16} />
                                    Teoria (1h)
                                </div>
                                <p className={styles.taskDetail}>{day.theory}</p>
                                <div className={styles.taskGoal}>{day.theoryGoal}</div>
                            </div>

                            {/* Practice Block */}
                            <div className={clsx(styles.taskSection, styles.practice)}>
                                <div className={styles.taskHeader}>
                                    <CheckCircle size={16} />
                                    Prática (1h)
                                </div>
                                <p className={styles.taskDetail}>{day.practice}</p>
                                <div className={styles.taskGoal}>{day.practiceGoal}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Roadmap Section */}
            <div className={styles.roadmap}>
                <div className={styles.roadmapHeader}>
                    <TrendingUp className="mr-3 text-[#34d399]" size={32} />
                    <h2 className="text-2xl font-bold">Roadmap para Aprovação (30 Dias)</h2>
                </div>

                <div className={styles.roadmapGrid}>
                    <div className={styles.phase} style={{ borderColor: '#34d399' }}>
                        <h3 className={styles.phaseTitle} style={{ color: '#34d399' }}>Fase 1 (Dias 1-10)</h3>
                        <p className={styles.phaseDesc}>Fundação e Choque</p>
                        <p className={styles.phaseNote}>Passe por todos os tópicos uma vez.</p>
                    </div>
                    <div className={styles.phase} style={{ borderColor: '#fbbf24' }}>
                        <h3 className={styles.phaseTitle} style={{ color: '#fbbf24' }}>Fase 2 (Dias 11-20)</h3>
                        <p className={styles.phaseDesc}>Aprofundamento</p>
                        <p className={styles.phaseNote}>Foque apenas em Domínios &lt; 70%.</p>
                    </div>
                    <div className={styles.phase} style={{ borderColor: '#a78bfa' }}>
                        <h3 className={styles.phaseTitle} style={{ color: '#a78bfa' }}>Fase 3 (Dias 21-30)</h3>
                        <p className={styles.phaseDesc}>Simulação Real</p>
                        <p className={styles.phaseNote}>Simulados cronometrados e revisão.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const days = [
    {
        id: 1,
        title: "Food Science Foundations",
        theory: "Food Science PDF",
        theoryGoal: "Meta: ~20 Páginas (Foco em propriedades químicas)",
        practice: "App -> Domain 1 & 2",
        practiceGoal: "Meta: 40 Questões"
    },
    {
        id: 2,
        title: "Digestion & Absorption",
        theory: "Normal Nutrition PDF",
        theoryGoal: "Meta: ~15 Páginas (Macronutrientes)",
        practice: "App -> Domain 1 & 2",
        practiceGoal: "Meta: 40 Questões"
    },
    {
        id: 3,
        title: "Clinical I - MNT Basics",
        theory: "MNT Resource PDF (Part 1)",
        theoryGoal: "Meta: ~20 Páginas (Diabetes & CVD)",
        practice: "App -> Domain 3",
        practiceGoal: "Meta: 30 Questões"
    },
    {
        id: 4,
        title: "Clinical II - Advanced MNT",
        theory: "MNT Resource PDF (Part 2)",
        theoryGoal: "Meta: ~15 Páginas (Renal & Critical Care)",
        practice: "App -> Domain 3",
        practiceGoal: "Meta: 30 Questões"
    },
    {
        id: 5,
        title: "Enteral & Parenteral",
        theory: "Support PDF + Calculations PDF",
        theoryGoal: "Meta: 10 Páginas + 3 Novas Fórmulas",
        practice: "App -> Domain 3 (Calculations)",
        practiceGoal: "Meta: 20 Questões de Cálculo"
    },
    {
        id: 6,
        title: "Management I - Food Service",
        theory: "Food Service Logistics PDF",
        theoryGoal: "Meta: ~20 Páginas (Sistemas & Compras)",
        practice: "App -> Domain 4",
        practiceGoal: "Meta: 50 Questões"
    },
    {
        id: 7,
        title: "Management I - HR & Leadership",
        theory: "Management Concepts PDF",
        theoryGoal: "Meta: ~15 Páginas (HR Laws & Budget)",
        practice: "App -> Domain 4",
        practiceGoal: "Meta: 50 Questões"
    },
    {
        id: 8,
        title: "Counseling & Education",
        theory: "Counseling PPT PDF",
        theoryGoal: "Meta: Olhar todos os slides principais",
        practice: "App -> Domain 2",
        practiceGoal: "Meta: 40 Questões"
    },
    {
        id: 9,
        title: "Research & Ethics",
        theory: "Research Concepts PDF",
        theoryGoal: "Meta: ~15 Páginas (Study Designs)",
        practice: "App -> Domain 1",
        practiceGoal: "Meta: 30 Questões"
    },
    {
        id: 10,
        title: "Review & Weak Points",
        theory: "Revisão do seu pior tópico",
        theoryGoal: "Meta: Releia suas anotações",
        practice: "App -> General Simulation",
        practiceGoal: "Meta: 60 Questões (Mini Simulado)"
    },
];

export default StudyPlanPage;
