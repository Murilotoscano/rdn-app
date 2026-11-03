import Link from 'next/link';
import plan from '@/data/murilo_rdn_plano_45_dias_estrutura.json';

export default function StudyPlanPage() {
  return <main style={{maxWidth: 980, margin: 'auto', padding: '24px 18px', lineHeight: 1.55}}>
    <Link href="/">← Home</Link><h1>RDN 45-day study plan</h1>
    <p>Start Day 1 when you are ready; no exam date is assumed. Regular days are planned for 90 minutes. Days 7, 14, 21, 28, 35 and 42 are 45-minute light reviews.</p>
    <p>Use active recall, study, practice questions, answer review, and notes. Adjust the time as needed and avoid drawing conclusions about weaknesses from a small sample.</p>
    <p>For 2026, the content distribution is Domain I 21%, II 45%, III 21%, and IV 13%. Check the updated official outline for exams from 2027 onward. A fixed practice exam does not reproduce an adaptive exam, and a practice percentage is not an official score.</p>
    <p><strong>Ready now:</strong> Days 1–6 have lessons and original practice questions; Day 7 is a guided review. Days 8–35 also have guided study and practice. Select a day below to start.</p>
    <p><strong>Days 36–45:</strong> the topics and activities below are a study roadmap; their day-specific lessons and question sets are not yet available. In the meantime, use the <Link href="/study-guides">domain study guides</Link>, <Link href="/modules">domain practice</Link>, and <Link href="/review">review of missed questions</Link>.</p>
    <p>Flagged items have been excluded from new sessions pending review. The remaining questions are not official CDR questions or a certified diagnostic instrument.</p>
    {plan.weeks.map(week => <section key={week.title} style={{marginTop: 24}}><h2>{week.title}</h2>
      {week.days.map(day => <article key={day.day} style={{border: '1px solid #cbd5e1', borderRadius: 10, padding: 16, margin: '12px 0'}}>
        <h3>Day {day.day}: {day.focus}</h3><p>{day.method}</p><p><strong>Review: </strong>{day.review_checkpoint}</p>
        {day.day <= 35 ? <Link href={day.day <= 7 ? `/study-plan/first-week?day=${day.day}` : `/study-plan/guided?day=${day.day}`} style={{display:'inline-block',padding:'10px 14px',border:'1px solid currentColor',borderRadius:8}}>{[7, 14, 21, 28, 35, 42].includes(day.day) ? `Open Day ${day.day} review` : `Open Day ${day.day} lesson and questions`} →</Link> : <p><strong>Roadmap only:</strong> day-specific lesson and questions are not yet available.</p>}
      </article>)}
    </section>)}
    <p><Link href="/study-plan/1">Earlier lessons</Link> remain available for reference and contain legacy material still under review.</p>
  </main>;
}
