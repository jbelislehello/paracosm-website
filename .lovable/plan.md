## Goal

Ship print-ready PDFs of the Rehearsal Arc deck and workbook, gate downloads behind a free account (the same `/auth` profile that unlocks the Calm Magic Board), and give signed-in users a personal dashboard with their trainings, retreats, and residencies roadmaps + playbooks.

## 1. PDF generation (build-time artifacts)

- Add `scripts/build-rehearsal-pdfs.mjs` that converts the existing artifacts to PDF via LibreOffice headless:
  - `rehearsal-arc-facilitator-deck.pptx` → `rehearsal-arc-facilitator-deck.pdf`
  - `rehearsal-arc-workbook.docx` → `rehearsal-arc-workbook.pdf`
- Copy both PDFs into `public/downloads/` so they ship with the site.
- Add `npm run build:rehearsal-pdfs` and wire it after the existing deck/workbook build scripts. Run once now to generate the files.
- QA: render first + last page of each PDF to JPG, inspect for clipped text, missing fonts, broken layouts. Fix and re-run until clean.

## 2. Auth-gated download flow

- Reuse the existing `/auth` page (`CalmMagicAuth.tsx`) — no new auth surface. The same account grants both Calm Magic Board access and Rehearsal Arc downloads.
- Create `src/components/rehearsal/GatedDownloadButton.tsx`:
  - If no session → opens `SignupPromptModal` with new context `'rehearsal-download'` ("Create a free account to download the facilitator deck and workbook — the same account unlocks the Calm Magic Board").
  - If session → triggers download of `/downloads/<file>.pdf` and logs an `analytics_events` row (`event_type: 'rehearsal_download'`, payload `{ asset, offering_slug? }`).
- Add a "Downloads" block to `RehearsalArc.tsx` (index) and each `RehearsalArcOffering.tsx` (detail) exposing:
  - Full Facilitator Deck (PDF)
  - Full Workbook (PDF)
- Extend `SignupPromptModal` `contextMessages` with the new `'rehearsal-download'` entry.

## 3. Signed-in user dashboard: "My Rehearsal Arc"

- New route `/dashboard/rehearsal-arc` → `src/pages/MyRehearsalArc.tsx`, protected (redirect to `/auth?redirect=/dashboard/rehearsal-arc` when signed out).
- Layout mirrors the editorial system already used across the site.
- Sections:
  1. **My enrollments** — cards for each offering the user has enrolled in, grouped by tier (Trainings / Retreats / Residencies), pulled from `training_enrollments`.
  2. **Roadmap** — the 5-state roadmap for each enrolled offering, with progress ticks per state read from `playbook_progress` (season = state key).
  3. **Playbook** — quick-jump into the offering detail page + downloadable PDF workbook section for that offering.
  4. **Learning tracks** — reading list of related trainings from `trainings` table (published only), filtered by tier/tone.
- Add a "My Arc" entry to `EditorialSiteHeader.tsx` visible only when signed in.

## 4. Data model

Reuse existing tables; no schema migration required for MVP:

- `training_enrollments` already has `user_id`, `training_id`, `status`, `progress`. We map each Rehearsal Arc offering to a `trainings` row (seed 9 rows if missing) so enrollments work uniformly.
- `playbook_progress` already stores per-user progress keyed by project/season — reuse `season` field for the 5 states (LOVE/MAGIC/CALM/OPEN/FREE).
- `analytics_events` for download tracking.

If the 9 Rehearsal Arc trainings aren't yet in the `trainings` table, add a one-time seed via `supabase--insert` (data-only, not a migration) with `slug` matching `offering.slug`.

## 5. SEO / structured data

- Add `DigitalDocument` schema.org entry per downloadable PDF via `usePageSeo` on the index page.
- No indexing of `/dashboard/*` (add `noindex` meta).

## Technical notes

- LibreOffice is preinstalled in the sandbox (`soffice --headless --convert-to pdf`), used the same way the PPTX skill does for QA.
- PDFs live in `public/downloads/` (static, cached by Vite/CDN). File names are stable so the schema.org `contentUrl` is durable.
- No new secrets required.
- Auth session detection uses the existing `supabase.auth.onAuthStateChange` pattern from `CalmMagicAuth.tsx`.

## Out of scope

- Per-offering personalized PDFs (only the full deck + full workbook for now).
- Paid tiers / Stripe gating — the account itself is the gate.
- French translation of the dashboard (English only in v1, matching current Rehearsal Arc pages).
