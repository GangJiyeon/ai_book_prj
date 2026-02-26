"use client"

import { BookSpine } from "@/components/book-spine"
import type { ShelfBook } from "@/lib/mock-data"

interface ShelfRowProps {
  label: string
  books: ShelfBook[]
  /** Optional subtle description */
  description?: string
}

export function ShelfRow({ label, books, description }: ShelfRowProps) {
  if (books.length === 0) return null

  return (
    <section className="flex flex-col gap-3">
      {/* Shelf label */}
      <div className="flex items-baseline gap-3 px-1">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">
          {label}
        </h2>
        <span
          className="text-xs text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {books.length} {books.length === 1 ? "book" : "books"}
        </span>
        {description && (
          <span
            className="hidden text-xs text-muted-foreground/60 sm:inline"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {description}
          </span>
        )}
      </div>

      {/* The shelf: books + wooden shelf edge */}
      <div className="relative">
        {/* Books container - horizontally scrollable on small screens */}
        <div
          className="flex items-end gap-1.5 overflow-x-auto pb-2 scrollbar-none"
          style={{ minHeight: "230px", paddingLeft: "4px", paddingRight: "16px" }}
        >
          {books.map((book) => (
            <BookSpine key={book.id} book={book} />
          ))}
        </div>

        {/* Shelf surface */}
        <div
          className="relative h-3 w-full rounded-sm"
          style={{
            background: "linear-gradient(180deg, #1e2d52 0%, #162040 40%, #111827 100%)",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,216,122,0.06)",
          }}
          aria-hidden="true"
        >
          {/* Shelf front face */}
          <div
            className="absolute -bottom-2 left-0 right-0 h-2 rounded-b-sm"
            style={{
              background: "linear-gradient(180deg, #162040 0%, #0f1629 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* Shelf bracket hints - left and right */}
        <div
          className="absolute -bottom-2 left-2 h-6 w-1 rounded-b-sm"
          style={{ backgroundColor: "#1e2d52", opacity: 0.4 }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-2 right-2 h-6 w-1 rounded-b-sm"
          style={{ backgroundColor: "#1e2d52", opacity: 0.4 }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
