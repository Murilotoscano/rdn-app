import React, { Suspense } from 'react';
import { getBlueprintExam } from '@/lib/questions';
import ExamInterface from '@/components/Quiz/ExamInterface';

// Without this the page is prerendered at build time, which would freeze one
// draw of 145 questions and one option-shuffle seed into every visit.
export const dynamic = 'force-dynamic';

async function SimulationContent() {
    // Drawn to the CDR domain weights (21/45/21/13) rather than uniformly across the bank,
    // which otherwise under-tests Domain II by ~15 questions and over-tests Domains I and III.
    const examQuestions = await getBlueprintExam(145);

    return <ExamInterface questions={examQuestions} />;
}

export default function SimulationPage() {
    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <Suspense fallback={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: '#667eea',
                    fontWeight: 'bold'
                }}>
                    Loading Exam (145 Questions)...
                </div>
            }>
                <SimulationContent />
            </Suspense>
        </div>
    );
}
