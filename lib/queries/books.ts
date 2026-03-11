import { supabase } from "@/lib/supabase"
import type { Book } from "@/lib/types/book"

export interface TrendingPause {
  id: string
  quote: string
  bookTitle: string
  commentsCount: number
  comments: { user: string; text: string }[]
}

export interface GetBooksOptions {
  search?: string
  tags?: string[]
}

// 챕터별 댓글 수를 10개 버킷으로 정규화 → pauseHeat [0..1]
function computePauseHeat(
  chapters: { chapter_number: number; comment_count: number }[],
): number[] {
  const BUCKETS = 10
  if (chapters.length === 0) return Array(BUCKETS).fill(0)

  const maxChapter = Math.max(...chapters.map((c) => c.chapter_number))
  const buckets = Array(BUCKETS).fill(0)

  for (const { chapter_number, comment_count } of chapters) {
    const idx = Math.min(
      Math.floor(((chapter_number - 1) / maxChapter) * BUCKETS),
      BUCKETS - 1,
    )
    buckets[idx] += Number(comment_count)
  }

  const max = Math.max(...buckets)
  if (max === 0) return buckets
  return buckets.map((v) => v / max)
}

export async function searchBooksByTitle(
  query: string,
): Promise<{ id: string; title: string; author: string }[]> {
  if (!query.trim()) return []
  const { data } = await supabase
    .from("books")
    .select("id, title, author")
    .ilike("title", `%${query}%`)
    .order("title")
    .limit(20)
  return data ?? []
}

export async function getBooks(options: GetBooksOptions = {}): Promise<Book[]> {
  let query = supabase
    .from("books")
    .select("id, title, author, cover_url, tags, description, gutenberg_id")
    .order("created_at", { ascending: false })

  if (options.search?.trim()) {
    const q = options.search.trim()
    query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%`)
  }

  if (options.tags && options.tags.length > 0) {
    query = query.overlaps("tags", options.tags)
  }

  const { data, error } = await query
  if (error) throw error

  const books = data ?? []
  if (books.length === 0) return []

  const bookIds = books.map((b) => b.id)

  // 챕터별 댓글 수 일괄 조회
  const { data: chapterStats, error: statsError } = await supabase.rpc(
    "get_book_chapter_stats",
    { p_book_ids: bookIds },
  )

  if (statsError) {
    console.error("get_book_chapter_stats:", statsError)
    // 함수 실행 실패 시 mock fallback
    return books.map((row) => ({
      ...row,
      likes: 0,
      commentsCount: 0,
      pausesCount: 0,
      pauseHeat: Array(10).fill(0),
    }))
  }

  // book_id별로 챕터 데이터 그룹핑
  type ChapterRow = { book_id: string; chapter_number: number; comment_count: number }
  const heatMap = new Map<string, ChapterRow[]>()
  for (const row of (chapterStats as ChapterRow[]) ?? []) {
    if (!heatMap.has(row.book_id)) heatMap.set(row.book_id, [])
    heatMap.get(row.book_id)!.push(row)
  }

  return books.map((row) => {
    const chapters = heatMap.get(row.id) ?? []
    const commentsCount = chapters.reduce((s, c) => s + Number(c.comment_count), 0)
    // 댓글이 1개 이상 달린 챕터 수 = pauses
    const pausesCount = chapters.filter((c) => Number(c.comment_count) > 0).length

    return {
      ...row,
      likes: 0, // TODO: sentences.likes_count 집계 (별도 구현)
      commentsCount,
      pausesCount,
      pauseHeat: computePauseHeat(chapters),
    }
  })
}

export async function getTrendingPauses(): Promise<TrendingPause[]> {
  const { data, error } = await supabase
    .from("trending_pauses")
    .select("id, quote, book_title, comments_count, comments")

  if (error) {
    console.error("getTrendingPauses:", error)
    return []
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    quote: row.quote ?? "",
    bookTitle: row.book_title ?? "",
    commentsCount: Number(row.comments_count ?? 0),
    comments: (row.comments as { user: string; text: string }[] | null) ?? [],
  }))
}
