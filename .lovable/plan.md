# JSON-LD for trainings & book chapters

Wire schema.org structured data through the existing `usePageSeo({ jsonLd })` pipeline so Google can render rich results (Course cards for trainings, Article cards for chapters). BreadcrumbList is already auto-injected by `usePageSeo`, so it comes along for free.

## 1. `src/lib/structuredData.ts` — add a `courseSchema` helper

Trainings map naturally to schema.org **Course**. Add a builder alongside the existing `articleSchema` / `bookSchema`:

- `@type: "Course"` with `name`, `description`, `url`, `image`
- `provider: { "@id": ORG_ID }` (reuses Paracosm Organization)
- Optional `hasCourseInstance` with `courseMode: "Online"`, `courseWorkload` (ISO 8601 like `PT6H` from `training.hours`)
- Optional `syllabusSections` built from `training_modules` (name + description) when modules are loaded
- Optional `about` from `crewdle_focus`

## 2. `src/pages/TrainingDetail.tsx` — emit Course JSON-LD

Build the schema once `training` (and ideally `modules`) is loaded and pass it to `usePageSeo({ jsonLd })`. Memoize so the effect dep (`ldKey`) is stable. Image uses the same fallback chain already in place (`og_image_url` → generated SVG → default).

## 3. `src/pages/BookChapter.tsx` — emit Article JSON-LD

Use the existing `articleSchema` builder once `chapter` is loaded:

- `title` = chapter title (with edition suffix matching `<title>`)
- `description` = `chapter.summary`
- `url` = `/book/chapter/${slug}`
- `image` = same fallback chain
- `author` defaults to "Jonathan" from the helper
- Add `isPartOf` pointer to the Calm Magic Book by composing the schema inline (spread `articleSchema(...)` then add `isPartOf: { "@type": "Book", name: "Calm Magic", url: abs("/book") }`)

## 4. Index pages (small bonus, keeps coverage consistent)

- `src/pages/TrainingsIndex.tsx` — emit `ItemList` of trainings (uses existing `itemListSchema`)
- `src/pages/BookCompassesIndex.tsx` — already covered by breadcrumbs; add `ItemList` only if chapter list is loaded on that page (skip otherwise)

## Out of scope

- No DB changes, no new columns
- No SSR — JSON-LD ships via `usePageSeo` after hydration; Googlebot executes JS and reads it. LinkedIn/Slack previews are unaffected (they only read og:* which is already handled).
- No changes to the build-time OG plugin

## Technical notes

- `usePageSeo` already clears and re-injects page-scoped JSON-LD on each render via `data-page-seo="true"`, so we just pass the object(s).
- `jsonLd` accepts a single object or an array; pass an array when we want Course + an `ItemList` of modules.
- Memoize composed schemas with `useMemo` keyed on `training?.id` / `chapter?.id` to avoid effect thrash.
