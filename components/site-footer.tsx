export function SiteFooter() {
  return (
    <footer className="border-t border-border-soft px-4 py-10 text-sm text-muted sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-base text-fg">
          Charbi <span className="text-faint">· estudo de personagens bíblicos</span>
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-faint">
          Cronologia e referências baseadas na cronologia bíblica publicada em{" "}
          <a
            href="https://www.jw.org/pt/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            jw.org
          </a>
          . Ferramenta pessoal de estudo, sem fins comerciais.
        </p>
      </div>
    </footer>
  );
}
