## Plan

1. **Fix the homepage route mismatch**
   - Add an explicit `/index` route that redirects to `/`, so the preview path the user is currently viewing shows the real homepage instead of missing/old content.

2. **Put every recent visible homepage change on the actual homepage**
   - Ensure `LandingPage.tsx` includes, near the top:
     - Relational quote: “Most organizations don't lack ideas...”
     - Practitioner positioning: Base44 / Lovable + Powerbase / Crewdle bridged by Calm Magic
     - Foreplay / Foresight / Forecast offering triad
     - Summer Deal banner and Summer Deal section
     - Existing primary hero CTA for booking a discovery call

3. **Add Trainings to the homepage navigation**
   - Add `Trainings` to both desktop and mobile nav in `LandingPage.tsx`, matching the existing `/trainings` route.

4. **Verify the visible result**
   - Check `/` and `/index` in the browser preview.
   - Confirm the recent sections are present on the homepage and `/index` lands on the same homepage content.

## Technical notes

- Keep changes frontend-only.
- Do not touch database, Supabase, security findings, or publishing settings.
- Avoid changing the existing `/agentic-ux` page except where routing needs to point users back to the canonical homepage.