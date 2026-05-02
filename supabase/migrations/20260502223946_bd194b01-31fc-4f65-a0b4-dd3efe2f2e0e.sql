CREATE TABLE public.agentic_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Agentic Ecosystem Deck',
  audience TEXT NOT NULL DEFAULT 'founder',
  tone TEXT NOT NULL DEFAULT 'visionary',
  length_preset TEXT NOT NULL DEFAULT 'standard',
  source_urls TEXT[] NOT NULL DEFAULT '{}',
  outline JSONB,
  slides JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agentic_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own decks"
  ON public.agentic_decks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own decks"
  ON public.agentic_decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own decks"
  ON public.agentic_decks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own decks"
  ON public.agentic_decks FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_agentic_decks_updated_at
  BEFORE UPDATE ON public.agentic_decks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_agentic_decks_user_id ON public.agentic_decks(user_id);