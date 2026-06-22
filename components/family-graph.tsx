"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Character, Era, Relationship } from "@/lib/db/schema";
import { axisYear, formatLifeRange } from "@/lib/format";
import { PersonNode } from "@/components/person-node";

const nodeTypes = { person: PersonNode };

const NODE_W = 150;
const LANE_H = 62;
const BAND_GAP = 58;
const GAP_X = 26;
const SCALE_X = 1.7;

const EDGE_KIND: Record<
  string,
  { stroke: string; dashed?: boolean; dotted?: boolean; arrow?: boolean; label: string }
> = {
  parent: { stroke: "#7c8598", arrow: true, label: "filiação" },
  ancestor: { stroke: "#7c8598", dashed: true, arrow: true, label: "linhagem" },
  spouse: { stroke: "#e11d48", label: "casamento" },
  sibling: { stroke: "#52607a", dotted: true, label: "irmãos" },
  adoptive: { stroke: "#059669", dashed: true, arrow: true, label: "adoção" },
  relative: { stroke: "#52607a", dotted: true, label: "familiar" },
};

export function FamilyGraph({
  characters,
  relationships,
  eras,
}: {
  characters: Character[];
  relationships: Relationship[];
  eras: Era[];
}) {
  const router = useRouter();

  const { initialNodes, initialEdges } = useMemo(() => {
    const minB = Math.min(...characters.map((c) => axisYear(c.birthYear ?? 0)));
    const colorOf = (slug: string) =>
      eras.find((e) => e.slug === slug)?.color ?? "#64748b";

    const nodes: Node[] = [];
    let bandTop = 0;

    for (const era of eras) {
      const chars = characters
        .filter((c) => c.era === era.slug)
        .sort((a, b) => axisYear(a.birthYear ?? 0) - axisYear(b.birthYear ?? 0));
      if (chars.length === 0) continue;

      const laneRight: number[] = [];
      let maxLane = 0;

      for (const c of chars) {
        const nx = (axisYear(c.birthYear ?? 0) - minB) * SCALE_X;
        let lane = laneRight.findIndex((r) => r + GAP_X <= nx);
        if (lane === -1) {
          lane = laneRight.length;
          laneRight.push(0);
        }
        laneRight[lane] = nx + NODE_W;
        maxLane = Math.max(maxLane, lane);

        nodes.push({
          id: c.slug,
          type: "person",
          position: { x: nx, y: bandTop + lane * LANE_H },
          width: NODE_W,
          height: 46,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: {
            label: c.name,
            years: formatLifeRange(c.birthYear, c.deathYear, c.dateApprox),
            role: c.role,
            color: colorOf(c.era),
          },
        });
      }
      bandTop += (maxLane + 1) * LANE_H + BAND_GAP;
    }

    const ids = new Set(nodes.map((n) => n.id));
    const edges: Edge[] = relationships
      .filter((r) => ids.has(r.fromSlug) && ids.has(r.toSlug))
      .map((r) => {
        const kind = EDGE_KIND[r.type] ?? EDGE_KIND.relative;
        return {
          id: `${r.fromSlug}-${r.toSlug}-${r.type}`,
          source: r.fromSlug,
          target: r.toSlug,
          type: "smoothstep",
          animated: false,
          style: {
            stroke: kind.stroke,
            strokeWidth: 1.5,
            strokeDasharray: kind.dashed ? "6 4" : kind.dotted ? "2 3" : undefined,
            opacity: 0.7,
          },
          markerEnd: kind.arrow
            ? { type: MarkerType.ArrowClosed, color: kind.stroke, width: 14, height: 14 }
            : undefined,
        };
      });

    return { initialNodes: nodes, initialEdges: edges };
  }, [characters, relationships, eras]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      router.push(`/personagem/${node.id}`);
    },
    [router],
  );

  return (
    <div className="h-[78vh] w-full overflow-hidden rounded-2xl border border-border-soft bg-ink/40">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.08}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        edgesFocusable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#1c2533" />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => (n.data as { color?: string })?.color ?? "#64748b"}
          maskColor="rgba(10,13,19,0.7)"
          style={{ backgroundColor: "#111722", border: "1px solid #25303f" }}
        />
        <Panel position="top-left">
          <div className="rounded-lg border border-border-soft bg-surface/90 p-3 backdrop-blur">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-faint">
              Como ler
            </p>
            <ul className="space-y-1 text-[11px] text-muted">
              <li>← esquerda = mais antigo · → direita = mais recente</li>
              <li>cada faixa horizontal é uma era</li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-px w-5" style={{ background: "#7c8598" }} />
                filiação
              </li>
              <li className="flex items-center gap-1.5">
                <span
                  className="inline-block h-px w-5"
                  style={{ background: "#7c8598", borderTop: "1px dashed #7c8598" }}
                />
                linhagem (gerações omitidas)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block h-px w-5" style={{ background: "#e11d48" }} />
                casamento
              </li>
            </ul>
            <p className="mt-2 text-[10px] text-faint">Clica num nó para estudar.</p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
