# booki — Entity Relationship Diagram

> 최종 업데이트: 2026-03-08
> 참조: IA.md, mock-data.ts, 프로젝트 구조

---

## 1. 전체 ERD

```
┌─────────────────────┐         ┌──────────────────────────┐
│        users        │         │          books           │
├─────────────────────┤         ├──────────────────────────┤
│ id (PK)             │         │ id (PK)                  │
│ username            │         │ title                    │
│ email               │         │ author                   │
│ password_hash       │         │ cover_url                │
│ avatar_url          │         │ gutenberg_id             │
│ bio                 │         │ description              │
│ created_at          │         │ tags[]                   │
└────────┬────────────┘         │ created_at               │
         │                      └───────┬──────────────────┘
         │                              │
         │  ┌───────────────────────────┤
         │  │                           │
         │  │                    ┌──────┴───────────────┐
         │  │                    │       chapters        │
         │  │                    ├───────────────────────┤
         │  │                    │ id (PK)               │
         │  │                    │ book_id (FK → books)  │
         │  │                    │ number                │
         │  │                    │ title                 │
         │  │                    └──────┬────────────────┘
         │  │                           │
         │  │                    ┌──────┴───────────────────┐
         │  │                    │        paragraphs         │
         │  │                    ├──────────────────────────┤
         │  │                    │ id (PK)                  │
         │  │                    │ chapter_id (FK)          │
         │  │                    │ order                    │
         │  │                    │ text                     │
         │  │                    └──────┬───────────────────┘
         │  │                           │
         │  │              ┌────────────┘
         │  │              │
         │  │   ┌──────────┴────────────────────────────┐
         │  │   │           reader_comments              │
         │  │   ├───────────────────────────────────────┤
         │  │   │ id (PK)                               │
         │  └───┤ user_id (FK → users)                  │
         │      │ paragraph_id (FK → paragraphs)        │
         │      │ group_id (FK → groups, nullable)      │
         │      │ text                                  │
         │      │ visibility  -- public | memo | group  │
         │      │ created_at                            │
         │      └───────────────────────────────────────┘
         │
         │
         │      ┌───────────────────────────────────────┐
         │      │            sentences                   │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         ├──────┤ user_id (FK → users)                  │
         │      │ book_id (FK → books, nullable)        │
         │      │ book_title   -- 직접 입력값 저장       │
         │      │ author_name  -- 직접 입력값 저장       │
         │      │ text (max 200)                        │
         │      │ likes_count  -- 캐시 카운터            │
         │      │ saves_count  -- 캐시 카운터            │
         │      │ created_at                            │
         │      └────────────┬──────────────────────────┘
         │                   │
         │      ┌────────────┴──────────────────────────┐
         │      │         sentence_comments              │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         ├──────┤ user_id (FK → users)                  │
         │      │ sentence_id (FK → sentences)          │
         │      │ text                                  │
         │      │ likes_count  -- 캐시 카운터            │
         │      │ created_at                            │
         │      └───────────────────────────────────────┘
         │
         │      ┌───────────────────────────────────────┐
         │      │               likes                    │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         ├──────┤ user_id (FK → users)                  │
         │      │ target_type  -- sentence | sc | rc     │
         │      │ target_id                             │
         │      │ created_at                            │
         │      │ UNIQUE(user_id, target_type, target_id)│
         │      └───────────────────────────────────────┘
         │
         │      ┌───────────────────────────────────────┐
         │      │               saves                    │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         ├──────┤ user_id (FK → users)                  │
         │      │ sentence_id (FK → sentences)          │
         │      │ created_at                            │
         │      │ UNIQUE(user_id, sentence_id)          │
         │      └───────────────────────────────────────┘
         │
         │      ┌───────────────────────────────────────┐
         │      │              follows                   │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         ├──────┤ follower_id (FK → users)              │
         │      │ following_id (FK → users)             │
         │      │ created_at                            │
         │      │ UNIQUE(follower_id, following_id)     │
         │      └───────────────────────────────────────┘
         │
         │      ┌───────────────────────────────────────┐
         │      │          bookshelf_entries             │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         ├──────┤ user_id (FK → users)                  │
         │      │ book_id (FK → books)                  │
         │      │ status  -- reading|paused|finished    │
         │      │           |commented                  │
         │      │ progress (0-100)                      │
         │      │ updated_at                            │
         │      │ UNIQUE(user_id, book_id)              │
         │      └───────────────────────────────────────┘
         │
         │      ┌───────────────────────────────────────┐
         │      │               groups                   │
         │      ├───────────────────────────────────────┤
         │      │ id (PK)                               │
         └──────┤ creator_id (FK → users)               │
                │ current_book_id (FK → books)          │
                │ name                                  │
                │ description                           │
                │ created_at                            │
                └───────────────┬───────────────────────┘
                                │
                ┌───────────────┴───────────────────────┐
                │           group_members                │
                ├───────────────────────────────────────┤
                │ id (PK)                               │
                │ group_id (FK → groups)                │
                │ user_id (FK → users)                  │
                │ role  -- admin | member               │
                │ joined_at                             │
                │ UNIQUE(group_id, user_id)             │
                └───────────────────────────────────────┘
```

