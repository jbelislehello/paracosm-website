import { useMemo, useState } from "react";
import { ArrowRight, Compass as CompassIcon, Check } from "lucide-react";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORIGIN_METHODS, type OriginMethod } from "@/data/origins";
import {
  TOPOLOGY_ANCESTRY,
  BOARD_TAB_ANCESTRY,
  type BoardTabSlug,
} from "@/data/originsToTopology";
import {
  WILD_COOKIE_COMPASSES,
  STAGE_LABELS,
  type CompassStage,
  type WildCookieCompass,
} from "@/data/wildCookieCompasses";
import type { TopologyViewMode } from "./ViewModeSelector";
import { cn } from "@/lib/utils";

interface OriginsAncestryViewProps {
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug | "matrix") => void;
}

type Target =
  | { kind: "topology"; mode: TopologyViewMode; label: string }
  | { kind: "board"; tab: BoardTabSlug; label: string }
  | { kind: "external"; to: string; label: string };

function originTargets(slug: string): Target[] {
  const out: Target[] = [];
  (Object.entries(TOPOLOGY_ANCESTRY) as [TopologyViewMode, { slug: string }][]).forEach(
    ([mode, origin]) => {
      if (origin?.slug === slug)
        out.push({ kind: "topology", mode, label: `Topology · ${mode}` });
    },
  );
  (Object.entries(BOARD_TAB_ANCESTRY) as [BoardTabSlug, { slug: string }][]).forEach(
    ([tab, origin]) => {
      if (origin.slug === slug) out.push({ kind: "board", tab, label: tab });
    },
  );
  if (slug === "interaction-patterns-2017") {
    out.push({ kind: "external", to: "/pattern-encyclopedia", label: "Pattern Encyclopedia" });
    out.push({ kind: "external", to: "/tonalli", label: "Tonalli Spatial" });
  }
  if (slug === "ux-process-2018") {
    out.push({ kind: "external", to: "/agentic-ecosystem-deck", label: "AI Observatory" });
  }
  if (slug === "zen-flow-retreats-2018") {
    out.push({ kind: "external", to: "/paracosm-retreat", label: "Paracosm Retreat" });
  }
  if (slug === "applied-poetry-2016") {
    out.push({ kind: "external", to: "/tonalli", label: "Tonalli (Voice & Spatial)" });
  }
  return out;
}

const STAGES: (CompassStage | "all")[] = [
  "all",
  "explore",
  "frame",
  "ideate",
  "vision",
  "design",
  "ship",
];

type Family = "all" | "origin" | "thematic";

