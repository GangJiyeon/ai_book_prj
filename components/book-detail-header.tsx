"use client"

import Link from "next/link"
import { ArrowLeft, Pause, MessageCircle, BookOpen, Bookmark } from "lucide-react"
import type { BookDetail } from "@/lib/mock-data"

interface BookHeaderProps {
  book: BookDetail
}

export function BookDetailHeader({ book }: BookHeaderProps) {
  return (
    <section className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Book cover */}
      <div className="flex shrink-0 justify-center lg:justify-start">
        <div
          className="relative h-[280px] w-[200px] overflow-hidden rounded-xl shadow-2xl sm:h-[320px] sm:w-[220px]"
          style={{ background: book.coverGradient }}
        >
          {/* Subtle inner glow overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 25%, rgba(245,216,122,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 80%, rgba(244,114,182,0.05) 0%, transparent 50%)",
            }}
            aria-hidden="true"
          />
          {/* Title on cover */}
          <div className="relative flex h-full flex-col justify-end p-5">
            <h2 className="font-sans text-lg font-bold leading-tight text-foreground text-balance">
              {book.title}
            </h2>
            <p
              className="mt-1 text-xs text-foreground/50"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {book.author}
            </p>
          </div>
        </div>
      </div>

      {/* Book info */}
      <div className="flex flex-1 flex-col gap-5">
        {/* Back link */}
        <Link
          href="/books"
          className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-moonlight"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft className="h-3 w-3" />
          Back to discover
        </Link>

        {/* Title + author */}
        <div className="flex flex-col gap-1">
          <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance">
            {book.title}
          </h1>
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            by {book.author}
          </p>
        </div>

        {/* Description */}
        <p
          className="max-w-xl text-sm leading-relaxed text-secondary-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {book.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border/60 bg-secondary/50 px-2.5 py-1 text-[11px] text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="flex items-center gap-4 text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="flex items-center gap-1.5">
            <Pause className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{book.pausesCount}</span> pauses
          </span>
          <span className="h-3.5 w-px bg-border" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{book.commentsCount}</span> comments
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 pt-1">
          <Link
            href={`/read/${book.id}/1`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-moonlight px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <BookOpen className="h-4 w-4" />
            Start Reading
          </Link>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/30 px-5 text-sm text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Bookmark className="h-4 w-4" />
            Save Anchor
          </button>
        </div>
      </div>
    </section>
  )
}
