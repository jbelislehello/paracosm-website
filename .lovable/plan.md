# Full Site EN/FR Translation

Goal: every user-visible string across all 62 pages and shared components exists in both `src/i18n/en/*.json` and `src/i18n/fr/*.json`, rendered via `useLanguage()`.

Current state: only 6 pages (`LandingPage`, `EditorialHome`?, `CaseStudies`, `BookLaunch`, `AboutUs`, `EventsAndRetreats`, `ParacosmRetreatLanding`) use the translation system. ~56 pages and most shared components contain hardcoded English.

Because the surface is very large, work is split into phases. Each phase is one implementation turn ending in a completed, buildable slice. You approve, I move to the next.

## Phase 0 — Audit report (this plan's first deliverable)

Produce `.lovable/i18n-audit.md` enumerating, per file:
- Hardcoded English string count (approx)
- Existing i18n namespace if any
- Proposed namespace + key prefix
- Priority tier (1 marketing / 2 product surfaces / 3 auth+dashboards / 4 admin)

No code changes in Phase 0.

## Phase 1 — Shared shell (site-wide impact)

Files: `Footer.tsx`, `HeroSection.tsx`, `ContactSection.tsx`, `FAQSection.tsx`, `SocialProofSection.tsx`, `WhoWeServeSection.tsx`, `ServicesShowcase.tsx`, `CoachingApproachSection.tsx`, `BookAnnouncementBanner.tsx`, `MobileSectionNav.tsx`, `OnboardingGuide.tsx`, all `components/editorial/*`, all `components/ui/*` user-visible labels, dialog components (`GetDemoDialog`, `ShareProjectDialog`, `SignupPromptModal`, `UpgradePromptModal`, `ProfileEditModal`).

Adds namespaces: `footer`, `contact`, `faq`, `dialogs`, `shell`.

## Phase 2 — Tier-1 marketing pages

`EditorialHome`, `Contact`, `Pricing`, `TrainingsIndex`, `TrainingDetail`, `TrainingModule`, `DriftLanding`, `DriftLibrary`, `DriftMonthlyDiscovery`, `Drift`, `Origins`, `Lineage`, `WuxiaTheFox`, `RelationalHealing`, `Tonalli`, `RehearsalArcOffering`, `ResidencyDetail`, `AgenticResidency`, `BookChapter`, `BookCompass`, `BookCompassesIndex`, `BookOperatorsIndex`, `BookThanks`, `DreamAndLearn`, `DreamShare`.

New namespaces: `pricing`, `trainings`, `drift`, `origins`, `lineage`, `wuxia`, `relational-healing`, `tonalli`, `rehearsal`, `residency`, `book`, `dreams`.

## Phase 3 — Product / feature surfaces

`CalmMagicBoard`, `CalmMagicDemo`, `CalmMagicJournal`, `CalmMagicVisualization`, `CalmMagicAuth`, `GlitchAuth`, `GlitchEvents`, `GlitchInsights`, `GlitchLog`, `GlitchMethodology`, `EntrepreneurialTarot`, `PatternEncyclopedia`, `GardenExpansionMode`, `MyRehearsalArc`, `RehearsalArc`, `AgenticDemo`, `AgenticEcosystemDeck`, `ResonanceDemo`, `DesignSystemShowcase`, plus their component trees (`calm-magic/*`, `tarot/*`, `rehearsal/*`, `agentic-demo/*`, `agent-demo/*`, `resonance/*`, `board/*`, `d3/*` user-visible copy, `journal/*`, `lineage/*`, `paracosm/*`, `product-development/*`, `prd-generator/*`, `trainings/*`, `book/*`, `tonalli/*`, `case-studies/*`, `hero/*`, `landing/*`, `design-system/*`, `aesthetic/*`, `auth/*`).

New namespaces per feature area.

## Phase 4 — Dashboards, admin, auxiliary

`Index`, `ParacosmDashboard`, `ProjectsDashboard`, `PrdsDashboard`, `PrdEditor`, `Settings`, `Credits`, `AdminSubscriptions`, `BookManuscriptAdmin`, `SubscriptionSuccess`, `SubscriptionCanceled`, `NotFound`, related components (`UserProfileMenu`, `SubscriptionStatusIndicator`, `PremiumBadge`, `FeatureGate`, `MyInvitations`).

## Translation approach

- Keys are semantic (`hero.cta.primary`), not English snippets.
- French copy: professional native-quality translation matching brand voice (editorial, magazine tone). Where a term is a proper noun / product name (Paracosm, Calm Magic, GL!TCH, Drift, Tonalli, Wuxia), keep untranslated.
- Toast messages, aria-labels, alt text, meta tags all included.
- Numbers/dates use locale-aware formatting where user-visible.
- Zod validation messages routed through translation helper.

## Technical section

- Loader: `src/contexts/LanguageContext.tsx` already lazy-loads namespaces via dynamic `import()` of `src/i18n/{lang}/{ns}.json`. New namespaces added by dropping matching `en/x.json` + `fr/x.json` pairs and calling `t('x.key')` after `useLanguage()` registers the namespace.
- Missing-key fallback: keep existing behavior (returns key). Add dev-only `console.warn` for missing keys during audit phases to catch regressions.
- No changes to persistence, `<html lang>` sync, or `LanguageSwitcher` — those are done.
- Type safety: keep JSON as source of truth; no generated types unless you want them.

## Deliverable cadence

Turn 1 (after approval): Phase 0 audit file only.
Turn 2: Phase 1.
Turn 3–5: Phase 2 (split by page group if a single turn is too large).
Turn 6–8: Phase 3.
Turn 9: Phase 4 + final sweep verifying `rg` finds no user-visible hardcoded English in `.tsx` files outside allowlist (code identifiers, product names, dev-only strings).

Approve to start with Phase 0 (audit report, no code changes).
