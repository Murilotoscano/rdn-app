export interface StudyQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DayContent {
  id: number;
  title: string;
  theoryTitle: string;
  theoryContent: React.ReactNode | string;
  questions: StudyQuestion[];
}

export const studyPlanData: Record<number, DayContent> = {
  1: {
    id: 1,
    title: "Food Science Foundations",
    theoryTitle: "Fundamentos de Ciência de Alimentos",
    theoryContent: `
      <h2>1. Água e Suas Propriedades</h2>
      <p>A atividade de água (aw) é crucial para a preservação de alimentos. Alimentos com aw > 0.85 precisam de refrigeração.</p>
      <ul>
        <li><strong>Água livre:</strong> disponível para reações químicas e crescimento microbiano.</li>
        <li><strong>Água ligada:</strong> não disponível; ligada a proteínas e carboidratos.</li>
      </ul>
      <h2>2. Carboidratos nas Preparações</h2>
      <p><strong>Gelatinização:</strong> Ocorre quando o amido é aquecido em água, inchando e formando uma pasta (ex: molho branco).</p>
      <p><strong>Retrogradação:</strong> O recristalização do amido ao esfriar, causando espessamento ou endurecimento (ex: pão adormecido).</p>
      <h2>3. Proteínas e Desnaturação</h2>
      <p>A desnaturação pode ocorrer pelo calor, ácidos (ex: limão no ceviche), ou agitação mecânica (claras em neve).</p>
      <p><strong>Reação de Maillard:</strong> Escurecimento não-enzimático entre um açúcar redutor e um aminoácido sob calor (ex: crosta do pão).</p>
    `,
    questions: [
      {
        id: "d1-q1",
        text: "Qual componente é necessário para que a Reação de Maillard ocorra no cozimento de alimentos?",
        options: [
          "Oxigênio e enzimas",
          "Açúcar redutor e aminoácido",
          "Açúcar não redutor e lipídio",
          "Amido e calor úmido"
        ],
        correctAnswer: 1,
        explanation: "A Reação de Maillard é uma reação de escurecimento não-enzimático que ocorre rapidamente quando um açúcar redutor reage com um aminoácido (proteína) sob altas temperaturas."
      },
      {
        id: "d1-q2",
        text: "O processo pelo qual os grânulos de amido absorvem água e incham quando aquecidos é chamado de:",
        options: [
          "Retrogradação",
          "Dextrinização",
          "Gelatinização",
          "Sinérese"
        ],
        correctAnswer: 2,
        explanation: "Gelatinização é o inchaço dos grânulos de amido em presença de água e calor."
      }
    ]
  },
  2: {
    id: 2,
    title: "Digestion & Absorption",
    theoryTitle: "Digestão e Absorção de Macronutrientes",
    theoryContent: `
      <h2>1. Digestão de Carboidratos</h2>
      <p>Começa na boca com a <strong>amilase salivar</strong>. No intestino delgado, a amilase pancreática continua, e as enzimas da borda em escova (lactase, sucrase, maltase) finalizam em monossacarídeos.</p>
      <h2>2. Digestão de Proteínas</h2>
      <p>Começa no estômago com a <strong>pepsina</strong> ativada pelo HCl. No intestino, tripsina e quimotripsina do pâncreas quebram polipeptídeos.</p>
      <h2>3. Digestão de Lipídios</h2>
      <p>Depende primariamente da <strong>bile</strong> (produzida no fígado, armazenada na vesícula) para emulsificação, permitindo que a lípase pancreática atue, formando micelas para absorção.</p>
    `,
    questions: [
      {
        id: "d2-q1",
        text: "Onde ocorre a maior parte da digestão e absorção de nutrientes?",
        options: [
          "Estômago",
          "Íleo",
          "Duodeno e Jejuno",
          "Intestino Grosso"
        ],
        correctAnswer: 2,
        explanation: "A maior parte da digestão e absorção acontece na porção superior do intestino delgado (duodeno e jejuno)."
      },
      {
        id: "d2-q2",
        text: "Qual substância é essencial para a emulsificação e digestão adequada de lipídios?",
        options: [
          "Pepsina",
          "Amilase pancreática",
          "Bile",
          "Ácido clorídrico"
        ],
        correctAnswer: 2,
        explanation: "A bile age como um emulsificador, reduzindo as gotas de gordura, aumentando a área de superfície para a lípase atuar."
      }
    ]
  },
  3: {
    id: 3,
    title: "Clinical I - MNT Basics",
    theoryTitle: "Terapia Nutricional: Diabetes & DCV",
    theoryContent: `
      <h2>1. Diabetes Mellitus (DM)</h2>
      <p>O foco é o controle glicêmico (A1C < 7.0%). A contagem de carboidratos é padrão: 1 porção de CHO = 15g.</p>
      <p>Hipoglicemia (< 70 mg/dL): Tratar com a Regra dos 15 (15g de CHO rápido, esperar 15 min).</p>
      <h2>2. Doença Cardiovascular (DCV)</h2>
      <p>A dieta TLC / DASH foca em reduzir gorduras saturadas (< 7% das calorias totais) e colesterol (< 200mg/dia).</p>
      <p>Aumento da ingestão de fibras solúveis (aveia, feijões) reduz o colesterol LDL.</p>
    `,
    questions: [
      {
        id: "d3-q1",
        text: "Um paciente consumiu 2 fatias de pão de forma (30g de CHO total). Quantas porções de carboidrato ele consumiu?",
        options: [
          "1 porção",
          "1.5 porções",
          "2 porções",
          "3 porções"
        ],
        correctAnswer: 2,
        explanation: "Como 1 porção de CHO equivale a 15g, 30g equivalem a 2 porções."
      }
    ]
  },
  4: {
    id: 4,
    title: "Clinical II - Advanced MNT",
    theoryTitle: "Doença Renal crônica e Terapia Crítica",
    theoryContent: `
      <h2>1. Doença Renal Crônica (Pré-Diálise vs Diálise)</h2>
      <p><strong>Pré-diálise (Estágios 3-4):</strong> Restrição proteica (0.55-0.6 g/kg) para lentificar a progressão da doença.</p>
      <p><strong>Diálise (Estágio 5 HD/PD):</strong> Aumento proteico (1.1-1.2 g/kg) devido à perda de aminoácidos no dialisato.</p>
      <p>Controle de Potássio e Fósforo torna-se crítico em estágios avançados.</p>
    `,
    questions: [
      {
        id: "d4-q1",
        text: "Paciente iniciando Hemodiálise amanhã. O que deve ocorrer com sua recomendação de proteínas em comparação ao tratamento conservador (pré-diálise)?",
        options: [
          "Diminuir",
          "Manter a mesma",
          "Aumentar",
          "Isentar de proteínas"
        ],
        correctAnswer: 2,
        explanation: "Em diálise, o paciente perde proteínas pelo dialisato, então a necessidade aumenta de ~0.6g/kg (pré-diálise) para ~1.2g/kg."
      }
    ]
  },
  5: {
    id: 5,
    title: "Enteral & Parenteral",
    theoryTitle: "Cálculos e Fórmulas de Suporte Nutricional",
    theoryContent: `
      <h2>1. Nutrição Enteral (NE)</h2>
      <p>Sempre preferir: <em>"If the gut works, use it!"</em></p>
      <p>Para calcular volume total: Volume = (Calorias necessárias) / (kca/mL da fórmula).</p>
      <p>Exemplo: 2000 kcal necessidades diárias. Fórmula de 1.5 kcal/mL. Volume = 2000 / 1.5 = 1333 mL/dia.</p>
      <h2>2. Nutrição Parenteral (NPT)</h2>
      <p>Usada quando trato GI não funciona. Dextrose fornece 3.4 kcal/g. Proteína 4 kcal/g. Emulsões lipídicas: 10% = 1.1 kcal/mL, 20% = 2.0 kcal/mL.</p>
    `,
    questions: [
      {
        id: "d5-q1",
        text: "Uma solução de NPT contém 500 mL de Dextrose 50%. Quantas calorias vêm do carboidrato?",
        options: [
          "850 kcal",
          "1000 kcal",
          "1700 kcal",
          "2000 kcal"
        ],
        correctAnswer: 0,
        explanation: "500 mL x 50% (0.5) = 250 g de Dextrose. 250 g x 3.4 kcal/g = 850 kcal."
      }
    ]
  },
  6: {
    id: 6,
    title: "Management I - Food Service",
    theoryTitle: "Sistemas de Produção e Logística",
    theoryContent: `
      <h2>Sistemas de Produção de Alimentos</h2>
      <ul>
        <li><strong>Convencional:</strong> Preparo e serviço no mesmo local, preparo próximo ao horário de serviço. Alto custo de mão de obra, maior qualidade de textura.</li>
        <li><strong>Commissary (Descentralizado):</strong> Produção central centralizada com distribuição para cozinhas satélites. Ganho de escala na compra, padronização, mas risco no transporte (temperatura).</li>
        <li><strong>Ready-Prepared (Cook-Chill/Cook-Freeze):</strong> Alimento preparado no local, resfriado/congelado e reaquecido depois. Desacopla produção do serviço.</li>
        <li><strong>Assembly-Serve:</strong> Menor esforço de preparo, ingredientes processados/congelados são montados e servidos.</li>
      </ul>
    `,
    questions: [
      {
        id: "d6-q1",
        text: "Qual sistema de food service tem as maiores preocupações em relação à manutenção de temperaturas seguras durante o transporte?",
        options: [
          "Convencional",
          "Assembly-Serve",
          "Commissary",
          "Ready-prepared"
        ],
        correctAnswer: 2,
        explanation: "Commissary produz em cozinha central e transporta para locais remotos; o transporte traz risco iminente de flutuação de temperatura."
      }
    ]
  },
  7: {
    id: 7,
    title: "Management I - HR & Leadership",
    theoryTitle: "Liderança e Recursos Humanos",
    theoryContent: `
      <h2>1. Estilos de Liderança</h2>
      <p><strong>Autocrática:</strong> O líder toma todas as decisões (útil em crises).</p>
      <p><strong>Democrática:</strong> Guia o grupo, encoraja participação nas decisões. Mais tempo gasto, mas melhor aceitação.</p>
      <p><strong>Laissez-faire (Mãos livres):</strong> O grupo toma as decisões; o líder apenas fornece recursos.</p>
      <p><strong>Transformacional:</strong> Inspira os seguidores a focar em metas de longo prazo e no sucesso da organização no lugar de ganhos pessoais.</p>
    `,
    questions: [
      {
        id: "d7-q1",
        text: "Durante uma emergência onde o fogo atingiu a cozinha, que estilo de liderança o gerente deve utilizar?",
        options: [
          "Participativo",
          "Democrático",
          "Autocrático",
          "Laissez-Faire"
        ],
        correctAnswer: 2,
        explanation: "Em tempos de crise e emergência, a liderança autocrática (comunicando ordens rápidas e diretas) garante que as ações sejam feitas imediatamente para salvar vidas/bens."
      }
    ]
  },
  8: {
    id: 8,
    title: "Counseling & Education",
    theoryTitle: "Aconselhamento e Teorias de Mudança",
    theoryContent: `
      <h2>1. Modelo Transteórico (Estágios de Mudança)</h2>
      <ul>
        <li><strong>Pré-contemplação:</strong> Sem intenção de mudar ("Não preciso perder peso").</li>
        <li><strong>Contemplação:</strong> Pensando em mudar em 6 meses ("Estou acima do peso").</li>
        <li><strong>Preparação:</strong> Planejando em 1 mês ("Comprei uma balança e um tênis").</li>
        <li><strong>Ação:</strong> Mudando comportamento (< 6 meses).</li>
        <li><strong>Manutenção:</strong> Mantendo hábito (> 6 meses).</li>
      </ul>
      <h2>2. Entrevista Motivacional (MI)</h2>
      <p>Centrada no paciente, buscando evocar a própria motivação do paciente para a mudança. Princípios OARS: Open questions (Abertas), Affirmations (Afirmações), Reflective listening (Escuta reflexiva), Summaries (Resumos).</p>
    `,
    questions: [
      {
        id: "d8-q1",
        text: "Um paciente diz: 'Eu sei que deveria comer menos sal para minha pressão, mas a comida sem sal é muito ruim.' Qual é o estágio de mudança?",
        options: [
          "Pré-contemplação",
          "Contemplação",
          "Preparação",
          "Ação"
        ],
        correctAnswer: 1,
        explanation: "Contemplação. O paciente reconhece o problema e os benefícios da mudança, mas se sente ambivalente devido às barreiras (sabor)."
      }
    ]
  },
  9: {
    id: 9,
    title: "Research & Ethics",
    theoryTitle: "Desenhos de Estudos e Ética",
    theoryContent: `
      <h2>1. Desenhos de Estudo</h2>
      <p><strong>Ensaio Clínico Randomizado (RCT):</strong> Padrão Ouro. Envolve randomização e grupo controle. Estabelece causa e efeito.</p>
      <p><strong>Estudo de Coorte:</strong> Observacional, baseia-se na exposição e segue as pessoas no tempo (prospectivo) para ver o desfecho.</p>
      <p><strong>Caso-Controle:</strong> Retrospectivo. Começa pelo desfecho (doença) e olha pro passado para ver a exposição.</p>
      <p><strong>Cross-Sectional (Transversal):</strong> Fotografia do momento (prevalência) sem estabelecer sequência temporal.</p>
    `,
    questions: [
      {
        id: "d9-q1",
        text: "Uma pesquisa quer saber a associação de níveis séricos atuais de Vitamina D na população de uma cidade hoje. Que estudo é esse?",
        options: [
          "Transversal",
          "Casual",
          "Coorte prospectivo",
          "Ensaio clínico"
        ],
        correctAnswer: 0,
        explanation: "Cross-sectional (transversal) mede a prevalência de uma variável na população em um instante específico do tempo."
      }
    ]
  },
  10: {
    id: 10,
    title: "Review & Weak Points",
    theoryTitle: "Revisão Geral e Mini Simulado",
    theoryContent: `
      <h2>Importância da Revisão Crítica</h2>
      <p>Neste dia, o ideal é voltar a qualquer domínio no qual a sua pontuação esteve abaixo de 60%. Preencha as lacunas de conhecimento.</p>
      <p>Sempre faça anotações concisas na sua 'Folha Ouro' de fórmulas de enteral, temperaturas de segurança para carnes, e pontos de corte de diabetes que você erra consistentemente.</p>
    `,
    questions: [
      {
        id: "d10-q1",
        text: "Qual é a temperatura interna segura recomendada para carne moída de boi?",
        options: [
          "145°F (63°C)",
          "155°F (68°C)",
          "165°F (74°C)",
          "135°F (57°C)"
        ],
        correctAnswer: 1,
        explanation: "Carne moída (boi, porco) deve ser cozida a 155°F (68°C) para garantir a eliminação de E. coli, que foi misturada durante a moagem."
      },
      {
        id: "d10-q2",
        text: "O BMI (IMC) normal em adultos varia de:",
        options: [
          "15.0 – 19.9",
          "18.5 – 24.9",
          "25.0 – 29.9",
          "30.0 – 34.9"
        ],
        correctAnswer: 1,
        explanation: "A classificação do CDC para peso normal é IMC entre 18.5 e 24.9."
      }
    ]
  }
};
