"use client";

import AppLayout from "../components/Layout/AppLayout";
import styles from "./page.module.css";
import { Play, BookOpen, Clock, TrendingUp, Award, Zap, Repeat } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { store } from "@/lib/store";
import { SAMPLE_QUESTIONS } from "@/lib/questions";

export default function Home() {
  const [counts, setCounts] = useState<{
    due: number; overdue: number; mastered: number; total: number;
    dueUnsure: number; dueIncorrect: number;
  }>({ due: 0, overdue: 0, mastered: 0, total: 0, dueUnsure: 0, dueIncorrect: 0 });

  const [readinessScore, setReadinessScore] = useState({ score: 0, accuracy: 0, completion: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reviewCounts = store.getReviewCounts();
    setCounts(reviewCounts);

    // Calculate Readiness Score
    const totalQuestions = SAMPLE_QUESTIONS.length;
    const stats30Days = store.getStats(30);
    const overallAccuracy = stats30Days ? stats30Days.accuracy : 0;
    const completionPercentage = (reviewCounts.total / totalQuestions) * 100;

    // Algorithm: 60% weight on accuracy, 40% weight on completion (capped at 100%)
    const score = Math.min(100, Math.round((overallAccuracy * 0.6) + (completionPercentage * 0.4)));

    setReadinessScore({
      score: score,
      accuracy: Math.round(overallAccuracy),
      completion: Math.round(completionPercentage)
    });

    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AppLayout>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.greetingSection}>
            <h1 className={styles.welcome}>Hello, Murilo! 👋</h1>
            <p className={styles.subtitle}>Let's continue your journey to becoming an RDN.</p>
          </div>

          <div className={styles.readinessWidget}>
            <div className={styles.circularProgress} style={{ "--progress": `${readinessScore.score}%` } as React.CSSProperties}>
              <div className={styles.innerCircle}>
                <span className={styles.scoreValue}>{readinessScore.score}%</span>
              </div>
            </div>
            <div className={styles.readinessText}>
              <h2 className={styles.readinessTitle}>Exam Readiness</h2>
              <p className={styles.readinessDetails}>
                Based on {readinessScore.accuracy}% accuracy & {readinessScore.completion}% completion
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Reviews Due</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className={styles.statValue} style={{ color: counts.due > 0 ? 'var(--primary)' : 'inherit' }}>
              {counts.due}
            </span>
            {counts.overdue > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--error)' }}>({counts.overdue} overdue)</span>}
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Mastered Questions</span>
          <span className={styles.statValue} style={{ color: "var(--success)" }}>{counts.mastered}</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Bank Completion</span>
          <span className={styles.statValue}>{counts.total} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {SAMPLE_QUESTIONS.length}</span></span>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarFill} style={{ width: `${readinessScore.completion}%` }}></div>
          </div>
        </div>
      </div>

      <section className={styles.actionSection}>
        <h2 className={styles.sectionTitle}>Start Practicing</h2>
        <div className={styles.actionGrid}>
          <Link href="/review" className={styles.actionCard} style={{ border: counts.due > 0 ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
            <div className={styles.cardIcon} style={{ background: '#e0e7ff', color: 'var(--primary)' }}>
              <Repeat size={28} />
            </div>
            <h3 className={styles.cardTitle}>Daily Review</h3>
            <p className={styles.cardDesc}>
              {counts.due === 0 ? "You're all caught up! No reviews due right now." : `${counts.due} due total.`}
            </p>
            {counts.due > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                {counts.overdue > 0 && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px' }}>{counts.overdue} Overdue</span>}
                {counts.dueUnsure > 0 && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#ffedd5', color: '#c2410c', borderRadius: '4px' }}>{counts.dueUnsure} Unsure</span>}
                {counts.dueIncorrect > 0 && <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#ffe4e6', color: '#be123c', borderRadius: '4px' }}>{counts.dueIncorrect} Errors</span>}
              </div>
            )}
          </Link>

          <Link href="/review?filter=unsure" className={styles.actionCard}>
            <div className={styles.cardIcon} style={{ background: '#ffedd5', color: '#c2410c' }}>
              <Repeat size={28} />
            </div>
            <h3 className={styles.cardTitle}>Review Unsure</h3>
            <p className={styles.cardDesc}>
              {counts.dueUnsure === 0 ? "Great job! You have no skipped or unsure questions pending." : `Focus on ${counts.dueUnsure} items you marked as unsure.`}
            </p>
          </Link>

          <Link href="/practice?mode=quick" className={styles.actionCard}>
            <div className={styles.cardIcon}>
              <Zap size={28} />
            </div>
            <h3 className={styles.cardTitle}>Quick Practice</h3>
            <p className={styles.cardDesc}>
              30 random questions to keep the flow. Immediate feedback.
            </p>
          </Link>

          <Link href="/modules" className={styles.actionCard}>
            <div className={styles.cardIcon} style={{ background: '#e6fffa', color: '#2c7a7b' }}>
              <BookOpen size={28} />
            </div>
            <h3 className={styles.cardTitle}>Study Module</h3>
            <p className={styles.cardDesc}>
              Focus on a specific topic. Management, Clinical, and more.
            </p>
          </Link>

          <Link href="/simulation" className={styles.actionCard}>
            <div className={styles.cardIcon} style={{ background: '#fff5f5', color: '#c53030' }}>
              <Clock size={28} />
            </div>
            <h3 className={styles.cardTitle}>Mock Exam</h3>
            <p className={styles.cardDesc}>
              145 timed questions. Feel the pressure of the real exam.
            </p>
          </Link>
        </div>
      </section>

      <section className={styles.actionSection}>
        <h2 className={styles.sectionTitle}>Your Progress</h2>
        <div style={{ padding: 40, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <TrendingUp size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p>Performance charts will appear here as you study.</p>
        </div>
      </section>

      <div style={{
        marginTop: '4rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        opacity: 0.6,
        paddingBottom: '1rem'
      }}>
        Build ID: v2.3      </div>
    </AppLayout>
  );
}
