"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { store, ExamResult } from "@/lib/store";
import { subscribeToData } from "@/lib/backup";
import { PRACTICE_TARGET_PCT } from "@/lib/targets";
import styles from "./ScoreTrendChart.module.css";

const MAX_SESSIONS = 20;

// Plot geometry. The x-axis band is part of the height so the tick labels are never
// clipped into a nested scroll.
const M = { top: 14, right: 72, bottom: 28, left: 40 };
const PLOT_H = 200;
const SVG_H = M.top + PLOT_H + M.bottom;
const GRID = [0, 25, 50, 100]; // 75 is drawn as the target line instead

interface Point {
    index: number;
    id: string;
    date: string;
    mode: ExamResult["mode"];
    pct: number;
    score: number;
    total: number;
}

// useSyncExternalStore needs a referentially stable snapshot while the data is unchanged.
let cacheKey: string | null = null;
let cachePoints: Point[] = [];
const EMPTY: Point[] = [];

function getPoints(): Point[] {
    const raw = localStorage.getItem("rdn_exam_history");
    if (raw === cacheKey) return cachePoints;
    cacheKey = raw;
    cachePoints = store.getExamHistory()
        .filter(h => h.totalQuestions > 0)
        .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        .slice(-MAX_SESSIONS)
        .map((h, index) => ({
            index,
            id: h.id,
            date: h.date,
            mode: h.mode,
            pct: Math.round((h.score / h.totalQuestions) * 100),
            score: h.score,
            total: h.totalQuestions,
        }));
    return cachePoints;
}

const shortDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const modeLabel = (mode: ExamResult["mode"]) => (mode === "mock" ? "Mock exam" : "Practice session");