---

## 2. 라우트별 사용 엔티티

---

### `/` — 홈 (문장 피드)

**목적:** 문장 카드 피드 표시, 정렬, 좋아요/저장 토글

```
┌─────────────┐     N:1     ┌──────────────┐     N:1     ┌─────────┐
│  sentences  │────────────▶│    users     │             │  books  │
│             │             │              │             │         │
│  id         │             │  id          │             │  id     │
│  text       │             │  username    │             │  title  │
│  book_title │             │  avatar_url  │             │  author │
│  author_name│             └──────────────┘             └─────────┘
│  user_id ───┤                                               ▲
│  book_id ───┼───────────────────────────────────────────────┘
│  likes_count│
│  saves_count│
│  created_at │
└──────┬──────┘
       │
       │  1:N
       ▼
┌────────────────────┐     ┌────────────────────┐
│ sentence_comments  │     │       saves         │
│                    │     │                    │
│  id                │     │  user_id           │
│  sentence_id       │     │  sentence_id       │
│  user_id           │     └────────────────────┘
│  text              │
│  likes_count       │     ┌────────────────────┐
│  created_at        │     │       likes         │
└────────────────────┘     │                    │
                           │  user_id           │
                           │  target_type       │
                           │  target_id         │
                           └────────────────────┘
```

**API 요청:**
- `GET /sentences?sort=trending|newest|most-commented`
- `POST /sentences/:id/like`
- `POST /sentences/:id/save`

---

### `/sentences/new` — 문장 등록

**목적:** 사용자가 문장 업로드

```
┌─────────┐    입력    ┌──────────────────────┐
│  users  │──────────▶│       sentences       │
│         │  (INSERT) │                      │
│  id     │           │  user_id             │
│ username│           │  book_id (nullable)  │
└─────────┘           │  book_title          │
                      │  author_name         │
┌─────────┐  조회(선택)│  text (max 200)      │
│  books  │──────────▶│  created_at          │
│         │           └──────────────────────┘
│  id     │
│  title  │
│  author │
└─────────┘
```

**API 요청:**
- `POST /sentences`
- `GET /books/search?q=...` (책 자동완성, 선택)

---

### `/sentences/[id]` — 문장 상세 + 댓글

**목적:** 문장 하나의 전체 댓글 토론

```
┌─────────────┐
│  sentences  │
│             │
│  id         │
│  text       │
│  book_title │
│  author_name│
│  likes_count│
│  saves_count│
└──────┬──────┘
       │ 1:N
       ▼
┌──────────────────────┐     N:1     ┌──────────────┐
│   sentence_comments  │────────────▶│    users     │
│                      │             │              │
│  id                  │             │  id          │
│  sentence_id         │             │  username    │
│  user_id             │             │  avatar_url  │
│  text                │             └──────────────┘
│  likes_count         │
│  created_at          │
└──────────────────────┘

┌────────────────────┐     ┌────────────────────┐
│       likes         │     │       saves         │
│  (sentence)        │     │                    │
│  user_id           │     │  user_id           │
│  target_id         │     │  sentence_id       │
└────────────────────┘     └────────────────────┘
```

