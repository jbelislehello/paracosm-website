
# Add 8 Books to Drift - February 2026 (Love Axis)

## What will be added
8 new books to the February 2026 monthly entry, all on the **Love** axis:

| # | Title | Author | Category |
|---|-------|--------|----------|
| 1 | HOLO 1 | Philip Beesley et al. | Sensory Rooms |
| 2 | HOLO 2: IF/THEN | Tina Amiri et al. | Sensory Rooms |
| 3 | Non-Linear Leadership | Roman | Inquiry and Practices |
| 4 | Issue 01: Beginnings | Unknown | Telling Stories |
| 5 | Magazine Digi -- Hertz 2025 (No 13) | Unknown | Connected Life |
| 6 | Guide 2025-2026 des restaurants de Montreal | Unknown | Tangible Play |
| 7 | Originals | Adam Grant | Embodied Cognition |
| 8 | The Order of Time | Carlo Rovelli | Narratives |

## File changed
**`src/data/driftMonthlyDiscoveries.ts`** -- Add 8 entries to the `books` array of the Feb 2026 entry (line 491-493), all with `axis: "love"`. Books 7 and 8 will have their Amazon Canada URLs; the others will have empty strings or search-based URLs since no clear listings exist.

## No other changes needed
The DriftLibrary and monthly discovery pages already render all books dynamically from this data.
