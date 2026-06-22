import Link from "next/link";
import { getEras, getAllCharacters } from "@/lib/queries";
import { formatYear } from "@/lib/format";
import { CharacterCard } from "@/components/character-card";

const FEATURED = ["adao", "noe", "abraao", "moises", "davi", "jesus"];

export default async function Home() {
  const [eras, characters] = await Promise.all([getEras(), getAllCharacters()]);
  const featured = FEATURED.map((s) => characters.find((c) => c.slug === s)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  const span = eras.length
    ? `${formatYear(eras[0].startYear)} → ${formatYear(eras[eras.length - 1].endYear)}`
    : "";

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
            {span}
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-7xl">
            Os personagens da Bíblia,{" "}
            <span className="italic text-accent-2">através do tempo</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Explora {characters.length} figuras bíblicas numa linha do tempo
            interativa e numa árvore de família cronológica. Descobre quando
            viveram, o que fizeram e como se ligam umas às outras — de Adão aos
            apóstolos.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/cronologia"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-2"
            >
              Ver a linha do tempo
              <Arrow />
            </Link>
            <Link
              href="/grafo"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
            >
              Explorar o grafo familiar
            </Link>
          </div>
        </div>
      </section>

      {/* FAIXA DE ERAS */}
      <section className="border-y border-border-soft bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            As nove eras
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-9">
            {eras.map((era) => (
              <Link
                key={era.slug}
                href={`/cronologia#${era.slug}`}
                className="group rounded-lg border border-border-soft bg-surface p-3 transition-colors hover:bg-surface-2"
              >
                <span
                  className="mb-2 block h-1 w-8 rounded-full"
                  style={{ backgroundColor: era.color }}
                />
                <p className="text-sm font-medium leading-tight text-fg">
                  {era.name}
                </p>
                <p className="mt-1 font-mono text-[10px] text-faint">
                  {formatYear(era.startYear)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-fg">
            Para começar
          </h2>
          <Link
            href="/personagens"
            className="text-sm text-accent transition-colors hover:text-accent-2"
          >
            Ver todos os personagens →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CharacterCard key={c.slug} character={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
