/** Metadados das eras espelhados do seed — para colorir UI sem ir à BD. */
export type EraMeta = {
  slug: string;
  name: string;
  color: string;
  ordinal: number;
};

export const ERA_LIST: EraMeta[] = [
  { slug: "pre-diluviano", name: "Antes do Dilúvio", color: "#6366f1", ordinal: 1 },
  { slug: "patriarcas", name: "Patriarcas", color: "#d97706", ordinal: 2 },
  { slug: "egito-exodo", name: "Egito e Êxodo", color: "#dc2626", ordinal: 3 },
  { slug: "juizes", name: "Juízes", color: "#0d9488", ordinal: 4 },
  { slug: "reino-unido", name: "Reino Unido", color: "#7c3aed", ordinal: 5 },
  { slug: "reis-profetas", name: "Reis e Profetas", color: "#2563eb", ordinal: 6 },
  { slug: "exilio-regresso", name: "Exílio e Regresso", color: "#0891b2", ordinal: 7 },
  { slug: "jesus", name: "Tempos de Jesus", color: "#059669", ordinal: 8 },
  { slug: "cristianismo", name: "Cristianismo Primitivo", color: "#e11d48", ordinal: 9 },
];

export const ERA_META: Record<string, EraMeta> = Object.fromEntries(
  ERA_LIST.map((e) => [e.slug, e]),
);

export function eraColor(slug: string): string {
  return ERA_META[slug]?.color ?? "#64748b";
}

export function eraName(slug: string): string {
  return ERA_META[slug]?.name ?? slug;
}
