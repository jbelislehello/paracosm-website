import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { Tile, TileAnswer } from "@/lib/readiness/types";

interface Props {
  tile: Tile;
  index: number;
  total: number;
  answer: TileAnswer | undefined;
  onChange: (next: TileAnswer) => void;
  seasonColor: string;
}

function AxisRow({
  label,
  question,
  labels,
  value,
  onSelect,
  color,
}: {
  label: string;
  question: string;
  labels: string[];
  value: number;
  onSelect: (i: number) => void;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          style={{ color }}
        >
          {label}
        </span>
      </div>
      <p className="text-sm text-foreground">{question}</p>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
        {labels.map((l, i) => {
          const selected = value === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                "rounded-lg border px-2 py-2 text-[11px] leading-tight text-left transition-colors",
                selected
                  ? "border-transparent text-primary-foreground shadow-sm"
                  : "border-border bg-card hover:border-foreground/40",
              )}
              style={selected ? { backgroundColor: color } : undefined}
              aria-pressed={selected}
            >
              <span className="block font-medium">{i + 1}</span>
              <span className="mt-0.5 block opacity-80">{l}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TileQuestionCard({
  tile,
  index,
  total,
  answer,
  onChange,
  seasonColor,
}: Props) {
  const cur: TileAnswer = answer ?? { personal: -1, organizational: -1 };
  const zoneLabel =
    tile.zone === "inner" ? "Inner Core · ×3" : tile.zone === "stretch" ? "Stretch · ×2" : "Edge · ×1";

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          Tile {index + 1} / {total}
        </span>
        <span className="opacity-40">·</span>
        <span className="font-mono">{tile.tileCode}</span>
        <span className="opacity-40">·</span>
        <span>{tile.row.full}</span>
        <span className="opacity-40">×</span>
        <span>{tile.col.full}</span>
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-[10px] tracking-wider"
          style={{ backgroundColor: `${seasonColor}22`, color: seasonColor }}
        >
          {zoneLabel}
        </span>
      </div>

      <div className="mt-5 space-y-6">
        <AxisRow
          label="Personal"
          question={tile.personal.question}
          labels={tile.personal.labels}
          value={cur.personal}
          onSelect={(i) => onChange({ ...cur, personal: i })}
          color={seasonColor}
        />
        <AxisRow
          label="Organizational"
          question={tile.organizational.question}
          labels={tile.organizational.labels}
          value={cur.organizational}
          onSelect={(i) => onChange({ ...cur, organizational: i })}
          color={seasonColor}
        />

        {tile.open && (
          <div className="space-y-2 rounded-xl border border-dashed border-border bg-background/40 p-3">
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: seasonColor }}
            >
              Open reflection
            </span>
            <p className="text-sm text-foreground">{tile.open.question}</p>
            <Textarea
              value={cur.openText ?? ""}
              onChange={(e) => onChange({ ...cur, openText: e.target.value })}
              rows={3}
              placeholder="Write what surfaces…"
              className="resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
