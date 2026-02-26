"use client"

import Link from "next/link"
import { MessageCircle, Pause, BookOpen } from "lucide-react"
import type { ShelfBook } from "@/lib/mock-data"

interface AnchorsViewProps {
  books: ShelfBook[]
}

export function AnchorsView({ books }: AnchorsViewProps) {
  // Only show books that have a paused quote
  const anchored = books.filter((b) => b.pausedQuote)

  if (anchored.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <BookOpen className="h-8 w-8 text-muted-foreground/40" />
        <p
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          No anchored pauses yet. Start reading to leave your first pause.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {anchored.map((book) => (
        <Link
          key={book.id}
          href={`/book/${book.id}`}
          className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-moonlight/20 hover:bg-card/60"
          style={{
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          {/* Hover glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              boxShadow: "0 4px 24px rgba(245,216,122,0.06)",
            }}
            aria-hidden="true"
          />

          {/* Quote */}
          <blockquote className="relative flex-1">
            <span
              className="absolute -left-1 -top-2 text-2xl leading-none text-moonlight/30"
              aria-hidden="true"
            >
              {'\u201C'}
            </span>
            <p
              className="pl-4 text-sm italic leading-relaxed text-foreground/90"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {book.pausedQuote}
            </p>
          </blockquote>

          {/* Book info */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {book.title}
              </p>
              <p
                className="truncate text-[11px] text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {book.author}
              </p>
            </div>

            {/* Stats */}
            <div
              className="flex shrink-0 items-center gap-2.5 text-[10px] text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="flex items-center gap-0.5">
                <Pause className="h-2.5 w-2.5" />
                {book.pausesCount}
              </span>
              <span className="flex items-center gap-0.5">
                <MessageCircle className="h-2.5 w-2.5" />
                {book.commentsCount}
              </span>
            </div>
          </div>

          {/* Spine color accent bar */}
          <div
            className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full opacity-40"
            style={{ backgroundColor: book.spineAccent }}
            aria-hidden="true"
          />
        </Link>
      ))}
    </div>
  )
}
