

# Fix Resource Counts on Drift Landing Page

## Problem
The "Resource Libraries" section on the Drift landing page shows resource counts per axis, but the calculation (line 457 of `DriftLanding.tsx`) only includes **books, videos, and artefacts**. It is missing **podcasts, articles, songs, and tools** -- meaning the displayed counts are significantly lower than the actual number of resources available for each axis.

The DriftLibrary page itself (line 81) already counts all 7 resource types correctly, so only the landing page needs fixing.

## Fix

**File: `src/pages/DriftLanding.tsx`** (lines 452-457)

Add the missing podcast, article, song, and tool counts to the `totalCount` calculation:

```typescript
const bookCount = driftMonthlyDiscoveries.reduce((sum, entry) =>
  sum + entry.books.filter(b => b.axis === axis.key).length, 0);
const extraBookCount = driftLibraryExtras.filter(b => b.axis === axis.key).length;
const videoCount = driftMonthlyDiscoveries.reduce((sum, entry) =>
  sum + (entry.videos || []).filter(v => v.axis === axis.key).length, 0);
const podcastCount = driftMonthlyDiscoveries.reduce((sum, entry) =>
  sum + (entry.podcasts || []).filter(p => p.axis === axis.key).length, 0);
const articleCount = driftMonthlyDiscoveries.reduce((sum, entry) =>
  sum + (entry.articles || []).filter(a => a.axis === axis.key).length, 0);
const songCount = driftMonthlyDiscoveries.reduce((sum, entry) =>
  sum + (entry.songs || []).filter(s => s.axis === axis.key).length, 0);
const monthlyArtefactCount = driftMonthlyDiscoveries.reduce((sum, entry) =>
  sum + (entry.artefacts || []).filter(a => a.axis === axis.key).length, 0);
const libraryArtefactCount = driftLibraryArtefacts.filter(a => a.axis === axis.key).length;
const toolCount = driftTools.filter(t => t.axis === axis.key).length;
const totalCount = bookCount + extraBookCount + videoCount + podcastCount
  + articleCount + songCount + monthlyArtefactCount + libraryArtefactCount
  + toolCount;
```

This will also require importing `driftTools` at the top of the file if not already imported.

## Files Changed
- **`src/pages/DriftLanding.tsx`** -- update totalCount calculation to include all 7 resource types

