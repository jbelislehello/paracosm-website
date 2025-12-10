-- Create trajectory_states table for cross-device sync
CREATE TABLE public.trajectory_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  higher_self_position JSONB,
  higher_self_quadrant TEXT CHECK (higher_self_quadrant IN ('SN', 'IN', 'IM', 'SM')),
  prophecy_reflection TEXT,
  prophecy_set_at TIMESTAMPTZ,
  trajectory_log JSONB DEFAULT '[]'::jsonb,
  last_shadow_position JSONB DEFAULT '{"x": 0, "y": 0}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_trajectory UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.trajectory_states ENABLE ROW LEVEL SECURITY;

-- RLS policies for user ownership
CREATE POLICY "Users can view their own trajectory"
ON public.trajectory_states
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trajectory"
ON public.trajectory_states
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trajectory"
ON public.trajectory_states
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trajectory"
ON public.trajectory_states
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_trajectory_states_updated_at
BEFORE UPDATE ON public.trajectory_states
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();