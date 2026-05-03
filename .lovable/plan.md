## Vision

Position Calm Magic as **the** framework where teams *dream* (inventivity — generating novel possibility) and *learn* (expressivity — articulating, embodying, and circulating it). The Dream Mode + 5-axis board already exist; this plan strengthens the loop so every PRD upload becomes a memorable, shareable, replayable act of invention and expression.

Anchored in existing memory: Conversation-as-Ontology, Emergence-not-Force, Feminine Design Principles, Calm Magic 5-axis (LOVE / MAGIC / CALM / OPEN / FREE), 260-tile window-of-tolerance, Intention Design (no premature tooling).

---

## Pillars & Tasks

### 1. Inventivity Engine — make dreaming generative, not descriptive
Today Dream Mode narrates an existing PRD. To rank as an inventivity framework, it must *expand* the PRD.

- **Divergent moves per axis**: after each axis narration, Gemini emits 2–3 "what if" provocations (counterfactuals, inversions, weird combinations) tied to lit tiles. Stream as `axis_provocation` SSE events.
- **Inventivity score**: surface a per-axis novelty metric (semantic distance between PRD text and the chosen tile cluster). Persist on `dream_runs.axes[i].inventivity`.
- **Re-dream from a provocation**: one-click "dream again from this provocation" that re-runs the sequence with the provocation injected as additional context.
- **Pollen capture**: every provocation can be saved as a `polen_entries` row (already in schema) tagged with the dream_run id, feeding the existing Polen → Noem → Poem pipeline.

### 2. Expressivity Layer — make learning embodied and shareable
Expressivity = the ability to render insight in many modalities.

- **Multi-modal rendering of a dream**: from a saved `dream_run`, generate (a) a 1-page poetic PDF, (b) a 5-card carousel image set (Gemini image), (c) a 60-sec voice narration (TTS) using existing `WuxiaVoiceAgent` patterns. Add a "Render as…" menu on `/dream/:slug`.
- **Replay animation**: add the staggered axis-by-axis narration replay to `DreamShare.tsx` (toggle, default static).
- **OG/social meta**: `usePageSeo` integration on share page with summary + generated card image so links preview cleanly.
- **Inline expressivity prompts**: small "say it as a haiku / a system diagram / a child's bedtime story" buttons on each axis card that re-express that axis's narration. Reuses existing edge function with a re-express system prompt.

### 3. Learning Loop — close dreaming back into compounding knowledge
- **Maturity diff over time**: when the same project re-dreams, store the previous `overall_maturity` and chart deltas. New tab on PrdEditor: "Maturity trajectory".
- **Tile mastery tracking**: every lit tile in a dream increments a counter on a new `user_tile_affinity` view (built from `polen_entries` + `dream_runs.axes`). Drives the existing 260-cycle window-of-tolerance progression.
- **Suggested next dream**: server-side function picks the lowest-maturity axis and proposes a question to dream from next time.

### 4. Discoverability & Onboarding — make first dream magical
- **Public gallery of dreams**: `/dreams` index of `is_public = true` runs with axis sparkline preview. Drives organic SEO and inspiration.
- **Curated example dreams**: 6 seeded canonical dreams (one per archetype: artist, founder, policymaker, healer, educator, child) accessible without auth.
- **3-step onboarding for Dream Mode**: prompt → upload-or-paste → dream. Skip the current PRD-required gate; allow free-text "intent" as fallback so first-time visitors can dream in <60 s.
- **DreamAndLearn page CTA upgrade**: replace the "book a call" terminal CTA with "Dream now" that drops users into the live sequence, then offers booking after the first dream.

### 5. Pedagogy — teach the framework while using it
- **In-axis micro-lessons**: each axis card on the share page shows a 2-line definition of what LOVE/MAGIC/CALM/OPEN/FREE *means as an inventivity & expressivity register*. Links to existing encyclopedia entries.
- **"Why these tiles?" explainer**: collapsible per-axis section explaining the deterministic tile picks in plain language (semantic anchors, not hash details).
- **Glossary tooltips**: hover any term (Pollen, Noem, Poem, Totem, Anthem) anywhere in dream UI → definition popover.

### 6. Trust & Lead Capture (per project core rule)
- **Save-to-account prompt**: after a public dream, gentle CTA "claim this dream" → email capture routed to jbelisle@helloarchitekt.com, links the run's `user_id`.
- **Newsletter hook on share page**: "Get one new dream prompt a week" → same routing.

---

## Implementation Order (suggested)

1. **Quick wins** (1 PR each): replay toggle + OG meta on `/dream/:slug`; "Dream now" CTA on DreamAndLearn; glossary tooltips.
2. **Inventivity engine**: edge function changes for `axis_provocation` + inventivity score; client renders provocations; "re-dream from provocation".
3. **Expressivity rendering**: PDF / image carousel / voice exports; "say it as…" re-express buttons.
4. **Learning loop**: `user_tile_affinity` view, maturity trajectory chart, suggested next dream.
5. **Discoverability**: public gallery, seeded example dreams, simplified onboarding.
6. **Pedagogy**: micro-lessons, "why these tiles?" explainers.
7. **Lead capture**: claim-this-dream + newsletter hook.

---

## Technical Notes

- **DB additions** (single migration):
  - `dream_runs.axes[].inventivity numeric` (stored inside existing jsonb, no schema change)
  - `dream_runs.parent_run_id uuid null` for re-dreams lineage
  - View `user_tile_affinity` aggregating from `dream_runs` + `polen_entries`
- **Edge functions**:
  - Extend `dream-prd-analysis` tool schema with `provocations: string[]` and `inventivity: number` per axis
  - New `dream-reexpress` function: takes axis narration + style → returns reformulated text
  - New `dream-render` function: orchestrates PDF/image/voice generation via Lovable AI Gateway
- **Client**:
  - `DreamShare` upgraded with replay toggle, OG meta via `usePageSeo`, render menu, claim CTA
  - New `/dreams` index page
  - New `DreamProvocations` subcomponent in `dream/`
- **Constraints respected**: no premature tooling selection inside dreaming UI (Intention Design); contact routing to jbelisle@helloarchitekt.com; no `ml5`; fabric v7 rules unaffected (no canvas changes here).

---

## Definition of "best framework for dreaming and learning about inventivity & expressivity"

A user with no account can, in under 5 minutes:
1. Dream a PRD or an intent and get a 5-axis inventivity reading with provocations.
2. Re-express any axis as poem, diagram, or voice.
3. Share a permanent URL that previews beautifully and replays.
4. See their maturity trajectory across multiple dreams.
5. Find inspiration from a public gallery and dream their own variant.

When all 7 implementation groups are shipped, this is true.
