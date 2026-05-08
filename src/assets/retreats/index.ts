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
