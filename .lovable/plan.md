# Convincing Triad on the Home Landing

Quick answer to your aside: the third word in your approach trio is **Knowledge Objects** — the full sequence is **Real Intelligence → Knowledge Objects → Understanding**.

## Goal

Make the Home page (`/`) immediately convince a visitor that Paracosm offers a single coherent arc across three offerings:

- **Foreplay** — Trainings (warm-up, attunement, capability)
- **Foresight** — Vision Retreats (sense the preferable future)
- **Forecast** — Prototype Residencies (build evidence of it)

Lead with the F-words. Trainings/Retreats/Residencies sit as the operational labels underneath.

## What changes

1. **New section component**: `src/components/landing/OfferingTriadSection.tsx`
   - Placed on `/` (Index page) directly after the hero, before any existing offering or framework blocks.
   - Three large cards in a responsive grid (stacked on mobile, 3-col on lg+).
   - Each card:
     - Large F-word as display headline (Foreplay / Foresight / Forecast)
     - Operational label as eyebrow (TRAININGS · VISION RETREATS · PROTOTYPE RESIDENCIES)
     - One-sentence promise
     - 3 concise "what you leave with" bullets
     - CTA linking to `/trainings`, `/events-and-retreats` (Azores anchor), `/residencies` respectively
   - Visual treatment uses the existing bloom palette (magenta/amber gradients on ink), framer-motion stagger on scroll-in, no new dependencies.

2. **Section header above the triad**
   - Eyebrow: `// THE ARC`
   - H2: "One practice, three intensities."
   - Sub: "From warm-up to evidence — the Paracosm path moves teams from attunement (Foreplay) through vision (Foresight) into built prototypes (Forecast)."

3. **Case-studies excerpt as proof**
   - Below the triad, mount the existing `CaseStudiesSection` (already used on `/events-and-retreats`) in a compact 3-card preview variant if a `limit` prop exists, otherwise wrap it. Adds a "View all case studies →" link to `/case-studies`.

4. **Home page wiring**
   - Edit `src/pages/Index.tsx` (or whichever component renders `/`) to import and render `OfferingTriadSection` and the case-studies excerpt in the correct slot.
   - Update `usePageSeo` description on Home to mention the triad for SEO.

## Out of scope

- No changes to `HeroSection.tsx` itself (still rotates Design/Deploy/Scale/Govern).
- No changes to Trainings/Retreats/Residencies detail pages.
- No backend, schema, or i18n key restructuring. New English copy goes inline; FR mirror can be added in a follow-up if you want.
- No new logo assets — uses existing tokens; respects the white-background Paracosm lockup rule.

## Technical notes

- Tokens only: `hsl(var(--bloom-ink))`, `hsl(var(--bloom-magenta))`, `hsl(var(--bloom-amber))`, `--foreground`, `--muted`. No raw hex.
- `framer-motion` already in the project — use `motion.div` with `whileInView` for the stagger.
- All three CTAs route via `react-router-dom` `<Link>` (no full reloads).
- Confirm exact routes before wiring: `/trainings`, `/events-and-retreats`, and the residency route (`/residencies` or `ResidencyDetail`-based). I'll verify in build mode and adjust.

## Files touched

- create `src/components/landing/OfferingTriadSection.tsx`
- edit `src/pages/Index.tsx` (or the file that renders `/`)
