'use client';

import dynamic from 'next/dynamic';

// Client-only: the draw reads which questions this browser has already attempted,
// and rendering it on the server would produce a different exam than the client's.
const ExamSession = dynamic(() => import('./ExamSession'), {
    ssr: false,
    loading: () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: '#667eea',
            fontWeight: 'bold'
        }}>
            Preparing your exam...
        </div>
    ),
});

export default function SimulationLoader({ realConditions }: { realConditions: boolean }) {
    return <ExamSession realConditions={realConditions} />;
}
