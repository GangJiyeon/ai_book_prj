"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import * as Switch from "@radix-ui/react-switch"
import { X, SlidersHorizontal } from "lucide-react"
import { GENRES } from "@/lib/mock-data"

export interface FilterValues {
  genres: string[]
}

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (filters: FilterValues) => void
}

export function FilterDrawer({ open, onOpenChange, onApply }: FilterDrawerProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [language, setLanguage] = useState("all")
  const [length, setLength] = useState("all")
  const [hasPauseComments, setHasPauseComments] = useState(false)
  const [exchangeAvailable, setExchangeAvailable] = useState(false)

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-navy-deep shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-moonlight" />
              <Dialog.Title className="font-sans text-lg font-semibold text-foreground">
                Filters
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scroll area */}
          <div className="flex-1 overflow-y-auto px-6 py-5" style={{ fontFamily: "var(--font-body)" }}>
            <div className="flex flex-col gap-6">
              {/* Genre chips */}
              <fieldset>
                <legend className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Genre
                </legend>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => {
                    const isSelected = selectedGenres.includes(genre)
                    return (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                          isSelected
                            ? "bg-moonlight/20 text-moonlight border border-moonlight/40"
                            : "bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        {genre}
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {/* Language */}
              <fieldset>
                <legend className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Language
                </legend>
                <div className="flex gap-2">
                  {["all", "English", "Japanese", "Korean", "French"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        language === lang
                          ? "bg-moonlight/20 text-moonlight border border-moonlight/40"
                          : "bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      {lang === "all" ? "All" : lang}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Reading Length */}
              <fieldset>
                <legend className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Reading length
                </legend>
                <div className="flex gap-2">
                  {["all", "Short", "Medium", "Long"].map((len) => (
                    <button
                      key={len}
                      onClick={() => setLength(len)}
                      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        length === len
                          ? "bg-moonlight/20 text-moonlight border border-moonlight/40"
                          : "bg-secondary/40 text-muted-foreground border border-transparent hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      {len === "all" ? "All" : len}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Toggle switches */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="pause-comments" className="text-sm text-foreground">
                    Has many pause comments
                  </label>
                  <Switch.Root
                    id="pause-comments"
                    checked={hasPauseComments}
                    onCheckedChange={setHasPauseComments}
                    className="relative h-5 w-9 rounded-full bg-secondary/60 transition-colors data-[state=checked]:bg-moonlight/60"
                  >
                    <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-muted-foreground shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-moonlight" />
                  </Switch.Root>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="exchange-available" className="text-sm text-foreground">
                    Exchange available
                  </label>
                  <Switch.Root
                    id="exchange-available"
                    checked={exchangeAvailable}
                    onCheckedChange={setExchangeAvailable}
                    className="relative h-5 w-9 rounded-full bg-secondary/60 transition-colors data-[state=checked]:bg-moonlight/60"
                  >
                    <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-muted-foreground shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-moonlight" />
                  </Switch.Root>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-border/60 px-6 py-4" style={{ fontFamily: "var(--font-body)" }}>
            <button
              onClick={() => {
                setSelectedGenres([])
                setLanguage("all")
                setLength("all")
                setHasPauseComments(false)
                setExchangeAvailable(false)
              }}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
            <button
              onClick={() => {
                onApply({ genres: selectedGenres })
                onOpenChange(false)
              }}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-moonlight text-sm font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim"
            >
              Apply filters
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
