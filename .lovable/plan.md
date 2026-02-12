

# Add 20 New Books to Drift + Library Extras

## Overview

There are 20 new books to add, but only 3 empty monthly slots remain (Oct-Dec 2024). The plan: fill those 3 months (9 books), then store the remaining 11 books as "library-only" extras that appear on the axis resource library pages but aren't tied to a specific month.

## Part 1: Monthly Slots (9 books)

| Month | Book | Axis |
|---|---|---|
| **Oct 2024** | Odyssee (Homere) | FREE |
| **Oct 2024** | Histoire de la guerre du Peloponnese (Thucydide) | OPEN |
| **Oct 2024** | Emotional Intelligence: Self-Awareness (HBR) | CALM |
| **Nov 2024** | Le singe nu (Desmond Morris) | OPEN |
| **Nov 2024** | Le loup des steppes (Hermann Hesse) | MAGIC |
| **Nov 2024** | Design Works (Heather Fraser) | CALM |
| **Dec 2024** | Tools of Titans (Tim Ferriss) | CALM |
| **Dec 2024** | Les paysages interieurs (Catherine D'Amours) | MAGIC |
| **Dec 2024** | Information Arts (Stephen Wilson) | OPEN |

## Part 2: Library-Only Extras (11 books)

These appear only on the axis library pages, not tied to any month:

| Book | Axis |
|---|---|
| Thierry Kuntzel (art/theory) | MAGIC |
| Reinventing the Wheel (Jessica Helfand) | OPEN |
| Filthy Ratbag (Celeste Mountjoy) | LOVE |
| The Stack (Benjamin Bratton) | OPEN |
| A More Beautiful Question (Warren Berger) | CALM |
| How to Change Your Mind (Michael Pollan) | MAGIC |
| La magie du Cosmos (Brian Greene) | MAGIC |
| L'Ensorcellement du monde (Boris Cyrulnik) | LOVE |
| Le Moyen Age en Occident | FREE |
| Le feu aux entrailles (Manara and Almodovar) | LOVE |
| Ubiquitous Computing | OPEN |

## Technical Changes

### 1. `src/data/driftMonthlyDiscoveries.ts`
- Fill Oct-Dec 2024 entries with 3 books each (replace empty `books: []`)
- Add new `driftLibraryExtras` export: an array of `DriftBook` objects for the 11 library-only books

### 2. `src/pages/DriftLibrary.tsx`
- Import `driftLibraryExtras`
- Merge library extras into the book list alongside monthly books
- Show library-only books in a separate "Library Collection" subsection (no month/year label)

### 3. `src/pages/DriftLanding.tsx`
- Update Resource Libraries card counts to include library extras in the total

## Files Modified

1. `src/data/driftMonthlyDiscoveries.ts` -- fill 3 empty months + add library extras array
2. `src/pages/DriftLibrary.tsx` -- include library extras in axis pages
3. `src/pages/DriftLanding.tsx` -- update resource counts to include extras

