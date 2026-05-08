## Goal

Bring the site to life with the 8 uploaded retreat photographs, placed elegantly (editorial, not gallery-dump), and reframe the surrounding copy so the imagery clearly advances the **Calm Magic relational intelligence** thesis.

## 1. Asset pipeline

The uploads are JPG/PNG images wrapped inside PDFs. Extract once at build-time prep:

- For each `user-uploads://*.pdf`, run `pdfimages -j` (poppler) into `src/assets/retreats/`, then rename to semantic slugs:
  - `atelier-circle.jpg`
  - `forest-listening.jpg`
  - `river-movement.jpg`
  - `ocean-threshold.jpg`
  - `mountain-stillness.jpg`
  - `storm-rupture.jpg`
  - `sun-emergence.jpg`
  - `lake-reflection.jpg`
- Optimize (target <300KB each, max 1600px long edge) via `cwebp`/`sharp` — keep `.jpg` for photographic warmth.
- Import as ES6 modules in components (no `/public` references).

If a slug → photo mapping feels off after extraction, I'll re-pair based on actual content; the file names above are the seven archetypes + the atelier hero.

## 2. SomaticCreativityRetreat — editorial reshape

Current layout: 5/7 split, text + 3 movement cards. Upgrade to a quiet editorial composition:

```text
┌─────────────────────────┬───────────────────────┐
│  EYEBROW                │   [tall portrait img] │
│  Headline (lg, light)   │   atelier-circle      │
│  Lede                   │                       │
│  CTAs                   │                       │
├─────────────────────────┴───────────────────────┤
│  MOVEMENT 01 Listen      [landscape img right]  │
│  MOVEMENT 02 Move        [landscape img left]   │
│  MOVEMENT 03 Make        [landscape img right]  │
└─────────────────────────────────────────────────┘
```

- Each movement row alternates image side (zigzag), uses `aspect-[4/5]` or `aspect-[3/2]`, soft `rounded-2xl`, subtle `shadow-[0_30px_60px_-30px_hsl(var(--foreground)/0.25)]`, and a thin caption underneath in tracked uppercase.
- Add a one-line **Calm Magic bridge** under the headline: *"A relational intelligence practice — the somatic root of the Calm Magic framework."* with a small inline link to `/calm-magic-demo` (or current Calm Magic anchor).
- Respect `prefers-reduced-motion`; otherwise fade-in on scroll via existing `useScrollReveal` hook.

## 3. ResidencyDetail — hero photograph

On `/residencies/:archetype`, add the matching archetype photo to the hero band:

- Right column of the existing tinted hero: `aspect-[4/5]` image with the archetype's HSL gradient as a 1px ring + soft duotone overlay using `mix-blend-multiply` tinted with `hueFrom`.
- Falls back gracefully if no photo is mapped (current layout unchanged).
- Mapping lives in `src/data/residencies.ts` as an optional `image?: string` field; only populate the 7 archetype slugs.

## 4. ResidenciesSection (homepage) — single ambient photo

Add one wide ambient photo (`atelier-circle.jpg`) above the archetype grid, full-bleed within container, `aspect-[21/9]`, with the relational-intelligence tagline overlaid bottom-left in the existing display font. No other layout changes — keeps the section scannable.

## 5. Copy: Calm Magic relational intelligence thread

Tighten three short copy spots (no new sections):

- **Somatic retreat lede** — add the bridge sentence above.
- **Residencies section intro** — append: *"Each archetype is a doorway into Calm Magic's relational intelligence — a way of leading that the nervous system can actually sustain."*
- **ResidencyDetail intro paragraph** — one sentence linking the archetype's posture to a Calm Magic axis (MAGIC / LOVE / CALM / OPEN / FREE) using the existing `driftAxisThematicMapping` memory.

## 6. Out of scope

- No changes to navigation, routing, data schema beyond optional `image` field, or i18n keys.
- No new dependencies.
- No changes to `ParacosmRetreatSection` (Azores flagship) — separate visual identity.

## Technical notes

- Files touched: `src/assets/retreats/*` (new), `src/components/SomaticCreativityRetreat.tsx`, `src/components/ResidenciesSection.tsx`, `src/pages/ResidencyDetail.tsx`, `src/data/residencies.ts`.
- Image extraction is a one-time local step; the committed assets are what ship.
- All colors stay on semantic tokens; tints derived from each residency's existing `hueFrom`/`hueTo`.
