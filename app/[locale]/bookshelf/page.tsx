"use client"

import { useState, useEffect, useMemo } from "react"
import { Library, Bookmark } from "lucide-react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { ShelfRow } from "@/components/shelf-row"
import { AnchorsView } from "@/components/anchors-view"
import { shelfCategories } from "@/lib/types/bookshelf"
import type { ShelfBook } from "@/lib/types/bookshelf"
import type { MyAnchorData } from "@/lib/types/reader"
import { getMyBookshelf } from "@/lib/queries/bookshelf"
import { getMyAnchors } from "@/lib/queries/reader"
import { cn } from "@/lib/utils"

type ViewMode = "bookshelf" | "anchors"
type FilterType = "all" | "public" | "memo"

const shelfDescriptions: Record<string, string> = {
  "currently-reading": "Books you are in the middle of",
  paused: "Set aside for now",
  finished: "Completed reads",
  commented: "Books where you left thoughts",
}

export default function BookshelfPage() {
  const { redirectIfNotAuth } = useRequireAuth()
  useEffect(() => { redirectIfNotAuth() }, [redirectIfNotAuth])
  const [view, setView] = useState<ViewMode>("bookshelf")
  const [shelfBooks, setShelfBooks] = useState<ShelfBook[]>([])
  const [anchors, setAnchors] = useState<MyAnchorData[]>([])
  const [anchorFilter, setAnchorFilter] = useState<FilterType>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyBookshelf(), getMyAnchors()])
      .then(([books, ancs]) => {
        setShelfBooks(books)
        setAnchors(ancs)
      })
      .finally(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    const map = new Map<string, ShelfBook[]>()
    for (const cat of shelfCategories) {
      map.set(cat.key, [])
    }
    for (const book of shelfBooks) {
      const arr = map.get(book.category)
      if (arr) arr.push(book)
    }
    return map
  }, [shelfBooks])

  const filteredAnchors = useMemo(() => {
    if (anchorFilter === "all") return anchors
    return anchors.filter((a) => a.visibility === anchorFilter)
  }, [anchors, anchorFilter])

  const totalBooks = shelfBooks.length
  const totalPauses = anchors.length
  const totalComments = anchors.filter((a) => a.visibility === "public").length

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
                Your Bookshelf
              </h1>
              <p
                className="max-w-md text-sm leading-relaxed text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Every spine holds a story, every pause holds a moment.
              </p>
            </div>

            {/* Stats + toggle */}
            <div className="flex flex-col items-start gap-4 sm:items-end">
              {/* Mini stats */}
              <div
                className="flex items-center gap-4 text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span>
                  <span className="font-semibold text-foreground">{totalBooks}</span> books
                </span>
                <span className="h-3 w-px bg-border" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-foreground">{totalPauses}</span> pauses
                </span>
                <span className="h-3 w-px bg-border" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-foreground">{totalComments}</span> comments
                </span>
              </div>

              {/* View toggle */}
              <div
                className="inline-flex rounded-lg border border-border bg-secondary/30 p-0.5"
                role="tablist"
                aria-label="View mode"
              >
                <button
                  role="tab"
                  aria-selected={view === "bookshelf"}
                  onClick={() => setView("bookshelf")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    view === "bookshelf"
                      ? "bg-moonlight/15 text-moonlight shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <Library className="h-3.5 w-3.5" />
                  Bookshelf
                </button>
                <button
                  role="tab"
                  aria-selected={view === "anchors"}
                  onClick={() => setView("anchors")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    view === "anchors"
                      ? "bg-moonlight/15 text-moonlight shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  Anchors
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-moonlight border-t-transparent" />
            </div>
          ) : view === "bookshelf" ? (
            <div
              className="flex flex-col gap-14"
              role="tabpanel"
              aria-label="Bookshelf view"
            >
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
          ) : (
            <div role="tabpanel" aria-label="Anchors view">
              <div className="mb-6 flex flex-col gap-1">
                <h2 className="font-sans text-lg font-semibold text-foreground">
                  Paused Anchors
                </h2>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Quotes where you stopped and left a mark.
                </p>
              </div>
              <AnchorsView
                anchors={filteredAnchors}
                filter={anchorFilter}
                onFilterChange={setAnchorFilter}
              />
            </div>
          )}
        </main>
      </div>
    </>
  )
}
