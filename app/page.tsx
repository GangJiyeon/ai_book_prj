"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Bookmark, MessageCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { getSortedSentences, SENTENCE_SORT_OPTIONS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function Home() {
  const [sort, setSort] = useState("trending")
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const sentences = getSortedSentences(sort)

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8">
          {/* Sort tabs */}
          <div className="mb-6 flex gap-1 border-b border-border" style={{ fontFamily: "var(--font-body)" }}>
            {SENTENCE_SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={cn(
                  "px-4 py-2 text-sm transition-colors border-b-2 -mb-px",
                  sort === opt.value
                    ? "border-moonlight text-moonlight font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sentence feed */}
          <div className="flex flex-col gap-4">
            {sentences.map((sentence) => (
              <article
                key={sentence.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Quote */}
                <Link href={`/sentences/${sentence.id}`}>
                  <blockquote
                    className="mb-4 text-lg leading-relaxed text-foreground cursor-pointer hover:text-moonlight transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    &ldquo;{sentence.text}&rdquo;
                  </blockquote>
                </Link>

                {/* Book info */}
                <div className="mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                  <span className="text-xs font-medium text-moonlight">{sentence.bookTitle}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{sentence.author}</span>
                </div>

                {/* Best comment preview */}
                {sentence.comments.length > 0 && (() => {
                  const best = [...sentence.comments].sort((a, b) => b.likes - a.likes)[0]
                  return (
                    <Link href={`/sentences/${sentence.id}`}>
                      <div className="mb-4 rounded-xl bg-secondary/50 px-4 py-3" style={{ fontFamily: "var(--font-body)" }}>
                        <span className="text-xs font-semibold text-foreground">@{best.user} </span>
                        <span className="text-xs text-muted-foreground line-clamp-2">{best.text}</span>
                      </div>
                    </Link>
                  )
                })()}

                {/* Actions */}
                <div className="flex items-center justify-between" style={{ fontFamily: "var(--font-body)" }}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(sentence.id)}
                      className={cn(
                        "flex items-center gap-1.5 text-sm transition-colors",
                        liked.has(sentence.id) ? "text-hotpink" : "text-muted-foreground hover:text-hotpink"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", liked.has(sentence.id) && "fill-current")} />
                      <span>{sentence.likes + (liked.has(sentence.id) ? 1 : 0)}</span>
                    </button>

                    <Link
                      href={`/sentences/${sentence.id}`}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{sentence.comments.length}</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{sentence.uploadedAt}</span>
                    <button
                      onClick={() => toggleSave(sentence.id)}
                      className={cn(
                        "flex items-center gap-1 text-sm transition-colors",
                        saved.has(sentence.id) ? "text-moonlight" : "text-muted-foreground hover:text-moonlight"
                      )}
                      aria-label={saved.has(sentence.id) ? "Unsave" : "Save"}
                    >
                      <Bookmark className={cn("h-4 w-4", saved.has(sentence.id) && "fill-current")} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
