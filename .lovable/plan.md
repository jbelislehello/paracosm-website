## Sync a full Calm Magic explanation panel with the active module

Today the right column shows the live matrix only. The body copy lives inside the left-hand cards. I'll add a **dedicated Explanation Panel above the matrix in the sticky right column** that swaps its full contents instantly (fade + slide, ~250ms) the moment `activeIdx` changes — whether the user clicks a step pill, clicks a card, or scrolls.

### What the panel shows

Every module gets four new structured fields. The panel renders them as labeled blocks so the visitor reads a complete Calm Magic explanation at a glance:

```text
╔══════════════════════════════════════════╗
║  [icon] 02 · LENS                        ║
║  Landscape · Energy · Synergies          ║
║                                          ║
║  PRINCIPLE                               ║
║  Once the inner ground is held,          ║
║  perception widens. LENS rows let the    ║
║  system see itself.                      ║
║                                          ║
║  HOW IT WORKS                            ║
║  • Row 4 · Landscape — terrain &         ║
║    Intuitions (the I of MAGIC)           ║
║  • Row 5 · Energy — flow & Compasses     ║
║  • Row 6 · Synergies — integration       ║
║                                          ║
║  IN PRACTICE                             ║
║  Tiles light up when teams report        ║
║  "I can suddenly see what we're doing."  ║
║                                          ║
║  CONNECTS TO                             ║
║  [Builds on AGENDAS] [Unlocks NOEMS…]    ║
╚══════════════════════════════════════════╝
            ▼ live matrix below ▼
```

### Implementation

Single file: `src/components/calm-magic-demo/BoardAnatomy.tsx`.

1. **Extend the `Module` type** with four new fields:
   - `principle: string` — one-sentence why
   - `mechanic: string[]` — bulleted breakdown of rows/cols at play
   - `inPractice: string` — concrete usage moment
   - `connects: string[]` — chips linking to other modules / seasons

2. **Author content** for all five modules (AGENDAS, LENS, CHORDS, MAPS, Tile) using existing project memory — the 8×8 matrix structure doc, the triple-engine concept, the polyvagal/hexagram/fragment tile model, and the PRD compiler.

3. **Add `<ExplanationPanel module={active} />`** rendered above the matrix inside the sticky right card. Wrap it in `<AnimatePresence mode="wait">` keyed on `activeIdx` so the entire panel cross-fades + slides 8px on every change. Duration ~250ms with `easeOut`.

4. **Keep the left-rail cards** but slim them down: the click/scroll target stays, the short label stays, but the long body + takeaway is **removed from the cards** (they're now in the panel) — this avoids duplicating copy. The cards become navigation, the panel becomes the read.

5. **Mobile**: on small screens the right column already stacks below the rail. The panel renders inline above the matrix, so scrolling the rail still updates the panel + matrix above it via the existing IntersectionObserver — no behavior change needed.

### Out of scope

- No changes to other demo sections.
- No new dependencies (uses existing framer-motion + lucide-react).
- No copy in i18n yet (English only, matching the rest of the demo page).
