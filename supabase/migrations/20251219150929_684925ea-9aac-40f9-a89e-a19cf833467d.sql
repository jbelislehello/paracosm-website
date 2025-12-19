-- Add project_id column to noems table
ALTER TABLE noems ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

-- Add project_id column to poems table  
ALTER TABLE poems ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_noems_project_id ON noems(project_id);
CREATE INDEX idx_poems_project_id ON poems(project_id);

-- Reset CEO Pulse project progress to start fresh
UPDATE project_season_progress 
SET 
  season_progress = '{"NOEMS": [], "POEMS": [], "TOTEMS": [], "ANTHEMS": [], "POLLENS": []}'::jsonb,
  journey_path = '[]'::jsonb,
  journey_started = false,
  completed_seasons = '{}',
  current_season = 'POLLENS'
WHERE project_id = 'ede016b1-f056-4aaf-b874-d10056d7aadb';