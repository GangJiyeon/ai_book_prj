"use client"

import { BookSpine } from "@/components/book-spine"
import type { ShelfBook } from "@/lib/types/bookshelf"

interface ShelfRowProps {
  label: string
  books: ShelfBook[]
  /** Optional subtle description */
  description?: string
}

export function ShelfRow({ label, books, description }: ShelfRowProps) {
  return (
    <section className="flex flex-col gap-3">
      {/* Shelf label */}
      <div className="flex items-baseline gap-3 px-1">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-foreground">
          {label}
        </h2>
        {books.length > 0 && (
          <span
            className="text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {books.length} {books.length === 1 ? "book" : "books"}
          </span>
        )}
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
          className="flex items-end gap-1.5 overflow-x-auto pb-2 scrollbar-none min-h-43.75 sm:min-h-57.5"
          style={{ paddingLeft: "4px", paddingRight: "16px" }}
        >
          {books.length === 0 ? (
            <div
              className="flex flex-1 items-center pb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <p className="text-xs text-muted-foreground/50 italic">
                No books here yet.
              </p>
            </div>
          ) : (
            books.map((book) => (
              <BookSpine key={book.id} book={book} />
            ))
          )}
        </div>

        {/* Shelf surface */}
        <div
          className="relative h-3 w-full rounded-sm"
          style={{
            background: "linear-gradient(180deg, var(--shelf-top) 0%, var(--shelf-mid) 40%, var(--shelf-deep) 100%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(245,216,122,0.06)",
          }}
          aria-hidden="true"
        >
          {/* Shelf front face */}
          <div
            className="absolute -bottom-2 left-0 right-0 h-2 rounded-b-sm"
            style={{
              background: "linear-gradient(180deg, var(--shelf-mid) 0%, var(--shelf-deep) 100%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          />
        </div>

        {/* Shelf bracket hints - left and right */}
        <div
          className="absolute -bottom-2 left-2 h-5 w-1 rounded-b-sm"
          style={{ backgroundColor: "var(--shelf-bracket)", opacity: 0.4 }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-2 right-2 h-5 w-1 rounded-b-sm"
          style={{ backgroundColor: "var(--shelf-bracket)", opacity: 0.4 }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
