-- Add ontological consciousness columns to prds table for storing mathematical context

ALTER TABLE public.prds 
ADD COLUMN IF NOT EXISTS consciousness_geometry JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS topology_signature JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS thermodynamic_profile JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS manifold_embedding JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS window_state JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS auto_compiled_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS compilation_trigger TEXT DEFAULT NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN public.prds.consciousness_geometry IS 'Stores consciousness geometry metrics: complexity_bits, threshold_percentage, consciousness_state, geometric_narrative';
COMMENT ON COLUMN public.prds.topology_signature IS 'Stores topological structure: betti_0, betti_1, integration_strength, fragmentation_score, fixed_points';
COMMENT ON COLUMN public.prds.thermodynamic_profile IS 'Stores thermodynamic metrics: efficiency, predictive_capacity, meta_learning_detected, thermodynamic_narrative';
COMMENT ON COLUMN public.prds.manifold_embedding IS 'Stores torus manifold data: curvature_map, density_distribution';
COMMENT ON COLUMN public.prds.window_state IS 'Stores window of tolerance state: current_ring, ring_states, openness_percentage';
COMMENT ON COLUMN public.prds.auto_compiled_at IS 'Timestamp of last auto-compilation triggered by mathematical thresholds';
COMMENT ON COLUMN public.prds.compilation_trigger IS 'Type of trigger that caused last compilation: consciousness, ring, coherence, density';