export function OriginsAncestryView({
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: OriginsAncestryViewProps) {
  const [stageFilter, setStageFilter] = useState<CompassStage | "all">("all");
  const [familyFilter, setFamilyFilter] = useState<Family>("all");

  // Origin compasses don't carry an explicit "stage" — only filter when family is origin/all
  const showOrigins = familyFilter !== "thematic";
  const showThematic = familyFilter !== "origin";

  const thematic = useMemo(
    () =>
      WILD_COOKIE_COMPASSES.filter(
        (c) => stageFilter === "all" || c.stage === stageFilter,
      ),
    [stageFilter],
  );

  return (
    <div className="h-full overflow-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="text-center">
          <Badge variant="outline" className="mb-3 gap-1.5">
            <CompassIcon className="h-3 w-3" />
            Compasses
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            The compasses this board runs on
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Two families, one ontology. Pick a compass to route the canvas to
            its closest executable surface — a topology view, a board tab, or
            an adjacent tool.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Family:
            </span>
            {(["all", "origin", "thematic"] as Family[]).map((f) => (
              <Button
                key={f}
                variant={familyFilter === f ? "default" : "outline"}
                size="sm"
                className="h-7 px-2.5 text-[11px] capitalize"
                onClick={() => setFamilyFilter(f)}
              >
                {f === "all" ? "All" : f}
              </Button>
            ))}
          </div>
          {showThematic && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stage:
              </span>
              {STAGES.map((s) => (
                <Button
                  key={s}
                  variant={stageFilter === s ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2.5 text-[11px]"
                  onClick={() => setStageFilter(s)}
                >
                  {s === "all" ? "All" : STAGE_LABELS[s as CompassStage]}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Origin compasses */}
        {showOrigins && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                Origin compasses
              </Badge>
              <div className="h-px flex-1 bg-border/60" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ORIGIN_METHODS.map((o) => (
                <OriginCard
                  key={o.slug}
                  origin={o}
                  onSwitchTopologyMode={onSwitchTopologyMode}
                  onSwitchBoardTab={onSwitchBoardTab}
                />
              ))}
            </div>
          </section>
        )}

        {/* Thematic compasses */}
        {showThematic && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                Thematic compasses
              </Badge>
              <div className="h-px flex-1 bg-border/60" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {thematic.map((c) => (
                <ThematicCard
                  key={c.slug}
                  compass={c}
                  onSwitchTopologyMode={onSwitchTopologyMode}
                  onSwitchBoardTab={onSwitchBoardTab}
                />
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            to="/origins"
            className="text-xs font-medium text-primary hover:underline"
          >
            Open the full Origins gallery →
          </Link>
        </div>
      </div>
    </div>
  );
}

function OriginCard({
  origin,
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: {
  origin: OriginMethod;
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug | "matrix") => void;
}) {
  const targets = originTargets(origin.slug);
  return (
    <Card className="overflow-hidden border-border/60 bg-card/60">
      <div className="h-28 w-full overflow-hidden bg-muted">
        <img
          src={origin.image}
          alt={`${origin.title} sketch`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 p-3">
        <h3 className="text-xs font-semibold leading-tight">{origin.title}</h3>
        {origin.subtitle && (
          <p className="text-[11px] italic text-muted-foreground">{origin.subtitle}</p>
        )}
        <p className="line-clamp-3 text-[11px] leading-snug text-muted-foreground">
          {origin.blurb}
        </p>
        {targets.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {targets.map((t, i) => (
              <TargetChip
                key={i}
                target={t}
                onSwitchTopologyMode={onSwitchTopologyMode}
                onSwitchBoardTab={onSwitchBoardTab}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function ThematicCard({
  compass,
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: {
  compass: WildCookieCompass;
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug | "matrix") => void;
}) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[compass.icon] ?? Icons.Compass;

  return (
    <Card className="space-y-2 border border-border/60 bg-card/60 p-3 transition-colors hover:border-border">
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
        <Badge variant="outline" className="text-[9px] uppercase">
          {STAGE_LABELS[compass.stage]}
        </Badge>
      </div>
      <p className="text-[10px] text-muted-foreground">
        <span className="font-semibold">When:</span> {compass.timing}
      </p>
      <div className="pt-1">
        <TargetChip
          target={compass.routesTo}
          onSwitchTopologyMode={onSwitchTopologyMode}
          onSwitchBoardTab={onSwitchBoardTab}
        />
      </div>
    </Card>
  );
}

function TargetChip({
  target,
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: {
  target: Target;
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug | "matrix") => void;
}) {
  if (target.kind === "topology") {
    return (
      <button
        type="button"
        onClick={() => onSwitchTopologyMode(target.mode)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20",
        )}
      >
        {target.label}
        <ArrowRight className="h-3 w-3" />
      </button>
    );
  }
  if (target.kind === "board") {
    return (
      <button
        type="button"
        onClick={() => onSwitchBoardTab?.(target.tab)}
        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-secondary/80"
      >
        {target.label}
        <ArrowRight className="h-3 w-3" />
      </button>
    );
  }
  return (
    <Link
      to={target.to}
      className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {target.label}
      <ArrowRight className="h-3 w-3" />
    </Link>
  );
}
