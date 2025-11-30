-- Create ENUMS
CREATE TYPE public.user_mode AS ENUM ('solo', 'team');
CREATE TYPE public.team_role AS ENUM ('owner', 'member');
CREATE TYPE public.board AS ENUM ('LOVE', 'MAGIC', 'CALM', 'OPEN', 'FREE');
CREATE TYPE public.process_state AS ENUM ('GLITCH', 'DRIFT', 'TUNE', 'FREE');
CREATE TYPE public.ap_aspect AS ENUM ('F', 'E', 'L', 'V');
CREATE TYPE public.positionality AS ENUM ('P1', 'P2', 'P3', 'P4', 'P5');
CREATE TYPE public.curiosity_level AS ENUM ('C1', 'C2', 'C3');
CREATE TYPE public.adversity_level AS ENUM ('A1', 'A2', 'A3');
CREATE TYPE public.wu_wei_mode AS ENUM ('ALLOW_FIRST', 'MINIMAL_INTERVENTION', 'NO_FORCE');
CREATE TYPE public.senge_discipline AS ENUM ('PersonalMastery', 'MentalModels', 'SharedVision', 'TeamLearning', 'SystemsThinking');
CREATE TYPE public.quadrant AS ENUM ('SN', 'IN', 'IM', 'SM');
CREATE TYPE public.oscillation_state AS ENUM ('shadow', 'mixed', 'higher_self');
CREATE TYPE public.wu_wei_intensity AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- Update profiles table
ALTER TABLE public.profiles 
ADD COLUMN mode public.user_mode DEFAULT 'solo',
ADD COLUMN time_zone TEXT DEFAULT 'America/Toronto';

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create team_memberships table
CREATE TABLE public.team_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.team_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create tiles table
CREATE TABLE public.tiles (
  id INTEGER PRIMARY KEY CHECK (id >= 1 AND id <= 260),
  board public.board NOT NULL,
  row INTEGER CHECK (row IS NULL OR (row >= 1 AND row <= 8)),
  col INTEGER CHECK (col IS NULL OR (col >= 1 AND col <= 8)),
  hexagram INTEGER CHECK (hexagram >= 1 AND hexagram <= 64),
  tzolkin_index INTEGER NOT NULL CHECK (tzolkin_index >= 1 AND tzolkin_index <= 260),
  calm_magic_phase public.board NOT NULL,
  vl_path_index INTEGER CHECK (vl_path_index IS NULL OR (vl_path_index >= 1 AND vl_path_index <= 64)),
  default_process_state public.process_state NOT NULL,
  mindfulness_focus JSONB DEFAULT '[]'::jsonb,
  senge_discipline public.senge_discipline NOT NULL,
  wu_wei_intensity public.wu_wei_intensity NOT NULL DEFAULT 'MEDIUM',
  short_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  tile_id INTEGER NOT NULL REFERENCES public.tiles(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  process_state public.process_state NOT NULL,
  ap_aspect public.ap_aspect NOT NULL,
  positionality public.positionality NOT NULL,
  curiosity_level public.curiosity_level NOT NULL,
  adversity_level public.adversity_level NOT NULL,
  wu_wei_mode public.wu_wei_mode NOT NULL,
  senge_focus public.senge_discipline NOT NULL,
  quadrant public.quadrant NOT NULL,
  oscillation_state public.oscillation_state NOT NULL,
  reflection TEXT,
  next_step TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Users can view teams they belong to" ON public.teams
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.team_memberships WHERE team_id = teams.id
    )
  );

CREATE POLICY "Team owners can update their teams" ON public.teams
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- RLS Policies for team_memberships
CREATE POLICY "Users can view memberships for their teams" ON public.team_memberships
  FOR SELECT USING (
    user_id = auth.uid() OR
    team_id IN (SELECT id FROM public.teams WHERE owner_id = auth.uid())
  );

CREATE POLICY "Team owners can manage memberships" ON public.team_memberships
  FOR ALL USING (
    team_id IN (SELECT id FROM public.teams WHERE owner_id = auth.uid())
  );

