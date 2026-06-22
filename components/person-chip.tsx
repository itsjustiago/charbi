import Link from "next/link";
import type { Character } from "@/lib/db/schema";
import { eraColor } from "@/lib/eras";
import { formatLifeRange } from "@/lib/format";

export function PersonChip({
  character,
  relation,
}: {
  character: Character;
  relation?: string;
}) {
  const color = eraColor(character.era);
  return (
    <Link
      href={`/personagem/${character.slug}`}
      className="group flex items-center gap-3 rounded-lg border border-border-soft bg-surface/60 px-3 py-2 transition-colors hover:border-border hover:bg-surface-2"
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-semibold"
        style={{ color, backgroundColor: `${color}22` }}
      >
        {character.name.charAt(0)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-fg group-hover:text-accent-2">
          {character.name}
        </span>
        <span className="block truncate font-mono text-[10px] text-faint">
          {relation ? `${relation} · ` : ""}
          {formatLifeRange(character.birthYear, character.deathYear, character.dateApprox)}
        </span>
      </span>
    </Link>
  );
}
