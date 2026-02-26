"use client"

import { Heart, MessageCircle, Pause, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { MockBook } from "@/lib/mock-data"

interface DiscoveryBookCardProps {
  book: MockBook
  onPreviewExcerpt: (book: MockBook) => void
}

function PauseHeatBar({ heat }: { heat: number[] }) {
  return (
    <div className="flex items-end gap-[2px] h-3" aria-label="Pause density across book sections">
      {heat.map((value, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full transition-all"
          style={{
            height: `${Math.max(value * 100, 15)}%`,
            backgroundColor:
              value >= 0.8
                ? "var(--moonlight)"
                : value >= 0.5
                  ? "rgba(245, 216, 122, 0.4)"
                  : "rgba(245, 216, 122, 0.15)",
          }}
        />
      ))}
    </div>
  )
}

export function DiscoveryBookCard({ book, onPreviewExcerpt }: DiscoveryBookCardProps) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-moonlight/20 hover:shadow-[0_8px_32px_rgba(245,216,122,0.06)]">
      {/* Cover */}
      <div
        className="relative flex h-44 items-end rounded-t-xl overflow-hidden p-4"
        style={{ background: book.coverGradient }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(245,216,122,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(244,114,182,0.05) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        {/* Exchange badge */}
        {book.exchangeAvailable && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-moonlight/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Exchange
          </span>
        )}
        <div className="relative z-10 flex flex-col gap-0.5">
          <h3 className="font-sans text-base font-semibold leading-tight text-foreground text-balance">
            {book.title}
          </h3>
          <p className="text-xs text-foreground/60" style={{ fontFamily: "var(--font-body)" }}>
            {book.author}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Pause heat */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            Pause heat
          </span>
          <PauseHeatBar heat={book.pauseHeat} />
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-3 text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-hotpink/70" />
            {book.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {book.commentsCount}
          </span>
          <span className="flex items-center gap-1">
            <Pause className="h-3 w-3" />
            {book.pausesCount}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/book/${book.id}`}
            className="inline-flex flex-1 h-8 items-center justify-center gap-1 rounded-lg bg-moonlight px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim"
            style={{ fontFamily: "var(--font-body)" }}
          >
            View details
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <button
            onClick={() => onPreviewExcerpt(book)}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-secondary/30 px-3 text-xs text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Preview excerpt
          </button>
        </div>
      </div>
    </article>
  )
}
