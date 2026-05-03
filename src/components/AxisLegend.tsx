import { AXIS_ORDER, AXIS_LABEL, AXIS_BLURB } from "@/lib/resonance";

const AXIS_ACCENT: Record<(typeof AXIS_ORDER)[number], string> = {
  MAGIC: "from-fuchsia-500 to-purple-600",
  LOVE: "from-rose-500 to-pink-600",
  CALM: "from-teal-500 to-blue-600",
  OPEN: "from-amber-500 to-orange-600",
  FREE: "from-emerald-500 to-lime-600",
};

interface AxisLegendProps {
  intro?: string;
  compact?: boolean;
}

export default function AxisLegend({ intro, compact = false }: AxisLegendProps) {
  return (
    <div className="space-y-3">
      {intro && (
        <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
          {intro}
        </p>
      )}
      <div
        className={`grid gap-2 ${
          compact ? "grid-cols-5" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
        }`}
      >
        {AXIS_ORDER.map((axis) => (
          <div
            key={axis}
            className="rounded-xl border border-border bg-card/60 p-3 text-center hover:border-primary/40 transition-colors"
          >
            <div
              className={`mx-auto mb-2 h-1.5 w-10 rounded-full bg-gradient-to-r ${AXIS_ACCENT[axis]}`}
            />
            <div className="text-xs font-bold tracking-wider">
              {AXIS_LABEL[axis].toUpperCase()}
            </div>
            {!compact && (
              <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                {AXIS_BLURB[axis]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
