## Add error handling + retry to RecentDreams

Update `src/components/calm-magic/dream/RecentDreams.tsx`:

1. **Track error state**: add `error: string | null` state alongside `loading` and `dreams`.
2. **Refactor fetch into a callable function** (`fetchDreams`) wrapped in `useCallback`, so it can be invoked on mount and on retry. Use try/catch around the Supabase call, check `error` from the response, and set a friendly message (e.g. "We couldn't load recent dreams right now."). Log technical detail to `console.error` for debugging.
3. **Friendly error UI**: when `error` is set, render a card matching the empty-state styling with:
   - An `AlertCircle` icon
   - The friendly message
   - A "Try again" `Button` (outline, sm) that calls `fetchDreams()` and resets loading state
   - Optional toast via `sonner` on retry failure for visibility
4. **Preserve existing loading and empty states** unchanged.
5. **Cleanup**: keep the `cancelled` guard so retries after unmount don't set state.

No DB or routing changes. Self-contained component edit.