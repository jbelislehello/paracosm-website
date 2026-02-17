

# Complete and Illustrate the Entrepreneurial Tarot

## Overview

This is a major enhancement to the Entrepreneurial Tarot system: completing the 70-card deck, mapping every card to the Calm Magic 8x8 matrix, adding avant-garde generative art, a new Constellation View, and improving site-wide discoverability.

## What Changes

### 1. Complete the Deck -- Add the 22nd Major Arcana

A synthesis card called **"The Weaver"** will be added, representing the convergence of all five suits (LOVE/MAGIC/CALM/OPEN/FREE). It belongs to no single suit but all of them, sitting at the center of the matrix.

### 2. Map Every Card to the Calm Magic Matrix

Every card gets a `matrixPosition` property linking it to the 8x8 board:

- **Major Arcana**: Suit determines the board; each suit's letters map to rows (MAGIC: M=1, A=2, G=3, I=4, C=5; LOVE/CALM/OPEN/FREE similarly across rows 1-4)
- **Minor Arcana**: CHORDS dimension = column (C=1 through S=6), stage = row (Agendas=1 through Higher Self=8)
- **The Weaver**: Center position (4,4)

### 3. Avant-Garde Generative Art

Following feminine design principles (Receptivity, Softness, Cyclical Time, Embodiment, Intuition, Care, Inclusivity):

- **Generative SVG per card** seeded by matrix position -- organic topology lines, interference patterns (overlapping translucent circles), phase-shifted HSL color fields, breathing animations, noise-textured backgrounds
- **Redesigned card face** -- large typographic glyph with clipping mask revealing generative pattern, matrix coordinate address tag (e.g. "M4.3"), frosted glass question panel, expanding/contracting visual metaphors for upright/reversed
- **Breathing and moire CSS animations** for cyclical time and embodiment

### 4. New Constellation View

A full 8x8 interactive grid where:
- Each cell is a glowing node representing a card
- Hovering reveals the question in a luminous tooltip
- Clicking opens the full card detail
- Window of Tolerance concentric rings visible as outlines
- Diagonal fan lines connect corners through center
- Cards can glow brighter when "discovered"

### 5. Site Placement

- **Main navigation**: Add "Tarot" link between "Tonalli" and "Events" in both desktop and mobile menus
- **Existing links** from Retreat page and Footer remain unchanged

### 6. Enhanced Page Structure

The `/tarot` page will have:
1. Hero -- immersive dark canvas with sacred geometry
2. Oracle Section -- draw 1 or 3 cards with enhanced visuals
3. Constellation View -- new tab with the 8x8 matrix grid
4. Deck Browser -- existing suit/CHORDS tabs with generative card art
5. Matrix Legend -- explanatory section for CHORDS x AGENDAS mapping

---

## Technical Details

### New Files

| File | Purpose |
|------|---------|
| `src/components/tarot/GenerativeCardArt.tsx` | SVG generator producing unique patterns per card based on matrix position |
| `src/components/tarot/ConstellationView.tsx` | 8x8 interactive grid mapping cards to Calm Magic matrix |
| `src/components/tarot/EnhancedCardDisplay.tsx` | Redesigned card with generative art, frosted glass, breathing animations |
| `src/components/tarot/MatrixLegend.tsx` | Visual legend explaining the CHORDS x AGENDAS mapping |

### Modified Files

| File | Changes |
|------|---------|
| `src/data/entrepreneurialTarot.ts` | Add "The Weaver" (22nd card), add `matrixPosition`/`board` fields to `MajorArcanaCard`, add `matrixRow`/`matrixCol` to `MinorArcanaCard`, update types |
| `src/pages/EntrepreneurialTarot.tsx` | Integrate new components, add Constellation tab, swap card rendering to use `EnhancedCardDisplay` |
| `src/pages/LandingPage.tsx` | Add "Tarot" link to desktop nav (line 69-70) and mobile menu (line 98-99) |
| `src/index.css` | Add keyframes for `breathing`, `moire-shift`, and `constellation-glow` animations |

### Generative Art Algorithm

Each card's SVG is deterministically seeded by its matrix position:

```text
seed = (row * 8 + col) * suitIndex
concentric circles = row + 2
rotation angle = col * 45 degrees
color hue offset = seed % 360
line density = stage index (sparser at Agendas, denser at Higher Self)
```

This ensures every card is visually unique while maintaining family resemblance within suits and dimensions.

### Card-to-Matrix Mapping

```text
Major Arcana (suit -> board, letter -> row):
  MAGIC: M=row1, A=row2, G=row3, I=row4, C=row5
  LOVE:  L=row1, O=row2, V=row3, E=row4
  CALM:  C=row1, A=row2, L=row3, M=row4
  OPEN:  O=row1, P=row2, E=row3, N=row4
  FREE:  F=row1, R=row2, E1=row3, E2=row4
  The Weaver: center (4,4), all boards

Minor Arcana (dimension -> column, stage -> row):
  C=col1, H=col2, O=col3, R=col4, D=col5, S=col6
  Agendas=row1, Lens=row2, Maps=row3, Glitch=row4,
  Drift=row5, Tune=row6, Shadow=row7, Higher Self=row8
```

