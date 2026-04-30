## Goal

The current `BreadcrumbList` JSON-LD already emits absolute URLs via `abs(path)`, but three gaps remain:

1. The host is hardcoded to `paracosm.helloarchitekt.com` — pages served on `calm-magic.com` (a configured custom domain) would still link breadcrumbs back to Paracosm.
2. Each `ListItem` uses a bare string `item: "https://..."`. Google's documented pattern uses the nested `{ "@type": "Thing", "@id": "..." , "name": "..." }` form, which is more robust for rich results.
3. The visible-UI hook `useAutoBreadcrumbs` still returns relative paths only, so any header/breadcrumb component cannot easily render canonical anchors.

## Changes

### 1. `src/lib/structuredData.ts`

- Add an optional `host` parameter to `breadcrumbSchema(items, options?)`:
  ```ts
  breadcrumbSchema(items, { host }?: { host?: string })
  ```
  Resolve each path with a local `abs(path, host)` helper that prefers the supplied host, falling back to `CANONICAL_HOST`.
- Switch each `ListItem` to the nested form:
  ```json
  {
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": {
      "@type": "WebPage",
      "@id": "https://paracosm.helloarchitekt.com/"
    }
  }
  ```
  This keeps backward compatibility with current consumers (the `name` is unchanged) and aligns with Google's BreadcrumbList examples.

### 2. `src/hooks/usePageSeo.ts`

- Pass the resolved `host` through to `breadcrumbSchema(trail, { host })` so a page rendered under `calm-magic.com` produces breadcrumb URLs on that host.

### 3. `src/hooks/useAutoBreadcrumbs.ts`

- Extend the hook signature to optionally return absolute URLs:
  ```ts
  useAutoBreadcrumbs({ absolute?: boolean; host?: string } = {})
  ```
  Default behavior (relative paths) is preserved so existing call sites are unaffected. When `absolute: true`, each item's `path` is prefixed with the canonical host.

### 4. Quick verification

- `rg` for existing `useAutoBreadcrumbs(` call sites to confirm no breakage (signature is additive).
- Manual smoke: load `/drift/library/calm` in preview, view source for the injected `<script type="application/ld+json" data-page-seo="true">` block, confirm itemListElements use the nested `item.@id` shape with absolute URLs.

## Out of scope

- No changes to per-page schemas (Article, Product, Event, etc.) — those already use `abs()`.
- No new visible UI; the UI hook change is opt-in.
- No multi-language alternates; `hreflang` is a separate concern from breadcrumb canonicality.
