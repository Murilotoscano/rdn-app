"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import CdrQuestionCard from "@/components/Quiz/CdrQuestionCard";
import { store, CdrProgress } from "@/lib/store";
import { CdrQuestion } from "@/types";
import styles from "./pdfGenerator.module.css";
import { FileText, Settings, Key, AlertTriangle, Play, Brain, Check, RefreshCw, Eye, ArrowLeft, Cpu } from "lucide-react";
import clsx from "clsx";

const COURSE_PDFS = [
    { filename: "01_Food_Science.pdf", title: "01 Food Science" },
    { filename: "02_Normal_Nutrition.pdf", title: "02 Normal Nutrition" },
    { filename: "03_04_MNT_Resource.pdf", title: "03 & 04 MNT Resource" },
    { filename: "04_Renal_Supplement.pdf", title: "04 Renal Supplement" },
    { filename: "05_Calculations.pdf", title: "05 Calculations (Math)" },
    { filename: "05_Enteral_Parenteral.pdf", title: "05 Enteral & Parenteral" },
    { filename: "06_Food_Service_Logistics.pdf", title: "06 Foodservice Logistics" },
    { filename: "07_Management_Concepts.pdf", title: "07 Management Concepts" },
    { filename: "08_Counseling.pdf", title: "08 Counseling & Education" },
    { filename: "09_Research_Concepts.pdf", title: "09 Research Concepts" }
];

type FileStatus = 'idle' | 'parsing' | 'generating' | 'success' | 'failed';

