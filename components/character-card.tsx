import Link from "next/link";
import type { Character } from "@/lib/db/schema";
import { eraColor } from "@/lib/eras";
import { formatLifeRange } from "@/lib/format";

export function CharacterCard({ character }: { character: Character }) {
  const color = eraColor(character.era);
  return (
    <Link
      href={`/personagem/${character.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border-soft bg-surface/60 p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:bg-surface-2"
    >
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <div className="flex items-baseline justify-between gap-2 pl-1.5">
        <h3 className="font-display text-lg font-semibold text-fg transition-colors group-hover:text-accent-2">
          {character.name}
        </h3>
        <span className="shrink-0 font-mono text-[11px] text-faint">
          {formatLifeRange(character.birthYear, character.deathYear, character.dateApprox)}
        </span>
      </div>
      <p className="pl-1.5 text-xs font-medium" style={{ color }}>
        {character.role}
      </p>
      <p className="mt-2 pl-1.5 text-sm leading-relaxed text-muted line-clamp-2">
        {character.tagline}
      </p>
    </Link>
  );
}
