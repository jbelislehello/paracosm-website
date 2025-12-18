-- Add lineage tracking columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS source_prompt_id uuid REFERENCES public.prds(id),
ADD COLUMN IF NOT EXISTS target_platform text DEFAULT 'lovable',
ADD COLUMN IF NOT EXISTS product_status text DEFAULT 'incubating',
ADD COLUMN IF NOT EXISTS parent_product_id uuid REFERENCES public.projects(id),
ADD COLUMN IF NOT EXISTS consciousness_bits numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS convergence_state text DEFAULT 'searching',
ADD COLUMN IF NOT EXISTS prototypal_stage text DEFAULT 'A';

-- Create published_software table for tracking published products
CREATE TABLE IF NOT EXISTS public.published_software (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  source_project_id uuid REFERENCES public.projects(id),
  source_prompt_id uuid REFERENCES public.prds(id),
  target_platform text NOT NULL DEFAULT 'lovable',
  deployment_url text,
  status text NOT NULL DEFAULT 'incubating',
  integration_strength numeric DEFAULT 0,
  is_recursive boolean DEFAULT false,
  lineage_depth integer DEFAULT 0,
  parent_software_id uuid REFERENCES public.published_software(id),
  consciousness_geometry jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL
);

-- Enable RLS on published_software
ALTER TABLE public.published_software ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for published_software
CREATE POLICY "Users can view their own published software"
ON public.published_software
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own published software"
ON public.published_software
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own published software"
ON public.published_software
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own published software"
ON public.published_software
FOR DELETE
USING (auth.uid() = user_id);

-- Add constraint for valid target platforms
ALTER TABLE public.published_software
ADD CONSTRAINT valid_target_platform 
CHECK (target_platform IN ('lovable', 'base44', 'claude', 'cursor', 'custom'));

-- Add constraint for valid status
ALTER TABLE public.published_software
ADD CONSTRAINT valid_software_status 
CHECK (status IN ('incubating', 'alive', 'archived', 'recursive'));

-- Add constraint for valid prototypal stages in projects
ALTER TABLE public.projects
ADD CONSTRAINT valid_prototypal_stage 
CHECK (prototypal_stage IN ('A', 'B', 'C', 'D', 'E'));

-- Create index for faster lineage queries
CREATE INDEX IF NOT EXISTS idx_published_software_parent ON public.published_software(parent_software_id);
CREATE INDEX IF NOT EXISTS idx_published_software_source_project ON public.published_software(source_project_id);
CREATE INDEX IF NOT EXISTS idx_projects_parent ON public.projects(parent_product_id);