import type { Metadata } from "next";
import { getGraphData } from "@/lib/queries";
import { FamilyGraph } from "@/components/family-graph";

export const metadata: Metadata = {
  title: "Grafo familiar",
  description:
    "Grafo interativo de todos os personagens bíblicos, organizados por era e ligados pelas suas relações familiares e de linhagem.",
};

export default async function GrafoPage() {
  const { characters, relationships, eras } = await getGraphData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">
          Grafo familiar
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Toda a história numa só vista. Da esquerda para a direita corre o
          tempo; cada faixa é uma era. Arrasta, faz zoom e clica num nó para
          estudar cada personagem.
        </p>
      </header>
      <FamilyGraph characters={characters} relationships={relationships} eras={eras} />
    </div>
  );
}
