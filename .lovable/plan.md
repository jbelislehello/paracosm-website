## Add an interactive D3 gallery on the homepage

Two D3 visualizations, mounted as a single new section between the existing `<AgenticEcosystemDemo />` and the next homepage block. Styled in Static Bloom (magenta/amber/teal HSL tokens, scanline overlays, `font-vhs` labels, `font-redacted` captions) so it reads as part of the agentic-ecosystem story.

### Files

**New**
- `src/components/d3/D3GallerySection.tsx` — section wrapper with title ("Living Diagrams"), Static Bloom intro copy, scanline overlay, and a 2-tab switcher (Network / Sunburst) using existing shadcn `Tabs`.
- `src/components/d3/AgentNetworkGraph.tsx` — D3 force-directed graph.
- `src/components/d3/CompassSunburst.tsx` — D3 zoomable sunburst across the 64-tile compass.
- `src/data/d3/agentNetwork.ts` — node/link dataset (8 agents: Wuxia, Calm Magic Assistant, GL!TCH facilitator, PRD Compiler, Drift Librarian, Tonalli Voice, Tarot Oracle, Ontology Mapper) with role tags + handoff edges.
- `src/data/d3/compassHierarchy.ts` — hierarchy with 5 axes (MAGIC, LOVE, CALM, OPEN, FREE) → 13 seasons → 64 tiles, derived from existing `seasonDefinitions` / `tileSemanticMeaning` to keep ontological 1:1 mapping (no concatenation of distinct entities).

**Edited**
- `package.json` — add `d3@^7` and `@types/d3` (dev). Use full `d3` per your choice.
- `src/pages/LandingPage.tsx` — import `D3GallerySection` and render it directly after `<AgenticEcosystemDemo />`.

### Component behavior

**AgentNetworkGraph**
- D3 v7 `forceSimulation` with `forceLink`, `forceManyBody`, `forceCenter`, `forceCollide`.
- Drag handlers via `d3.drag()`; SVG zoom/pan via `d3.zoom()`.
- Nodes colored by role group (Voice / Knowledge / Regulation / Product) using `--bloom-magenta`, `--bloom-amber`, `--bloom-teal`, `--bloom-violet`.
- Hover: highlight node + 1-hop neighbors, dim others, show a tooltip card (role, axis, brief description).
- Reduced-motion: skip the entry simulation tick animation, render a settled layout.

**CompassSunburst**
- D3 `partition` + `arc` on the hierarchy.
- Click an axis arc → zoom into that axis (smooth `d3.transition`); click center → zoom out.
- Color per axis using the same Calm Magic axis tokens already in `AXIS_ACCENT`.
- Hover arc → label updates in the center with axis + season + tile count.

### Technical notes
- Each D3 component creates its SVG once in a `useRef`, runs setup in a single `useEffect([])`, and cleans up the simulation on unmount.
- Respect `usePrefersReducedMotion()` (already in the project) for both viz.
- All colors come from CSS HSL tokens — no hex literals in components.
- Code-split: lazy-import `D3GallerySection` in `LandingPage.tsx` via `React.lazy` so the d3 bundle isn't shipped on first paint.
- Bilingual copy: section title/intro keys added to `src/i18n/en/landing.json` and `src/i18n/fr/landing.json`.

No backend, no schema changes, no other pages touched.