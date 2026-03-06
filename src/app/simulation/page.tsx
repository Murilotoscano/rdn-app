import React, { Suspense } from 'react';
import { getQuestions } from '@/lib/questions';
import ExamInterface from '@/components/Quiz/ExamInterface';
import { Question } from '@/types';

// Mock function to duplicate questions to reach target count
function multiplyQuestions(questions: Question[], target: number): Question[] {
    if (questions.length === 0) return [];

    let result = [...questions];
    while (result.length < target) {
        // Clone and randomize ID to avoid key conflicts
        const clone = questions.map(q => ({
            ...q,
            id: `${q.id}-${result.length}-${Math.random().toString(36).substr(2, 9)}`
        }));
        result = [...result, ...clone];
    }
    return result.slice(0, target);
}

async function SimulationContent() {
    // Get all database questions
    const baseQuestions = await getQuestions(undefined, 145);

    // Simulate 145 questions for the exam (multiply if needed)
    // NOTE: In production, we would pick random ones. Here we just ensure we have 145.
    const examQuestions = multiplyQuestions(baseQuestions, 145);

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
