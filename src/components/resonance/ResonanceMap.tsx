import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  AXIS_BLURB,
  AXIS_LABEL,
  AXIS_ORDER,
  type ResonanceMapData,
} from "@/lib/resonance";

interface ResonanceMapProps {
  data: ResonanceMapData;
  onTileClick?: (tileId: number) => void;
}

const AXIS_BAR_CLASS: Record<string, string> = {
  MAGIC: "bg-primary",
  LOVE: "bg-accent",
  CALM: "bg-muted-foreground",
  OPEN: "bg-foreground/70",
  FREE: "bg-primary/70",
};

export default function ResonanceMap({ data, onTileClick }: ResonanceMapProps) {
  const ranked = [...data.axes].sort((a, b) => b.score - a.score);
  const rankByAxis = new Map(ranked.map((a, i) => [a.axis, i + 1]));

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Resonance map
        </p>
        <p className="mt-1 text-sm italic text-foreground">
          “{data.question}”
        </p>
      </div>

      <div className="space-y-4">
        {AXIS_ORDER.map((axisKey) => {
          const a = data.axes.find((x) => x.axis === axisKey);
          if (!a) return null;
          const rank = rankByAxis.get(axisKey) ?? 5;
          const isTop = rank === 1;
          return (
            <div key={axisKey}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold tracking-wide text-foreground">
                    {AXIS_LABEL[axisKey]}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                    {AXIS_BLURB[axisKey]}
                  </span>
                  {isTop && (
                    <Badge variant="secondary" className="text-[10px]">
                      dominant
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-mono text-foreground">
                  {a.score}
                </span>
              </div>

              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, a.score))}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    AXIS_BAR_CLASS[axisKey] ?? "bg-primary"
                  }`}
                />
              </div>

              {(a.tiles.length > 0 || a.tile_hints.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.tiles.length > 0
                    ? a.tiles.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onTileClick?.(t.id)}
                          className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          {t.prompt}
                        </button>
                      ))
                    : a.tile_hints.map((h, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-dashed border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {h}
                        </span>
                      ))}
                </div>
              )}

              {a.rationale && (
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {a.rationale}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
