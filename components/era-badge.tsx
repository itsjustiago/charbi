import { eraColor, eraName } from "@/lib/eras";

export function EraBadge({ slug, className = "" }: { slug: string; className?: string }) {
  const color = eraColor(slug);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{
        color,
        backgroundColor: `${color}1a`,
        boxShadow: `inset 0 0 0 1px ${color}40`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {eraName(slug)}
    </span>
  );
}
