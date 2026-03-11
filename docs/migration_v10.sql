-- ============================================================
-- booki — Supabase Migration v10
-- 변경사항:
--   users 테이블에 preferred_locale 컬럼 추가
--   사용자 언어 설정을 DB에 저장
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS preferred_locale TEXT NOT NULL DEFAULT 'ko'
    CHECK (preferred_locale IN ('ko', 'en'));
