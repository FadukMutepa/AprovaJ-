export interface ExamQuestion {
  id: number;
  subject: string;
  university: string;
  year: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string[];
}

export const examQuestions: ExamQuestion[] = [
  {
    id: 1,
    subject: "Matemática",
    university: "Exame Nacional",
    year: 2025,
    questionText: "Numa progressão aritmética (PA) onde o primeiro termo a₁ = 3 e a razão r = 4, qual é o valor do décimo termo (a₁₀)?",
    options: [
      "35",
      "39",
      "43",
      "47"
    ],
    correctIndex: 1,
    explanation: [
      "Fórmula do termo geral da PA: aₙ = a₁ + (n - 1) * r",
      "Substituindo os valores conhecidos: a₁₀ = 3 + (10 - 1) * 4",
      "a₁₀ = 3 + 9 * 4",
      "a₁₀ = 3 + 36 = 39.",
      "Portanto, o décimo termo é igual a 39."
    ]
  },
  {
    id: 2,
    subject: "Português",
    university: "Exame Nacional",
    year: 2025,
    questionText: "Qual das seguintes frases apresenta uma oração subordinada adverbial condicional?",
    options: [
      "Fizemos o teste conforme o professor orientou.",
      "Se estudares diariamente, conseguirás a aprovação.",
      "Embora estivesse cansado, continuou a praticar os simulados.",
      "Quando o sinal tocou, todos entregaram a prova."
    ],
    correctIndex: 1,
    explanation: [
      "A conjunção 'Se' introduz uma hipótese ou condição indispensável para que o facto principal ocorra.",
      "'Se estudares diariamente' expressa a condição necessária para o resultado 'conseguirás a aprovação'.",
      "As outras opções são: conforme (conformativa), embora (concessiva) e quando (temporal)."
    ]
  },
  {
    id: 3,
    subject: "Física",
    university: "Exame Nacional",
    year: 2024,
    questionText: "Um corpo de massa 2 kg é abandonado a partir do repouso de uma altura de 20 metros. Desprezando a resistência do ar e considerando g = 10 m/s², qual é a velocidade do corpo ao atingir o solo?",
    options: [
      "10 m/s",
      "20 m/s",
      "30 m/s",
      "40 m/s"
    ],
    correctIndex: 1,
    explanation: [
      "Pela conservação da energia mecânica: E_inicial = E_final",
      "Energia Potencial Gravítica inicial: E_pg = m * g * h = 2 * 10 * 20 = 400 J",
      "No solo, toda energia mecânica se converte em Energia Cinética: E_c = (1/2) * m * v² = 400 J",
      "(1/2) * 2 * v² = 400 => v² = 400 => v = 20 m/s.",
      "Portanto, a velocidade ao atingir o solo é 20 m/s."
    ]
  }
];

export interface ExamPdf {
  id: string;
  year: number;
  subject: string;
  university: string;
  downloads: number;
  size: string;
}

export const examPdfs: ExamPdf[] = [
  { id: "pdf-1", year: 2025, subject: "Matemática A", university: "Universidade de Coimbra", downloads: 1420, size: "1.4 MB" },
  { id: "pdf-2", year: 2025, subject: "Português", university: "Universidade do Porto", downloads: 980, size: "1.1 MB" },
  { id: "pdf-3", year: 2024, subject: "Física e Química A", university: "Universidade de Lisboa", downloads: 1750, size: "1.8 MB" },
  { id: "pdf-4", year: 2024, subject: "Biologia e Geologia", university: "Universidade do Minho", downloads: 1120, size: "1.6 MB" },
];

export const universityCourses = [
  "Medicina",
  "Engenharia Informática",
  "Direito",
  "Gestão / Economia",
  "Arquitetura",
  "Psicologia",
  "Biologia / Biomedicina",
  "Línguas e Relações Internacionais",
  "Design / Marketing",
  "Outro Curso"
];
