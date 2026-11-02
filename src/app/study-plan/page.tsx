import Link from 'next/link';
import plan from '@/data/murilo_rdn_plano_45_dias_estrutura.json';
export default function StudyPlanPage() {
  return <main style={{maxWidth: 980, margin: 'auto', padding: '24px 18px', lineHeight: 1.55}}>
    <Link href="/">← Home</Link><h1>Plano de estudo RDN · 45 dias</h1>
    <p>Dia 1 começa quando você decidir. Nenhuma data de prova é presumida. Dias regulares: 90 minutos; dias 7, 14, 21, 28, 35 e 42: 45 minutos de revisão leve.</p>
    <p>Organize os dias regulares em recuperação ativa, teoria, questões, correção e registro. Ajuste o tempo conforme a necessidade, sem concluir fraquezas a partir de uma amostra pequena.</p>
    <p>O conteúdo de 2026 usa a distribuição I 21%, II 45%, III 21%, IV 13%. Para prova a partir de 2027, confira o novo conteúdo oficial. Um simulado fixo não reproduz a prova adaptativa, e a porcentagem de acertos não é a nota oficial.</p>
    <p><Link href="/study-plan/first-week">Abrir teoria e questões autorais da primeira semana →</Link></p>
    <p><Link href="/study-guides">Guias por domínio</Link> · <Link href="/modules">Prática por domínio</Link> · <Link href="/review">Revisão de erros</Link></p>
    <p>Itens sinalizados pela auditoria foram retirados de novas sessões enquanto aguardam revisão. Os demais não são questões oficiais nem foram certificados como instrumento diagnóstico.</p>
    {plan.weeks.map(week => <section key={week.title} style={{marginTop: 24}}><h2>{week.title}</h2>
      {week.days.map(day => <article key={day.day} style={{border: '1px solid #cbd5e1', borderRadius: 10, padding: 16, margin: '12px 0'}}><h3>Dia {day.day}: {day.focus}</h3><p>{day.method}</p><p><strong>Revisão: </strong>{day.review_checkpoint}</p></article>)}
    </section>)}
    <p>As <Link href="/study-plan/1">lições anteriores</Link> continuam disponíveis para consulta; contêm material legado ainda em revisão.</p>
  </main>;
}
