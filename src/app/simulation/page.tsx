import SimulationLoader from './SimulationLoader';

export default async function SimulationPage({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string }>;
}) {
    const { mode } = await searchParams;

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Real exam rules by default; ?mode=review keeps the older flag-and-review mock. */}
            <SimulationLoader realConditions={mode !== 'review'} />
        </div>
    );
}
