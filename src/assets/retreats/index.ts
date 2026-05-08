import atelierCircle from "./atelier-circle.jpg";
import forestCircle from "./forest-circle.jpg";
import mountainSummit from "./mountain-summit.jpg";
import oceanGathering from "./ocean-gathering.jpg";
import stormKeynote from "./storm-keynote.jpg";
import sunAmphitheater from "./sun-amphitheater.jpg";
import riverPanel from "./river-panel.jpg";
import lakePortrait from "./lake-portrait.jpg";

import type { ResidencyArchetype } from "@/data/residencies";

export const retreatImages = {
  atelierCircle,
  forestCircle,
  mountainSummit,
  oceanGathering,
  stormKeynote,
  sunAmphitheater,
  riverPanel,
  lakePortrait,
};

export const residencyImage: Record<ResidencyArchetype, string> = {
  forest: forestCircle,
  river: riverPanel,
  lake: lakePortrait,
  mountain: mountainSummit,
  ocean: oceanGathering,
  storm: stormKeynote,
  sun: sunAmphitheater,
};

export const residencyImageCaption: Record<ResidencyArchetype, string> = {
  forest: "Cohort circle, Banff. Outdoor council under the canopy.",
  river: "In dialogue — letting the current of a question carry the room.",
  lake: "A still moment, between sessions.",
  mountain: "Summit pause, Tunnel Mountain. Long-horizon time, executive body.",
  ocean: "A field of attention — leaders gathering at scale.",
  storm: "Live transmission — channeling charge in front of the room.",
  sun: "Cohort closing on the steps. Climate, not weather.",
};

/* ---------- Image credits & sources ---------- */

export type ImageCredit = {
  /** Matches the import key in `retreatImages` */
  slug: keyof typeof retreatImages;
  /** Human-facing filename, used on the /credits page */
  fileName: string;
  photographer: string;
  year?: string;
  location?: string;
  event?: string;
  note?: string;
};

/**
 * Per-photo attribution. Photographer/year/location are placeholders —
 * fill in as data becomes available. Falls back gracefully via formatCredit.
 */
export const retreatImageCredits: Record<keyof typeof retreatImages, ImageCredit> = {
  atelierCircle: {
    slug: "atelierCircle",
    fileName: "atelier-circle.jpg",
    photographer: "Paracosm archive",
    event: "Atelier — strategy composed by the room",
  },
  forestCircle: {
    slug: "forestCircle",
    fileName: "forest-circle.jpg",
    photographer: "Paracosm archive",
    location: "Banff, AB",
    event: "Outdoor council under the canopy",
  },
  mountainSummit: {
    slug: "mountainSummit",
    fileName: "mountain-summit.jpg",
    photographer: "Paracosm archive",
    location: "Tunnel Mountain, Banff",
    event: "Summit pause — long-horizon time",
  },
  oceanGathering: {
    slug: "oceanGathering",
    fileName: "ocean-gathering.jpg",
    photographer: "Paracosm archive",
    event: "Leaders gathering at scale",
  },
  stormKeynote: {
    slug: "stormKeynote",
    fileName: "storm-keynote.jpg",
    photographer: "Paracosm archive",
    event: "Live transmission — keynote",
  },
  sunAmphitheater: {
    slug: "sunAmphitheater",
    fileName: "sun-amphitheater.jpg",
    photographer: "Paracosm archive",
    event: "Cohort closing on the steps",
  },
  riverPanel: {
    slug: "riverPanel",
    fileName: "river-panel.jpg",
    photographer: "Paracosm archive",
    event: "In dialogue — panel format",
  },
  lakePortrait: {
    slug: "lakePortrait",
    fileName: "lake-portrait.jpg",
    photographer: "Paracosm archive",
    event: "A still moment between sessions",
  },
};

/** Render a subtle inline credit line. */
export const formatCredit = (c?: ImageCredit): string => {
  if (!c) return "";
  const parts = [c.photographer, c.location, c.year].filter(Boolean);
  return parts.length ? `Photo: ${parts.join(", ")}` : "";
};

/** Convenience: credit lookup by archetype (for residency hero). */
export const residencyImageCredit: Record<ResidencyArchetype, ImageCredit> = {
  forest: retreatImageCredits.forestCircle,
  river: retreatImageCredits.riverPanel,
  lake: retreatImageCredits.lakePortrait,
  mountain: retreatImageCredits.mountainSummit,
  ocean: retreatImageCredits.oceanGathering,
  storm: retreatImageCredits.stormKeynote,
  sun: retreatImageCredits.sunAmphitheater,
};
