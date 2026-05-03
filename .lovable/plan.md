
# Apply geometry primitives to the remaining three visualizations

Bring `Cosmological3DManifold`, `SpiralTimeline`, and `SpiralQuadrantVisualizer` to the same "alive and human" feel established by the Torus Energy Field — using the same primitives (`useBreathingPulse`, `GraphPaper`, `Annotation`, `FrenetFrame`) and the same indigo/red/green ink palette.

## 1. Cosmological3DManifold — `src/components/calm-magic/Cosmological3DManifold.tsx`

Three.js scene, so we adapt the language:

- **Shared breath in the scene**: add a `useBreath()` ref hook driven by `useFrame` (same period as `useBreathingPulse`, ~9.6s). Pass it down to `BoardTiles`, `TorusEnergyField`, `ManifoldSpiral`.
  - Tiles: modulate `emissiveIntensity` and slight `scale.y` with breath.
  - Inner/outer torus: modulate `opacity` and minor radius (`scale`) with breath.
  - Spiral: modulate line `opacity` with breath.
- **Osculating plane on selected tile**: add a translucent indigo plane (`<mesh>` with `planeGeometry`) attached to the currently-selected tile, oriented along the spiral tangent at that point. Mirrors the textbook "Osculating Plane" panel.
- **Anatomy labels per season**: replace the bare season name in `Float`/`Text` with a two-line label using `SEASON_ANATOMY` (e.g., POLLENS → "κ onset · first contact"). Serif font via drei `<Text font="...">` falls back to default; copy is the key change.
- **"Human mode" toggle in header**: a small button next to "Enable Audio" that swaps the Canvas background gradient from `#0a0a1a → #1a1a2e` to warm paper `#f6f1e6 → #efe6d2`, and reduces ambient star opacity. Stored in component state, default off (keeps existing dark cosmological vibe as default).
- **Header retitle**: "Cosmological Manifold" → "Cosmological Manifold — anatomy of a season" (italic serif sub-label).
- **Controls panel copy**: "Drag to rotate" → "Drag to re-frame · Scroll to zoom · Click to feel a tile's harmonic" (more human, less mechanical).

## 2. SpiralTimeline — `src/components/SpiralTimeline.tsx`

Pure 2D canvas. We layer SVG primitives on top via a sibling overlay (canvas keeps doing the spiral; SVG adds anatomy):

- Wrap the existing `<canvas>` in a `relative` container and add an absolutely-positioned SVG overlay sized to the canvas.
- Overlay renders:
  - `GraphPaperDefs` + faint paper grid (warm tone), behind the canvas via z-index ordering — so the canvas blends onto graph paper.
  - **Frenet frame** on the currently-active event (driven by `currentTime[0]` and event positions) using `FrenetFrame`. The active event is selected by progress %.
  - **Curvature meter κ(s)**: a thin horizontal bar at the bottom whose segments grow taller where consecutive events cluster in time (proxy for organizational learning intensity).
  - **Two `Annotation` callouts**: one labelling the spiral path ("trajectory γ(s) — your org through time"), one on the active event ("active frame — where attention rides").
- **Toolbar copy** shifts from mechanical to anatomical:
  - "Play" / "Pause" → "Trace" / "Pause breath"
  - "Reset View" → "Re-center frame"
  - "2D View" / "3D View" → "Flatten" / "Spiral"
  - "Zoom" → "Focal length"
- **Breath-driven node glow**: in the canvas `drawSpiral`, multiply the node `gradient` opacity by `useBreathingPulse()` value (subscribed via state at component level).
- **Selected event card**: prepend an italic serif sub-label "fig — point on the curve" above the year, matching the new visual grammar.

## 3. SpiralQuadrantVisualizer — `src/components/journal/SpiralQuadrantVisualizer.tsx`

Small SVG, light surgical pass:

- Replace the rectangular tinted backgrounds with `GraphPaperDefs` + grid (subtle, warm).
- Re-render the spiral path with `filter="url(#sq-gp-ink)"` for the hand-ink look.
- **Breath**: pulse the central circle radius and entry-dot opacity using `useBreathingPulse()`.
- **Frenet frame**: a small T/N pair anchored on the spiral path at the position corresponding to the active quadrant — visualizes where the practice is currently bending.
- **Anatomy retitle + axis relabel**:
  - Card title: "Spiral Quadrants" → "Spiral Quadrants — fundamental forms"
  - Axes: keep the current names (Sovereignty/Memory/Intimacy/Novelty) but add a thin italic serif overline:
    - Vertical axis: "first form · stretching"
    - Horizontal axis: "second form · bending"
  - Add a one-line italic caption under the diagram: "The two ways a life-shape can change — measured at every step."
- Active quadrant info gets a `font-serif italic` heading and the existing description below.

## What we are NOT doing

- No Three.js version bumps; everything stays within `@react-three/fiber@^8` / `drei@^9`.
- No new routes, no data-model changes.
- No replacement of the existing tile/season color logic — we only add anatomy on top.

## Order of implementation

1. `Cosmological3DManifold` (highest visibility — the showpiece).
2. `SpiralTimeline` (canvas + SVG overlay layering).
3. `SpiralQuadrantVisualizer` (smallest, fastest).

Each can ship independently.
