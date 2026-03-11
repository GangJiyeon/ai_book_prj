"use client"

import { Heart, MessageCircle, Pause, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import type { Book } from "@/lib/types/book"

// Fallback gradient when cover_url is null
function coverStyle(book: Book): React.CSSProperties {
  if (book.cover_url) return { backgroundImage: `url(${book.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }
  const gradients = [
    "linear-gradient(135deg, #1a2744 0%, #2d1b4e 50%, #1e2d52 100%)",
    "linear-gradient(135deg, #0f1629 0%, #1a2744 50%, #2a1f3d 100%)",
    "linear-gradient(135deg, #162040 0%, #1e2d52 50%, #0f1629 100%)",
    "linear-gradient(135deg, #2a1f3d 0%, #1a2744 50%, #0f2b3d 100%)",
    "linear-gradient(135deg, #0f2b3d 0%, #162040 50%, #2d1b4e 100%)",
  ]
  const i = book.title.charCodeAt(0) % gradients.length
  return { background: gradients[i] }
}

interface DiscoveryBookCardProps {
  book: Book
  onPreviewExcerpt?: (book: Book) => void
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
    <article className="group relative flex h-32 flex-row overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-moonlight/20 hover:shadow-[0_8px_32px_rgba(245,216,122,0.06)] sm:h-auto">
      {/* Cover — left column, fixed width */}
      <div
        className="relative w-24 shrink-0 sm:w-32"
        style={coverStyle(book)}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(245,216,122,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(244,114,182,0.05) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Body — right column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-3 sm:justify-start sm:p-4">
        {/* Title + author */}
        <div>
          <h3 className="font-sans text-sm font-semibold leading-snug text-foreground line-clamp-1 sm:line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            {book.author}
          </p>
        </div>

        {/* Tags — 모바일 숨김 */}
        <div className="hidden sm:flex flex-wrap gap-1">
          {book.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Pause heat + stats (모바일에서 한 줄로 통합) */}
        <div className="flex items-center gap-3" style={{ fontFamily: "var(--font-body)" }}>
          <div className="flex items-center gap-1.5">
            <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
              Pause heat
            </span>
            <PauseHeatBar heat={book.pauseHeat} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3 text-hotpink/70" />
              {book.likes}
            </span>
            <span className="flex items-center gap-0.5">
              <MessageCircle className="h-3 w-3" />
              {book.commentsCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Pause className="h-3 w-3" />
              {book.pausesCount}
            </span>
          </div>
        </div>

        {/* Spacer — sm+ 전용 */}
        <div className="hidden flex-1 sm:block" />

        {/* Actions */}
        <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
          <Link
            href={`/book/${book.id}`}
            className="inline-flex h-7 items-center gap-1 rounded-lg bg-moonlight px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim"
          >
            View details
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          {onPreviewExcerpt && (
            <button
              onClick={() => onPreviewExcerpt(book)}
              className="hidden h-7 items-center justify-center rounded-lg border border-border bg-secondary/30 px-2.5 text-xs text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight sm:inline-flex"
            >
              Preview
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
