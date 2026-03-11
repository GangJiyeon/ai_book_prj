# booki — Information Architecture

> 최종 업데이트: 2026-03-10
> 서비스: 문장 기반 소셜 리딩 플랫폼

---

## 1. 서비스 개요

**booki**는 문장을 먼저 발견하고, 그 문장을 중심으로 토론이 형성되며, 이후 책 전체로 관심이 확장되는 **sentence-first 소셜 리딩 플랫폼**이다.

```
문장 발견 → 댓글/토론 → 공감/저장 → 책 관심 형성 → 독서 확장
```

---

## 2. 사이트맵

```
booki
├── / (Home — 문장 피드)
│
├── /sentences
│   ├── /new             (문장 등록)
│   └── /[id]            (문장 상세 + 댓글)
│
├── /books               (책 탐색)
│   └── /[id]            (책 상세)
│       └── /read/[id]/[chapter]   (퍼블릭 도메인 리더)
│
├── /saved               (저장한 문장)
│
├── /bookshelf           (내 책장)
│
├── /groups              (독서 그룹 목록)
│   └── /[groupId]       (그룹 상세)
│
├── /profile             (내 프로필)
│
├── /settings            (설정)
│
├── /login
└── /signup
```

---

## 3. 페이지별 상세 구성

### 3-1. `/` — 홈 (문장 피드)

**목적:** 서비스의 핵심 진입점. 다른 사용자들이 공유한 문장을 탐색한다.

**주요 UI 요소:**
- 정렬 탭: `Trending` / `Newest` / `Most Commented`
- 문장 카드 (세로 스크롤 피드)
  - 문장 본문 (serif, 대형 텍스트)
  - 책 제목 / 저자
  - 업로드한 사용자 / 업로드 시간
  - Best Comment 미리보기 1개
  - 좋아요 수 / 댓글 수 / 저장 버튼
- 카드 클릭 → `/sentences/[id]` 이동

**연결 흐름:**
```
/ → /sentences/[id] (카드 클릭)
  → /sentences/new (Share 버튼)
```

---

### 3-2. `/sentences/new` — 문장 등록

**목적:** 사용자가 직접 읽은 문장을 공유한다.

**주요 UI 요소:**
- 책 제목 입력
- 저자 입력
- 문장 본문 입력 (최대 200자, 실시간 카운터)
- 제출 → 1.5초 딜레이 → 피드(`/`)로 이동

**제약:**
- 200자 초과 불가
- 20자 미만 시 카운터 빨간색 경고

---

### 3-3. `/sentences/[id]` — 문장 상세 + 댓글

**목적:** 문장 하나를 중심으로 댓글 토론이 이루어진다.

**주요 UI 요소:**
- 문장 본문 전체 표시
- 책 제목 / 저자
- 좋아요 수 / 저장 수 + 토글
- 댓글 목록
  - 사용자명 / 작성 시간
  - 댓글 좋아요 버튼
- 댓글 작성창 (엔터 또는 버튼 제출)

**연결 흐름:**
```
/sentences/[id] → /books/[id] (책 상세로 — 현재 미연결)
               ← / (뒤로 가기)
```

---

### 3-4. `/books` — 책 탐색

**목적:** 플랫폼에 등록된 책들을 탐색하고 발견한다.

**주요 UI 요소:**
- 검색 바 (제목/저자/태그)
- 정렬 드롭다운: `Trending` / `New` / `Most Commented` / `Most Paused`
- 장르 필터 드로어
  - Literary / Mystery / Healing / Quiet / Speculative / Memoir / Philosophy / Romance / Poetry / Thriller
- 책 카드 그리드 (1 → 2 → 3 columns, 반응형)
  - 커버 이미지 (Gutenberg 또는 커버 그라디언트 폴백)
  - 제목 / 저자 / 태그
  - 좋아요 / 댓글 수 / 일시정지(anchor) 수
  - 교환 가능 여부 뱃지
  - Pause Heat Map (10구간 밀도 시각화)
  - 발췌문 미리보기 버튼
- 트렌딩 패널 (사이드바 — 데스크톱)
  - 인기 발췌 문장(pause) 5개

---

### 3-5. `/books/[id]` — 책 상세

**목적:** 특정 책에 대한 상세 정보와 리더 진입점을 제공한다.

