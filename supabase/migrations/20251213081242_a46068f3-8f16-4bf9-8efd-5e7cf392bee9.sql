-- Create hexagram_readings table for storing oracle readings
CREATE TABLE public.hexagram_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  primary_hexagram INTEGER NOT NULL,
  relating_hexagram INTEGER,
  changing_lines INTEGER[] DEFAULT '{}',
  interpretation TEXT,
  tile_id INTEGER,
  cycle_id UUID,
  emotional_state JSONB,
  tags TEXT[] DEFAULT '{}',
  reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hexagram_readings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own readings"
ON public.hexagram_readings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own readings"
ON public.hexagram_readings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings"
ON public.hexagram_readings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own readings"
ON public.hexagram_readings
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for efficient querying
CREATE INDEX idx_hexagram_readings_user_id ON public.hexagram_readings(user_id);
CREATE INDEX idx_hexagram_readings_primary_hexagram ON public.hexagram_readings(primary_hexagram);
CREATE INDEX idx_hexagram_readings_created_at ON public.hexagram_readings(created_at DESC);