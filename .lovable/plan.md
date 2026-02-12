

# Add 3 Spreadsheet Resources to Drift as Artefacts

## Overview

Three Excel spreadsheet documents need to be added to the Drift artefact system. Since these are `.xls` files (not images), the artefact system needs a small extension to support downloadable document files alongside image-based artefacts.

## Axis and Category Mapping

| Document | Axis | Category | Rationale |
|---|---|---|---|
| Grille des livrables fidélité v2 | CALM | Workflows | UX deliverables and fidelity framework for production processes |
| Tableau des transitions architecturales | OPEN | Connected Life | Web evolution timeline from 1.0 to 4.0, system-level thinking |
| Veille Web 2.0 | OPEN | Connected Life | Technology watch grid mapping Web 2.0/3.0/4.0 concepts |

## Month Assignment

These will be added to existing 2022 months as artefacts (not tied to a specific month -- added as library artefacts alongside the existing Transmedia Map and Game Plan).

## Technical Changes

### 1. Copy files to `public/drift/`
- `Grille_livrables_fidelite_v2.xls` to `public/drift/Grille_livrables_fidelite_v2.xls`
- `Tableau_des_transitions_architecturales.xls` to `public/drift/Tableau_des_transitions_architecturales.xls`
- `Veille_Web_2.0.xls` to `public/drift/Veille_Web_2.0.xls`

These go in `public/` (not `src/assets/`) because they are downloadable binary files, not imported ES modules.

### 2. `src/data/driftMonthlyDiscoveries.ts`
- Extend `DriftArtefact` interface to add an optional `filePath?: string` field (for downloadable documents) alongside the existing `imagePath` (which becomes optional too)
- Add 3 new entries to `driftLibraryArtefacts` array with `filePath` pointing to the public URLs

### 3. `src/pages/DriftLibrary.tsx`
- Update artefact rendering to handle file-based artefacts (show a download card with file icon instead of image preview)
- If `artefact.filePath` exists and no `imagePath`, render a document-style card with a download link
- If `artefact.imagePath` exists, keep the existing clickable image behavior

### 4. `src/pages/DriftMonthlyDiscovery.tsx`
- Same rendering update for file-based artefacts in monthly views

## Files Modified

1. `public/drift/Grille_livrables_fidelite_v2.xls` (new)
2. `public/drift/Tableau_des_transitions_architecturales.xls` (new)
3. `public/drift/Veille_Web_2.0.xls` (new)
4. `src/data/driftMonthlyDiscoveries.ts` (extend DriftArtefact, add 3 entries)
5. `src/pages/DriftLibrary.tsx` (handle file-based artefacts)
6. `src/pages/DriftMonthlyDiscovery.tsx` (handle file-based artefacts)
