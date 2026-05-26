-- Fix 1: project_invitations — replace JWT-email based policies with auth.users lookup
DROP POLICY IF EXISTS "Users can view their invitations" ON public.project_invitations;
DROP POLICY IF EXISTS "Users can update their own invitations" ON public.project_invitations;

CREATE POLICY "Users can view their invitations"
ON public.project_invitations
FOR SELECT
USING (
  lower(email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
);

CREATE POLICY "Users can update their own invitations"
ON public.project_invitations
FOR UPDATE
USING (
  lower(email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
)
WITH CHECK (
  lower(email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
);

-- Fix 2: book_orders — add explicit INSERT policy for authenticated buyers
CREATE POLICY "Users can insert their own book orders"
ON public.book_orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);