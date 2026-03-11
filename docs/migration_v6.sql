-- ============================================================
-- booki — Supabase Migration v6
-- 변경사항: chapter_comments 테이블 추가 (챕터 단위 토론)
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. chapter_comments 테이블 생성
-- ------------------------------------------------------------

CREATE TABLE public.chapter_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  group_id    UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  text        TEXT NOT NULL,
  visibility  public.visibility_type NOT NULL DEFAULT 'public',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 2. 인덱스
-- ------------------------------------------------------------

CREATE INDEX idx_chapter_comments_chapter_id ON public.chapter_comments(chapter_id);
CREATE INDEX idx_chapter_comments_group_id   ON public.chapter_comments(group_id);
CREATE INDEX idx_chapter_comments_created_at ON public.chapter_comments(created_at DESC);


-- ------------------------------------------------------------
-- 3. RLS 활성화 및 정책
-- ------------------------------------------------------------

ALTER TABLE public.chapter_comments ENABLE ROW LEVEL SECURITY;

-- public 댓글은 누구나, memo는 본인만, group은 그룹 멤버만
CREATE POLICY "chapter_comments: read"
  ON public.chapter_comments FOR SELECT
  USING (
    visibility = 'public'
    OR (visibility = 'memo'  AND auth.uid() = user_id)
    OR (visibility = 'group' AND EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = chapter_comments.group_id
        AND user_id = auth.uid()
    ))
  );

CREATE POLICY "chapter_comments: auth insert"
  ON public.chapter_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chapter_comments: self delete"
  ON public.chapter_comments FOR DELETE
  USING (auth.uid() = user_id);
