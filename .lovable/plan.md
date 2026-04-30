## Goal

Generate `public/sitemap.xml` automatically from the route registry (and the dynamic data sources for parameterised routes) so search engines always see an accurate, up-to-date list of canonical URLs.

## Approach

Vite SPAs serve `public/` as static assets, so a sitemap must exist on disk before deploy. Best fit: a **Vite plugin** that writes `dist/sitemap.xml` at build time and also serves `/sitemap.xml` during `vite dev` so it's testable locally. The same generator powers both code paths.

## Changes

### 1. New module — `src/lib/sitemap.ts`

Pure function `buildSitemapXml({ host? })` that:
- Iterates `ROUTE_REGISTRY` and includes every entry whose `path` has **no `:param` segments** (static canonical pages).
- Expands the two known dynamic patterns:
  - `/drift/library/:axis` → one URL per `DriftToolAxis` value (`love | magic | calm | open | free`), imported from `src/data/driftTools.ts`.
  - `/drift/:year/:month` → derived from the unique `(year, month)` pairs present in `driftTools`.
- Skips any path explicitly tagged as `noindex` (new optional `noindex?: boolean` field on `RouteMeta`) — used to exclude auth, dashboard, settings, admin routes if they're ever added to the registry.
- Emits a valid `<urlset>` XML doc with `<loc>`, `<lastmod>` (build date), and per-route `<changefreq>` / `<priority>` defaults (Home = 1.0/weekly, top-level = 0.8/monthly, dynamic = 0.6/monthly).
- Uses `CANONICAL_HOST` from `structuredData.ts` as default host.

This module has zero React/DOM imports, so it's safe to call from a Vite plugin (Node context).

### 2. New Vite plugin — `vite-plugin-sitemap.ts` (project root)

Small inline plugin:
- `configureServer(server)` — adds middleware that responds to `GET /sitemap.xml` with the freshly-generated XML during `vite dev`.
- `generateBundle()` — emits `sitemap.xml` as a build asset so it lands in `dist/` (and therefore the deployed root).

Wire it into `vite.config.ts` alongside `react()` and `componentTagger()`.

### 3. `public/robots.txt`

Append a `Sitemap:` directive pointing at the canonical URL:
```
Sitemap: https://paracosm.helloarchitekt.com/sitemap.xml
```

### 4. Registry hygiene

Add the optional `noindex?: boolean` field to `RouteMeta` in `src/lib/routeRegistry.ts` (no existing routes set it; purely forward-looking). Update the JSDoc comment to mention adding new public routes here keeps both breadcrumbs and the sitemap accurate.

## Verification

- Inspect generated XML mentally for shape — single `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, one `<url>` per entry.
- Spot-check that every `App.tsx` `<Route>` with a public landing page is represented (LandingPage, AboutUs, Pricing, BookLaunch, GlitchMethodology, CalmMagicDemo, DreamAndLearn, ParacosmRetreat, Wuxia, Tonalli, Tarot, PatternEncyclopedia, AgenticUx, DesignSystem, Drift, CalmMagicBoard tabs, Drift dynamic).

## Out of scope

- Multilingual `<xhtml:link rel="alternate">` annotations (no localised URLs exist yet).
- Image/news sitemaps.
- Pinging Google/Bing on deploy.
- Removing existing `public/sitemap.xml` if any (none exists today, so nothing to migrate).
