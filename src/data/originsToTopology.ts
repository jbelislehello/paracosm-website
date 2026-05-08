/**
 * Single source of truth: which 2013–2018 origin compass each live
 * Calm Magic Board surface (topology view mode or board tab) descends from.
 *
 * Used by:
 *  - OriginsAncestryView (the temporal arc inside Topologies → ancestry)
 *  - TopologyAncestryPill (always-on caption on each topology canvas)
 *  - Inline ancestry banners on the PRD-Assembly and Window-of-Tolerance tabs.
 */
import { ORIGIN_METHODS, type OriginMethod } from "./origins";
import type { TopologyViewMode } from "@/components/calm-magic/topologies/ViewModeSelector";

const bySlug = (slug: string): OriginMethod => {
  const m = ORIGIN_METHODS.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown origin slug: ${slug}`);
  return m;
};

/** Topology view modes inside the board, mapped to their ancestral compass. */
export const TOPOLOGY_ANCESTRY: Partial<Record<TopologyViewMode, OriginMethod>> = {
  spiral: bySlug("small-thinking-2013"),
  diamond: bySlug("smpl-fr-2017"),
  flow: bySlug("flux-noetical-2018"),
  charts: bySlug("concentric-methods-2018"),
  coordinates: bySlug("relational-intelligence-2018"),
  cycles: bySlug("flux-noetical-2018"),
  projection: bySlug("small-thinking-2013"),
  observatory: bySlug("flux-noetical-2018"),
  isometric: bySlug("small-thinking-2013"),
};

/** Cross-tab ancestry (board-level tabs that aren't inside Topologies). */
export type BoardTabSlug =
  | "prd-assembly"
  | "window-of-tolerance"
  | "expressivity"
  | "constellation";

export const BOARD_TAB_ANCESTRY: Record<BoardTabSlug, OriginMethod> = {
  "prd-assembly": bySlug("dt-sd-sa-2018"),
  "window-of-tolerance": bySlug("relational-intelligence-2018"),
  expressivity: bySlug("applied-poetry-2016"),
  constellation: bySlug("concentric-methods-2018"),
};

export { ORIGIN_METHODS };
