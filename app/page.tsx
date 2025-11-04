import CreativeWorkbench from "../components/CreativeWorkbench";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 pb-16 pt-20">
      <header className="space-y-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1 text-sm font-medium text-brand-200 ring-1 ring-brand-500/40">
          Assistente IA para criadores de YouTube
        </span>
        <h1 className="text-balance text-4xl font-semibold text-slate-50 md:text-5xl">
          Planeje roteiros, narrativas e prompts visuais em minutos
        </h1>
        <p className="mx-auto max-w-3xl text-pretty text-lg text-slate-200">
          Studio Promptia combina frameworks narrativos, engenharia de prompts e estruturação de episódios para acelerar a criação de vídeos completos com IA. Descreva sua ideia, selecione o tom e receba roteiro, falas, B-roll sugerido e prompts prontos para gerar imagens e cenas.
        </p>
      </header>
      <CreativeWorkbench />
    </main>
  );
}
