

# Complete and Illustrate the Entrepreneurial Tarot

## Current State

The deck has **21 Major Arcana** (MAGIC:5 + LOVE:4 + CALM:4 + OPEN:4 + FREE:4) and **48 Minor Arcana** (6 CHORDS x 8 stages) = **69 cards**. The documented system calls for **70 cards with 22 Major Arcana**, so one card is missing. Additionally, no card currently references its position in the 8x8 Calm Magic matrix.

## What We Will Build

### 1. Complete the Deck (the 22nd Major Arcana)

Add a **synthesis card** -- "The Weaver" -- representing the convergence of all five suits. This is the card that sits at the center of the matrix, the zero-point where LOVE/MAGIC/CALM/OPEN/FREE integrate. It belongs to no single suit but all of them.

### 2. Map Every Card to the Calm Magic Matrix

Each card will receive a `matrixPosition` property linking it to its exact tile on the 8x8 board:

**Major Arcana mapping** (Rows 1-5 map to AGENDAS/LENS stages, suit determines the board):
- MAGIC suit: Row 1 (Mindsets), Row 2 (Agilities), Row 3 (Goals), Row 4 (Intuitions in Landscape), Row 5 (Compasses in Energy)
- LOVE/CALM/OPEN/FREE suits map to columns 1-4 of their respective board layers
- The Weaver occupies position (4,4) -- the geometric center

**Minor Arcana mapping** (CHORDS x stages):
- Columns map to CHORDS dimensions (C=1, H=2, O=3, R=4, D=5, S=6)
- The 8 stages map to the 8 rows (Agendas rows 1-3, Lens rows 4-6, Maps rows 7-8)

### 3. Avant-Garde Art Direction

Following the feminine design principles (Receptivity, Softness, Cyclical Time, Embodiment, Intuition, Care, Inclusivity), the visual language will use:

**Generative SVG Illustrations per card** -- each card face gets a unique procedural SVG composition:
- **Organic topology lines** -- flowing curves generated from the card's matrix coordinates, never rigid grids
- **Interference patterns** -- overlapping translucent circles creating moire-like depth (embodiment principle)
- **Phase-shifted color fields** -- suit colors blend through HSL rotation based on row/column position
- **Breathing animations** -- slow scale/opacity pulses honoring cyclical time
- **Noise-textured backgrounds** -- subtle grain overlays for warmth and tactility

**Card face redesign:**
- Large typographic glyph (letter) rendered with a clipping mask revealing the generative pattern beneath
- Matrix coordinate displayed as a small "address" tag (e.g., "M4.3" = MAGIC board, row 4, col 3)
- Question text in a semi-transparent floating panel with frosted glass effect
- Upright/reversed shown as expanding/contracting visual metaphors (not just text)

**New "Constellation View"** -- a full 8x8 interactive grid where:
- Each cell contains the corresponding card as a glowing node
- Hovering reveals the card's question in a luminous tooltip
- Clicking opens the full card detail
- The Window of Tolerance expansion rings are visible as concentric outlines
- Diagonal fan lines connect corners through the center
- Cards glow brighter as they are "discovered" (drawn at least once)

### 4. Best Placement on the Site

**Primary**: Add "Tarot" to the **main navigation bar** (both desktop and mobile menu) on `LandingPage.tsx`, positioned between "Tonalli" and "Events" -- it is a standalone tool deserving top-level visibility.

**Secondary**: The existing links from the Retreat page and Footer remain.

**Tertiary**: Add a compact "Oracle" teaser card to the landing page hero area or the Calm Magic Board section -- a single draw-one-card interaction embedded inline that links through to the full experience.

### 5. Enhanced Page Structure

The `/tarot` page will be restructured into:

1. **Hero** -- Immersive dark canvas with floating sacred geometry and the deck title
2. **Oracle Section** -- Draw 1 or 3 cards with the enhanced card visuals
3. **Constellation View** (new tab) -- The 8x8 matrix grid showing all cards mapped to their positions
4. **Deck Browser** -- Existing suit/CHORDS tabs, now with the generative card art
5. **Matrix Legend** -- An explanatory section showing how the cards map to CHORDSM(S) x AGENDAS

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/tarot/GenerativeCardArt.tsx` | SVG generator producing unique patterns per card based on matrix position |
| `src/components/tarot/ConstellationView.tsx` | 8x8 interactive grid view mapping cards to Calm Magic matrix |
| `src/components/tarot/EnhancedCardDisplay.tsx` | Redesigned card component with generative art, frosted glass, breathing animations |
| `src/components/tarot/MatrixLegend.tsx` | Visual legend explaining CHORDSM(S) x AGENDAS mapping |

### Files to Modify
| File | Changes |
|------|---------|
| `src/data/entrepreneurialTarot.ts` | Add 22nd card ("The Weaver"), add `matrixPosition` and `board` fields to all cards, add `matrixRow`/`matrixCol` to MinorArcanaCard |
| `src/pages/EntrepreneurialTarot.tsx` | Integrate new components, add Constellation tab, update card rendering to use enhanced display |
| `src/pages/LandingPage.tsx` | Add "Tarot" link to desktop nav and mobile menu |
| `src/index.css` | Add new keyframes for breathing, moire, and constellation glow animations |

### Card-to-Matrix Mapping Logic

```text
Major Arcana: suit determines the "board" (LOVE/MAGIC/CALM/OPEN/FREE)
  - Each suit's letters map to rows based on the AGENDAS/LENS/MAPS structure
  - MAGIC: M=row1, A=row2, G=row3, I=row4, C=row5
  - LOVE: L=row1, O=row2, V=row3, E=row4
  - CALM: C=row1, A=row2, L=row3, M=row4
  - OPEN: O=row1, P=row2, E=row3, N=row4
  - FREE: F=row1, R=row2, E1=row3, E2=row4
  - The Weaver: center position, all boards

Minor Arcana: CHORDS dimension = column, stage = row
  - C=col1, H=col2, O=col3, R=col4, D=col5, S=col6
  - Agendas=row1, Lens=row2, Maps=row3, Glitch=row4,
    Drift=row5, Tune=row6, Shadow=row7, Higher Self=row8
```

### Generative Art Algorithm (per card)

Each card's SVG is seeded by its matrix position:
- `seed = (row * 8 + col) * suitIndex` produces deterministic but unique patterns
- Number of concentric circles = row + 2
- Rotation angle = col * 45 degrees
- Color hue offset = (seed % 360)
- Line density = stage index (sparser at Agendas, denser at Higher Self)

This ensures every card is visually unique while maintaining coherent family resemblance within suits and dimensions.

