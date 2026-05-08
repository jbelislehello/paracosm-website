import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
} from "@/data/wildCookieCompasses";
import type { TopologyViewMode } from "./ViewModeSelector";
import { AncestryArc } from "./AncestryArc";
import { WildCookieFramingBand } from "./WildCookieFramingBand";
import { cn } from "@/lib/utils";

interface OriginsAncestryViewProps {
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  onSwitchBoardTab?: (tab: BoardTabSlug | "matrix") => void;
}

type Target =
  | { kind: "topology"; mode: TopologyViewMode; label: string }
  | { kind: "board"; tab: BoardTabSlug; label: string }
  | { kind: "external"; to: string; label: string };

function targetsFor(slug: string): Target[] {
  const out: Target[] = [];
  (Object.entries(TOPOLOGY_ANCESTRY) as [TopologyViewMode, { slug: string }][]).forEach(
    ([mode, origin]) => {
      if (origin?.slug === slug)
        out.push({ kind: "topology", mode, label: `Topologies → ${mode}` });
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

export function OriginsAncestryView({
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: OriginsAncestryViewProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoverHighlight, setHoverHighlight] = useState<string[] | null>(null);
  const [stageFilter, setStageFilter] = useState<CompassStage | "all">("all");

  const selected: OriginMethod | null = useMemo(
    () => ORIGIN_METHODS.find((o) => o.slug === selectedSlug) ?? null,
    [selectedSlug],
  );

  const relatedCompasses = useMemo(
    () =>
      selected
        ? WILD_COOKIE_COMPASSES.filter((c) =>
            c.relatesToOriginSlugs.includes(selected.slug),
          )
        : [],
    [selected],
  );

  const highlightedSlugs = useMemo(
    () => new Set(hoverHighlight ?? []),
    [hoverHighlight],
  );

  return (
    <div className="h-full overflow-auto p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="text-center">
          <Badge variant="outline" className="mb-3 gap-1.5">
            <Sparkles className="h-3 w-3" />
            Ancestry
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            The compasses this board descends from
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Two families: ten origin sketches (2013–2018) that became the
            board's grammar, and twenty thematic compasses that frame an idea
            into its closest executable surface. Pick either — the canvas
            switches in place.
          </p>
        </header>

        {/* Stage filter — applies to both bands */}
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

        {/* Temporal arc */}
        <AncestryArc
          selectedSlug={selectedSlug}
          highlightedSlugs={highlightedSlugs}
          onSelect={(slug) =>
            setSelectedSlug((curr) => (curr === slug ? null : slug))
          }
        />

        {/* Selected origin detail */}
        {selected && (
          <Card className="overflow-hidden border-primary/40 bg-card/80">
            <div className="grid gap-0 md:grid-cols-[200px_1fr]">
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted md:aspect-auto md:h-full">
                <img
                  src={selected.image}
                  alt={`${selected.title} — sketch by Jonathan Bélisle, ${selected.year}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {selected.year}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {selected.language}
                  </Badge>
                  <h3 className="ml-1 text-sm font-semibold leading-tight">
                    {selected.title}
                  </h3>
                </div>
                {selected.subtitle && (
                  <p className="text-xs italic text-muted-foreground">
                    {selected.subtitle}
                  </p>
                )}
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {selected.blurb}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selected.vocabulary.slice(0, 8).map((v) => (
                    <span
                      key={v}
                      className="rounded bg-secondary/70 px-1.5 py-0.5 text-[10px]"
                    >
                      {v}
                    </span>
                  ))}
                </div>

                {/* Became → */}
                <div className="border-t border-border/60 pt-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Became → switch the canvas
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {targetsFor(selected.slug).map((t, i) =>
                      t.kind === "topology" ? (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onSwitchTopologyMode(t.mode)}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          {t.label}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ) : t.kind === "board" ? (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onSwitchBoardTab?.(t.tab)}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-secondary/80"
                        >
                          {t.label}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ) : (
                        <Link
                          key={i}
                          to={t.to}
                          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {t.label}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ),
                    )}
                  </div>
                </div>

                {relatedCompasses.length > 0 && (
                  <div className="border-t border-border/60 pt-3">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Frames it shares grammar with
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {relatedCompasses.map((c) => (
                        <span
                          key={c.slug}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px]",
                            "border-primary/40 bg-primary/5 text-foreground",
                          )}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Wild Cookie framing band */}
        <WildCookieFramingBand
          stageFilter={stageFilter}
          selectedOriginSlug={selectedSlug}
          onHoverCompass={setHoverHighlight}
          onSwitchTopologyMode={onSwitchTopologyMode}
          onSwitchBoardTab={(tab) => onSwitchBoardTab?.(tab)}
        />

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
