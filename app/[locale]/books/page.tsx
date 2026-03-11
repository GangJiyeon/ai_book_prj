"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { DiscoveryBookCard } from "@/components/discovery-book-card"
import { FilterDrawer, type FilterValues } from "@/components/filter-drawer"
import { ExcerptModal } from "@/components/excerpt-modal"
import { TrendingPanel } from "@/components/trending-panel"
import { SORT_OPTIONS } from "@/lib/mock-data"
import { getBooks, getTrendingPauses } from "@/lib/queries/books"
import type { TrendingPause } from "@/lib/queries/books"
import type { Book } from "@/lib/types/book"

type SortValue = "trending" | "new" | "most-commented" | "most-paused"

function sortBooks(books: Book[], sort: SortValue): Book[] {
  switch (sort) {
    case "trending":      return [...books].sort((a, b) => b.likes - a.likes)
    case "most-commented": return [...books].sort((a, b) => b.commentsCount - a.commentsCount)
    case "most-paused":   return [...books].sort((a, b) => (b.pausesCount ?? 0) - (a.pausesCount ?? 0))
    case "new":
    default:              return books // already ordered by created_at DESC from DB
  }
}

export default function BooksPage() {
  const [allBooks, setAllBooks] = useState<Book[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [trendingPauses, setTrendingPauses] = useState<TrendingPause[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState<typeof SORT_OPTIONS[number]>(SORT_OPTIONS[0])
  const [search, setSearch] = useState("")
  const [activeFilters, setActiveFilters] = useState<FilterValues>({ genres: [] })
  const [excerptBook, setExcerptBook] = useState<Book | null>(null)
  const [excerptOpen, setExcerptOpen] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch & apply filters/search
  const fetchBooks = useCallback(async (searchValue: string, filters: FilterValues) => {
    setLoading(true)
    try {
      const data = await getBooks({
        search: searchValue,
        tags: filters.genres,
      })
      setAllBooks(data)
      setBooks(sortBooks(data, selectedSort.value as SortValue))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [selectedSort.value])

  // Initial load
  useEffect(() => {
    fetchBooks("", { genres: [] })
    getTrendingPauses().then(setTrendingPauses)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-sort when sort changes (client-side, no extra fetch needed)
  useEffect(() => {
    setBooks(sortBooks(allBooks, selectedSort.value as SortValue))
  }, [selectedSort, allBooks])

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      fetchBooks(value, activeFilters)
    }, 350)
  }

  // Filter apply
  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters)
    fetchBooks(search, filters)
  }

  const handlePreviewExcerpt = (book: Book) => {
    setExcerptBook(book)
    setExcerptOpen(true)
  }

  const activeGenreCount = activeFilters.genres.length

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Page header + controls */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
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
              <div className="relative flex-1 min-w-50 lg:min-w-60 lg:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search title, author..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                      className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-card shadow-xl py-1"
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
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors ${
                  activeGenreCount > 0
                    ? "border-moonlight/40 bg-moonlight/10 text-moonlight"
                    : "border-border bg-secondary/30 text-secondary-foreground hover:border-moonlight/30 hover:text-moonlight"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeGenreCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-moonlight text-[10px] font-bold text-primary-foreground">
                    {activeGenreCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Main content: grid + trending sidebar */}
          <div className="flex gap-6">
            {/* Book grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-moonlight border-t-transparent" />
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-20 text-center">
                  <p className="text-sm font-medium text-foreground">No books found</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    Try a different search or remove filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-2">
                  {books.map((book) => (
                    <DiscoveryBookCard
                      key={book.id}
                      book={book}
                      onPreviewExcerpt={handlePreviewExcerpt}
                    />
                  ))}
                </div>
              )}
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
        <FilterDrawer
          open={filterOpen}
          onOpenChange={setFilterOpen}
          onApply={handleApplyFilters}
        />

        {/* Excerpt modal */}
        <ExcerptModal book={excerptBook} open={excerptOpen} onOpenChange={setExcerptOpen} />
      </div>
    </>
  )
}