-- RLS Policies for tiles
CREATE POLICY "Tiles are viewable by everyone" ON public.tiles
  FOR SELECT USING (true);

-- RLS Policies for events
CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view team events" ON public.events
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create events" ON public.events
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (team_id IS NULL OR team_id IN (
      SELECT team_id FROM public.team_memberships WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tiles_updated_at
  BEFORE UPDATE ON public.tiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed representative tiles
INSERT INTO public.tiles (id, board, row, col, hexagram, tzolkin_index, calm_magic_phase, vl_path_index, default_process_state, senge_discipline, wu_wei_intensity, short_prompt, mindfulness_focus) VALUES
(1, 'LOVE', 1, 1, 1, 1, 'LOVE', 1, 'GLITCH', 'PersonalMastery', 'HIGH', 'Notice where you resist what is.', '["non-judging", "beginner-mind"]'),
(10, 'LOVE', 2, 2, 10, 10, 'LOVE', 10, 'GLITCH', 'PersonalMastery', 'MEDIUM', 'What story are you telling yourself?', '["non-judging", "trust"]'),
(25, 'LOVE', 1, 4, 25, 25, 'LOVE', 25, 'DRIFT', 'PersonalMastery', 'MEDIUM', 'What wants to emerge here?', '["acceptance", "trust"]'),
(45, 'LOVE', 5, 6, 45, 45, 'LOVE', 45, 'TUNE', 'PersonalMastery', 'LOW', 'One small shift is enough.', '["non-striving", "letting-go"]'),
(64, 'LOVE', 8, 8, 64, 64, 'LOVE', 64, 'TUNE', 'PersonalMastery', 'LOW', 'Complete this cycle with grace.', '["acceptance", "letting-go"]'),
(65, 'MAGIC', 1, 1, 1, 65, 'MAGIC', 1, 'GLITCH', 'MentalModels', 'HIGH', 'What assumption are you making?', '["beginner-mind", "non-judging"]'),
(95, 'MAGIC', 7, 4, 31, 95, 'MAGIC', 31, 'DRIFT', 'MentalModels', 'MEDIUM', 'Try on a contradictory view.', '["acceptance", "letting-go"]'),
(128, 'MAGIC', 8, 8, 64, 128, 'MAGIC', 64, 'TUNE', 'MentalModels', 'LOW', 'Let go of one story.', '["letting-go", "trust"]'),
(129, 'CALM', 1, 1, 1, 129, 'CALM', 1, 'GLITCH', 'SharedVision', 'HIGH', 'Where is collective clarity missing?', '["patience", "acceptance"]'),
(160, 'CALM', 8, 4, 32, 160, 'CALM', 32, 'DRIFT', 'SharedVision', 'LOW', 'Invite others into the vision.', '["acceptance", "letting-go"]'),
(192, 'CALM', 8, 8, 64, 192, 'CALM', 64, 'TUNE', 'SharedVision', 'LOW', 'Honor what we have created together.', '["letting-go", "trust"]'),
(193, 'OPEN', 1, 1, 1, 193, 'OPEN', 1, 'GLITCH', 'TeamLearning', 'HIGH', 'Where is dialogue breaking down?', '["non-judging", "patience"]'),
(225, 'OPEN', 1, 5, 33, 225, 'OPEN', 33, 'DRIFT', 'TeamLearning', 'LOW', 'Suspend your certainty.', '["letting-go", "non-judging"]'),
(256, 'OPEN', 8, 8, 64, 256, 'OPEN', 64, 'TUNE', 'TeamLearning', 'LOW', 'Celebrate what we have learned.', '["letting-go", "trust"]'),
(257, 'FREE', NULL, NULL, 33, 257, 'FREE', NULL, 'FREE', 'SystemsThinking', 'MEDIUM', 'Step back and see the whole.', '["acceptance", "trust", "letting-go"]'),
(260, 'FREE', NULL, NULL, 61, 260, 'FREE', NULL, 'FREE', 'SystemsThinking', 'LOW', 'Trust the larger pattern.', '["letting-go", "trust", "acceptance"]');