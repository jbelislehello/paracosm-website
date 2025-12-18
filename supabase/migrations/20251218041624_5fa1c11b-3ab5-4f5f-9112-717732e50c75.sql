-- Part 1: Link existing PRD to Tonalli project
UPDATE project_season_progress 
SET prd_id = '832decff-4c78-4101-afe4-d103e5f4a3d0'
WHERE project_id = 'b3be7cb3-58e0-45d8-9f54-571e0890f3a0';

-- Part 2: Create security definer functions to break RLS recursion

-- Function to check team membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_memberships
    WHERE user_id = _user_id
      AND team_id = _team_id
  )
$$;

-- Function to check team ownership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_team_owner(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teams
    WHERE id = _team_id
      AND owner_id = _user_id
  )
$$;

-- Drop and recreate teams SELECT policy to use security definer function
DROP POLICY IF EXISTS "Users can view teams they belong to" ON teams;
CREATE POLICY "Users can view teams they belong to" ON teams
FOR SELECT USING (
  auth.uid() = owner_id OR public.is_team_member(auth.uid(), id)
);

-- Drop and recreate team_memberships SELECT policy to use security definer function
DROP POLICY IF EXISTS "Users can view memberships for their teams" ON team_memberships;
CREATE POLICY "Users can view memberships for their teams" ON team_memberships
FOR SELECT USING (
  user_id = auth.uid() OR public.is_team_owner(auth.uid(), team_id)
);

-- Part 3: Label untagged POLEN entries based on tile row
-- Tiles with rows 0-1 = POLLENS, 2-3 = NOEMS, 4-5 = POEMS, 6-7 = TOTEMS
UPDATE polen_entries
SET season_context = CASE
  WHEN tile_id BETWEEN 1 AND 16 THEN 'POLLENS'
  WHEN tile_id BETWEEN 17 AND 32 THEN 'NOEMS'
  WHEN tile_id BETWEEN 33 AND 48 THEN 'POEMS'
  WHEN tile_id BETWEEN 49 AND 64 THEN 'TOTEMS'
  ELSE 'POLLENS'
END
WHERE season_context IS NULL 
  AND user_id = '22413df7-70e0-46cc-81ce-a166feb16032'
  AND tile_id IS NOT NULL;