"use client";

import { useSyncExternalStore } from "react";
import { store, BackupStatus } from "./store";

export const DATA_CHANGED_EVENT = 'rdn-data-changed';

/** Tells every mounted view to re-read localStorage after a write. */
export function notifyDataChanged() {
    window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
}

export function subscribeToData(onChange: () => void) {
    window.addEventListener('storage', onChange);
    window.addEventListener(DATA_CHANGED_EVENT, onChange);
    return () => {
        window.removeEventListener('storage', onChange);
        window.removeEventListener(DATA_CHANGED_EVENT, onChange);
    };
}

/** Writes the whole study record to a JSON file and marks the backup as taken. */
export function downloadBackup(): string {
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `rdn-backup-${stamp}.json`;

    const url = URL.createObjectURL(
        new Blob([JSON.stringify(store.exportAll(), null, 2)], { type: 'application/json' })
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    store.recordBackup();
    notifyDataChanged();
    return filename;
}

const IDLE_STATUS: BackupStatus = {
    itemsAtRisk: 0, neverBackedUp: true, daysSinceBackup: null, due: false, urgent: false
};

// useSyncExternalStore re-reads on every render, so the snapshot has to stay referentially
// stable while the underlying data is unchanged, or React re-renders forever.
let statusKey: string | null = null;
let statusCache: BackupStatus = IDLE_STATUS;

function getStatus(): BackupStatus {
    const key = [
        localStorage.getItem('rdn_error_log'),
        localStorage.getItem('rdn_exam_history'),
        localStorage.getItem('rdn_last_backup_at'),
        localStorage.getItem('rdn_backup_reminder_snoozed_until'),
        // Re-evaluate at most once per hour so "7 days since backup" eventually becomes true
        // without the snapshot changing identity on every render.
        Math.floor(Date.now() / 3_600_000),
    ].join('~');

    if (key !== statusKey) {
        statusKey = key;
        statusCache = store.getBackupStatus();
    }
    return statusCache;
}

const getServerStatus = (): BackupStatus => IDLE_STATUS;

export function useBackupStatus(): BackupStatus {
    return useSyncExternalStore(subscribeToData, getStatus, getServerStatus);
}
