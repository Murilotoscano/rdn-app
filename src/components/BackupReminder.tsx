"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Download, X } from "lucide-react";
import { store } from "@/lib/store";
import { downloadBackup, notifyDataChanged, useBackupStatus } from "@/lib/backup";

/**
 * Nags for a backup only when there is unsaved study progress, because remote sync is not
 * reachable and everything lives in this browser. Hidden entirely once a backup is current.
 */
export default function BackupReminder() {
    const status = useBackupStatus();
    const [saved, setSaved] = useState<string | null>(null);

    // Clear the confirmation so the banner can go back to warning if work piles up again
    // without a page reload in between.
    useEffect(() => {
        if (!saved) return;
        const t = setTimeout(() => setSaved(null), 8000);
        return () => clearTimeout(t);
    }, [saved]);

    if (!status.due && !saved) return null;

    const handleExport = () => setSaved(downloadBackup());

    const handleSnooze = () => {
        store.snoozeBackupReminder();
        notifyDataChanged();
    };

    if (saved) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem',
                padding: '0.75rem 1rem', borderRadius: 10, fontSize: '0.9rem',
                background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0'
            }}>
                <Download size={18} />
                <span>Saved <strong>{saved}</strong>. Move it off this device — Drive, email, anywhere.</span>
            </div>
        );
    }

    const accent = status.urgent ? '#b91c1c' : '#b45309';
    const surface = status.urgent ? '#fef2f2' : '#fffbeb';
    const edge = status.urgent ? '#fecaca' : '#fde68a';

    const since = status.neverBackedUp
        ? 'never been backed up'
        : `not been backed up in ${status.daysSinceBackup} days`;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            marginBottom: '1.5rem', padding: '0.85rem 1rem', borderRadius: 10,
            background: surface, border: `1px solid ${edge}`, borderLeft: `4px solid ${accent}`
        }}>
            <ShieldAlert size={20} style={{ color: accent, flexShrink: 0 }} />

            <div style={{ flex: 1, minWidth: 240, fontSize: '0.9rem', color: accent, lineHeight: 1.5 }}>
                <strong>{status.itemsAtRisk} items exist only in this browser</strong> and have {since}.
                Clearing site data would erase your review queue and exam history.
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                    onClick={handleExport}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.9rem',
                        borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600,
                        fontSize: '0.85rem', background: accent, color: '#fff'
                    }}
                >
                    <Download size={15} /> Back up now
                </button>
                <button
                    onClick={handleSnooze}
                    title="Remind me in 3 days"
                    aria-label="Remind me in 3 days"
                    style={{
                        display: 'flex', alignItems: 'center', padding: '0.5rem',
                        borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: 'transparent', color: accent
                    }}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
