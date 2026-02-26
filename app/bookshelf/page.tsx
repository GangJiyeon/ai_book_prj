"use client"

import { useState, useMemo } from "react"
import { Library, Bookmark } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { ShelfRow } from "@/components/shelf-row"
import { AnchorsView } from "@/components/anchors-view"
import { shelfBooks, shelfCategories } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type ViewMode = "bookshelf" | "anchors"

const shelfDescriptions: Record<string, string> = {
  "currently-reading": "Books you are in the middle of",
  paused: "Set aside for now",
  finished: "Completed reads",
  commented: "Books where you left thoughts",
}

export default function BookshelfPage() {
  const [view, setView] = useState<ViewMode>("bookshelf")

  const grouped = useMemo(() => {
    const map = new Map<string, typeof shelfBooks>()
    for (const cat of shelfCategories) {
      map.set(cat.key, [])
    }
    for (const book of shelfBooks) {
      const arr = map.get(book.category)
      if (arr) arr.push(book)
    }
    return map
  }, [])

  const totalBooks = shelfBooks.length
  const totalPauses = shelfBooks.reduce((s, b) => s + b.pausesCount, 0)
  const totalComments = shelfBooks.reduce((s, b) => s + b.commentsCount, 0)

  return (
    <>
      <StarField />
      <div
        className="relative z-10 min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #080c18 0%, #0a0e1a 20%, #0f1629 60%, #0a0e1a 100%)",
        }}
      >
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
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

          {/* Content */}
          {view === "bookshelf" ? (
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
              <AnchorsView books={shelfBooks} />
            </div>
          )}
        </main>
      </div>
    </>
  )
}
