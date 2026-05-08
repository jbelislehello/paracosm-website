import { useMemo } from "react";
import { ORIGIN_METHODS, type OriginMethod } from "@/data/origins";
import { cn } from "@/lib/utils";

interface AncestryArcProps {
  selectedSlug: string | null;
  highlightedSlugs: Set<string>;
  onSelect: (slug: string) => void;
}

const YEARS = ["2013", "2016", "2017", "2018"];

/**
 * Horizontal temporal arc on md+, vertical timeline on mobile.
 * Nodes are positioned by year column. Highlight = cross-family relation.
 */
export function AncestryArc({
  selectedSlug,
  highlightedSlugs,
  onSelect,
}: AncestryArcProps) {
  const byYear = useMemo(() => {
    const m = new Map<string, OriginMethod[]>();
    YEARS.forEach((y) => m.set(y, []));
    ORIGIN_METHODS.forEach((o) => {
      if (!m.has(o.year)) m.set(o.year, []);
      m.get(o.year)!.push(o);
    });
    return m;
  }, []);

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-6">
      {/* Desktop: horizontal arc */}
      <div className="hidden md:block">
        <div className="relative">
          {/* timeline rail */}
          <div className="absolute left-0 right-0 top-6 h-px bg-border" />
          <div className="relative grid grid-cols-4 gap-4">
            {YEARS.map((year) => {
              const items = byYear.get(year) ?? [];
              return (
                <div key={year} className="flex flex-col items-center gap-3">
                  <span className="z-10 inline-flex h-6 items-center rounded-full bg-secondary px-2.5 text-[10px] font-semibold tracking-wide">
                    {year}
                  </span>
                  <div className="flex w-full flex-col items-stretch gap-2">
                    {items.map((o) => (
                      <ArcNode
                        key={o.slug}
                        origin={o}
                        selected={selectedSlug === o.slug}
                        highlighted={highlightedSlugs.has(o.slug)}
                        onClick={() => onSelect(o.slug)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: vertical list grouped by year */}
      <div className="space-y-4 md:hidden">
        {YEARS.map((year) => {
          const items = byYear.get(year) ?? [];
          if (!items.length) return null;
          return (
            <div key={year} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-[10px] font-semibold">
                  {year}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-1.5">
                {items.map((o) => (
                  <ArcNode
                    key={o.slug}
                    origin={o}
                    selected={selectedSlug === o.slug}
                    highlighted={highlightedSlugs.has(o.slug)}
                    onClick={() => onSelect(o.slug)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ArcNode({
  origin,
  selected,
  highlighted,
  onClick,
}: {
  origin: OriginMethod;
  selected: boolean;
  highlighted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full rounded-lg border px-2.5 py-1.5 text-left text-[11px] leading-tight transition-all",
        "hover:border-primary/60 hover:bg-primary/5",
        selected
          ? "border-primary bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/40"
          : highlighted
          ? "border-primary/50 bg-primary/5 text-foreground"
          : "border-border/60 bg-background/60 text-muted-foreground",
      )}
      aria-pressed={selected}
    >
      <span className="line-clamp-2 font-medium">{origin.title}</span>
    </button>
  );
}
