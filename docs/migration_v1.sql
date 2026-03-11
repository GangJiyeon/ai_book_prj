-- ============================================================
-- booki — Supabase Migration v1
-- 참조: ERD.md
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 0. Extensions
-- ------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ------------------------------------------------------------
-- 1. Enum 타입
-- ------------------------------------------------------------

CREATE TYPE public.visibility_type  AS ENUM ('public', 'memo', 'group');
CREATE TYPE public.like_target_type AS ENUM ('sentence', 'sentence_comment', 'reader_comment');
CREATE TYPE public.group_role       AS ENUM ('admin', 'member');
CREATE TYPE public.shelf_status     AS ENUM ('reading', 'paused', 'finished', 'commented');


-- ------------------------------------------------------------
-- 2. 테이블 생성
-- ------------------------------------------------------------

-- 2-1. users (Supabase auth.users 연결)
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-2. books
CREATE TABLE public.books (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  cover_url     TEXT,
  gutenberg_id  TEXT UNIQUE,
  description   TEXT,
  tags          TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-3. chapters
CREATE TABLE public.chapters (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id  UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  number   INTEGER NOT NULL,
  title    TEXT NOT NULL,
  UNIQUE(book_id, number)
);

-- 2-4. paragraphs
CREATE TABLE public.paragraphs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  "order"     INTEGER NOT NULL,
  text        TEXT NOT NULL,
  UNIQUE(chapter_id, "order")
);