**API 요청:**
- `GET /sentences/:id`
- `GET /sentences/:id/comments`
- `POST /sentences/:id/comments`
- `POST /sentences/:id/like`
- `POST /sentence-comments/:id/like`

---

### `/books` — 책 탐색

**목적:** 책 목록 탐색, 검색, 필터, 트렌딩 pause

```
┌────────────────────────────────┐
│             books              │
│                                │
│  id                            │
│  title                         │
│  author                        │
│  cover_url / gutenberg_id      │
│  tags[]                        │
│  description                   │
└──────────────┬─────────────────┘
               │ 1:N (집계)
               ▼
┌──────────────────────────────────────────┐
│    집계 뷰 (materialized or computed)     │
│                                          │
│  book_id                                 │
│  likes_count    ← sentences.likes 합산  │
│  pauses_count   ← reader_comments 수    │
│  comments_count ← sentence_comments 합산│
└──────────────────────────────────────────┘

┌──────────────┐   트렌딩 pause 사이드바
│  sentences   │──────────────────────────▶ 인기순 상위 5개 표시
│  (book_id 기준 집계)
└──────────────┘
```

**API 요청:**
- `GET /books?sort=...&genre=...&q=...`
- `GET /sentences?sort=trending&limit=5` (트렌딩 패널)

---

### `/books/[id]` — 책 상세

**목적:** 책 정보, 인기 anchor, 챕터 목록

```
┌──────────┐
│  books   │
│  id      │
│  title   │
│  author  │
│  desc... │
└────┬─────┘
     │
     ├────────────────────────────────────────┐
     │ 1:N                                    │ 1:N
     ▼                                        ▼
┌───────────────────────┐         ┌───────────────────┐
│       chapters        │         │     sentences      │
│                       │         │  (book_id 기준)    │
│  id                   │         │                   │
│  book_id              │         │  id               │
│  number               │         │  text             │
│  title                │         │  likes_count      │
│  progress (사용자별)  │         │  saves_count      │
│  has_anchors          │         └───────────────────┘
└──────────┬────────────┘
           │ 1:N
           ▼
┌──────────────────────────────┐
│         paragraphs           │
│                              │
│  id                          │
│  chapter_id                  │
│  order                       │
│  text                        │
│  comments_count (집계)       │  ← Popular Anchors 기준
└──────────────────────────────┘
```

**API 요청:**
- `GET /books/:id`
- `GET /books/:id/chapters`
- `GET /books/:id/sentences?sort=popular` (Popular Anchors)

---

### `/read/[id]/[chapter]` — 퍼블릭 도메인 리더

**목적:** 단락 단위 읽기 + 댓글 (솔로 / 그룹 컨텍스트)

```
┌──────────┐  1:N  ┌────────────┐  1:N  ┌────────────────────┐
│  books   │──────▶│  chapters  │──────▶│     paragraphs     │
│          │       │            │       │                    │
│  id      │       │  id        │       │  id                │
│  title   │       │  book_id   │       │  chapter_id        │
│  author  │       │  number    │       │  order             │
└──────────┘       │  title     │       │  text              │
                   └────────────┘       └─────────┬──────────┘
                                                  │ 1:N
                                                  ▼
                                        ┌─────────────────────────┐
                                        │      reader_comments     │
                                        │                         │
                                        │  id                     │
                                        │  paragraph_id           │
                                        │  user_id (FK)           │
                                        │  group_id (FK, nullable)│
                                        │  text                   │
                                        │  visibility             │
                                        │    public               │
                                        │    memo   (나만 보기)   │
                                        │    group  (그룹 공개)   │
                                        │  created_at             │
                                        └─────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  URL 파라미터 컨텍스트                                          │
│                                                                │
│  /read/[bookId]/[chapter]?groupId=[groupId]                   │
│                                                                │
│  groupId 없음  → mode: "solo"   → visibility: public | memo  │
│  groupId 있음  → mode: "group"  → visibility: public | group │
└────────────────────────────────────────────────────────────────┘
```

