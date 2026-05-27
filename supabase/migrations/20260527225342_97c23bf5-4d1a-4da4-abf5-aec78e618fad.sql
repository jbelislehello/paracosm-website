UPDATE public.book_sources s
SET chapter_id = c.id
FROM public.tiles t
JOIN public.book_chapters c
  ON UPPER(c.phase) = UPPER(t.calm_magic_phase::text)
WHERE s.kind = 'tile'
  AND s.ref = ('tile:' || t.id);