**주요 UI 요소:**
- 책 헤더 (제목, 저자, 설명, 통계)
- Popular Anchors (가장 많이 멈춘 문장 목록)
- Chapters List (챕터 목록 → 리더로 연결)

**연결 흐름:**
```
/books/[id] → /read/[id]/[chapter] (챕터 클릭)
```

---

### 3-6. `/read/[id]/[chapter]` — 퍼블릭 도메인 리더

**목적:** 퍼블릭 도메인 책을 단락 단위 토론과 함께 읽는다.

**주요 UI 요소:**
- 챕터 본문 (단락 단위, 문장 단위 클릭)
- 문장 클릭 → 바텀시트 (`SentencePanel`)
  - 해당 문장의 댓글 목록 (Supabase `reader_comments`)
  - 댓글 작성창 + Scope 선택
- 챕터 전체 토론 섹션 (`ChapterDiscussion`)
  - 챕터 단위 댓글 목록 (Supabase `chapter_comments`)
  - 댓글 작성 + 저장 후 자동 갱신
- 이전/다음 챕터 내비게이션
- ScopeSelector: `public` / `memo` / `group` 범위 선택
  - 그룹 모드 시 `groupId` URL 파라미터로 컨텍스트 전달

**읽기 컨텍스트 (ReadingContext):**
```
mode: "solo" | "group"
groupId?: string
groupName?: string
```

---

### 3-7. `/saved` — 저장한 문장

**목적:** 피드에서 저장한 문장들을 모아서 본다.

**주요 UI 요소:**
- 저장한 문장 카드 리스트
- 책 제목 / 저자
- 댓글 보러 가기 링크 → `/sentences/[id]`
- 저장 해제 버튼

---

### 3-8. `/bookshelf` — 내 책장

**목적:** 읽고 있거나 읽은 책을 카테고리별로 관리한다.

**주요 UI 요소:**
- 탭: `Bookshelf` / `Anchors`
- Bookshelf 탭
  - 카테고리별 가로 스크롤 책장: Currently Reading / Paused / Finished / Commented
  - 책 스파인 형태 카드
- Anchors 탭
  - 저장된 anchor(멈춤 문장) 카드 목록
  - 관련 책/문장 페이지 링크

---

### 3-9. `/groups` — 독서 그룹 목록

**목적:** 함께 책을 읽는 그룹을 탐색하고 참여한다.

**주요 UI 요소:**
- 그룹 카드 목록
  - 그룹명 / 설명 / 멤버 수
  - 현재 읽고 있는 책
- 그룹 클릭 → `/groups/[groupId]`

---

### 3-10. `/groups/[groupId]` — 그룹 상세

**목적:** 그룹 내에서 같은 책을 함께 읽고 토론한다.

**주요 UI 요소:**
- 그룹 정보 (이름, 멤버 수, 현재 책)
- 그룹 리더 진입 → `/read/[id]/[chapter]?groupId=[groupId]`

---

### 3-11. `/profile` — 내 프로필

**목적:** 내 계정 정보를 확인하고 관리한다.

**주요 UI 요소:**
- 사용자명 표시
- 설정 페이지 링크
- 로그아웃 버튼

---

### 3-12. `/settings` — 설정

**목적:** 계정 및 앱 환경 설정.

**주요 UI 요소:**
- 계정 정보 관리 (예정)
- 알림 설정 (예정)
- 테마 설정 (Navbar에서 관리 중)

---

### 3-13. `/login` / `/signup` — 인증

**주요 UI 요소 (Login):**
- 이메일 / 비밀번호 입력
- Remember Me 체크박스
- 비밀번호 찾기 모달
- OAuth 버튼 (Google / GitHub — UI only)
- 회원가입 링크

**주요 UI 요소 (Signup):**
- 이메일 / 비밀번호 / 비밀번호 확인 입력
- 이용약관 동의
- 로그인 링크

---

## 4. 내비게이션 구조

### 상단 Navbar (전체 페이지 공통)
```
[booki 로고]  Home  Books  Groups  Bookshelf  |  [Share]  [테마토글]  [검색]  [로그인/아바타]
```

- 데스크톱: 전체 nav 링크 + Share 버튼 + 우측 액션
- 모바일: 로고 + 테마 토글 + 검색 + 아바타만 노출

