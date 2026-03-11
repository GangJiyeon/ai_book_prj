import { supabase } from "@/lib/supabase"
import type { BookDetailData, ChapterRow, AnchorRow } from "@/lib/types/book-detail"

export async function getBookById(id: string): Promise<BookDetailData | null> {
  const { data, error } = await supabase
    .from("books")
    .select("id, title, author, cover_url, description, tags")
    .eq("id", id)
    .single()
  if (error || !data) return null
  return { ...data, pausesCount: 0, commentsCount: 0 }
}

export async function getChaptersByBookId(bookId: string): Promise<ChapterRow[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("id, number, title")
    .eq("book_id", bookId)
    .order("number")
  if (error || !data) return []
  return data.map((ch) => ({
    id: ch.id,
    number: ch.number,
    title: ch.title,
    progress: 0,
    hasAnchors: false,
  }))
}

export async function getPopularAnchors(bookId: string): Promise<AnchorRow[]> {
  // Step 1: get chapter IDs
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id")
    .eq("book_id", bookId)
  if (!chapters?.length) return []

  // Step 2: get paragraph IDs
  const { data: paragraphs } = await supabase
    .from("paragraphs")
    .select("id")
    .in("chapter_id", chapters.map((c) => c.id))
  if (!paragraphs?.length) return []

  // Step 3: top sentences by comments_count
  const { data: sentences } = await supabase
    .from("book_sentences")
    .select("id, text, comments_count")
    .in("paragraph_id", paragraphs.map((p) => p.id))
    .order("comments_count", { ascending: false })
    .limit(5)

  return (sentences ?? []).map((s) => ({
    id: s.id,
    quote: s.text,
    commentsCount: s.comments_count,
    pausesCount: 0,
  }))
}
