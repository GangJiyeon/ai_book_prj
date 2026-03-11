-- ============================================================
-- booki — Supabase Migration v7
-- 변경사항: trending_pauses 집계 뷰 생성
--   paragraph 단위로 public reader_comments 집계
--   댓글 수 기준 상위 5개, 샘플 댓글 3개 포함
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. trending_pauses 뷰 생성
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW public.trending_pauses AS
WITH ranked AS (
  SELECT
    rc.paragraph_id,
    MAX(rc.quote) FILTER (WHERE rc.quote IS NOT NULL AND rc.quote <> '') AS quote,
    b.title  AS book_title,
    COUNT(rc.id) AS comments_count
  FROM public.reader_comments rc
  JOIN public.paragraphs  p  ON p.id  = rc.paragraph_id
  JOIN public.chapters    ch ON ch.id = p.chapter_id
  JOIN public.books       b  ON b.id  = ch.book_id
  WHERE rc.visibility = 'public'
    AND rc.quote IS NOT NULL
    AND rc.quote <> ''
  GROUP BY rc.paragraph_id, b.title
)
SELECT
  r.paragraph_id::text AS id,
  r.quote,
  r.book_title,
  r.comments_count,
  COALESCE(
    (
      SELECT json_agg(
        json_build_object('user', u.username, 'text', sub.text)
        ORDER BY sub.likes_count DESC
      )
      FROM (
        SELECT rc2.text, rc2.user_id, rc2.likes_count
        FROM public.reader_comments rc2
        WHERE rc2.paragraph_id = r.paragraph_id
          AND rc2.visibility = 'public'
          AND rc2.quote IS NOT NULL
          AND rc2.quote <> ''
        ORDER BY rc2.likes_count DESC
        LIMIT 3
      ) sub
      JOIN public.users u ON u.id = sub.user_id
    ),
    '[]'::json
  ) AS comments
FROM ranked r
ORDER BY r.comments_count DESC
LIMIT 5;


-- ------------------------------------------------------------
-- 2. 뷰에 대한 공개 읽기 권한 부여 (RLS 없음 — 이미 public 필터 적용)
-- ------------------------------------------------------------

GRANT SELECT ON public.trending_pauses TO anon, authenticated;
