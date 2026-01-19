"use client";

import React, { useState } from 'react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void; // Should not be used if selection is mandatory
    onConfirm: (reason: string, notes: string) => void;
    title?: string;
}

const REASON_CHIPS = [
    "Concept Gap",
    "Misread Question",
    "Confused Options",
    "Guessed / Unsure",
    "Did not know"
];

export default function FeedbackModal({ isOpen, onConfirm, title }: FeedbackModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [notes, setNotes] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedReason) return; // Prevent confirm without reason
        onConfirm(selectedReason, notes);
        // Reset local state if needed, though usually component unmounts
        setSelectedReason("");
        setNotes("");
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'var(--surface)', padding: '2rem', borderRadius: '12px',
                width: '90%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>
                    {title || "Why did you miss this?"}
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                    {REASON_CHIPS.map(reason => (
                        <button
                            key={reason}
                            onClick={() => setSelectedReason(reason)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: selectedReason === reason ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: selectedReason === reason ? 'var(--primary-light)' : 'transparent',
                                color: selectedReason === reason ? 'var(--primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            {reason}
                        </button>
                    ))}
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    One-line rule to remember (optional):
                </label>
                <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Needs cooked to 165F, not 155F"
                    style={{
                        width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)',
                        marginBottom: '1.5rem', background: 'var(--background)', color: 'var(--foreground)'
                    }}
                />

                <button
                    className="btn btn-primary"
                    style={{ width: '100%', opacity: selectedReason ? 1 : 0.5, cursor: selectedReason ? 'pointer' : 'not-allowed' }}
                    onClick={handleConfirm}
                    disabled={!selectedReason}
                >
                    Save & Continue
                </button>
            </div>
        </div>
    );
}
