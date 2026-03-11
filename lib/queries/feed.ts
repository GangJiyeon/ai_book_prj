import { supabase } from "@/lib/supabase"

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "방금 전"
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export type FeedComment = {
  type: "comment"
  id: string
  quote: string
  text: string
  username: string
  bookTitle: string
  bookAuthor: string
  bookId: string
  chapterNumber: number
  likesCount: number
  timeAgo: string
}

export type FeedSentence = {
  type: "sentence"
  id: string
  text: string
  bookTitle: string
  authorName: string
  username: string
  likesCount: number
  savesCount: number
  timeAgo: string
}

export type FeedItem = FeedComment | FeedSentence

const COMMENTS_PER_BATCH = 2
const SENTENCES_PER_BATCH = 3

export async function fetchFeedBatch(
  commentOffset: number,
  sentenceOffset: number
): Promise<{ comments: FeedComment[]; sentences: FeedSentence[]; hasMore: boolean }> {
  const [commentsRes, sentencesRes] = await Promise.all([
    supabase
      .from("reader_comments")
      .select(`
        id, quote, text, likes_count, created_at,
        users(username),
        paragraphs(
          chapters(
            number,
            books(id, title, author)
          )
        )
      `)
      .eq("visibility", "public")
      .not("quote", "is", null)
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .range(commentOffset, commentOffset + COMMENTS_PER_BATCH - 1),

    supabase
      .from("sentences")
      .select(`
        id, text, book_title, author_name, likes_count, saves_count, created_at,
        users(username)
      `)
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .range(sentenceOffset, sentenceOffset + SENTENCES_PER_BATCH - 1),
  ])

  const comments: FeedComment[] = (commentsRes.data ?? []).map((c) => {
    const u = Array.isArray(c.users) ? c.users[0] : c.users
    const para = Array.isArray(c.paragraphs) ? c.paragraphs[0] : c.paragraphs
    const ch = para ? (Array.isArray(para.chapters) ? para.chapters[0] : para.chapters) : null
    const book = ch ? (Array.isArray(ch.books) ? ch.books[0] : ch.books) : null
    return {
      type: "comment",
      id: c.id,
      quote: c.quote ?? "",
      text: c.text,
      username: (u as { username: string } | null)?.username ?? "unknown",
      bookTitle: book?.title ?? "",
      bookAuthor: book?.author ?? "",
      bookId: book?.id ?? "",
      chapterNumber: ch?.number ?? 0,
      likesCount: c.likes_count ?? 0,
      timeAgo: formatTimeAgo(c.created_at),
    }
  })

  const sentences: FeedSentence[] = (sentencesRes.data ?? []).map((s) => {
    const u = Array.isArray(s.users) ? s.users[0] : s.users
    return {
      type: "sentence",
      id: s.id,
      text: s.text,
      bookTitle: s.book_title,
      authorName: s.author_name,
      username: (u as { username: string } | null)?.username ?? "unknown",
      likesCount: s.likes_count,
      savesCount: s.saves_count,
      timeAgo: formatTimeAgo(s.created_at),
    }
  })

  const hasMore = comments.length === COMMENTS_PER_BATCH || sentences.length === SENTENCES_PER_BATCH

  return { comments, sentences, hasMore }
}

/* ─── Like / Save helpers ─── */

type LikeTargetType = "sentence" | "reader_comment"

export async function getMyFeedLikes(
  sentenceIds: string[],
  commentIds: string[]
): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (sentenceIds.length === 0 && commentIds.length === 0)) return new Set()

  const allIds = [...sentenceIds, ...commentIds]
  const { data } = await supabase
    .from("likes")
    .select("target_id")
    .eq("user_id", user.id)
    .in("target_id", allIds)

  return new Set((data ?? []).map((r) => r.target_id))
}

export async function getMyFeedSaves(sentenceIds: string[]): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || sentenceIds.length === 0) return new Set()

  const { data } = await supabase
    .from("saves")
    .select("sentence_id")
    .eq("user_id", user.id)
    .in("sentence_id", sentenceIds)

  return new Set((data ?? []).map((r) => r.sentence_id))
}

export async function toggleFeedLike(
  targetType: LikeTargetType,
  targetId: string,
  isCurrentlyLiked: boolean
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (isCurrentlyLiked) {
    await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
  } else {
    await supabase
      .from("likes")
      .insert({ user_id: user.id, target_type: targetType, target_id: targetId })
  }
}

export async function toggleFeedSave(
  sentenceId: string,
  isCurrentlySaved: boolean
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (isCurrentlySaved) {
    await supabase
      .from("saves")
      .delete()
      .eq("user_id", user.id)
      .eq("sentence_id", sentenceId)
  } else {
    await supabase
      .from("saves")
      .insert({ user_id: user.id, sentence_id: sentenceId })
  }
}
