-- Create project_season_progress table for cross-device sync
CREATE TABLE public.project_season_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  current_season TEXT NOT NULL DEFAULT 'POLLENS',
  season_progress JSONB NOT NULL DEFAULT '{"POLLENS": [], "NOEMS": [], "POEMS": [], "TOTEMS": [], "ANTHEMS": []}'::jsonb,
  completed_seasons TEXT[] NOT NULL DEFAULT '{}'::text[],
  journey_started BOOLEAN NOT NULL DEFAULT false,
  journey_path JSONB NOT NULL DEFAULT '[]'::jsonb,
  prd_id UUID REFERENCES public.prds(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_season_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own progress"
  ON public.project_season_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON public.project_season_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.project_season_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.project_season_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_project_season_progress_updated_at
  BEFORE UPDATE ON public.project_season_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();