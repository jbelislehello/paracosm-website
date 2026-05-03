import { Sparkles, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLastResonance } from "@/hooks/useLastResonance";
import { AXIS_LABEL, type CalmMagicAxis } from "@/lib/resonance";

type Lens = "method" | "board" | "leadership" | "coaching" | "design-system";

const AXIS_ACCENT: Record<CalmMagicAxis, string> = {
  MAGIC: "from-fuchsia-500 to-purple-600",
  LOVE: "from-rose-500 to-pink-600",
  CALM: "from-teal-500 to-blue-600",
  OPEN: "from-amber-500 to-orange-600",
  FREE: "from-emerald-500 to-lime-600",
};

function lensCopy(lens: Lens, topAxis: CalmMagicAxis): string {
  const label = AXIS_LABEL[topAxis];
  switch (lens) {
    case "method":
      return "Here's how Ask → Map → Invent → Ship turns this exact question into shipped software.";
    case "board":
      return "The board below is the same one your question landed on. Open the dominant axis to see why.";
    case "leadership":
      return `AI Leadership meets your question on the ${label} axis — governance and intentional architecture.`;
    case "coaching":
      return `Relational coaching meets your question on the ${label} axis — the human stakes underneath.`;
    case "design-system":
      return "The mental models and journey below are organized by the same five axes that scored your question.";
  }
}

interface WhyItWorksRecapProps {
  lens: Lens;
  homeHash?: string;
}

export default function WhyItWorksRecap({
  lens,
  homeHash = "#framework-hero",
}: WhyItWorksRecapProps) {
  const { data, clear } = useLastResonance();
  if (!data) return null;

  const sorted = [...data.axes].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, 2);
  const topAxis = top[0]?.axis;
  if (!topAxis) return null;

  return (
    <section className="px-4 py-6">
      <div className="container max-w-5xl mx-auto">
        <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5 md:p-6 shadow-sm">
          <button
            onClick={clear}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss recap"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1 text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Why it works for you
            </Badge>
          </div>

          <p className="text-xs uppercase tracking-wider text-muted-foreground">You asked</p>
          <p className="mt-1 text-sm md:text-base font-medium italic text-foreground">
            "{data.question}"
          </p>

          <p className="mt-4 text-sm text-foreground/80">{lensCopy(lens, topAxis)}</p>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {top.map((a) => (
              <div
                key={a.axis}
                className="rounded-xl border border-border bg-background/60 p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-6 rounded-full bg-gradient-to-r ${AXIS_ACCENT[a.axis]}`}
                    />
                    <span className="text-xs font-bold tracking-wider">
                      {AXIS_LABEL[a.axis].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {a.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {a.rationale}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link to={`/${homeHash}`}>
              <Button size="sm" variant="outline" className="gap-1.5">
                Ask a different question
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
