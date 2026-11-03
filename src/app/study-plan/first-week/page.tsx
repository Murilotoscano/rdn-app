'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import material from '@/data/murilo_rdn_semana1_conteudo.json';
import { store } from '@/lib/store';

export default function FirstWeek() {
  const [day, setDay] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Record<string, number[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('day');
    const requested = raw && /^[1-7]$/.test(raw) ? Number(raw) : 1;
    // Initialize from the URL after hydration so direct links work without a server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDay(requested);
  }, []);
  useEffect(() => {
    if (day === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(false);
    const saved = store.getLessonProgress()[`first-week-${day}`];
    setAnswers(saved?.answers ?? {});
    const next: Record<string, number[]> = {};
    for (const q of material.questions.filter(q => (material.days[day - 1] ?? []).includes(q.id))) {
      const order = q.options.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      next[q.id] = order;
    }
    setOrders(next); setLoaded(true);
  }, [day]);
  function answer(id: string, option: number) {
    if (day === null || answers[id] !== undefined) return;
    const next = {...answers, [id]: option}; setAnswers(next);
    try { store.saveLessonProgress(`first-week-${day}`, next, false); setError(false); } catch { setError(true); }
  }
  const lesson = day === null ? undefined : material.lessons[day - 1];
  const ids = day === null ? [] : material.days[day - 1] ?? [];
  const questions = material.questions.filter(q => ids.includes(q.id));

  return <main style={{maxWidth: 900, margin: 'auto', padding: '24px 18px', lineHeight: 1.55}}>
    <Link href="/study-plan">← 45-day plan</Link><h1>Week 1 · original study material</h1>
    <p>This foundational material is not made up of official CDR questions or a calibrated exam. Answers are saved on this device; they do not sync automatically between devices. To transfer them, use Export backup on the first device and Restore from file on the other device in Profile.</p>
    <p><Link href="/profile">Open Profile for backup and restore</Link></p>
    <nav aria-label="Study day" style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>{Array.from({length: 7}, (_, i) => <a key={i} href={`/study-plan/first-week?day=${i+1}`} aria-current={day === i+1 ? 'page' : undefined} style={{display:'inline-block',padding:'10px 14px',border:'1px solid currentColor',borderRadius:8}}>Day {i+1}</a>)}</nav>
    {error && <p role="alert">Your answers could not be saved in this browser.</p>}
    {day === null ? <p>Loading day…</p> : day === 7 ? <section><h2>Day 7 · light review</h2><p>Spend 45 minutes reviewing six mistakes or guesses, creating two variations of a calculation, and summarizing one rule per domain. Use your notes to set priorities without concluding that you are ready based on a small sample.</p><p><Link href="/study-guides">Open domain study guides</Link> · <Link href="/review">Review missed questions</Link></p></section> : <>
      {lesson && <section><h2>Day {day}: {lesson.title}</h2>{lesson.text.split('\n').map((line,i)=><p key={i} style={{margin: '0.8em 0'}}>{line}</p>)}<details><summary>Lesson sources</summary><ul>{lesson.sources.map(url=><li key={url} style={{overflowWrap:'anywhere'}}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details></section>}
      {!loaded ? <p>Loading progress…</p> : <section aria-label={`Day ${day} practice questions`}><h2>Practice questions</h2><p>Select an answer to see the correct answer and explanation.</p>{questions.map((q, i) => <article key={q.id} style={{margin: '22px 0', padding: 18, border: '1px solid #cbd5e1', borderRadius: 10}}>
        <h3>{i+1}. {q.stem}</h3><div style={{display:'grid', gap:8}}>{(orders[q.id] ?? []).map(idx=><button key={idx} onClick={()=>answer(q.id,idx)} disabled={answers[q.id] !== undefined} style={{padding:12,textAlign:'left',whiteSpace:'normal'}}>{q.options[idx]}</button>)}</div>
        {answers[q.id] !== undefined && <div><p><strong>{answers[q.id] === q.answer ? 'Correct' : 'Review your answer'}</strong> · {q.options[q.answer]}</p><p>{q.rationale}</p>{q.sources.length > 0 && <details><summary>Sources</summary><ul>{q.sources.map(url=><li key={url} style={{overflowWrap:'anywhere'}}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details>}</div>}
      </article>)}</section>}
    </>}
  </main>;
}
