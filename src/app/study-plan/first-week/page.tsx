'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import material from '@/data/murilo_rdn_semana1_conteudo.json';
import { store } from '@/lib/store';
export default function FirstWeek() {
  const [day, setDay] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<Record<string, number[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const lesson = material.lessons[day - 1];
  const ids = material.days[day - 1] ?? [];
  const questions = material.questions.filter(q => ids.includes(q.id));
  useEffect(() => {
    // Hydrate browser-only progress and shuffle after mount or day change.
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
    if (answers[id] !== undefined) return;
    const next = {...answers, [id]: option}; setAnswers(next);
    try { store.saveLessonProgress(`first-week-${day}`, next, false); setError(false); } catch { setError(true); }
  }
  return <main style={{maxWidth: 900, margin: 'auto', padding: '24px 18px', lineHeight: 1.55}}>
    <Link href="/study-plan">← Plano de 45 dias</Link><h1>Primeira semana · conteúdo autoral</h1>
    <p>Material de fundamento, não questões oficiais CDR nem simulado calibrado. As respostas ficam neste aparelho e são incluídas no backup exportado; não sincronizam entre aparelhos.</p>
    <nav aria-label="Dia de estudo" style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>{Array.from({length: 7}, (_, i) => <button key={i} onClick={() => setDay(i+1)} aria-current={day === i+1 ? 'page' : undefined} style={{padding: '10px 14px'}}>Dia {i+1}</button>)}</nav>
    {error && <p role="alert">Não foi possível salvar as respostas neste navegador.</p>}
    {day === 7 ? <section><h2>Dia 7 · revisão leve</h2><p>Em 45 minutos, revise seis erros ou chutes, crie duas variantes de cálculo e sintetize uma regra por domínio. Use o plano para registrar prioridades sem concluir prontidão.</p></section> : <>
      {lesson && <section><h2>Dia {day}: {lesson.title}</h2>{lesson.text.split('\n').map((line,i)=><p key={i} style={{margin: "0.8em 0"}}>{line}</p>)}<details><summary>Fontes da teoria</summary><ul>{lesson.sources.map(url=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details></section>}
      {!loaded ? <p>Carregando progresso...</p> : questions.map((q, i) => <article key={q.id} style={{margin: '22px 0', padding: 18, border: '1px solid #cbd5e1', borderRadius: 10}}>
        <h3>{i+1}. {q.stem}</h3><div style={{display:'grid', gap:8}}>{(orders[q.id] ?? []).map(idx=><button key={idx} onClick={()=>answer(q.id,idx)} disabled={answers[q.id] !== undefined} style={{padding:12,textAlign:'left',whiteSpace:'normal'}}>{q.options[idx]}</button>)}</div>
        {answers[q.id] !== undefined && <div><p><strong>{answers[q.id] === q.answer ? 'Correta' : 'Revise a resposta'}</strong> · {q.options[q.answer]}</p><p>{q.rationale}</p>{q.sources.length > 0 && <details><summary>Fontes</summary><ul>{q.sources.map(url=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></details>}</div>}
      </article>)}
    </>}
  </main>;
}
