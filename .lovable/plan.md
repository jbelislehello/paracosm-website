

# Drift Monthly Discovery Pages

## Overview

Create 14 monthly discovery pages (Jan 2025 -- Feb 2026), each featuring 2 books categorized into the Drift discovery categories (LOVE, MAGIC, CALM, OPEN, FREE). A new route `/drift/:year/:month` will render each month's page, and the Drift landing page will link to all available months.

## Book Categorization

Each book is placed into the most fitting Drift discovery category:

| Month | Book | Category (Axis) |
|-------|------|-----------------|
| Jan 2025 | Nietzsche (Onfray -- Le Roy) | Inquiry and Practices (CALM) |
| Jan 2025 | L'intelligence erotique (Esther Perel) | Embodied Cognition (LOVE) |
| Feb 2025 | Petit dictionnaire de mots rares (Prellier) | Narratives (MAGIC) |
| Feb 2025 | The Inner Work (Mat & Ash) | Inquiry and Practices (CALM) |
| Mar 2025 | Medecine traditionnelle chinoise (Marabout) | Embodied Cognition (LOVE) |
| Mar 2025 | L'Architecture du bonheur (de Botton) | Sensory Rooms (MAGIC) |
| Apr 2025 | Communicating the New (Kim Erwin) | Workflows (CALM) |
| Apr 2025 | The Eight Mountains (Paolo Cognetti) | Narratives (MAGIC) |
| May 2025 | Pathogenesis (Jonathan Kennedy) | Human Dynamics & System Thinking (OPEN) |
| May 2025 | Jonathan Livingston Seagull (Richard Bach) | WorldBuilders (FREE) |
| Jun 2025 | The Way of the Tarot (Jodorowsky & Costa) | Inquiry and Practices (CALM) |
| Jun 2025 | Becoming Supernatural (Joe Dispenza) | Embodied Cognition (LOVE) |
| Jul 2025 | Bliss Club (June Pia) | Tangible Play (LOVE) |
| Jul 2025 | De l'arbre au labyrinthe (Umberto Eco) | Telling Stories (OPEN) |
| Aug 2025 | Strategy Safari (Mintzberg et al.) | Human Dynamics & System Thinking (OPEN) |
| Aug 2025 | Phantasmal Media (D. Fox Harrell) | Post-Broadcast (FREE) |
| Sep 2025 | The Self-Aware Universe (Amit Goswami) | WorldBuilders (FREE) |
| Sep 2025 | The Third Teacher | Sensory Rooms (MAGIC) |
| Oct 2025 | Game Design Workshop (Tracy Fullerton) | Playgrounds (CALM) |
| Oct 2025 | Taming the Tiger (Witold Rybczynski) | Connected Life (OPEN) |
| Nov 2025 | Atlas of the Heart (Brene Brown) | Embodied Cognition (LOVE) |
| Nov 2025 | A Whole New Mind (Daniel H. Pink) | Playgrounds (CALM) |
| Dec 2025 | Living in Information (Jorge Arango) | Connected Life (OPEN) |
| Dec 2025 | Want (Gillian Anderson) | Narratives (MAGIC) |
| Jan 2026 | Making It All Work (David Allen) | Workflows (CALM) |
| Jan 2026 | A New Earth (Eckhart Tolle) | Inquiry and Practices (CALM) |
| Feb 2026 | Minimalist Parenting (Koh & Dornfest) | 21c Parenting (MAGIC) |
| Feb 2026 | Hyperobjects (Timothy Morton) | Human Dynamics & System Thinking (OPEN) |

## Implementation

### 1. New data file: `src/data/driftMonthlyDiscoveries.ts`

Contains all 14 months of discovery data as a typed array. Each entry includes: year, month, books (title, author, description, category, axis, Amazon link).

### 2. New page component: `src/pages/DriftMonthlyDiscovery.tsx`

A page that reads `:year` and `:month` from the URL params, looks up the corresponding month's data, and renders:
- Month/year header with navigation arrows (previous/next month)
- Each book as a card showing its title, author, one-line description, category badge (color-coded by axis), and a "Find on Amazon" link
- Back link to the Drift landing page
- Footer component

### 3. New route in `src/App.tsx`

Add: `<Route path="/drift/:year/:month" element={<DriftMonthlyDiscovery />} />`

### 4. Update `src/pages/DriftLanding.tsx`

Add a new "Monthly Archive" section between the Discovery Categories and the Narrative sections, showing a grid of all 14 months as clickable cards linking to `/drift/2025/01`, `/drift/2025/02`, etc.

## Files to create/modify

| File | Action |
|------|--------|
| `src/data/driftMonthlyDiscoveries.ts` | Create -- all book data |
| `src/pages/DriftMonthlyDiscovery.tsx` | Create -- monthly page component |
| `src/App.tsx` | Modify -- add route |
| `src/pages/DriftLanding.tsx` | Modify -- add archive section |

