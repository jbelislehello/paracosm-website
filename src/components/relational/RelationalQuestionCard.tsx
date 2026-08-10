import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { RELATIONAL_SCALE } from "@/lib/relational/data";
import type { Lang, RelationalAnswer, RelationalQuestion } from "@/lib/relational/types";

interface Props {
  question: RelationalQuestion;
  index: number;
  total: number;
  answer: RelationalAnswer | undefined;
  onChange: (next: RelationalAnswer) => void;
  color: string;
  lang: Lang;
  openPrompt?: string;
  showOpen?: boolean;
}

function LensRow({
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
      <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color }}>
        {label}
      </span>
      <p className="text-sm text-foreground">{question}</p>
      <div className="grid grid-cols-5 gap-1.5">
        {labels.map((l, i) => {
          const selected = value === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={selected}
              className={cn(
                "rounded-lg border px-2 py-2 text-[11px] leading-tight transition-colors",
                selected
                  ? "border-transparent text-background"
                  : "border-border bg-background/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
              style={selected ? { backgroundColor: color } : undefined}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RelationalQuestionCard({
  question,
  index,
  total,
  answer,
  onChange,
  color,
  lang,
  openPrompt,
  showOpen,
}: Props) {
  const scale = RELATIONAL_SCALE[lang];
  const current: RelationalAnswer = answer ?? { self: -1, team: -1 };
  const fr = lang === "fr";

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>
          {fr ? "Question" : "Question"} {index + 1} / {total}
        </span>
        {current.self >= 0 && current.team >= 0 && (
          <span style={{ color }}>{fr ? "Répondu" : "Answered"}</span>
        )}
      </div>

      <div className="space-y-5">
        <LensRow
          label={fr ? "Moi" : "Me"}
          question={question.self[lang]}
          labels={scale}
          value={current.self}
          onSelect={(i) => onChange({ ...current, self: i })}
          color={color}
        />
        <LensRow
          label={fr ? "Mon équipe" : "My team"}
          question={question.team[lang]}
          labels={scale}
          value={current.team}
          onSelect={(i) => onChange({ ...current, team: i })}
          color={color}
        />
      </div>

      {showOpen && openPrompt && (
        <div className="mt-5 border-t border-border pt-4">
          <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {fr ? "Optionnel" : "Optional"} — {openPrompt}
          </label>
          <Textarea
            className="mt-2 min-h-[70px] text-sm"
            value={current.openText ?? ""}
            onChange={(e) => onChange({ ...current, openText: e.target.value })}
            placeholder={fr ? "Écrivez librement…" : "Write freely…"}
          />
        </div>
      )}
    </div>
  );
}
