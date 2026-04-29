## Calm Magic — Public Demo Page

A new public, scrollytelling deep-dive at `/calm-magic-demo` that explains the **Relational Intelligence methodology** through recreated, in-app visual moments of the Calm Magic board (no auth, no real data). Linked from the landing nav and the Agentic Ecosystems hero.

### Why this approach
The real `/calm-magic-board` is auth-gated and dense. Instead of static screenshots that go stale, we recreate the key board surfaces as lightweight, read-only visual modules — they stay in sync with the design system and feel alive.

### Page structure (scrollytelling spine)

```text
┌──────────────────────────────────────────────────────────┐
│ 1. HERO                                                  │
│    "Calm Magic — A Relational Intelligence Methodology"  │
│    Animated 8×8 matrix bloom + tagline + 2 CTAs          │
├──────────────────────────────────────────────────────────┤
│ 2. THE PROBLEM                                           │
│    Why org transformation loops fail (3 short cards)     │
├──────────────────────────────────────────────────────────┤
│ 3. THE BOARD — anatomy of an 8×8 matrix                  │
│    Live mini matrix on left, annotated CHORDS / MAGIC    │
│    / MAPS axes on right (sticky scroll)                  │
├──────────────────────────────────────────────────────────┤
│ 4. THE 5 SEASONS                                         │
│    POLLENS → NOEMS → POEMS → TOTEMS → ANTHEMS            │
│    Horizontal stepper, each step reveals what unlocks    │
├──────────────────────────────────────────────────────────┤
│ 5. WINDOW OF TOLERANCE                                   │
│    Inner / Stretch / Edge zones — recreated visual       │
│    + 260-cycle expansion explainer                       │
├──────────────────────────────────────────────────────────┤
│ 6. THE TILE — relational unit                            │
│    Animated tile detail card flip showing emotional      │
│    check-in, hexagram, knowledge fragment                │
├──────────────────────────────────────────────────────────┤
│ 7. CONSTELLATION                                         │
│    Mini force-graph showing tile relationships emerging  │
│    into a PRD                                            │
├──────────────────────────────────────────────────────────┤
│ 8. PRD COMPILER                                          │
│    "The conversation IS the ontology" — 5 PRD layers     │
│    visualized as stacked translucent cards               │
├──────────────────────────────────────────────────────────┤
│ 9. BENEFITS                                              │
│    For the leader / For the team / For the org           │
├──────────────────────────────────────────────────────────┤
│ 10. CTA                                                  │
│    "Get a demo" (opens GetDemoDialog) +                  │
│    "Try the board" (→ /auth)                             │
└──────────────────────────────────────────────────────────┘
```

### What I'll build

**New page**: `src/pages/CalmMagicDemo.tsx` — scrollytelling layout with framer-motion reveals, gradient dividers, sticky-column sections.

**New section components** in `src/components/calm-magic-demo/`:
- `DemoHero.tsx` — animated 64-tile bloom, big editorial type
- `BoardAnatomy.tsx` — sticky 2-col: live `MinimalistTileMatrix` (read-only) + annotated CHORDS/MAGIC/MAPS axis labels with hover popovers
- `SeasonsStepper.tsx` — horizontal 5-step reveal, reusing `SEASONS` palette from `DemoBoardPreview`
- `ToleranceZones.tsx` — reuses `DemoBoardPreview` with annotated rings + 260-cycle copy
- `TileFlipShowcase.tsx` — single animated tile that flips to reveal emotional check-in / hexagram / fragment layers
- `ConstellationTeaser.tsx` — small D3 force graph (same lib as `AgenticEcosystemHero`) showing nodes coalescing into a PRD
- `PrdLayersStack.tsx` — 5 translucent stacked cards (POLLEN→EXECUTION) on parallax
- `BenefitsTriad.tsx` — 3-column benefits
- `DemoCTA.tsx` — wires up `GetDemoDialog`

**Reused existing components**: `DemoBoardPreview`, `MinimalistTileMatrix` (read-only mode), `GradientDivider`, `GetDemoDialog`, season palette from `seasonDefinitions.ts`.

**Routing**: register `/calm-magic-demo` as a public route in `src/App.tsx` (lazy-loaded, no `ProtectedRoute`).

**Navigation hooks**:
- Add a "See the methodology" link in the landing nav / `MobileSectionNav`
- Add a secondary CTA "See Calm Magic in action" on `AgenticEcosystemHero` linking to `/calm-magic-demo`
- Demo page CTAs route to `GetDemoDialog` (jbelisle@helloarchitekt.com per memory) and `/auth`

### Aesthetic
- Editorial: large serif-ish display headings (current font stack), generous whitespace, gradient dividers, dark-on-light with rose→purple→indigo accents from the seasons palette.
- Motion: framer-motion fade/slide on scroll, one signature animated element per section, no autoplay video.
- Mobile-first: sticky columns collapse to stacked, matrix scales to viewport width.

### Out of scope
- No real user data, no auth, no DB writes.
- No new edge functions (CTA reuses existing `send-demo-request`).
- No i18n for v1 (English-only) — can add `fr` strings in a follow-up if desired.

### Acceptance
- `/calm-magic-demo` loads publicly, no auth wall.
- All 10 sections render and animate on scroll (desktop + 390px mobile).
- "Get a demo" opens the existing dialog and submits successfully.
- Linked from landing nav and Agentic Ecosystems hero.
