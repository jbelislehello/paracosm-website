-- Add new columns to polen_entries for consciousness manifold
ALTER TABLE public.polen_entries
ADD COLUMN IF NOT EXISTS intensity integer DEFAULT 50,
ADD COLUMN IF NOT EXISTS charge text DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS phase text;

-- Add check constraints for valid values
ALTER TABLE public.polen_entries
ADD CONSTRAINT polen_entries_intensity_range CHECK (intensity >= 0 AND intensity <= 100);

ALTER TABLE public.polen_entries
ADD CONSTRAINT polen_entries_charge_valid CHECK (charge IN ('expanding', 'contracting', 'neutral'));

ALTER TABLE public.polen_entries
ADD CONSTRAINT polen_entries_phase_valid CHECK (phase IS NULL OR phase IN ('LOVE', 'MAGIC', 'CALM', 'OPEN', 'FREE'));

-- Create manifold_edges table for connections between entries
CREATE TABLE public.manifold_edges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_entry_id uuid NOT NULL REFERENCES public.polen_entries(id) ON DELETE CASCADE,
  to_entry_id uuid NOT NULL REFERENCES public.polen_entries(id) ON DELETE CASCADE,
  edge_type text NOT NULL,
  weight numeric(3,2) DEFAULT 0.5,
  user_id uuid NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT manifold_edges_type_valid CHECK (edge_type IN ('resonance', 'causality', 'echo')),
  CONSTRAINT manifold_edges_weight_range CHECK (weight >= 0 AND weight <= 1),
  CONSTRAINT manifold_edges_no_self_reference CHECK (from_entry_id != to_entry_id)
);

-- Create indexes for performance
CREATE INDEX idx_manifold_edges_from_entry ON public.manifold_edges(from_entry_id);
CREATE INDEX idx_manifold_edges_to_entry ON public.manifold_edges(to_entry_id);
CREATE INDEX idx_manifold_edges_user_project ON public.manifold_edges(user_id, project_id);
CREATE INDEX idx_polen_entries_intensity ON public.polen_entries(intensity);
CREATE INDEX idx_polen_entries_phase ON public.polen_entries(phase);

-- Enable RLS on manifold_edges
ALTER TABLE public.manifold_edges ENABLE ROW LEVEL SECURITY;

-- RLS policies for manifold_edges
CREATE POLICY "Users can view their own edges"
ON public.manifold_edges
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own edges"
ON public.manifold_edges
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own edges"
ON public.manifold_edges
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own edges"
ON public.manifold_edges
FOR DELETE
USING (auth.uid() = user_id);