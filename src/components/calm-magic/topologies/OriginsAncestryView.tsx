import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ORIGIN_METHODS } from "@/data/origins";
import {
  TOPOLOGY_ANCESTRY,
  BOARD_TAB_ANCESTRY,
  type BoardTabSlug,
} from "@/data/originsToTopology";
import type { TopologyViewMode } from "./ViewModeSelector";

interface OriginsAncestryViewProps {
  /** Switch the topologies tab to a different view mode in place. */
  onSwitchTopologyMode: (mode: TopologyViewMode) => void;
  /** Switch the board to a different top-level tab in place. */
  onSwitchBoardTab?: (tab: BoardTabSlug | "matrix") => void;
}

type Target =
  | { kind: "topology"; mode: TopologyViewMode; label: string }
  | { kind: "board"; tab: BoardTabSlug; label: string }
  | { kind: "external"; to: string; label: string };

/** Compute which live surfaces each origin sketch became. */
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
  // Adjacent surfaces (kept as external links — not inside the board)
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

export function OriginsAncestryView({
  onSwitchTopologyMode,
  onSwitchBoardTab,
}: OriginsAncestryViewProps) {
  return (
    <div className="h-full overflow-auto p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <Badge variant="outline" className="mb-3 gap-1.5">
            <Sparkles className="h-3 w-3" />
            Ancestry
          </Badge>
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            The compasses this board descends from
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Ten methods sketched 2013–2018. Each one names a piece of the
            grammar the live system runs on. Click a "Became →" target to
            switch this canvas in place.
          </p>
        </header>

        {/* Temporal arc */}
        <div className="mb-8 hidden md:flex items-center gap-3 px-2">
          {["2013", "2016", "2017", "2018"].map((y) => (
            <div key={y} className="flex flex-1 items-center gap-2">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                {y}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ORIGIN_METHODS.map((m) => {
            const targets = targetsFor(m.slug);
            return (
              <Card
                key={m.slug}
                className="overflow-hidden border-border/60 bg-card/60"
              >
                <div className="flex h-32 w-full items-stretch overflow-hidden bg-muted">
                  <img
                    src={m.image}
                    alt={`${m.title} — sketch by Jonathan Bélisle, ${m.year}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {m.year}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {m.language}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">
                      {m.title}
                    </h3>
                    {m.subtitle && (
                      <p className="mt-0.5 text-xs italic text-muted-foreground">
                        {m.subtitle}
                      </p>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {m.blurb}
                  </p>
                  {targets.length > 0 && (
                    <div className="border-t border-border/60 pt-3">
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Became →
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {targets.map((t, i) =>
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
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
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
