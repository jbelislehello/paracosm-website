-- Add AI summary persistence columns to project_season_progress
ALTER TABLE project_season_progress
ADD COLUMN IF NOT EXISTS ai_summary_themes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_summary_insights JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS ai_summary_next_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_summary_connections JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS ai_summary_hexagram JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_summary_generated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN project_season_progress.ai_summary_themes IS 'AI-generated key themes from journey analysis';
COMMENT ON COLUMN project_season_progress.ai_summary_insights IS 'Array of key insights with importance scores';
COMMENT ON COLUMN project_season_progress.ai_summary_next_areas IS 'Suggested areas for exploration';
COMMENT ON COLUMN project_season_progress.ai_summary_connections IS 'Cross-tile connections discovered';
COMMENT ON COLUMN project_season_progress.ai_summary_hexagram IS 'I Ching hexagram interpretation if available';
COMMENT ON COLUMN project_season_progress.ai_summary_generated_at IS 'Timestamp of last AI summary generation';