"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import styles from "./modules.module.css";
import { Book, Database, Activity, Layers, Award, FileText } from "lucide-react";
import Link from "next/link";
import { store } from "@/lib/store";
import { CDR_QUESTIONS } from "@/data/cdrQuestions";

export default function ModulesPage() {
    const [progressMap, setProgressMap] = useState<Record<string, number>>({
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "cdr": 0,
        "pdf-gen": 0
    });

    useEffect(() => {
        // Compute progress from store
        const errorLog = store.getErrorLog();
        const cdrProgress = store.getCdrProgress();
        const customQuestions = store.getCustomQuestions();
        const customProgress = store.getCustomProgress();

        // Standard domains: calculate percent based on some dummy totals (e.g. 100 questions per domain)
        const domainCounts = { "1": 0, "2": 0, "3": 0, "4": 0 };
        errorLog.forEach(item => {
            if (item.mastered) {
                if (item.domain.includes("I.")) domainCounts["1"]++;
                else if (item.domain.includes("II.")) domainCounts["2"]++;
                else if (item.domain.includes("III.")) domainCounts["3"]++;
                else if (item.domain.includes("IV.")) domainCounts["4"]++;
            }
        });

        // CDR Progress
        const cdrCorrect = Object.values(cdrProgress).filter(p => p.status === 'correct' || p.status === 'mastered').length;
        const cdrPercent = Math.round((cdrCorrect / CDR_QUESTIONS.length) * 100);

        // Custom PDF Progress
        const customTotal = customQuestions.length;
        const customCorrect = Object.values(customProgress).filter(p => p.status === 'correct' || p.status === 'mastered').length;
        const customPercent = customTotal > 0 ? Math.round((customCorrect / customTotal) * 100) : 0;

        setProgressMap({
            "1": Math.min(Math.round((domainCounts["1"] / 20) * 100), 100), // Assuming 20 key questions logged for mastery
            "2": Math.min(Math.round((domainCounts["2"] / 20) * 100), 100),
            "3": Math.min(Math.round((domainCounts["3"] / 20) * 100), 100),
            "4": Math.min(Math.round((domainCounts["4"] / 20) * 100), 100),
            "cdr": cdrPercent,
            "pdf-gen": customPercent
        });
    }, []);

    const DOMAIN_MODULES = [
        {
            id: "1",
            title: "Domain I: Food and Nutrition Sciences",
            desc: "Food Science, Nutrition, management concepts, and education.",
            questions: 100,
            href: "/practice?mode=domain&id=1",
            icon: Book
        },
        {
            id: "2",
            title: "Domain II: Nutrition Care",
            desc: "Screening, Assessment, Diagnosis, Intervention, Monitoring & Evaluation.",
            questions: 100,
            href: "/practice?mode=domain&id=2",
            icon: Activity
        },
        {
            id: "3",
            title: "Domain III: Management",
            desc: "Functions of management, human resources, financial management.",
            questions: 100,
            href: "/practice?mode=domain&id=3",
            icon: Database
        },
        {
            id: "4",
            title: "Domain IV: Foodservice Systems",
            desc: "Menu planning, procurement, production, distribution, safety.",
            questions: 100,
            href: "/practice?mode=domain&id=4",
            icon: Layers
        }
    ];

    return (
        <AppLayout>
            <header style={{ marginBottom: 32 }}>
                <h1>Study Modules</h1>
                <p style={{ color: "var(--text-muted)" }}>Select a module to focus your studies or analyze your materials.</p>
            </header>

            <div className={styles.grid}>
                {DOMAIN_MODULES.map((m) => (
                    <Link href={m.href} key={m.id} className={styles.moduleCard}>
                        <div className={styles.header}>
                            <div className={styles.icon}>
                                <m.icon size={24} />
                            </div>
                            <div className={styles.status}>
                                {progressMap[m.id]}% Mastered
                            </div>
                        </div>
                        <div>
                            <h2 className={styles.title}>{m.title}</h2>
                            <p className={styles.desc}>{m.desc}</p>
                        </div>
                        <div className={styles.meta}>
                            <span>{m.questions} Questions</span>
                            <span>•</span>
                            <span>Est: 2h</span>
                        </div>
                    </Link>
                ))}

                {/* Official CDR Questions Card */}
                <Link href="/practice/cdr" className={`${styles.moduleCard} ${styles.premiumCard}`}>
                    <div className={styles.header}>
                        <div className={`${styles.icon} ${styles.premiumIcon}`}>
                            <Award size={24} style={{ color: "var(--accent)" }} />
                        </div>
                        <div className={styles.status} style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--accent)" }}>
                            {progressMap["cdr"]}% Correct
                        </div>
                    </div>
                    <div>
                        <h2 className={styles.title} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            Official CDR Practice
                            <span className={styles.premiumBadge}>Official</span>
                        </h2>
                        <p className={styles.desc}>
                            30 practice questions with detailed rationales from the September 2024 Corrected PDF.
                        </p>
                    </div>
                    <div className={styles.meta}>
                        <span>30 Questions</span>
                        <span>•</span>
                        <span>Official Sept 24</span>
                    </div>
                </Link>

                {/* Course PDF Question Generator Card */}
                <Link href="/practice/pdf-generator" className={`${styles.moduleCard} ${styles.aiCard}`}>
                    <div className={styles.header}>
                        <div className={`${styles.icon} ${styles.aiIcon}`}>
                            <FileText size={24} style={{ color: "#ec4899" }} />
                        </div>
                        <div className={styles.status} style={{ background: "rgba(236, 72, 153, 0.15)", color: "#ec4899" }}>
                            {store.getCustomQuestions().length} Generated
                        </div>
                    </div>
                    <div>
                        <h2 className={styles.title} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            Course PDF Question Generator
                            <span className={styles.aiBadge}>AI Engine</span>
                        </h2>
                        <p className={styles.desc}>
                            Analyze your 10 course PDFs, extract key concepts, and generate original RDN-style questions dynamically.
                        </p>
                    </div>
                    <div className={styles.meta}>
                        <span>Dynamic Questions</span>
                        <span>•</span>
                        <span>CDR 2026 Aligned</span>
                    </div>
                </Link>
            </div>
        </AppLayout>
    );
}
