"use client";

import AppLayout from "@/components/Layout/AppLayout";
import styles from "./modules.module.css";
import { Book, Database, Activity, Layers } from "lucide-react";
import Link from "next/link";

const MODULES = [
    {
        id: 1,
        title: "Domain I: Food and Nutrition Sciences",
        desc: "Food Science, Nutrition, management concepts, and education.",
        questions: 100,
        progress: 0,
        icon: Book
    },
    {
        id: 2,
        title: "Domain II: Nutrition Care",
        desc: "Screening, Assessment, Diagnosis, Intervention, Monitoring & Evaluation.",
        questions: 100,
        progress: 0,
        icon: Activity
    },
    {
        id: 3,
        title: "Domain III: Management",
        desc: "Functions of management, human resources, financial management.",
        questions: 100,
        progress: 0,
        icon: Database
    },
    {
        id: 4,
        title: "Domain IV: Foodservice Systems",
        desc: "Menu planning, procurement, production, distribution, safety.",
        questions: 100,
        progress: 0,
        icon: Layers
    }
];

export default function ModulesPage() {
    return (
        <AppLayout>
            <header style={{ marginBottom: 32 }}>
                <h1>Study Modules</h1>
                <p style={{ color: "var(--text-muted)" }}>Select a domain to focus your studies.</p>
            </header>

            <div className={styles.grid}>
                {MODULES.map((m) => (
                    <Link href={`/practice?mode=domain&id=${m.id}`} key={m.id} className={styles.moduleCard}>
                        <div className={styles.header}>
                            <div className={styles.icon}>
                                <m.icon size={24} />
                            </div>
                            <div className={styles.status}>
                                {m.progress}% Complete
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
            </div>
        </AppLayout>
    );
}
