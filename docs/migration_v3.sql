-- ============================================================
-- booki — Supabase Migration v3
-- 변경사항: user_chapter_progress 테이블 추가
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. user_chapter_progress 테이블 추가
-- ------------------------------------------------------------

CREATE TABLE public.user_chapter_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chapter_id  UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_user_chapter_progress_user    ON public.user_chapter_progress(user_id);
CREATE INDEX idx_user_chapter_progress_chapter ON public.user_chapter_progress(chapter_id);


-- ------------------------------------------------------------
-- 2. RLS
-- ------------------------------------------------------------

ALTER TABLE public.user_chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chapter_progress: own read"
  ON public.user_chapter_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "chapter_progress: auth insert"
  ON public.user_chapter_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chapter_progress: self update"
  ON public.user_chapter_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "chapter_progress: self delete"
  ON public.user_chapter_progress FOR DELETE
  USING (auth.uid() = user_id);
