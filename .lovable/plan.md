# Tier 3 Editorial Retrofit — Dashboards & Auth

Bring the remaining chrome-only pages into the magazine art direction using existing `editorial/` primitives (`EditorialPageHero`, `editorialTone`, `editorialType`, `EditorialCTA`). No functional/behavioral changes — visual layer only.

## Scope (11 pages, 2 clusters)

### Auth cluster — `paper` tone, numeral 00
Centered editorial card on paper background, serif display headline, uppercase kicker, hairline dividers.
- `CalmMagicAuth.tsx`
- `GlitchAuth.tsx`
- `SubscriptionSuccess.tsx` (numeral 01, warm tone, ember accent)
- `SubscriptionCanceled.tsx` (numeral 02, warm tone, muted)
- `NotFound.tsx` (numeral 404, night tone, gold accent)

### Dashboard cluster — `paper` tone with `warm` accents
Full-width `EditorialPageHero` at top (numeral + kicker + serif title), then existing tables/cards rewrapped in `EditorialSection` with tone-aware surfaces. Preserve all data-fetching, tables, mutations.
- `ParacosmDashboard.tsx` — numeral 10, kicker "COMMAND / DASHBOARD"
- `ProjectsDashboard.tsx` — numeral 11, kicker "PROJECTS / ATELIER"
- `PrdsDashboard.tsx` — numeral 12, kicker "PRDS / FIELD NOTES"
- `Credits.tsx` — numeral 13, kicker "CREDITS / LEDGER"
- `AdminSubscriptions.tsx` — numeral 14, kicker "ADMIN / SUBSCRIPTIONS", night tone
- `BookManuscriptAdmin.tsx` — numeral 15, kicker "ADMIN / MANUSCRIPT", night tone

## Approach per page

1. Replace ad-hoc gradient/background wrappers with `min-h-screen bg-[tone.section]`.
2. Insert `EditorialPageHero` (or the auth card equivalent) at the top.
3. Rewrap inner cards/tables in `EditorialSection` where present; swap Tailwind color utilities for tokenized editorial classes.
4. Convert primary CTAs to `EditorialCTA` variants; keep destructive/status colors intact.
5. Keep shadcn `Card`, `Table`, `Dialog`, `Button` internals — restyle via wrapper containers, don't touch behavior.

## Technical notes

- No new components required; use existing `src/components/editorial/*`.
- No route, data, or i18n changes.
- Footer already retrofitted — reuse as-is.
- Auth pages retain full form logic (Supabase calls, toasts, navigation).
- Dashboards retain all queries, mutations, admin gates.

## Out of scope
- `CalmMagicBoard` and interactive board/canvas surfaces (functional UI, separate pass).
- New copy/content — visual only.
