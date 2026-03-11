"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { supabase } from "@/lib/supabase"

export function useRequireAuth() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null | undefined>(undefined) // undefined = 아직 로딩

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null)
    })
  }, [])

  /** 로그인 필요한 액션에 감싸서 사용. 미로그인 시 /login 으로 이동 */
  const requireAuth = useCallback(
    <T>(fn: () => T): T | undefined => {
      if (userId === undefined) return // 아직 로딩 중
      if (!userId) {
        router.push("/login")
        return
      }
      return fn()
    },
    [userId, router]
  )

  /** 페이지 진입 자체를 막을 때 사용 (useEffect 안에서 호출) */
  const redirectIfNotAuth = useCallback(() => {
    if (userId === null) {
      router.push("/login")
    }
  }, [userId, router])

  return { userId, requireAuth, redirectIfNotAuth }
}
