import type { Metadata } from "next";
import { getAllCharacters } from "@/lib/queries";
import { CharacterBrowser } from "@/components/character-browser";

export const metadata: Metadata = {
  title: "Personagens",
  description:
    "Lista completa de personagens bíblicos no Charbi, agrupados por era. Procura por nome ou papel.",
};

export default async function PersonagensPage() {
  const characters = await getAllCharacters();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">
          Personagens
        </h1>
        <p className="mt-2 text-muted">
          {characters.length} figuras bíblicas, de Adão aos apóstolos. Clica para
          estudar cada uma.
        </p>
      </header>
      <CharacterBrowser characters={characters} />
    </div>
  );
}
