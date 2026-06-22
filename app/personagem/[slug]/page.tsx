import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCharacters,
  getCharacterWithFamily,
  type Family,
  type FamilyMember,
} from "@/lib/queries";
import { eraColor, eraName } from "@/lib/eras";
import { formatYear, formatLifeRange, lifespanLabel } from "@/lib/format";
import { EraBadge } from "@/components/era-badge";
import { JwLink } from "@/components/jw-link";
import { PersonChip } from "@/components/person-chip";

export async function generateStaticParams() {
  const characters = await getAllCharacters();
  return characters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCharacterWithFamily(slug);
  if (!data) return { title: "Personagem não encontrado" };
  const { character } = data;
  return {
    title: character.name,
    description: character.tagline,
  };
}

const FAMILY_SECTIONS: { key: keyof Family; label: string }[] = [
  { key: "parents", label: "Progenitores" },
  { key: "spouses", label: "Cônjuges" },
  { key: "siblings", label: "Irmãos" },
  { key: "children", label: "Filhos" },
  { key: "ancestors", label: "Linhagem (antepassados)" },
  { key: "descendants", label: "Linhagem (descendentes)" },
  { key: "relatives", label: "Outros familiares" },
];

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCharacterWithFamily(slug);
  if (!data) notFound();

  const { character: c, family } = data;
  const color = eraColor(c.era);
  const hasFamily = FAMILY_SECTIONS.some((s) => (family[s.key] as FamilyMember[]).length);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/personagens"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        ← Todos os personagens
      </Link>

      {/* CABEÇALHO */}
      <header
        className="relative overflow-hidden rounded-2xl border border-border-soft p-6 sm:p-8"
        style={{
          background: `linear-gradient(160deg, ${color}1f, transparent 65%)`,
        }}
      >
        <span
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <EraBadge slug={c.era} />
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          {c.name}
        </h1>
        <p className="mt-1 text-lg" style={{ color }}>
          {c.role}
        </p>
        {c.aka && c.aka.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            Também conhecido(a) como {c.aka.join(", ")}
            {c.nameEn ? ` · ${c.nameEn}` : ""}
          </p>
        )}
        <p className="mt-5 max-w-2xl font-display text-xl italic leading-relaxed text-fg/90">
          “{c.tagline}”
        </p>
      </header>

      {/* ESTATÍSTICAS */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Nascimento" value={c.birthYear != null ? formatYear(c.birthYear) : "—"} approx={c.dateApprox} />
        <Stat label="Morte" value={c.deathYear != null ? formatYear(c.deathYear) : "—"} approx={c.dateApprox} />
        <Stat label="Tempo de vida" value={lifespanLabel(c.lifespan) ?? "—"} />
        <Stat label="Era" value={eraName(c.era)} />
      </div>

      {/* RESUMO + FACTOS */}
      <section className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            Quem foi
          </h2>
          <p className="text-[15px] leading-7 text-fg/90">{c.summary}</p>

          {c.scriptures && c.scriptures.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                Passagens
              </h3>
              <div className="flex flex-wrap gap-2">
                {c.scriptures.map((ref) => (
                  <span
                    key={ref}
                    className="rounded-md border border-border-soft bg-surface px-2.5 py-1 font-mono text-xs text-muted"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            {c.jwUrl && <JwLink url={c.jwUrl} name={c.name} />}
          </div>
        </div>

        <div>
          {c.keyFacts && c.keyFacts.length > 0 && (
            <div className="rounded-xl border border-border-soft bg-surface/50 p-5">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                Em destaque
              </h3>
              <ul className="space-y-3">
                {c.keyFacts.map((fact, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-fg/85">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* FAMÍLIA */}
      {hasFamily && (
        <section className="mt-12">
          <h2 className="mb-5 font-display text-2xl font-semibold text-fg">
            Família e linhagem
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {FAMILY_SECTIONS.map((section) => {
              const members = family[section.key] as FamilyMember[];
              if (!members.length) return null;
              return (
                <div key={section.key}>
                  <h3 className="mb-2.5 font-mono text-xs uppercase tracking-[0.2em] text-faint">
                    {section.label}
                  </h3>
                  <div className="space-y-2">
                    {members.map((m) => (
                      <PersonChip
                        key={m.character.slug}
                        character={m.character}
                        relation={m.relation}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* NAVEGAÇÃO */}
      <div className="mt-12 flex flex-wrap gap-3 border-t border-border-soft pt-8">
        <Link
          href={`/cronologia#${c.era}`}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-fg transition-colors hover:bg-surface-2"
        >
          Ver na linha do tempo
        </Link>
        <Link
          href="/grafo"
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-fg transition-colors hover:bg-surface-2"
        >
          Ver no grafo familiar
        </Link>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  approx,
}: {
  label: string;
  value: string;
  approx?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface/50 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-fg">
        {approx && value !== "—" ? "≈ " : ""}
        {value}
      </p>
    </div>
  );
}
