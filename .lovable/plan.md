## Goal

Make breadcrumbs a derived value of the route graph instead of a hand-maintained array per page. JSON-LD `BreadcrumbList` will always match the visible navigation because both come from the same source.

## Approach

### 1. New `src/lib/routeRegistry.ts` — single source of truth

A typed array of `RouteMeta` describing every canonical/shareable route:

```ts
interface RouteMeta {
  path: string;                          // "/drift/library/:axis"
  label: string | ((params) => string);  // "Drift Library — MAGIC"
  parent?: string | null;                // "/drift" (defaults to "/")
}
```

Registry covers all public routes currently in `App.tsx`: `/`, `/about-us`, `/case-studies`, `/pricing`, `/book`, `/glitch-methodology`, `/calm-magic-demo`, `/dream-and-learn`, `/paracosm-retreat`, `/wuxia`, `/tonalli`, `/tarot`, `/pattern-encyclopedia`, `/agentic-ux`, `/design-system`, plus the `/drift/*` and `/calm-magic-board/*` hierarchies.

Exports:
- `breadcrumbsFor(pathname): BreadcrumbItem[]` — matches pathname against patterns (supports `:params`), walks the `parent` chain up to Home.
- `labelForPath(pathname): string | undefined` — single label lookup.

Self-contained pattern matcher (no extra deps). Always prepends Home unless the path itself is `/`. Falls back to `[{ name: "Home", path: "/" }]` for unknown routes.

### 2. Auto-breadcrumb hook `src/hooks/useAutoBreadcrumbs.ts`

```ts
const useAutoBreadcrumbs = () => {
  const { pathname } = useLocation();
  return useMemo(() => breadcrumbsFor(pathname), [pathname]);
};
```

Optional convenience for visible UI breadcrumbs later.

### 3. Extend `usePageSeo` to auto-inject breadcrumbs

Add an opt-in flag `autoBreadcrumb?: boolean` (default `true`):
- When `true` and no manually-supplied `BreadcrumbList` exists in `jsonLd`, call `breadcrumbsFor(path)` and append a `breadcrumbSchema(...)` to the injected JSON-LD.
- When `false`, behave exactly as today.
- Detect existing `BreadcrumbList` by checking `@type === "BreadcrumbList"` in the supplied schemas to avoid duplicates.

This means new pages get correct breadcrumb JSON-LD for free as soon as they call `usePageSeo({ path: "/foo" })`.

### 4. Remove redundant `breadcrumbSchema(...)` calls

In each canonical page that currently passes a hand-rolled breadcrumb (Landing, CalmMagicDemo, DreamAndLearn, ParacosmRetreatLanding, GlitchMethodology, BookLaunch, Pricing, AboutUs, CaseStudies, WuxiaTheFox, Tonalli), drop the `breadcrumbSchema([...])` entry from `jsonLd` and rely on the automatic injection. Keep all other schemas (Product / Article / Event / etc.) untouched.

### 5. Validation

- Type-check via the build.
- Manually verify in browser devtools on `/`, `/calm-magic-demo`, `/dream-and-learn`, `/calm-magic-board/prds/abc` that exactly one `BreadcrumbList` JSON-LD block is emitted and the trail matches what the user would visually expect (Home → … → current).

## Out of scope

- Visible breadcrumb UI components (registry + hook are ready when you want them; not adding them to layouts now).
- Localized labels (English only for now; can swap to `t()` keys later by changing `RouteMeta.label`).
- Auth/admin-only routes outside the public set above.
