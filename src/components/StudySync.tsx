"use client";

import { useEffect } from 'react';
import { store } from '@/lib/store';

/** One listener set for the app, including return from iPad Safari suspension. */
export default function StudySync() {
    useEffect(() => {
        const sync = () => {
            if (document.visibilityState === 'visible') void store.fullSync();
        };
        sync();
        window.addEventListener('focus', sync);
        window.addEventListener('online', sync);
        document.addEventListener('visibilitychange', sync);
        return () => {
            window.removeEventListener('focus', sync);
            window.removeEventListener('online', sync);
            document.removeEventListener('visibilitychange', sync);
        };
    }, []);
    return null;
}
