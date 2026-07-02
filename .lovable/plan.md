# Summer Deal — $8,500 MVP in 2 Weeks

Add a bilingual (EN/FR) Summer Deal promotion to the landing page: a top hero announcement banner + a dedicated offer section with a contact form that writes to Supabase and emails jbelisle@helloarchitekt.com.

## What ships

### 1. Landing hero announcement banner
- Dismissible strip above the hero (or at the top of the hero) on `src/pages/Index.tsx` (or the current landing route).
- Copy (FR): "Deal d'été — MVP de votre app ou site en 2 semaines · 8 500 $"
- Copy (EN): "Summer Deal — MVP of your app or website in 2 weeks · $8,500"
- CTA "Réserver / Book" scrolls to `#summer-deal` section.
- Uses brand tokens (bloom-magenta / bloom-amber), no hardcoded colors. Respects the Paracosm visual system already in use.

### 2. Summer Deal section (`#summer-deal`)
Dedicated section on the landing page with:
- Headline + subhead (bilingual via i18n)
- Price tag: $8,500 CAD · fixed scope · 2-week delivery
- What's included (5–6 bullets): discovery call, scoped MVP spec, design system, working web app (React/Supabase), deploy + handoff, 1-week post-launch support
- Who it's for: founders, consultants, HA Labs clients validating a concept
- Limited slots note (creates urgency)
- Lead form: name, email, company (optional), project idea (textarea), honeypot + time-trap (mirror `send-demo-request` pattern)

### 3. Backend
- New table `summer_deal_leads` (id, name, email, company, project_idea, language, source, created_at). RLS: anon INSERT allowed, admin-only SELECT. Explicit GRANTs.
- New edge function `send-summer-deal-lead`:
  - Zod validation, honeypot, time-trap, best-effort rate limit (same shape as `send-demo-request`)
  - Inserts row into `summer_deal_leads`
  - Sends email to jbelisle@helloarchitekt.com via Resend (RESEND_API_KEY already configured)
  - Returns success even on honeypot/time-trap trip

### 4. i18n
- Add `summer_deal` namespace in `src/i18n/en/` and `src/i18n/fr/` with all copy (banner, section, form labels, success/error toasts).

## Files

**Create**
- `src/components/landing/SummerDealBanner.tsx` — dismissible top banner
- `src/components/landing/SummerDealSection.tsx` — offer section + form
- `supabase/functions/send-summer-deal-lead/index.ts`
- `src/i18n/en/summer-deal.json`, `src/i18n/fr/summer-deal.json`

**Modify**
- Landing page (`src/pages/Index.tsx` or equivalent — will confirm exact file when building) to mount banner + section
- `src/contexts/LanguageContext.tsx` (or wherever namespaces are registered) to load the new i18n namespace

**Migration**
- Create `summer_deal_leads` table with RLS + GRANTs

## Non-goals
- No new route (`/summer-deal`) — placement is landing hero banner + section only
- No changes to nav, other pages, or existing offers
- No payment integration — this is a lead capture, follow-up happens by email

Approve and I'll build it.
