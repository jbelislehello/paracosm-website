
# Make Calm Magic feel alive — a differential-geometry aesthetic pass

The reference image (Differential Geometry: Blueprint of Spacetime) gives us a visual grammar that fits Calm Magic perfectly: hand-drawn grid paper, breathing surfaces, tangent/normal/binormal frames, osculating planes, and labelled anatomy. Right now our visualizations (Torus Energy Field, Cosmological 3D Manifold, Spiral Timeline, Torus Relationnel, Spiral Quadrant) are technically rich but feel static, generic, and "dashboard-y." This pass turns them into a coherent, breathing, narrated geometric language — the "anatomy of a learning organization."

## Design intent

Three feelings to add everywhere:

1. **Breathing** — every surface gently inhales/exhales (subtle scale, opacity, line-width modulation tied to a shared global pulse, ~0.1 Hz).
2. **Anatomy** — every shape is labelled like a textbook diagram: tangent (where you're going), normal (where attention points), curvature (where learning bends).
3. **Hand-drawn paper** — soft graph-paper backgrounds, slightly imperfect strokes, indigo/red ink palette, serif math labels (KaTeX-style).

## Scope (touch existing components, no new pages)

### 1. Shared visual primitives — `src/components/calm-magic/geometry/`
New, small, reusable:
- `GraphPaper.tsx` — SVG graph-paper background (faint indigo grid, optional perspective warp). Used as backdrop for every viz.
- `BreathingPulse.tsx` (hook `useBreathingPulse`) — single global pulse value (0–1, sine, 10s) so all visualizations breathe in sync. This is the "alive" backbone.
- `FrenetFrame.tsx` — draws Tangent (T, blue), Normal (N, red), Binormal (B, green) arrows at any point on a path. Reusable on Spiral and Torus.
- `Annotation.tsx` — leader-line + label component that mimics the textbook callouts ("Curvature: where the org bends", "Tangent: current trajectory").
- `inkStroke` utility — adds subtle SVG filter (turbulence + displacement) so lines look hand-inked instead of vector-perfect.

### 2. TorusEnergyField — anatomy + breath
File: `src/components/calm-magic/components/TorusEnergyField.tsx`
- Replace flat concentric circles with a true torus cross-section (inner/outer radius), drawn on `GraphPaper`.
- Bind ring stroke-width and opacity to `useBreathingPulse` so the field actually pulses (not driven by a slider alone).
- Add three permanent annotations: "Inner flow — individual learning", "Outer skin — collective coherence", "Throat — where invention happens". These replace the abstract "Field Intensity" copy with human language.
- Add a small Frenet frame riding around the torus to show "where attention is right now."

### 3. Cosmological3DManifold — osculating plane + labels
File: `src/components/calm-magic/Cosmological3DManifold.tsx`
- Add a translucent osculating plane that follows the user's currently-selected tile (like the "Curves and the Osculating Plane" panel in the reference).
- Add floating drei `<Text>` labels for the 5 seasons positioned as anatomy callouts ("POLLENS — first contact / curvature onset", etc.).
- Modulate tile emissive intensity with the global breath pulse so the whole board inhales together.
- Soften background from black to warm paper (#f6f1e6) when in "human" mode (toggle in viz controls).

### 4. SpiralTimeline — Frenet frame + ink
File: `src/components/SpiralTimeline.tsx`
- Render the spiral path with a hand-ink filter; show T/N/B arrows at the currently-played event.
- Add a small "curvature meter" κ(s) bar that grows where events cluster — visualizing where the org's learning bends sharpest.
- Replace the "Zoom/Reset/Play" toolbar copy with anatomy verbs: "Trace", "Pause breath", "Re-center".

### 5. TorusRelationnel — breathing quadrants
File: `src/components/journal/TorusRelationnel.tsx`
- Tie active phase opacity to breath; add tangent arrow rotating around the ring to show phase progression continuously instead of as discrete clicks.
- Add an inner caption: "Approche → Ouverture → Intensité → Retrait — the four fundamental forms of contact."

### 6. SpiralQuadrantVisualizer — first/second fundamental form metaphor
File: `src/components/journal/SpiralQuadrantVisualizer.tsx`
- Light retitling and one annotation overlay framing the two axes as "stretching (first form)" and "bending (second form)" — directly borrowing the reference's anatomy language to make abstract quadrants feel embodied.

### 7. Landing — one alive hero element
File: `src/pages/LandingPage.tsx` (and/or `src/components/landing/FrameworkHero.tsx`)
- Behind the FrameworkHero, add a quiet looping `GraphPaper` + breathing torus silhouette + slowly drifting Frenet frame. No interactivity, just signals "this site is alive." Mobile: static SVG fallback.

## What we are NOT doing

- No new routes, no new data models, no backend changes.
- No replacement of Three.js with anything else; we layer on top of existing canvases.
- No copy rewrite of marketing pages beyond labels inside visualizations.

## Technical notes

- Breath pulse: single `useBreathingPulse()` hook returning `Math.sin(performance.now()/1600) * 0.5 + 0.5`, subscribed via `useState + requestAnimationFrame`. Components opt-in.
- Ink filter: one shared SVG `<filter>` defined once in `GraphPaper` (`feTurbulence` + `feDisplacementMap`, scale ~0.6). Cheap.
- Three.js additions stay within existing `@react-three/fiber@^8` / `drei@^9` versions — no upgrades.
- Respect `prefers-reduced-motion`: breath pulse returns constant 0.5, no Frenet rotation.
- Color tokens: add `--ink-indigo` `#27317a`, `--ink-red` `#b8324a`, `--paper` `#f6f1e6` to `index.css` so the geometry palette is themeable.

## Order of implementation

1. Primitives (`GraphPaper`, `useBreathingPulse`, `FrenetFrame`, `Annotation`, ink filter, color tokens).
2. TorusEnergyField redesign (highest visibility, biggest "alive" payoff).
3. Cosmological3DManifold osculating plane + labels.
4. SpiralTimeline Frenet + curvature meter.
5. TorusRelationnel + SpiralQuadrant light pass.
6. Landing hero ambient layer.

Each step is independently shippable; we can stop after step 2 and already feel the difference.
