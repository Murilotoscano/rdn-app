"use client";

import React, { useState, useEffect } from "react";
import styles from "./CdrQuestionCard.module.css";
import { CdrQuestion, CdrQuestionType } from "@/types";
import { CdrProgress } from "@/lib/store";
import clsx from "clsx";
import { CheckCircle, XCircle, Bookmark, BookmarkCheck, FileText, Cpu, AlertCircle, Save, Info } from "lucide-react";

interface Props {
    question: CdrQuestion;
    progress?: CdrProgress;
    onAnswer: (index: number, isCorrect: boolean) => void;
    onNext: () => void;
    onPrev?: () => void;
    currIndex: number;
    total: number;
    onToggleReview: (isMarked: boolean) => void;
    onSaveNotes: (notes: string) => void;
    onSelectErrorType: (errorType: string) => void;
    onGenerateSimilar?: () => void;
    isGeneratingSimilar?: boolean;
}

export default function CdrQuestionCard({
    question,
    progress,
    onAnswer,
    onNext,
    onPrev,
    currIndex,
    total,
    onToggleReview,
    onSaveNotes,
    onSelectErrorType,
    onGenerateSimilar,
    isGeneratingSimilar = false
}: Props) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [notesText, setNotesText] = useState("");
    const [errorTypeSelected, setErrorTypeSelected] = useState("");
    const [isNotesSaved, setIsNotesSaved] = useState(false);

    // Sync state when question changes
    useEffect(() => {
        setSelected(null);
        setIsSubmitted(false);
        setIsCorrect(false);
        setNotesText(progress?.notes || "");
        setErrorTypeSelected(progress?.errorType || "");
        setIsNotesSaved(false);

        // If already attempted, show outcome
        if (progress && (progress.status === 'correct' || progress.status === 'incorrect' || progress.status === 'mastered')) {
            setIsSubmitted(true);
            // Search for correct selection index if we don't have it explicitly stored
            // (we can infer it since we know the correctIndex)
            // Just display the feedback without forcing a selection if it was a historical attempt
            setIsCorrect(progress.status === 'correct' || progress.status === 'mastered');
        }
    }, [question.id, progress]);

    const handleSelect = (idx: number) => {
        if (isSubmitted) return;
        setSelected(idx);
    };

    const handleSubmit = () => {
        if (selected === null) return;
        setIsSubmitted(true);
        const correct = selected === question.correctIndex;
        setIsCorrect(correct);
        onAnswer(selected, correct);
    };

    const handleSaveNotes = () => {
        onSaveNotes(notesText);
        setIsNotesSaved(true);
        setTimeout(() => setIsNotesSaved(false), 2000);
    };

    const handleErrorTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setErrorTypeSelected(val);
        onSelectErrorType(val);
    };

    const getQuestionTypeLabel = (type: CdrQuestionType) => {
        switch (type) {
            case 'knowledge': return 'Knowledge-Based';
            case 'application': return 'Application-Based';
            case 'calculation': return 'Calculation-Based';
            case 'case-based': return 'Case-Based';
            case 'best-next-step': return 'Best Next Step';
            default: return type;
        }
    };

    return (
        <div className={styles.card}>
            {/* Header */}
            <div className={styles.header}>
                <span className={styles.counter}>Question {currIndex + 1} of {total}</span>
                <div className={styles.headerActions}>
                    <button 
                        onClick={() => onToggleReview(!progress?.markedForReview)}
                        className={clsx(styles.reviewBtn, progress?.markedForReview && styles.reviewed)}
                        title={progress?.markedForReview ? "Remove Bookmark" : "Bookmark for Review"}
                    >
                        {progress?.markedForReview ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        <span className={styles.hideMobile}>
                            {progress?.markedForReview ? "Bookmarked" : "Bookmark"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Metadata Tags */}
            <div className={styles.tagsContainer}>
                <span className={styles.domainTag}>{question.domain}</span>
                <span className={styles.typeTag}>{getQuestionTypeLabel(question.questionType)}</span>
                <span className={clsx(styles.difficultyTag, styles[question.difficulty])}>{question.difficulty}</span>
            </div>

            {/* Question Text */}
            <div className={styles.questionTextContainer}>
                <h3 className={styles.questionText}>{question.text}</h3>
            </div>

            {/* Options */}
            <div className={styles.options}>
                {question.options.map((opt, idx) => {
                    let stateClass = "";
                    if (isSubmitted) {
                        if (idx === question.correctIndex) {
                            stateClass = styles.correct;
                        } else if (idx === selected) {
                            stateClass = styles.incorrect;
                        }
                    } else if (idx === selected) {
                        stateClass = styles.selected;
                    }

                    return (
                        <button
                            key={idx}
                            className={clsx(styles.optionBtn, stateClass)}
                            onClick={() => handleSelect(idx)}
                            disabled={isSubmitted}
                        >
                            <span className={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                            <span className={styles.optionText}>{opt}</span>
                        </button>
                    );
                })}
            </div>

            {/* Bottom Actions for Quiz Flow */}
            <div className={styles.flowActions}>
                {onPrev && (
                    <button className={styles.secondaryBtn} onClick={onPrev}>
                        Previous
                    </button>
                )}
                
                {!isSubmitted ? (
                    <button 
                        className={styles.primaryBtn} 
                        onClick={handleSubmit}
                        disabled={selected === null}
                        style={{ marginLeft: 'auto' }}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button 
                        className={styles.primaryBtn} 
                        onClick={onNext}
                        style={{ marginLeft: 'auto' }}
                    >
                        Next Question
                    </button>
                )}
            </div>

            {/* Feedback & Rationales Section */}
            {isSubmitted && (
                <div className={styles.feedbackContainer}>
                    <div className={clsx(styles.feedbackHeader, isCorrect ? styles.correctHeader : styles.incorrectHeader)}>
                        {isCorrect ? <CheckCircle size={22} /> : <XCircle size={22} />}
                        <div>
                            <h4>{isCorrect ? "Correct!" : "Incorrect"}</h4>
                            <p>Correct Answer: <strong>{question.correctLetter}. {question.correctText}</strong></p>
                        </div>
                    </div>

                    <div className={styles.feedbackDetails}>
                        {/* Key Concept */}
                        <div className={styles.detailBlock}>
                            <h5 className={styles.detailTitle}><Info size={16} /> Key Concept Tested</h5>
                            <p><strong>{question.topic} &rarr; {question.subtopic}</strong>: {question.concept}</p>
                        </div>

                        {/* Calculations Formula */}
                        {question.formula && (
                            <div className={styles.detailBlock}>
                                <h5 className={styles.detailTitle}><Cpu size={16} /> Formula / Calculation</h5>
                                <pre className={styles.formulaCode}>{question.formula}</pre>
                            </div>
                        )}

                        {/* Rationale Breakdown */}
                        <div className={styles.detailBlock}>
                            <h5 className={styles.detailTitle}><FileText size={16} /> Rationale Breakdown</h5>
                            <p className={styles.explanationText}>{question.explanation}</p>
                            {question.rationale && (
                                <div className={styles.rationaleBox}>
                                    <h6>Options Explanation:</h6>
                                    <div className={styles.optionsBreakdown}>
                                        {question.rationale.split('\n').map((line, i) => (
                                            <p key={i} className={styles.breakdownLine}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* References */}
                        {question.references && question.references.length > 0 && (
                            <div className={styles.detailBlock}>
                                <h5 className={styles.detailTitle}>References & Source</h5>
                                <ul className={styles.refList}>
                                    {question.references.map((ref, idx) => (
                                        <li key={idx}>{ref}</li>
                                    ))}
                                </ul>
                                <p className={styles.sourceText}>Source PDF: <em>{question.sourcePdf}</em> ({question.location})</p>
                            </div>
                        )}
                    </div>

                    {/* Interactive Review Actions (Notes & Error Classification) */}
                    <div className={styles.reviewActionsBox}>
                        <h4>Study Notes & Review</h4>
                        
                        {/* Error Type Classification (Only if incorrect) */}
                        {!isCorrect && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <AlertCircle size={16} /> Why did you miss this question?
                                </label>
                                <select 
                                    className={styles.select}
                                    value={errorTypeSelected} 
                                    onChange={handleErrorTypeChange}
                                >
                                    <option value="">-- Select Error Reason --</option>
                                    <option value="content_gap">Content Gap (Didn't know the material)</option>
                                    <option value="calculation_mistake">Calculation Mistake (Math error)</option>
                                    <option value="misread_stem">Misread Question Stem (Careless reading)</option>
                                    <option value="confused_options">Confused Options (Double guessed)</option>
                                    <option value="other">Other / Guessed wrong</option>
                                </select>
                            </div>
                        )}

                        {/* User Notes */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Personal Study Notes</label>
                            <div className={styles.notesContainer}>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Write your study notes, key takeaways, or mnemonics here..."
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    rows={3}
                                />
                                <button className={styles.saveNotesBtn} onClick={handleSaveNotes}>
                                    <Save size={16} />
                                    {isNotesSaved ? "Saved!" : "Save Notes"}
                                </button>
                            </div>
                        </div>

                        {/* Generate similar questions button */}
                        {onGenerateSimilar && (
                            <div className={styles.similarActionContainer}>
                                <button 
                                    className={styles.aiGenerateBtn} 
                                    onClick={onGenerateSimilar}
                                    disabled={isGeneratingSimilar}
                                >
                                    <Cpu size={16} />
                                    {isGeneratingSimilar ? "Generating Questions..." : "Generate 10 similar original questions from this concept"}
                                </button>
                                <p className={styles.aiGenerateSub}>
                                    Uses AI to generate 10 unique questions testing the same concept without copying wording.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
