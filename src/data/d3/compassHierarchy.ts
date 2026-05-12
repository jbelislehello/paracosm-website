export type CompassAxis = "MAGIC" | "LOVE" | "CALM" | "OPEN" | "FREE";

export interface CompassNode {
  name: string;
  axis?: CompassAxis;
  children?: CompassNode[];
  value?: number;
}

// 5 axes × seasons × tiles. Each axis carries 12-13 tiles distributed across
// its named seasons, summing to the 64-tile Glitch Compass cycle.
// Strict 1:1: each tile is its own leaf node, never concatenated.

const axis = (
  name: CompassAxis,
  seasons: { name: string; tiles: string[] }[],
): CompassNode => ({
  name,
  axis: name,
  children: seasons.map((s) => ({
    name: s.name,
    axis: name,
    children: s.tiles.map((t) => ({ name: t, axis: name, value: 1 })),
  })),
});

export const compassHierarchy: CompassNode = {
  name: "Compass",
  children: [
    axis("MAGIC", [
      { name: "Spark", tiles: ["Vision", "Signal", "Omen", "Question"] },
      { name: "Pollen", tiles: ["Seed", "Resonance", "Pattern", "Myth"] },
      { name: "Bloom", tiles: ["Story", "Ritual", "Oracle", "Threshold", "Echo"] },
    ]),
    axis("LOVE", [
      { name: "Tend", tiles: ["Listen", "Hold", "Mirror", "Trust"] },
      { name: "Weave", tiles: ["Bond", "Repair", "Witness", "Pact"] },
      { name: "Bloom", tiles: ["Belong", "Tend", "Bless", "Release"] },
    ]),
    axis("CALM", [
      { name: "Ground", tiles: ["Breath", "Pulse", "Anchor", "Soft"] },
      { name: "Window", tiles: ["Tolerance", "Pause", "Soothe"] },
      { name: "Bloom", tiles: ["Recovery", "Sleep", "Hum", "Quiet", "Steady"] },
    ]),
    axis("OPEN", [
      { name: "Drift", tiles: ["Wander", "Notice", "Doubt", "Glitch"] },
      { name: "Cycle", tiles: ["Loop", "Pivot", "Mirror"] },
      { name: "Bloom", tiles: ["Reveal", "Compose", "Map", "Frame", "Share"] },
    ]),
    axis("FREE", [
      { name: "Compile", tiles: ["Schema", "Prompt", "Stack", "Edge"] },
      { name: "Ship", tiles: ["Build", "Test", "Deploy"] },
      { name: "Bloom", tiles: ["Release", "Maintain", "Hand-off", "Sunset", "Echo"] },
    ]),
  ],
};
