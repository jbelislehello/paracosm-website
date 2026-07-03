import { Check } from "lucide-react";
import { useReaderProgress } from "@/hooks/useReaderProgress";
import { cn } from "@/lib/utils";
import { editorialTone, editorialType } from "@/components/editorial/editorialTokens";

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
  const t = editorialTone.warm;

  return (
    <div className={cn("border-t border-b border-current/20 py-5", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <div className={cn(editorialType.kicker, t.kicker)}>
            Your reading journey
          </div>
          {!compact && (
            <div className="mt-1 text-sm opacity-70">
              {completed === 0
                ? "Begin with any phase below."
                : completed === PHASES.length
                  ? "Full breath cycle completed."
                  : `${completed} of ${PHASES.length} phases entered`}
            </div>
          )}
        </div>
        <div className={cn(editorialType.serif, "text-2xl leading-none tabular-nums", t.numeral)}>{pct}%</div>
      </div>

      <div className="mb-4 h-px w-full bg-current/15 relative">
        <div
          className={cn("absolute inset-y-0 left-0 h-px", "bg-current/70")}
          style={{ width: `${pct}%` }}
          aria-label={`${pct}% of phases read`}
        />
      </div>

      <ol className="grid grid-cols-8 gap-2">
        {PHASES.map((p) => {
          const done = readPhases.includes(p.key);
          return (
            <li
              key={p.key}
              className={cn(
                "flex flex-col items-center gap-1.5 py-1 transition-colors",
                editorialType.caption,
                done ? t.kicker : "opacity-40",
              )}
              aria-current={done ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  done ? cn("border", t.accentBorder) : "border border-current/30",
                )}
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
