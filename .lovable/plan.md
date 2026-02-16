

# Entrepreneurial Tarot + Retreat Integration

## Overview
Create a **Calm Magic Entrepreneurial Tarot** page based on the 5 quadrants (LOVE, MAGIC, CALM, OPEN, FREE) as Major Arcana suits, using the existing tile matrix structure (CHORDS x AGENDAS/LENS/MAPS). Then integrate the tarot as a featured activity within the Paracosm Retreat landing page.

---

## Part 1: Tarot Data Model

**New file: `src/data/entrepreneurialTarot.ts`**

Define the tarot deck structure:

### Major Arcana (5 suits x letters)
From the uploaded poster and existing ontology:

| Suit | Letters | Meanings |
|------|---------|----------|
| **MAGIC** | M-A-G-I-C | Mindsets, Agilities, Goals, Intuitions, Compasses |
| **LOVE** | L-O-V-E | Longevity, Oscillations, Velocity, Elasticity |
| **CALM** | C-A-L-M | (derived from framework: Constraints, Alignment, Landscape, Methods) |
| **OPEN** | O-P-E-N | (derived: Ontology, Protocols, Energy, Networks) |
| **FREE** | F-R-E-E | (derived: Flow, Reversal, Emergence, Evolution) |

Each Major Arcana card has:
- `suit`: LOVE / MAGIC / CALM / OPEN / FREE
- `letter`: the letter it represents
- `name`: the meaning (e.g., "Mindsets")
- `question`: a reflective entrepreneurial prompt (drawn from the tile glitchQuestion/tuneQuestion patterns)
- `upright`: upright reading (entrepreneurial strength)
- `reversed`: reversed reading (shadow/challenge)
- `color`: matches the axis color

### Minor Arcana (CHORDS dimensions)
6 cards per dimension, mapped to the CHORDS columns:
- **Chances** (C) -- risk, experimentation
- **Heart** (H) -- compassion, values
- **Observer** (O) -- awareness, perspective
- **Reversal** (R) -- renewal, pivoting
- **Design** (D) -- craft, intentionality
- **Seeds** (S) -- planting, potential

Each Minor Arcana card has:
- `dimension`: CHORDS letter
- `name`, `question`, `upright`, `reversed`
- `stage`: which AGENDAS/LENS/MAPS row it corresponds to

Total deck: ~22 Major Arcana + 48 Minor Arcana (6 CHORDS x 8 rows) = 70 cards

---

## Part 2: Tarot Page

**New file: `src/pages/EntrepreneurialTarot.tsx`**

A visually rich, interactive page at `/tarot` with:

1. **Hero section** -- title "The Calm Magic Tarot", subtitle about entrepreneurial archetypes and relational intelligence
2. **Daily Draw** -- a button to draw 1-3 random cards with a flip animation, showing the card's question, upright/reversed meaning
3. **Full Deck Browser** -- tabs for each suit (LOVE/MAGIC/CALM/OPEN/FREE) showing all Major Arcana cards, plus a CHORDS tab for Minor Arcana
4. **Spread Layouts** -- pre-built 3-card spread ("Past Tension / Present Drift / Future Tune") mapped to the GL!TCH-DRIFT-TUNE cycle
5. Each card rendered as a styled card with the suit color gradient, letter, name, and meanings

---

## Part 3: Retreat Integration

**Modified files:**
- `src/pages/ParacosmRetreatLanding.tsx` -- Add a new section between the 3-Day Journey and Audience/Outcomes sections featuring the tarot
- `src/i18n/en/retreat.json` -- Add tarot-related translation keys
- `src/i18n/fr/retreat.json` -- Add French translations

### Retreat Page Changes:
- New "Entrepreneurial Tarot" section with:
  - Brief description of the tarot as a retreat tool for leadership reflection
  - A mini interactive 3-card draw preview (draws from the deck)
  - Link to the full `/tarot` page ("Explore the Full Deck")
- Update Day 1 activities to include "Entrepreneurial Tarot reading and reflection circle"
- Update Day 3 activities to include "Personal Arcana synthesis and leadership card creation"

---

## Part 4: Routing

**Modified file: `src/App.tsx`**

Add route: `<Route path="/tarot" element={<EntrepreneurialTarot />} />`

---

## Technical Details

### Card Flip Animation
CSS-only 3D flip using `transform: rotateY(180deg)` with `perspective` and `backface-visibility: hidden`. No additional libraries needed.

### Color Mapping
Reuse the existing `axisColors` from `driftMonthlyDiscoveries.ts`:
- love: red (#ef4444)
- magic: purple (#8b5cf6)
- calm: green (#22c55e)
- open: blue (#3b82f6)
- free: amber (#f59e0b)

### Files Summary
| File | Action |
|------|--------|
| `src/data/entrepreneurialTarot.ts` | **New** -- Full deck data (70 cards) |
| `src/pages/EntrepreneurialTarot.tsx` | **New** -- Tarot page with draw + browse |
| `src/pages/ParacosmRetreatLanding.tsx` | **Modified** -- Add tarot section |
| `src/i18n/en/retreat.json` | **Modified** -- Add tarot translation keys |
| `src/i18n/fr/retreat.json` | **Modified** -- Add French tarot translations |
| `src/App.tsx` | **Modified** -- Add /tarot route |

