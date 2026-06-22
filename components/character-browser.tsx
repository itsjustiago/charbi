"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/lib/db/schema";
import { ERA_LIST } from "@/lib/eras";
import { CharacterCard } from "@/components/character-card";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CharacterBrowser({ characters }: { characters: Character[] }) {
  const [query, setQuery] = useState("");
  const [era, setEra] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return characters.filter((c) => {
      if (era && c.era !== era) return false;
      if (!q) return true;
      const hay = normalize(
        [c.name, c.nameEn ?? "", c.role, (c.aka ?? []).join(" ")].join(" "),
      );
      return hay.includes(q);
    });
  }, [characters, query, era]);

  const grouped = useMemo(() => {
    return ERA_LIST.map((e) => ({
      era: e,
      items: filtered.filter((c) => c.era === e.slug),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-border-soft bg-ink/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar por nome ou papel…"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-accent/50"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          <FilterChip active={era === null} onClick={() => setEra(null)} color="#d8b15a">
            Todas
          </FilterChip>
          {ERA_LIST.map((e) => (
            <FilterChip
              key={e.slug}
              active={era === e.slug}
              onClick={() => setEra(era === e.slug ? null : e.slug)}
              color={e.color}
            >
              {e.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="py-16 text-center text-muted">
          Nenhum personagem encontrado para “{query}”.
        </p>
      ) : (
        <div className="space-y-10">
          {grouped.map(({ era: e, items }) => (
            <section key={e.slug} id={e.slug} className="scroll-mt-36">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                <h2 className="font-display text-xl font-semibold text-fg">{e.name}</h2>
                <span className="font-mono text-xs text-faint">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <CharacterCard key={c.slug} character={c} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
      style={
        active
          ? { color: "#0a0d13", backgroundColor: color }
          : { color: "var(--color-muted)", boxShadow: "inset 0 0 0 1px var(--color-border)" }
      }
    >
      {children}
    </button>
  );
}
