## Goal
Add subtle photographer/credit lines to every retreat & residency image, plus a dedicated `/credits` page linked from the footer that consolidates all attributions.

## Step 1 — Centralized credit registry
Extend `src/assets/retreats/index.ts` with a typed `ImageCredit` record per photo:
```ts
type ImageCredit = {
  slug: string;          // matches import key
  photographer: string;
  year?: string;
  location?: string;
  event?: string;        // e.g. "Banff Centre residency"
  note?: string;
};
export const retreatImageCredits: Record<keyof typeof retreatImages, ImageCredit> = { ... };
```
All eight entries seeded with `photographer: "TBD"` placeholders that you fill in (see Step 5).

Helper: `formatCredit(c) => "Photo: {photographer}{, location}{, year}"`.

## Step 2 — Subtle caption credits
Append the formatted credit to existing figcaptions, separated by an em-dash, in:
- `src/components/SomaticCreativityRetreat.tsx` (hero + 3 movement rows + any other img)
- `src/components/ResidenciesSection.tsx` (wide ambient strip)
- `src/pages/ResidencyDetail.tsx` (archetype hero)

Style: same `text-xs text-muted-foreground tracking-wide` already used; credit rendered in slightly lower opacity (`opacity-70`) so it reads as metadata, not narrative.

## Step 3 — `/credits` page
New `src/pages/Credits.tsx`:
- Header: "Image credits & sources"
- Short paragraph explaining provenance (Hello Architekt / Paracosm archive, retreats 2017–present)
- Grid of all 8 photos as 200px thumbnails with: filename slug, photographer, location, year, event
- Grouped sections: "Retreats" / "Residencies (archetype heroes)"
- Back link to home

Register route in `src/App.tsx` and `src/lib/routeRegistry.ts` (label: "Credits").

## Step 4 — Footer link
Locate global footer (likely `src/components/Footer.tsx`); add a small "Credits" link in the secondary/legal row alongside existing links. Subtle, no visual weight change.

## Step 5 — Per-photo metadata you provide
Once the plan is approved I'll list each of the 8 slugs with a fill-in template so you can drop in photographer, year, location, and event in one message; I then patch `retreatImageCredits` accordingly. Any photo still missing data falls back to `"Paracosm archive"` to avoid blanks.

## Out of scope
- EXIF extraction, licensing badges, alt-text rewrites, i18n of the credits page, OG image changes.

## Files touched
- `src/assets/retreats/index.ts` (extend)
- `src/components/SomaticCreativityRetreat.tsx`
- `src/components/ResidenciesSection.tsx`
- `src/pages/ResidencyDetail.tsx`
- `src/pages/Credits.tsx` (new)
- `src/components/Footer.tsx` (or equivalent)
- `src/App.tsx`, `src/lib/routeRegistry.ts`
