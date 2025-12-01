-- Add prototype_stage column and restructure PRD fields
ALTER TABLE prds
ADD COLUMN prototype_stage text NOT NULL DEFAULT 'B_DIEGETIC'
  CHECK (prototype_stage IN ('A_POIETIC', 'B_DIEGETIC', 'C_OPERATIONAL', 'D_MVP'));

-- Rename and restructure LOVE layer fields
ALTER TABLE prds
RENAME COLUMN love_summary TO love_signals_summary;

ALTER TABLE prds
RENAME COLUMN love_key_events_overview TO love_decision_to_exist;

-- Add MAGIC layer fields (keep magic_hypotheses, add new ones)
ALTER TABLE prds
ADD COLUMN magic_storyworld text;

ALTER TABLE prds
ADD COLUMN magic_prd_outline text;

-- Rename CALM layer fields
ALTER TABLE prds
RENAME COLUMN calm_constraints TO calm_risks_and_limits;

-- Drop calm_impacted_actors (no longer needed)
ALTER TABLE prds
DROP COLUMN calm_impacted_actors;

-- Add OPEN layer fields (replace old open_experiments and open_flows_or_scenarios)
ALTER TABLE prds
ADD COLUMN open_ontology_and_graph text;

ALTER TABLE prds
ADD COLUMN open_real_workflow text;

ALTER TABLE prds
ADD COLUMN open_adjustment_plan text;

-- Drop old OPEN fields
ALTER TABLE prds
DROP COLUMN open_experiments;

ALTER TABLE prds
DROP COLUMN open_flows_or_scenarios;

-- Add FREE layer fields (keep free_success_criteria, add new ones)
ALTER TABLE prds
ADD COLUMN free_first_poem_description text;

ALTER TABLE prds
ADD COLUMN free_totem_anthem text;

ALTER TABLE prds
RENAME COLUMN free_integration_plan TO free_next_cycle_hooks;

-- Drop free_learning_questions (no longer needed)
ALTER TABLE prds
DROP COLUMN free_learning_questions;