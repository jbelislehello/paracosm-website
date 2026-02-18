

# Replace Tarot Deck with 64-Card Matrix Stack

## Overview

Replace the current 70-card mixed deck (22 Major + 48 Minor) with a pure 64-card matrix deck (8 rows x 8 columns) used for all readings. Each card gets a unique description derived from the intersection of its row stage and column dimension. The Major Arcana cards remain browsable but are no longer part of the draw pool.

## What Changes

### 1. Expand dimensions from 6 to 8

Add two new MAPS columns to complete the 8x8 grid:
- **Column 7: P (Protocols)** -- governance, agreements, rules
- **Column 8: Sy (Systems)** -- infrastructure, integration, architecture

This adds 16 new cards (2 columns x 8 rows) to the existing 48, totaling 64.

### 2. Add descriptions to all 64 cards

Each card receives a 1-2 sentence `description` field explaining the meaning of that matrix intersection. Examples:

| Row x Col | Description |
|-----------|-------------|
| Mindsets x Chances | "The mental frameworks you hold around risk-taking. Examines whether your beliefs about experimentation enable or constrain your growth." |
| Higher Self x Systems | "Your most evolved relationship with infrastructure and integration. Asks how living systems mastery becomes an expression of sovereign leadership." |
| Glitch x Heart | "The unexpected disruption that reveals a deeper truth about compassion. Asks what heartbreak in your organization is teaching you about authentic care." |

### 3. Update draw functions

`drawCards` will pull from the 64-card `matrixDeck` instead of `fullDeck`. `fullDeck` remains available for constellation/browser views.

### 4. Update UI text and tabs

- Hero subtitle: "64 matrix cards" instead of "70 entrepreneurial archetypes"
- CHORDS tab: add P and Sy dimension sections
- MatrixLegend: add Protocols and Systems to horizontal axis
- CardDetail modal: display the new description field

## Technical Details

### Modified Files

| File | Changes |
|------|---------|
| `src/data/entrepreneurialTarot.ts` | Add `description` to `MinorArcanaCard` interface. Add `'P' | 'Sy'` to `ChordsDimension`. Add dimension data, colors, questions, upright/reversed for P and Sy. Add `matrixDescriptions` (64 entries). Create `matrixDeck` export. Update `drawCards` to use `matrixDeck`. |
| `src/pages/EntrepreneurialTarot.tsx` | Update hero text. Add P/Sy to dimensions array. Show `description` in CardDetail modal. |
| `src/components/tarot/MatrixLegend.tsx` | Add Protocols and Systems rows to the horizontal axis legend. |
| `src/components/tarot/EnhancedCardDisplay.tsx` | Show truncated description on the revealed card face. |

### Data additions

**New types:**
```text
ChordsDimension: 'C' | 'H' | 'O' | 'R' | 'D' | 'S' | 'P' | 'Sy'
```

**New dimension entries:**
```text
P: { name: 'Protocols', theme: 'governance & agreements' }
Sy: { name: 'Systems', theme: 'infrastructure & architecture' }
```

**New card interface field:**
```text
MinorArcanaCard {
  ...existing fields
  description: string  // 1-2 sentence narrative
}
```

**Description pattern** -- 64 unique descriptions, each combining the row's stage theme with the column's dimension theme. All 64 will be hand-written to ensure quality and relevance to entrepreneurial leadership.

**New exports:**
```text
matrixDeck: MinorArcanaCard[]  // all 64 cards (8 dimensions x 8 stages)

drawCards(count) now uses matrixDeck instead of fullDeck
fullDeck remains for constellation/browser views
```

### UI changes

**CardDetail modal** -- new description panel between question and upright/reversed:
```text
"Card question here?"

[Description in a subtle frosted panel]

Upright: ...
Reversed: ...
```

**Hero text update:** "64 matrix archetypes" replacing "70 entrepreneurial archetypes"

**CHORDS tab:** P and Sy sections added after S, each showing 8 cards in a grid.

**MatrixLegend:** Two new rows in horizontal axis for P (Protocols) and Sy (Systems).

