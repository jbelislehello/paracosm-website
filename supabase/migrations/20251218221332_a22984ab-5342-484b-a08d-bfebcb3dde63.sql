-- Create a security definer function to check project ownership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_project_owner(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_uuid AND user_id = auth.uid()
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_project_owner TO authenticated;

-- Drop the existing policy that causes infinite recursion
DROP POLICY IF EXISTS "Project owners can manage collaborators" ON public.project_collaborators;

-- Create new policy using the security definer function
CREATE POLICY "Project owners can manage collaborators"
ON public.project_collaborators
FOR ALL
USING (public.is_project_owner(project_id))
WITH CHECK (public.is_project_owner(project_id));