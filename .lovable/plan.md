

# Make Tarot Page Readable and Add Board Equation References

## Overview

Two changes: switch the tarot page from dark to a clean white/light background for legibility, and add clear Calm Magic board equation labels to every card so each card's position in the system is immediately understandable.

## 1. White/Light Background

The entire `/tarot` page currently uses `bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950` with white text. This will be switched to a clean white background with dark text, updating all child components accordingly.

### Files affected:
- **`src/pages/EntrepreneurialTarot.tsx`** -- Main page background, hero, nav bar, buttons, text colors, card detail modal, MiniCard overlay
- **`src/components/tarot/ConstellationView.tsx`** -- Grid node colors, tooltip backgrounds, text colors
- **`src/components/tarot/MatrixLegend.tsx`** -- Text and border colors
- **`src/components/tarot/EnhancedCardDisplay.tsx`** -- The card back/front styling (cards themselves can stay dark as art objects on a white canvas)

### Key color swaps:
- Page background: `bg-white text-gray-900` (or `bg-gray-50`)
- Nav header: `bg-white/90 border-gray-200`
- Text: `text-gray-900`, `text-gray-600`, `text-gray-400` instead of slate/white variants
- Buttons: readable borders and text for light backgrounds
- Card detail modal: keep dark overlay (`bg-black/60`) but update the modal panel to white with dark text
- Constellation grid: light background cells with colored nodes
- Ambient particles: reduce or keep subtle on light background

## 2. Board Equation References on Every Card

Each card will display a clear human-readable "board equation" showing its Calm Magic coordinates. The format:

**Major Arcana example:**
```
MAGIC Board | Row 3: Goals | Col 2: MAGIC
M3.2
```

**Minor Arcana example:**
```
CHORDS | Row 5: Drift | Col 1: Chances (C)
C5.1
```

### Where equations appear:
- **MiniCard** (browser grid): Small equation tag showing `Board | Stage | Dimension`
- **EnhancedCardDisplay** (drawn cards): Equation badge on both back and front faces
- **CardDetail modal**: Full equation breakdown with row meaning, column meaning, and board
- **OracleTeaser** (homepage): Equation label next to coordinate badge

### Data needed:
The stage names and dimension names are already available:
- `stages[]` array maps row index to stage name (Agendas, Lens, Maps, etc.)
- `chordsData` maps dimension letter to full name (Chances, Heart, Observer, etc.)
- `card.matrixPosition.board` gives the board name
- Major cards have `suit` for board context; minor cards use CHORDS dimension for column context

A small helper function will be added to `entrepreneurialTarot.ts`:
```
getCardEquation(card) -> {
  board: string,       // "MAGIC" or "LOVE" etc.
  stageName: string,   // "Goals" or "Drift" etc.
  dimensionName: string, // "Chances" or "Heart" etc.
  address: string      // "M3.2"
}
```

## Technical Details

### Modified Files

| File | Changes |
|------|---------|
| `src/data/entrepreneurialTarot.ts` | Add `getCardEquation()` helper and export `stages` array |
| `src/pages/EntrepreneurialTarot.tsx` | White background, light-theme nav/hero/buttons/text, updated MiniCard with equation tag, updated CardDetail modal with full equation, light-themed ambient particles |
| `src/components/tarot/EnhancedCardDisplay.tsx` | Add equation label on card back and front (cards stay dark as art objects) |
| `src/components/tarot/ConstellationView.tsx` | Light background grid cells, dark text labels, updated tooltip styling |
| `src/components/tarot/MatrixLegend.tsx` | Dark text on light background |
| `src/components/hero/OracleTeaser.tsx` | Add equation label (stage + dimension name) next to coordinate badge |

### Card Equation Display Format

On each card, the equation will read like:

```
MAGIC Board -- Goals (Row 3) -- Col 2
```

or for minor arcana:

```
Chances (C) -- Drift (Row 5) -- Col 1
```

This makes the matrix position immediately meaningful rather than just showing a cryptic coordinate code.

