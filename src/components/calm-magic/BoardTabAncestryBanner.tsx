import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  BOARD_TAB_ANCESTRY,
  type BoardTabSlug,
} from "@/data/originsToTopology";

interface BoardTabAncestryBannerProps {
  tab: BoardTabSlug;
  /** Optional label override (e.g. "Workflow ancestry", "Relational ancestry"). */
  label?: string;
}

/**
 * One-line ancestry banner shown above a board tab's main panel.
 * Hover reveals the original 2013–2018 sketch and a deep link to /origins.
 */
export function BoardTabAncestryBanner({
  tab,
  label = "Ancestry",
}: BoardTabAncestryBannerProps) {
  const origin = BOARD_TAB_ANCESTRY[tab];
  if (!origin) return null;

  return (
    <div className="mx-auto mb-3 flex max-w-3xl items-center justify-center px-2">
      <HoverCard openDelay={120} closeDelay={80}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary/80" />
            <span>
              <span className="font-semibold">{label}:</span> {origin.title}
              <span className="opacity-70"> · {origin.year}</span>
            </span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="bottom"
          align="center"
          className="w-80 p-0 overflow-hidden"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={origin.image}
              alt={`${origin.title} — sketch by Jonathan Bélisle, ${origin.year}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-2 p-3">
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
