-- Add project_id column to polen_entries
ALTER TABLE public.polen_entries ADD COLUMN project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

-- Add project_id column to prds
ALTER TABLE public.prds ADD COLUMN project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

-- Add project_id column to trajectory_states
ALTER TABLE public.trajectory_states ADD COLUMN project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

-- Create indexes for efficient querying by project
CREATE INDEX idx_polen_entries_project ON public.polen_entries(project_id);
CREATE INDEX idx_prds_project ON public.prds(project_id);
CREATE INDEX idx_trajectory_states_project ON public.trajectory_states(project_id);