import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  WILD_COOKIE_COMPASSES,
  STAGE_LABELS,
  type CompassStage,
  type WildCookieCompass,
} from "@/data/wildCookieCompasses";
import type { TopologyViewMode } from "./ViewModeSelector";
import type { BoardTabSlug } from "@/data/originsToTopology";

interface Props {
  stageFilter: CompassStage | "all";
  selectedOriginSlug: string | null;
  onHoverCompass: (slugs: string[] | null) => void;
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug) => void;
}

const STAGE_ORDER: CompassStage[] = [
  "explore",
  "frame",
  "ideate",
  "vision",
  "design",
  "ship",
];

export function WildCookieFramingBand({
  stageFilter,
  selectedOriginSlug,
  onHoverCompass,
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: Props) {
  const visible = WILD_COOKIE_COMPASSES.filter(
    (c) => stageFilter === "all" || c.stage === stageFilter,
  );

  const grouped = STAGE_ORDER.map((stage) => ({
    stage,
    items: visible.filter((c) => c.stage === stage),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-base font-semibold tracking-tight md:text-lg">
          Frame your idea — Wild Cookie compasses
        </h3>
        <p className="mx-auto mt-1 max-w-xl text-xs text-muted-foreground">
          Pick the lens that matches where you are. Each one routes to its
          closest executable surface on the board.
        </p>
      </div>

      {grouped.map((g) => (
        <section key={g.stage}>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {STAGE_LABELS[g.stage]}
            </Badge>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((c) => (
              <CompassCard
                key={c.slug}
                compass={c}
                relatedSelected={
                  !!selectedOriginSlug &&
                  c.relatesToOriginSlugs.includes(selectedOriginSlug)
                }
                onHover={onHoverCompass}
                onSwitchTopologyMode={onSwitchTopologyMode}
                onSwitchBoardTab={onSwitchBoardTab}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CompassCard({
  compass,
  relatedSelected,
  onHover,
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: {
  compass: WildCookieCompass;
  relatedSelected: boolean;
  onHover: (slugs: string[] | null) => void;
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug) => void;
}) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[compass.icon] ?? Icons.Compass;
  const r = compass.routesTo;

  const handleRoute = () => {
    if (r.kind === "topology") onSwitchTopologyMode(r.mode);
    else if (r.kind === "board") onSwitchBoardTab?.(r.tab);
  };

  const cta =
    r.kind === "external" ? (
      <Link
        to={r.to}
        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Route to → {r.label}
        <ArrowRight className="h-3 w-3" />
      </Link>
    ) : (
      <button
        type="button"
        onClick={handleRoute}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
          r.kind === "topology"
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "bg-secondary hover:bg-secondary/80",
        )}
      >
        Route to → {r.label}
        <ArrowRight className="h-3 w-3" />
      </button>
    );

  return (
    <Card
      onMouseEnter={() => onHover(compass.relatesToOriginSlugs)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "space-y-2 border p-3 transition-colors",
        relatedSelected
          ? "border-primary/60 bg-primary/5"
          : "border-border/60 bg-card/60 hover:border-border",
      )}
    >
      <div className="flex items-start gap-2">
        <span className="rounded-md bg-secondary p-1.5">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold leading-tight">{compass.name}</h4>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            {compass.description}
          </p>
        </div>
      </div>
      <blockquote className="border-l-2 border-border/60 pl-2 text-[10px] italic leading-snug text-muted-foreground">
        "{compass.quote}"
        <span className="ml-1 not-italic opacity-70">— {compass.attribution}</span>
      </blockquote>
      <p className="text-[10px] text-muted-foreground">
        <span className="font-semibold">When:</span> {compass.timing}
      </p>
      <div className="pt-1">{cta}</div>
    </Card>
  );
}
