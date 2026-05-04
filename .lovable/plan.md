## Goal

Add a "Recently dreamt" preview section to `/dream-and-learn` showing the latest public dreams from `dream_runs`, each linking to `/dream/:slug`. Frame it around the user's distinction: **Dreams = inventive part, Learn = expressive part**.

---

## New component — `src/components/calm-magic/dream/RecentDreams.tsx`

A self-contained client component that:

- Queries Supabase: `dream_runs` where `is_public = true`, ordered by `created_at desc`, limit 6. Selects `id, share_slug, question, summary, created_at, overall_maturity`. RLS already allows public read for `is_public = true`.
- Renders a 1/2/3-column responsive grid of cards.
- Each card shows:
  - Date (locale)
  - The dream question (italic, line-clamped to 3 lines) as the title
  - Summary excerpt (line-clamped to 3 lines) when present
  - Axis maturity badges (LOVE / MAGIC / CALM / OPEN / FREE) computed from `overall_maturity`, only rendering axes with > 0
  - "Open dream →" affordance
- The whole card is wrapped in `<Link to={`/dream/${share_slug}`}>` for navigation.
- Loading + empty states (skeleton spinner; "No public dreams yet" placeholder card).
- All styling via existing design tokens (`bg-card`, `border-border`, `text-primary`, `text-accent`, `text-muted-foreground`) — no hex colors.

---

## Page integration — `src/pages/DreamAndLearn.tsx`

Insert a new section **between the existing "USE CASES" section and the "FAQ" section** (around line 479):

```tsx
{/* RECENT DREAMS */}
<section className="px-4 py-16 md:py-20">
  <div className="container max-w-6xl mx-auto">
    <div className="text-center mb-10">
      <Badge variant="outline" className="mb-3 border-accent/40 text-accent">
        <Sparkles className="h-3 w-3 mr-1" />
        Recently dreamt
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold">
        What others have dreamed
      </h2>
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
        Dreams are the <strong className="text-foreground">inventive</strong> part of a project.
        Learn is how it becomes <strong className="text-foreground">expressive</strong>.
        Browse public dreams to see how briefs land across the five axes.
      </p>
    </div>
    <RecentDreams limit={6} />
  </div>
</section>
```

Add the import at the top of the file:
```tsx
import RecentDreams from "@/components/calm-magic/dream/RecentDreams";
```

---

## Out of scope

- No DB changes. The `dream_runs` table, `is_public` flag, and public-read RLS policy already exist.
- No pagination / "load more" — fixed limit of 6 most-recent. Can be raised later.
- No filtering by axis or search; that belongs to a separate gallery page if desired.
- No write paths.
