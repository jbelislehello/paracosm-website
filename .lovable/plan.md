

# Comprehensive Landing Page Overhaul + i18n + Design System Upgrade

## Summary

Six workstreams to convert the landing page into a conversion-optimized, bilingual experience with professional journey maps and design system presentation, all focused on signing 5 clients this spring.

---

## 1. Auto-Trigger Onboarding Guide on First Visit

**Current**: OnboardingGuide only opens when user clicks "Find Your Path" button.

**Change**: In `OnboardingGuide.tsx`, add a `useEffect` that checks `localStorage` for `paracosm-onboarding-completed`. If not found, auto-open the dialog after a 2-second delay on first visit. This ensures every new visitor is immediately routed to the right offering.

**File**: `src/components/OnboardingGuide.tsx` — add auto-open logic in the component mount effect.

---

## 2. Collapsible Landing Page Sections

**Current**: The landing page has ~7 full-height sections stacked vertically (Intention Design 5-step pipeline, Services, Universe, Events, Coaching Approach, Social Proof, Transformation Journey, Partners, FAQ, Contact). Very long scroll.

**Change**: Create a reusable `CollapsibleSection` component. Each major section below the Spring 2026 offer gets a compact header (title + one-liner + icon) that expands on click to reveal full content. Default state: collapsed. Spring 2026 offer stays fully expanded.

**Files**:
- New: `src/components/CollapsibleSection.tsx` — wrapper with chevron toggle, smooth height animation via Collapsible from shadcn
- Modified: `src/pages/LandingPage.tsx` — wrap each section (Intention Design, Services, Universe, Events, Coaching, Social Proof, Transformation, Partners) in `CollapsibleSection`

---

## 3. Full FR/EN Translation of Landing Page

**Current**: The landing page hero, Spring 2026 offer, Intention Design pipeline, and all section text are hardcoded in English. Translation keys only exist for nav-level items, hero page titles, and footer.

**Change**: 
- Add new i18n module files: `src/i18n/en/landing.json` and `src/i18n/fr/landing.json` containing all hardcoded strings from the landing page (hero headline, hero description, Spring offer headline/tiers/CTAs, Intention Design steps 1-5, Transformation Trap callout, section headers)
- Add `'landing'` to the modules array in `LanguageContext.tsx`
- Replace all hardcoded strings in `LandingPage.tsx` with `t('landing.key')` calls
- Also audit `OnboardingGuide.tsx`, `FAQSection.tsx`, `SocialProofSection.tsx` for hardcoded English and add their keys to the landing module

**Files**:
- New: `src/i18n/en/landing.json` (~80 keys)
- New: `src/i18n/fr/landing.json` (~80 keys, professionally translated)
- Modified: `src/contexts/LanguageContext.tsx` — add 'landing' module
- Modified: `src/pages/LandingPage.tsx` — replace hardcoded strings with `t()` calls
- Modified: `src/components/OnboardingGuide.tsx` — translate labels
- Modified: `src/components/FAQSection.tsx` — translate Q&A

---

## 4. Journey Map Upgrade (Columbia Road Style)

**Current**: Journey map tab shows 5 simple cards in a grid with touchpoint links. No swimlanes, no experience curve, no business goals.

**Change**: Rebuild the Journey Map tab using the Columbia Road template structure (IMG_3353):

```text
┌──────────────┬─────────────┬──────────────┬──────────────┬──────────────┐
│  DISCOVER    │   ENGAGE    │    BUILD     │   OBSERVE    │   EVOLVE     │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│ Activities   │ Activities  │ Activities   │ Activities   │ Activities   │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│ Goals        │ Goals       │ Goals        │ Goals        │ Goals        │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│ Touchpoints  │ Touchpoints │ Touchpoints  │ Touchpoints  │ Touchpoints  │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│           EXPERIENCE CURVE (SVG line graph)              │              │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│ KPIs         │ KPIs        │ KPIs         │ KPIs         │ KPIs        │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│ Responsible  │ Responsible │ Responsible  │ Responsible  │ Responsible  │
└──────────────┴─────────────┴──────────────┴──────────────┴──────────────┘
```

Rows: Customer Activities, Customer Goals, Touchpoints, Experience (SVG curve), Business Goal, KPIs, Organizational Activities, Responsible, Technology Systems.

**Files**:
- Modified: `src/data/offeringModels.ts` — expand `journeyStages` with activities, goals, kpis, responsible, techSystems per stage
- New: `src/components/design-system/JourneyMapTable.tsx` — horizontal table with sticky left column for row labels, SVG experience curve row
- Modified: `src/pages/DesignSystemShowcase.tsx` — replace current journey-map tab content with new `JourneyMapTable`

---

## 5. Mental & Task Model Upgrade (Matrix Style)

**Current**: Mental models shown as linear badge arrows. Task models as numbered lists.

**Change**: Inspired by the task model matrix (IMG_3403 — the film selection grid), restructure the Mental Models tab:

- **Mental Model**: Show as a 2D grid where columns are phases (Confusion → Decision) and rows are dimensions (Strategic, Emotional, Relational, System). Each cell contains the specific activity at that intersection. Color-coded by phase.
- **Task Model**: Show as a hierarchical task tree (top-level goals → sub-tasks → content requirements), matching the yellow/magenta/green color coding from the template. Top row = high-level goals, bottom rows = specific content/data needs.

**Files**:
- Modified: `src/data/offeringModels.ts` — add `mentalModelGrid` (2D array) and `taskModelHierarchy` (tree structure) to each offering
- New: `src/components/design-system/MentalModelGrid.tsx` — renders the colored matrix
- New: `src/components/design-system/TaskModelTree.tsx` — renders hierarchical task decomposition
- Modified: `src/pages/DesignSystemShowcase.tsx` — use new components in the mental-models tab

---

## 6. Design System Page Restructure (Venn Diagram Concept)

**Current**: Design System tab shows colors, typography, and component library.

**Change**: Reorganize into three conceptual pillars inspired by the template images (IMG_3406, IMG_3409):

- **Building Blocks** (Style Guide): Colors, typography, icons, grid, image assets
- **UI Patterns** (Pattern Guide): Templates, modules, components, elements — show live examples
- **Rules**: Design principles, implementation guidelines, do's and don'ts, editorial guidelines

Each pillar is a collapsible accordion section within the Design System tab. Add a visual Venn diagram header (CSS circles) showing the overlap between the three pillars.

**Files**:
- Modified: `src/pages/DesignSystemShowcase.tsx` — restructure Design System tab into 3-pillar layout with Venn header
- Add design principles content (drawn from existing brand voice across the site)

---

## Technical Details

- `CollapsibleSection` uses shadcn `Collapsible` + `CollapsibleTrigger` + `CollapsibleContent`
- Journey map table uses CSS `grid` with `overflow-x-auto` for mobile
- Experience curve is an inline SVG `<polyline>` with gradient fill
- Mental model grid uses `grid-template-columns` matching phase count
- All new text goes through `t()` for bilingual support
- No new dependencies required
- No backend changes

