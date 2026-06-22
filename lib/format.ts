/** Formatação de anos no sistema E.C. / a.E.C. (não existe ano 0). */

export function formatYear(year: number): string {
  return year < 0 ? `${-year} a.E.C.` : `${year} E.C.`;
}

/** Converte para um eixo contínuo, removendo o "salto" do ano 0. */
export function axisYear(year: number): number {
  return year < 0 ? year + 1 : year;
}

/** Intervalo de vida legível, ex.: "4026–3096 a.E.C." ou "2 a.E.C. – 33 E.C.". */
export function formatLifeRange(
  birth: number | null,
  death: number | null,
  approx?: boolean,
): string {
  const prefix = approx ? "≈ " : "";
  if (birth == null && death == null) return "datas desconhecidas";
  if (birth != null && death == null) return `${prefix}n. ${formatYear(birth)}`;
  if (birth == null && death != null) return `${prefix}m. ${formatYear(death)}`;

  const b = birth as number;
  const d = death as number;
  const sameEra = b < 0 === d < 0;
  if (sameEra) {
    const era = b < 0 ? "a.E.C." : "E.C.";
    return `${prefix}${Math.abs(b)}–${Math.abs(d)} ${era}`;
  }
  return `${prefix}${formatYear(b)} – ${formatYear(d)}`;
}

export function lifespanLabel(span: number | null): string | null {
  if (span == null) return null;
  return `${span} anos`;
}
