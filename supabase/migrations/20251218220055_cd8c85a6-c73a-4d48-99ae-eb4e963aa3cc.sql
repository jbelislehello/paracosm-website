-- Create project_collaborators table
CREATE TABLE public.project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('viewer', 'editor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own collaborations
CREATE POLICY "Users can view their collaborations"
ON public.project_collaborators FOR SELECT
USING (user_id = auth.uid());

-- RLS: Project owners can manage collaborators
CREATE POLICY "Project owners can manage collaborators"
ON public.project_collaborators FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id AND projects.user_id = auth.uid()
  )
);

-- Update projects RLS: Allow collaborators to view shared projects
CREATE POLICY "Collaborators can view shared projects"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.project_collaborators
    WHERE project_collaborators.project_id = projects.id
      AND project_collaborators.user_id = auth.uid()
  )
);

-- Allow collaborators with editor/admin role to update projects
CREATE POLICY "Collaborators can update shared projects"
ON public.projects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.project_collaborators
    WHERE project_collaborators.project_id = projects.id
      AND project_collaborators.user_id = auth.uid()
      AND project_collaborators.role IN ('editor', 'admin')
  )
);