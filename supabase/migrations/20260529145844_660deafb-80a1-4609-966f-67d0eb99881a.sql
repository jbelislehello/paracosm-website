-- Remove public exposure of sensitive columns (prompt_snapshot, model, created_by)
DROP POLICY IF EXISTS "Public can read current pragmatic drafts" ON public.book_chapter_drafts;

-- Revoke anon read on base table; admins authenticate and use the existing admin policy
REVOKE SELECT ON public.book_chapter_drafts FROM anon;

-- Safe public view exposing only the fields readers need
DROP VIEW IF EXISTS public.book_chapter_drafts_public;
CREATE VIEW public.book_chapter_drafts_public AS
SELECT id, chapter_id, audience, draft_md, is_current, created_at
FROM public.book_chapter_drafts
WHERE is_current = true AND audience = 'pragmatic';

GRANT SELECT ON public.book_chapter_drafts_public TO anon, authenticated;