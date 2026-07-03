
-- Restrict anon/authenticated to non-sensitive columns only.
-- Admins retain full access via the existing ALL policy + table-level grants to service_role.
REVOKE SELECT ON public.book_chapter_drafts FROM anon, authenticated;
GRANT SELECT (id, chapter_id, audience, draft_md, is_current, created_at) ON public.book_chapter_drafts TO anon, authenticated;
GRANT ALL ON public.book_chapter_drafts TO service_role;
