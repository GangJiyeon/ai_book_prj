"use client"

import Link from "next/link"
import { MessageCircle, Pause } from "lucide-react"
import type { ShelfBook } from "@/lib/mock-data"

interface BookSpineProps {
  book: ShelfBook
}

export function BookSpine({ book }: BookSpineProps) {
  const mobileWidth = Math.max(28, Math.min(42, 22 + book.title.length * 0.9))
  const desktopWidth = Math.max(36, Math.min(56, 28 + book.title.length * 1.2))

  return (
    <Link
      href={`/book/${book.id}`}
      className="group relative flex shrink-0 cursor-pointer"
      style={{ perspective: "600px" }}
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* The spine */}
      <div
        className="relative flex flex-col items-center justify-between rounded-sm transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:scale-[1.02] h-36.25 sm:h-45"
        style={{
          width: `${mobileWidth}px`,
          background: book.spineColor,
          boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3), 2px 4px 12px rgba(0,0,0,0.4)",
          borderLeft: `3px solid ${book.spineAccent}`,
          transformOrigin: "bottom center",
        }}
      >
        {/* CSS-only responsive width via data attribute */}
        <style>{`
          @media (min-width: 640px) {
            [data-spine-id="${book.id}"] { width: ${desktopWidth}px !important; }
          }
        `}</style>

        {/* Hover glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            boxShadow: `0 -8px 30px ${book.spineAccent}22, 0 0 20px ${book.spineAccent}11`,
          }}
          aria-hidden="true"
        />

        {/* Top accent line */}
        <div
          className="w-3/4 shrink-0 rounded-full"
          style={{
            height: "2px",
            backgroundColor: book.spineAccent,
            marginTop: "10px",
            opacity: 0.6,
          }}
          aria-hidden="true"
        />

        {/* Title - rotated vertically */}
        <div
          className="flex flex-1 items-center justify-center overflow-hidden px-1"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span
            className="truncate font-semibold leading-tight tracking-wide max-h-25 sm:max-h-35 text-[10px] sm:text-[11px]"
            style={{
              color: book.textColor,
              transform: "rotate(180deg)",
            }}
          >
            {book.title}
          </span>
        </div>

        {/* Bottom accent line */}
        <div
          className="w-3/4 shrink-0 rounded-full"
          style={{
            height: "2px",
            backgroundColor: book.spineAccent,
            marginBottom: "10px",
            opacity: 0.6,
          }}
          aria-hidden="true"
        />

        {/* Progress indicator - thin bar at the very bottom */}
        {book.progress < 100 && (
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-sm"
            style={{ height: "3px", backgroundColor: "rgba(0,0,0,0.3)" }}
            role="progressbar"
            aria-valuenow={book.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${book.progress}% read`}
          >
            <div
              className="h-full rounded-b-sm transition-all"
              style={{
                width: `${book.progress}%`,
                backgroundColor: book.spineAccent,
                opacity: 0.8,
              }}
            />
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-lg border border-border bg-navy-mid/95 px-3 py-2.5 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-200 group-hover:-top-28 group-hover:opacity-100"
        style={{
          width: "180px",
          fontFamily: "var(--font-body)",
        }}
      >
        <p className="w-full truncate text-center text-xs font-semibold text-foreground">
          {book.title}
        </p>
        <p className="w-full truncate text-center text-[10px] text-muted-foreground">
          {book.author}
        </p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Pause className="h-2.5 w-2.5" />
            {book.pausesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-2.5 w-2.5" />
            {book.commentsCount}
          </span>
          {book.progress < 100 && (
            <span className="text-moonlight-dim">{book.progress}%</span>
          )}
        </div>
        {/* Tooltip arrow */}
        <div
          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-navy-mid/95"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
