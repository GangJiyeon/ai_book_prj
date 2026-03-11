-- ============================================================
-- booki — Supabase Migration v8
-- 변경사항:
--   1. groups 테이블에 is_private, join_password 컬럼 추가
--   2. group_members 테이블에 status (pending/approved) 컬럼 추가
--   3. SECURITY DEFINER 함수 (join_group, admin_add_member, approve, reject)
--   4. groups UPDATE 정책: admin도 업데이트 가능하도록 변경
-- 실행: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- 1. groups 테이블 수정
-- ------------------------------------------------------------

ALTER TABLE public.groups
  ADD COLUMN is_private    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN join_password TEXT;    -- NULL = 요청 후 승인 / 값 있음 = 비밀번호 입력


-- ------------------------------------------------------------
-- 2. group_members 에 status 추가
-- ------------------------------------------------------------

CREATE TYPE public.member_status AS ENUM ('pending', 'approved');

ALTER TABLE public.group_members
  ADD COLUMN status public.member_status NOT NULL DEFAULT 'approved';


-- ------------------------------------------------------------
-- 3. SECURITY DEFINER 함수
-- ------------------------------------------------------------

-- 3-1. 그룹 가입
-- 반환값: 'approved' | 'pending' | 'wrong_password' | 'already_member'
CREATE OR REPLACE FUNCTION public.join_group_with_password(
  p_group_id UUID,
  p_password TEXT DEFAULT ''
) RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_is_private    BOOLEAN;
  v_join_password TEXT;
  v_already       BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = auth.uid()
  ) INTO v_already;

  IF v_already THEN
    RETURN 'already_member';
  END IF;

  SELECT is_private, join_password
  INTO v_is_private, v_join_password
  FROM public.groups WHERE id = p_group_id;

  IF NOT v_is_private THEN
    INSERT INTO public.group_members (group_id, user_id, role, status)
    VALUES (p_group_id, auth.uid(), 'member', 'approved');
    RETURN 'approved';
  END IF;

  -- 비공개 그룹
  IF v_join_password IS NOT NULL AND v_join_password <> '' THEN
    IF v_join_password = p_password THEN
      INSERT INTO public.group_members (group_id, user_id, role, status)
      VALUES (p_group_id, auth.uid(), 'member', 'approved');
      RETURN 'approved';
    ELSE
      RETURN 'wrong_password';
    END IF;
  ELSE
    -- 비밀번호 없는 비공개: 승인 대기
    INSERT INTO public.group_members (group_id, user_id, role, status)
    VALUES (p_group_id, auth.uid(), 'member', 'pending');
    RETURN 'pending';
  END IF;
END;
$$;

-- 3-2. 관리자: username으로 멤버 추가
-- 반환값: 'added' | 'already_member' | 'user_not_found' | 'not_authorized'
CREATE OR REPLACE FUNCTION public.admin_add_member(
  p_group_id UUID,
  p_username TEXT
) RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_user_id  UUID;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id
      AND user_id  = auth.uid()
      AND role     = 'admin'
      AND status   = 'approved'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RETURN 'not_authorized';
  END IF;

  SELECT id INTO v_user_id FROM public.users WHERE username = p_username;

  IF v_user_id IS NULL THEN
    RETURN 'user_not_found';
  END IF;

  INSERT INTO public.group_members (group_id, user_id, role, status)
  VALUES (p_group_id, v_user_id, 'member', 'approved')
  ON CONFLICT (group_id, user_id) DO UPDATE SET status = 'approved';

  RETURN 'added';
END;
$$;

-- 3-3. 관리자: pending 멤버 승인
CREATE OR REPLACE FUNCTION public.approve_group_member(
  p_group_id UUID,
  p_user_id  UUID
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = auth.uid() AND role = 'admin' AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.group_members
  SET status = 'approved'
  WHERE group_id = p_group_id AND user_id = p_user_id;
END;
$$;

-- 3-4. 관리자: pending 멤버 거절 (삭제)
CREATE OR REPLACE FUNCTION public.reject_group_member(
  p_group_id UUID,
  p_user_id  UUID
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = auth.uid() AND role = 'admin' AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  DELETE FROM public.group_members
  WHERE group_id = p_group_id AND user_id = p_user_id;
END;
$$;


-- ------------------------------------------------------------
-- 4. groups UPDATE 정책 수정 (admin도 업데이트 가능)
-- ------------------------------------------------------------

DROP POLICY IF EXISTS "groups: creator update" ON public.groups;

CREATE POLICY "groups: admin update"
  ON public.groups FOR UPDATE
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = public.groups.id
        AND gm.user_id  = auth.uid()
        AND gm.role     = 'admin'
        AND gm.status   = 'approved'
    )
  );


-- ------------------------------------------------------------
-- 5. 함수 실행 권한 부여
-- ------------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.join_group_with_password(UUID, TEXT)  TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_add_member(UUID, TEXT)           TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_group_member(UUID, UUID)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_group_member(UUID, UUID)        TO authenticated;
