ALTER TABLE public.trainings ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE public.book_chapters ADD COLUMN IF NOT EXISTS og_image_url text;