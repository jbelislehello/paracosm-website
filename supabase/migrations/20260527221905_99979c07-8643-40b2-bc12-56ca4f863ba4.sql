ALTER TABLE public.book_chapter_drafts ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'general';
ALTER TABLE public.book_chapter_drafts DROP CONSTRAINT IF EXISTS book_chapter_drafts_audience_check;
ALTER TABLE public.book_chapter_drafts ADD CONSTRAINT book_chapter_drafts_audience_check CHECK (audience IN ('general','practitioner','executive'));
CREATE INDEX IF NOT EXISTS idx_book_chapter_drafts_chapter_audience ON public.book_chapter_drafts(chapter_id, audience, created_at DESC);