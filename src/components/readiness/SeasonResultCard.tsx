import { cn } from "@/lib/utils";
import type { Season, SeasonScore } from "@/lib/readiness/types";

const READINESS_STYLE: Record<string, string> = {
  high: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  low: "bg-rose-500/15 text-rose-600 border-rose-500/30",
};

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function SeasonResultCard({
  season,
  score,
}: {
  season: Season;
  score: SeasonScore;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: season.color }}
          >
            {season.season} · {season.axis}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{season.description}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
            READINESS_STYLE[score.interpretation.aiReadiness],
          )}
        >
          {score.interpretation.label}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Meter label="Personal readiness" value={score.personal} color={season.color} />
        <Meter label="Organizational maturity" value={score.organizational} color={season.color} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <div>
          Gap
          <div className="mt-0.5 font-mono text-lg text-foreground">
            {score.gap > 0 ? "+" : ""}
            {score.gap}
          </div>
        </div>
        <div>
          Composite
          <div className="mt-0.5 font-mono text-lg text-foreground">{score.composite}</div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {score.interpretation.signal}
      </p>
    </div>
  );
}
