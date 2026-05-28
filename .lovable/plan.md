## Goal
Each training and book chapter ships with its own Open Graph + Twitter image so shared links preview uniquely. Use a stored custom image when present; otherwise auto-generate a branded SVG placeholder at build time.

## What changes

### 1. Database (one migration)
Add a nullable `og_image_url` text column to `trainings` and `book_chapters`. Stores either a full URL (uploaded asset) or a relative path under the site (e.g. `/og/trainings-glitch.svg`). No new bucket, no RLS changes — both tables already have admin write + public read for published rows.

### 2. Build-time generator (`vite-plugin-prerender-og.ts`)
Extend the existing prerender plugin:
- Select `og_image_url` alongside slug/title/summary for trainings and book chapters.
- When a row has `og_image_url`, use it verbatim in `og:image` and `twitter:image`.
- When it's null, **generate a branded SVG placeholder** during the build and emit it at `dist/og/trainings-<slug>.svg` (or `dist/og/book-<slug>.svg`). The SVG is deterministic: 1200×630, Paracosm dark gradient background, white "PARACOSM" wordmark top-left, training/chapter title wrapped center, phase or tagline below. No external font calls — uses system-stack `font-family` so it renders on every social crawler.
- Reference the emitted file (`/og/...svg`) in the route's head.

Static index routes (`/trainings`, `/book`, `/book/compasses`, `/book/operators`) keep the existing `/og-image.jpeg` default.

### 3. Admin editor (light touch)
Add a single "OG image URL" text input to the existing training and book-chapter admin editors so an admin can paste a custom image URL later. No upload widget in this pass — admins can drop any public URL (Supabase Storage, Unsplash, etc.). If you'd rather have an upload-to-Storage flow now, say so and I'll fold a `og-images` public bucket + uploader into the plan.

### 4. Runtime (`usePageSeo` consumers)
`TrainingDetail.tsx` and `BookChapter.tsx` already call `usePageSeo`. Pass the new `og_image_url` (or the generated placeholder URL) so JS-executing crawlers and the browser tab see the same image as the static head.

## Out of scope
- No SSR migration. Social crawlers continue to read the prerendered HTML head emitted at build.
- No image upload UI (unless you ask for it — see step 3).
- Nav, sitemap, and routing untouched.

## Verification
After build:
- `dist/trainings/glitch/index.html` `og:image` points at either the stored URL or `/og/trainings-glitch.svg`.
- `dist/og/trainings-glitch.svg` exists and renders a unique branded card.
- LinkedIn Post Inspector / `curl -A facebookexternalhit` against the published URL shows the per-page image.

## One question before I build
Do you want admins to **upload** OG images into Supabase Storage (I'll add a public `og-images` bucket + uploader), or is a **URL input** field enough for now? Default = URL input only.
