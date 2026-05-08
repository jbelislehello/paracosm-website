CREATE TABLE public.image_credits (
  slug text PRIMARY KEY,
  photographer text,
  location text,
  year text,
  event text,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.image_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view image credits"
  ON public.image_credits FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert image credits"
  ON public.image_credits FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update image credits"
  ON public.image_credits FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete image credits"
  ON public.image_credits FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_image_credits_updated_at
  BEFORE UPDATE ON public.image_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();