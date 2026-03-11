"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { Heart, Bookmark, Library, PenLine, BookmarkCheck } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { ShelfRow } from "@/components/shelf-row"
import { AnchorsView } from "@/components/anchors-view"
import { shelfCategories } from "@/lib/types/bookshelf"
import type { ShelfBook } from "@/lib/types/bookshelf"
import { getMyAnchors } from "@/lib/queries/reader"
import { getMyBookshelf } from "@/lib/queries/bookshelf"

import { getMyWrittenSentences, getMySavedSentences } from "@/lib/queries/sentences"
import { toggleFeedSave } from "@/lib/queries/feed"
import type { MyAnchorData } from "@/lib/types/reader"
import type { SentenceItem } from "@/lib/queries/sentences"
import { cn } from "@/lib/utils"

type Tab = "bookshelf" | "anchors" | "sentences"
type AnchorFilter = "all" | "public" | "memo"
type SentenceFilter = "written" | "saved"

const shelfDescriptions: Record<string, string> = {
  "currently-reading": "Books you are in the middle of",
  paused: "Set aside for now",
  finished: "Completed reads",
  commented: "Books where you left thoughts",
}

export default function SavedPage() {
  const { redirectIfNotAuth } = useRequireAuth()
  useEffect(() => { redirectIfNotAuth() }, [redirectIfNotAuth])
  const [tab, setTab] = useState<Tab>("bookshelf")

  // Anchors
  const [anchorFilter, setAnchorFilter] = useState<AnchorFilter>("all")
  const [anchors, setAnchors] = useState<MyAnchorData[]>([])
  const [anchorsLoading, setAnchorsLoading] = useState(false)

  // Bookshelf
  const [shelfBooks, setShelfBooks] = useState<ShelfBook[]>([])
  const [shelfLoading, setShelfLoading] = useState(false)

  // Sentences
  const [sentenceFilter, setSentenceFilter] = useState<SentenceFilter>("written")
  const [writtenSentences, setWrittenSentences] = useState<SentenceItem[]>([])
  const [savedSentences, setSavedSentences] = useState<SentenceItem[]>([])
  const [sentencesLoading, setSentencesLoading] = useState(false)

  useEffect(() => {
    if (tab === "bookshelf") {
      setShelfLoading(true)
      getMyBookshelf()
        .then(setShelfBooks)
        .finally(() => setShelfLoading(false))
    }
    if (tab === "anchors") {
      setAnchorsLoading(true)
      getMyAnchors()
        .then(setAnchors)
        .finally(() => setAnchorsLoading(false))
    }
    if (tab === "sentences") {
      setSentencesLoading(true)
      Promise.all([getMyWrittenSentences(), getMySavedSentences()])
        .then(([written, saved]) => {
          setWrittenSentences(written)
          setSavedSentences(saved)
        })
        .finally(() => setSentencesLoading(false))
    }
  }, [tab])

  const filteredAnchors = useMemo(() => {
    if (anchorFilter === "all") return anchors
    return anchors.filter((a) => a.visibility === anchorFilter)
  }, [anchors, anchorFilter])

  const displayedSentences = sentenceFilter === "written" ? writtenSentences : savedSentences

  function handleUnsave(sentenceId: string) {
    setSavedSentences((prev) => prev.filter((s) => s.id !== sentenceId))
    toggleFeedSave(sentenceId, true).catch(() => {
      // 롤백: 실패 시 재조회
      getMySavedSentences().then(setSavedSentences)
    })
  }

  const grouped = useMemo(() => {
    const map = new Map<string, ShelfBook[]>()
    for (const cat of shelfCategories) map.set(cat.key, [])
    for (const book of shelfBooks) {
      const arr = map.get(book.category)
      if (arr) arr.push(book)
    }
    return map
  }, [shelfBooks])

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "bookshelf", label: "Bookshelf", icon: <Library className="h-3.5 w-3.5" /> },
    { key: "anchors", label: "Anchors", icon: <Bookmark className="h-3.5 w-3.5" /> },
    { key: "sentences", label: "Sentences", icon: <PenLine className="h-3.5 w-3.5" /> },
  ]

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8">
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

          {/* Anchors tab */}
          {tab === "anchors" && (
            <div>
              <p
                className="mb-4 text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Quotes where you stopped and left a mark.
              </p>
              {anchorsLoading ? (
                <Loading />
              ) : (
                <AnchorsView
                  anchors={filteredAnchors}
                  filter={anchorFilter}
                  onFilterChange={setAnchorFilter}
                />
              )}
            </div>
          )}

          {/* Sentences tab */}
          {tab === "sentences" && (
            <div className="flex flex-col gap-4">
              {/* Sub-filter */}
              <div
                className="flex items-center gap-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <button
                  onClick={() => setSentenceFilter("written")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    sentenceFilter === "written"
                      ? "border-moonlight/40 bg-moonlight/10 text-moonlight"
                      : "border-border bg-secondary/20 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <PenLine className="h-3 w-3" />
                  My sentences
                  {writtenSentences.length > 0 && (
                    <span className="ml-0.5 text-[10px] opacity-70">{writtenSentences.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setSentenceFilter("saved")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    sentenceFilter === "saved"
                      ? "border-moonlight/40 bg-moonlight/10 text-moonlight"
                      : "border-border bg-secondary/20 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BookmarkCheck className="h-3 w-3" />
                  Saved
                  {savedSentences.length > 0 && (
                    <span className="ml-0.5 text-[10px] opacity-70">{savedSentences.length}</span>
                  )}
                </button>
              </div>

              {sentencesLoading ? (
                <Loading />
              ) : displayedSentences.length === 0 ? (
                <div
                  className="rounded-2xl border border-border bg-card p-10 text-center"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <p className="text-muted-foreground">
                    {sentenceFilter === "written"
                      ? "No sentences shared yet."
                      : "No saved sentences yet."}
                  </p>
                  <Link
                    href={sentenceFilter === "written" ? "/sentences/new" : "/"}
                    className="mt-3 inline-block text-sm text-moonlight hover:underline"
                  >
                    {sentenceFilter === "written" ? "Share your first sentence" : "Browse the feed"}
                  </Link>
                </div>
              ) : (
                displayedSentences.map((sentence) => (
                  <article
                    key={sentence.id}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                  >
                    <Link href={`/sentences/${sentence.id}`}>
                      <blockquote
                        className="mb-3 text-base leading-relaxed text-foreground hover:text-moonlight transition-colors cursor-pointer"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        &ldquo;{sentence.text}&rdquo;
                      </blockquote>
                    </Link>

                    <div
                      className="mb-4 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="text-xs font-medium text-moonlight">{sentence.bookTitle}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{sentence.authorName}</span>
                    </div>

                    <div
                      className="flex items-center gap-4"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        {sentence.likesCount}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Bookmark className="h-4 w-4" />
                        {sentence.savesCount}
                      </span>
                      <span className="ml-auto text-[11px] text-muted-foreground">
                        {sentence.timeAgo}
                      </span>
                      {sentenceFilter === "saved" && (
                        <button
                          onClick={() => handleUnsave(sentence.id)}
                          className="text-[11px] text-muted-foreground transition-colors hover:text-red-400"
                          style={{ fontFamily: "var(--font-body)" }}
                          aria-label="저장 해제"
                        >
                          저장 해제
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {/* Bookshelf tab */}
          {tab === "bookshelf" && (
            shelfLoading ? (
              <Loading />
            ) : shelfBooks.length === 0 ? (
              <div
                className="flex flex-col items-center gap-3 py-20 text-center"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <p className="text-sm text-muted-foreground">
                  Your shelf is empty. Start reading to add books.
                </p>
                <Link href="/books" className="text-sm text-moonlight hover:underline">
                  Browse books
                </Link>
              </div>
            ) : (
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
            )
          )}
        </main>
      </div>
    </>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <span
        className="text-sm text-muted-foreground"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Loading…
      </span>
    </div>
  )
}
