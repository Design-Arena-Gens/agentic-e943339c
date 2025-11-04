"use client";

import { useMemo, useState, type ReactNode } from "react";
import { generateCreativePack, type CreativeInput, type CreativePack } from "../utils/creativeEngine";
import { CheckIcon, ClipboardIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import { z } from "zod";

const presets = [
  {
    label: "Explainer Tech",
    value: {
      tone: "técnico inspirador",
      narrativeFramework: "problema-solucao",
    },
  },
  {
    label: "Story Mode",
    value: {
      tone: "investigativo cinematográfico",
      narrativeFramework: "docuserie",
    },
  },
  {
    label: "Motivacional",
    value: {
      tone: "inspirador emocional",
      narrativeFramework: "heroi-jornada",
    },
  },
];

const emptyInput: CreativeInput = {
  channelName: "Canal Nova Geração IA",
  videoGoal: "aumentar retenção e comunidade",
  episodeTopic: "Como usar IA generativa para roteiros semanais",
  audience: "criadores independentes de conteúdo",
  tone: "técnico inspirador",
  duration: "10",
  keywords: ["roteiro IA", "workflows semanais", "automação"],
  narrativeFramework: "problema-solucao",
  language: "pt",
  includeChapters: true,
};

const schema = z.object({
  channelName: z.string().min(2),
  videoGoal: z.string().min(3),
  episodeTopic: z.string().min(3),
  audience: z.string().min(3),
  tone: z.string().min(3),
  duration: z.string().min(1),
  keywords: z.string(),
});

function splitKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
}

function toClipboard(text: string) {
  if (typeof window === "undefined") return;
  navigator.clipboard.writeText(text).catch(() => undefined);
}

