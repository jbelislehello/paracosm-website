

# Add Artefacts Resource Type to Drift

## Overview

Two hand-drawn diagrams need to be added as a new "Artefacts" resource type in the Drift system:

1. **Transmedia Map** -- A layered diagram showing Noetical Flux, Perma Flux, Bio/Psy/Geo Flux with layers for mythologies, religions, ecosystems, behaviours, tekhne, and economy. Fits the **OPEN** axis (Human Dynamics and System Thinking / Connected Life).

2. **Jonathan Belisle Game Plan (2017-2020)** -- A concentric spiral diagram mapping story-driven innovation, calm magic, publishing, performances, V10 projects, and transformational design. Fits the **CALM** axis (Workflows).

## Technical Changes

### 1. Copy images to project
- `user-uploads://transmediamap.jpg` to `src/assets/drift/transmediamap.jpg`
- `user-uploads://JonathanBelisle-gameplan.jpg` to `src/assets/drift/JonathanBelisle-gameplan.jpg`

### 2. `src/data/driftMonthlyDiscoveries.ts` -- Add new type and data

Add a new `DriftArtefact` interface:
```typescript
export interface DriftArtefact {
  title: string;
  author: string;
  description: string;
  category: string;
  axis: DriftAxis;
  imagePath: string; // imported image asset
}
```

Add `artefacts?: DriftArtefact[]` to the `DriftMonthEntry` interface.

Add a `driftLibraryArtefacts: DriftArtefact[]` export (library extras, not tied to a month) containing both artefacts.

### 3. `src/pages/DriftLibrary.tsx` -- Render artefacts section

- Import `driftLibraryArtefacts`
- Collect artefacts for the current axis
- Add an "Artefacts" section with image cards (clickable to view full size)
- Include artefact count in totalResources

### 4. `src/pages/DriftMonthlyDiscovery.tsx` -- Render artefacts if present

- Add an "Artefacts" section after existing resource sections
- Display artefact images with title, author, description, axis badge

### 5. `src/pages/DriftLanding.tsx` -- Update resource counts

- Include artefact counts in the Resource Libraries card totals

## Files Modified

1. `src/assets/drift/transmediamap.jpg` (new -- copied from upload)
2. `src/assets/drift/JonathanBelisle-gameplan.jpg` (new -- copied from upload)
3. `src/data/driftMonthlyDiscoveries.ts` (add DriftArtefact type + library artefacts data)
4. `src/pages/DriftLibrary.tsx` (render artefacts section)
5. `src/pages/DriftMonthlyDiscovery.tsx` (render artefacts if present in a month)
6. `src/pages/DriftLanding.tsx` (include artefact counts)

