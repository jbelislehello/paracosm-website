## Goal

Add page-level JSON-LD structured data (Organization / Article / Product / Event / FAQ) so each canonical URL emits rich-result-friendly schema.org metadata, alongside the canonical/OG tags already wired up via `usePageSeo`.

## Approach

Extend the existing `usePageSeo` hook to optionally inject one or more JSON-LD blocks into `<head>`, then call it on each canonical page with the appropriate schema type. This keeps SEO concerns in one place and avoids per-page boilerplate.

### 1. Extend `src/hooks/usePageSeo.ts`

- Add an optional `jsonLd?: Record<string, unknown> | Record<string, unknown>[]` field to `PageSeo`.
- On mount/update:
  - Remove any previously injected `<script type="application/ld+json" data-page-seo="true">` tags (so navigation between pages doesn't accumulate stale schemas).
  - For each provided schema object, append a fresh `<script type="application/ld+json" data-page-seo="true">` containing `JSON.stringify(schema)`.
- On unmount, remove the page-scoped JSON-LD scripts so the global schemas in `index.html` (Organization, FAQ, Events) remain untouched.
- The static schemas already present in `index.html` (ProfessionalService, FAQPage, Events) stay as-is — they describe the brand globally. Page schemas are additive.

### 2. Create `src/lib/structuredData.ts`

A small helper module exposing typed builders so each page stays declarative:

- `orgSchema()` — reusable `Organization` reference (name, url, logo, sameAs).
- `webPageSchema({ title, description, url })` — generic `WebPage` with `isPartOf` Organization.
- `articleSchema({ title, description, url, image, datePublished, author })` — for content pages.
- `productSchema({ name, description, url, image, brand })` — for product/methodology pages.
- `eventSchema({ name, description, startDate, location, url })` — for retreat/summit pages.
- `breadcrumbSchema(items)` — `BreadcrumbList` for nested pages.

All builders return plain JSON-LD objects compatible with the new `jsonLd` field.

### 3. Wire schemas into canonical pages

Pass the right schema(s) to `usePageSeo({ ..., jsonLd: [...] })` on each canonical page:

| Page | Route | Schemas |
|---|---|---|
| LandingPage | `/` | `Organization` + `WebSite` (with `SearchAction` if applicable) + `BreadcrumbList` |
| CalmMagicDemo | `/calm-magic-demo` | `Product` (Calm Magic methodology) + `BreadcrumbList` |
| DreamAndLearn | `/dream-and-learn` | `Product` (Dream & Learn module) + `BreadcrumbList` |
| ParacosmRetreatLanding | `/paracosm-retreat` | `Event` (Azores 2026) + `BreadcrumbList` |
| GlitchMethodology | `/glitch-methodology` | `Article` + `BreadcrumbList` |
| BookLaunch | `/book` | `Book` (or `Product`) + `BreadcrumbList` |
| Pricing | `/pricing` | `WebPage` + `OfferCatalog` referencing tiers + `BreadcrumbList` |
| AboutUs | `/about-us` | `AboutPage` + `Organization` + `BreadcrumbList` |
| CaseStudies | `/case-studies` | `CollectionPage` + `ItemList` of cases + `BreadcrumbList` |
| WuxiaTheFox | `/wuxia` | `CreativeWork` + `BreadcrumbList` |
| Tonalli | `/tonalli` | `Product` (Creative OS) + `BreadcrumbList` |

All schemas use the `https://paracosm.helloarchitekt.com` canonical host (matching `CANONICAL_HOST`) and `og-image.jpeg` as the default `image`.

### 4. Validation

- Local sanity check: in browser devtools, confirm exactly one set of `script[type="application/ld+json"][data-page-seo="true"]` exists per page, and that route changes swap them cleanly.
- Recommend the user run the canonical URLs through Google's Rich Results Test after deploy. (Note: like OG tags, JSON-LD is injected at runtime, so non-JS scrapers won't see it. Google does execute JS for Rich Results, so this works for search; if rich previews on social are required, that's a separate prerendering task.)

## Out of scope

- Prerendering / SSR for non-JS scrapers.
- Modifying the existing global schemas in `index.html`.
- Schemas for auth, dashboard, settings, or admin pages (not canonical/shareable).
