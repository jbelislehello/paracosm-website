-- Add INSERT policy for profiles table
-- Users can only insert their own profile (id must match their auth.uid())
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);