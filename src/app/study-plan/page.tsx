"use client";

import React from "react";
import { BookOpen, CheckCircle, Lightbulb, TrendingUp, ArrowLeft } from "lucide-react";
import styles from "./study-plan.module.css";
import Link from "next/link";
import clsx from "clsx";

import { studyPlanData } from "@/data/studyPlanContent";
import { SCHEDULE_WEEKS, EXAM_DATE_LABEL, SCHEDULE_START_LABEL } from "@/data/examSchedule";

const CYCLES = [
    { title: "Cycle 1: Foundations (Days 1-10)", from: 1, to: 10 },
    { title: "Cycle 2: Clinical Depth (Days 11-20)", from: 11, to: 20 },
    { title: "Cycle 3: Systems & Integration (Days 21-30)", from: 21, to: 30 },
];

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
                <p className={styles.subtitle}>Your 30-day roadmap to passing the exam, weighted to the CDR blueprint.</p>
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

            {/* Countdown to the exam. Each week points back at the 30-day plan below. */}
            <section className={styles.proTip} style={{ display: 'block' }}>
                <h3 className={styles.proTipTitle}>Countdown: {SCHEDULE_START_LABEL} to {EXAM_DATE_LABEL}</h3>
                <p style={{ fontSize: '0.85rem', margin: '4px 0 12px' }}>
                    Seven weekly blocks over the same 30 days below, plus four mock exams under exam
                    conditions. The topics marked "reported" come from candidate recollections on public
                    forums: useful for ordering revision, but not published frequencies and no guarantee
                    of what will be asked. Mock exams stay weighted to the CDR matrix (21/45/21/13).
                </p>
                <div style={{ display: 'grid', gap: 12 }}>
                    {SCHEDULE_WEEKS.map(w => (
                        <div key={w.week} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                                <strong>Week {w.week}</strong>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{w.dates} · {w.domains}</span>
                            </div>
                            <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>{w.focus}</p>
                            <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
                                <strong>Plan days:</strong>{' '}
                                {w.days.map((d, i) => (
                                    <React.Fragment key={d}>
                                        {i > 0 && ', '}
                                        <Link href={`/study-plan/${d}`}>Day {d}</Link>
                                    </React.Fragment>
                                ))}
                            </p>
                            <ul style={{ margin: '4px 0 4px 18px', fontSize: '0.85rem' }}>
                                {w.activities.map(a => (
                                    <li key={a.label}><Link href={a.href}>{a.label}</Link></li>
                                ))}
                            </ul>
                            <p style={{ margin: '4px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <strong>Reported priorities:</strong> {w.forumFocus.join('; ')}.
                            </p>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}><strong>Goal:</strong> {w.goal}</p>
                        </div>
                    ))}
                </div>
            </section>

            {CYCLES.map((cycle) => (
                <React.Fragment key={cycle.title}>
            <h2 className={styles.cycleTitle}>{cycle.title}</h2>

            <div className={styles.grid}>
                {days.filter(d => d.id >= cycle.from && d.id <= cycle.to).map((day) => (
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
                </React.Fragment>
            ))}

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
