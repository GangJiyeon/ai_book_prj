"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Heart, MessageCircle, Bookmark, Library } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { ShelfRow } from "@/components/shelf-row"
import { AnchorsView } from "@/components/anchors-view"
import { mockSentences, shelfBooks, shelfCategories } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Tab = "bookshelf" | "anchors" | "sentences" 

const shelfDescriptions: Record<string, string> = {
  "currently-reading": "Books you are in the middle of",
  paused: "Set aside for now",
  finished: "Completed reads",
  commented: "Books where you left thoughts",
}

// Mock: treat first 3 sentences as saved
const savedSentences = mockSentences.slice(0, 3)

export default function SavedPage() {
  const [tab, setTab] = useState<Tab>("bookshelf")

  const grouped = useMemo(() => {
    const map = new Map<string, typeof shelfBooks>()
    for (const cat of shelfCategories) map.set(cat.key, [])
    for (const book of shelfBooks) {
      const arr = map.get(book.category)
      if (arr) arr.push(book)
    }
    return map
  }, [])

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "bookshelf", label: "Bookshelf", icon: <Library className="h-3.5 w-3.5" /> },
    { key: "anchors", label: "Anchors", icon: <Bookmark className="h-3.5 w-3.5" /> },
    { key: "sentences", label: "Sentences", icon: <Bookmark className="h-3.5 w-3.5" /> },

  ]

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8">
          {/* Header */}
          <h1
            className="mb-6 text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Bookshelf
          </h1>

          {/* Tab buttons */}
          <div
            className="mb-6 inline-flex rounded-lg border border-border bg-secondary/30 p-0.5"
            role="tablist"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  tab === key
                    ? "bg-moonlight/15 text-moonlight shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Sentences tab */}
          {tab === "sentences" && (
            <div className="flex flex-col gap-4">
              {savedSentences.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-10 text-center" style={{ fontFamily: "var(--font-body)" }}>
                  <p className="text-muted-foreground">No saved sentences yet.</p>
                  <Link href="/" className="mt-3 inline-block text-sm text-moonlight hover:underline">
                    Browse the feed
                  </Link>
                </div>
              ) : (
                savedSentences.map((sentence) => (
                  <article key={sentence.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <Link href={`/sentences/${sentence.id}`}>
                      <blockquote
                        className="mb-3 text-lg leading-relaxed text-foreground hover:text-moonlight transition-colors cursor-pointer"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        &ldquo;{sentence.text}&rdquo;
                      </blockquote>
                    </Link>

                    <div className="mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                      <span className="text-xs font-medium text-moonlight">{sentence.bookTitle}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{sentence.author}</span>
                    </div>

                    <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-body)" }}>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        {sentence.likes}
                      </span>
                      <Link
                        href={`/sentences/${sentence.id}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {sentence.comments.length}
                      </Link>
                      <button className="ml-auto flex items-center gap-1 text-sm text-moonlight hover:text-moonlight/70 transition-colors">
                        <Bookmark className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* Bookshelf tab */}
          {tab === "bookshelf" && (
            <div className="flex flex-col gap-14">
              {shelfCategories.map((cat) => {
                const books = grouped.get(cat.key) || []
                return (
                  <ShelfRow
                    key={cat.key}
                    label={cat.label}
                    books={books}
                    description={shelfDescriptions[cat.key]}
                  />
                )
              })}
            </div>
          )}

          {/* Anchors tab */}
          {tab === "anchors" && (
            <div>
              <p className="mb-6 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                Quotes where you stopped and left a mark.
              </p>
              <AnchorsView books={shelfBooks} />
            </div>
          )}
        </main>
      </div>
    </>
  )
}
