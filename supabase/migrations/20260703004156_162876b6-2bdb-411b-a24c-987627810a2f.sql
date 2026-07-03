
CREATE TABLE public.hybrid_cognition_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL,
  phone text,
  language text NOT NULL DEFAULT 'fr',
  consent boolean NOT NULL DEFAULT true,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.hybrid_cognition_signups TO anon, authenticated;
GRANT ALL ON public.hybrid_cognition_signups TO service_role;

ALTER TABLE public.hybrid_cognition_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up"
  ON public.hybrid_cognition_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(first_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND (phone IS NULL OR length(phone) <= 40)
    AND language IN ('fr','en')
  );

CREATE POLICY "Admins can read signups"
  ON public.hybrid_cognition_signups
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX hybrid_cognition_signups_email_idx ON public.hybrid_cognition_signups (lower(email));
