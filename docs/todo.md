# booki — 작업 TODO

> 최종 업데이트: 2026-03-10
> 라우터별 점검 결과 기반

---

## 진행 방식
- 라우터 하나씩 순서대로 진행
- 완료 시 `[x]` 체크 + IA.md 구현 상태 업데이트

---

## 1. `/books` — 책 탐색 ✅ 완료

- [x] 검색 기능 DB 연동 (title/author ilike, 350ms debounce)
- [x] 장르 필터 (`FilterDrawer` onApply 콜백 → tags overlaps 쿼리)
- [x] 정렬 드롭다운 → 클라이언트 사이드 정렬 (통계 컬럼이 모두 0이라 DB 정렬 의미 없음)
- [x] 활성 필터 수 배지 UI 추가
- [x] 검색/필터 결과 없음 상태 UI 추가
- [x] `trendingPauses` mock 데이터 → DB 연동 (`trending_pauses` 뷰 생성 — migration_v7.sql)

---

## 2. `/` — 홈 피드 ✅ 완료

- [x] Like 버튼 → `likes` 테이블 INSERT/DELETE 연동 (낙관적 업데이트 + 롤백)
- [x] Save 버튼 → `saves` 테이블 INSERT/DELETE 연동 (낙관적 업데이트 + 롤백)
- [x] 좋아요/저장 초기 상태 → 배치 로드 후 현재 유저 기준 DB에서 로드

---

## 3. `/saved` — 저장한 문장 ✅ 완료

- [x] `shelfCategories` → `lib/types/bookshelf.ts`로 이동 (static UI config, DB 불필요)
- [x] 저장 해제 버튼 → `saves` 테이블 DELETE 연동 (낙관적 업데이트 + 롤백)

---

## 4. `/profile` + `/settings` ✅ 완료

- [x] `/settings` 페이지 Supabase 연동
  - [x] username, bio 로드 (`users` 테이블) + Save 버튼
  - [x] 이메일 표시 (read-only, Supabase Auth에서 로드)
  - [x] 비밀번호 변경 (`supabase.auth.updateUser`)
  - [x] Log out 버튼 연동

---

## 5. IA.md 구현 상태 동기화

- [x] 각 라우터 작업 완료 후 `docs/IA.md` 섹션 10 업데이트

---

## 완료된 항목

- [x] `/sentences/new` — Supabase 연동 완성
- [x] `/book/[id]` — Supabase 연동 완성 (Server Component)
- [x] `/books` — 책 목록 DB 연동 (검색/필터/정렬 제외)
- [x] `/groups` — 그룹 목록/생성 DB 연동
- [x] `/groups/[groupId]` — 그룹 상세 DB 연동
- [x] `/profile` — Supabase Auth 연동 (로그인/로그아웃)
- [x] `/login` / `/signup` — Supabase Auth 연동
- [x] `/read/[id]/[chapter]` — 문장 댓글 + 챕터 토론 DB 연동
- [x] `/saved` — bookshelf + anchors + 내가 쓴/저장한 문장 DB 연동
- [x] Supabase 마이그레이션 v1~v6 완성
