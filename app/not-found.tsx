import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-fg">
        Página não encontrada
      </h1>
      <p className="mt-3 text-muted">
        Esse personagem ou página não existe no Charbi.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-2"
        >
          Voltar ao início
        </Link>
        <Link
          href="/personagens"
          className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          Ver personagens
        </Link>
      </div>
    </div>
  );
}
