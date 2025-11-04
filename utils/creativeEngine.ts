import { z } from "zod";

const InputSchema = z.object({
  channelName: z.string().min(2),
  videoGoal: z.string().min(4),
  episodeTopic: z.string().min(4),
  audience: z.string().min(3),
  tone: z.string().min(3),
  duration: z.string().min(2),
  keywords: z.array(z.string()).default([]),
  narrativeFramework: z.string().min(2),
  language: z.enum(["pt", "en"]).default("pt"),
  includeChapters: z.boolean().default(true),
});

export type CreativeInput = z.infer<typeof InputSchema>;

export interface ScriptSection {
  section: string;
  objective: string;
  content: string;
}

export interface DialogueScene {
  scene: string;
  direction: string;
  speakers: { name: string; line: string }[];
}

export interface VisualPrompt {
  title: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  style: string;
  camera: string;
}

export interface ChapterSummary {
  title: string;
  duration: string;
  summary: string;
}

export interface CreativePack {
  hook: string;
  synopsis: string;
  keyMoments: string[];
  script: ScriptSection[];
  dialogues: DialogueScene[];
  visualPrompts: VisualPrompt[];
  brollIdeas: { cue: string; prompt: string }[];
  callToAction: string;
  chapters: ChapterSummary[];
  deliverables: string[];
}

const frameworks: Record<
  string,
  {
    name: string;
    description: string;
    blueprint: { id: string; label: string; objective: string }[];
    hooks: string[];
    callToActions: string[];
  }
> = {
  "heroi-jornada": {
    name: "Jornada do Herói",
    description:
      "Transforme o protagonista em um herói em evolução, com desafios crescentes e resolução transformadora.",
    blueprint: [
      {
        id: "apresentacao",
        label: "Ato 1 – Chamado",
        objective: "Apresentar o contexto e o conflito inicial que conecta com o público.",
      },
      {
        id: "desafio",
        label: "Ato 2 – Provação",
        objective: "Evoluir a narrativa com obstáculos práticos e aprendizados claros.",
      },
      {
        id: "transformacao",
        label: "Ato 3 – Transformação",
        objective: "Concluir com uma transformação tangível e um convite à ação." ,
      },
    ],
    hooks: [
      "Você já sentiu que {audience} está preso em um ciclo sem saída?",
      "O que eu descobri sobre {topic} vai mudar como você encara {goal}.",
      "Existe uma virada simples que pode levar {audience} de {pain} para {desire}.",
    ],
    callToActions: [
      "Inscreva-se para acompanhar nossa próxima jornada e compartilhar sua própria transformação nos comentários!",
      "Baixe o checklist gratuito nos comentários fixados e dê o próximo passo hoje mesmo!",
      "Compartilhe este vídeo com quem precisa desse impulso e continue a história com a gente!",
    ],
  },
  "problema-solucao": {
    name: "Problema → Solução",
    description:
      "Episódios objetivos que mapeiam dores reais, apresentam soluções claras e reforçam autoridade.",
    blueprint: [
      {
        id: "contexto",
        label: "Identificação da Dor",
        objective: "Validar a frustração do público com dados ou situações cotidianas.",
      },
      {
        id: "metodo",
        label: "Método Em 3 Etapas",
        objective: "Mostrar uma solução estruturada e escalável, com exemplos reais.",
      },
      {
        id: "futuro",
        label: "Transformação Realista",
        objective: "Pintar o futuro após aplicar a solução, inclusive próximos passos.",
      },
    ],
    hooks: [
      "{audience}, você está cansado de tentar {goal} e sempre cair na mesma armadilha?",
      "Este é o método que tirou {persona} de {painPoint} e levou para {desire}.",
      "Se você quer {goal} sem perder {resource}, precisa dominar {topic} agora.",
    ],
    callToActions: [
      "Assine o canal para receber os próximos vídeos da série e não perder os templates!",
      "Deixe um comentário com sua maior dúvida sobre {topic} que eu respondo pessoalmente.",
      "Envie este episódio para alguém da sua equipe que precisa destravar {goal} ainda hoje!",
    ],
  },
  "docuserie": {
    name: "DocuSérie IA",
    description:
      "Documente um tema com narrativa cinematográfica, unindo entrevistas, arquivos e visual storytelling.",
    blueprint: [
      {
        id: "origem",
        label: "Setup Cinematográfico",
        objective: "Estabelecer estética, atmosfera e conflito investigativo inicial.",
      },
      {
        id: "investigacao",
        label: "Investigações Múltiplas",
        objective: "Unir entrevistas, dados e B-roll analítico para expandir a tensão.",
      },
      {
        id: "resolucao",
        label: "Clímax + Epílogo",
        objective: "Entregar um insight memorável e repercussão para comunidade.",
      },
    ],
    hooks: [
      "Por trás de {topic}, existe uma história não contada que muda tudo que você sabe sobre {goal}.",
      "Este episódio revela arquivos inéditos que colocam {audience} no centro da investigação.",
      "Prepare-se para ver {topic} como nunca antes, com reconstruções geradas por IA e relatos exclusivos.",
    ],
    callToActions: [
      "Ative o sininho e ajude a financiar o próximo capítulo dessa investigação compartilhando o vídeo.",
      "Comente abaixo qual personagem dessa história você quer ver aprofundado no spin-off.",
      "Participe do clube de bastidores na descrição para acessar os prompts originais e entrevistas completas.",
    ],
  },
};

