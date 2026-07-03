## Status

`src/pages/AgenticResidency.tsx` already calls `usePageSeo` with title/description/path — but it's placed **after** the `if (!residency) return <Navigate />` early return, which violates the Rules of Hooks (React will warn and behaviour is undefined on the redirect branch).

The hook itself (`src/hooks/usePageSeo.ts`) already handles canonical + og:url + twitter tags correctly against `https://calm-magic.com`, and the route pattern `/agentic-ux/residencies/:slug` is registered so breadcrumb JSON-LD auto-injects.

## Change

In `src/pages/AgenticResidency.tsx`:

1. Move the `usePageSeo(...)` call **above** the early `Navigate` return so it runs unconditionally on every render (Rules of Hooks). For unknown slugs, feed the hook a safe fallback:

    ```text
    title       "Agentic UX Residency — Paracosm"
    description "Three ways to work with Paracosm on multi-agent surfaces."
    path        "/agentic-ux/residencies/" + (slug || "")
    ```

2. When the residency IS found, use its data:

    ```text
    title       `${title} — Agentic UX Residency · Paracosm`
    description tagline  (kept ≤160 chars; current taglines are well under)
    path        `/agentic-ux/residencies/${slug}`
    ```

3. Confirm the three canonical URLs resolve correctly:

    ```text
    https://calm-magic.com/agentic-ux/residencies/diagnostic-sprint
    https://calm-magic.com/agentic-ux/residencies/prototype-residency
    https://calm-magic.com/agentic-ux/residencies/ecosystem-build
    ```

No other files change. No new data. Breadcrumb JSON-LD continues to derive from `routeRegistry` (Home › Agentic UX › {Residency name}).

## Out of scope

- No sitemap edits (existing sitemap builder reads `ROUTE_REGISTRY`, but `:slug` patterns need enumerated slugs to emit URLs — if you want them added to `sitemap.xml`, say so and I'll extend the sitemap builder in a follow-up).
- No og:image change; sitewide default is used.
