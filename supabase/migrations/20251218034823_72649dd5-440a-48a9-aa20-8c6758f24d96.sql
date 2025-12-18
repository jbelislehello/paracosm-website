-- Add proper season columns for all 5 PRD layers
-- POLLENS Layer
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS pollens_aspirations TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS pollens_team_dynamics TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS pollens_cultural_elements TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS pollens_relational_patterns TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS pollens_constraints TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS pollens_stakes TEXT;

-- NOEMS Layer
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS noems_concepts TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS noems_shared_ideas TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS noems_intuitions TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS noems_mental_models TEXT;

-- POEMS Layer (P.O.E.M.S. framework)
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS poems_people TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS poems_objects TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS poems_environments TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS poems_messages TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS poems_systems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS poems_prototypes TEXT;

-- TOTEMS Layer
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS totems_data_architecture TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS totems_security_policies TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS totems_access_controls TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS totems_system_requirements TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS totems_integration_points TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS totems_technical_debt TEXT;

-- ANTHEMS Layer
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS anthems_market_positioning TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS anthems_brand_narrative TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS anthems_go_to_market TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS anthems_audience_segments TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS anthems_success_signals TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS anthems_storytelling_assets TEXT;

-- Migrate existing data from old columns to new columns where mapping is clear
UPDATE public.prds SET 
  pollens_aspirations = COALESCE(pollens_aspirations, love_signals_summary),
  pollens_stakes = COALESCE(pollens_stakes, love_decision_to_exist),
  noems_concepts = COALESCE(noems_concepts, magic_patterns),
  noems_mental_models = COALESCE(noems_mental_models, magic_hypotheses),
  poems_prototypes = COALESCE(poems_prototypes, magic_storyworld),
  totems_system_requirements = COALESCE(totems_system_requirements, calm_requirements),
  totems_technical_debt = COALESCE(totems_technical_debt, calm_risks_and_limits),
  totems_data_architecture = COALESCE(totems_data_architecture, open_ontology_and_graph),
  totems_integration_points = COALESCE(totems_integration_points, open_real_workflow),
  anthems_success_signals = COALESCE(anthems_success_signals, free_success_criteria),
  anthems_storytelling_assets = COALESCE(anthems_storytelling_assets, free_totem_anthem)
WHERE id IS NOT NULL;