-- Create project_invitations table for email-based invitations
CREATE TABLE public.project_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'editor',
  invited_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  UNIQUE(project_id, email)
);

-- Enable RLS
ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Project owners can manage invitations
CREATE POLICY "Project owners can manage invitations"
  ON public.project_invitations FOR ALL
  USING (public.is_project_owner(project_id))
  WITH CHECK (public.is_project_owner(project_id));

-- RLS Policy: Users can view invitations for their email
CREATE POLICY "Users can view their invitations"
  ON public.project_invitations FOR SELECT
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- Create function to auto-resolve invitations when user signs up
CREATE OR REPLACE FUNCTION public.resolve_pending_invitations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Convert pending invitations to collaborations
  INSERT INTO public.project_collaborators (project_id, user_id, role)
  SELECT project_id, NEW.id, role
  FROM public.project_invitations
  WHERE lower(email) = lower(NEW.email) AND status = 'pending'
  ON CONFLICT (project_id, user_id) DO NOTHING;
  
  -- Mark invitations as accepted
  UPDATE public.project_invitations
  SET status = 'accepted'
  WHERE lower(email) = lower(NEW.email) AND status = 'pending';
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to resolve invitations on signup
DROP TRIGGER IF EXISTS on_user_signup_resolve_invitations ON auth.users;

CREATE TRIGGER on_user_signup_resolve_invitations
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.resolve_pending_invitations();