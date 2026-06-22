"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export type PersonNodeData = {
  label: string;
  years: string;
  role: string;
  color: string;
};

function PersonNodeImpl({ data, selected }: NodeProps) {
  const d = data as PersonNodeData;
  return (
    <div
      className="w-[150px] cursor-pointer rounded-lg border bg-surface px-3 py-2 shadow-sm transition-all hover:bg-surface-2"
      style={{
        borderColor: selected ? d.color : "var(--color-border)",
        borderLeft: `3px solid ${d.color}`,
        boxShadow: selected ? `0 0 0 2px ${d.color}` : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <p className="truncate text-[13px] font-semibold leading-tight text-fg">
        {d.label}
      </p>
      <p className="truncate font-mono text-[9px] text-faint">{d.years}</p>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

export const PersonNode = memo(PersonNodeImpl);
