## Goal

Make each `/residencies/:archetype` page easier to navigate and share by adding a breadcrumb trail and a share/copy-link control.

## Changes

### 1. Register residency routes in the route registry
File: `src/lib/routeRegistry.ts`

Add two entries so the existing breadcrumb system (and JSON-LD) recognizes residency pages:

- `{ path: "/residencies", label: "Residencies" }` (links back to `/#residencies` via a small fallback, or simply labels the segment)
- `{ path: "/residencies/:archetype", label: (p) => <archetype name>, parent: "/residencies" }`

The label function will look up the archetype's `shortName` from `src/data/residencies.ts` so the trail reads `Home / Residencies / Forest`.

### 2. Add a Breadcrumbs UI component
File: `src/components/ResidencyBreadcrumbs.tsx` (new, small wrapper)

Uses the existing shadcn `Breadcrumb` primitives plus `useAutoBreadcrumbs()` to render the trail. Styled to sit cleanly on top of the tinted hero (muted foreground, hover to foreground, last item non-link).

### 3. Add a Share button
Inline in `src/pages/ResidencyDetail.tsx`, placed in the hero next to the existing "All residencies" link.

Behavior:
- If `navigator.share` is available (mobile), call it with `{ title, text: tagline, url }`.
- Otherwise, copy the canonical URL to clipboard via `navigator.clipboard.writeText` and show a toast ("Link copied").
- Uses `Share2` / `Check` icons from lucide-react and the existing `useToast` hook.
- Canonical URL built from `window.location.origin + /residencies/{id}`.

### 4. Wire into ResidencyDetail
File: `src/pages/ResidencyDetail.tsx`

In the hero block, replace the single "All residencies" back link with a row containing:
- `<ResidencyBreadcrumbs />` on the left
- Share button on the right

Keep the existing back-to-top scroll and hero gradient untouched. No changes to data, routing, or other sections.

## Out of scope

- No changes to `ResidenciesSection` or homepage navigation.
- No new dependencies.
- No changes to data schema.
