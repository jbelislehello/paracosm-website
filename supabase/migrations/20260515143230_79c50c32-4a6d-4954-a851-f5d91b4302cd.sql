-- Expand the allowed phases to include OPEN
ALTER TABLE public.book_chapters
  DROP CONSTRAINT IF EXISTS book_chapters_phase_check;

ALTER TABLE public.book_chapters
  ADD CONSTRAINT book_chapters_phase_check
  CHECK (phase IN ('GLITCH','DRIFT','TUNE','LOVE','MAGIC','CALM','OPEN','FREE'));

-- Bump FREE chapter to order 8 to make room for OPEN at 7
UPDATE public.book_chapters
SET order_index = 8, updated_at = now()
WHERE slug = 'operating-in-flow';

-- Insert the missing OPEN chapter
INSERT INTO public.book_chapters (slug, phase, order_index, title, summary, status, is_free_sample)
VALUES (
  'living-the-ontology',
  'OPEN',
  7,
  'Living the Ontology',
  'Where the designed system meets real workflow — ontology, graph, and the adjustment plan that keeps the org tunable.',
  'outline',
  false
);