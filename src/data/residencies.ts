export type ResidencyArchetype =
  | "forest"
  | "river"
  | "lake"
  | "mountain"
  | "ocean"
  | "storm"
  | "sun";

export interface Residency {
  id: ResidencyArchetype;
  name: string;
  glyph: string;
  invitation: string;
  gesture: string;
  forLeaders: string;
  /** HSL color tokens for gradient backdrop */
  hueFrom: string;
  hueTo: string;
}

export const residencies: Residency[] = [
  {
    id: "forest",
    name: "Think like a Forest",
    glyph: "🌲",
    invitation: "Lead through canopies, mycelial trust, and slow seasons.",
    gesture: "Patient interdependence — sensing the whole stand, not the single tree.",
    forLeaders: "Stewards of complex ecosystems and long strategies.",
    hueFrom: "150 35% 32%",
    hueTo: "100 28% 55%",
  },
  {
    id: "river",
    name: "Think like a River",
    glyph: "🌊",
    invitation: "Move continuously, find the path of least resistance, carve with time.",
    gesture: "Flow — staying in motion without losing direction.",
    forLeaders: "Teams stuck in change fatigue, bottlenecks, and stop-start cycles.",
    hueFrom: "200 60% 38%",
    hueTo: "190 70% 62%",
  },
  {
    id: "lake",
    name: "Think like a Lake",
    glyph: "💧",
    invitation: "Hold stillness as a form of intelligence; let the surface reflect.",
    gesture: "Stillness — receptive depth before response.",
    forLeaders: "Reactive cultures, decision overload, untrusted intuition.",
    hueFrom: "210 45% 30%",
    hueTo: "200 30% 70%",
  },
  {
    id: "mountain",
    name: "Think like a Mountain",
    glyph: "🏔️",
    invitation: "Stand on long-horizon time. Be visible, structural, unhurried.",
    gesture: "Presence — structural integrity under exposure.",
    forLeaders: "Identity shifts, public roles, leaders carrying weight alone.",
    hueFrom: "220 15% 28%",
    hueTo: "30 12% 70%",
  },
  {
    id: "ocean",
    name: "Think like an Ocean",
    glyph: "🐋",
    invitation: "Hold multitudes. Move on tides, not deadlines.",
    gesture: "Capacity — pacing through cycles instead of sprints.",
    forLeaders: "Scaling organisations and multi-stakeholder choreographies.",
    hueFrom: "215 55% 22%",
    hueTo: "180 60% 50%",
  },
  {
    id: "storm",
    name: "Think like a Storm",
    glyph: "⚡",
    invitation: "Work with intensity. Let disruption become generative.",
    gesture: "Discharge — channeling charge instead of avoiding it.",
    forLeaders: "Crisis, conflict, GL!TCH moments, inherited turbulence.",
    hueFrom: "260 40% 30%",
    hueTo: "280 70% 65%",
  },
  {
    id: "sun",
    name: "Think like a Sun",
    glyph: "☀️",
    invitation: "Radiate clarity. Be the climate, not the weather.",
    gesture: "Sustained generativity — giving without depleting.",
    forLeaders: "Burnout recovery, vision-setting, founders re-finding their light.",
    hueFrom: "35 85% 45%",
    hueTo: "50 95% 70%",
  },
];
