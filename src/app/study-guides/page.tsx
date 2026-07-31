"use client";

import Link from 'next/link';

export default function StudyGuidesPage() {
  const guides = [
    {
      domain: 'I',
      title: 'Principles of Dietetics',
      weight: '21%',
      color: '#2E75B6',
      bg: '#EEF4FB',
      topics: ['DRIs & AMDRs', 'Macronutrients', 'Vitamins', 'Minerals', 'GI Physiology & Hormones', 'Food Science', 'Behavioral Science', 'Research Methods', 'Calculations'],
      href: '/study-guides/domain1',
    },
    {
      domain: 'II',
      title: 'Nutrition Care & MNT',
      weight: '45%',
      color: '#C55A11',
      bg: '#FEF4EE',
      topics: ['Lab Values', 'Critical Care & Burns', 'Renal Disease', 'Diabetes', 'GI Disorders', 'Cardiovascular', 'Enteral & Parenteral Nutrition', 'Eating Disorders & Refeeding', 'Nutritional Anemias', 'Inborn Errors of Metabolism'],
      href: '/study-guides/domain2',
    },
    {
      domain: 'III',
      title: 'Management',
      weight: '21%',
      color: '#375623',
      bg: '#EFF5EA',
      topics: ['Management Functions (POSDC)', 'Leadership Styles & HBL', 'Employment Law', 'Financial Management', 'Quality Improvement', 'Federal Nutrition Programs', 'Cultural Competence'],
      href: '/study-guides/domain3',
    },
    {
      domain: 'IV',
      title: 'Foodservice Systems',
      weight: '13%',
      color: '#7B3F9E',
      bg: '#F5EEFB',
      topics: ['Menu Development & Engineering', 'Procurement & Receiving', 'Inventory Management', 'Production Systems', 'HACCP & Food Safety', 'Sanitation', 'Equipment & Facility'],
      href: '/study-guides/domain4',
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Study Guides</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Deep clinical reference for all 4 RDN exam domains. Read before practicing questions.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        {guides.map(g => (
          <Link key={g.domain} href={g.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '1.5rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ background: g.color, color: '#fff', borderRadius: 8, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  D{g.domain}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>{g.title}</div>
                  <div style={{ fontSize: 13, color: g.color, fontWeight: 600 }}>{g.weight} of exam</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {g.topics.map(t => (
                  <span key={t} style={{ background: g.bg, color: g.color, fontSize: 11, padding: '3px 8px', borderRadius: 20, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
              <div style={{ marginTop: 16, color: g.color, fontSize: 13, fontWeight: 600 }}>Open guide →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
