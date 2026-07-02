DROP POLICY IF EXISTS "Anyone can submit a summer deal lead" ON public.summer_deal_leads;

CREATE POLICY "Anyone can submit a summer deal lead"
ON public.summer_deal_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(coalesce(name, '')) BETWEEN 1 AND 120
  AND length(coalesce(email, '')) BETWEEN 3 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(coalesce(project_idea, '')) <= 4000
  AND length(coalesce(company, '')) <= 200
  AND length(coalesce(source, '')) <= 100
  AND (language IS NULL OR language IN ('en', 'fr'))
);