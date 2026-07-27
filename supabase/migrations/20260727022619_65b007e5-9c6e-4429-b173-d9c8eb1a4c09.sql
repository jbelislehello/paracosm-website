-- Shares
CREATE TABLE public.readiness_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.readiness_sessions(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  recipient_emails text[] NOT NULL DEFAULT '{}',
  snapshot jsonb NOT NULL,
  note text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.readiness_shares TO authenticated;
GRANT ALL ON public.readiness_shares TO service_role;

ALTER TABLE public.readiness_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners manage own shares"
  ON public.readiness_shares
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE TRIGGER trg_readiness_shares_updated_at
  BEFORE UPDATE ON public.readiness_shares
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- One-time codes (server-only)
CREATE TABLE public.readiness_share_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id uuid NOT NULL REFERENCES public.readiness_shares(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX readiness_share_codes_share_email_idx
  ON public.readiness_share_codes (share_id, lower(email));

GRANT ALL ON public.readiness_share_codes TO service_role;

ALTER TABLE public.readiness_share_codes ENABLE ROW LEVEL SECURITY;

-- No anon / authenticated policies: only service_role (used by edge functions) can access.