export default function PdfGeneratorPage() {
    // API settings
    const [apiKey, setApiKey] = useState("");
    const [isApiOpen, setIsApiOpen] = useState(false);
    const [apiKeySaved, setApiKeySaved] = useState(false);

    // PDF statuses
    const [statusMap, setStatusMap] = useState<Record<string, FileStatus>>({});
    const [generatedMap, setGeneratedMap] = useState<Record<string, number>>({});
    const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
    const [errorMsg, setErrorMsg] = useState("");

    // Active quiz mode
    const [activeQuizPdf, setActiveQuizPdf] = useState<string | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<CdrQuestion[]>([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizProgress, setQuizProgress] = useState<Record<string, CdrProgress>>({});

    // Load API key and counts on mount
    useEffect(() => {
        const savedKey = localStorage.getItem("gemini_api_key") || "";
        setApiKey(savedKey);
        if (savedKey) {
            setApiKeySaved(true);
        }

        updateGeneratedCounts();
    }, []);

    const updateGeneratedCounts = () => {
        const customQs = store.getCustomQuestions();
        const counts: Record<string, number> = {};
        
        COURSE_PDFS.forEach(pdf => {
            // Count how many questions reference this file name
            const matching = customQs.filter(q => q.sourcePdf === pdf.filename);
            counts[pdf.filename] = matching.length;
        });

        setGeneratedMap(counts);
    };

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

    // Parse PDF and generate questions
    const handleAnalyze = async (filename: string) => {
        const savedKey = localStorage.getItem("gemini_api_key") || "";
        if (!savedKey) {
            setIsApiOpen(true);
            setErrorMsg("A Gemini API Key is required to run the PDF generator. Please enter your key below.");
            return;
        }

        setErrorMsg("");
        setStatusMap(prev => ({ ...prev, [filename]: 'parsing' }));

        try {
            // Step 1: Parse the PDF using server-side pdf-parse
            const parseRes = await fetch('/api/parse-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename })
            });

            if (!parseRes.ok) {
                const parseErr = await parseRes.json();
                throw new Error(parseErr.error || "Failed to parse PDF text.");
            }

            const parseData = await parseRes.json();
            setPageCounts(prev => ({ ...prev, [filename]: parseData.pageCount }));

            // Step 2: Use AI to extract concepts and generate RDN questions
            setStatusMap(prev => ({ ...prev, [filename]: 'generating' }));

            const aiRes = await fetch('/api/generate-questions-from-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': savedKey
                },
                body: JSON.stringify({
                    pdfText: parseData.text,
                    pdfName: filename,
                    limit: 5 // Generate 5 questions per run
                })
            });

            if (!aiRes.ok) {
                const aiErr = await aiRes.json();
                throw new Error(aiErr.error || "Failed to generate questions from text.");
            }

            const aiData = await aiRes.json();
            if (aiData.questions && Array.isArray(aiData.questions)) {
                // Map fields to CdrQuestion layout
                const mappedQuestions: CdrQuestion[] = aiData.questions.map((q: any, idx: number) => ({
                    ...q,
                    moduleId: "custom",
                    questionNumber: idx + 1,
                    correctLetter: String.fromCharCode(65 + q.correctIndex),
                    correctText: q.options[q.correctIndex],
                    questionType: q.questionType || "application",
                    difficulty: q.difficulty || "medium"
                }));

                // Add to custom questions list
                store.addCustomQuestions(mappedQuestions);
                
                // Update maps
                setStatusMap(prev => ({ ...prev, [filename]: 'success' }));
                updateGeneratedCounts();
            } else {
                throw new Error("Invalid response format from AI model.");
            }

        } catch (e: any) {
            console.error(e);
            setStatusMap(prev => ({ ...prev, [filename]: 'failed' }));
            setErrorMsg(e.message || `An error occurred while analyzing ${filename}.`);
        }
    };

    const handleStartQuiz = (filename: string) => {
        const customQs = store.getCustomQuestions();
        const pdfQs = customQs.filter(q => q.sourcePdf === filename) as CdrQuestion[];
        
        if (pdfQs.length === 0) return;

        // Load progress states for these custom questions
        const customProg = store.getCustomProgress();
        
        setQuizQuestions(pdfQs);
        setQuizIndex(0);
        setActiveQuizPdf(filename);
        setQuizProgress(customProg);
    };

    const handleAnswer = (index: number, isCorrect: boolean) => {
        const q = quizQuestions[quizIndex];
        const status = isCorrect ? 'correct' : 'incorrect';
        store.updateCustomQuestionProgress(q.id, {
            status,
            attempts: (quizProgress[q.id]?.attempts || 0) + 1
        });
        setQuizProgress(store.getCustomProgress());
    };

    const handleToggleReview = (isMarked: boolean) => {
        const q = quizQuestions[quizIndex];
        store.updateCustomQuestionProgress(q.id, { markedForReview: isMarked });
        setQuizProgress(store.getCustomProgress());
    };

    const handleSaveNotes = (notes: string) => {
        const q = quizQuestions[quizIndex];
        store.updateCustomQuestionProgress(q.id, { notes });
        setQuizProgress(store.getCustomProgress());
    };

    const handleSelectErrorType = (errorType: string) => {
        const q = quizQuestions[quizIndex];
        store.updateCustomQuestionProgress(q.id, { errorType });
        setQuizProgress(store.getCustomProgress());
    };

    const handleNext = () => {
        if (quizIndex < quizQuestions.length - 1) {
            setQuizIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (quizIndex > 0) {
            setQuizIndex(prev => prev - 1);
        }
    };

    // Calculate total questions generated overall
    const totalGenerated = Object.values(generatedMap).reduce((a, b) => a + b, 0);

    return (
        <AppLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.topBar}>
                    <div className={styles.titleSection}>
                        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Brain size={28} style={{ color: "#ec4899" }} />
                            Course PDF Analyzer & Question Generator
                        </h1>
                        <p>Leverage Gemini 2.5 Flash to convert your 10 course PDFs into RDN Exam questions</p>
                    </div>

                    <button 
                        className={clsx(styles.apiBtn, isApiOpen && styles.apiBtnActive)}
                        onClick={() => setIsApiOpen(!isApiOpen)}
                    >
                        <Settings size={18} />
                        Gemini API Key
                    </button>
                </div>

                {/* API settings */}
                {isApiOpen && (
                    <div className={styles.apiPanel}>
                        <div className={styles.apiPanelHeader}>
                            <Key size={18} />
                            Configure Gemini API Key
                        </div>
                        <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Enter your Gemini API key to run the PDF generator. The key remains entirely private inside your local browser storage.
                        </p>
                        <form onSubmit={handleSaveApiKey} className={styles.apiPanelForm}>
                            <input 
                                type="password" 
                                className={styles.input}
                                placeholder="Paste Gemini API Key here (starts with AIza)..."
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <button type="submit" className={styles.btnPrimary}>
                                Save Key
                            </button>
                            {apiKeySaved && (
                                <button type="button" className={styles.btnSecondary} onClick={handleClearApiKey}>
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

                {/* Error Banner */}
                {errorMsg && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", padding: "16px", color: "#b91c1c", display: "flex", gap: 10 }}>
                        <AlertTriangle style={{ flexShrink: 0 }} />
                        <div>
                            <h4 style={{ margin: "0 0 4px 0", fontWeight: "700" }}>Analyzer Notice</h4>
                            <p style={{ margin: 0, fontSize: "0.9rem" }}>{errorMsg}</p>
                        </div>
                    </div>
                )}

                {/* Quiz View Mode */}
                {activeQuizPdf && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div className={styles.quizHeader}>
                            <div className={styles.quizInfo}>
                                <h3>
                                    Studying Generated Questions: {COURSE_PDFS.find(p => p.filename === activeQuizPdf)?.title}
                                </h3>
                                <p>Source Material Quiz • {quizQuestions.length} Questions</p>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                {/* Quiz Nav Circles */}
                                <div style={{ display: "flex", gap: 6 }}>
                                    {quizQuestions.map((q, idx) => {
                                        const qProg = quizProgress[q.id];
                                        const isAttempted = qProg && qProg.status !== 'not attempted';
                                        const isCorrect = qProg && (qProg.status === 'correct' || qProg.status === 'mastered');

                                        return (
                                            <button
                                                key={q.id}
                                                className={clsx(
                                                    styles.navCircle,
                                                    quizIndex === idx && styles.activeCircle,
                                                    isAttempted && (isCorrect ? styles.correctCircle : styles.incorrectCircle)
                                                )}
                                                onClick={() => setQuizIndex(idx)}
                                            >
                                                {idx + 1}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button 
                                    className={styles.btnSecondary}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.85rem", padding: "8px 14px", borderRadius: "6px" }}
                                    onClick={() => setActiveQuizPdf(null)}
                                >
                                    <ArrowLeft size={16} />
                                    Close Quiz
                                </button>
                            </div>
                        </div>

                        <CdrQuestionCard
                            question={quizQuestions[quizIndex]}
                            progress={quizProgress[quizQuestions[quizIndex]?.id]}
                            onAnswer={handleAnswer}
                            onNext={handleNext}
                            onPrev={quizIndex > 0 ? handlePrev : undefined}
                            currIndex={quizIndex}
                            total={quizQuestions.length}
                            onToggleReview={handleToggleReview}
                            onSaveNotes={handleSaveNotes}
                            onSelectErrorType={handleSelectErrorType}
                        />
                    </div>
                )}

                {/* Dashboard Split View */}
                {!activeQuizPdf && (
                    <div className={styles.mainGrid}>
                        {/* Files Grid */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-main)", marginBottom: 8 }}>
                                Course Study Materials (10 Files)
                            </h2>

                            <div className={styles.filesGrid}>
                                {COURSE_PDFS.map((pdf) => {
                                    const status = statusMap[pdf.filename] || 'idle';
                                    const count = generatedMap[pdf.filename] || 0;

                                    return (
                                        <div key={pdf.filename} className={styles.fileCard}>
                                            <div className={styles.fileHeader}>
                                                <div className={styles.fileIconBox}>
                                                    <FileText size={20} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h3 className={styles.fileTitle}>{pdf.title}</h3>
                                                    <span className={styles.fileStatus}>
                                                        {status === 'idle' && count === 0 && "Ready to parse"}
                                                        {status === 'parsing' && (
                                                            <span className={styles.statusAnalyzing}>
                                                                <span className={styles.spinner}></span>
                                                                Parsing PDF...
                                                            </span>
                                                        )}
                                                        {status === 'generating' && (
                                                            <span className={styles.statusAnalyzing}>
                                                                <span className={styles.spinner}></span>
                                                                AI Generating...
                                                            </span>
                                                        )}
                                                        {status === 'success' && (
                                                            <span className={styles.statusComplete}>
                                                                <Check size={14} style={{ display: "inline", marginRight: 2 }} />
                                                                Questions Generated
                                                            </span>
                                                        )}
                                                        {status === 'failed' && <span style={{ color: "#ef4444" }}>Extraction Failed</span>}
                                                        {count > 0 && status !== 'parsing' && status !== 'generating' && ` (${count} questions generated)`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.fileActions}>
                                                {/* PDF streaming viewer in new tab */}
                                                <a 
                                                    href={`/api/view-pdf?file=${pdf.filename}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={clsx(styles.actionBtn, styles.actionBtnSecondary)}
                                                >
                                                    <Eye size={14} />
                                                    View PDF
                                                </a>

                                                <button 
                                                    className={clsx(styles.actionBtn, styles.actionBtnPrimary)}
                                                    onClick={() => handleAnalyze(pdf.filename)}
                                                    disabled={status === 'parsing' || status === 'generating'}
                                                >
                                                    <Cpu size={14} />
                                                    {count > 0 ? "Regenerate" : "Generate 5"}
                                                </button>

                                                {count > 0 && (
                                                    <button 
                                                        className={styles.actionBtn}
                                                        style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)" }}
                                                        onClick={() => handleStartQuiz(pdf.filename)}
                                                    >
                                                        <Play size={14} />
                                                        Quiz
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sidebar Status Info */}
                        <div className={styles.sidebar}>
                            <div className={styles.sidebarCard}>
                                <h3>Generator Metrics</h3>
                                <div className={styles.kpi}>{totalGenerated}</div>
                                <div className={styles.kpiLabel}>Total original questions generated across course files</div>
                            </div>

                            <div className={styles.sidebarCard} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <h3>How it works</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                                    1. <strong>Document Extraction</strong>: Our node parser processes the underlying text structures of the selected course file.
                                </p>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                                    2. <strong>AI Concept Mapping</strong>: Gemini 2.5 Flash scans the extracted content, isolating core topics, subtopics, and formulas testing parameters.
                                </p>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
                                    3. <strong>RDN Exam Blueprints</strong>: Original questions are generated specifically following the CDR 2022-2026 guidelines.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
