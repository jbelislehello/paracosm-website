
-- Compasses
CREATE TABLE public.book_compasses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  quote text,
  quote_attribution text,
  timing text,
  tools text[] NOT NULL DEFAULT '{}',
  practices text[] NOT NULL DEFAULT '{}',
  phase_affinity text[] NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.book_compasses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published compasses"
  ON public.book_compasses FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins manage compasses"
  ON public.book_compasses FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_book_compasses_updated_at
  BEFORE UPDATE ON public.book_compasses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reflection nodes
CREATE TABLE public.book_reflection_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_slug text,
  compass_slug text,
  kind text NOT NULL DEFAULT 'reflection', -- conversation_starter | reflection | fragment | bilingual_passage
  title text,
  body_md text NOT NULL,
  source_ref text,
  language text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'draft',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reflection_chapter ON public.book_reflection_nodes(chapter_slug) WHERE chapter_slug IS NOT NULL;
CREATE INDEX idx_reflection_compass ON public.book_reflection_nodes(compass_slug) WHERE compass_slug IS NOT NULL;

ALTER TABLE public.book_reflection_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published reflection nodes"
  ON public.book_reflection_nodes FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins manage reflection nodes"
  ON public.book_reflection_nodes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_book_reflection_nodes_updated_at
  BEFORE UPDATE ON public.book_reflection_nodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
