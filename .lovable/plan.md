# Dedicated pages for each Residency archetype

One dynamic page driven by extended data — richer, easier to maintain than seven separate files. Route: `/residencies/:archetype`.

## Files

- **edit `src/data/residencies.ts`** — extend the `Residency` interface with: `tagline`, `manifesto[]`, `teacher`, `duration`, `format`, `practices[]` (name + description), `examples[]` (context + shift), `threshold`, `artifact`, `pairsWith[]`. Author full content for all 7 archetypes.
- **new `src/pages/ResidencyDetail.tsx`** — the page.
- **edit `src/App.tsx`** — lazy-import `ResidencyDetail`, add `<Route path="/residencies/:archetype" element={<ResidencyDetail />} />`.
- **edit `src/components/ResidenciesSection.tsx`** — change card anchors from `#residency-{id}` to `<Link to="/residencies/{id}">` so cards open the page; keep id anchor for direct deep-linking from the nav.
- **edit `src/pages/Index.tsx`** — change nav dropdown items from `href="#residency-..."` to `Link to="/residencies/..."`.

## Page structure (ResidencyDetail.tsx)

1. **Hero** — gradient backdrop tinted with the archetype's `hueFrom`/`hueTo`, glyph, name, tagline, and a 3-up of Teacher / Duration / Format.
2. **Manifesto** — 3 numbered, large-typography statements that name the philosophy of that element.
3. **For leaders facing / Gesture trained** — two-column band, bordered.
4. **Core practices** — 3 cards: each with a name and a concrete weekly/daily practice.
5. **From the field** — 2 anonymized "Context → Shift" case examples.
6. **Threshold + Artifact** — 2 panels: the inner shift, and the tangible thing the leader carries back.
7. **Pairs with** — chips linking to the 2 sister archetypes.
8. **CTA** — "Request an invitation" → `mailto:jbelisle@helloarchitekt.com` (per the central lead-gen rule).
9. **Prev / Next** — circular nav across the seven.

## Content authored (highlights)

Every archetype gets distinct, non-generic copy. Examples:

- **Forest** — "Strategy at the speed of mycelium." Practices: canopy mapping, mycelial inventory, composting failures. Threshold: *you stop asking 'how do we move faster?' and start asking 'what is this season for?'*
- **River** — "Direction without forcing." Practices: path-of-least-resistance audit, flow journaling, bottleneck dissolution.
- **Lake** — "The surface that thinks." Practices: 24-hour pond, mirror practice, depth questions.
- **Mountain** — "Geological time, executive body." Practices: hundred-year letter, posture as policy, visible without explaining.
- **Ocean** — "Capacity at the scale of cycles." Practices: tide-mapping, multitude rehearsal, volume over velocity.
- **Storm** — "Productive turbulence." Practices: charge mapping, generative conflict, lightning protocol. Integrates with GL!TCH sessions.
- **Sun** — "Generosity at the scale of climate." Practices: sustainable burn, climate audit, photosynthesis protocol.

Pairings: forest↔lake/mountain, river↔lake/ocean, lake↔forest/mountain, mountain↔forest/sun, ocean↔river/storm, storm↔river/ocean, sun↔mountain/lake.

## Aesthetic

- Each page reads like an editorial — generous whitespace, large light-weight headings, italic taglines, hairline dividers.
- Backdrop tints are derived from each archetype's HSL pair (no per-archetype CSS file needed).
- Honors existing semantic tokens (`background`, `foreground`, `muted`, `border`, `card`).
- Mobile-first; sections scale gracefully at 390px.

## Out of scope

- CMS-backed content
- Booking/availability calendar
- Per-archetype illustrations (placeholders use the existing emoji glyph; can be replaced with custom artwork later)

Approve and I'll implement.