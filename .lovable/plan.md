# Add Discovery Call CTA to Hero

The Landing page hero (`FrameworkHero.tsx`) currently has two CTAs:
1. "See how the method works" (primary, scrolls to method)
2. "Book a Clarity Sprint" (outline, mailto)

## Change

Promote a **"Book a Discovery Call"** CTA as the primary action — the highest-intent conversion path for new visitors who want to talk.

- Add a new **primary** Button: **"Book a Discovery Call"** with a `Calendar` icon, as the first button in the CTA row.
- Demote "See how the method works" to `variant="secondary"` (still scrolls to method).
- Keep "Book a Clarity Sprint" as `variant="outline"` (tertiary).
- Routes to `mailto:jbelisle@helloarchitekt.com?subject=Discovery%20Call%20—%20Paracosm` per the project's lead-routing rule.

## Files touched

- edit `src/components/landing/FrameworkHero.tsx` — reorder/relabel the 3 CTA buttons in the existing flex row.

## Out of scope

- No new routes, no calendar embed (mailto only, matching existing pattern).
- No copy changes elsewhere on the page.
