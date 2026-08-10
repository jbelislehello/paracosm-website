import type { DimensionScore, Lang, RelationalDimension } from "@/lib/relational/types";

interface Props {
  dimension: RelationalDimension;
  score: DimensionScore;
  lang: Lang;
}

function Bar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function DimensionResultCard({ dimension, score, lang }: Props) {
  const fr = lang === "fr";
  return (
    <div
      className="rounded-2xl border border-border p-5"
      style={{ backgroundColor: `${dimension.color}0A` }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg" style={{ color: dimension.color }}>
          {dimension.name[lang]}
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {score.answered}/{score.total}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{dimension.blurb[lang]}</p>

      <div className="mt-4 space-y-3">
        <Bar value={score.self} color={dimension.color} label={fr ? "Moi" : "Me"} />
        <Bar value={score.team} color={dimension.color} label={fr ? "Mon équipe" : "My team"} />
      </div>

      <div className="mt-4 border-t border-border/60 pt-3">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {fr ? "Écart" : "Gap"} {score.gap > 0 ? "+" : ""}
          {score.gap}
        </div>
        <div className="mt-1 text-sm font-medium">{score.reading.label[lang]}</div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {score.reading.signal[lang]}
        </p>
      </div>

      {score.composite < 70 && score.answered > 0 && (
        <div className="mt-4 border-t border-border/60 pt-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {fr ? "À essayer ensuite" : "Try next"}
          </div>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {dimension.practices[lang].map((p, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: dimension.color }}>·</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
