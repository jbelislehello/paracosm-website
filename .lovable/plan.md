

# AI Observatory Model — 3-Tier Observability Section

## What

Create a new `AIObservatoryModel` component that visualizes a 3-layer AI observability architecture (MAGIC / CALM / FREE) with telemetry signals, cross-layer dynamics, and PRD integration. Add it as a new tab ("Observatory") in the `InteractiveToolsPanel`.

## New File: `src/components/calm-magic/tools/AIObservatoryModel.tsx`

A self-contained component with three visual tiers rendered as stacked cards with distinct color themes:

### Layer 1 — Strategic Intelligence (MAGIC)
- Color: luminous purple/indigo gradient (atmospheric)
- Nodes: Vision & Intent, Cultural Maturity Assessment, Organizational Alignment, AI Literacy & Learning, Capability Readiness, Ethical & Governance Principles
- Telemetry gauges: strategic alignment score, experimentation velocity, AI adoption rate, knowledge diffusion
- Each telemetry signal shown as an animated Progress bar with live-feeling values

### Layer 2 — Human Experience Intelligence (CALM)
- Color: teal/emerald gradient (ecosystem)
- Nodes: Customer Journey Mapping, Mental Models, UX/IXD Design Systems, Interface Patterns, Trust & Explainability, Behavioral Feedback Loops
- Telemetry: user trust score, cognitive load index, correction rate, adoption & engagement metrics

### Layer 3 — Technical Infrastructure Intelligence (FREE)
- Color: slate/blue gradient (engine room)
- Nodes: Data Pipelines, Model Training, Model Evaluation, Deployment Infrastructure, Release Roadmap, Monitoring & Observability
- Telemetry: latency, model drift, hallucination rate, uptime, deployment frequency

### Cross-Layer Dynamics
- Vertical connectors rendered between layers showing data streams:
  - Strategic Vision → Product Experience
  - Cultural Readiness → Adoption Rate
  - Infrastructure Reliability → User Trust
- Animated dashed borders or pulse indicators to suggest live data flow

### PRD Integration
- A sidebar or bottom section showing "orbiting" PRD modules that connect to all three layers via colored dots (purple/teal/slate) indicating which layer they attach to

### Implementation approach
- Use existing UI primitives: Card, Badge, Progress, Tabs
- Nodes rendered as Badge elements in a flex-wrap grid per layer
- Telemetry signals as labeled Progress bars with randomized initial values (using `useState` + optional `useEffect` animation)
- Cross-layer connections as styled dividers with arrow icons and labels
- No external dependencies needed — pure React + Tailwind + Lucide icons

## Modified File: `src/components/calm-magic/tools/InteractiveToolsPanel.tsx`

- Import `AIObservatoryModel`
- Add tab trigger `🔭 Observatory` — expand grid from `grid-cols-10` to `grid-cols-11`
- Add `TabsContent` for `"observatory"` rendering the new component
- Add `'AIObservatoryModel': 'observatory'` to `toolTabMap`

