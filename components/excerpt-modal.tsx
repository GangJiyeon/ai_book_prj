"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X, Heart, MessageCircle, BookOpen } from "lucide-react"
import type { Book } from "@/lib/types/book"

interface ExcerptModalProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExcerptModal({ book, open, onOpenChange }: ExcerptModalProps) {
  if (!book) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-navy-mid shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border/40 p-5">
            <div className="flex flex-col gap-1 pr-8">
              <Dialog.Title className="font-sans text-base font-semibold text-foreground">
                {book.title}
              </Dialog.Title>
              <Dialog.Description
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                by {book.author}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close preview"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Description */}
          <div className="p-5">
            <blockquote className="relative px-3">
              <span
                className="absolute -left-1 -top-3 text-4xl leading-none text-moonlight/25 select-none"
                aria-hidden="true"
              >
                {"\u201C"}
              </span>
              <p className="font-sans text-base leading-relaxed text-foreground/90 italic">
                {book.description ?? "No description available."}
              </p>
              <span
                className="absolute -bottom-4 right-0 text-4xl leading-none text-moonlight/25 select-none"
                aria-hidden="true"
              >
                {"\u201D"}
              </span>
            </blockquote>
          </div>

          {/* Stats + CTA */}
          <div className="flex items-center justify-between border-t border-border/40 px-5 py-4" style={{ fontFamily: "var(--font-body)" }}>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-hotpink/70" />
                {book.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {book.commentsCount}
              </span>
            </div>
            <button className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-moonlight px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim">
              <BookOpen className="h-3.5 w-3.5" />
              Open reader
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
