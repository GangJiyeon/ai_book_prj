"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Heart, Bookmark, MessageCircle, Quote } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import {
  fetchFeedBatch,
  getMyFeedLikes,
  getMyFeedSaves,
  toggleFeedLike,
  toggleFeedSave,
} from "@/lib/queries/feed"
import type { FeedItem, FeedComment, FeedSentence } from "@/lib/queries/feed"
import { cn } from "@/lib/utils"
import { useRequireAuth } from "@/hooks/use-require-auth"

export default function Home() {
  const { requireAuth } = useRequireAuth()
  const [items, setItems] = useState<FeedItem[]>([])
  const [commentOffset, setCommentOffset] = useState(0)
  const [sentenceOffset, setSentenceOffset] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const sentinelRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const loadMore = useCallback(async (cOffset: number, sOffset: number) => {
    if (loading) return
    setLoading(true)
    try {
      const { comments, sentences, hasMore: more } = await fetchFeedBatch(cOffset, sOffset)

      // Interleave: comment, sentence, comment, sentence, sentence
      const batch: FeedItem[] = []
      const maxLen = Math.max(comments.length, sentences.length)
      let ci = 0, si = 0
      for (let i = 0; i < maxLen * 2; i++) {
        if (ci < comments.length && (si >= sentences.length || ci <= si / 1.5)) {
          batch.push(comments[ci++])
        } else if (si < sentences.length) {
          batch.push(sentences[si++])
        }
      }

      setItems((prev) => {
        const existingKeys = new Set(prev.map((item) => `${item.type}-${item.id}`))
        const deduped = batch.filter((item) => !existingKeys.has(`${item.type}-${item.id}`))
        return [...prev, ...deduped]
      })
      setCommentOffset(cOffset + comments.length)
      setSentenceOffset(sOffset + sentences.length)
      setHasMore(more)

      // Load initial like/save state for new batch
      const sentenceIds = sentences.map((s) => s.id)
      const commentIds = comments.map((c) => c.id)
      const [newLikes, newSaves] = await Promise.all([
        getMyFeedLikes(sentenceIds, commentIds),
        getMyFeedSaves(sentenceIds),
      ])
      if (newLikes.size > 0) setLiked((prev) => new Set([...prev, ...newLikes]))
      if (newSaves.size > 0) setSaved((prev) => new Set([...prev, ...newSaves]))
    } finally {
      setLoading(false)
    }
  }, [loading])

  // Initial load
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    loadMore(0, 0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore(commentOffset, sentenceOffset)
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, commentOffset, sentenceOffset, loadMore])

  function toggleLike(item: FeedItem) {
    requireAuth(() => {
    const isLiked = liked.has(item.id)
    // Optimistic update
    setLiked((prev) => {
      const next = new Set(prev)
      isLiked ? next.delete(item.id) : next.add(item.id)
      return next
    })
    const targetType = item.type === "sentence" ? "sentence" : "reader_comment"
    toggleFeedLike(targetType, item.id, isLiked).catch(() => {
      // Rollback on error
      setLiked((prev) => {
        const next = new Set(prev)
        isLiked ? next.add(item.id) : next.delete(item.id)
        return next
      })
    })
    }) // requireAuth
  }

  function toggleSave(id: string) {
    requireAuth(() => {
    const isSaved = saved.has(id)
    // Optimistic update
    setSaved((prev) => {
      const next = new Set(prev)
      isSaved ? next.delete(id) : next.add(id)
      return next
    })
    toggleFeedSave(id, isSaved).catch(() => {
      // Rollback on error
      setSaved((prev) => {
        const next = new Set(prev)
        isSaved ? next.add(id) : next.delete(id)
        return next
      })
    })
    }) // requireAuth
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8">
          <div className="flex flex-col gap-4">
            {items.map((item) =>
              item.type === "comment" ? (
                <CommentCard
                  key={`c-${item.id}`}
                  item={item}
                  liked={liked.has(item.id)}
                  onLike={() => toggleLike(item)}
                />
              ) : (
                <SentenceCard
                  key={`s-${item.id}`}
                  item={item}
                  liked={liked.has(item.id)}
                  saved={saved.has(item.id)}
                  onLike={() => toggleLike(item)}
                  onSave={() => toggleSave(item.id)}
                />
              )
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="flex flex-col gap-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-2xl border border-border bg-card/50"
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && items.length === 0 && (
              <div
                className="rounded-2xl border border-border bg-card p-12 text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <p className="text-muted-foreground">아직 피드에 올라온 내용이 없습니다.</p>
                <Link
                  href="/sentences/new"
                  className="mt-3 inline-block text-sm text-moonlight hover:underline"
                >
                  첫 문장을 공유해보세요
                </Link>
              </div>
            )}

            {/* No more */}
            {!hasMore && items.length > 0 && (
              <p
                className="py-8 text-center text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                모든 내용을 불러왔습니다.
              </p>
            )}

            {/* Scroll sentinel */}
            <div ref={sentinelRef} className="h-1" />
          </div>
        </main>
      </div>
    </>
  )
}

