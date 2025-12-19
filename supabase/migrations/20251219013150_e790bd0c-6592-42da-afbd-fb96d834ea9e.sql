-- Create subscription_overrides table for granting free access
CREATE TABLE public.subscription_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tier TEXT NOT NULL CHECK (tier IN ('starter', 'growth', 'scale')),
  reason TEXT,
  granted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- NULL for permanent
);

-- Enable RLS
ALTER TABLE public.subscription_overrides ENABLE ROW LEVEL SECURITY;

-- Users can view their own override
CREATE POLICY "Users can view their own override"
  ON public.subscription_overrides FOR SELECT
  USING (user_id = auth.uid());

-- Admins can manage all overrides
CREATE POLICY "Admins can manage overrides"
  ON public.subscription_overrides FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Grant Jonathan Scale tier
INSERT INTO public.subscription_overrides (user_id, tier, reason, granted_by)
VALUES (
  '22413df7-70e0-46cc-81ce-a166feb16032',
  'scale',
  'inventor',
  '57dde48a-f211-400f-88d8-fda6602d71df'
);