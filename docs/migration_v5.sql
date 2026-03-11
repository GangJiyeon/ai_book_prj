-- ============================================================
-- booki — Supabase Migration v5
-- 변경사항: reader_comments에 likes_count 컬럼 추가 + 자동 갱신 트리거
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. reader_comments에 likes_count 컬럼 추가
-- ------------------------------------------------------------

ALTER TABLE public.reader_comments
  ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;


-- ------------------------------------------------------------
-- 2. 기존 likes 데이터로 likes_count 백필
--    (이미 reader_comment 타입의 likes가 있을 경우 반영)
-- ------------------------------------------------------------

UPDATE public.reader_comments rc
SET likes_count = (
  SELECT COUNT(*)
  FROM public.likes l
  WHERE l.target_type = 'reader_comment'
    AND l.target_id = rc.id
);


-- ------------------------------------------------------------
-- 3. likes INSERT/DELETE 시 likes_count 자동 갱신 트리거
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_reader_comment_likes_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'reader_comment' THEN
    UPDATE public.reader_comments SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'reader_comment' THEN
    UPDATE public.reader_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_reader_comment_likes_count
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.update_reader_comment_likes_count();


-- ------------------------------------------------------------
-- 4. 성능을 위한 인덱스 추가
-- ------------------------------------------------------------

CREATE INDEX idx_reader_comments_likes_count ON public.reader_comments(likes_count DESC);
