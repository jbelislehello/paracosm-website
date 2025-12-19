-- Allow users to update their own invitations (accept/decline)
CREATE POLICY "Users can update their own invitations"
  ON public.project_invitations FOR UPDATE
  USING (lower(email) = lower((auth.jwt() ->> 'email'::text)))
  WITH CHECK (lower(email) = lower((auth.jwt() ->> 'email'::text)));