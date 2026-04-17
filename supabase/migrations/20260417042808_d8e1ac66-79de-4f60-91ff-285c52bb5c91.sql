-- Create book_preorders table for book launch waitlist
CREATE TABLE public.book_preorders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  tier TEXT NOT NULL DEFAULT 'reader',
  language TEXT NOT NULL DEFAULT 'en',
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.book_preorders ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a pre-order (public waitlist)
CREATE POLICY "Anyone can submit a pre-order"
ON public.book_preorders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view pre-orders
CREATE POLICY "Admins can view pre-orders"
ON public.book_preorders
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update pre-orders
CREATE POLICY "Admins can update pre-orders"
ON public.book_preorders
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete pre-orders
CREATE POLICY "Admins can delete pre-orders"
ON public.book_preorders
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for email lookups
CREATE INDEX idx_book_preorders_email ON public.book_preorders(email);
CREATE INDEX idx_book_preorders_created_at ON public.book_preorders(created_at DESC);