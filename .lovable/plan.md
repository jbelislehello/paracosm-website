## Add search filter to RecentDreams

Update `src/components/calm-magic/dream/RecentDreams.tsx` to let visitors filter the displayed gardens of dreams by question or summary text.

### Changes
1. **Imports**: add `Input` from `@/components/ui/input`, and `Search` + `X` icons from `lucide-react`.
2. **Local state**: `const [query, setQuery] = useState('')` inside the component.
3. **Derived list**: `filteredDreams = useMemo(() => { if (!query.trim()) return dreams; const q = query.toLowerCase(); return dreams.filter(d => d.question.toLowerCase().includes(q) || (d.summary ?? '').toLowerCase().includes(q)); }, [dreams, query])`.
4. **Toolbar UI** (above the grid, replacing/extending the current toolbar row):
   - Left: search `Input` with a `Search` icon prefix and a clear `X` button when `query` is non-empty. Placeholder: `"Search gardens of dreams…"`. `aria-label="Search recent dreams"`. Width: `max-w-xs`.
   - Right: existing "Updated …" label + Refresh button.
   - Layout: `flex-col sm:flex-row gap-2 sm:items-center sm:justify-between`.
5. **Empty filtered state**: when `dreams.length > 0` but `filteredDreams.length === 0`, render a small muted card: `"No dreams match \"{query}\"."` with a "Clear search" ghost button that resets `query`.
6. **Grid**: render `filteredDreams` instead of `dreams`.
7. Search runs purely client-side over the already-cached recent dreams — no extra DB calls, cache key unchanged.

No DB or other component changes.