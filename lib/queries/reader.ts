import { supabase } from "@/lib/supabase"
import type { ChapterContentData, MyAnchorData, ReaderCommentData } from "@/lib/types/reader"

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export async function getSentenceComments(
  paragraphId: string,
  quote: string,
  groupId?: string
): Promise<ReaderCommentData[]> {
  let query = supabase
    .from("reader_comments")
    .select("id, text, created_at, visibility, users(username)")
    .eq("paragraph_id", paragraphId)
    .eq("quote", quote)
    .order("created_at")

  if (groupId) {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? ""
    query = query.or(
      `and(visibility.eq.group,group_id.eq.${groupId}),and(visibility.eq.memo,user_id.eq.${userId})`
    )
  } else {
    query = query.eq("visibility", "public")
  }

  const { data } = await query

  return (data ?? []).map((c) => {
    const u = Array.isArray(c.users) ? c.users[0] : c.users
    return {
      id: c.id,
      user: (u as { username: string } | null)?.username ?? "unknown",
      text: c.text,
      timeAgo: formatTimeAgo(c.created_at),
    }
  })
}

export async function saveReaderComment({
  paragraphId,
  quote,
  text,
  visibility,
  groupId,
}: {
  paragraphId: string
  quote: string
  text: string
  visibility: "public" | "memo" | "group"
  groupId?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요합니다")

  const { error } = await supabase.from("reader_comments").insert({
    paragraph_id: paragraphId,
    user_id: user.id,
    quote,
    text,
    visibility,
    group_id: groupId ?? null,
  })

  if (error) throw error
}

export async function getMyAnchors(): Promise<MyAnchorData[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("reader_comments")
    .select(`
      id, quote, text, visibility, created_at,
      paragraphs(
        chapters(
          number,
          books(id, title, author)
        )
      )
    `)
    .eq("user_id", user.id)
    .in("visibility", ["public", "memo"])
    .not("quote", "is", null)
    .order("created_at", { ascending: false })

  return (data ?? []).map((c) => {
    const para = Array.isArray(c.paragraphs) ? c.paragraphs[0] : c.paragraphs
    const ch = para ? (Array.isArray(para.chapters) ? para.chapters[0] : para.chapters) : null
    const book = ch ? (Array.isArray(ch.books) ? ch.books[0] : ch.books) : null
    return {
      id: c.id,
      quote: c.quote ?? "",
      text: c.text,
      visibility: c.visibility as "public" | "memo" | "group",
      bookId: book?.id ?? "",
      bookTitle: book?.title ?? "",
      bookAuthor: book?.author ?? "",
      chapterNumber: ch?.number ?? 0,
      timeAgo: formatTimeAgo(c.created_at),
    }
  })
}

export async function getChapterWithParagraphs(
  bookId: string,
  chapterNum: number
): Promise<ChapterContentData | null> {
  // Get chapter
  const { data: chapter, error: chErr } = await supabase
    .from("chapters")
    .select("id, number, title, books(id, title, author)")
    .eq("book_id", bookId)
    .eq("number", chapterNum)
    .single()
  if (chErr || !chapter) return null

  const book = Array.isArray(chapter.books) ? chapter.books[0] : chapter.books

  // Get total chapters count
  const { count: totalChapters } = await supabase
    .from("chapters")
    .select("id", { count: "exact", head: true })
    .eq("book_id", bookId)

  // Get paragraphs
  const { data: paragraphs } = await supabase
    .from("paragraphs")
    .select("id, order, text")
    .eq("chapter_id", chapter.id)
    .order("order")

  return {
    chapterId: chapter.id,
    bookId,
    bookTitle: book?.title ?? "",
    bookAuthor: book?.author ?? "",
    chapterNumber: chapter.number,
    chapterTitle: chapter.title,
    totalChapters: totalChapters ?? 0,
    paragraphs: (paragraphs ?? []).map((p) => ({
      id: p.id,
      order: p.order,
      text: p.text,
      comments: [],
    })),
  }
}

export async function getChapterComments(
  chapterId: string,
  groupId?: string
): Promise<ReaderCommentData[]> {
  let query = supabase
    .from("chapter_comments")
    .select("id, text, created_at, visibility, users(username)")
    .eq("chapter_id", chapterId)
    .order("created_at")

  if (groupId) {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id ?? ""
    query = query.or(
      `visibility.eq.public,and(visibility.eq.group,group_id.eq.${groupId}),and(visibility.eq.memo,user_id.eq.${userId})`
    )
  } else {
    query = query.eq("visibility", "public")
  }

  const { data } = await query

  return (data ?? []).map((c) => {
    const u = Array.isArray(c.users) ? c.users[0] : c.users
    return {
      id: c.id,
      user: (u as { username: string } | null)?.username ?? "unknown",
      text: c.text,
      timeAgo: formatTimeAgo(c.created_at),
    }
  })
}

export async function saveChapterComment({
  chapterId,
  text,
  visibility,
  groupId,
}: {
  chapterId: string
  text: string
  visibility: "public" | "memo" | "group"
  groupId?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("로그인이 필요합니다")

  const { error } = await supabase.from("chapter_comments").insert({
    chapter_id: chapterId,
    user_id: user.id,
    text,
    visibility,
    group_id: groupId ?? null,
  })

  if (error) throw error
}
