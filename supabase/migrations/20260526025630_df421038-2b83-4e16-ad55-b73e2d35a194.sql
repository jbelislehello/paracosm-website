DROP TABLE IF EXISTS public._tmp_chapter_publish;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.book_orders;

CREATE POLICY "Users can view their own orders"
ON public.book_orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);