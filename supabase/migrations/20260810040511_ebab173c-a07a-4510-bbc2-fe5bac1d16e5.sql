CREATE TABLE public.relational_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  dimension_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  overall_score jsonb,
  dimensions_completed text[] NOT NULL DEFAULT '{}'::text[],
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.relational_sessions TO authenticated;
GRANT ALL ON public.relational_sessions TO service_role;

ALTER TABLE public.relational_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own relational sessions"
  ON public.relational_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_relational_sessions_updated_at
  BEFORE UPDATE ON public.relational_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.relational_answers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.relational_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dimension_id text NOT NULL,
  question_id text NOT NULL,
  self_answer_index smallint NOT NULL DEFAULT -1,
  team_answer_index smallint NOT NULL DEFAULT -1,
  open_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, question_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.relational_answers TO authenticated;
GRANT ALL ON public.relational_answers TO service_role;

ALTER TABLE public.relational_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own relational answers"
  ON public.relational_answers FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_relational_answers_updated_at
  BEFORE UPDATE ON public.relational_answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_relational_answers_session ON public.relational_answers(session_id);
CREATE INDEX idx_relational_sessions_user ON public.relational_sessions(user_id);