## Interactive Agentic Ecosystem Demo — with Crewdle "Dream & Learn" module

Build a new dedicated section that goes beyond the existing hero force-graph. The hero teases the concept; this new section lets visitors **play** with a richer simulation and introduces the **Crewdle Dream & Learn** module as the bridge between Paracosm's Calm Magic methodology and Crewdle's edge-AI orchestration platform.

### Where it lives

New component `src/components/AgenticEcosystemDemo.tsx`, mounted in `src/pages/LandingPage.tsx` directly after `<AgenticEcosystemHero />` (around line 175), inside a `CollapsibleSection` so it doesn't bloat the scroll.

### Layout (3 panes, responsive)

```text
┌──────────────────────────────────────────────────────────────────┐
│  Header: "See an Agentic Ecosystem think — live"                 │
│  Badge: Powered by Crewdle · Dream & Learn module                │
├─────────────────────┬────────────────────────┬───────────────────┤
│  LEFT (controls)    │  CENTER (D3 graph)     │  RIGHT (Chord +   │
│  • Scenario picker  │  Force-directed        │   activity log)   │
│  • Run / Step / Stop│  agent network with    │  D3 chord diagram │
│  • Agent toggles    │  pulses traveling      │  shows message    │
│  • Dream ↔ Learn    │  along edges           │  flow density     │
│    mode switch      │                        │  between agents   │
└─────────────────────┴────────────────────────┴───────────────────┘
```

On mobile: stacks vertically (controls → graph → chord+log).

### Three integrated visualizations (all design-token themed)

1. **D3 force-directed agent network** (center). Reuses the pattern from `AgenticEcosystemHero` but expanded:
   - 12 nodes: 1 Orchestrator, 1 Shared Context, 5 Dream agents (Vision, Storyteller, Speculator, Mythographer, Composer), 5 Learn agents (Researcher, Pattern, Critic, Curator, Tutor).
   - Color-coded by mode (Dream = accent, Learn = primary, Orchestrator = foreground).
   - Edges pulse when a message travels; thickness = recent traffic.
   - Click a node → highlights its 1-hop neighborhood + opens a tooltip.

2. **D3 chord diagram** (right top). Built with `d3.chord()` + `d3.ribbon()`:
   - 10×10 matrix of agent-to-agent message counts updated in real time by the simulation tick.
   - Hovering a ribbon highlights the same edge in the force graph (shared `hoveredEdge` state).

3. **Activity log / sparkline** (right bottom). Scrolling list of simulated messages (`Vision → Composer: "expand metaphor"`) with a tiny inline sparkline of total throughput over the last 30 ticks.

### Interaction model

- **Scenarios** (left dropdown): "Onboard a new client", "Generate a speculative scenario", "Audit an AI policy", "Run a Glitch session". Each loads a different message-routing pattern.
- **Run / Step / Pause** controls drive a `setInterval` tick (250ms) that emits messages along weighted edges using a small Markov-style transition table per scenario.
- **Dream ↔ Learn switch**: dims the opposite half of the graph and biases the transition table — concretely shows what each module emphasizes.
- **Agent toggles**: disable an agent → orchestrator reroutes; visitors see resilience.

### Crewdle "Dream & Learn" framing

Above the demo, a short editorial block:

> **Dream & Learn** — the AI orchestration & inventivity module Jonathan is building inside Crewdle's edge-AI platform. *Dream* agents diverge: speculate, story, compose. *Learn* agents converge: research, critique, curate. The Orchestrator routes attention between the two so organizations can *invent and integrate* in the same loop.

Includes:
- Inline link to crewdle.com (external)
- Link to the April Drift edition for the deeper "Relationship Model" article
- "Book a discovery call" CTA → existing Reclaim link

### Technical notes

- Pure client-side; no backend. All state in React + refs.
- D3 v7 already installed (`d3` ^7.9.0, `@types/d3`).
- Use `useRef` for the simulation + chord matrix; `useState` for UI (scenario, mode, hovered edge, paused).
- Single `useEffect` builds the force sim; a separate `useEffect` runs the tick loop and updates both viz refs in lockstep.
- All colors via design tokens (`hsl(var(--primary))`, `--accent`, `--muted-foreground`); no hard-coded hex.
- Wrap the section in `CollapsibleSection` (already used elsewhere) with default `open={false}` on mobile to respect Landing Scannability rule, `open={true}` on desktop.
- Add an `id="agentic-demo"` anchor for nav linking.

### Files

- **Create**: `src/components/AgenticEcosystemDemo.tsx` (the section + 3 sub-viz, ~350 LOC).
- **Create**: `src/components/agentic-demo/scenarios.ts` (scenario configs + transition tables).
- **Edit**: `src/pages/LandingPage.tsx` — import + mount after `<AgenticEcosystemHero />`.

### Out of scope

- No persistence / Supabase writes.
- No new i18n keys for v1 (English copy inline; can be extracted later per Bilingual Architecture rule).
- No real Crewdle API integration — this is a conceptual demo of the Dream & Learn module.