'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from './Timer.module.css';

interface TimerProps {
    durationInSeconds: number; // e.g., 2.5 hours = 9000 seconds
    onTimeUp?: () => void;
}

export default function Timer({ durationInSeconds, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp?.();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const percentRemaining = (timeLeft / durationInSeconds) * 100;

    // Determine color based on urgency
    let timerClass = styles.timerNormal;
    if (percentRemaining < 10) timerClass = styles.timerCritical;
    else if (percentRemaining < 25) timerClass = styles.timerWarning;

    return (
        <div className={`${styles.container} ${timerClass}`}>
            <Clock size={20} />
            <span className={styles.time}>{formatTime(timeLeft)}</span>
        </div>
    );
}
