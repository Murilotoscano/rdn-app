'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { drawBlueprintExam } from '@/lib/questions';
import { store } from '@/lib/store';
import { EXAM_MAX_QUESTIONS } from '@/lib/examRules';
import ExamInterface from '@/components/Quiz/ExamInterface';
import type { Question } from '@/types';

export default function ExamSession({ realConditions }: { realConditions: boolean }) {
    const [exam, setExam] = useState<{ questions: Question[]; freshIds: Set<string>; freshHistoryAvailable: boolean } | null>(null);
    const [syncError, setSyncError] = useState(false);
    const live = useRef(true);
    const start = useCallback((freshHistoryAvailable: boolean) => {
        setExam(current => {
            if (current) return current;
            const seen = store.getSeenOrExposed();
            const questions = drawBlueprintExam(EXAM_MAX_QUESTIONS, undefined, seen);
            const freshIds = new Set(questions.filter(q => !(q.id in seen)).map(q => q.id));
            return { questions, freshIds, freshHistoryAvailable };
        });
    }, []);
    const prepare = useCallback(async () => {
        setSyncError(false);
        const result = await store.fullSync();
        if (!live.current) return;
        if (result.state === 'error') setSyncError(true);
        else start(result.state === 'ok');
    }, [start]);
    useEffect(() => {
        live.current = true;
        void prepare();
        return () => { live.current = false; };
    }, [prepare]);

    if (!exam) return (
        <div style={{ maxWidth: 560, margin: '15vh auto', padding: 24 }}>
            <h1>{syncError ? 'Your other device’s history is unavailable' : 'Preparing your exam...'}</h1>
            <p>{syncError
                ? 'You can retry, or take this exam using the history on this device. If you continue now, unseen-question accuracy will be unavailable for this session.'
                : 'Updating question history before selecting your exam. The timer has not started.'}</p>
            {syncError && <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => void prepare()}>Retry sync</button>
                <button className="btn" onClick={() => start(false)}>Continue on this device</button>
            </div>}
        </div>
    );

    return (
        <ExamInterface
            questions={exam.questions}
            freshIds={exam.freshIds}
            realConditions={realConditions}
            freshHistoryAvailable={exam.freshHistoryAvailable}
        />
    );
}
