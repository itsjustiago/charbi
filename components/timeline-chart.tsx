"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Character, Era } from "@/lib/db/schema";
import { axisYear, formatYear, formatLifeRange } from "@/lib/format";

const ROW_H = 26;
const BAR_H = 14;
const NAME_W = 168;
const AXIS_H = 40;
const UNKNOWN_SPAN = 25;

const EVENTS = [
  { year: -2370, label: "Dilúvio" },
  { year: -1513, label: "Êxodo" },
  { year: -1034, label: "Templo" },
  { year: -607, label: "Queda de Jerusalém" },
  { year: 33, label: "Morte de Jesus" },
];

export function TimelineChart({
  characters,
  eras,
}: {
  characters: Character[];
  eras: Era[];
}) {
  const [pxPerYear, setPxPerYear] = useState(0.36);

  const sorted = useMemo(
    () =>
      [...characters].sort(
        (a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0) || a.name.localeCompare(b.name),
      ),
    [characters],
  );

  const { minY, maxY } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const c of characters) {
      if (c.birthYear != null) {
        const b = axisYear(c.birthYear);
        min = Math.min(min, b);
        max = Math.max(max, b + (c.deathYear != null ? 0 : UNKNOWN_SPAN));
      }
      if (c.deathYear != null) max = Math.max(max, axisYear(c.deathYear));
    }
    return { minY: Math.floor(min / 100) * 100, maxY: Math.ceil(max / 100) * 100 };
  }, [characters]);

  const plotW = (maxY - minY) * pxPerYear;
  const x = (year: number) => (axisYear(year) - minY) * pxPerYear;

  const gridYears = useMemo(() => {
    const out: number[] = [];
    for (let y = Math.ceil(minY / 500) * 500; y <= maxY; y += 500) {
      out.push(y <= 0 ? y - 1 : y); // converte do eixo contínuo para o ano real
    }
    return out;
  }, [minY, maxY]);

  // primeira linha de cada era (para âncoras #era)
  const eraAnchor = useMemo(() => {
    const seen = new Set<string>();
    const map: Record<number, string> = {};
    sorted.forEach((c, i) => {
      if (!seen.has(c.era)) {
        seen.add(c.era);
        map[i] = c.era;
      }
    });
    return map;
  }, [sorted]);

  const bodyH = sorted.length * ROW_H;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface/40">
      {/* CONTROLOS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-soft px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {eras.map((e) => (
            <span
              key={e.slug}
              className="inline-flex items-center gap-1.5 text-[11px] text-muted"
            >
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: e.color }} />
              {e.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-faint">zoom</span>
          <button
            onClick={() => setPxPerYear((p) => Math.max(0.15, +(p - 0.08).toFixed(2)))}
            className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-fg hover:bg-surface-2"
            aria-label="Reduzir"
          >
            −
          </button>
          <button
            onClick={() => setPxPerYear((p) => Math.min(1.2, +(p + 0.08).toFixed(2)))}
            className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-fg hover:bg-surface-2"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="overflow-x-auto">
        <div style={{ width: NAME_W + plotW, position: "relative" }}>
          {/* EIXO (cabeçalho) */}
          <div
            className="sticky top-0 z-30 flex border-b border-border bg-surface/95 backdrop-blur"
            style={{ height: AXIS_H }}
          >
            <div
              className="sticky left-0 z-10 flex items-center bg-surface px-3 font-mono text-[10px] uppercase tracking-wider text-faint"
              style={{ width: NAME_W, minWidth: NAME_W }}
            >
              Personagem
            </div>
            <div className="relative" style={{ width: plotW }}>
              {gridYears.map((y) => (
                <div
                  key={y}
                  className="absolute top-0 flex h-full items-center"
                  style={{ left: x(y) }}
                >
                  <span className="whitespace-nowrap pl-1 font-mono text-[10px] text-faint">
                    {formatYear(y)}
                  </span>
                </div>
              ))}
              {EVENTS.filter((ev) => axisYear(ev.year) >= minY && axisYear(ev.year) <= maxY).map(
                (ev) => (
                  <div
                    key={ev.label}
                    className="absolute bottom-0 flex items-center"
                    style={{ left: x(ev.year) }}
                  >
                    <span className="whitespace-nowrap rounded-sm bg-accent/15 px-1 text-[9px] font-medium text-accent-2">
                      {ev.label}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* CORPO */}
          <div className="relative" style={{ height: bodyH }}>
            {/* fundo: bandas de eras + linhas + eventos */}
            <div
              className="pointer-events-none absolute top-0"
              style={{ left: NAME_W, width: plotW, height: bodyH }}
            >
              {eras.map((e) => (
                <div
                  key={e.slug}
                  className="absolute top-0 h-full"
                  style={{
                    left: x(e.startYear),
                    width: x(e.endYear) - x(e.startYear),
                    backgroundColor: `${e.color}0e`,
                    borderLeft: `1px solid ${e.color}30`,
                  }}
                />
              ))}
              {gridYears.map((y) => (
                <div
                  key={y}
                  className="absolute top-0 h-full border-l border-border-soft/60"
                  style={{ left: x(y) }}
                />
              ))}
              {EVENTS.filter((ev) => axisYear(ev.year) >= minY && axisYear(ev.year) <= maxY).map(
                (ev) => (
                  <div
                    key={ev.label}
                    className="absolute top-0 h-full border-l border-dashed"
                    style={{ left: x(ev.year), borderColor: "rgba(216,177,90,0.4)" }}
                  />
                ),
              )}
            </div>

            {/* linhas */}
            {sorted.map((c, i) => {
              const start = c.birthYear ?? 0;
              const known = c.deathYear != null;
              const endYear = known ? (c.deathYear as number) : start + UNKNOWN_SPAN;
              const left = x(start);
              const width = Math.max(6, x(endYear) - left);
              const color = eras.find((e) => e.slug === c.era)?.color ?? "#64748b";
              return (
                <div
                  key={c.slug}
                  id={eraAnchor[i]}
                  className="flex scroll-mt-32"
                  style={{ height: ROW_H }}
                >
                  <Link
                    href={`/personagem/${c.slug}`}
                    className="group sticky left-0 z-20 flex items-center gap-2 border-b border-border-soft/50 bg-ink px-3"
                    style={{ width: NAME_W, minWidth: NAME_W }}
                  >
                    <span className="truncate text-xs font-medium text-fg group-hover:text-accent-2">
                      {c.name}
                    </span>
                  </Link>
                  <div className="relative border-b border-border-soft/30" style={{ width: plotW }}>
                    <Link
                      href={`/personagem/${c.slug}`}
                      title={`${c.name} · ${formatLifeRange(c.birthYear, c.deathYear, c.dateApprox)}`}
                      className="absolute rounded-full transition-all hover:brightness-125 hover:ring-2 hover:ring-white/30"
                      style={{
                        left,
                        width,
                        height: BAR_H,
                        top: (ROW_H - BAR_H) / 2,
                        backgroundColor: color,
                        opacity: c.dateApprox ? 0.55 : 0.92,
                        border: known ? "none" : `1px dashed ${color}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
