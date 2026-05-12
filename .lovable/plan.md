## Goal

Turn the Calm Magic book into the site's primary revenue and lead generator. The book becomes a **living manuscript** assembled from (a) curated uploads and (b) tagged site content, drafted chapter-by-chapter by Lovable AI, gated behind a tiered funnel.

## 1. Content model (database)

New tables (all RLS-protected, admin-write / public-read where noted):

- `book_chapters` — `id`, `slug`, `order_index`, `title`, `phase` (GL!TCH/DRIFT/TUNE/LOVE/MAGIC/CALM/FREE), `summary`, `status` (`outline`|`drafting`|`review`|`published`), `is_free_sample` (bool), `published_excerpt` (text), `published_at`. Public SELECT on `status='published'`; admin full access.
- `book_sources` — `id`, `chapter_id`, `kind` (`upload`|`site_page`|`prd`|`drift`|`journal`|`url`), `ref` (route or external URL), `title`, `excerpt`, `weight` (1–5), `included` (bool). Admin only.
- `book_uploads` — `id`, `chapter_id` (nullable), `file_path` (storage), `mime`, `original_name`, `extracted_text`, `notes`, `uploaded_by`, `created_at`. Admin only. Backed by a private `book-manuscript` storage bucket.
- `book_chapter_drafts` — `id`, `chapter_id`, `model`, `prompt_snapshot`, `draft_md`, `created_at`, `created_by`, `is_current`. Admin only — keeps every AI synthesis run for review.
- `book_leads` — extend the existing `book_preorders` semantics with `interest` (`sample`|`waitlist`|`cohort`|`org`), `chapter_slug` (which sample triggered capture), `utm` jsonb. (Or add columns to `book_preorders`.)
- `book_orders` — `id`, `user_id` (nullable for guest), `email`, `tier` (`cohort`|`org`), `stripe_session_id`, `amount`, `currency`, `status` (`pending`|`paid`|`refunded`), timestamps. Admin read; user reads own.

Core lead routing rule preserved: every captured email also fires `send-demo-request` style notification to **jbelisle@helloarchitekt.com**.

## 2. Edge functions

- `book-ingest-upload` — accepts file path in `book-manuscript` bucket, runs text extraction (pdf/docx/md/txt), writes `book_uploads.extracted_text`. Admin-only (validates `has_role`).
- `book-tag-site-content` — admin endpoint to attach a site route, PRD id, drift entry, or journal entry as a `book_sources` row.
- `book-synthesize-chapter` — admin-only. Loads chapter + its included `book_sources` + linked `book_uploads.extracted_text`, sends to Lovable AI Gateway (`google/gemini-3-flash-preview`) with a system prompt enforcing Calm Magic voice, four-capabilities frame, and the chapter's phase. Saves result to `book_chapter_drafts` and (optionally) updates `book_chapters.published_excerpt` after admin approves.
- `book-checkout-cohort` — Stripe `mode: "payment"` checkout for the practitioner cohort tier; `book-checkout-org` for org license. Both lazy-create Stripe customer by email, support guest checkout, return session URL.
- `book-lead-capture` — single entrypoint used by all three CTAs (free sample, waitlist, cohort interest). Inserts into `book_preorders`/`book_leads`, emails jbelisle@helloarchitekt.com via Resend, returns sample chapter URL when applicable.

## 3. Public /book page restructure

Reframe `src/pages/BookLaunch.tsx` around the funnel. New top-to-bottom order:

1. **Hero** — keep current cover + thesis, replace primary CTA with **"Read the free chapter"** (sample), secondary **"Join the waitlist"**.
2. **Living manuscript band** — "This book is being written from the work happening on this site." Live counters: chapters drafted / sources mapped / uploads ingested (read from public counts).
3. **Chapter index** — pulls `book_chapters` ordered by `order_index`. Each row shows phase chip, title, summary, status badge, and either:
   - "Read sample" button (if `is_free_sample`) → `/book/chapter/:slug`
   - "Drafting" / "In review" status (no body)
4. **Free sample chapter route** — new `/book/chapter/:slug` page. Renders `published_excerpt` (markdown). Sticky bottom: "Get the next chapter early — join the waitlist" (lead capture).
5. **Cohort offer** — practitioner cohort tier card with price + Stripe checkout button.
6. **Org license** — enterprise card with Stripe checkout (or "talk to us" form for >X seats).
7. **Existing thesis / pillars / playbooks / bridge / author** sections, condensed.
8. **Waitlist form** at the end (still email-only, routes to jbelisle@helloarchitekt.com).

All copy added to `src/i18n/{en,fr}/book.json`.

## 4. Admin manuscript console

New route `/book/manuscript` (gated by `has_role('admin')`):

- **Sources tab** — search bar over the site's existing content (PRDs, drift entries, journal, polen, route registry pages). Click → tag to a chapter with weight + notes.
- **Uploads tab** — drag-drop into `book-manuscript` bucket, calls `book-ingest-upload`, shows extracted preview.
- **Chapters tab** — list `book_chapters`. Per chapter: included sources, "Synthesize draft" button → calls `book-synthesize-chapter`, shows draft history, "Promote draft to published_excerpt", toggle `is_free_sample`, status change.
- **Leads tab** — table of `book_preorders` + `book_leads`, filterable by `interest`/`tier`, CSV export.

## 5. Funnel + analytics

- All CTAs fire `analytics_events` rows: `book_sample_viewed`, `book_waitlist_submitted`, `book_cohort_checkout_started`, `book_cohort_purchased`.
- `BookAnnouncementBanner` CTA changes from "Pre-order" to "Read the free chapter".
- `OnboardingGuide` keeps the existing book route option but its description points at "Read a free chapter now."

## 6. Stripe

- Two products created via Stripe MCP: **Practitioner Cohort** (one-off) and **Org License** (one-off; or contact form if user prefers no checkout for org).
- Use existing `STRIPE_SECRET_KEY` secret. Guest checkout supported.
- Success route `/book/thanks?tier=cohort`, cancel `/book?canceled=1`.

## 7. Out of scope (this pass)

- Recurring subscriptions, multi-language AI drafting beyond EN, full WYSIWYG editor for drafts (textarea + markdown preview only), DRM for the sample chapter.

## Technical notes

- AI calls go through Lovable AI Gateway via the Vercel AI SDK helper (`_shared/ai-gateway.ts`), default model `google/gemini-3-flash-preview`, structured prompt per chapter phase.
- Storage: private `book-manuscript` bucket; only admins read/write via signed URLs.
- RLS: `book_chapters` SELECT public when `status='published'`; everything else admin-only via `has_role(auth.uid(),'admin')`.
- File extraction in edge function: pdf via `pdfjs-dist` npm import; docx via `mammoth`; md/txt direct.
- All lead-capture flows still email **jbelisle@helloarchitekt.com** (core rule).
