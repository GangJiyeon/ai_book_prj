-- migration_v11: sentences 테이블에 my_thought 컬럼 추가
ALTER TABLE sentences
  ADD COLUMN IF NOT EXISTS my_thought TEXT;
