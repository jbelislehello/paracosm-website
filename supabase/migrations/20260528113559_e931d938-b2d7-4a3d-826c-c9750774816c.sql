CREATE OR REPLACE FUNCTION public.get_book_stats()
RETURNS TABLE(chapters integer, drafts integer, sources integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*)::int FROM public.book_chapters),
    (SELECT count(*)::int FROM public.book_chapter_drafts WHERE is_current = true),
    (SELECT count(*)::int FROM public.book_sources);
$$;

GRANT EXECUTE ON FUNCTION public.get_book_stats() TO anon, authenticated;