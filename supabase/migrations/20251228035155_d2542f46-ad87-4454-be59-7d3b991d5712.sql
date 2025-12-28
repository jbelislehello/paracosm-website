-- Add was_forced flag to prds table to track force-generated PRDs
-- Force-generated PRDs are not eligible for framework validation

ALTER TABLE public.prds 
ADD COLUMN IF NOT EXISTS was_forced BOOLEAN DEFAULT false;

-- Add comment explaining the column purpose
COMMENT ON COLUMN public.prds.was_forced IS 'Indicates if PRD was generated via Force PRD dialog, bypassing normal journey. Force-generated PRDs are not eligible for OECD framework validation.';