'use client';

import { useState } from 'react';
import { drawBlueprintExam } from '@/lib/questions';
import { store } from '@/lib/store';
import { EXAM_MAX_QUESTIONS } from '@/lib/examRules';
import ExamInterface from '@/components/Quiz/ExamInterface';

export default function ExamSession({ realConditions }: { realConditions: boolean }) {
    // Drawn once per visit, unseen questions first. Recording which ones were new lets the
    // result report a score on questions the student could not have memorized.
    const [exam] = useState(() => {
        const seen = store.getSeen();
        const questions = drawBlueprintExam(EXAM_MAX_QUESTIONS, undefined, seen);
        const freshIds = new Set(questions.filter(q => !(q.id in seen)).map(q => q.id));
        return { questions, freshIds };
    });

    return (
        <ExamInterface
            questions={exam.questions}
            freshIds={exam.freshIds}
            realConditions={realConditions}
        />
    );
}
