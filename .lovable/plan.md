## Phase 2 (continued): Remaining Tier-1 Marketing Pages

Localize the remaining marketing pages to EN/FR using the established `useLanguage()` + inline `isFr` pattern (plus new i18n JSON namespaces where content is substantial).

### Pages in scope
1. `Pricing.tsx` — hero, plan cards (via `subscriptionTiers.ts`), CTA states, contact footer.
2. `Drift.tsx` + `DriftLibrary.tsx` — headings, filters, resource cards, empty states.
3. `Origins.tsx` — chapter headers, narrative blocks, CTAs.
4. `WuxiaTheFox.tsx` — hero, story sections, transmedia CTAs.
5. `RelationalHealing.tsx` — hero, offering blocks, CTAs.
6. `Tonalli.tsx` — Voice/Spatial branch descriptions, CTAs.
7. `BookChapter.tsx` / `BookCompass.tsx` / `BookCompassesIndex.tsx` / `BookOperatorsIndex.tsx` / `BookThanks.tsx` — reuse existing `book.json`; fill gaps.
8. `TrainingsIndex.tsx` + `TrainingDetail.tsx` + `TrainingModule.tsx` — static chrome (labels like "All trainings", "hours total", "Curriculum", chapter kickers). DB-driven training content stays as-is (single-language content owned by DB).
9. `CaseStudies.tsx` — reuse `case-studies.json`; fill gaps for chrome.
10. `EventsAndRetreats.tsx` + `ParacosmRetreatLanding.tsx` — reuse `retreat.json`; localize surrounding chrome.

### Approach per page
- Add a new i18n namespace file only when the page has >~15 strings or when strings recur; otherwise inline `isFr ? "…" : "…"`.
- Update `usePageSeo({ title, description })` per page with FR variants.
- Preserve all editorial component structure and styling (magazine aesthetic). No design changes.
- Keep DB-sourced strings (trainings, retreats loaded via Supabase) untouched — those are content ops, not chrome.

### New i18n namespaces to add
- `pricing.json` (EN/FR) — hero, CTA labels, contact footer.
- `drift.json` (EN/FR) — page/library chrome, filter labels, empty states.
- `origins.json` (EN/FR) — chapter kickers + long narrative blocks.
- `wuxia.json` (EN/FR) — narrative sections.
- `relational-healing.json` (EN/FR).
- `tonalli.json` (EN/FR).
- `trainings.json` (EN/FR) — index + detail + module chrome.
- `events.json` (EN/FR) — events + retreat landing chrome (or extend `retreat.json`).

Register each new namespace in `LanguageContext.tsx`.

### Out of scope for this phase
- Tier-2 product surfaces (CalmMagicBoard, GlitchAuth, EntrepreneurialTarot, AgenticDemo).
- Tier-3 auth/dashboards.
- Tier-4 admin.
- DB content translations (trainings, retreats, case studies bodies).

### Verification
After edits, run `tsgo` (auto) and spot-check with Playwright by toggling `language` state on `/pricing`, `/drift`, `/origins`, `/wuxia`, `/trainings` to confirm FR strings render and layout is intact.

### Next after this
Phase 3 = Tier-2 product surfaces.
