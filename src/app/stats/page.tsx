"use client";

import AppLayout from "@/components/Layout/AppLayout";
import { store } from "@/lib/store";
import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, Target, RefreshCw } from "lucide-react";
import styles from "../page.module.css"; // Reuse dashboard styles for cards

export default function StatsPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Fetch stats for last 30 days
        const s = store.getStats(30);
        setStats(s);
    }, []);

    if (!stats) return <AppLayout><div>Loading stats...</div></AppLayout>;

    return (
        <AppLayout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Performance</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Key metrics from the last 30 days.</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={16} /> Accuracy
                    </span>
                    <span className={styles.statValue} style={{ color: stats.accuracy >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                        {stats.accuracy.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Correct answers</span>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} /> Unsure Rate
                    </span>
                    <span className={styles.statValue} style={{ color: stats.unsureRate > 20 ? 'var(--warning)' : 'var(--success)' }}>
                        {stats.unsureRate.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Marked uncertain</span>
                </div>

                <div className={styles.statCard}>
                    <span className={styles.statLabel} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={16} /> Repeat Errors
                    </span>
                    <span className={styles.statValue} style={{ color: stats.repeatErrorRate > 10 ? 'var(--error)' : 'var(--success)' }}>
                        {stats.repeatErrorRate.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recidivism on reviews</span>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Domain Performance (Weakest First)</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats.domainPerformance.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No sufficient data yet.</p>}

                    {stats.domainPerformance.map((d: any) => (
                        <div key={d.domain} style={{
                            padding: '1.5rem',
                            background: 'var(--surface)',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{d.domain}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{d.total} questions answered</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: d.accuracy < 60 ? 'var(--error)' : (d.accuracy < 80 ? 'var(--warning)' : 'var(--success)')
                                }}>
                                    {d.accuracy.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px', color: '#0369a1', fontSize: '0.9rem' }}>
                <strong>Tip:</strong> Focus your study modules on the domains with accuracy below 60%.
            </div>
        </AppLayout>
    );
}
