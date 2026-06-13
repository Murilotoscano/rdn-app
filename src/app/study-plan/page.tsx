"use client";

import React from "react";
import { BookOpen, CheckCircle, Lightbulb, TrendingUp, ArrowLeft } from "lucide-react";
import styles from "./study-plan.module.css";
import Link from "next/link";
import clsx from "clsx";

import { studyPlanData } from "@/data/studyPlanContent";

const StudyPlanPage = () => {
    const days = Object.values(studyPlanData).sort((a, b) => a.id - b.id);
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    <ArrowLeft size={20} className="mr-2" />
                    Back
                </Link>
                <h1 className={styles.title}>RDN Study Plan 🚀</h1>
                <p className={styles.subtitle}>Your 30-day roadmap to passing the exam.</p>
            </header>

            {/* Pro Tips Section */}
            <section className={styles.proTip}>
                <Lightbulb size={24} className="text-[#f59e0b]" />
                <div>
                    <h3 className={styles.proTipTitle}>Finding the "Gold" in Study Materials</h3>
                    <ul className={styles.proTipList}>
                        <li><strong>Chapter Summaries:</strong> Look for "Summary" or "Key Points" sections first.</li>
                        <li><strong>Highlighted Boxes:</strong> Critical formulas and definitions are usually boxed.</li>
                        <li><strong>Tables:</strong> Comparative data on diseases/nutrients is highly testable.</li>
                    </ul>
                </div>
            </section>

            <h2 className={styles.cycleTitle}>Cycle 1: Foundations (Days 1-10)</h2>

            <div className={styles.grid}>
                {days.map((day) => (
                    <Link href={`/study-plan/${day.id}`} key={day.id} className={styles.card} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div className={styles.cardHeader}>
                            <span className={styles.dayBadge}>DAY {day.id}</span>
                            <span className={styles.timeBadge}>2h Total</span>
                        </div>
                        <h3 className={styles.cardTitle}>{day.title}</h3>

                        <div className={styles.taskContainer}>
                            {/* Theory Block */}
                            <div className={clsx(styles.taskSection, styles.theory)}>
                                <div className={styles.taskHeader}>
                                    <BookOpen size={16} />
                                    Theory (1h)
                                </div>
                                <p className={styles.taskDetail}>{day.theoryTitle}</p>
                                <div className={styles.taskGoal}>{day.theoryGoal}</div>
                            </div>

                            {/* Practice Block */}
                            <div className={clsx(styles.taskSection, styles.practice)}>
                                <div className={styles.taskHeader}>
                                    <CheckCircle size={16} />
                                    Practice (1h)
                                </div>
                                <p className={styles.taskDetail}>{day.practiceTitle}</p>
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
                    <h2 className="text-2xl font-bold">Exam Success Roadmap (30 Days)</h2>
                </div>

                <div className={styles.roadmapGrid}>
                    <div className={styles.phase} style={{ borderColor: '#34d399' }}>
                        <h3 className={styles.phaseTitle} style={{ color: '#34d399' }}>Phase 1 (Days 1-10)</h3>
                        <p className={styles.phaseDesc}>Foundations & Overview</p>
                        <p className={styles.phaseNote}>Go through all topics once to build baseline.</p>
                    </div>
                    <div className={styles.phase} style={{ borderColor: '#fbbf24' }}>
                        <h3 className={styles.phaseTitle} style={{ color: '#fbbf24' }}>Phase 2 (Days 11-20)</h3>
                        <p className={styles.phaseDesc}>Deep Dive</p>
                        <p className={styles.phaseNote}>Focus on domains with &lt; 70% accuracy.</p>
                    </div>
                    <div className={styles.phase} style={{ borderColor: '#a78bfa' }}>
                        <h3 className={styles.phaseTitle} style={{ color: '#a78bfa' }}>Phase 3 (Days 21-30)</h3>
                        <p className={styles.phaseDesc}>Mock Simulations</p>
                        <p className={styles.phaseNote}>Timed simulations and final review.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyPlanPage;