-- 2-5. groups (reader_comments FK 때문에 sentences 앞에 생성)
CREATE TABLE public.groups (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  current_book_id  UUID REFERENCES public.books(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-6. group_members
CREATE TABLE public.group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role       public.group_role NOT NULL DEFAULT 'member',
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- 2-7. sentences
CREATE TABLE public.sentences (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id      UUID REFERENCES public.books(id) ON DELETE SET NULL,
  book_title   TEXT NOT NULL,
  author_name  TEXT NOT NULL,
  text         TEXT NOT NULL CHECK (char_length(text) <= 200),
  likes_count  INTEGER NOT NULL DEFAULT 0,
  saves_count  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-8. sentence_comments
CREATE TABLE public.sentence_comments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sentence_id  UUID NOT NULL REFERENCES public.sentences(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  likes_count  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-9. reader_comments
CREATE TABLE public.reader_comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_id  UUID NOT NULL REFERENCES public.paragraphs(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  group_id      UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  text          TEXT NOT NULL,
  visibility    public.visibility_type NOT NULL DEFAULT 'public',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2-10. likes (polymorphic)
CREATE TABLE public.likes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type  public.like_target_type NOT NULL,
  target_id    UUID NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- 2-11. saves
CREATE TABLE public.saves (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sentence_id  UUID NOT NULL REFERENCES public.sentences(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, sentence_id)
);

-- 2-12. follows
CREATE TABLE public.follows (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id <> following_id)
);

-- 2-13. bookshelf_entries
CREATE TABLE public.bookshelf_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id     UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  status      public.shelf_status NOT NULL DEFAULT 'reading',
  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);


-- ------------------------------------------------------------
-- 3. 인덱스
-- ------------------------------------------------------------

-- 피드 정렬
CREATE INDEX idx_sentences_created_at  ON public.sentences(created_at DESC);
CREATE INDEX idx_sentences_likes_count ON public.sentences(likes_count DESC);
CREATE INDEX idx_sentences_book_id     ON public.sentences(book_id);
CREATE INDEX idx_sentences_user_id     ON public.sentences(user_id);

-- 댓글 조회
CREATE INDEX idx_sentence_comments_sentence_id ON public.sentence_comments(sentence_id);
CREATE INDEX idx_sentence_comments_user_id     ON public.sentence_comments(user_id);
CREATE INDEX idx_reader_comments_paragraph_id  ON public.reader_comments(paragraph_id);
CREATE INDEX idx_reader_comments_group_id      ON public.reader_comments(group_id);

-- 좋아요 조회
CREATE INDEX idx_likes_target  ON public.likes(target_type, target_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);

-- 저장 조회
CREATE INDEX idx_saves_user_id ON public.saves(user_id);

-- 팔로우
CREATE INDEX idx_follows_follower_id  ON public.follows(follower_id);
CREATE INDEX idx_follows_following_id ON public.follows(following_id);

-- 그룹
CREATE INDEX idx_group_members_user_id  ON public.group_members(user_id);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);

-- 책장
CREATE INDEX idx_bookshelf_user_id ON public.bookshelf_entries(user_id);
CREATE INDEX idx_bookshelf_status  ON public.bookshelf_entries(status);

-- 챕터/단락
CREATE INDEX idx_chapters_book_id   ON public.chapters(book_id);
CREATE INDEX idx_paragraphs_chapter ON public.paragraphs(chapter_id, "order");


-- ------------------------------------------------------------
-- 4. 트리거 — likes_count / saves_count 자동 갱신
-- ------------------------------------------------------------

-- sentences.likes_count
CREATE OR REPLACE FUNCTION public.update_sentence_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'sentence' THEN
    UPDATE public.sentences SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'sentence' THEN
    UPDATE public.sentences SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sentence_likes_count
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.update_sentence_likes_count();

-- sentences.saves_count
CREATE OR REPLACE FUNCTION public.update_sentence_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.sentences SET saves_count = saves_count + 1 WHERE id = NEW.sentence_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.sentences SET saves_count = GREATEST(saves_count - 1, 0) WHERE id = OLD.sentence_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sentence_saves_count
AFTER INSERT OR DELETE ON public.saves
FOR EACH ROW EXECUTE FUNCTION public.update_sentence_saves_count();

-- sentence_comments.likes_count
CREATE OR REPLACE FUNCTION public.update_sentence_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'sentence_comment' THEN
    UPDATE public.sentence_comments SET likes_count = likes_count + 1 WHERE id = NEW.target_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'sentence_comment' THEN
    UPDATE public.sentence_comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sentence_comment_likes_count
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW EXECUTE FUNCTION public.update_sentence_comment_likes_count();


-- ------------------------------------------------------------
-- 5. RLS 활성화
-- ------------------------------------------------------------

ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paragraphs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentences         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentence_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reader_comments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookshelf_entries ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- 6. RLS 정책
-- ------------------------------------------------------------

-- users
CREATE POLICY "users: public read"
  ON public.users FOR SELECT USING (true);
CREATE POLICY "users: self update"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- books / chapters / paragraphs (퍼블릭 읽기)
CREATE POLICY "books: public read"
  ON public.books FOR SELECT USING (true);
CREATE POLICY "chapters: public read"
  ON public.chapters FOR SELECT USING (true);
CREATE POLICY "paragraphs: public read"
  ON public.paragraphs FOR SELECT USING (true);

-- sentences
CREATE POLICY "sentences: public read"
  ON public.sentences FOR SELECT USING (true);
CREATE POLICY "sentences: auth insert"
  ON public.sentences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sentences: self delete"
  ON public.sentences FOR DELETE
  USING (auth.uid() = user_id);

-- sentence_comments
CREATE POLICY "sentence_comments: public read"
  ON public.sentence_comments FOR SELECT USING (true);
CREATE POLICY "sentence_comments: auth insert"
  ON public.sentence_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sentence_comments: self delete"
  ON public.sentence_comments FOR DELETE
  USING (auth.uid() = user_id);

-- reader_comments
CREATE POLICY "reader_comments: read"
  ON public.reader_comments FOR SELECT
  USING (
    visibility = 'public'
    OR (visibility = 'memo'  AND auth.uid() = user_id)
    OR (visibility = 'group' AND EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = reader_comments.group_id
        AND user_id = auth.uid()
    ))
  );
CREATE POLICY "reader_comments: auth insert"
  ON public.reader_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reader_comments: self delete"
  ON public.reader_comments FOR DELETE
  USING (auth.uid() = user_id);

-- likes
CREATE POLICY "likes: public read"
  ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes: auth insert"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes: self delete"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);

-- saves
CREATE POLICY "saves: own read"
  ON public.saves FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "saves: auth insert"
  ON public.saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saves: self delete"
  ON public.saves FOR DELETE
  USING (auth.uid() = user_id);

-- follows
CREATE POLICY "follows: public read"
  ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows: auth insert"
  ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows: self delete"
  ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);

-- groups
CREATE POLICY "groups: public read"
  ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups: auth create"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "groups: creator update"
  ON public.groups FOR UPDATE
  USING (auth.uid() = creator_id);

-- group_members
CREATE POLICY "group_members: public read"
  ON public.group_members FOR SELECT USING (true);
CREATE POLICY "group_members: auth join"
  ON public.group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "group_members: self leave"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- bookshelf_entries
CREATE POLICY "bookshelf: own read"
  ON public.bookshelf_entries FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "bookshelf: auth insert"
  ON public.bookshelf_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookshelf: self update"
  ON public.bookshelf_entries FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "bookshelf: self delete"
  ON public.bookshelf_entries FOR DELETE
  USING (auth.uid() = user_id);


-- ------------------------------------------------------------
-- 7. 신규 유저 자동 프로필 생성 트리거
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
