## Replace spinner with skeleton grid in RecentDreams

Update `src/components/calm-magic/dream/RecentDreams.tsx`:

1. Import `Skeleton` from `@/components/ui/skeleton`. Drop the now-unused `Loader2` import.
2. Replace the spinner-based `loading` branch with a grid of `limit` placeholder cards that mirror the real card layout:
   - Header: small date pill skeleton + 2 lines of title skeleton
   - Body: 3 lines of summary skeleton, a row of 3 small badge-shaped skeletons, and a short "Open dream" skeleton
3. Use the same grid classes as the loaded state (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`) so the layout doesn't shift when data arrives.
4. Add `aria-busy="true"` and an `aria-label` for accessibility.

No other behavior changes.