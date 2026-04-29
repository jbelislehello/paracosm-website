## Interactive scrollytelling stepper for Board Anatomy

Replace the current hover-only `BoardAnatomy.tsx` with a true scrollytelling experience: a **clickable left rail of 5 modules** synced with a **sticky live matrix** on the right. Clicking a module animates the matrix to highlight the relevant region; scrolling the rail does the same automatically via `IntersectionObserver`.

### Layout

```text
┌─────────────────────────────┬──────────────────────────────┐
│  STEP PILLS (sticky on top) │                              │
│  [01·AGENDAS] [02·LENS] …   │                              │
│                             │   ╔══════════════════════╗   │
│  ┌───────────────────────┐  │   ║ Now showing · 02     ║   │
│  │ 01 · AGENDAS          │  │   ║                      ║   │
│  │ Mindsets·Agilities·…  │  │   ║   8×8 LIVE MATRIX    ║   │
│  │ [body + takeaway]     │  │   ║   (region highlights ║   │
│  └───────────────────────┘  │   ║    fade in/out)      ║   │
│  ┌───────────────────────┐  │   ║                      ║   │
│  │ 02 · LENS  ◀ ACTIVE   │  │   ╚══════════════════════╝   │
│  └───────────────────────┘  │       (sticky on desktop)    │
│  … 03, 04, 05               │                              │
└─────────────────────────────┴──────────────────────────────┘
```

### Five modules

| # | Module | Region highlighted |
|---|---|---|
| 01 | AGENDAS — Mindsets · Agilities · Goals | rows 1–3, all cols |
| 02 | LENS — Landscape · Energy · Synergies | rows 4–6, all cols |
| 03 | CHORDS — six relational dimensions | all rows, cols 1–6 |
| 04 | MAPS — Methodology · Architecture · Protocols · Systems | rows 7–8 + cols 7–8 (frame) |
| 05 | The tile — where it all meets | one cell at the intersection |

Each module card shows: step number, icon, title, short label, expanded body + a "Takeaway" callout — only when active (collapses when not).

### Interaction model

- **Click a step pill or any module card** → smooth-scrolls that module into view, marks it active.
- **Scrolling the page** → an `IntersectionObserver` (rootMargin `-40% 0% -40% 0%`) detects which module is in the viewport center and updates the active state.
- A short `userClickRef` lockout (~900ms) prevents the scroll observer from fighting smooth-scroll animations triggered by clicks.
- **Matrix region animation**: active cells fade to full opacity + primary→accent gradient with a staggered delay; inactive cells dim to 18% opacity. Row/column header letters tint to primary when their index is in the active region.
- The right column is `lg:sticky top-28` so the matrix stays in view while the rail scrolls. On mobile the matrix stacks below and step pills become a horizontally-scrollable sticky bar.
- Keyboard accessible: cards have `role="button"`, `tabIndex={0}`, Enter/Space activate.

### Technical details

- Single file change: rewrite `src/components/calm-magic-demo/BoardAnatomy.tsx`.
- Uses already-installed `framer-motion` (`motion`, `AnimatePresence`) and `lucide-react` icons (`Layers`, `Eye`, `Music2`, `Frame`, `Compass`).
- All colors via design tokens (`--primary`, `--accent`, `--muted-foreground`) — no hard-coded colors.
- No new deps, no route or data changes, the section keeps its existing `id="anatomy"` anchor so the hero CTA still scrolls here.

### Out of scope

- The other demo sections (Seasons, Tolerance, Tile, Constellation, PRD layers) are untouched.
- No analytics events on step changes (can add later if you want).
