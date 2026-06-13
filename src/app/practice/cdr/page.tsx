"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import CdrQuestionCard from "@/components/Quiz/CdrQuestionCard";
import { CDR_QUESTIONS } from "@/data/cdrQuestions";
import { store, CdrProgress } from "@/lib/store";
import { CdrQuestion } from "@/types";
import styles from "./cdrPractice.module.css";
import { Award, FileText, Settings, Key, AlertTriangle, Eye, ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function CdrPracticePage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cdrProgress, setCdrProgress] = useState<Record<string, CdrProgress>>({});
    
    // API Key settings
    const [apiKey, setApiKey] = useState("");
    const [isApiOpen, setIsApiOpen] = useState(false);
    const [apiKeySaved, setApiKeySaved] = useState(false);

    // Similar questions mode state
    const [isSimilarMode, setIsSimilarMode] = useState(false);
    const [similarQuestions, setSimilarQuestions] = useState<CdrQuestion[]>([]);
    const [similarIndex, setSimilarIndex] = useState(0);
    const [similarProgress, setSimilarProgress] = useState<Record<string, CdrProgress>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState("");

    // Load progress and API key on mount
    useEffect(() => {
        setCdrProgress(store.getCdrProgress());
        const savedKey = localStorage.getItem("gemini_api_key") || "";
        setApiKey(savedKey);
        if (savedKey) {
            setApiKeySaved(true);
        }
    }, []);

    const handleSaveApiKey = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("gemini_api_key", apiKey.trim());
        setApiKeySaved(!!apiKey.trim());
        setIsApiOpen(false);
    };

    const handleClearApiKey = () => {
        localStorage.removeItem("gemini_api_key");
        setApiKey("");
        setApiKeySaved(false);
    };

    const handleAnswer = (index: number, isCorrect: boolean) => {
        if (isSimilarMode) {
            const q = similarQuestions[similarIndex];
            const status = isCorrect ? 'correct' : 'incorrect';
            store.updateCustomQuestionProgress(q.id, {
                status,
                attempts: (similarProgress[q.id]?.attempts || 0) + 1
            });
            setSimilarProgress(store.getCustomProgress());
        } else {
            const q = CDR_QUESTIONS[currentIndex];
            const status = isCorrect ? 'correct' : 'incorrect';
            store.updateCdrQuestionProgress(q.id, {
                status,
                attempts: (cdrProgress[q.id]?.attempts || 0) + 1
            });
            setCdrProgress(store.getCdrProgress());
        }
    };

    const handleToggleReview = (isMarked: boolean) => {
        if (isSimilarMode) {
            const q = similarQuestions[similarIndex];
            store.updateCustomQuestionProgress(q.id, { markedForReview: isMarked });
            setSimilarProgress(store.getCustomProgress());
        } else {
            const q = CDR_QUESTIONS[currentIndex];
            store.updateCdrQuestionProgress(q.id, { markedForReview: isMarked });
            setCdrProgress(store.getCdrProgress());
        }
    };

    const handleSaveNotes = (notes: string) => {
        if (isSimilarMode) {
            const q = similarQuestions[similarIndex];
            store.updateCustomQuestionProgress(q.id, { notes });
            setSimilarProgress(store.getCustomProgress());
        } else {
            const q = CDR_QUESTIONS[currentIndex];
            store.updateCdrQuestionProgress(q.id, { notes });
            setCdrProgress(store.getCdrProgress());
        }
    };

    const handleSelectErrorType = (errorType: string) => {
        if (isSimilarMode) {
            const q = similarQuestions[similarIndex];
            store.updateCustomQuestionProgress(q.id, { errorType });
            setSimilarProgress(store.getCustomProgress());
        } else {
            const q = CDR_QUESTIONS[currentIndex];
            store.updateCdrQuestionProgress(q.id, { errorType });
            setCdrProgress(store.getCdrProgress());
        }
    };

    // Call API to generate 10 similar questions
    const handleGenerateSimilar = async () => {
        const activeQuestion = CDR_QUESTIONS[currentIndex];
        
        const savedKey = localStorage.getItem("gemini_api_key") || "";
        if (!savedKey) {
            setIsApiOpen(true);
            setGenerationError("A Gemini API Key is required to generate similar questions. Please enter your key below.");
            return;
        }

        setIsGenerating(true);
        setGenerationError("");

        try {
            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': savedKey
                },
                body: JSON.stringify({
                    concept: activeQuestion.concept,
                    originalQuestion: activeQuestion.text,
                    domain: activeQuestion.domain,
                    topic: activeQuestion.topic,
                    subtopic: activeQuestion.subtopic
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to generate questions");
            }

            const data = await response.json();
            if (data.questions && Array.isArray(data.questions)) {
                // Ensure correct structure for quiz
                const mappedQuestions: CdrQuestion[] = data.questions.map((q: any, idx: number) => ({
                    ...q,
                    moduleId: "custom",
                    questionNumber: idx + 1,
                    correctLetter: String.fromCharCode(65 + q.correctIndex),
                    correctText: q.options[q.correctIndex],
                    questionType: "application",
                    sourcePdf: "AI Engine",
                    location: `Generated from concept: ${activeQuestion.concept}`
                }));

                // Save to local custom question bank so user keeps them
                store.addCustomQuestions(mappedQuestions);

                setSimilarQuestions(mappedQuestions);
                setSimilarIndex(0);
                setIsSimilarMode(true);
                setSimilarProgress(store.getCustomProgress());
            } else {
                throw new Error("Invalid response format from generator");
            }
        } catch (e: any) {
            console.error(e);
            setGenerationError(e.message || "Failed to communicate with AI model.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        if (isSimilarMode) {
            if (similarIndex < similarQuestions.length - 1) {
                setSimilarIndex(prev => prev + 1);
            }
        } else {
            if (currentIndex < CDR_QUESTIONS.length - 1) {
                setCurrentIndex(prev => prev + 1);
            }
        }
    };

    const handlePrev = () => {
        if (isSimilarMode) {
            if (similarIndex > 0) {
                setSimilarIndex(prev => prev - 1);
            }
        } else {
            if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            }
        }
    };

    // Calculate stats
    const totalCdr = CDR_QUESTIONS.length;
    const attemptedCdr = Object.values(cdrProgress).filter(p => p.status !== 'not attempted').length;
    const correctCdr = Object.values(cdrProgress).filter(p => p.status === 'correct' || p.status === 'mastered').length;
    const markedCount = Object.values(cdrProgress).filter(p => p.markedForReview).length;

    const currentQuestion = isSimilarMode ? similarQuestions[similarIndex] : CDR_QUESTIONS[currentIndex];
    const currentProgress = isSimilarMode ? similarProgress[currentQuestion.id] : cdrProgress[currentQuestion.id];

    return (
        <AppLayout>
            <div className={styles.container}>
                {/* Top Action Bar */}
                <div className={styles.topBar}>
                    <div className={styles.titleSection}>
                        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Award size={28} style={{ color: "var(--accent)" }} />
                            Official CDR Practice Questions
                        </h1>
                        <p>September 2024 (Corrected Release) • Private Study Environment</p>
                    </div>

                    <div className={styles.actions}>
                        {/* Open PDF Stream Link */}
                        <a 
                            href="/api/view-pdf?file=RD Exam Practice Questions with Rationales September 2024 - Corrected.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.btnSecondary}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "600" }}
                        >
                            <Eye size={18} />
                            Open Source PDF
                        </a>

                        <button 
                            className={clsx(styles.btn, isApiOpen ? styles.btnPrimary : styles.btnSecondary)}
                            onClick={() => setIsApiOpen(!isApiOpen)}
                        >
                            <Settings size={18} />
                            API Key Settings
                        </button>
                    </div>
                </div>

                {/* API Settings Drawer Panel */}
                {isApiOpen && (
                    <div className={styles.apiPanel}>
                        <div className={styles.apiPanelHeader}>
                            <Key size={18} />
                            Configure Gemini API Key
                        </div>
                        <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Enter your Gemini API key to enable AI-powered features like generating 10 similar questions for any concept. Your key is stored safely in your browser&apos;s local storage.
                        </p>
                        <form onSubmit={handleSaveApiKey} className={styles.apiPanelForm}>
                            <input 
                                type="password" 
                                className={styles.input}
                                placeholder="Paste Gemini API Key here (starts with AIza)..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <button type="submit" className={styles.btnPrimary} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}>
                                Save Key
                            </button>
                            {apiKeySaved && (
                                <button type="button" className={styles.btnSecondary} onClick={handleClearApiKey} style={{ padding: "10px 20px", borderRadius: "6px", border: "1px solid var(--border)", fontWeight: "600", cursor: "pointer" }}>
                                    Clear Key
                                </button>
                            )}
                        </form>
                        {apiKeySaved && (
                            <span className={styles.apiStatus}>
                                Status: <span className={styles.apiSuccess}>Active</span> (Key is saved)
                            </span>
                        )}
                    </div>
                )}

                {/* Generation Error Alert */}
                {generationError && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", padding: "16px", color: "#b91c1c", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <AlertTriangle style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                            <h4 style={{ margin: "0 0 4px 0", fontWeight: "700" }}>AI Generation Error</h4>
                            <p style={{ margin: 0, fontSize: "0.9rem" }}>{generationError}</p>
                        </div>
                    </div>
                )}

                {/* Similar Questions Header Banner */}
                {isSimilarMode && (
                    <div className={styles.similarBanner}>
                        <div className={styles.similarInfo}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <BrainCircuit size={20} />
                                AI Study Mode: Similar Questions Quiz
                            </h3>
                            <p>
                                Testing the concept: <strong>{CDR_QUESTIONS[currentIndex].concept}</strong>
                            </p>
                        </div>
                        <button 
                            className={clsx(styles.btn, styles.btnAiExit)}
                            onClick={() => setIsSimilarMode(false)}
                        >
                            <ArrowLeft size={18} />
                            Exit AI Mode (Return to Official CDR)
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
                <div className={styles.layout}>
                    
                    {/* Navigation Sidebar */}
                    <div className={styles.sidebar}>
                        
                        {/* Summary Stats */}
                        {!isSimilarMode ? (
                            <div className={styles.sidebarSection}>
                                <h3>Module Stats</h3>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statVal}>{attemptedCdr}/{totalCdr}</div>
                                        <div className={styles.statLbl}>Attempted</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statVal}>
                                            {attemptedCdr > 0 ? Math.round((correctCdr / attemptedCdr) * 100) : 0}%
                                        </div>
                                        <div className={styles.statLbl}>Accuracy</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statVal}>{correctCdr}</div>
                                        <div className={styles.statLbl}>Correct</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statVal}>{markedCount}</div>
                                        <div className={styles.statLbl}>Bookmarks</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.sidebarSection}>
                                <h3>AI Quiz Stats</h3>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statVal}>{similarQuestions.length}</div>
                                        <div className={styles.statLbl}>Total generated</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statVal}>AI Engine</div>
                                        <div className={styles.statLbl}>Concept Study</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Grid (Only show in official mode) */}
                        {!isSimilarMode ? (
                            <div className={styles.sidebarSection}>
                                <h3>Quick Navigation</h3>
                                <div className={styles.gridNav}>
                                    {CDR_QUESTIONS.map((q, idx) => {
                                        const qProg = cdrProgress[q.id];
                                        const isAttempted = qProg && qProg.status !== 'not attempted';
                                        const isCorrectAns = qProg && (qProg.status === 'correct' || qProg.status === 'mastered');
                                        const isBookmarked = qProg && qProg.markedForReview;

                                        return (
                                            <button
                                                key={q.id}
                                                className={clsx(
                                                    styles.navCircle,
                                                    currentIndex === idx && styles.activeCircle,
                                                    isAttempted && (isCorrectAns ? styles.correctCircle : styles.incorrectCircle),
                                                    isBookmarked && styles.reviewBorder
                                                )}
                                                onClick={() => {
                                                    setCurrentIndex(idx);
                                                    setIsSimilarMode(false);
                                                }}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.sidebarSection}>
                                <h3>AI Quiz Navigation</h3>
                                <div className={styles.gridNav}>
                                    {similarQuestions.map((q, idx) => {
                                        const qProg = similarProgress[q.id];
                                        const isAttempted = qProg && qProg.status !== 'not attempted';
                                        const isCorrectAns = qProg && (qProg.status === 'correct' || qProg.status === 'mastered');
                                        
                                        return (
                                            <button
                                                key={q.id}
                                                className={clsx(
                                                    styles.navCircle,
                                                    similarIndex === idx && styles.activeCircle,
                                                    isAttempted && (isCorrectAns ? styles.correctCircle : styles.incorrectCircle)
                                                )}
                                                onClick={() => setSimilarIndex(idx)}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Question Card Container */}
                    <div style={{ flex: 1 }}>
                        <CdrQuestionCard
                            question={currentQuestion}
                            progress={currentProgress}
                            onAnswer={handleAnswer}
                            onNext={handleNext}
                            onPrev={currentQuestion.questionNumber > 1 ? handlePrev : undefined}
                            currIndex={isSimilarMode ? similarIndex : currentIndex}
                            total={isSimilarMode ? similarQuestions.length : CDR_QUESTIONS.length}
                            onToggleReview={handleToggleReview}
                            onSaveNotes={handleSaveNotes}
                            onSelectErrorType={handleSelectErrorType}
                            onGenerateSimilar={!isSimilarMode ? handleGenerateSimilar : undefined}
                            isGeneratingSimilar={isGenerating}
                        />
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
