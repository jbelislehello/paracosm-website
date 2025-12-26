-- Create playbook_progress table for tracking user journey progress
CREATE TABLE public.playbook_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  playbook_id TEXT NOT NULL,
  garden TEXT NOT NULL,
  mode TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_step_index INTEGER NOT NULL DEFAULT 0,
  completed_steps TEXT[] NOT NULL DEFAULT '{}',
  step_outputs JSONB NOT NULL DEFAULT '{}',
  tile_sequence INTEGER[] NOT NULL DEFAULT '{}',
  tiles_visited INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.playbook_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own playbook progress"
ON public.playbook_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own playbook progress"
ON public.playbook_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playbook progress"
ON public.playbook_progress
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playbook progress"
ON public.playbook_progress
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_playbook_progress_user_id ON public.playbook_progress(user_id);
CREATE INDEX idx_playbook_progress_project_id ON public.playbook_progress(project_id);
CREATE INDEX idx_playbook_progress_playbook_id ON public.playbook_progress(playbook_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_playbook_progress_updated_at
BEFORE UPDATE ON public.playbook_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();