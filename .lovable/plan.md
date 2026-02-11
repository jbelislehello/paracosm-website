

# Update Site to Reflect HA Labs + Paracosm Ontological Structure

## Overview

The site currently presents everything under the "Paracosm" brand with an ad-hoc mix of projects. The user has provided a clear two-entity organizational ontology that needs to be reflected across the site: **HA Labs** (the creative/tech studio) and **Paracosm** (the coaching practice). This plan restructures the landing page, navigation, footer, and universe section to match.

## Organizational Structure to Reflect

```text
HA Labs
+-- Performance Arts
|   +-- Satori & Kensho
+-- Innovation Methodological Framework
|   +-- Calm Magic: The Board
|   +-- Calm Magic: The Book
+-- Interactive Storytelling
|   +-- Wuxia the Fox
|   +-- Tout ce qui arrive et advient sous la lune
|   +-- One Mercury Year
|   +-- Le cosmographe et l'ordre des marchands
|   +-- The Manifold
+-- AI & IOT Software
|   +-- IoTheatre
|   +-- Tonalli (Voice & Spatial Computer)
+-- Client Projects

Paracosm (Agentic UX & Coaching)
+-- Relational Intelligence
+-- Learning Organizations
+-- Retreats
+-- Events
    +-- Gl!tch Session
    +-- Drift Podcast
    +-- Paracosm Retreat
```

## Changes

### 1. Rewrite `ParacosmUniverseSection.tsx` as the HA Labs + Paracosm Ecosystem Section

Replace the current Wuxia-focused section with a comprehensive ecosystem overview:
- **Section header**: "The Ecosystem" or "HA Labs + Paracosm" with a brief intro
- **Two visual columns/areas**:
  - **HA Labs** card: grouped sub-sections for Performance Arts, Innovation Framework, Interactive Storytelling, AI & IOT Software, and Client Projects -- each with their sub-projects listed
  - **Paracosm** card: Relational Intelligence, Learning Organizations, Retreats, Events (Gl!tch, Drift, Paracosm Retreat)
- Keep the Wuxia the Fox featured announcement but nest it under the Interactive Storytelling branch
- Link existing routes where they exist (`/calm-magic-board`, `/wuxia`, `/tonalli`, `/drift`, `/glitch-methodology`)

### 2. Update Footer (`src/components/Footer.tsx`)

Restructure the footer columns to reflect the two entities:
- Column 1: **HA Labs** brand + description + email
- Column 2: **HA Labs Projects** -- Calm Magic Board, Wuxia, Tonalli, IoTheatre, Satori & Kensho
- Column 3: **Paracosm** -- Relational Intelligence, Learning Organizations, Gl!tch Sessions, Drift Podcast, Retreats
- Column 4: **Get Started** (keep existing CTAs)

### 3. Update Navigation in `LandingPage.tsx`

Simplify desktop nav to reflect top-level concerns:
- **Paracosm** (coaching landing -- current Team Coaching link)
- **Calm Magic Board** (keep)
- **Drift** (keep)
- **Tonalli** (keep)
- **Events** (keep)
- **Contact** (keep)

Remove "AI Leadership" and "Services" as standalone nav items since the landing page hero already covers service pathways. Mobile menu updated to match.

### 4. Update i18n files

Add new keys to `src/i18n/en/navigation.json` and `src/i18n/fr/navigation.json`:
- `ha_labs`: "HA Labs" / "HA Labs"
- `ecosystem`: "Ecosystem" / "Ecosysteme"
- `performance_arts`: "Performance Arts" / "Arts de la performance"
- `interactive_storytelling`: "Interactive Storytelling" / "Narration interactive"
- `ai_iot_software`: "AI & IOT Software" / "Logiciel IA & IOT"
- `client_projects`: "Client Projects" / "Projets clients"
- `learning_organizations`: "Learning Organizations" / "Organisations apprenantes"
- `retreats`: "Retreats" / "Retraites"
- `events`: "Events" / "Evenements"

### Files Modified

| File | Change |
|------|--------|
| `src/components/ParacosmUniverseSection.tsx` | Full rewrite to show HA Labs + Paracosm ecosystem |
| `src/components/Footer.tsx` | Restructure columns for two entities |
| `src/pages/LandingPage.tsx` | Update nav links |
| `src/i18n/en/navigation.json` | Add new keys |
| `src/i18n/fr/navigation.json` | Add new keys |
| `src/i18n/en/common.json` | Add ecosystem-related strings |
| `src/i18n/fr/common.json` | Add ecosystem-related strings |

### Files NOT Modified

- Individual project pages (Tonalli, Wuxia, CalmMagicBoard, Drift, etc.) stay as-is
- Index.tsx (AI Leadership landing) stays as-is
- No new routes or pages created

