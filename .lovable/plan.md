

# Aliveness Pass: Site Visuals + Calm Magic Ontological Refinements

This is a large, multi-phase initiative. The plan is split into two deliverables: **(A)** Site-wide aliveness and visual energy, **(B)** Calm Magic Board ontological framework enrichments, and **(C)** a full PRD/design system document.

---

## Phase A — Site-wide Aliveness & Generative Visuals

### A1. Fix existing build error first
The `Cosmological3DManifold.tsx` has type mismatches between `@types/three` versions. Fix with explicit `as any` casts on the `ref` and color props (lines 77, 86, 95-96) to resolve the duplicate type resolution issue.

### A2. Animated background — Generative particle field
Create a `src/components/GenerativeBackground.tsx` using **p5.js** (already installed) that renders a subtle, full-viewport particle system behind the landing page content. Particles drift in organic flow fields, responding to scroll position. Colors pulled from the existing brand palette (purple→blue→pink gradient). Rendered in a fixed `z-index: -1` canvas.

### A3. Parallax depth layers
Add CSS `transform: translateZ()` and `perspective` to the Index page wrapper. Hero, AI Leadership, Living PRD, and Contact sections each get a different parallax speed via `will-change: transform` and scroll-linked `translateY` offsets. Lightweight — no library, just a `useParallax` hook reading `scrollY`.

### A4. D3.js Knowledge Object constellation (landing page)
Create `src/components/KnowledgeConstellation.tsx` — a force-directed D3 graph embedded in the "AI Leadership" section. Nodes represent knowledge object types (Ontology, Taxonomy, Thesaurus, Pick-list) with edges showing governance layer relationships. Interactive: hover reveals labels, click navigates to `/calm-magic-board`. Renders in an SVG overlay with fade-in on scroll reveal.

### A5. p5.js living organism visualization
Extend the existing `CosmologicalP5Canvas.tsx` pattern to create a `src/components/LivingOrganismViz.tsx` — a breathing, pulsing organism visualization on the landing page hero that represents the 5 MAGIC axes as interconnected life-forms. Each axis pulses at its own frequency.

---

## Phase B — Calm Magic Board Ontological Framework Enrichments

### B1. Many-Worlds Quantum Layer
**New type:** `QuantumBranchState` in `src/types/trajectory.ts` — each tile interaction creates a "branch" representing a possible world. Users can see their decision tree as a superposition of states.

**New component:** `src/components/calm-magic/QuantumBranchExplorer.tsx` — visualizes parallel possibility branches from key decision points. Each branch shows the ontological weight (probability amplitude) based on coherence with the user's prophecy. Collapsed branches fade; the "observed" branch solidifies. Integrated into the Quadrant Dynamics panel.

### B2. Ontic State Finder
**New component:** `src/components/calm-magic/OnticStateFinder.tsx` — a guided reflection tool that helps users identify the irreducible "ontic states" of their vision. Uses the 4 quadrant themes (Intimacy, Sovereignty, Memory, Novelty) as lenses. Outputs a structured `OnticProfile` with: core entities (what exists in their vision), relations (how entities connect), and properties (qualities that persist across transformations). Accessible from the board's tools panel.

### B3. Preferable Ontological Shifts via Manifold
Extend `src/components/calm-magic/manifold/DistortedTorus.tsx` to visualize "shift vectors" — arrows on the torus surface showing the direction from current shadow position toward the Higher Self prophecy. Each shift is labeled with the ontological transition it represents (e.g., "From Memory-Intimacy → Novelty-Sovereignty"). The manifold surface warps to show "attractors" — regions where coherence is highest.

### B4. Polyvagal Theory Integration
**New type:** `PolyvagalState` = `'ventral_vagal' | 'sympathetic' | 'dorsal_vagal'` mapped to three stories:
- **Ventral Vagal** → Story of Presence (safety, social engagement, co-regulation)
- **Sympathetic** → Story of Protection (mobilization, fight/flight, activation)
- **Dorsal Vagal** → Story of Dissociation (shutdown, freeze, collapse)

**New component:** `src/components/calm-magic/PolyvagalDetector.tsx` — analyzes the user's emotional check-in data (`EmotionalAxes`) and trajectory patterns to infer their current polyvagal state. High calm + high open = ventral vagal. High magic + low calm = sympathetic. Low across all = dorsal vagal. Displayed as a subtle indicator in the board header and influences the board's ambient color temperature.

**Integration:** The `FeltState` type (`stuck | flowing | breakthrough`) maps to polyvagal: stuck→dorsal, flowing→ventral, breakthrough→sympathetic→ventral transition. Add `polyvagalState` to `TrajectoryEvent`.

