

# Add 9 New Artefacts to Drift Library

## Overview

9 new resources to add: 1 PDF document, and 8 images (a mix of project illustrations from the "Wild Child / Calm Computing / IoTheatre" universe and a hand-drawn mind map).

## Categorization

| File | Title | Axis | Category |
|---|---|---|---|
| CalmComputing_-_V4.pdf | Calm Computing V4 -- Presentation | CALM | Applied Poetry |
| QDS_Iotheatre.001-820x400.jpg | IoTheatre -- Quartier des spectacles | OPEN | Connected Life |
| Wild_Child.jpg | Wild Child -- Learning about the 5 Senses | FREE | Community |
| Spoken_Voice.jpg | Spoken Voice -- Illustration | LOVE | Facilitation |
| Interconnectivity.jpg | Interconnectivity -- Illustration | OPEN | Connected Life |
| Freakout_in_Server_Room.jpg | Freakout in a Server Room -- Illustration | CALM | Applied Poetry |
| Fighting_Inattention.jpg | Fighting Inattention -- Illustration | CALM | Applied Poetry |
| Return_WildChild.jpg | (Return to) Wild Child -- Illustration | FREE | Community |
| 11947848...o.jpg | Tale of Loss and Interconnectedness -- Mind Map | OPEN | Connected Life |

## Technical Changes

### 1. Copy assets
- PDF goes to `public/drift/CalmComputing_V4.pdf` (downloadable binary)
- 8 images go to `public/drift/` (consistent with existing image artefacts)

### 2. `src/data/driftMonthlyDiscoveries.ts`
Add 9 new entries to `driftLibraryArtefacts`:
- 7 image artefacts with `imagePath`
- 1 PDF artefact with `filePath` (like the .xls files)
- 1 image artefact for the mind map

### 3. `src/pages/DriftLibrary.tsx`
Add PDF rendering support: detect `.pdf` extension in `filePath` and show a document icon (using `FileText` from lucide) instead of the spreadsheet icon. Minor conditional update in the artefact card rendering.

## Files Modified

1. `public/drift/` -- 9 new files (8 images + 1 PDF)
2. `src/data/driftMonthlyDiscoveries.ts` -- add 9 entries to `driftLibraryArtefacts`
3. `src/pages/DriftLibrary.tsx` -- handle PDF file type icon

