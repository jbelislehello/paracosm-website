
## Linter result

One remaining warning: `book_preorders` INSERT policy uses `WITH CHECK (true)`. Anonymous submissions must stay open (it's the public waitlist), so the fix is to **tighten the WITH CHECK** to validate data shape rather than removing public access.

## Fix

Replace the policy `"Anyone can submit a pre-order"` on `public.book_preorders` with a constrained version:

```sql
DROP POLICY "Anyone can submit a pre-order" ON public.book_preorders;

CREATE POLICY "Anyone can submit a valid pre-order"
ON public.book_preorders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Length & format guards (anti-spam, prevents oversized payloads)
  char_length(name)  BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 5 AND 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND tier IN ('reader','practitioner','team','enterprise')
  AND language IN ('en','fr')
  AND (role IS NULL OR char_length(role) <= 120)
  AND (source IS NULL OR char_length(source) <= 200)
);
```

Notes:
- Keeps anonymous waitlist working.
- Blocks malformed emails, oversized payloads, unknown tiers/languages — eliminates the linter warning and adds a real anti-abuse layer at the DB boundary.
- If the current `tier` values in the form differ from `reader|practitioner|team|enterprise`, I'll align the CHECK list with the actual Zod enum in `BookLaunch.tsx` before applying.

## Steps

1. Read the Zod tier enum in `src/pages/BookLaunch.tsx` to confirm allowed `tier` values.
2. Run a single migration that drops the old policy and creates the constrained one.
3. Re-run the Supabase linter to confirm zero warnings.
4. Mark the `book_preorders_email_exposure` finding as fixed with explanation.
