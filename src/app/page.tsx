"use client";

import AppLayout from "../components/Layout/AppLayout";
import styles from "./page.module.css";
import { Play, BookOpen, Clock, Award, Zap, Repeat, Cloud, CloudOff, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { store, SyncResult } from "@/lib/store";
import { SAMPLE_QUESTIONS, QUESTION_IDS } from "@/lib/questions";
import ScoreTrendChart from "@/components/ScoreTrendChart";
import { EXAM_MAX_QUESTIONS } from "@/lib/examRules";
import { MIN_FRESH_FOR_VERDICT } from "@/lib/targets";
import { subscribeToData } from '@/lib/backup';

export default function Home() {
  const [counts, setCounts] = useState<{
    due: number; overdue: number; mastered: number; total: number;
    dueUnsure: number; dueIncorrect: number;
  }>({ due: 0, overdue: 0, mastered: 0, total: 0, dueUnsure: 0, dueIncorrect: 0 });

  type LastMock = {
    date: string; pct: number; answered: number; total: number;
    inconclusive: boolean; freshPct: number | null; freshTotal: number;
  };
  const [progress, setProgress] = useState({ attempted: 0, exposed: 0, total: 0 });
  const [accuracy, setAccuracy] = useState<{ practicePct: number | null; practiceN: number; mockPct: number | null; mockN: number }>(
    { practicePct: null, practiceN: 0, mockPct: null, mockN: 0 }
  );
  const [domains, setDomains] = useState<{ domain: string; pct: number; total: number }[]>([]);
  const [lastMock, setLastMock] = useState<LastMock | null>(null);
  const [mounted, setMounted] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [sync, setSync] = useState<SyncResult>({ state: 'disabled', message: 'Not synced yet' });

  useEffect(() => {
    const refresh = () => {
      const reviewCounts = store.getReviewCounts(QUESTION_IDS);
      setCounts(reviewCounts);

      // Reported as separate facts. There is no single "readiness" number here: the CDR scaled
      // score (1-50, pass = 25) comes from an adaptive exam and cannot be derived from a
      // percentage of this bank, so nothing on this page is converted into one.
      setProgress(store.getCoverage(QUESTION_IDS));

      const history = store.getExamHistory();
      const sum = (rows: typeof history) => rows.reduce(
        (acc, h) => ({ correct: acc.correct + h.score, total: acc.total + h.totalQuestions }),
        { correct: 0, total: 0 }
      );
      const mocks = history.filter(h => h.mode === 'mock');
      const drills = history.filter(h => h.mode !== 'mock');
      const mockTotals = sum(mocks);
      const drillTotals = sum(drills);
      setAccuracy({
        practicePct: drillTotals.total > 0 ? Math.round((drillTotals.correct / drillTotals.total) * 100) : null,
        practiceN: drillTotals.total,
        mockPct: mockTotals.total > 0 ? Math.round((mockTotals.correct / mockTotals.total) * 100) : null,
        mockN: mockTotals.total
      });

      const byDomain: Record<string, { correct: number; total: number }> = {};
      history.forEach(h => Object.entries(h.domainScores ?? {}).forEach(([domain, score]) => {
        if (!byDomain[domain]) byDomain[domain] = { correct: 0, total: 0 };
        byDomain[domain].correct += score.correct;
        byDomain[domain].total += score.total;
      }));
      setDomains(
        Object.entries(byDomain)
          .filter(([, v]) => v.total > 0)
          .map(([domain, v]) => ({ domain, pct: Math.round((v.correct / v.total) * 100), total: v.total }))
          .sort((a, b) => a.domain.localeCompare(b.domain))
      );

      // Only a mock taken under real conditions is reported as one.
      const realMocks = mocks.filter(h => h.realConditions);
      const latest = realMocks.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))[0];
      if (latest) {
        const freshEnough = (latest.freshTotal ?? 0) >= MIN_FRESH_FOR_VERDICT;
        setLastMock({
          date: new Date(latest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pct: latest.totalQuestions > 0 ? Math.round((latest.score / latest.totalQuestions) * 100) : 0,
          answered: latest.totalQuestions,
          total: EXAM_MAX_QUESTIONS,
          inconclusive: !!latest.inconclusive,
          freshPct: freshEnough ? Math.round(((latest.freshCorrect ?? 0) / (latest.freshTotal ?? 1)) * 100) : null,
          freshTotal: latest.freshTotal ?? 0
        });
      } else setLastMock(null);

      setMounted(true);
      const status = store.getCloudStatus();
      setSync(status.result);
      if (status.lastSuccessAt) setLastSync(new Date(status.lastSuccessAt).toLocaleTimeString());
    };
    refresh();
    return subscribeToData(refresh);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await store.fullSync();
      setSync(result);
      // Only claim a sync time when one actually happened.
      if (result.state === 'ok') setLastSync(new Date().toLocaleTimeString());

      const reviewCounts = store.getReviewCounts(QUESTION_IDS);
      setCounts(reviewCounts);
    } catch (e) {
      console.error("Sync failed", e);
      setSync({ state: 'error', message: 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  if (!mounted) return null;

  return (
    <AppLayout>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.greetingSection}>
            <h1 className={styles.welcome}>Hello, Murilo! 👋</h1>
            <p className={styles.subtitle}>Let's continue your journey to becoming an RDN.</p>
            
            <div className={styles.syncStatus} onClick={handleSync}>
              {syncing ? (
                <RefreshCw size={14} className={styles.spin} />
              ) : sync.state === 'ok' ? (
                <Cloud size={14} />
              ) : (
                <CloudOff size={14} />
              )}
              <span>
                {syncing
                  ? "Syncing..."
                  : sync.state === 'ok'
                    ? `Synced at ${lastSync}`
                    : "Saved on this device only"}
              </span>
            </div>

            {!syncing && sync.state !== 'ok' && (
              <Link href="/profile" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>
                Back up your progress →
              </Link>
            )}
          </div>

          <div className={styles.readinessWidget}>
            <div className={styles.readinessText}>
              <h2 className={styles.readinessTitle}>Where you stand</h2>
              <p className={styles.readinessDetails}>
                Practice and review: {accuracy.practicePct === null ? 'no sessions yet' : `${accuracy.practicePct}% of ${accuracy.practiceN} answers`}
                <br />
                Mock exams: {accuracy.mockPct === null ? 'none taken yet' : `${accuracy.mockPct}% of ${accuracy.mockN} scored answers`}
                <br />
                {lastMock
                  ? `Last mock under exam conditions (${lastMock.date}): ${lastMock.pct}%, ${lastMock.answered} of ${lastMock.total} answered${lastMock.inconclusive ? ' - inconclusive, under 125 answered' : ''}${lastMock.freshPct !== null ? `; ${lastMock.freshPct}% on ${lastMock.freshTotal} unseen questions` : ''}`
                  : 'No mock taken under exam conditions yet.'}
              </p>
              <p className={styles.readinessDetails} style={{ marginTop: 6, opacity: 0.75 }}>
                These are practice results, not a CDR scaled score and not a probability of passing.
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
          <span className={styles.statLabel}>Questions answered</span>
          <span className={styles.statValue}>{progress.attempted} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {SAMPLE_QUESTIONS.length}</span></span>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarFill} style={{ width: `${progress.total > 0 ? (progress.attempted / progress.total) * 100 : 0}%` }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {progress.exposed} seen, including mock items revealed on the result page
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>By domain</span>
          {domains.length === 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No scored sessions yet.</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {domains.map(d => (
                <span key={d.domain} style={{ fontSize: '0.8rem' }}>
                  {d.domain}: <strong>{d.pct}%</strong>{' '}
                  <span style={{ color: 'var(--text-muted)' }}>({d.total} answers)</span>
                </span>
              ))}
            </div>
          )}
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

          <div className={styles.actionCard}>
            {/* The whole card starts a real-conditions exam; the smaller link sits above it
                so the review-friendly mode stays reachable by pointer and keyboard. */}
            <Link
              href="/simulation"
              aria-label="Mock Exam: real exam rules"
              style={{ position: 'absolute', inset: 0, zIndex: 0, borderRadius: 'inherit' }}
            />
            <div className={styles.cardIcon} style={{ background: '#fff5f5', color: '#c53030' }}>
              <Clock size={28} />
            </div>
            <h3 className={styles.cardTitle}>Mock Exam</h3>
            <p className={styles.cardDesc}>
              Real exam rules: 3 hours, up to 145 questions, no going back. New questions first.
            </p>
            <Link
              href="/simulation?mode=review"
              style={{ position: 'relative', zIndex: 1, fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}
            >
              Or practice with flag &amp; review →
            </Link>
          </div>

          <Link href="/study-plan" className={styles.actionCard} style={{ border: '2px solid #6366f1' }}>
            <div className={styles.cardIcon} style={{ background: '#eef2ff', color: '#6366f1' }}>
              <BookOpen size={28} />
            </div>
            <h3 className={styles.cardTitle}>Study Plan</h3>
            <p className={styles.cardDesc}>
              The detailed 30-day roadmap with extensive English content.
            </p>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px' }}>English Version</span>
            </div>
          </Link>

          <Link href="/study-guides" className={styles.actionCard} style={{ border: '2px solid #2E7D32' }}>
            <div className={styles.cardIcon} style={{ background: '#e8f5e9', color: '#2E7D32' }}>
              <BookOpen size={28} />
            </div>
            <h3 className={styles.cardTitle}>Study Guides</h3>
            <p className={styles.cardDesc}>
              Deep clinical reference for all 4 domains — tables, exam traps, and key points.
            </p>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#e8f5e9', color: '#1b5e20', borderRadius: '4px' }}>4 Domains</span>
            </div>
          </Link>
        </div>
      </section>

      <section className={styles.actionSection}>
        <h2 className={styles.sectionTitle}>Your Progress</h2>
        <ScoreTrendChart />
      </section>

      <div style={{
        marginTop: '4rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        opacity: 0.6,
        paddingBottom: '1rem'
      }}>
        Build ID: v3.0.0-en      </div>
    </AppLayout>
  );
}
