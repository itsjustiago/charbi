import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  serial,
  index,
} from "drizzle-orm/pg-core";

/**
 * Eras — blocos cronológicos (cores e limites temporais).
 * Anos são inteiros com sinal: negativos = a.E.C. (antes da Era Comum),
 * positivos = E.C. (Era Comum). Não existe ano 0.
 */
export const eras = pgTable("eras", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year").notNull(),
  color: text("color").notNull(),
  ordinal: integer("ordinal").notNull(),
  summary: text("summary").notNull(),
});

/**
 * Personagens bíblicos. Datas seguem a cronologia bíblica publicada no jw.org
 * (derivada das idades em Génesis 5 e 11 e dos pontos de ancoragem históricos).
 */
export const characters = pgTable(
  "characters",
  {
    slug: text("slug").primaryKey(),
    name: text("name").notNull(),
    nameEn: text("name_en"),
    aka: text("aka").array(),
    gender: text("gender").notNull(),
    era: text("era")
      .notNull()
      .references(() => eras.slug),
    birthYear: integer("birth_year"),
    deathYear: integer("death_year"),
    lifespan: integer("lifespan"),
    dateApprox: boolean("date_approx").notNull().default(false),
    role: text("role").notNull(),
    tagline: text("tagline").notNull(),
    summary: text("summary").notNull(),
    keyFacts: jsonb("key_facts").$type<string[]>().notNull().default([]),
    scriptures: text("scriptures").array(),
    jwUrl: text("jw_url"),
  },
  (t) => [index("characters_era_idx").on(t.era)],
);

/**
 * Relações entre personagens.
 * type: 'parent' | 'spouse' | 'sibling' | 'ancestor' | 'adoptive' | 'relative'
 *  - 'parent'   : ligação direta progenitor -> filho
 *  - 'ancestor' : linhagem com gerações omitidas (desenhada a tracejado)
 */
export const relationships = pgTable(
  "relationships",
  {
    id: serial("id").primaryKey(),
    fromSlug: text("from_slug")
      .notNull()
      .references(() => characters.slug),
    toSlug: text("to_slug")
      .notNull()
      .references(() => characters.slug),
    type: text("type").notNull(),
  },
  (t) => [
    index("rel_from_idx").on(t.fromSlug),
    index("rel_to_idx").on(t.toSlug),
  ],
);

export type Era = typeof eras.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Relationship = typeof relationships.$inferSelect;