### 하단 BottomNav (모바일 전용, `md:hidden`)
```
[Home]  [Books]  [Share●]  [Bookshelf]  [Profile]
```
- Share 버튼은 강조 스타일 (accent circle)
- Safe area inset padding 지원 (노치 대응)

### 액티브 상태 판단
- `/` 정확히 일치 → Home 활성
- 나머지는 `pathname.startsWith(href)` 로 판단

---

## 5. 데이터 모델

### 핵심 엔티티 관계

```
User
 ├── 업로드한 Sentence (1:N)
 ├── 작성한 Comment (1:N)
 ├── Like (N:M — Sentence, Comment)
 ├── Save (N:M — Sentence)
 ├── Follow (N:M — User)
 ├── 가입한 Group (N:M)
 └── Bookshelf Entry (1:N — Book + status)

Book
 ├── Chapter (1:N)
 │    └── Paragraph (1:N)
 │         └── ReaderComment (1:N)
 ├── Sentence (1:N — 해당 책에서 발췌된 문장)
 └── Anchor (1:N — 많이 멈춘 단락)

Sentence
 └── SentenceComment (1:N)

Group
 ├── GroupMember (1:N — User)
 └── 현재 읽는 Book (N:1)
```

### 테이블 정의 (백엔드 설계 기준)

| 테이블 | 주요 컬럼 | 마이그레이션 |
|--------|-----------|-------------|
| `users` | id, username, email, avatar_url, bio, created_at | v1 |
| `books` | id, title, author, cover_url, gutenberg_id, tags[], description | v1 |
| `chapters` | id, book_id, number, title | v1 |
| `paragraphs` | id, chapter_id, order, text | v1 |
| `sentences` | id, text (max 200), book_id, user_id, created_at | v1 |
| `sentence_comments` | id, sentence_id, user_id, text, created_at | v1 |
| `reader_comments` | id, paragraph_id, user_id, group_id?, quote, text, visibility, likes_count, created_at | v1, v3, v5 |
| `chapter_comments` | id, chapter_id, user_id, group_id?, text, visibility, created_at | v6 |
| `likes` | id, user_id, target_type (sentence/sentence_comment/reader_comment), target_id, created_at | v1 |
| `saves` | id, user_id, sentence_id, created_at | v1 |
| `follows` | id, follower_id, following_id, created_at | v1 |
| `groups` | id, name, description, creator_id, current_book_id, created_at | v1 |
| `group_members` | id, group_id, user_id, role (admin/member) | v1 |
| `bookshelf_entries` | id, user_id, book_id, status (reading/paused/finished/commented), progress | v1 |

---

## 6. 핵심 사용자 흐름

### Flow A. 문장 탐색 → 댓글 참여
```
/ (피드 탐색)
  → 카드 클릭
  → /sentences/[id] (댓글 읽기)
  → 댓글 작성 or 좋아요
  → 저장 버튼
  → /saved (저장 목록 확인)
```

### Flow B. 문장 공유
```
Navbar "Share" 버튼
  → /sentences/new
  → 책 제목 / 저자 / 문장 입력
  → 제출
  → / (피드 복귀 — 내 문장 상단 노출 예정)
```

### Flow C. 책 탐색 → 독서
```
/books (탐색)
  → 발췌문 미리보기 모달
  → /books/[id] (책 상세)
  → /read/[id]/[chapter] (리더)
  → 단락 클릭 → 댓글 참여
  → (예정) 문장 → 피드에 공유
```

### Flow D. 그룹 독서
```
/groups (그룹 탐색)
  → /groups/[groupId] (그룹 진입)
  → /read/[id]/[chapter]?groupId=[id] (그룹 컨텍스트 리더)
  → 단락별 그룹 전용 댓글 작성
```

---

## 7. 컴포넌트 맵

### 레이아웃 / 내비게이션
| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `Navbar` | 모든 페이지 상단 | 상단 내비게이션, 테마 토글, 인증 상태 |
| `BottomNav` | 모바일 하단 | 모바일 탭 내비게이션 |
| `StarField` | 배경 레이어 | 별 필드 애니메이션 배경 |

### 인증
| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `LoginForm` | `/login` | 로그인 폼 + 비밀번호 찾기 모달 |
| `SignupForm` | `/signup` | 회원가입 폼 |

