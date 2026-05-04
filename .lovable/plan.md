## Add visible Refresh action to RecentDreams

Update `src/components/calm-magic/dream/RecentDreams.tsx`:

1. Read `dataUpdatedAt` from the existing `useQuery` result.
2. Wrap the rendered output in a fragment with a small header row above the grid (in both the "data" and "empty" branches):
   - Left: a subtle muted label like "Updated <relative time>" derived from `dataUpdatedAt` (fallback "just now"). Hidden when there's no data yet.
   - Right: a `Button variant="ghost" size="sm"` labeled "Refresh" with a `RefreshCw` icon.
     - `onClick={() => refetch()}`
     - `disabled={isFetching}`
     - Icon gets `animate-spin` while `isFetching`
3. Refetch flows through the existing `queryFn`, which already calls `writeCache(limit, rows)`, so the sessionStorage cache updates automatically.
4. Toast on success of a manual refresh is unnecessary — the swapped data is feedback enough; only the existing error toast remains.

Small helper `formatRelative(ts)` inside the file: returns "just now" / "Xm ago" / "Xh ago" / locale date.

No DB or other component changes.