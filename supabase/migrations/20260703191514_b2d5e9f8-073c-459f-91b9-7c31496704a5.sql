
DROP POLICY IF EXISTS "Users can create collaborations" ON public.team_collaborations;

CREATE POLICY "Users can create collaborations"
ON public.team_collaborations
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = collaborator_user_id
  AND EXISTS (
    SELECT 1 FROM public.journal_entries je
    WHERE je.id = team_collaborations.journal_entry_id
      AND je.user_id = auth.uid()
  )
);
