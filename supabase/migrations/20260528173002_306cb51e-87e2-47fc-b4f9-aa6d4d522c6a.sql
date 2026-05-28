-- Add user_id to project_invitations to remove reliance on stale email matching
ALTER TABLE public.project_invitations
  ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE INDEX IF NOT EXISTS idx_project_invitations_user_id ON public.project_invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_project_invitations_email_lower ON public.project_invitations(lower(email));

-- Backfill user_id from existing auth.users by matching email
UPDATE public.project_invitations pi
SET user_id = u.id
FROM auth.users u
WHERE pi.user_id IS NULL
  AND lower(u.email) = lower(pi.email);

-- Replace RLS policies: prefer user_id match; allow email match only when user_id not yet linked
DROP POLICY IF EXISTS "Users can view their invitations" ON public.project_invitations;
DROP POLICY IF EXISTS "Users can update their own invitations" ON public.project_invitations;

CREATE POLICY "Users can view their invitations"
ON public.project_invitations
FOR SELECT
USING (
  user_id = auth.uid()
  OR (
    user_id IS NULL
    AND lower(email) = lower(((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))::text)
  )
);

CREATE POLICY "Users can update their own invitations"
ON public.project_invitations
FOR UPDATE
USING (
  user_id = auth.uid()
  OR (
    user_id IS NULL
    AND lower(email) = lower(((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))::text)
  )
)
WITH CHECK (
  user_id = auth.uid()
  OR (
    user_id IS NULL
    AND lower(email) = lower(((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))::text)
  )
);

-- Update resolve_pending_invitations trigger to populate user_id at acceptance time
CREATE OR REPLACE FUNCTION public.resolve_pending_invitations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Convert pending invitations to collaborations
  INSERT INTO public.project_collaborators (project_id, user_id, role)
  SELECT project_id, NEW.id, role
  FROM public.project_invitations
  WHERE lower(email) = lower(NEW.email) AND status = 'pending'
  ON CONFLICT (project_id, user_id) DO NOTHING;

  -- Link invitations to the user_id and mark as accepted via trusted server path
  UPDATE public.project_invitations
  SET status = 'accepted',
      user_id = NEW.id
  WHERE lower(email) = lower(NEW.email) AND status = 'pending';

  RETURN NEW;
END;
$function$;