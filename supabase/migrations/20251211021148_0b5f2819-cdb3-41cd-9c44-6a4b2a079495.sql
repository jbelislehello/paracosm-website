-- Add compilation fields to prds table for Tech Stack and Foundational Prompt extraction

-- Stack Implications per layer
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS stack_implications_pollens TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS stack_implications_noems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS stack_implications_poems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS stack_implications_totems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS stack_implications_anthems TEXT;

-- Prompt Hooks per layer
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS prompt_hooks_pollens TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS prompt_hooks_noems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS prompt_hooks_poems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS prompt_hooks_totems TEXT;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS prompt_hooks_anthems TEXT;

-- Compiled outputs (optional, for caching)
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS compiled_tech_stack JSONB;
ALTER TABLE public.prds ADD COLUMN IF NOT EXISTS compiled_prompt TEXT;