# Complete the "Think Like a Forest" section

The section on `/events-and-retreats` (`src/pages/EventsAndRetreats.tsx`, block `#think-like-a-forest`) is currently just a headline, one paragraph, and a CTA. Rich source material for this retreat already exists in `src/data/residencies.ts` (the `forest` archetype: manifesto, teacher, duration, format, practices, examples, threshold, artifact) and the forest hero image is in `src/assets/retreats/forest-circle.jpg`.

## What to build

Expand the `night`-toned `#think-like-a-forest` section into a full editorial block that keeps the current partnership framing (Les Hédonistes × Create Yourself) and layers in the existing forest content, while preserving the editorial magazine aesthetic (no purple/blue gradients, no bloom).

Proposed structure inside the same `EditorialSection tone="night"`:

1. **Header row** (kept): numeral `03`, kicker "Flagship retreat", H2 "Think Like a Forest.", partnership paragraph, "Dates & location — TBA" caption, "Read the invitation" CTA. Move CTA to bottom of the block.
2. **Editorial image** — full-width `forest-circle.jpg` with a small italic caption ("Cohort circle, Banff. Outdoor council under the canopy." — already in `residencyImageCaption.forest`) and inline photo credit via `formatCredit(residencyImageCredit.forest)`.
3. **Manifesto pull-quotes** — the three lines from `residencies[forest].manifesto` rendered as large serif italic statements, separated by hairline dividers.
4. **Two-column meta strip** — "Teacher", "Duration", "Format" as small kicker/label pairs (source: `teacher`, `duration`, `format`).
5. **Three practices grid** — `residencies[forest].practices` (Canopy mapping, Mycelial inventory, Composting failures) as a 3-column editorial grid matching the highlights style used on `ParacosmRetreatLanding`.
6. **Threshold + artifact** — two short blocks: "The threshold" (`threshold`) and "What you leave with" (`artifact`).
7. **CTA row** — keep the existing "Read the invitation" mailto and add a secondary ghost link to `/residencies/forest` ("Explore the full residency") since the forest residency detail page already exists.

## Technical notes

- Single-file change: `src/pages/EventsAndRetreats.tsx`.
- Import `residencies` from `@/data/residencies` and pick `forest`; import `residencyImage`, `residencyImageCaption`, `residencyImageCredit`, `formatCredit` from `@/assets/retreats`.
- Reuse existing editorial primitives (`editorialType`, `editorialTone.night`, `EditorialCTA`) — no new components, no new tokens.
- Keep all copy verbatim from `residencies.ts` (already user-approved content) to avoid inventing new voice.
- No i18n keys needed (surrounding section is already English-only inline copy).
- No changes to data, routes, or backend.
