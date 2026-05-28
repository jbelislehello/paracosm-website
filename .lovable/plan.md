## Heads up: there's no `scripts/generate-sitemap.ts` in this project

This project generates `sitemap.xml` via a Vite plugin (`vite-plugin-sitemap.ts`) that reads `src/lib/routeRegistry.ts` and expands dynamic routes in `src/lib/sitemap.ts`. The right fix is to register the training routes there — creating a separate script would duplicate and conflict with the existing plugin.

## Plan

### 1. `src/lib/routeRegistry.ts` — add 3 entries
- `{ path: "/trainings", label: "Trainings" }`
- `{ path: "/trainings/:slug", label: (p) => slug titled (Glitch/Drift/Tune), parent: "/trainings" }`
- `{ path: "/trainings/:slug/modules/:order", label: (p) => "Module " + p.order, parent: "/trainings/:slug", noindex: true }` — deep module pages are low-value for Google; keep them out of the sitemap but still get correct breadcrumbs.

### 2. `src/lib/sitemap.ts` — expand `/trainings/:slug`
Add a case to `expandDynamic()`:
```ts
case "/trainings/:slug":
  return ["glitch", "drift", "tune"].map((s) => `/trainings/${s}`);
```
Hardcoded because slugs are stable seed data; keeps the sitemap build synchronous (no Supabase fetch at build time).

### 3. Verify
Open `/sitemap.xml` in preview and confirm `/trainings`, `/trainings/glitch`, `/trainings/drift`, `/trainings/tune` are present and module URLs are absent.

### Not doing
- Not creating `scripts/generate-sitemap.ts` (would conflict with the plugin).
- Not indexing module pages.
- Not touching nav/footer links (separate ask).