
-- 1. Replace public SELECT on training_questions with a view that hides answers
DROP POLICY IF EXISTS "Anyone can view questions of published trainings" ON public.training_questions;

CREATE OR REPLACE VIEW public.training_questions_public
WITH (security_invoker = on) AS
  SELECT q.id, q.module_id, q.order_index, q.prompt, q.kind, q.options, q.weight, q.created_at
  FROM public.training_questions q
  JOIN public.training_modules m ON m.id = q.module_id
  JOIN public.trainings t ON t.id = m.training_id
  WHERE t.status = 'published';

GRANT SELECT ON public.training_questions_public TO anon, authenticated;

-- Base table now only admins can SELECT (ALL policy already covers this); ensure no anon grant
REVOKE SELECT ON public.training_questions FROM anon;

-- 2. Server-side grading RPC: returns per-question result and records attempt
CREATE OR REPLACE FUNCTION public.grade_training_attempt(
  p_module_id uuid,
  p_answers jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_published boolean;
  v_results jsonb := '[]'::jsonb;
  v_total int := 0;
  v_correct int := 0;
  v_score int;
  v_passed boolean;
  r record;
  v_given jsonb;
  v_is_correct boolean;
BEGIN
  -- Verify the module belongs to a published training
  SELECT EXISTS (
    SELECT 1 FROM training_modules m
    JOIN trainings t ON t.id = m.training_id
    WHERE m.id = p_module_id AND t.status = 'published'
  ) INTO v_published;

  IF NOT v_published THEN
    RAISE EXCEPTION 'Module not found or not published';
  END IF;

  FOR r IN
    SELECT id, correct_answer, explanation_md
    FROM training_questions
    WHERE module_id = p_module_id
    ORDER BY order_index
  LOOP
    v_total := v_total + 1;
    v_given := p_answers -> (r.id::text);
    v_is_correct := (v_given IS NOT NULL AND v_given = r.correct_answer);
    IF v_is_correct THEN v_correct := v_correct + 1; END IF;
    v_results := v_results || jsonb_build_object(
      'id', r.id,
      'correct', v_is_correct,
      'correct_answer', r.correct_answer,
      'explanation_md', r.explanation_md
    );
  END LOOP;

  v_score := CASE WHEN v_total = 0 THEN 0 ELSE round((v_correct::numeric / v_total) * 100) END;
  v_passed := v_score >= 66;

  IF v_user IS NOT NULL THEN
    INSERT INTO training_attempts (user_id, module_id, answers, score, passed)
    VALUES (v_user, p_module_id, p_answers, v_score, v_passed);
  END IF;

  RETURN jsonb_build_object(
    'score', v_score,
    'passed', v_passed,
    'total', v_total,
    'correct_count', v_correct,
    'results', v_results
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.grade_training_attempt(uuid, jsonb) TO anon, authenticated;

-- 3. team_collaborations: allow collaborator to read their own rows
CREATE POLICY "Collaborators can view their own collaborations"
  ON public.team_collaborations
  FOR SELECT
  USING (auth.uid() = collaborator_user_id);
