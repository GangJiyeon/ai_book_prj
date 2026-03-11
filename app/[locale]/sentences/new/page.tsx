"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"
import { searchBooksByTitle } from "@/lib/queries/books"
import { saveSentence } from "@/lib/queries/sentences"

const MAX_SENTENCE_LENGTH = 200
const INLINE_LIMIT = 5

type BookSuggestion = { id: string; title: string; author: string }

export default function NewSentencePage() {
  const router = useRouter()
  const { redirectIfNotAuth } = useRequireAuth()
  useEffect(() => { redirectIfNotAuth() }, [redirectIfNotAuth])
  const [bookTitle, setBookTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [text, setText] = useState("")
  const [myThought, setMyThought] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const remaining = MAX_SENTENCE_LENGTH - text.length
  const isValid = bookTitle.trim() && author.trim() && text.trim() && text.length <= MAX_SENTENCE_LENGTH

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!bookTitle.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      const results = await searchBooksByTitle(bookTitle)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    }, 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [bookTitle])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function selectSuggestion(book: BookSuggestion) {
    setBookTitle(book.title)
    setAuthor(book.author)
    setSelectedBookId(book.id)
    setSuggestions([])
    setShowSuggestions(false)
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBookTitle(e.target.value)
    setSelectedBookId(null)
    // If user manually edits after selecting, clear auto-filled author only if it was from selection
    if (selectedBookId) setAuthor("")
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setSaving(true)
    setSaveError(null)
    try {
      await saveSentence({
        bookId: selectedBookId,
        bookTitle: bookTitle.trim(),
        authorName: author.trim(),
        text: text.trim(),
        myThought: myThought.trim() || undefined,
      })
      setSubmitted(true)
      setTimeout(() => router.push("/"), 1500)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "저장에 실패했습니다")
    } finally {
      setSaving(false)
    }
  }

  const inlineSuggestions = suggestions.slice(0, INLINE_LIMIT)
  const extraSuggestions = suggestions.slice(INLINE_LIMIT)

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-xl px-4 py-8" style={{ fontFamily: "var(--font-body)" }}>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>

          <h1 className="mb-1 text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            Share a sentence
          </h1>
          <p className="mb-6 text-sm text-muted-foreground">
            A line that stayed with you. Keep it short — under {MAX_SENTENCE_LENGTH} characters.
          </p>

          {submitted ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-base font-medium text-moonlight" style={{ fontFamily: "var(--font-sans)" }}>
                Sentence shared!
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Returning to feed…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Book title + autocomplete */}
              <div ref={wrapperRef} className="relative">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Book title <span className="text-hotpink">*</span>
                </label>
                <input
                  value={bookTitle}
                  onChange={handleTitleChange}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="e.g. The Namiya Letters"
                  autoComplete="off"
                  className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-moonlight/50 focus:outline-none focus:ring-1 focus:ring-moonlight/30 transition-colors"
                />

                {/* Suggestion dropdown */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    {/* First 5 always visible */}
                    <ul>
                      {inlineSuggestions.map((book) => (
                        <li key={book.id}>
                          <button
                            type="button"
                            onMouseDown={() => selectSuggestion(book)}
                            className="flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-moonlight/8"
                          >
                            <span className="text-sm font-medium text-foreground">{book.title}</span>
                            <span className="text-[11px] text-muted-foreground">{book.author}</span>
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Extra results scrollable */}
                    {extraSuggestions.length > 0 && (
                      <div className="max-h-44 overflow-y-auto border-t border-border">
                        <ul>
                          {extraSuggestions.map((book) => (
                            <li key={book.id}>
                              <button
                                type="button"
                                onMouseDown={() => selectSuggestion(book)}
                                className="flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-moonlight/8"
                              >
                                <span className="text-sm font-medium text-foreground">{book.title}</span>
                                <span className="text-[11px] text-muted-foreground">{book.author}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Author <span className="text-hotpink">*</span>
                </label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Keigo Higashino"
                  className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-moonlight/50 focus:outline-none focus:ring-1 focus:ring-moonlight/30 transition-colors"
                />
              </div>

              {/* Sentence text */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Sentence <span className="text-hotpink">*</span>
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="The sentence that made you pause…"
                  rows={4}
                  maxLength={MAX_SENTENCE_LENGTH}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-moonlight/50 focus:outline-none focus:ring-1 focus:ring-moonlight/30 transition-colors"
                  style={{ fontFamily: "var(--font-sans)" }}
                />
                <p className={`mt-1 text-right text-xs ${remaining < 20 ? "text-hotpink" : "text-muted-foreground"}`}>
                  {remaining} characters left
                </p>
              </div>

              {/* My thought */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  My thought <span className="text-muted-foreground text-xs font-normal">(선택)</span>
                </label>
                <textarea
                  value={myThought}
                  onChange={(e) => setMyThought(e.target.value)}
                  placeholder="이 문장이 마음에 남은 이유, 느낀 점…"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-moonlight/50 focus:outline-none focus:ring-1 focus:ring-moonlight/30 transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              {saveError && (
                <p className="text-xs text-hotpink" style={{ fontFamily: "var(--font-body)" }}>
                  {saveError}
                </p>
              )}

              <button
                type="submit"
                disabled={!isValid || saving}
                className="mt-2 w-full rounded-xl bg-moonlight py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40 hover:opacity-90"
              >
                {saving ? "Sharing…" : "Share sentence"}
              </button>
            </form>
          )}
        </main>
      </div>
    </>
  )
}
