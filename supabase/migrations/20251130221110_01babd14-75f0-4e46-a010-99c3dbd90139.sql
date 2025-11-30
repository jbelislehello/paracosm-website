-- Create prds table with 5-layer structure
CREATE TABLE public.prds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'active', 'archived')),
  
  -- Dominant patterns derived from source events
  main_dimension ap_aspect,
  main_quadrant quadrant,
  main_senge_focus senge_discipline,
  main_board board,
  main_oscillation oscillation_state,
  
  -- LAYER 1 – LOVE (Signals)
  love_summary TEXT,
  love_key_events_overview TEXT,
  
  -- LAYER 2 – MAGIC (Patterns & Hypotheses)
  magic_patterns TEXT,
  magic_hypotheses TEXT,
  
  -- LAYER 3 – CALM (Requirements & Constraints)
  calm_requirements TEXT,
  calm_constraints TEXT,
  calm_impacted_actors TEXT,
  
  -- LAYER 4 – OPEN (Experiments & Prototypes)
  open_experiments TEXT,
  open_flows_or_scenarios TEXT,
  
  -- LAYER 5 – FREE (Learning & Integration)
  free_success_criteria TEXT,
  free_learning_questions TEXT,
  free_integration_plan TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prd_links table to link PRDs to events
CREATE TABLE public.prd_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prd_id UUID NOT NULL REFERENCES public.prds(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(prd_id, event_id)
);

-- Enable RLS on both tables
ALTER TABLE public.prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prd_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for prds
CREATE POLICY "Users can view their own PRDs"
  ON public.prds FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can view team PRDs"
  ON public.prds FOR SELECT
  USING (
    team_id IS NOT NULL AND
    team_id IN (
      SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create PRDs"
  ON public.prds FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    (team_id IS NULL OR team_id IN (
      SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update their own PRDs"
  ON public.prds FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own PRDs"
  ON public.prds FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS policies for prd_links
CREATE POLICY "Users can view prd_links for their PRDs"
  ON public.prd_links FOR SELECT
  USING (
    prd_id IN (SELECT id FROM prds WHERE owner_id = auth.uid())
    OR prd_id IN (
      SELECT id FROM prds WHERE team_id IN (
        SELECT team_id FROM team_memberships WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create prd_links for their PRDs"
  ON public.prd_links FOR INSERT
  WITH CHECK (
    prd_id IN (SELECT id FROM prds WHERE owner_id = auth.uid())
  );

CREATE POLICY "Users can delete prd_links for their PRDs"
  ON public.prd_links FOR DELETE
  USING (
    prd_id IN (SELECT id FROM prds WHERE owner_id = auth.uid())
  );

-- Add updated_at trigger for prds
CREATE TRIGGER update_prds_updated_at
  BEFORE UPDATE ON public.prds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();