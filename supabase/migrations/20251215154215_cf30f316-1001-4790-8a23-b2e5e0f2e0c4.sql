-- Fix RLS infinite recursion in teams/team_memberships

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view teams they belong to" ON public.teams;
DROP POLICY IF EXISTS "Users can create PRDs" ON public.prds;

-- Create fixed teams SELECT policy that doesn't cause recursion
CREATE POLICY "Users can view teams they belong to" 
ON public.teams 
FOR SELECT 
USING (
  auth.uid() = owner_id 
  OR id IN (
    SELECT team_id FROM public.team_memberships WHERE user_id = auth.uid()
  )
);

-- Simplify PRD INSERT policy to avoid team_memberships lookup during insert
CREATE POLICY "Users can create PRDs" 
ON public.prds 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);