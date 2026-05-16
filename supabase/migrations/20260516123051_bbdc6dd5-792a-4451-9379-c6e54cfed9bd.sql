UPDATE public.book_compasses SET status='published', updated_at=now() WHERE status='draft';
UPDATE public.book_reflection_nodes SET status='published', updated_at=now() WHERE status='draft';