"use client"

import Link from "next/link"
import { Pause, MessageCircle } from "lucide-react"
import type { BookAnchor } from "@/lib/mock-data"

interface PopularAnchorsProps {
  anchors: BookAnchor[]
  bookTitle: string
  bookAuthor: string
}

export function PopularAnchors({ anchors, bookTitle, bookAuthor }: PopularAnchorsProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">
          Popular Anchors
        </h2>
        <p
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Passages where readers paused, reflected, and left their thoughts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {anchors.map((anchor) => (
          <Link
            key={anchor.id}
            href="/read"
            className="group relative flex flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-moonlight/20 hover:bg-card/60"
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

            {/* Book info + stats */}
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {bookTitle}
                </p>
                <p
                  className="truncate text-[11px] text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {bookAuthor}
                </p>
              </div>
              <div
                className="flex shrink-0 items-center gap-2.5 text-[10px] text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <span className="flex items-center gap-0.5">
                  <Pause className="h-2.5 w-2.5" />
                  {anchor.pausesCount}
                </span>
                <span className="flex items-center gap-0.5">
                  <MessageCircle className="h-2.5 w-2.5" />
                  {anchor.commentsCount}
                </span>
              </div>
            </div>

            {/* Bottom accent */}
            <div
              className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-moonlight/20"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
