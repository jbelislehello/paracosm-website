-- Recreate view with security_invoker so it respects caller RLS/permissions
DROP VIEW IF EXISTS public.book_chapter_drafts_public;
CREATE VIEW public.book_chapter_drafts_public
WITH (security_invoker = on) AS
SELECT id, chapter_id, audience, draft_md, is_current, created_at
FROM public.book_chapter_drafts
WHERE is_current = true AND audience = 'pragmatic';

GRANT SELECT ON public.book_chapter_drafts_public TO anon, authenticated;

-- Re-allow public read of current pragmatic drafts on the base table, but only
-- expose non-sensitive columns to anon via column-level grants.
CREATE POLICY "Public can read current pragmatic drafts"
ON public.book_chapter_drafts
FOR SELECT
TO anon, authenticated
USING (is_current = true AND audience = 'pragmatic');

GRANT SELECT (id, chapter_id, audience, draft_md, is_current, created_at)
ON public.book_chapter_drafts TO anon;