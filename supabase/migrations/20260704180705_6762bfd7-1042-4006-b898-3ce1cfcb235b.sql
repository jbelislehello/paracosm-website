
ALTER TABLE public.trainings
  ADD COLUMN IF NOT EXISTS tier text,
  ADD COLUMN IF NOT EXISTS tone text,
  ADD COLUMN IF NOT EXISTS duration_label text,
  ADD COLUMN IF NOT EXISTS narrative_premise text,
  ADD COLUMN IF NOT EXISTS cognitive_model text,
  ADD COLUMN IF NOT EXISTS identity_shift text,
  ADD COLUMN IF NOT EXISTS commitment_prompt text,
  ADD COLUMN IF NOT EXISTS commitment_template text,
  ADD COLUMN IF NOT EXISTS commitment_witness text,
  ADD COLUMN IF NOT EXISTS roadmap_pdf_url text,
  ADD COLUMN IF NOT EXISTS playbook_pdf_url text,
  ADD COLUMN IF NOT EXISTS program_doc_pdf_url text;

ALTER TABLE public.training_modules
  ADD COLUMN IF NOT EXISTS focus_state text,
  ADD COLUMN IF NOT EXISTS when_label text,
  ADD COLUMN IF NOT EXISTS outcome text,
  ADD COLUMN IF NOT EXISTS exercises_json jsonb,
  ADD COLUMN IF NOT EXISTS journeys_json jsonb,
  ADD COLUMN IF NOT EXISTS artifact text;

-- Backfill tier/tone on existing trainings
UPDATE public.trainings SET tier='foreplay', tone='warm' WHERE slug='glitch' AND tier IS NULL;
UPDATE public.trainings SET tier='foreplay', tone='night' WHERE slug='drift' AND tier IS NULL;
UPDATE public.trainings SET tier='foreplay', tone='clay' WHERE slug='tune' AND tier IS NULL;
