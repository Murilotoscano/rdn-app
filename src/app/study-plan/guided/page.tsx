'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import material from '@/data/rdn_guided_days.json';
import {store} from '@/lib/store';

export default function GuidedStudy() {
  const [day, setDay] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Record<string, number[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('day');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDay(raw && /^(8|9|1[0-4])$/.test(raw) ? Number(raw) : 8);
  }, []);
  useEffect(() => {
    if (day === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(false);
    setAnswers(store.getLessonProgress()[`guided-day-${day}`]?.answers ?? {});
    const next: Record<string, number[]> = {};
    for (const q of material.days.find(d => d.day === day)?.questions ?? []) {
      const order = q.options.map((_, i) => i);
      for (let i=order.length-1; i>0; i--) {const j=Math.floor(Math.random()*(i+1)); [order[i],order[j]]=[order[j],order[i]];}
      next[q.id]=order;
    }
    setOrders(next); setLoaded(true);
  }, [day]);
  function answer(id: string, index: number) {
    if (day === null || answers[id] !== undefined) return;
    const next={...answers,[id]:index}; setAnswers(next);
    try {store.saveLessonProgress(`guided-day-${day}`,next,false);setError(false)} catch {setError(true)}
  }
  const lesson=material.days.find(d => d.day===day);
  return <main style={{maxWidth:900,margin:'auto',padding:'24px 18px',lineHeight:1.6,overflowWrap:'anywhere'}}>
    <Link href="/study-plan">← 45-day plan</Link><h1>Guided study</h1>
    <p>Original practice questions, not official CDR questions or a calibrated exam. Lesson answers stay on this device; to move them, export a backup and restore it on the other device in <Link href="/profile">Profile</Link>.</p>
    <nav aria-label="Study day" style={{display:'flex',flexWrap:'wrap',gap:8}}>{material.days.map(d=><a key={d.day} href={`/study-plan/guided?day=${d.day}`} aria-current={day===d.day?'page':undefined} style={{padding:'10px 14px',border:'1px solid currentColor',borderRadius:8}}>Day {d.day}</a>)}</nav>
    {!lesson ? <p>Loading study day…</p> : <>
      <h2>Day {lesson.day}: {lesson.title}</h2><p>Suggested study time: {lesson.minutes} minutes, including practice and review.</p>
      <section><h3>Learning objectives</h3><ul>{lesson.objectives.map((x,i)=><li key={i}>{x}</li>)}</ul></section>
      <section><h3>Study and application</h3>{lesson.theory.map((x,i)=><div key={i}><h4>{x.heading}</h4><p style={{whiteSpace:'pre-line'}}>{x.text}</p></div>)}</section>
      <section><h3>Worked case</h3><p style={{whiteSpace:'pre-line'}}>{lesson.worked_case.scenario}</p><p style={{whiteSpace:'pre-line'}}>{lesson.worked_case.reasoning}</p></section>
      {error && <p role="alert">Your answers could not be saved in this browser.</p>}
      {!loaded ? <p>Loading progress…</p> : <section aria-label={`Day ${lesson.day} practice questions`}><h3>Practice questions</h3><p>Choose an answer to see feedback for each option.</p>{lesson.questions.map((q,i)=><article key={q.id} style={{margin:'22px 0',padding:18,border:'1px solid #cbd5e1',borderRadius:10}}>
        <h4>{i+1}. {q.stem}</h4><div style={{display:'grid',gap:8}}>{(orders[q.id]??[]).map(index=><button key={index} disabled={answers[q.id]!==undefined} onClick={()=>answer(q.id,index)} style={{padding:12,textAlign:'left',whiteSpace:'normal'}}>{q.options[index]}</button>)}</div>
        {answers[q.id]!==undefined && <div><p><strong>{answers[q.id]===q.answer?'Correct':'Review your answer'}</strong> · {q.options[q.answer]}</p><ul>{q.options.map((option,index)=><li key={index}><strong>{option}:</strong> {q.option_rationales[index]}</li>)}</ul><details><summary>Question sources</summary><ul>{q.sources.map(url=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details></div>}
      </article>)}</section>}
      <section><h3>Spaced review</h3><ul>{lesson.review.map((x,i)=><li key={i}>{x}</li>)}</ul></section>
      <details><summary>Lesson sources</summary><ul>{lesson.sources.map(url=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details>
      <p><Link href="/study-plan">Return to the 45-day plan</Link> · <Link href="/study-guides">Domain study guides</Link></p>
    </>}
  </main>;
}
