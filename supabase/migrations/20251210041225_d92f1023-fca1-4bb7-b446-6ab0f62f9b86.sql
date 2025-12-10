-- Add shadow_nudge and shadow_factors columns to trajectory_states
ALTER TABLE trajectory_states
ADD COLUMN shadow_nudge JSONB DEFAULT NULL,
ADD COLUMN shadow_factors JSONB DEFAULT '{"completeness":0,"coherence":0,"depth":0,"flow":0}'::jsonb;