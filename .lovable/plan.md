## Problem

Two issues:

1. **Link previews missing on Trainings & Book pages.** This is a Vite SPA; social crawlers (Facebook, LinkedIn, iMessage, Slack, WhatsApp, Twitter) don't execute the JS that `usePageSeo` uses to set `<title>` and `og:*`. They only ever read the static tags in `index.html`, so every shared link previews as the generic homepage card.
2. **"Trainings" is missing from the site nav.**

## Plan

### 1. Build-time prerender plugin for shareable pages

Add `vite-plugin-prerender-og.ts` (sibling of the existing `vite-plugin-sitemap.ts`) that runs during `generateBundle`:

- Connects to Supabase with the public anon key (same client used in app)
- Pulls all published trainings (`/trainings/:slug`) and book chapters (`/book/chapter/:slug`), plus the static index routes `/trainings`, `/book`, `/book/compasses`, `/book/operators`
- For each route, emits `dist/<path>/index.html` — a copy of the built `index.html` with the head's `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:*`, and `<link rel="canonical">` rewritten for that page
- Keeps the SPA shell intact (same `<div id="root">` + script tags), so when a real browser loads the URL, the React app boots normally and React Router takes over. Only the head differs.
- Image: use `training.og_image` / `chapter.og_image` if a column exists, otherwise fall back to the default `/og-image.jpeg`. (I'll check the schema; if no per-row image column exists I'll use the default and note it — no schema change unless you ask.)

This is the standard "prerender just the head for crawlers" pattern and is the minimum change needed to make previews work without moving to SSR.

Files:
- `vite-plugin-prerender-og.ts` (new)
- `vite.config.ts` (register plugin after `sitemapPlugin()`)

`usePageSeo` stays as-is so the tab title still updates during in-app navigation.

### 2. Add Trainings to navigation

In `src/pages/Index.tsx`:
- Desktop nav (~line 134): add `<Link to="/trainings">Trainings</Link>` next to "Relational Intelligence"
- Mobile sheet (~line 188): same link in the mobile menu, with the existing styling

No i18n key needed for now (the existing nav links there are hardcoded English); matches current pattern.

## Out of scope

- No SSR migration, no static export of full page content — only the head is rewritten.
- No changes to `usePageSeo`, route registry, or sitemap.
- No new database columns. If you later want per-training OG images, we can add a `og_image` column and a small upload UI.

## Verification

After build, `dist/trainings/index.html` and `dist/book/chapter/<slug>/index.html` should contain the correct `<title>` and `og:*` tags. I'll spot-check by reading two emitted files.
