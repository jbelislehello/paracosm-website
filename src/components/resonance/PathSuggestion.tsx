import { ArrowRight, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AXIS_LABEL,
  type CalmMagicAxis,
  type ResonanceMapData,
} from "@/lib/resonance";

// Map dominant Calm Magic axes to the two homepage paths
const AXIS_TO_PATH: Record<
  CalmMagicAxis,
  "ai-leadership" | "relational-coaching"
> = {
  MAGIC: "ai-leadership",
  OPEN: "ai-leadership",
  FREE: "ai-leadership",
  LOVE: "relational-coaching",
  CALM: "relational-coaching",
};

const PATHS = {
  "ai-leadership": {
    title: "AI Leadership",
    blurb:
      "Build the agentic ecosystem, governance, and intentional architecture your organization needs.",
    href: "/agentic-ux",
    icon: Zap,
    gradient: "from-blue-600 to-purple-600",
  },
  "relational-coaching": {
    title: "Relational Coaching",
    blurb:
      "Care, regulation, and rigor — work the human stakes through Calm Magic team coaching.",
    href: "/calm-magic-assistant",
    icon: Heart,
    gradient: "from-rose-600 to-purple-600",
  },
} as const;

export default function PathSuggestion({ data }: { data: ResonanceMapData }) {
  // Tally votes per path, weighted by axis score
  const tally = { "ai-leadership": 0, "relational-coaching": 0 };
  const supporting: Record<string, CalmMagicAxis[]> = {
    "ai-leadership": [],
    "relational-coaching": [],
  };
  for (const a of data.axes) {
    const key = AXIS_TO_PATH[a.axis];
    tally[key] += a.score;
    if (a.score >= 50) supporting[key].push(a.axis);
  }

  const ranked = (Object.keys(tally) as Array<keyof typeof tally>).sort(
    (a, b) => tally[b] - tally[a],
  );
  const primary = PATHS[ranked[0]];
  const secondary = PATHS[ranked[1]];
  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Where this question wants to go
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Based on the board reading, your question resonates most with one of
        Paracosm's two main paths.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {/* Primary suggestion */}
        <div className="rounded-xl border border-primary/40 bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${primary.gradient} flex items-center justify-center text-white`}
            >
              <PrimaryIcon className="w-4 h-4" />
            </div>
            <Badge variant="secondary" className="text-[10px]">
              recommended
            </Badge>
          </div>
          <h3 className="text-sm font-bold">{primary.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {primary.blurb}
          </p>
          {supporting[ranked[0]].length > 0 && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Strong on:{" "}
              {supporting[ranked[0]]
                .map((a) => AXIS_LABEL[a])
                .join(" · ")}
            </p>
          )}
          <Link to={primary.href} className="mt-3 inline-block">
            <Button size="sm" className="gap-1.5">
              Explore this path
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Secondary */}
        <div className="rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${secondary.gradient} flex items-center justify-center text-white opacity-80`}
            >
              <SecondaryIcon className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              also relevant
            </span>
          </div>
          <h3 className="text-sm font-bold">{secondary.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {secondary.blurb}
          </p>
          <Link to={secondary.href} className="mt-3 inline-block">
            <Button size="sm" variant="outline" className="gap-1.5">
              See this path
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
