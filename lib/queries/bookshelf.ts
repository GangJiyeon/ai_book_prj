import { supabase } from "@/lib/supabase"
import type { ShelfBook, ShelfCategory } from "@/lib/types/bookshelf"

/** 책을 읽기 시작할 때 호출 — 이미 있으면 updated_at만 갱신, 없으면 reading으로 추가 */
export async function markBookAsReading(bookId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("bookshelf_entries")
    .upsert(
      { user_id: user.id, book_id: bookId, status: "reading" },
      { onConflict: "user_id,book_id", ignoreDuplicates: true }
    )
}

// 뮤트 다크 팔레트 — 형광 없이 dark/light 모드 모두 자연스러운 책등 색상
const SPINE_PALETTE: Array<{ spine: string; accent: string }> = [
  { spine: "#1e2a38", accent: "#7a9eb5" }, // deep slate blue
  { spine: "#1e2d24", accent: "#7aab8a" }, // deep forest
  { spine: "#2a1e2e", accent: "#a07ab5" }, // deep mauve
  { spine: "#2d1e1a", accent: "#b58a7a" }, // deep rust
  { spine: "#1a2a2a", accent: "#6aa0a0" }, // deep teal
  { spine: "#2a2214", accent: "#b5a06a" }, // deep amber
  { spine: "#221a2a", accent: "#8a7ab5" }, // deep indigo
  { spine: "#2a1e22", accent: "#b57a8a" }, // deep rose
  { spine: "#1e2820", accent: "#82a882" }, // deep sage
  { spine: "#26201a", accent: "#a89070" }, // deep walnut
  { spine: "#1a2230", accent: "#7090b0" }, // deep navy
  { spine: "#281e1e", accent: "#a87878" }, // deep burgundy
]

/** title 해시로 팔레트 중 하나를 선택 */
function spineColorFromTitle(title: string): { spineColor: string; spineAccent: string; textColor: string } {
  let hash = 0
  for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  const { spine, accent } = SPINE_PALETTE[hash % SPINE_PALETTE.length]
  return { spineColor: spine, spineAccent: accent, textColor: "#ddd8cc" }
}

const STATUS_MAP: Record<string, ShelfCategory> = {
  reading: "currently-reading",
  paused: "paused",
  finished: "finished",
  commented: "commented",
}

export async function getMyBookshelf(): Promise<ShelfBook[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("bookshelf_entries")
    .select(`
      book_id, status, progress,
      books(id, title, author)
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  return (data ?? []).map((entry) => {
    const book = Array.isArray(entry.books) ? entry.books[0] : entry.books
    const title = book?.title ?? ""
    const { spineColor, spineAccent, textColor } = spineColorFromTitle(title)

    return {
      id: book?.id ?? entry.book_id,
      title,
      author: book?.author ?? "",
      spineColor,
      spineAccent,
      textColor,
      category: STATUS_MAP[entry.status] ?? "currently-reading",
      pausesCount: 0,
      commentsCount: 0,
      progress: entry.progress,
    }
  })
}
