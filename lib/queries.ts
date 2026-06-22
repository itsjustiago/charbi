import { asc, eq, or } from "drizzle-orm";
import { db } from "./db";
import {
  eras as erasTable,
  characters as charactersTable,
  relationships as relsTable,
  type Era,
  type Character,
  type Relationship,
} from "./db/schema";

export type { Era, Character, Relationship };

export async function getEras(): Promise<Era[]> {
  return db.select().from(erasTable).orderBy(asc(erasTable.ordinal));
}

export async function getAllCharacters(): Promise<Character[]> {
  return db
    .select()
    .from(charactersTable)
    .orderBy(asc(charactersTable.birthYear), asc(charactersTable.name));
}

export async function getRelationships(): Promise<Relationship[]> {
  return db.select().from(relsTable);
}

export async function getCharacterBySlug(
  slug: string,
): Promise<Character | undefined> {
  const rows = await db
    .select()
    .from(charactersTable)
    .where(eq(charactersTable.slug, slug))
    .limit(1);
  return rows[0];
}

export type FamilyMember = { character: Character; relation: string };

export type Family = {
  parents: FamilyMember[];
  spouses: FamilyMember[];
  children: FamilyMember[];
  siblings: FamilyMember[];
  ancestors: FamilyMember[];
  descendants: FamilyMember[];
  relatives: FamilyMember[];
};

const emptyFamily = (): Family => ({
  parents: [],
  spouses: [],
  children: [],
  siblings: [],
  ancestors: [],
  descendants: [],
  relatives: [],
});

/** Carrega um personagem e organiza as suas relações familiares. */
export async function getCharacterWithFamily(
  slug: string,
): Promise<{ character: Character; family: Family } | undefined> {
  const character = await getCharacterBySlug(slug);
  if (!character) return undefined;

  const rels = await db
    .select()
    .from(relsTable)
    .where(or(eq(relsTable.fromSlug, slug), eq(relsTable.toSlug, slug)));

  const otherSlugs = new Set<string>();
  for (const r of rels) {
    otherSlugs.add(r.fromSlug === slug ? r.toSlug : r.fromSlug);
  }

  const others = await getAllCharacters();
  const bySlug = new Map(others.map((c) => [c.slug, c]));

  const family = emptyFamily();
  for (const r of rels) {
    const otherSlug = r.fromSlug === slug ? r.toSlug : r.fromSlug;
    const other = bySlug.get(otherSlug);
    if (!other) continue;
    const isFrom = r.fromSlug === slug;

    switch (r.type) {
      case "parent":
        if (isFrom) family.children.push({ character: other, relation: "Filho(a)" });
        else family.parents.push({ character: other, relation: "Progenitor(a)" });
        break;
      case "adoptive":
        if (isFrom) family.children.push({ character: other, relation: "Filho adotivo" });
        else family.parents.push({ character: other, relation: "Pai adotivo" });
        break;
      case "spouse":
        family.spouses.push({ character: other, relation: "Cônjuge" });
        break;
      case "sibling":
        family.siblings.push({ character: other, relation: "Irmão(ã)" });
        break;
      case "ancestor":
        if (isFrom) family.descendants.push({ character: other, relation: "Descendente" });
        else family.ancestors.push({ character: other, relation: "Antepassado" });
        break;
      case "relative":
        family.relatives.push({ character: other, relation: "Familiar" });
        break;
    }
  }

  return { character, family };
}

/** Devolve tudo o que o grafo e a linha do tempo precisam, numa só ida à BD. */
export async function getGraphData(): Promise<{
  eras: Era[];
  characters: Character[];
  relationships: Relationship[];
}> {
  const [eras, characters, relationships] = await Promise.all([
    getEras(),
    getAllCharacters(),
    getRelationships(),
  ]);
  return { eras, characters, relationships };
}
