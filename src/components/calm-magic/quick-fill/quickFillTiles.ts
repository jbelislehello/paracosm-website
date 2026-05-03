// 64-tile catalogue mirrored from src/data/tileContents.ts (id, name, row, col, phase)
export type QuickFillTile = {
  id: number;
  row: number; // 1-8
  col: number; // 1-8
  rowName: string;
  colName: string;
  name: string;
  phase: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN';
};

const ROW_NAMES = ['Mindsets', 'Agilities', 'Goals', 'Landscape', 'Energy', 'Norms', 'Synergies', 'Protocols'];
const COL_NAMES = ['C', 'H', 'O', 'R', 'D', 'S', 'M', 'Σ'];
const NAMES: { name: string; phase: QuickFillTile['phase'] }[] = [
  // Row 1 — Mindsets — LOVE
  { name: 'Permission to try', phase: 'LOVE' }, { name: 'Loving stance', phase: 'LOVE' },
  { name: 'Observer upgrade', phase: 'LOVE' }, { name: 'Letting go', phase: 'LOVE' },
  { name: 'Designer mindset', phase: 'LOVE' }, { name: 'Gardener mindset', phase: 'LOVE' },
  { name: 'Method mindset', phase: 'LOVE' }, { name: 'Systems mindset', phase: 'LOVE' },
  // Row 2 — Agilities — MAGIC
  { name: 'Risk agility', phase: 'MAGIC' }, { name: 'Empathy agility', phase: 'MAGIC' },
  { name: 'Perception agility', phase: 'MAGIC' }, { name: 'Reversal agility', phase: 'MAGIC' },
  { name: 'Design agility', phase: 'MAGIC' }, { name: 'Seeding agility', phase: 'MAGIC' },
  { name: 'Method agility', phase: 'MAGIC' }, { name: 'Systemic agility', phase: 'MAGIC' },
  // Row 3 — Goals — MAGIC
  { name: 'Daring goal', phase: 'MAGIC' }, { name: 'Heart goal', phase: 'MAGIC' },
  { name: 'Insight goal', phase: 'MAGIC' }, { name: 'Renewal goal', phase: 'MAGIC' },
  { name: 'Design goal', phase: 'MAGIC' }, { name: 'Seeding goal', phase: 'MAGIC' },
  { name: 'Method goal', phase: 'MAGIC' }, { name: 'Systemic goal', phase: 'MAGIC' },
  // Row 4 — Landscape — CALM
  { name: 'Opportunity landscape', phase: 'CALM' }, { name: 'Care landscape', phase: 'CALM' },
  { name: 'Knowledge landscape', phase: 'CALM' }, { name: 'Reversal landscape', phase: 'CALM' },
  { name: 'Design landscape', phase: 'CALM' }, { name: 'Seed landscape', phase: 'CALM' },
  { name: 'Method landscape', phase: 'CALM' }, { name: 'Systems landscape', phase: 'CALM' },
  // Row 5 — Energy — CALM
  { name: 'Risk energy', phase: 'CALM' }, { name: 'Heart energy', phase: 'CALM' },
  { name: 'Attention energy', phase: 'CALM' }, { name: 'Renewal energy', phase: 'CALM' },
  { name: 'Design energy', phase: 'CALM' }, { name: 'Seeding energy', phase: 'CALM' },
  { name: 'Method energy', phase: 'CALM' }, { name: 'Systems energy', phase: 'CALM' },
  // Row 6 — Norms — CALM
  { name: 'Risk norms', phase: 'CALM' }, { name: 'Care norms', phase: 'CALM' },
  { name: 'Truth norms', phase: 'CALM' }, { name: 'Reversal norms', phase: 'CALM' },
  { name: 'Design norms', phase: 'CALM' }, { name: 'Seeding norms', phase: 'CALM' },
  { name: 'Method norms', phase: 'CALM' }, { name: 'Systems norms', phase: 'CALM' },
  // Row 7 — Synergies — CALM
  { name: 'Risk synergies', phase: 'CALM' }, { name: 'Care synergies', phase: 'CALM' },
  { name: 'Insight synergies', phase: 'CALM' }, { name: 'Renewal synergies', phase: 'CALM' },
  { name: 'Design synergies', phase: 'CALM' }, { name: 'Seeding synergies', phase: 'CALM' },
  { name: 'Method synergies', phase: 'CALM' }, { name: 'Systems synergies', phase: 'CALM' },
  // Row 8 — Protocols — OPEN
  { name: 'Risk protocols', phase: 'OPEN' }, { name: 'Care protocols', phase: 'OPEN' },
  { name: 'Observer protocols', phase: 'OPEN' }, { name: 'Reversal protocols', phase: 'OPEN' },
  { name: 'Design protocols', phase: 'OPEN' }, { name: 'Seeding protocols', phase: 'OPEN' },
  { name: 'Method protocols', phase: 'OPEN' }, { name: 'Systems architecture', phase: 'OPEN' },
];

export const QUICK_FILL_TILES: QuickFillTile[] = NAMES.map((n, i) => ({
  id: i + 1,
  row: Math.floor(i / 8) + 1,
  col: (i % 8) + 1,
  rowName: ROW_NAMES[Math.floor(i / 8)],
  colName: COL_NAMES[i % 8],
  name: n.name,
  phase: n.phase,
}));

export const PHASE_COLOR: Record<QuickFillTile['phase'], string> = {
  LOVE: 'border-rose-500/60 bg-rose-500/5',
  MAGIC: 'border-purple-500/60 bg-purple-500/5',
  CALM: 'border-sky-500/60 bg-sky-500/5',
  OPEN: 'border-emerald-500/60 bg-emerald-500/5',
};
