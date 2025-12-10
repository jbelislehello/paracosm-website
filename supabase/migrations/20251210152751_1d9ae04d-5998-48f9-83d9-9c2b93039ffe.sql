-- Add season_context column to polen_entries for unified fragment system
ALTER TABLE public.polen_entries 
ADD COLUMN IF NOT EXISTS season_context TEXT CHECK (season_context IN ('POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'));

-- Create index for season filtering
CREATE INDEX IF NOT EXISTS idx_polen_entries_season_context ON public.polen_entries(season_context);

-- Backfill existing entries based on tags
UPDATE public.polen_entries 
SET season_context = 'POLLENS' 
WHERE season_context IS NULL 
  AND (tags @> ARRAY['POLLENS'] OR tags @> ARRAY['LOVE']);

UPDATE public.polen_entries 
SET season_context = 'NOEMS' 
WHERE season_context IS NULL 
  AND (tags @> ARRAY['NOEMS'] OR tags @> ARRAY['MAGIC']);

UPDATE public.polen_entries 
SET season_context = 'POEMS' 
WHERE season_context IS NULL 
  AND (tags @> ARRAY['POEMS'] OR tags @> ARRAY['CALM']);

UPDATE public.polen_entries 
SET season_context = 'TOTEMS' 
WHERE season_context IS NULL 
  AND (tags @> ARRAY['TOTEMS'] OR tags @> ARRAY['OPEN']);

UPDATE public.polen_entries 
SET season_context = 'ANTHEMS' 
WHERE season_context IS NULL 
  AND (tags @> ARRAY['ANTHEMS'] OR tags @> ARRAY['FREE']);