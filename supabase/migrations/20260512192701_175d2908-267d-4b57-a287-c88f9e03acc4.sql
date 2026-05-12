
-- ============ Tables ============

CREATE TABLE public.book_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  order_index integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  phase text NOT NULL DEFAULT 'GLITCH',
  summary text,
  status text NOT NULL DEFAULT 'outline',
  is_free_sample boolean NOT NULL DEFAULT false,
  published_excerpt text,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT book_chapters_status_check CHECK (status IN ('outline','drafting','review','published')),
  CONSTRAINT book_chapters_phase_check CHECK (phase IN ('GLITCH','DRIFT','TUNE','LOVE','MAGIC','CALM','FREE'))
);

CREATE TABLE public.book_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  kind text NOT NULL,
  ref text NOT NULL,
  title text,
  excerpt text,
  weight integer NOT NULL DEFAULT 3,
  included boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT book_sources_kind_check CHECK (kind IN ('upload','site_page','prd','drift','journal','polen','url')),
  CONSTRAINT book_sources_weight_check CHECK (weight BETWEEN 1 AND 5)
);
CREATE INDEX idx_book_sources_chapter ON public.book_sources(chapter_id);

CREATE TABLE public.book_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid REFERENCES public.book_chapters(id) ON DELETE SET NULL,
  file_path text NOT NULL,
  mime text,
  original_name text,
  extracted_text text,
  notes text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_book_uploads_chapter ON public.book_uploads(chapter_id);

CREATE TABLE public.book_chapter_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  model text NOT NULL,
  prompt_snapshot text,
  draft_md text NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_book_drafts_chapter ON public.book_chapter_drafts(chapter_id);

CREATE TABLE public.book_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  tier text NOT NULL,
  stripe_session_id text,
  amount integer,
  currency text DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT book_orders_tier_check CHECK (tier IN ('cohort','org')),
  CONSTRAINT book_orders_status_check CHECK (status IN ('pending','paid','refunded','canceled'))
);
CREATE INDEX idx_book_orders_user ON public.book_orders(user_id);
CREATE INDEX idx_book_orders_email ON public.book_orders(email);

-- Extend book_preorders for the funnel
ALTER TABLE public.book_preorders
  ADD COLUMN IF NOT EXISTS interest text,
  ADD COLUMN IF NOT EXISTS chapter_slug text,
  ADD COLUMN IF NOT EXISTS utm jsonb;

-- ============ updated_at triggers ============

CREATE TRIGGER trg_book_chapters_updated_at
  BEFORE UPDATE ON public.book_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_book_orders_updated_at
  BEFORE UPDATE ON public.book_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ RLS ============

ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapter_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_orders ENABLE ROW LEVEL SECURITY;

-- book_chapters: public read of published, admin all
CREATE POLICY "Anyone can view published chapters"
  ON public.book_chapters FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can view all chapters"
  ON public.book_chapters FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage chapters"
  ON public.book_chapters FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- book_sources: admin only
CREATE POLICY "Admins manage book sources"
  ON public.book_sources FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- book_uploads: admin only
CREATE POLICY "Admins manage book uploads"
  ON public.book_uploads FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- book_chapter_drafts: admin only
CREATE POLICY "Admins manage chapter drafts"
  ON public.book_chapter_drafts FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- book_orders: user reads own, admin all, only edge functions insert
CREATE POLICY "Users can view their own orders"
  ON public.book_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Admins manage book orders"
  ON public.book_orders FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ Storage bucket ============

INSERT INTO storage.buckets (id, name, public)
VALUES ('book-manuscript', 'book-manuscript', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins read book manuscript files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'book-manuscript' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins upload book manuscript files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'book-manuscript' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update book manuscript files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'book-manuscript' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete book manuscript files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'book-manuscript' AND has_role(auth.uid(), 'admin'::app_role));

-- ============ Seed 7 chapters ============

INSERT INTO public.book_chapters (slug, order_index, title, phase, summary, status, is_free_sample) VALUES
  ('naming-the-friction', 1, 'Naming the Friction', 'GLITCH', 'Why the future arrives as a glitch first. Reading signals, holding tensions, refusing premature resolution.', 'outline', true),
  ('pattern-exploration', 2, 'Pattern Exploration', 'DRIFT', 'Wandering with discipline. Mapping possible and probable futures before committing.', 'outline', false),
  ('intentional-commitment', 3, 'Intentional Commitment', 'TUNE', 'Choosing the future you author. Velocity = speed × direction toward what should exist.', 'outline', false),
  ('relational-infrastructure', 4, 'Relational Infrastructure', 'LOVE', 'Trust, conflict, repair. Relational intelligence as load-bearing wall of any agentic system.', 'outline', false),
  ('pragmatic-imagination', 5, 'Pragmatic Imagination', 'MAGIC', 'Worldbuilding as leadership skill. Diegetic prototyping, narrative tooling, existential design.', 'outline', false),
  ('designing-the-system', 6, 'Designing the System', 'CALM', 'From insight to ontology. Building calm scaffolding so fast agents operate without breaking the team.', 'outline', false),
  ('operating-in-flow', 7, 'Operating in Flow', 'FREE', 'When the framework dissolves into practice. Continuous reconfiguration. Preferable futures shipped weekly.', 'outline', false)
ON CONFLICT (slug) DO NOTHING;