/* ─── Comment Card ─── */
function CommentCard({
  item,
  liked,
  onLike,
}: {
  item: FeedComment
  liked: boolean
  onLike: () => void
}) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Quote */}
      <Link href={`/read/${item.bookId}/${item.chapterNumber}`}>
        <blockquote className="relative mb-4 cursor-pointer">
          <Quote className="mb-1 h-3.5 w-3.5 text-moonlight/40" />
          <p
            className="pl-1 text-base italic leading-relaxed text-foreground/90 hover:text-moonlight transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {item.quote}
          </p>
        </blockquote>
      </Link>

      {/* Comment text */}
      <div className="mb-4 rounded-xl bg-secondary/40 px-4 py-3">
        <span className="text-xs font-semibold text-foreground">@{item.username} </span>
        <span className="text-xs text-muted-foreground">{item.text}</span>
      </div>

      {/* Book info + actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          <Link href={`/read/${item.bookId}/${item.chapterNumber}`} className="min-w-0 shrink">
            <span className="block truncate text-xs font-medium text-moonlight hover:underline">
              {item.bookTitle}
            </span>
          </Link>
          <span className="shrink-0 text-xs text-muted-foreground">·</span>
          <span className="min-w-0 shrink truncate text-xs text-muted-foreground">{item.bookAuthor}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[11px] text-muted-foreground">{item.timeAgo}</span>
          <button
            onClick={onLike}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors",
              liked ? "text-hotpink" : "text-muted-foreground hover:text-hotpink"
            )}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─── Sentence Card ─── */
function SentenceCard({
  item,
  liked,
  saved,
  onLike,
  onSave,
}: {
  item: FeedSentence
  liked: boolean
  saved: boolean
  onLike: () => void
  onSave: () => void
}) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/sentences/${item.id}`}>
        <blockquote
          className="mb-4 text-lg leading-relaxed text-foreground cursor-pointer hover:text-moonlight transition-colors"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          &ldquo;{item.text}&rdquo;
        </blockquote>
      </Link>

      <div className="mb-3 flex min-w-0 items-center gap-1 overflow-hidden" style={{ fontFamily: "var(--font-body)" }}>
        <span className="max-w-[40%] shrink-0 truncate text-xs font-medium text-moonlight">{item.bookTitle}</span>
        <span className="shrink-0 text-xs text-muted-foreground">·</span>
        <span className="min-w-0 shrink truncate text-xs text-muted-foreground">{item.authorName}</span>
        <span className="shrink-0 text-xs text-muted-foreground">·</span>
        <span className="shrink-0 text-xs text-muted-foreground">@{item.username}</span>
      </div>

      {item.myThought && (
        <div className="mb-4 rounded-xl bg-secondary/40 px-4 py-3" style={{ fontFamily: "var(--font-body)" }}>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.myThought}</p>
        </div>
      )}

      <div className="flex items-center justify-between" style={{ fontFamily: "var(--font-body)" }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className={cn(
              "flex items-center gap-1.5 text-sm transition-colors",
              liked ? "text-hotpink" : "text-muted-foreground hover:text-hotpink"
            )}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span>{item.likesCount + (liked ? 1 : 0)}</span>
          </button>

          <Link
            href={`/sentences/${item.id}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
          <button
            onClick={onSave}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors",
              saved ? "text-moonlight" : "text-muted-foreground hover:text-moonlight"
            )}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  )
}
