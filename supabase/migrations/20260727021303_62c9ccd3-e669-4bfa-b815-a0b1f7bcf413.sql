-- Readiness assessment sessions
CREATE TABLE public.readiness_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  -- Per-season scores stored as JSONB: { pollens: {personal, organizational, gap, composite}, noems: {...}, ... }
  season_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Overall aggregate: { personal, organizational, gap, composite }
  overall_score JSONB,
  -- Which seasons are fully answered
  seasons_completed TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.readiness_sessions TO authenticated;
GRANT ALL ON public.readiness_sessions TO service_role;

ALTER TABLE public.readiness_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own readiness sessions"
  ON public.readiness_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_readiness_sessions_user ON public.readiness_sessions(user_id, created_at DESC);

CREATE TRIGGER update_readiness_sessions_updated_at
  BEFORE UPDATE ON public.readiness_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Per-tile answers
CREATE TABLE public.readiness_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.readiness_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id TEXT NOT NULL CHECK (season_id IN ('pollens','noems','poems','totems','anthems')),
  tile_id TEXT NOT NULL,
  zone TEXT NOT NULL CHECK (zone IN ('inner','stretch','edge')),
  -- 0-based answer index (0..2 for threePoint, 0..4 for likert5); -1 means unanswered but we simply omit those rows
  personal_answer_index SMALLINT NOT NULL,
  organizational_answer_index SMALLINT NOT NULL,
  open_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, season_id, tile_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.readiness_answers TO authenticated;
GRANT ALL ON public.readiness_answers TO service_role;

ALTER TABLE public.readiness_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own readiness answers"
  ON public.readiness_answers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_readiness_answers_session ON public.readiness_answers(session_id, season_id);

CREATE TRIGGER update_readiness_answers_updated_at
  BEFORE UPDATE ON public.readiness_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();