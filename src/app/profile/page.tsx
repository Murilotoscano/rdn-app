
import AppLayout from "@/components/Layout/AppLayout";
import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <AppLayout>
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{
                    background: 'var(--bg-secondary)',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <User size={40} />
                </div>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your Profile</h1>
                <p>Manage your account, subscription, and preferences.</p>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>Available in Phase 3</p>
            </div>
        </AppLayout>
    );
}