export default function ScoreTrendChart() {
    const points = useSyncExternalStore(subscribeToData, getPoints, () => EMPTY);
    const plotRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [active, setActive] = useState<number | null>(null);
    const hasData = points.length > 0;

    // The plot div only mounts once there is data, so re-attach when that flips.
    useEffect(() => {
        const el = plotRef.current;
        if (!el) return;
        const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, [hasData]);

    const plotW = Math.max(0, width - M.left - M.right);
    const x = (i: number) =>
        M.left + (points.length <= 1 ? plotW / 2 : (i * plotW) / (points.length - 1));
    const y = (pct: number) => M.top + PLOT_H - (pct / 100) * PLOT_H;

    const mocks = useMemo(() => points.filter(p => p.mode === "mock"), [points]);
    const practice = useMemo(() => points.filter(p => p.mode !== "mock"), [points]);
    const lastMock = mocks[mocks.length - 1];

    if (points.length === 0) {
        return (
            <div className={styles.root}>
                <p className={styles.empty}>
                    Complete a practice session or mock exam to see your score trend here.
                </p>
            </div>
        );
    }

    const mockPath = mocks.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.index)},${y(p.pct)}`).join(" ");
    const targetY = y(PRACTICE_TARGET_PCT);

    // One direct label, on the latest mock. Place it above the marker unless that
    // would collide with the target label or leave the plot, then fall back to below.
    let endLabelY = 0;
    if (lastMock) {
        const above = y(lastMock.pct) - 12;
        endLabelY = above < M.top + 4 || Math.abs(above - targetY) < 14 ? y(lastMock.pct) + 20 : above;
    }

    // The crosshair snaps to the nearest session, so the pointer never has to land on a mark.
    const nearestIndex = (clientX: number) => {
        const rect = plotRef.current!.getBoundingClientRect();
        const px = clientX - rect.left;
        if (points.length <= 1) return 0;
        const i = Math.round(((px - M.left) / plotW) * (points.length - 1));
        return Math.min(points.length - 1, Math.max(0, i));
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") setActive(a => Math.min(points.length - 1, (a ?? -1) + 1));
        else if (e.key === "ArrowLeft") setActive(a => Math.max(0, (a ?? points.length) - 1));
        else if (e.key === "Escape") setActive(null);
        else return;
        e.preventDefault();
    };

    const activePoint = active === null ? null : points[active];
    const tipLeft = activePoint ? Math.min(Math.max(x(activePoint.index) + 12, 0), Math.max(0, width - 170)) : 0;

    return (
        <div className={styles.root}>
            <div className={styles.head}>
                <div>
                    <h3 className={styles.title}>Score trend</h3>
                    <p className={styles.subtitle}>
                        Accuracy per session, last {points.length} session{points.length === 1 ? "" : "s"}
                    </p>
                </div>
                <ul className={styles.legend} aria-label="Legend">
                    <li>
                        <svg width="18" height="10" aria-hidden="true">
                            <line x1="1" y1="5" x2="17" y2="5" stroke="var(--series-mock)" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="9" cy="5" r="3.5" fill="var(--series-mock)" />
                        </svg>
                        Mock exam
                    </li>
                    <li>
                        <svg width="10" height="10" aria-hidden="true">
                            <circle cx="5" cy="5" r="4" fill="var(--series-practice)" />
                        </svg>
                        Practice session
                    </li>
                </ul>
            </div>

            <div
                ref={plotRef}
                className={styles.plot}
                tabIndex={0}
                role="img"
                aria-label={`Score trend chart. ${points.length} sessions. Use left and right arrow keys to read each session. A table view follows.`}
                onPointerMove={e => setActive(nearestIndex(e.clientX))}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(a => a ?? points.length - 1)}
                onBlur={() => setActive(null)}
                onKeyDown={onKeyDown}
            >
                {width > 0 && (
                    <svg className={styles.svg} width={width} height={SVG_H} aria-hidden="true">
                        {GRID.map(g => (
                            <g key={g}>
                                <line x1={M.left} x2={M.left + plotW} y1={y(g)} y2={y(g)} stroke="var(--border)" strokeWidth="1" />
                                <text className={styles.tick} x={M.left - 8} y={y(g)} dy="0.32em" textAnchor="end">{g}%</text>
                            </g>
                        ))}

                        {/* Target line: neutral ink, labeled, so it never reads as a data series. */}
                        <line x1={M.left} x2={M.left + plotW} y1={targetY} y2={targetY} stroke="var(--text-muted)" strokeWidth="1" />
                        <text className={styles.tick} x={M.left - 8} y={targetY} dy="0.32em" textAnchor="end">{PRACTICE_TARGET_PCT}%</text>
                        <text className={styles.targetLabel} x={M.left + plotW + 8} y={targetY} dy="0.32em">Target</text>

                        {activePoint && (
                            <line
                                x1={x(activePoint.index)} x2={x(activePoint.index)}
                                y1={M.top} y2={M.top + PLOT_H}
                                stroke="var(--text-muted)" strokeWidth="1" opacity="0.5"
                            />
                        )}

                        {practice.map(p => (
                            <circle
                                key={p.id}
                                cx={x(p.index)} cy={y(p.pct)}
                                r={active === p.index ? 5.5 : 4}
                                fill="var(--series-practice)"
                                stroke="var(--surface)" strokeWidth="2"
                            />
                        ))}

                        {mocks.length > 1 && (
                            <path d={mockPath} fill="none" stroke="var(--series-mock)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        )}
                        {mocks.map(p => (
                            <circle
                                key={p.id}
                                cx={x(p.index)} cy={y(p.pct)}
                                r={active === p.index ? 6 : 4.5}
                                fill="var(--series-mock)"
                                stroke="var(--surface)" strokeWidth="2"
                            />
                        ))}

                        {lastMock && (
                            <text className={styles.endLabel} x={x(lastMock.index)} y={endLabelY} textAnchor="middle">
                                {lastMock.pct}%
                            </text>
                        )}

                        <text className={styles.tick} x={x(0)} y={M.top + PLOT_H + 20} textAnchor={points.length > 1 ? "start" : "middle"}>
                            {shortDate(points[0].date)}
                        </text>
                        {points.length > 1 && (
                            <text className={styles.tick} x={x(points.length - 1)} y={M.top + PLOT_H + 20} textAnchor="end">
                                {shortDate(points[points.length - 1].date)}
                            </text>
                        )}
                    </svg>
                )}

                {activePoint && (
                    <div className={styles.tooltip} style={{ left: tipLeft, top: M.top }}>
                        <div className={styles.tooltipValue}>{activePoint.pct}%</div>
                        <div className={styles.tooltipRow}>
                            <svg width="14" height="4" aria-hidden="true">
                                <line
                                    x1="1" y1="2" x2="13" y2="2" strokeWidth="2" strokeLinecap="round"
                                    stroke={activePoint.mode === "mock" ? "var(--series-mock)" : "var(--series-practice)"}
                                />
                            </svg>
                            {modeLabel(activePoint.mode)}
                        </div>
                        <div>{activePoint.score} of {activePoint.total} correct · {shortDate(activePoint.date)}</div>
                    </div>
                )}
            </div>

            <details className={styles.table}>
                <summary>View as table</summary>
                <div className={styles.tableScroll}>
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Type</th><th>Score</th><th>Correct</th></tr>
                        </thead>
                        <tbody>
                            {[...points].reverse().map(p => (
                                <tr key={p.id}>
                                    <td>{shortDate(p.date)}</td>
                                    <td>{modeLabel(p.mode)}</td>
                                    <td>{p.pct}%</td>
                                    <td>{p.score} / {p.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </div>
    );
}
