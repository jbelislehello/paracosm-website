## Crewdle Dream & Learn — module landing page

Add a dedicated route that explains the module in depth and routes visitors back into the interactive demo + Crewdle + booking. Surface a clear link from the existing demo section so visitors can go from "play with it" to "understand and engage."

### New route

`/dream-and-learn` → new page `src/pages/DreamAndLearn.tsx`.

Registered in `src/App.tsx` alongside other public landing pages (right after `/book`). Public, no auth.

### Page structure

```text
1. Hero
   • Badge: "Powered by Crewdle · AI orchestration & inventivity"
   • H1: "Dream & Learn — build, experiment, orchestrate your agentic ecosystem"
   • Subtitle: one-sentence promise
   • Primary CTA: "Try the live demo" → /#agentic-demo
   • Secondary CTA: "Book a discovery call" → Reclaim link

2. The three verbs (Build · Experiment · Orchestrate)
   3-card grid, one per verb. Each card:
     - Icon (Hammer / Beaker / Network)
     - 2-line definition
     - 3 bullet outcomes
     - Inline mini-illustration (svg, design-token themed)

3. How it works — 5-step flow
   Horizontal stepper:
   (1) Frame the brief → (2) Compose Dream agents →
   (3) Compose Learn agents → (4) Orchestrate the loop →
   (5) Ship + measure
   Each step: short paragraph + the Calm Magic axis it maps to
   (LOVE / MAGIC / CALM / OPEN / FREE) so it ties to existing ontology.

4. Dream vs. Learn — side-by-side
   Two columns:
     Dream agents (accent color): Vision · Storyteller · Speculator ·
       Mythographer · Composer — divergent, inventive, generative
     Learn agents (primary color): Researcher · Pattern · Critic ·
       Curator · Tutor — convergent, integrative, evidentiary
   Below: "The Orchestrator routes attention between the two halves."

5. Why Crewdle (the platform link)
   • Edge-AI execution close to the data
   • Consent + provenance preserved end-to-end
   • Distributed orchestration without vendor lock-in
   External link to crewdle.com with logo treatment
   Note: Jonathan Bélisle is Fractional CDO, leading the Dream & Learn module

6. Use cases (4-card grid)
   Mirrors the demo scenarios:
     • Onboard a new client
     • Generate a speculative scenario
     • Audit an AI policy
     • Run a Glitch session
   Each card → "See it in the demo" deep-link to /#agentic-demo

7. FAQ (collapsible, 4 items)
   - "Do I need to know how to code?"
   - "Where does my data live?"
   - "How does this connect to the Calm Magic board / PRD?"
   - "How do we start?"

8. Final CTA
   • Primary: Book discovery call
   • Secondary: Read the April Drift "Relationship Model"
   • Tertiary: View Crewdle
```

All form/contact CTAs route to existing flows — no new contact form (project rule already routes mail to jbelisle@helloarchitekt.com via existing Reclaim/contact components).

### Demo-section link

Update `src/components/AgenticEcosystemDemo.tsx`:
- Add a third button in the final CTA cluster: **"Learn about the Dream & Learn module" → `/dream-and-learn`**
- Add a small "Learn more" link in the header subtitle pointing to the same page.

### Landing page nav (optional, lightweight)

In `src/pages/LandingPage.tsx`, where the existing nav links live (no menu refactor), add a single inline link from the hero/services area to `/dream-and-learn`. If that adds noise, skip — the demo section's CTAs are sufficient.

### Files

- **Create**: `src/pages/DreamAndLearn.tsx` (~350 LOC, sections above)
- **Edit**: `src/App.tsx` — add `<Route path="/dream-and-learn" element={<DreamAndLearn />} />` + import
- **Edit**: `src/components/AgenticEcosystemDemo.tsx` — add the new "Learn about the module" CTA + header link

### Design tokens & rules

- All colors via tokens (`--primary` for Learn, `--accent` for Dream, `--foreground`/`--muted-foreground` for chrome). No hex.
- Reuse shadcn `Card`, `Button`, `Badge`, `Accordion` (FAQ), `Separator`.
- `framer-motion` micro-animations on the stepper + verb cards (already installed).
- Page wrapped in the same gradient background pattern used by `LandingPage` / `AboutUs` for visual consistency.
- Mobile: all grids collapse to single column; stepper becomes vertical timeline.
- Footer: import existing `Footer` component for consistency.
- Page title set via `document.title` in `useEffect`.

### Out of scope

- No new i18n keys for v1 — copy is English inline (per Bilingual Architecture rule, can be extracted later)
- No backend / Supabase changes
- No real Crewdle API integration — same conceptual framing as the existing demo