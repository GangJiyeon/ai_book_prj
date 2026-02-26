"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { DiscoveryBookCard } from "@/components/discovery-book-card"
import { FilterDrawer } from "@/components/filter-drawer"
import { ExcerptModal } from "@/components/excerpt-modal"
import { TrendingPanel } from "@/components/trending-panel"
import { mockBooks, trendingPauses, SORT_OPTIONS } from "@/lib/mock-data"
import type { MockBook } from "@/lib/mock-data"

export default function BooksPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0])
  const [excerptBook, setExcerptBook] = useState<MockBook | null>(null)
  const [excerptOpen, setExcerptOpen] = useState(false)

  const handlePreviewExcerpt = (book: MockBook) => {
    setExcerptBook(book)
    setExcerptOpen(true)
  }

  return (
    <>
      <StarField />
      <div
        className="relative z-10 min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #080c18 0%, #0a0e1a 20%, #0f1629 60%, #0a0e1a 100%)",
        }}
      >
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Page header + controls */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
                Discover
              </h1>
              <p
                className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Find books where people leave thoughts at the exact line they paused.
              </p>
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] lg:min-w-[240px] lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search title, author, tag..."
                  className="h-9 w-full rounded-lg border border-border bg-secondary/30 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-moonlight/40 focus:outline-none focus:ring-1 focus:ring-moonlight/20"
                  aria-label="Search books"
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 text-sm text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  {selectedSort.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                {sortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setSortOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-navy-mid shadow-xl py-1"
                      role="listbox"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          role="option"
                          aria-selected={selectedSort.value === option.value}
                          onClick={() => {
                            setSelectedSort(option)
                            setSortOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                            selectedSort.value === option.value
                              ? "text-moonlight bg-moonlight/10"
                              : "text-secondary-foreground hover:bg-secondary/40 hover:text-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 text-sm text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Main content: grid + trending sidebar */}
          <div className="flex gap-6">
            {/* Book grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {mockBooks.map((book) => (
                  <DiscoveryBookCard
                    key={book.id}
                    book={book}
                    onPreviewExcerpt={handlePreviewExcerpt}
                  />
                ))}
              </div>
            </div>

            {/* Trending sidebar - desktop/wide only */}
            <div className="hidden xl:block w-72 shrink-0">
              <TrendingPanel pauses={trendingPauses} />
            </div>
          </div>

          {/* Trending section - below grid on smaller screens */}
          <div className="xl:hidden mt-8">
            <TrendingPanel pauses={trendingPauses} />
          </div>
        </main>

        {/* Filter drawer */}
        <FilterDrawer open={filterOpen} onOpenChange={setFilterOpen} />

        {/* Excerpt modal */}
        <ExcerptModal book={excerptBook} open={excerptOpen} onOpenChange={setExcerptOpen} />
      </div>
    </>
  )
}
