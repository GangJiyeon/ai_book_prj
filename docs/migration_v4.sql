-- ============================================================
-- booki — Supabase Migration v4
-- 변경사항: reader_comments에 quote 컬럼 추가 (드래그 선택 구절 저장)
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. reader_comments에 quote 컬럼 추가
--    quote: 사용자가 드래그로 선택한 원문 구절
--    text:  사용자가 입력한 댓글/메모 내용 (기존)
-- ------------------------------------------------------------

ALTER TABLE public.reader_comments
  ADD COLUMN quote TEXT;