function CopyButton({ payload }: { payload: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        toClipboard(payload);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:border-brand-400 hover:text-brand-100"
    >
      {copied ? <CheckIcon className="h-4 w-4 text-brand-300" /> : <ClipboardIcon className="h-4 w-4" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-300">{description}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}

function OutputBlock({
  title,
  content,
  badge,
}: {
  title: string;
  content: string;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
      <header className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-50">{title}</h3>
          {badge ? (
            <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-xs text-brand-100">
              {badge}
            </span>
          ) : null}
        </div>
        <CopyButton payload={content} />
      </header>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{content}</p>
    </div>
  );
}

function buildContent(pack: CreativePack): string {
  const script = pack.script
    .map((block) => `## ${block.section}\nObjetivo: ${block.objective}\n${block.content}`)
    .join("\n\n");
  const dialogues = pack.dialogues
    .map(
      (scene) =>
        `#${scene.scene}\nDireção: ${scene.direction}\n${scene.speakers
          .map((speaker) => `${speaker.name}: ${speaker.line}`)
          .join("\n")}`
    )
    .join("\n\n");
  const prompts = pack.visualPrompts
    .map(
      (prompt) =>
        `Prompt ${prompt.title}: ${prompt.prompt}\nNegativo: ${prompt.negativePrompt}\nAspect Ratio: ${prompt.aspectRatio} | Estilo: ${prompt.style}`
    )
    .join("\n\n");

  return `${pack.hook}\n\n${pack.synopsis}\n\n${script}\n\n${dialogues}\n\n${prompts}\n\nCTA: ${pack.callToAction}`;
}

function VisualPromptList({ prompts }: { prompts: CreativePack["visualPrompts"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {prompts.map((prompt) => (
        <div key={prompt.title} className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-50">{prompt.title}</h3>
              <p className="text-xs uppercase tracking-wide text-brand-200">{prompt.style}</p>
            </div>
            <CopyButton payload={`${prompt.prompt}\nNegativo: ${prompt.negativePrompt}`} />
          </div>
          <ul className="space-y-2 text-sm text-slate-200">
            <li>
              <span className="font-semibold text-slate-100">Prompt:</span> {prompt.prompt}
            </li>
            <li>
              <span className="font-semibold text-slate-100">Negativo:</span> {prompt.negativePrompt}
            </li>
            <li>
              <span className="font-semibold text-slate-100">Camera:</span> {prompt.camera}
            </li>
            <li>
              <span className="font-semibold text-slate-100">Aspect Ratio:</span> {prompt.aspectRatio}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function CreativeWorkbench() {
  const [form, setForm] = useState(emptyInput);
  const [keywordsText, setKeywordsText] = useState(form.keywords.join(", "));
  const [pack, setPack] = useState<CreativePack>(() => generateCreativePack(emptyInput));

  const generatedAsText = useMemo(() => buildContent(pack), [pack]);

  const handleChange = (field: keyof CreativeInput, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      channelName: formData.get("channelName") as string,
      videoGoal: formData.get("videoGoal") as string,
      episodeTopic: formData.get("episodeTopic") as string,
      audience: formData.get("audience") as string,
      tone: formData.get("tone") as string,
      duration: formData.get("duration") as string,
      keywords: (formData.get("keywords") as string) ?? "",
    } satisfies Record<string, string>;

    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      return;
    }

    const nextKeywords = splitKeywords(parsed.data.keywords);

    const nextInput: CreativeInput = {
      ...form,
      ...parsed.data,
      duration: parsed.data.duration,
      keywords: nextKeywords,
    };

    setForm(nextInput);
    setKeywordsText(nextKeywords.join(", "));
    setPack(generateCreativePack(nextInput));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
      <SectionCard
        title="Briefing do Episódio"
        description="Defina os parâmetros da história e gere o pacote completo de roteiro e prompts."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Nome do canal</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="channelName"
                defaultValue={form.channelName}
                placeholder="Canal Nova Geração IA"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Objetivo do vídeo</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="videoGoal"
                defaultValue={form.videoGoal}
                placeholder="engajar comunidade, vender curso..."
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Tema do episódio</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="episodeTopic"
                defaultValue={form.episodeTopic}
                placeholder="Ex.: 7 frameworks de roteiro com IA"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Público-alvo</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="audience"
                defaultValue={form.audience}
                placeholder="Ex.: criadores independentes"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Tom</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="tone"
                defaultValue={form.tone}
                placeholder="Ex.: técnico inspirador"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-200">Duração desejada (minutos)</span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="duration"
                defaultValue={form.duration}
                placeholder="10"
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-slate-200">Palavras-chave (separadas por vírgulas)</span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none"
                name="keywords"
                defaultValue={keywordsText}
                placeholder="roteiro IA, storytelling, prompts"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
            <span className="text-sm font-medium text-slate-200">Preset narrativo</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const next = { ...form, ...preset.value };
                    setForm(next);
                    setKeywordsText(next.keywords.join(", "));
                    setPack(generateCreativePack(next));
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    form.narrativeFramework === preset.value.narrativeFramework
                      ? "border-brand-400 bg-brand-500/20 text-brand-100"
                      : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-brand-400 hover:text-brand-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3 rounded-full bg-slate-900/80 px-3 py-1">
              <Switch
                checked={form.includeChapters}
                onChange={(checked) => {
                  handleChange("includeChapters", checked);
                  setPack(generateCreativePack({ ...form, includeChapters: checked }));
                }}
                className={`${
                  form.includeChapters ? "bg-brand-500" : "bg-slate-700"
                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    form.includeChapters ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <span className="text-xs font-medium text-slate-200">Capítulos</span>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50"
          >
            <SparklesIcon className="h-5 w-5" />
            Gerar Pacote Criativo
          </button>
        </form>
      </SectionCard>

      <SectionCard
        title="Pacote Gerado"
        description="Copie o roteiro completo ou utilize cada bloco individual para alimentar sua pipeline de IA."
      >
        <div className="space-y-5">
          <OutputBlock title="Hook" content={pack.hook} />
          <OutputBlock title="Sinopse" content={pack.synopsis} />
          <OutputBlock title="Momentos-chave" content={pack.keyMoments.join("\n")} />

          <div className="space-y-4">
            {pack.script.map((section) => (
              <OutputBlock
                key={section.section}
                title={section.section}
                badge="Roteiro"
                content={`Objetivo: ${section.objective}\n${section.content}`}
              />
            ))}
          </div>

          <div className="space-y-4">
            {pack.dialogues.map((scene) => (
              <OutputBlock
                key={scene.scene}
                title={scene.scene}
                badge="Diálogo"
                content={`Direção: ${scene.direction}\n${scene.speakers
                  .map((speaker) => `${speaker.name}: ${speaker.line}`)
                  .join("\n")}`}
              />
            ))}
          </div>

          {pack.chapters.length ? (
            <OutputBlock
              title="Capítulos sugeridos"
              content={pack.chapters
                .map((chapter) => `${chapter.title} | ${chapter.duration}\n${chapter.summary}`)
                .join("\n\n")}
            />
          ) : null}

          <OutputBlock
            title="B-roll & Cues"
            content={pack.brollIdeas.map((idea) => `${idea.cue}: ${idea.prompt}`).join("\n\n")}
          />

          <VisualPromptList prompts={pack.visualPrompts} />

          <OutputBlock title="Call to Action" content={pack.callToAction} />

          <OutputBlock title="Entregáveis" content={pack.deliverables.join("\n")} />

          <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-brand-100">Pacote completo</h3>
              <CopyButton payload={generatedAsText} />
            </div>
            <p className="text-sm text-slate-200">
              Exporta todos os blocos em um único texto para briefing de IA, Notion ou roteiro colaborativo.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
