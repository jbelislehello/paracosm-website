
CREATE TABLE public.summer_deal_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_idea TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.summer_deal_leads TO anon, authenticated;
GRANT ALL ON public.summer_deal_leads TO service_role;

ALTER TABLE public.summer_deal_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a summer deal lead"
  ON public.summer_deal_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view summer deal leads"
  ON public.summer_deal_leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage summer deal leads"
  ON public.summer_deal_leads FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
