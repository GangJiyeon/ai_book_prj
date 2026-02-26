"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { MessageCircle, X, TrendingUp } from "lucide-react"
import type { TrendingPause } from "@/lib/mock-data"

interface TrendingPanelProps {
  pauses: TrendingPause[]
}

function TrendingPauseModal({
  pause,
  open,
  onOpenChange,
}: {
  pause: TrendingPause | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!pause) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-navy-mid shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
          <div className="flex items-start justify-between border-b border-border/40 p-5">
            <div className="pr-8">
              <Dialog.Title className="font-sans text-sm font-semibold text-foreground mb-1">
                Trending Pause
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                from {pause.bookTitle}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-5">
            <blockquote className="relative px-2">
              <span
                className="absolute -left-1 -top-3 text-3xl leading-none text-moonlight/25 select-none"
                aria-hidden="true"
              >
                {"\u201C"}
              </span>
              <p className="font-sans text-sm leading-relaxed text-foreground/90 italic">
                {pause.quote}
              </p>
            </blockquote>
          </div>

          <div className="flex flex-col gap-2 px-5 pb-5" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              {pause.commentsCount} thoughts on this pause
            </p>
            {pause.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-secondary/40 px-3 py-2">
                <div
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-moonlight/15 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-[10px] text-moonlight font-mono font-bold">
                    {c.user[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono text-muted-foreground truncate">
                    {c.user}
                  </span>
                  <p className="text-xs leading-relaxed text-secondary-foreground">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function TrendingPanel({ pauses }: TrendingPanelProps) {
  const [selectedPause, setSelectedPause] = useState<TrendingPause | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <aside className="sticky top-20 w-full" aria-label="Trending pauses">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-moonlight" />
            <h2 className="font-sans text-sm font-semibold text-foreground">
              Trending pauses
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            {pauses.map((pause) => (
              <button
                key={pause.id}
                onClick={() => {
                  setSelectedPause(pause)
                  setModalOpen(true)
                }}
                className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary/40 group"
              >
                <p
                  className="text-xs leading-relaxed text-foreground/80 italic line-clamp-2 group-hover:text-foreground transition-colors"
                >
                  {"\u201C"}{pause.quote}{"\u201D"}
                </p>
                <div className="flex items-center justify-between" style={{ fontFamily: "var(--font-body)" }}>
                  <span className="text-[11px] text-muted-foreground truncate max-w-[60%]">
                    {pause.bookTitle}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {pause.commentsCount}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <TrendingPauseModal
        pause={selectedPause}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
