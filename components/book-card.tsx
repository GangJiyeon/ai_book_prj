"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Pause } from "lucide-react"

interface BookData {
  title: string
  author: string
  cover: string
  quote: string
  comments: { user: string; text: string }[]
  reactions: { hearts: number; comments: number; label: string }
}

const books: BookData[] = [
  {
    title: "The Namiya Letters",
    author: "K. Hiroshi",
    cover: "/images/book-a.jpg",
    quote: "Sometimes a single sentence is enough to start over.",
    comments: [
      { user: "mira.reads", text: "This line hit me harder than I expected." },
      { user: "joon_k", text: "I read it differently\u2014maybe because of where I am lately." },
      { user: "quietpages", text: "I stopped here too. What did you feel?" },
    ],
    reactions: { hearts: 12, comments: 3, label: "Paused here" },
  },
  {
    title: "Midnight Margin Notes",
    author: "L. Venn",
    cover: "/images/book-b.jpg",
    quote: "I thought I understood it\u2014until I read your comment.",
    comments: [
      { user: "sol.writes", text: "The margin note changed everything for me." },
      { user: "nocturn_e", text: "I keep coming back to this one paragraph." },
    ],
    reactions: { hearts: 27, comments: 5, label: "Re-reading" },
  },
  {
    title: "The Quiet Chapter",
    author: "A. Morel",
    cover: "/images/book-c.jpg",
    quote: "I paused here, and it felt like the story paused with me.",
    comments: [
      { user: "dawnreader", text: "This made me put the book down and just breathe." },
      { user: "half.moon", text: "The silence between the lines says everything." },
      { user: "page.turner", text: "Anyone else feel like time stopped here?" },
    ],
    reactions: { hearts: 34, comments: 8, label: "Lingered" },
  },
]

export function BookCard() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goToBook = useCallback(
    (index: number) => {
      if (index === activeIndex) return
      setIsFlipped(false)
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsTransitioning(false)
      }, 400)
    },
    [activeIndex]
  )

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % books.length
    goToBook(next)
  }, [activeIndex, goToBook])

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + books.length) % books.length
    goToBook(prev)
  }, [activeIndex, goToBook])

  // Auto-flip and auto-advance
  useEffect(() => {
    if (isHovered) return

    const flipDelay = 3500
    const showBackDelay = 3500

    // First: flip the card to show the back
    timerRef.current = setTimeout(() => {
      setIsFlipped(true)

      // Then: after showing back, advance to next book
      timerRef.current = setTimeout(() => {
        goNext()
      }, showBackDelay)
    }, flipDelay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [activeIndex, isHovered, goNext])

  const book = books[activeIndex]

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card container */}
      <div
        className="relative"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative transition-all duration-700 ease-in-out ${
            isHovered ? "-translate-y-2" : ""
          } ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          style={{
            width: "min(340px, 85vw)",
            height: "min(480px, 120vw)",
            transformStyle: "preserve-3d",
            transform: `${isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"} ${
              isHovered ? "translateY(-8px)" : ""
            }`,
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, scale 0.4s ease",
          }}
        >
          {/* Hover glow effect */}
          {isHovered && (
            <div
              className="pointer-events-none absolute -inset-3 rounded-2xl opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(245,216,122,0.15) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
          )}

          {/* Front face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl border border-border"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative h-full w-full bg-navy-mid">
              <Image
                src={book.cover}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="340px"
                priority
              />
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a]/90 via-transparent to-transparent" />
              {/* Book info on front */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
                <h3 className="font-sans text-xl font-semibold text-foreground leading-tight">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-xl border border-border bg-navy-mid"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex h-full flex-col justify-between p-6">
              {/* Quote */}
              <div className="flex-1 flex items-center">
                <blockquote className="relative px-4">
                  <span
                    className="absolute -left-1 -top-4 text-5xl leading-none text-moonlight/30 select-none"
                    aria-hidden="true"
                  >
                    {"\u201C"}
                  </span>
                  <p className="font-sans text-lg leading-relaxed text-foreground italic">
                    {book.quote}
                  </p>
                  <span
                    className="absolute -bottom-6 right-0 text-5xl leading-none text-moonlight/30 select-none"
                    aria-hidden="true"
                  >
                    {"\u201D"}
                  </span>
                </blockquote>
              </div>

              {/* Comments */}
              <div className="flex flex-col gap-2 mt-6">
                {book.comments.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-secondary/60 px-3 py-2"
                  >
                    <div
                      className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-moonlight/20 flex items-center justify-center"
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
                      <p className="text-xs leading-relaxed text-secondary-foreground">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reactions */}
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-hotpink fill-hotpink" />
                  <span className="text-hotpink">{book.reactions.hearts}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {book.reactions.comments}
                </span>
                <span className="flex items-center gap-1 ml-auto text-moonlight-dim">
                  <Pause className="h-3 w-3" />
                  {book.reactions.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination & controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          aria-label="Previous book"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground transition-colors hover:border-moonlight/40 hover:text-moonlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8.5 3L4.5 7L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Book selection">
          {books.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Book ${i + 1}: ${books[i].title}`}
              onClick={() => goToBook(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 bg-moonlight"
                  : "w-2 bg-navy-light hover:bg-moonlight/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          aria-label="Next book"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary/40 text-muted-foreground transition-colors hover:border-moonlight/40 hover:text-moonlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5.5 3L9.5 7L5.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
