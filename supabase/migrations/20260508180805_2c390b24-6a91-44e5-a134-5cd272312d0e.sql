CREATE POLICY "Users can delete their own emotional states"
ON public.emotional_states
FOR DELETE
USING (auth.uid() = user_id);