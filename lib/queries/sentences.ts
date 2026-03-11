import { supabase } from "@/lib/supabase"

export interface SentenceItem {
  id: string
  text: string
  bookTitle: string
  authorName: string
  likesCount: number
  savesCount: number
  isMine: boolean
  timeAgo: string
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export async function getMyWrittenSentences(): Promise<SentenceItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("sentences")
    .select("id, text, book_title, author_name, likes_count, saves_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (data ?? []).map((s) => ({
    id: s.id,
    text: s.text,
    bookTitle: s.book_title,
    authorName: s.author_name,
    likesCount: s.likes_count,
    savesCount: s.saves_count,
    isMine: true,
    timeAgo: formatTimeAgo(s.created_at),
  }))
}

export async function getMySavedSentences(): Promise<SentenceItem[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("saves")
    .select(`
      created_at,
      sentences(id, text, book_title, author_name, likes_count, saves_count, user_id)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (data ?? []).flatMap((row) => {
    const s = Array.isArray(row.sentences) ? row.sentences[0] : row.sentences
    if (!s) return []
    return [{
      id: s.id,
      text: s.text,
      bookTitle: s.book_title,
      authorName: s.author_name,
      likesCount: s.likes_count,
      savesCount: s.saves_count,
      isMine: s.user_id === user.id,
      timeAgo: formatTimeAgo(row.created_at),
    }]
  })
}

export async function saveSentence({
  bookId,
  bookTitle,
  authorName,
  text,
}: {
  bookId: string | null
  bookTitle: string
  authorName: string
  text: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요합니다")

  const { error } = await supabase.from("sentences").insert({
    user_id: user.id,
    book_id: bookId ?? null,
    book_title: bookTitle,
    author_name: authorName,
    text,
  })

  if (error) throw error
}