**API 요청:**
- `GET /books/:id/chapters/:chapter`
- `GET /paragraphs/:id/comments?groupId=...`
- `POST /paragraphs/:id/comments`

---

### `/saved` — 저장한 문장

**목적:** 내가 저장한 문장 목록

```
┌──────────┐  1:N  ┌────────────────────┐  N:1  ┌─────────────┐
│  users   │──────▶│       saves        │──────▶│  sentences  │
│          │       │                    │       │             │
│  id      │       │  id                │       │  id         │
│  username│       │  user_id           │       │  text       │
└──────────┘       │  sentence_id       │       │  book_title │
                   │  created_at        │       │  author_name│
                   └────────────────────┘       └─────────────┘
```

**API 요청:**
- `GET /users/me/saves`
- `DELETE /saves/:sentenceId`

---

### `/bookshelf` — 내 책장

**목적:** 카테고리별 책 관리 + anchor 목록

```
                   ┌────────────────────────────┐
                   │      bookshelf_entries      │
                   │                            │
┌──────────┐  1:N  │  id                        │  N:1  ┌──────────┐
│  users   │──────▶│  user_id                   │──────▶│  books   │
│          │       │  book_id                   │       │          │
│  id      │       │  status                    │       │  id      │
└──────────┘       │    reading                 │       │  title   │
                   │    paused                  │       │  author  │
                   │    finished                │       │ cover_url│
                   │    commented               │       └──────────┘
                   │  progress (0-100)          │
                   │  updated_at                │
                   └────────────────────────────┘

  [Anchors 탭]

┌──────────┐  1:N  ┌──────────────────────┐
│  users   │──────▶│    reader_comments   │
│          │       │  (paragraph 저장분)  │
└──────────┘       │                      │
                   │  paragraph_id        │──▶ paragraphs → chapters → books
                   │  visibility: memo    │
                   └──────────────────────┘
```

**API 요청:**
- `GET /users/me/bookshelf`
- `PATCH /bookshelf/:bookId` (status 변경)
- `GET /users/me/anchors` (메모 댓글)

---

### `/groups` — 독서 그룹 목록

**목적:** 그룹 탐색, 가입

```
┌──────────┐  creator  ┌─────────────────────┐
│  users   │──────────▶│       groups        │
│          │           │                     │
│  id      │           │  id                 │
│  username│           │  name               │
└──────────┘           │  description        │
                       │  creator_id         │
                       │  current_book_id ───┼──▶ books
                       │  created_at         │
                       └──────────┬──────────┘
                                  │ 1:N
                                  ▼
                       ┌──────────────────────┐
                       │     group_members    │
                       │                     │
                       │  group_id           │
                       │  user_id ───────────┼──▶ users
                       │  role               │
                       │  joined_at          │
                       └──────────────────────┘
```

**API 요청:**
- `GET /groups`
- `POST /groups/:id/join`

---

### `/groups/[groupId]` — 그룹 상세

**목적:** 그룹 내 활동, 그룹 리더 진입

```
┌─────────────┐
│   groups    │
│             │
│  id         │
│  name       │
│  description│
│  current_book_id ─────────────▶ books ──▶ chapters ──▶ /read
└──────┬──────┘
       │ 1:N
       ▼
┌──────────────────────┐
│    group_members     │──▶ users (username, avatar)
└──────────────────────┘

       │
       ▼
┌──────────────────────────────────────┐
│           reader_comments            │
│  (group_id = 해당 그룹, 최근 활동)  │
│                                      │
│  user_id ───▶ users                  │
│  paragraph_id ───▶ paragraphs        │
│                  ───▶ chapters       │
│                  ───▶ books (title)  │
└──────────────────────────────────────┘
```

