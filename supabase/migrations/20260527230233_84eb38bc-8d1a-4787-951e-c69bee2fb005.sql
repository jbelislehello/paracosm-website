CREATE POLICY "Public can read current pragmatic drafts"
ON public.book_chapter_drafts
FOR SELECT
TO anon, authenticated
USING (is_current = true AND audience = 'pragmatic');

GRANT SELECT ON public.book_chapter_drafts TO anon;