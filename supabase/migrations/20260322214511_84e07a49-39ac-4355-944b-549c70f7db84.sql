-- 1. Journal entries: add DELETE policy
CREATE POLICY "Users can delete their own journal entries"
ON public.journal_entries FOR DELETE
USING (auth.uid() = user_id);

-- 2. Team collaborations: add UPDATE and DELETE policies
CREATE POLICY "Users can update their own collaborations"
ON public.team_collaborations FOR UPDATE
USING (auth.uid() = collaborator_user_id);

CREATE POLICY "Users can delete their own collaborations"
ON public.team_collaborations FOR DELETE
USING (auth.uid() = collaborator_user_id);

-- 3. Tolerance expansion events: add UPDATE and DELETE policies
CREATE POLICY "Users can update their own expansion events"
ON public.tolerance_expansion_events FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expansion events"
ON public.tolerance_expansion_events FOR DELETE
USING (auth.uid() = user_id);