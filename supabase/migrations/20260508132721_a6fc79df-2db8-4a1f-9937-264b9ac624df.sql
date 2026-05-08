DROP POLICY IF EXISTS "anyone can insert analytics events" ON public.analytics_events;

CREATE POLICY "Insert analytics events with own or anon user_id"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());