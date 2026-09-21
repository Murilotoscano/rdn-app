"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { store, SyncResult } from "@/lib/store";
import { downloadBackup, notifyDataChanged, subscribeToData } from "@/lib/backup";
import SyncAccount from "@/components/SyncAccount";
import { Download, Upload, ShieldCheck, ShieldAlert, User, RefreshCw } from "lucide-react";

interface Summary {
    logged: number;
    mastered: number;
    exams: number;
    cdr: number;
    custom: number;
    lastBackup: string | null;
}

const EMPTY_SUMMARY: Summary = { logged: 0, mastered: 0, exams: 0, cdr: 0, custom: 0, lastBackup: null };

// useSyncExternalStore re-reads on every render, so the snapshot must be referentially
// stable while the underlying strings are unchanged, or React loops forever.
let cacheKey: string | null = null;
let cached: Summary = EMPTY_SUMMARY;

function getSummary(): Summary {
    const raw = [
        localStorage.getItem('rdn_error_log'),
        localStorage.getItem('rdn_exam_history'),
        localStorage.getItem('rdn_cdr_progress'),
        localStorage.getItem('rdn_custom_questions'),
        localStorage.getItem('rdn_last_backup_at'),
    ].join('~');

    if (raw !== cacheKey) {
        cacheKey = raw;
        const log = store.getErrorLog();
        cached = {
            logged: log.length,
            mastered: log.filter(i => i.mastered).length,
            exams: store.getExamHistory().length,
            cdr: Object.keys(store.getCdrProgress()).length,
            custom: store.getCustomQuestions().length,
            lastBackup: localStorage.getItem('rdn_last_backup_at'),
        };
    }
    return cached;
}

/** Nothing is readable during SSR; the real numbers arrive on hydration. */
const getServerSummary = (): Summary => EMPTY_SUMMARY;


export default function ProfilePage() {
    const summary = useSyncExternalStore(subscribeToData, getSummary, getServerSummary);
    const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
    const [remote, setRemote] = useState<SyncResult | null>(null);
    const [syncing, setSyncing] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let live = true;
        store.checkRemote().then(r => { if (live) setRemote(r); });
        const unsubscribe = subscribeToData(() => setRemote(store.getCloudStatus().result));
        return () => { live = false; unsubscribe(); };
    }, []);

    const handleExport = () => {
        const filename = downloadBackup();
        setMessage({ kind: 'ok', text: `Backup saved as ${filename}. Keep it somewhere off this device.` });
    };

    const handleImport = async (file: File) => {
        try {
            const result = store.importAll(JSON.parse(await file.text()));
            notifyDataChanged();
            setMessage({
                kind: 'ok',
                text: `Restored: ${result.added} new review items, ${result.updated} updated, ${result.examsAdded} exams added. Newer local progress was kept.`
            });
        } catch (e) {
            setMessage({ kind: 'error', text: e instanceof Error ? e.message : 'Could not read that file.' });
        }
    };

    const remoteOk = remote?.state === 'ok';

    const card: React.CSSProperties = {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    return (
        <AppLayout>
            <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem' }}>
                <div style={{
                    background: 'var(--bg-secondary)', width: 56, height: 56, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                    <User size={28} />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Your Profile</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Your study data and where it lives.</p>
                </div>
            </header>

            {/* Where the data actually is */}
            <div style={{
                ...card,
                borderLeft: `4px solid ${remoteOk ? 'var(--success)' : '#f59e0b'}`,
                display: 'flex', gap: 12, alignItems: 'flex-start'
            }}>
                {remoteOk
                    ? <ShieldCheck size={22} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    : <ShieldAlert size={22} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px' }}>
                        {remote === null ? 'Checking cloud backup...' : remoteOk ? 'Last cloud sync completed' : 'Cloud sync incomplete'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                        {remote === null
                            ? 'Testing whether your progress can reach the server.'
                            : remoteOk
                                ? 'Your review queue, completed exams and question history sync when you study, return to the app or reconnect. CDR and generated-question progress are included in file backups.'
                                : `Your latest changes may exist only on this device. Keep studying here and export a backup before changing devices or clearing browser data. (${remote.message})`}
                    </p>
                    <button className="btn" disabled={syncing} style={{ marginTop: 10 }} onClick={async () => {
                        setSyncing(true);
                        try { setRemote(await store.fullSync()); }
                        finally { setSyncing(false); }
                    }}>
                        <RefreshCw size={14} /> {syncing ? 'Syncing...' : 'Sync now'}
                    </button>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                        <SyncAccount />
                    </div>
                    {summary.lastBackup && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '8px 0 0' }}>
                            Last export: {new Date(summary.lastBackup).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>

            {/* What is stored */}
            <div style={card}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem' }}>What you have stored</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                    {([
                        ['Review items', summary.logged],
                        ['Mastered', summary.mastered],
                        ['Exams taken', summary.exams],
                        ['CDR attempted', summary.cdr],
                        ['Generated Qs', summary.custom],
                    ] as const).map(([label, value]) => (
                        <div key={label}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Backup / restore */}
            <div style={card}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem' }}>Backup &amp; Restore</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 0, lineHeight: 1.5 }}>
                    Export writes one JSON file with your error log, exam history, CDR progress and generated
                    questions. Restore merges a file back in, keeping whichever copy of each item is newer.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleExport}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Download size={18} /> Export backup
                    </button>
                    <button className="btn" onClick={() => fileInput.current?.click()}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid var(--border)' }}>
                        <Upload size={18} /> Restore from file
                    </button>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="application/json,.json"
                        hidden
                        onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) handleImport(f);
                            e.target.value = '';
                        }}
                    />
                </div>

                {message && (
                    <div style={{
                        marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.9rem',
                        background: message.kind === 'ok' ? '#f0fdf4' : '#fef2f2',
                        color: message.kind === 'ok' ? '#166534' : '#b91c1c',
                        border: `1px solid ${message.kind === 'ok' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.text}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