**API 요청:**
- `GET /groups/:id`
- `GET /groups/:id/activity`

---

### `/profile` — 내 프로필

**목적:** 내 정보, 활동 요약

```
┌───────────────────────┐
│         users         │
│                       │
│  id                   │
│  username             │
│  email                │
│  avatar_url           │
│  bio                  │
└──────────┬────────────┘
           │
     ┌─────┼─────────────────────────────┐
     │     │                             │
     ▼     ▼                             ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  sentences   │  │   follows    │  │  bookshelf   │
│  (내가 공유) │  │              │  │   _entries   │
│              │  │ follower_id  │  │              │
│  user_id     │  │ following_id │  │  user_id     │
└──────────────┘  └──────────────┘  └──────────────┘
```

**API 요청:**
- `GET /users/me`
- `GET /users/me/sentences`
- `GET /users/me/stats`

---

### `/login` / `/signup` — 인증

```
┌──────────────────────────────────────────┐
│                  users                   │
│                                          │
│  id (PK, uuid)                          │
│  username    UNIQUE                      │
│  email       UNIQUE                      │
│  password_hash                           │
│  avatar_url                              │
│  bio                                     │
│  created_at                              │
└──────────────────────────────────────────┘

  [인증 흐름]

  signup → INSERT users → JWT 발급
  login  → SELECT users WHERE email = ? → 비교 → JWT 발급
  logout → 클라이언트 토큰 삭제 (stateless)
```

---

## 3. 관계 요약표

| 관계 | 종류 | 설명 |
|------|------|------|
| users → sentences | 1:N | 사용자가 문장 업로드 |
| users → sentence_comments | 1:N | 사용자가 댓글 작성 |
| users → reader_comments | 1:N | 사용자가 단락 댓글 작성 |
| users → likes | 1:N | 사용자가 좋아요 (polymorphic) |
| users → saves | 1:N | 사용자가 문장 저장 |
| users → follows | N:M (self) | 사용자 간 팔로우 |
| users → group_members | N:M | 사용자-그룹 다대다 |
| users → bookshelf_entries | 1:N | 사용자-책 상태 관리 |
| books → chapters | 1:N | 책 → 챕터 |
| chapters → paragraphs | 1:N | 챕터 → 단락 |
| paragraphs → reader_comments | 1:N | 단락 → 댓글 |
| sentences → sentence_comments | 1:N | 문장 → 댓글 |
| books → sentences | 1:N (optional) | 책 → 공유된 문장 |
| groups → group_members | 1:N | 그룹 → 멤버 |
| groups → reader_comments | 1:N | 그룹 컨텍스트 댓글 |

---

## 4. 인덱스 권장

```sql
-- 피드 성능
CREATE INDEX idx_sentences_created_at ON sentences(created_at DESC);
CREATE INDEX idx_sentences_likes ON sentences(likes_count DESC);
CREATE INDEX idx_sentences_book_id ON sentences(book_id);

-- 댓글 조회
CREATE INDEX idx_sentence_comments_sentence_id ON sentence_comments(sentence_id);
CREATE INDEX idx_reader_comments_paragraph_id ON reader_comments(paragraph_id);
CREATE INDEX idx_reader_comments_group_id ON reader_comments(group_id);

-- 좋아요/저장 (중복 방지 + 빠른 조회)
CREATE UNIQUE INDEX idx_likes_unique ON likes(user_id, target_type, target_id);
CREATE UNIQUE INDEX idx_saves_unique ON saves(user_id, sentence_id);

-- 팔로우
CREATE UNIQUE INDEX idx_follows_unique ON follows(follower_id, following_id);

-- 책장
CREATE UNIQUE INDEX idx_bookshelf_unique ON bookshelf_entries(user_id, book_id);
```
