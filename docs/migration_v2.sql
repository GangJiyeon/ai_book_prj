-- ============================================================
-- booki — Supabase Migration v2
-- 변경사항: book_sentences 테이블 추가, reader_comments 수정
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. book_sentences 테이블 추가
-- ------------------------------------------------------------

CREATE TABLE public.book_sentences (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_id    UUID NOT NULL REFERENCES public.paragraphs(id) ON DELETE CASCADE,
  "order"         INTEGER NOT NULL,
  text            TEXT NOT NULL,
  comments_count  INTEGER NOT NULL DEFAULT 0,
  UNIQUE(paragraph_id, "order")
);

CREATE INDEX idx_book_sentences_paragraph ON public.book_sentences(paragraph_id, "order");


-- ------------------------------------------------------------
-- 2. reader_comments 수정
--    - sentence_id 컬럼 추가 (nullable)
--    - paragraph_id nullable로 변경
--    - 둘 중 하나는 반드시 있어야 한다는 CHECK 추가
-- ------------------------------------------------------------

ALTER TABLE public.reader_comments
  ADD COLUMN sentence_id UUID REFERENCES public.book_sentences(id) ON DELETE CASCADE;

ALTER TABLE public.reader_comments
  ALTER COLUMN paragraph_id DROP NOT NULL;

ALTER TABLE public.reader_comments
  ADD CONSTRAINT chk_comment_target
  CHECK (paragraph_id IS NOT NULL OR sentence_id IS NOT NULL);

CREATE INDEX idx_reader_comments_sentence_id ON public.reader_comments(sentence_id);


-- ------------------------------------------------------------
-- 3. RLS
-- ------------------------------------------------------------

ALTER TABLE public.book_sentences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "book_sentences: public read"
  ON public.book_sentences FOR SELECT USING (true);


-- ------------------------------------------------------------
-- 4. 트리거 — book_sentences.comments_count 자동 갱신
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_sentence_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.sentence_id IS NOT NULL THEN
    UPDATE public.book_sentences SET comments_count = comments_count + 1 WHERE id = NEW.sentence_id;
  ELSIF TG_OP = 'DELETE' AND OLD.sentence_id IS NOT NULL THEN
    UPDATE public.book_sentences SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.sentence_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sentence_comments_count
AFTER INSERT OR DELETE ON public.reader_comments
FOR EACH ROW EXECUTE FUNCTION public.update_sentence_comments_count();
