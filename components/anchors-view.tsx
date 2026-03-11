"use client"

import Link from "next/link"
import { MessageCircle, FileText, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MyAnchorData } from "@/lib/types/reader"

type FilterType = "all" | "public" | "memo"

interface AnchorsViewProps {
  anchors: MyAnchorData[]
  filter: FilterType
  onFilterChange: (f: FilterType) => void
}

export function AnchorsView({ anchors, filter, onFilterChange }: AnchorsViewProps) {
  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: null },
    { key: "public", label: "Comments", icon: <MessageCircle className="h-3 w-3" /> },
    { key: "memo", label: "Memos", icon: <FileText className="h-3 w-3" /> },
  ]

  if (anchors.length === 0) {
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
    <div className="flex flex-col gap-4">
      {/* Filter pills */}
      <div className="flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
        {filters.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
              filter === key
                ? "border-moonlight/40 bg-moonlight/10 text-moonlight"
                : "border-border bg-secondary/20 text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {anchors.map((anchor) => (
          <Link
            key={anchor.id}
            href={`/read/${anchor.bookId}/${anchor.chapterNumber}`}
            className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-moonlight/20 hover:bg-card/60"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
          >
            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ boxShadow: "0 4px 24px rgba(245,216,122,0.06)" }}
              aria-hidden="true"
            />

            {/* Quote */}
            <blockquote className="relative">
              <span
                className="absolute -left-1 -top-2 text-2xl leading-none text-moonlight/30 select-none"
                aria-hidden="true"
              >
                {"\u201C"}
              </span>
              <p
                className="pl-4 text-sm italic leading-relaxed text-foreground/90"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {anchor.quote}
              </p>
            </blockquote>

            {/* My note */}
            {anchor.text && (
              <p
                className="border-l-2 border-moonlight/20 pl-3 text-xs leading-relaxed text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {anchor.text}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {anchor.bookTitle}
                </p>
                <p
                  className="truncate text-[11px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {anchor.bookAuthor} · Ch.{anchor.chapterNumber}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    anchor.visibility === "memo"
                      ? "bg-secondary/60 text-muted-foreground"
                      : "bg-moonlight/10 text-moonlight"
                  )}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {anchor.visibility === "memo" ? "Memo" : "Comment"}
                </span>
                <span
                  className="text-[10px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {anchor.timeAgo}
                </span>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-moonlight/20"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
