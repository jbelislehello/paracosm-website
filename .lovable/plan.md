# Restructure Navigation + Introduce Residencies & Somatic Retreat

Bring your work as **innovator and relational artist** to the front. Replace the generic "AI Leadership / Relational Innovation / GL!TCH" links with a richer menu organized around how you actually work, and add two new on-page sections: the **Seven Expansive Leadership Residencies** (Forest, River, Lake, Mountain, Ocean, Storm, Sun) and the **Somatic Creativity Retreat**.

## 1. New navigation IA

Replace the flat 3-link nav on `src/pages/Index.tsx` with 4 grouped entries using `NavigationMenu` (already in `components/ui/navigation-menu.tsx`). Same structure for desktop and mobile (Sheet).

```
Practice         Residencies              Retreat              Methods
─ Relational     ─ Think like a Forest    ─ Somatic            ─ GL!TCH Method
  Intelligence   ─ Think like a River       Creativity         ─ Calm Magic Board
─ Innovation as  ─ Think like a Lake        Retreat            ─ Drift Library
  Art            ─ Think like a Mountain    (Azores 2026)      ─ Paracosm Universe
─ AI Leadership  ─ Think like an Ocean
                 ─ Think like a Storm
                 ─ Think like a Sun
```

The "Residencies" dropdown shows all seven archetypes as anchor links into the new section. The CTA button changes from "Explore Coaching" to **"Begin a Residency"**.

## 2. Seven Expansive Leadership Residencies section

New component `src/components/ResidenciesSection.tsx`, mounted on `Index.tsx` between the AI Leadership and Relational sections, with `id="residencies"`.

Each archetype = one card with: element glyph, name, one-line invitation, the cognitive/somatic gesture it trains, the kind of leader it serves, and a "Begin" anchor.

| Archetype | Gesture trained | For leaders facing |
|---|---|---|
| Forest | Patient interdependence, canopy thinking | Complex ecosystems, slow strategy |
| River | Continuous flow, finding the path of least resistance | Change fatigue, blocked teams |
| Lake | Stillness as intelligence, deep reflection | Reactivity, decision overload |
| Mountain | Long-horizon presence, structural integrity | Identity shifts, public exposure |
| Ocean | Holding multitudes, tidal pacing | Scaling, multi-stakeholder leadership |
| Storm | Generative disruption, working with intensity | Crisis, conflict, GL!TCH moments |
| Sun  | Radiant clarity, sustained generativity | Burnout recovery, vision-setting |

Visual: 7-card asymmetric layout (4 + 3 staggered) with a gradient palette per element (greens for Forest, blues for River/Lake/Ocean, slate for Mountain, violet for Storm, amber for Sun). On hover, the card breathes (uses `useBreathingPulse`). Honors `prefers-reduced-motion`.

Data lives in a typed array in `src/data/residencies.ts` so it can later be persisted/served. Bilingual strings added to `src/i18n/{en,fr}/navigation.json` and a new `residencies.json`.

## 3. Somatic Creativity Retreat section

New component `src/components/SomaticCreativityRetreat.tsx`, mounted with `id="somatic-retreat"`, distinct from the existing Paracosm Azores retreat (links to it as the flagship instance).

Contents: positioning ("a retreat where the body composes the strategy"), the three movements (Listen / Move / Make), who it's for, format, and a CTA "Request an invitation" — wired to the existing contact flow which routes to `jbelisle@helloarchitekt.com` per the lead-gen rule.

## 4. Aesthetic upgrade

- Replace the current "P in blue→purple gradient" wordmark logo with a quieter typographic mark: lowercase `paracosm` in the existing display font + a thin elemental dot that cycles color through the 7 archetypes on a slow timer.
- Tighten nav typography: smaller weight, more letter-spacing, the active section underlined with a hairline.
- Update `MOBILE_NAV_SECTIONS` to include `residencies` and `somatic-retreat`.

## Files

- edit `src/pages/Index.tsx` — new nav, mount new sections, update mobile section list, swap CTA + logo
- new `src/components/ResidenciesSection.tsx`
- new `src/components/SomaticCreativityRetreat.tsx`
- new `src/data/residencies.ts`
- new `src/i18n/en/residencies.json`, `src/i18n/fr/residencies.json`
- edit `src/i18n/en/navigation.json`, `src/i18n/fr/navigation.json` — add Practice / Residencies / Retreat / Methods + 7 archetype labels
- edit `src/components/Footer.tsx` — mirror new IA

## Out of scope (ask if you want them)

- Dedicated `/residencies/:archetype` pages
- Booking/calendar integration
- Changing the existing Paracosm Azores retreat page

Confirm and I'll build it. If you want different archetype copy, different IA grouping, or a separate page per residency instead of an on-page section, say so before I start.