const additives = {
  tones: {
    inspirador: ["impactante", "emocional", "visionário"],
    descontraido: ["leve", "divertido", "conversacional"],
    tecnico: ["preciso", "didático", "autoridade"],
    investigativo: ["intrigante", "suspense", "analítico"],
  } as Record<string, string[]>,
  styles: [
    "cinematográfico futurista",
    "ilustrado digital vibrante",
    "realismo estilizado",
    "estilo anime sci-fi",
    "retro synthwave",
    "low-poly minimalista",
  ],
  cameras: [
    "lente 35mm, profundidade de campo rasa, foco no protagonista",
    "drone 4K, movimento orbital",
    "steadycam hand-held, luz suave",
    "close-up macro com bokeh",
    "plano sequência com dolly-in",
    "câmera virtual cinematográfica, ambient occlusion",
  ],
  negative: [
    "desfoque", "baixa resolução", "artefatos", "pessoas extras", "texto visível", "logotipo"],
};

function fillTemplate(template: string, tokens: Record<string, string>): string {
  return template.replace(/\{(.*?)\}/g, (_, key) => tokens[key] ?? "");
}

function titleCase(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildHook(frameworkId: string, tokens: Record<string, string>) {
  const framework = frameworks[frameworkId];
  const hookTemplate = framework.hooks[Math.floor(Math.random() * framework.hooks.length)];
  return fillTemplate(hookTemplate, tokens);
}

function buildCTA(frameworkId: string, tokens: Record<string, string>) {
  const options = frameworks[frameworkId].callToActions;
  const template = options[Math.floor(Math.random() * options.length)];
  return fillTemplate(template, tokens);
}

function makePrompt(
  context: string,
  audience: string,
  tone: string,
  topic: string,
  keywords: string[]
): VisualPrompt {
  const style = additives.styles[Math.floor(Math.random() * additives.styles.length)];
  const camera = additives.cameras[Math.floor(Math.random() * additives.cameras.length)];
  const negativePrompt = additives.negative.join(", ");
  const vocalTone = tone.toLowerCase();

  return {
    title: `${titleCase(context)} Visual`,
    prompt: `Cena de ${context} sobre ${topic}, com foco em ${audience}, tom ${vocalTone}, elementos-chave: ${keywords.join(", ") || topic}, atmosfera ${style}. ${camera}`,
    negativePrompt,
    aspectRatio: "16:9",
    style: style,
    camera,
  };
}

function makeDialogue(
  section: string,
  objective: string,
  tone: string,
  channel: string
): DialogueScene {
  const tones = additives.tones;
  const toneKey = Object.keys(tones).find((key) => tone.toLowerCase().includes(key)) ?? "inspirador";
  const descriptors = tones[toneKey];

  return {
    scene: section,
    direction: `${objective} em clima ${descriptors[0]} e ritmo ${descriptors[1]}.` ,
    speakers: [
      {
        name: "Host",
        line: `Oi, aqui é ${channel} e hoje vamos direto ao ponto: ${objective}`,
      },
      {
        name: "Narrador IA",
        line: `Imagine agora ${section.toLowerCase()} em detalhes, enquanto você se prepara para colocar em prática ${objective.toLowerCase()}.`,
      },
      {
        name: "Especialista",
        line: `O segredo está em alinhar ${objective.toLowerCase()} com ${descriptors[2]} para manter consistência.`,
      },
    ],
  };
}

function makeBroll(section: string, topic: string, keywords: string[]): { cue: string; prompt: string } {
  const key = keywords.slice(0, 3).join(", ");
  return {
    cue: section,
    prompt: `B-roll dinâmico mostrando ${section.toLowerCase()}, detalhes em ${key || topic}, textura cinematográfica em câmera lenta, luz volumétrica.`,
  };
}

function makeChapter(
  label: string,
  index: number,
  duration: string,
  summary: string
): ChapterSummary {
  const raw = Number.parseInt(duration, 10);
  const safeBase = Number.isFinite(raw) ? raw : 9;
  const sliceDuration = Math.max(1, Math.round(safeBase / 3) + index);

  return {
    title: `${index + 1}. ${label}`,
    duration: `${sliceDuration} min`,
    summary,
  };
}

export function generateCreativePack(rawInput: CreativeInput): CreativePack {
  const input = InputSchema.parse(rawInput);
  const framework = frameworks[input.narrativeFramework] ?? frameworks["problema-solucao"];
  const tokens = {
    audience: input.audience,
    topic: input.episodeTopic,
    goal: input.videoGoal,
    persona: input.audience.split(" ")[0] ?? "público",
    pain: "falta de resultados",
    desire: "crescimento acelerado",
    painPoint: "frustração diária",
    resource: "tempo e orçamento",
  } satisfies Record<string, string>;

  const hook = buildHook(input.narrativeFramework, tokens);
  const synopsis = `Neste episódio vamos explorar ${input.episodeTopic.toLowerCase()} com foco em ${input.videoGoal.toLowerCase()}, pensado especialmente para ${input.audience}. Com um tom ${input.tone} e duração aproximada de ${input.duration}, guiamos a audiência por uma experiência envolvente.`;

  const keyMoments = framework.blueprint.map((step, index) =>
    `Momento ${index + 1}: ${step.label} — ${step.objective}`
  );

  const script: ScriptSection[] = framework.blueprint.map((step, index) => ({
    section: step.label,
    objective: step.objective,
    content: `\n${index === 0 ? hook : "Transição suave para o próximo ato."}\n1. Contextualize ${input.episodeTopic} com exemplos que ressoem com ${input.audience}.\n2. Traga uma evidência ou estatística rápida que valide o problema.\n3. Insira um micro cliffhanger para manter o ritmo ${input.tone.toLowerCase()}.`,
  }));

  const dialogues = script.map((step) => makeDialogue(step.section, step.objective, input.tone, input.channelName));

  const visualPrompts = script.map((step) =>
    makePrompt(step.section, input.audience, input.tone, input.episodeTopic, input.keywords)
  );

  const brollIdeas = script.map((step) => makeBroll(step.section, input.episodeTopic, input.keywords));

  const callToAction = buildCTA(input.narrativeFramework, tokens);

  const deliverables = [
    "Roteiro narrativo estruturado em 3 atos",
    "Diálogos prontos para host, narrador IA e especialista",
    "Pacote de prompts 16:9 para geradores de imagem",
    "Sugestões de B-roll e cenas de apoio",
  ];

  const chapters: ChapterSummary[] = input.includeChapters
    ? framework.blueprint.map((step, index) =>
        makeChapter(
          step.label,
          index,
          input.duration.replace(/[^0-9]/g, "") || "8",
          step.objective
        )
      )
    : [];

  return {
    hook,
    synopsis,
    keyMoments,
    script,
    dialogues,
    visualPrompts,
    brollIdeas,
    callToAction,
    chapters,
    deliverables,
  };
}
