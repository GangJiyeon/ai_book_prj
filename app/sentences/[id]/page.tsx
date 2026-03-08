"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Bookmark, Send } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { getSentenceById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function SentenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const sentence = getSentenceById(id)

  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState<{ id: string; user: string; text: string; timeAgo: string; likes: number }[]>([])

  if (!sentence) {
    return (
      <>
        <StarField />
        <div className="relative z-10 min-h-screen bg-background">
          <Navbar />
          <main className="mx-auto max-w-2xl px-4 py-16 text-center" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-muted-foreground">Sentence not found.</p>
            <Link href="/" className="mt-4 inline-block text-sm text-moonlight hover:underline">Back to feed</Link>
          </main>
        </div>
      </>
    )
  }

  const allComments = [...sentence.comments, ...localComments]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return
    setLocalComments((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, user: "me", text: commentText.trim(), timeAgo: "just now", likes: 0 },
    ])
    setCommentText("")
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8">
          {/* Back */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          {/* Sentence card */}
          <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <blockquote
              className="mb-4 text-xl leading-relaxed text-foreground"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              &ldquo;{sentence.text}&rdquo;
            </blockquote>

            <div className="mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
              <span className="text-sm font-medium text-moonlight">{sentence.bookTitle}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{sentence.author}</span>
            </div>

            <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-body)" }}>
              <button
                onClick={() => setLiked((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 text-sm transition-colors",
                  liked ? "text-hotpink" : "text-muted-foreground hover:text-hotpink"
                )}
              >
                <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                <span>{sentence.likes + (liked ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => setSaved((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 text-sm transition-colors",
                  saved ? "text-moonlight" : "text-muted-foreground hover:text-moonlight"
                )}
              >
                <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                <span>{sentence.saves + (saved ? 1 : 0)}</span>
              </button>

              <span className="ml-auto text-xs text-muted-foreground">shared by @{sentence.uploadedBy} · {sentence.uploadedAt}</span>
            </div>
          </div>

          {/* Comments */}
          <section style={{ fontFamily: "var(--font-body)" }}>
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              {allComments.length} {allComments.length === 1 ? "comment" : "comments"}
            </h2>

            {/* Comment input */}
            <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What does this sentence mean to you?"
                maxLength={300}
                className="flex-1 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-moonlight/50 focus:outline-none focus:ring-1 focus:ring-moonlight/30 transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-moonlight text-white transition-opacity disabled:opacity-40 hover:opacity-90"
                aria-label="Submit comment"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Comment list */}
            <div className="flex flex-col gap-3">
              {allComments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-border bg-card px-4 py-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">@{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{comment.text}</p>
                  <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-hotpink transition-colors">
                    <Heart className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
