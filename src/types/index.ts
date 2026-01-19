export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    moduleId: string; // e.g. "mod1"
    domain: string; // e.g. "I. Food and Nutrition Sciences"
    topic?: string;
    subtopic?: string;
    difficulty: Difficulty;
    text: string;
    options: [string, string, string, string]; // Exact 4 options as per RDN
    correctIndex: number; // 0-3
    explanation: string;
    rationale?: string; // Additional detailed info
    references?: string[];
    tags?: string[];
}

export interface ExamSession {
    id: string;
    mode: 'real' | 'practice' | 'custom';
    startTime: number;
    answers: Record<string, number>; // questionId -> selectedIndex
    completed: boolean;
    score?: number;
}
