# Aesthetic Refresh: "Static Bloom" — 1980 Shoegaze × VHS × Collage

A site-wide visual language. Teenage courage, blurred guitars, torn-paper collage, scanline VHS warmth, parallax depth. Implemented as design tokens + reusable primitives so every page inherits it without rewriting business logic.

## Visual language

- **Palette (HSL tokens in `index.css`)**: bruised magenta, sodium-lamp amber, acid teal, tape-noise cream, deep-violet shadow. Replaces today's slate/fuchsia hardcodes.
- **Type pairing**: Display = `Monument Extended` or `Redaction` (heavy, condensed, slightly crushed). Body = `Inter Tight`. Accent = `VT323` for VHS overlays/timestamps. Loaded via Google Fonts in `index.html`.
- **Texture layer**: animated grain, scanlines, chromatic-aberration offset, soft bloom — as CSS utilities + one canvas-free SVG noise layer.
- **Collage motifs**: torn-paper edges, halftone dots, tape strips, marker scrawl — as small SVG primitives.
- **Motion**: parallax on scroll, lazy chromatic-aberration on hover, gentle "tape wobble" on hero text.

## Deliverables

### 1. Tokens & globals (foundation — touches every page)
- `src/index.css`: rewrite color tokens (HSL), add gradient + shadow tokens, add `--noise`, `--scanline`, `--bloom` utilities, add font-face wiring.
- `tailwind.config.ts`: add font families, new semantic colors, keyframes (`tape-wobble`, `chroma-shift`, `scan`, `flicker`, `parallax-float`).
- `index.html`: preload Google Fonts.

### 2. Reusable primitives (`src/components/aesthetic/`)
- `GrainOverlay.tsx` — full-screen SVG noise (fixed, pointer-events-none).
- `ScanlineOverlay.tsx` — toggleable VHS scanlines.
- `ChromaText.tsx` — text with RGB-split hover/idle animation.
- `TornCard.tsx` — card wrapper with torn-paper edges + tape strip.
- `ParallaxLayer.tsx` — wraps children, translates Y on scroll (rAF-based, respects `prefers-reduced-motion`).
- `VHSBadge.tsx` — corner timestamp/REC dot for hero areas.

### 3. Layout shell
- Mount `GrainOverlay` once in `App.tsx` so every route gets the texture.
- Add a subtle scanline layer behind heroes via a body class.

### 4. Apply to flagship surfaces (visible proof)
- `LandingPage.tsx` hero: ChromaText headline, parallax collage layers, VHS badge.
- `BookLaunch.tsx` hero + `LivingManuscriptBand` + `BookOfferTiers`: TornCard treatment, gradient backgrounds via tokens.
- `BookChapter.tsx` + `ReaderProgressBar`: scanline header, marker-style progress fill, ChromaText chapter title.
- `BookChapterIndex.tsx`: collage card grid.
- Replace remaining hardcoded `slate-*` / `fuchsia-*` in book components with new semantic tokens.

### 5. Light pass on shared chrome
- `Footer.tsx`, `LanguageSwitcher`, `BookAnnouncementBanner`: token-only color swap so they sit in the new palette without restructuring.

## Out of scope (this pass)
- No changes to data/edge functions, auth, routing, or copy.
- No refactor of admin console (`/book/manuscript`) beyond inheriting the new tokens.
- Deep redesign of every page beyond shared chrome — pages auto-inherit via tokens; bespoke per-page collage will come on request.

## Technical notes
- All colors HSL via tokens — zero new hex/`text-white` in components I touch.
- Parallax + chroma effects gated behind `prefers-reduced-motion`.
- Grain/scanline overlays use `mix-blend-mode: overlay` with low opacity (~6–10%) so legibility stays intact.
- Fonts loaded with `display=swap`; fallback stack keeps FCP clean.

## Risk / size
Foundation + primitives + 4 flagship surfaces. Roughly 12–15 files touched. Other pages will look subtly warmer immediately via token inheritance, then can be polished page-by-page on follow-up.
