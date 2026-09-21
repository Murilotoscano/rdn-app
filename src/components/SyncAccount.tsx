"use client";

import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { store } from '@/lib/store';

/**
 * Sign-in for cross-device sync, one account used on every device.
 *
 * The anon key is part of the published page, so it cannot be what protects the data:
 * the tables grant access only to a signed-in owner (see
 * supabase/migrations/20260922_personal_access.sql). The password is typed here and kept
 * by supabase-js in this browser's storage; it is never written into the source or the repo.
 */
export default function SyncAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signedInAs, setSignedInAs] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isSupabaseConfigured) return;
        void supabase.auth.getSession().then(({ data }) => setSignedInAs(data.session?.user.email ?? null));
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
            setSignedInAs(session?.user.email ?? null));
        return () => sub.subscription.unsubscribe();
    }, []);

    if (!isSupabaseConfigured) {
        return (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Cloud sync is not configured for this build, so progress stays on this device.
                Use Export backup to move it.
            </p>
        );
    }

    const signIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setMessage(null);
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        setBusy(false);
        setPassword('');
        if (error) { setMessage(error.message); return; }
        const result = await store.fullSync();
        setMessage(result.state === 'ok' ? 'Signed in and synced.' : `Signed in. ${result.message}`);
    };

    const signOut = async () => {
        setBusy(true);
        await supabase.auth.signOut();
        setBusy(false);
        setMessage('Signed out. Progress stays on this device.');
    };

    if (signedInAs) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: '0.9rem' }}>Syncing as <strong>{signedInAs}</strong>.</p>
                <button className="btn" onClick={signOut} disabled={busy} style={{ alignSelf: 'flex-start' }}>
                    Sign out of sync
                </button>
                {message && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{message}</p>}
            </div>
        );
    }

    return (
        <form onSubmit={signIn} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Sign in once on each device to share history between them.
            </p>
            <input
                type="email" autoComplete="username" required placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}
            />
            <input
                type="password" autoComplete="current-password" required placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}
            />
            <button className="btn btn-primary" type="submit" disabled={busy} style={{ alignSelf: 'flex-start' }}>
                {busy ? 'Signing in...' : 'Sign in to sync'}
            </button>
            {message && <p style={{ fontSize: '0.85rem', color: 'var(--error)' }}>{message}</p>}
        </form>
    );
}
