import type { Metadata } from "next";
import { getGraphData } from "@/lib/queries";
import { TimelineChart } from "@/components/timeline-chart";

export const metadata: Metadata = {
  title: "Linha do tempo",
  description:
    "Linha do tempo interativa das vidas dos personagens bíblicos, de 4026 a.E.C. até ao primeiro século. Vê como as suas vidas se sobrepuseram.",
};

export default async function CronologiaPage() {
  const { characters, eras } = await getGraphData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-fg">
          Linha do tempo
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Cada barra é uma vida. Repara como as gerações se sobrepuseram — por
          exemplo, Adão ainda era vivo quando Matusalém nasceu. Usa o zoom e
          desliza na horizontal para percorrer mais de 4000 anos.
        </p>
      </header>
      <TimelineChart characters={characters} eras={eras} />
    </div>
  );
}
