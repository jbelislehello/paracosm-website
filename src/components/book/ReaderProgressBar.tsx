import { Check } from "lucide-react";
import { useReaderProgress } from "@/hooks/useReaderProgress";

const PHASES = [
  { key: "GLITCH", label: "GL!TCH" },
  { key: "DRIFT", label: "Drift" },
  { key: "TUNE", label: "Tune" },
  { key: "LOVE", label: "Love" },
  { key: "MAGIC", label: "Magic" },
  { key: "CALM", label: "Calm" },
  { key: "OPEN", label: "Open" },
  { key: "FREE", label: "Free" },
];

interface Props {
  compact?: boolean;
  className?: string;
}

export default function ReaderProgressBar({ compact = false, className = "" }: Props) {
  const { readPhases } = useReaderProgress();
  const completed = readPhases.length;
  const pct = Math.round((completed / PHASES.length) * 100);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[hsl(var(--bloom-magenta)/0.25)] bg-[hsl(var(--bloom-violet)/0.18)] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="font-vhs text-xs uppercase tracking-[0.3em] text-[hsl(var(--bloom-amber))]">
            ▶ Your reading journey
          </div>
          {!compact && (
            <div className="mt-0.5 font-tight text-sm text-white/80">
              {completed === 0
                ? "Begin with any phase below."
                : completed === PHASES.length
                  ? "Full breath cycle completed."
                  : `${completed} of ${PHASES.length} phases entered`}
            </div>
          )}
        </div>
        <div className="font-display text-base text-[hsl(var(--bloom-cream))]">{pct}%</div>
      </div>

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--bloom-magenta))] via-[hsl(var(--bloom-amber))] to-[hsl(var(--bloom-teal))] transition-all duration-500"
          style={{ width: `${pct}%` }}
          aria-label={`${pct}% of phases read`}
        />
      </div>

      <ol className="grid grid-cols-8 gap-1.5">
        {PHASES.map((p) => {
          const done = readPhases.includes(p.key);
          return (
            <li
              key={p.key}
              className={`flex flex-col items-center gap-1 rounded-md px-1 py-1.5 font-vhs text-[11px] uppercase tracking-widest transition-colors ${
                done
                  ? "bg-[hsl(var(--bloom-magenta)/0.2)] text-[hsl(var(--bloom-cream))]"
                  : "bg-white/[0.02] text-white/40"
              }`}
              aria-current={done ? "step" : undefined}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                  done
                    ? "bg-[hsl(var(--bloom-amber))] text-[hsl(var(--bloom-ink))]"
                    : "border border-white/15 bg-transparent"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : null}
              </span>
              <span className="truncate">{p.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
