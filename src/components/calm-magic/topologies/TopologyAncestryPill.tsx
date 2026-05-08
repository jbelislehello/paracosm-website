import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { OriginMethod } from "@/data/origins";

interface TopologyAncestryPillProps {
  origin: OriginMethod | undefined;
  /** Optional position override. Defaults to bottom-left of the canvas. */
  className?: string;
}

/**
 * Always-on subtle caption overlaid on a topology canvas, naming the
 * 2013–2018 origin compass it descends from. Hover reveals the original
 * sketch, blurb, and a deep link to /origins for the full lineage.
 */
export function TopologyAncestryPill({
  origin,
  className = "absolute bottom-2 left-2 z-10",
}: TopologyAncestryPillProps) {
  if (!origin) return null;

  return (
    <div className={className}>
      <HoverCard openDelay={120} closeDelay={80}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="group inline-flex max-w-[260px] items-center gap-1.5 rounded-full border border-border/60 bg-background/85 px-2.5 py-1 text-[10px] text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-foreground"
          >
            <Sparkles className="h-3 w-3 shrink-0 text-primary/80" />
            <span className="truncate">
              <span className="font-semibold">Lineage:</span>{" "}
              <span className="truncate">{origin.title}</span>
              <span className="opacity-70">, {origin.year}</span>
            </span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="start"
          className="w-80 p-0 overflow-hidden"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={origin.image}
              alt={`${origin.title} — original sketch by Jonathan Bélisle, ${origin.year}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                {origin.year}
              </span>
              <span className="text-[10px] text-muted-foreground">
                Original language: {origin.language}
              </span>
            </div>
            <p className="text-sm font-semibold leading-tight">{origin.title}</p>
            {origin.subtitle && (
              <p className="text-xs italic text-muted-foreground">
                {origin.subtitle}
              </p>
            )}
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">
              {origin.blurb}
            </p>
            <Link
              to="/origins"
              className="inline-block text-[11px] font-medium text-primary hover:underline"
            >
              See the full lineage →
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
