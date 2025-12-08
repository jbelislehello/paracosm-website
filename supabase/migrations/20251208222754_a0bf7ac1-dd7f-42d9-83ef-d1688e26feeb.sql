-- Create enum for fragment types
CREATE TYPE public.fragment_type AS ENUM ('text', 'quote', 'image', 'voice', 'screenshot', 'link');

-- Create enum for noem maturity
CREATE TYPE public.noem_maturity AS ENUM ('seed', 'growing', 'ripe');

-- Create enum for poem type
CREATE TYPE public.poem_type AS ENUM ('story', 'metaphor', 'anthem', 'manifold');

-- Create enum for journal phase
CREATE TYPE public.journal_phase AS ENUM ('glitch', 'drift', 'tune');

-- Create enum for tolerance zone
CREATE TYPE public.tolerance_zone AS ENUM ('inner', 'stretch', 'outer');

-- Create journal_cycles table (tracking the 4-pass journey)
CREATE TABLE public.journal_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  cycle_number INTEGER NOT NULL CHECK (cycle_number BETWEEN 1 AND 4),
  board public.board NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  tiles_visited INTEGER[] DEFAULT '{}',
  current_tile_id INTEGER REFERENCES public.tiles(id),
  phase public.journal_phase NOT NULL DEFAULT 'glitch',
  inner_radius INTEGER NOT NULL DEFAULT 1,
  stretch_radius INTEGER NOT NULL DEFAULT 2,
  current_distance NUMERIC NOT NULL DEFAULT 0,
  current_zone public.tolerance_zone NOT NULL DEFAULT 'inner',
  integrator_tiles_unlocked INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create polen_entries table (raw fragments - GLITCH phase)
CREATE TABLE public.polen_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID REFERENCES public.journal_cycles(id) ON DELETE SET NULL,
  tile_id INTEGER REFERENCES public.tiles(id),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  fragment_type public.fragment_type NOT NULL DEFAULT 'text',
  source_reference TEXT,
  hexagram_number INTEGER CHECK (hexagram_number BETWEEN 1 AND 64),
  tzolkin_kin INTEGER CHECK (tzolkin_kin BETWEEN 1 AND 260),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create noems table (conceptual atoms - DRIFT phase)
CREATE TABLE public.noems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID REFERENCES public.journal_cycles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  insight TEXT NOT NULL,
  connected_polen_ids UUID[] DEFAULT '{}',
  topology_x NUMERIC,
  topology_y NUMERIC,
  connections UUID[] DEFAULT '{}',
  maturity public.noem_maturity NOT NULL DEFAULT 'seed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poems table (narrative artifacts - TUNE phase)
CREATE TABLE public.poems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID REFERENCES public.journal_cycles(id) ON DELETE SET NULL,
  prd_id UUID REFERENCES public.prds(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  narrative TEXT NOT NULL,
  connected_noem_ids UUID[] DEFAULT '{}',
  poem_type public.poem_type NOT NULL DEFAULT 'story',
  market_fit TEXT,
  tech_stack_hints TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tolerance_expansion_events table
CREATE TABLE public.tolerance_expansion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL REFERENCES public.journal_cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  previous_inner INTEGER NOT NULL,
  new_inner INTEGER NOT NULL,
  trigger_tile_id INTEGER REFERENCES public.tiles(id),
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.journal_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polen_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tolerance_expansion_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journal_cycles
CREATE POLICY "Users can view their own cycles"
ON public.journal_cycles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cycles"
ON public.journal_cycles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycles"
ON public.journal_cycles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycles"
ON public.journal_cycles FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for polen_entries
CREATE POLICY "Users can view their own polen"
ON public.polen_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own polen"
ON public.polen_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own polen"
ON public.polen_entries FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own polen"
ON public.polen_entries FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for noems
CREATE POLICY "Users can view their own noems"
ON public.noems FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own noems"
ON public.noems FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own noems"
ON public.noems FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own noems"
ON public.noems FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for poems
CREATE POLICY "Users can view their own poems"
ON public.poems FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own poems"
ON public.poems FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poems"
ON public.poems FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own poems"
ON public.poems FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for tolerance_expansion_events
CREATE POLICY "Users can view their own expansion events"
ON public.tolerance_expansion_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expansion events"
ON public.tolerance_expansion_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_journal_cycles_updated_at
BEFORE UPDATE ON public.journal_cycles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_noems_updated_at
BEFORE UPDATE ON public.noems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_poems_updated_at
BEFORE UPDATE ON public.poems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();