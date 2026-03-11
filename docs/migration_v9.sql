-- ============================================================
-- booki — Supabase Migration v9
-- 변경사항:
--   get_book_chapter_stats(p_book_ids UUID[]) 함수 생성
--   책 목록 조회 시 챕터별 공개 댓글 수 집계
--   → pauseHeat, commentsCount, pausesCount 실제 DB 값으로 대체
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_book_chapter_stats(p_book_ids UUID[])
RETURNS TABLE(
  book_id        UUID,
  chapter_number INT,
  comment_count  BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    ch.book_id,
    ch.number          AS chapter_number,
    COUNT(rc.id)::BIGINT AS comment_count
  FROM public.chapters ch
  LEFT JOIN public.paragraphs p
    ON p.chapter_id = ch.id
  LEFT JOIN public.reader_comments rc
    ON rc.paragraph_id = p.id
   AND rc.visibility   = 'public'
  WHERE ch.book_id = ANY(p_book_ids)
  GROUP BY ch.book_id, ch.number
  ORDER BY ch.book_id, ch.number;
$$;

GRANT EXECUTE ON FUNCTION public.get_book_chapter_stats(UUID[]) TO anon, authenticated;
