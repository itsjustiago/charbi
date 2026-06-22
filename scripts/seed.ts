/**
 * Popula a base de dados Neon com as eras, personagens e relações.
 * Executar:  npm run db:seed
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  eras as erasTable,
  characters as charactersTable,
  relationships as relsTable,
} from "../lib/db/schema";
import {
  eras,
  characters,
  relationships,
  type CharacterSeed,
} from "../data/seed-data";

function jwUrlFor(c: CharacterSeed): string {
  const q = encodeURIComponent(c.jwQuery ?? c.name);
  return `https://www.jw.org/pt/busca/?q=${q}`;
}

/** Calcula o tempo de vida quando há nascimento e morte mas não foi indicado. */
function computeLifespan(c: CharacterSeed): number | null {
  if (typeof c.lifespan === "number") return c.lifespan;
  if (typeof c.birthYear === "number" && typeof c.deathYear === "number") {
    let span = c.deathYear - c.birthYear;
    // Não existe ano 0: corrige a contagem ao atravessar a.E.C. -> E.C.
    if (c.birthYear < 0 && c.deathYear > 0) span -= 1;
    return span;
  }
  return null;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não está definida (.env.local).");

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("→ A limpar tabelas...");
  await db.delete(relsTable);
  await db.delete(charactersTable);
  await db.delete(erasTable);

  console.log(`→ A inserir ${eras.length} eras...`);
  await db.insert(erasTable).values(eras);

  const slugSet = new Set(characters.map((c) => c.slug));

  console.log(`→ A inserir ${characters.length} personagens...`);
  await db.insert(charactersTable).values(
    characters.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameEn: c.nameEn,
      aka: c.aka ?? null,
      gender: c.gender,
      era: c.era,
      birthYear: c.birthYear ?? null,
      deathYear: c.deathYear ?? null,
      lifespan: computeLifespan(c),
      dateApprox: c.dateApprox ?? false,
      role: c.role,
      tagline: c.tagline,
      summary: c.summary,
      keyFacts: c.keyFacts,
      scriptures: c.scriptures,
      jwUrl: jwUrlFor(c),
    })),
  );

  // Filtra relações cujos extremos existam ambos (evita erros de chave estrangeira).
  const validRels = relationships.filter((r) => {
    const ok = slugSet.has(r.from) && slugSet.has(r.to);
    if (!ok) console.warn(`  ⚠ relação ignorada: ${r.from} -> ${r.to}`);
    return ok;
  });

  console.log(`→ A inserir ${validRels.length} relações...`);
  await db.insert(relsTable).values(
    validRels.map((r) => ({
      fromSlug: r.from,
      toSlug: r.to,
      type: r.type,
    })),
  );

  console.log("✓ Seed concluído.");
}

main().catch((err) => {
  console.error("✗ Erro no seed:", err);
  process.exit(1);
});
