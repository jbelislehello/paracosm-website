-- Admin override RLS policies for demo data management

-- PRDs: Admins can manage all PRDs
CREATE POLICY "Admins can manage all PRDs" ON public.prds
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Projects: Admins can manage all projects
CREATE POLICY "Admins can manage all projects" ON public.projects
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- POLEN entries: Admins can manage all
CREATE POLICY "Admins can manage all polen entries" ON public.polen_entries
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Trajectory states: Admins can manage all
CREATE POLICY "Admins can manage all trajectory states" ON public.trajectory_states
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));