CREATE TABLE IF NOT EXISTS public._tmp_chapter_publish (chapter_id uuid PRIMARY KEY, draft_md text NOT NULL);
ALTER TABLE public._tmp_chapter_publish ENABLE ROW LEVEL SECURITY;