
# Homepage rebuild: Calm Magic as the Learning & Inventive Organization framework

## Positioning correction

Calm Magic = the **framework** that turns an enterprise into a **Learning & Inventive Organization**.
The Agentic Era UX Design Method is *how* it's practiced (Ask → Map → Invent → Ship on the board).

Headline shifts from "Learning Organizations" (vague) to:
**"Calm Magic — the framework that turns your enterprise into a Learning & Inventive Organization."**

Sub: *"Educate and invent with AI by mapping your real questions onto a living ontology — the Calm Magic board."*

## New homepage structure

```text
1. FRAMEWORK HERO
   H1: Calm Magic
   H2: The framework that turns your enterprise into
       a Learning & Inventive Organization.
   Inline Resonance input → live board mapping
   → PathSuggestion (Lead · Make · Heal)

2. WHY ENTERPRISES NEED THIS (3 cards)
   - Learning gap: AI moves faster than your org learns
   - Invention gap: roadmaps kill emergence
   - Coherence gap: tools without ontology = automated chaos

3. THE FIVE AXES (AxisLegend)
   MAGIC · LOVE · CALM · OPEN · FREE
   "Every question, team, and product lives somewhere on these five."

4. HOW IT WORKS — Agentic Era UX Design Method
   Ask → Map → Invent → Ship
   Question → Calm Magic Board → PRD → Foundational Prompt
   Each step links to the surface that does it.

5. THREE PATHS INTO THE FRAMEWORK
   Lead (executives / governance)  → /agentic-ux
   Make (designers / inventors)    → /calm-magic-demo
   Heal (teams / relational)       → /calm-magic-assistant

6. PROOF — one quote, one outcome metric (above the fold of section)

7. CLARITY SPRINT — Spring 2026 (kept, tightened)

8. Existing collapsibles kept below: Book · Universe · Events ·
   Coaching · Transformation · Partners · FAQ · Contact
```

## What gets built (Sprint A)

### Edits
- **`src/pages/LandingPage.tsx`** — replace hero block (lines ~120–186) with `<FrameworkHero />`. Insert new sections 2–5 between hero and the existing Spring 2026 offer. Keep collapsibles intact.
- **`src/i18n/en/landing.json`** — add new keys: `framework_h1`, `framework_h2`, `gap_learning`, `gap_invention`, `gap_coherence`, `axes_intro`, `method_steps_*`, `paths_lead/make/heal_*`. French keys can be filled in next pass.

### New components
- `src/components/AxisLegend.tsx` — reusable five-axis strip, reads `AXIS_LABEL` + `AXIS_BLURB` from `src/lib/resonance.ts`
- `src/components/landing/FrameworkHero.tsx` — H1/H2 + inline `<QuestionResonancePanel />` + result + `<PathSuggestion />`
- `src/components/landing/EnterpriseGaps.tsx` — three-card gap section
- `src/components/landing/MethodSteps.tsx` — Ask → Map → Invent → Ship, each with link to the surface that performs it
- `src/components/landing/ThreePaths.tsx` — Lead / Make / Heal cards replacing the two stacked gradient buttons

### Not in this sprint
- Route renames (`/method`, `/board`) — Sprint B
- Public Calm Magic board (un-gating `/calm-magic-demo`) — Sprint B
- Nav consolidation from 8 links to 4 — Sprint B
- French translations of new keys — Sprint C
- Contact form audit — Sprint C

## Why this is the obvious call

- **Truth in labeling**: Calm Magic stops being a mysterious product name and becomes a clear enterprise framework promise.
- **Show, don't tell**: hero lets the visitor *use* the framework (drop a question, watch the board respond) instead of reading copy about it.
- **Coherent spine**: every existing surface — Resonance, board, PRD, Foundational Prompt, paths, Drift, Tarot — slots into Ask/Map/Invent/Ship without renaming or relocating anything.
- **Lead-gen safe**: all CTAs route to `jbelisle@helloarchitekt.com` or to existing pages that do.

## Risk

- Hero becomes taller on mobile (390px). Mitigation: input above the fold, result/paths stack below.
- Resonance edge function is hit on every homepage submission — already rate-limited and sanitized.
- Adds ~5 new files; no deletions, no schema changes, no dependency changes.

## Approval

Approve to implement Sprint A as scoped. Sprints B (route + nav cleanup, public board) and C (i18n, contact audit, copy pass) follow as separate plans once this lands.
