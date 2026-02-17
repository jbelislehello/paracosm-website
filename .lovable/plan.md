
# Add Oracle Teaser to Homepage Hero

## What It Does

A compact, interactive "Draw a Card" widget placed just below the hero headline. Visitors can click a single button to reveal a randomly drawn tarot card with its generative art, name, and question -- then tap through to the full `/tarot` page.

## User Experience

1. Below the hero subtitle, a small glowing button reads "Draw from the Oracle"
2. Clicking it animates a card into view: generative SVG art, card name, matrix coordinate, and question text -- all in a compact frosted-glass panel
3. A "Explore the Full Deck" link appears beneath, navigating to `/tarot`
4. The card uses the same `GenerativeCardArt` and breathing animations from the tarot page

## Technical Details

### New File

| File | Purpose |
|------|---------|
| `src/components/hero/OracleTeaser.tsx` | Self-contained component: picks a random card from the full deck, renders a compact card preview with `GenerativeCardArt`, and links to `/tarot` |

### Modified File

| File | Changes |
|------|---------|
| `src/components/HeroSection.tsx` | Import and render `<OracleTeaser />` inside the backdrop-blur container, below the subtitle paragraph |

### OracleTeaser Component Details

- Uses `useState` to track drawn card (initially `null`)
- On click, picks a random card from `[...majorArcana, ...minorArcana]`
- Renders a compact layout (~200px tall): `GenerativeCardArt` on the left, card name + question on the right, wrapped in a frosted glass panel (`backdrop-blur-md bg-white/5 border border-white/10`)
- Matrix coordinate shown as a small badge
- "Explore the Full Deck" uses React Router `Link` to `/tarot`
- Fade-in animation on reveal using a CSS transition
