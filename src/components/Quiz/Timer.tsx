'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import styles from './Timer.module.css';

interface TimerProps {
    durationInSeconds: number; // e.g., 3 hours = 10800 seconds
    /** When the session began (ms). Defaults to the first render of this timer. */
    startedAt?: number;
    onTimeUp?: () => void;
}

/**
 * Counts down against the wall clock rather than by subtracting a second per tick.
 * setInterval is throttled in background tabs and drifts under re-renders, so the old
 * "prev - 1" approach handed back minutes of extra exam time. Here the deadline is fixed
 * when the session starts and every tick just re-reads the clock, so leaving the tab,
 * re-rendering, or a slow device cannot lengthen the exam. onTimeUp fires exactly once.
 */
export default function Timer({ durationInSeconds, startedAt, onTimeUp }: TimerProps) {
    const [deadline] = useState(() => (startedAt ?? Date.now()) + durationInSeconds * 1000);
    const [timeLeft, setTimeLeft] = useState(() =>
        Math.max(0, Math.round((deadline - Date.now()) / 1000))
    );
    const firedRef = useRef(false);

    useEffect(() => {
        const tick = () => {
            const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0 && !firedRef.current) {
                firedRef.current = true;
                onTimeUp?.();
            }
        };
        tick();
        const intervalId = setInterval(tick, 1000);
        // A tab that was hidden may have skipped ticks; re-read the clock on return.
        const onVisible = () => { if (!document.hidden) tick(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [deadline, onTimeUp]);

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
