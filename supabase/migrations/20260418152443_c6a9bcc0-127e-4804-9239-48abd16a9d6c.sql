DROP POLICY IF EXISTS "Anyone can submit a pre-order" ON public.book_preorders;

CREATE POLICY "Anyone can submit a valid pre-order"
ON public.book_preorders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name)  BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 5 AND 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND tier IN ('reader','practitioner','org')
  AND language IN ('en','fr')
  AND (role IS NULL OR char_length(role) <= 120)
  AND (source IS NULL OR char_length(source) <= 200)
);