### 피드 / 문장
| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `ReaderComponents` | `/read` | 단락 렌더링, 댓글 패널/바텀시트 |
| `ScopeSelector` | `/read` | 솔로/그룹 읽기 모드 전환 |

### 책 탐색
| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `DiscoveryBookCard` | `/books` | 책 카드 (커버, 통계, Pause Heat Map) |
| `ExcerptModal` | `/books` | 발췌문 미리보기 모달 |
| `TrendingPanel` | `/books` | 트렌딩 pause 사이드바 |
| `FilterDrawer` | `/books` | 장르 필터 드로어 |
| `BookDetailHeader` | `/books/[id]` | 책 상세 헤더 |
| `PopularAnchors` | `/books/[id]` | 인기 anchor 목록 |
| `ChaptersList` | `/books/[id]` | 챕터 목록 |

### 책장
| 컴포넌트 | 위치 | 역할 |
|----------|------|------|
| `ShelfRow` | `/bookshelf` | 카테고리별 가로 스크롤 책장 |
| `BookSpine` | `/bookshelf` | 책 스파인 카드 |
| `AnchorsView` | `/bookshelf` | Anchor 카드 목록 |
| `HeroHeader` | (공통) | 섹션 헤더 |

---

## 8. 기술 스택 요약

| 구분 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Variables |
| UI Library | shadcn/ui (Radix-based) |
| Icons | Lucide React |
| Fonts | Lora (serif) + Inter (sans) |
| Analytics | Vercel Analytics |
| 인증 | Supabase Auth |
| DB | Supabase (PostgreSQL) + RLS |
| 데이터 쿼리 | `lib/queries/` (supabase-js) |
| 배포 | Vercel |

---

## 9. 테마 / 디자인 시스템

### 색상 토큰

| 토큰 | 라이트 | 다크 |
|------|--------|------|
| `--background` | #F4F1EA | #121212 |
| `--card` | #FFFFFF | #1E1E1E |
| `--secondary` (Comment Card) | #FAFAFA | #262626 |
| `--foreground` | #1F1F1F | #E6E6E6 |
| `--muted-foreground` | #6B6B6B | #A0A0A0 |
| `--border` | #E5E5E5 | #333333 |
| `--moonlight` (Accent) | #3A7AFE | #4C8DFF |
| `--highlight` | #FFB800 | #FFC84A |
| `--sentences-highlight` | #FFF1C2 | #5A4A1A |
| `--hotpink` | #db2777 | #f472b6 |

### 테마 전환
- Navbar 버튼 → `document.documentElement.classList.toggle("dark")`
- `localStorage("theme")` 영속화
- `layout.tsx` 인라인 스크립트로 첫 렌더 flash 방지

---

## 10. 구현 상태 요약

| 기능 | 상태 |
|------|------|
| 문장 피드 (좋아요, 저장) | ✅ DB 연동 완성 (낙관적 업데이트 + 롤백) |
| 문장 상세 + 댓글 | ✅ UI 완성 / DB 연동 중 |
| 문장 업로드 (`/sentences/new`) | ✅ Supabase 연동 완성 |
| 저장한 문장 목록 (`/saved`) | ✅ DB 연동 완성 (bookshelf + anchors + 문장 저장/해제) |
| 책 탐색 + 필터 (`/books`) | ✅ 검색·장르필터·정렬·trendingPauses 모두 DB 연동 완성 |
| 책 상세 (`/books/[id]`) | ✅ Supabase 연동 완성 |
| 퍼블릭 도메인 리더 (`/read`) | ✅ 문장 댓글 + 챕터 토론 DB 연동 완성 |
| 내 책장 (`/bookshelf`) | ✅ DB 연동 완성 (getMyBookshelf + getMyAnchors + 필터) |
| 독서 그룹 (`/groups`) | ✅ DB 연동 완성 (목록·현재 책 표시 / 상세·Join 버튼 / 그룹 생성) |
| 프로필 (`/profile`) | ✅ Supabase Auth 연동 |
| 설정 (`/settings`) | ✅ username/bio 수정 + 비밀번호 변경 DB 연동 |
| 인증 (로그인/회원가입) | ✅ Supabase Auth 연동 완성 |
| 테마 토글 (다크/라이트) | ✅ 완성 |
| 모바일 반응형 | ✅ 완성 |
| **Supabase DB 마이그레이션** | ✅ v1~v7 완성 |