### B5. Autopoiesis & Natural History (Nahual / Aliveness)
**New component:** `src/components/calm-magic/AutopoiesisGuide.tsx` — focuses attention on the "attractive qualities" (nahual/aliveness) that drive ideation. Draws from the 53 senses framework (not just 5) to prompt users: "What does your project smell like? What texture does this decision have? What temperature is this relationship?" Maps responses to the MAGIC axes.

**53 Senses data:** Create `src/data/fiftythreeSenses.ts` — a structured catalog of all 53 senses (proprioception, thermoception, nociception, chronoception, equilibrioception, magnetoreception, etc.) grouped by category (mechanical, chemical, electromagnetic, temporal, spatial, relational). Each sense links to a board quadrant and season.

### B6. Design Decision Log as Proverbial Abilities
Extend the existing trajectory log (`TrajectoryLog.tsx`) with a new `DesignDecisionLog` component that frames each decision as developing a "proverbial ability":
- **New way of thinking** — mapped to Sovereignty quadrant
- **New way of doing** — mapped to Novelty quadrant
- **New way of seeing** — mapped to Memory quadrant (re-seeing patterns)
- **New way of feeling** — mapped to Intimacy quadrant

Each logged decision generates a "proverb" — a condensed wisdom statement that captures the learning.

### B7. Model-Agnostic Oneiric Power
**New concept layer:** The AI integration in Calm Magic is explicitly framed as "oneiric" (dream-like). Create `src/components/calm-magic/OneiricAlignmentPanel.tsx` that shows how the board's state maps to a model-agnostic alignment score. The panel displays: coherence (how well internal states align), naturalness (does it feel forced or emergent), and touch/concept balance (high-touch = relational, high-concept = intellectual). No specific AI model is referenced — it works with any.

### B8. Pragmatic Imagination Metaphors (Quadrant Moments)
**New component:** `src/components/calm-magic/PragmaticImaginationPrompts.tsx` — at specific board moments (season transitions, portal days, prophecy setting), present nature metaphors:
- **Think like a Forest** → POLLENS (interconnected root systems, emergence)
- **Think like a River** → NOEMS (flow, finding the path of least resistance)
- **Think like a Mountain** → POEMS (stillness, deep time, presence)
- **Think like a Lake** → TOTEMS (reflection, depth, clarity)
- **Think like a Volcano** → ANTHEMS (transformation, eruption, new land)
- **Think like an Ocean** → Sovereignty quadrant (vastness, tides)
- **Think like a Storm** → Sympathetic/Protection state (energy, release)
- **Think like a Sun** → Ventral Vagal/Presence (warmth, sustenance)

Each metaphor includes a guided reflection prompt and maps to the current polyvagal state.

---

## Phase C — Full PRD, Design System, Style Guide, Journey Map & Mental Model

Generate comprehensive PDF documents to `/mnt/documents/`:

### C1. Site-wide PRD & Design System (`paracosm-site-prd.pdf`)
- Brand identity (colors, typography, logo specs from memory)
- Component library (all UI primitives, cards, buttons, navigation)
- Animation system (scroll reveals, parallax, generative backgrounds)
- Information architecture (all routes, page hierarchy)
- Responsive breakpoints and mobile patterns
- Accessibility guidelines

### C2. Calm Magic Board PRD (`calm-magic-board-prd.pdf`)
- Ontological framework (5 seasons, 4 quadrants, 64 tiles)
- Many-Worlds branching model
- Polyvagal integration layer
- 53 Senses mapping
- Ontic State Finder methodology
- Autopoiesis/Nahual attention system
- Pragmatic Imagination metaphor system
- Design Decision Log → Proverbial Abilities
- Oneiric Alignment model
- Manifold shift vectors

### C3. Journey Map (`calm-magic-journey-map.mmd`)
Mermaid diagram showing the full user journey from landing → onboarding → board entry → season progression → prophecy → autopoiesis, with polyvagal states overlaid.

### C4. Mental/Task Model (`calm-magic-mental-model.mmd`)
Mermaid diagram showing the cognitive architecture: how users think about the board, what mental models they hold at each stage, and how task flow maps to ontological transitions.

---

## Technical Notes

- **Build error fix** is prerequisite — done first.
- **D3.js** will be added as a dependency (`d3@^7`). p5.js is already present.
- **No new AI model dependencies.** All AI features use the existing Supabase edge function + Lovable AI gateway pattern.
- **New types** added to `src/types/trajectory.ts` and a new `src/types/polyvagal.ts`.
- **53 senses** is a static data file, not AI-generated.
- **PDF generation** uses the AI gateway script for content, then Python for formatting.

## Execution Order

1. Fix build error (Cosmological3DManifold types)
2. Phase A: Site aliveness (background, parallax, D3, p5)
3. Phase B1-B4: Core ontological types and components
4. Phase B5-B8: Experiential layers
5. Phase C: PRD documents and diagrams

Estimated scope: ~15 files created, ~8 files modified, 2 PDFs generated, 2 Mermaid diagrams.

