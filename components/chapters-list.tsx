"use client"

import Link from "next/link"
import { Pause } from "lucide-react"
import type { BookChapter } from "@/lib/mock-data"

interface ChaptersListProps {
  chapters: BookChapter[]
  bookId?: string
}

export function ChaptersList({ chapters, bookId = "1" }: ChaptersListProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">
          Chapters
        </h2>
        <p
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {chapters.length} chapters in this book.
        </p>
      </div>

      <div className="flex flex-col">
        {chapters.map((ch, idx) => (
          <Link
            key={ch.number}
            href={`/read/${bookId}/${ch.number}`}
            className={`group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-secondary/20 ${
              idx !== chapters.length - 1 ? "border-b border-border/40" : ""
            }`}
          >
            {/* Chapter number */}
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/40 text-xs font-bold text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {ch.number}
            </span>

            {/* Title + progress */}
            <div className="flex flex-1 flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="truncate text-sm text-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {ch.title}
                </span>
                {ch.hasAnchors && (
                  <span
                    className="flex items-center gap-0.5 shrink-0 text-moonlight/60"
                    aria-label="Has anchor pauses"
                  >
                    <Pause className="h-3 w-3" />
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div
                className="h-1 w-full overflow-hidden rounded-full bg-secondary/50"
                role="progressbar"
                aria-valuenow={ch.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Chapter ${ch.number} progress: ${ch.progress}%`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${ch.progress}%`,
                    backgroundColor:
                      ch.progress === 100
                        ? "var(--moonlight)"
                        : ch.progress > 0
                          ? "rgba(245, 216, 122, 0.5)"
                          : "transparent",
                  }}
                />
              </div>
            </div>

            {/* Progress label */}
            <span
              className="shrink-0 text-[11px] tabular-nums text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {ch.progress}%
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
