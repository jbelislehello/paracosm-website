
## Goal

Launch a dedicated book promotion experience for **Calm Magic** that positions the framework as essential for the agentic era — covering relational intelligence, pragmatic imagination, creative ideation, and existential design — with a clear bridge to Crewdle.ai as the operational orchestrator that uses Calm Magic's design + systems thinking.

## Approach

Add a high-conversion **Book Launch** section + dedicated **/book** page, integrated into the existing landing page hierarchy (above Spring 2026 to capture launch energy), fully bilingual (FR/EN), and tied to lead capture for pre-orders / waitlist.

## What I'll build

### 1. New `/book` page — `src/pages/BookLaunch.tsx`
A focused landing page with these sections:
- **Hero**: Book cover mockup (CSS 3D tilt) + title, subtitle, "Pre-order / Join waitlist" CTA
- **The Thesis**: 4 pillars as cards — Relational Intelligence · Pragmatic Imagination · Creative Ideation · Existential Design
- **Why Now (Agentic Era)**: Short manifesto on preferable futures + worldbuilding
- **What's Inside**: Chapter overview (collapsible accordion, ~7 chapters mapped to Calm Magic phases: GL!TCH → DRIFT → TUNE → LOVE → MAGIC → CALM → FREE)
- **From Framework to Operations**: Visual bridge showing Calm Magic (thinking) → Crewdle.ai (orchestration/building) — uses the existing transformation-design-pipeline
- **Author / Practitioner Bio**: Short Jonathan bio + credentials
- **Pre-order form**: Email capture (name, email, role, interest tier: Reader / Practitioner / Org License)
- **Endorsements placeholder** + FAQ

### 2. Landing page integration — `src/pages/LandingPage.tsx`
- Add a **"New Book" announcement banner** at the very top (dismissible, sticky) → links to `/book`
- Add a **collapsible "Book" section** between Hero and Spring 2026 offer
- Update `OnboardingGuide.tsx` to add a 4th path option: **"I want to read the book"** → routes to `/book`

### 3. Lead capture (Lovable Cloud)
- New table `book_preorders` (name, email, role, tier, language, source, created_at)
- RLS: public INSERT, admin SELECT only (via existing `has_role` function)
- Simple submit handler in the pre-order form using supabase client

### 4. Bilingual i18n
- New module `src/i18n/{en,fr}/book.json` (~60 keys: hero, pillars, chapters, bridge, form, FAQ)
- Register `'book'` in `LanguageContext.tsx`

### 5. Routing
- Add `<Route path="/book" element={<BookLaunch />} />` in `src/App.tsx`

### 6. Visual assets
- Generate a book cover image (gradient + title typography) saved to `src/assets/calm-magic-book-cover.jpg` via the image generator
- Use existing brand palette (agent-blue / agent-purple / agent-pink)

## Technical notes
- All copy goes through `t('book.*')` — no hardcoded strings
- Form uses existing shadcn `Form` + `react-hook-form` + `zod` validation
- Chapter accordion uses existing shadcn `Accordion`
- Banner persists dismissal in `localStorage` (`paracosm-book-banner-dismissed`)
- No new npm dependencies

## Out of scope (ask if you want them)
- Stripe/Paddle pre-order payments (currently email waitlist only)
- Sample chapter PDF download
- Author email automation / drip sequence
