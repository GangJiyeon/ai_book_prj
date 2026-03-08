"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"

const MAX_SENTENCE_LENGTH = 200

export default function NewSentencePage() {
  const router = useRouter()
  const [bookTitle, setBookTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const remaining = MAX_SENTENCE_LENGTH - text.length
  const isValid = bookTitle.trim() && author.trim() && text.trim() && text.length <= MAX_SENTENCE_LENGTH

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setSubmitted(true)
    setTimeout(() => router.push("/"), 1500)
  }

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

              {/* Book title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Book title <span className="text-hotpink">*</span>
                </label>
                <input
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="e.g. The Namiya Letters"
                  className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-moonlight/50 focus:outline-none focus:ring-1 focus:ring-moonlight/30 transition-colors"
                />
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

              <button
                type="submit"
                disabled={!isValid}
                className="mt-2 w-full rounded-xl bg-moonlight py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40 hover:opacity-90"
              >
                Share sentence
              </button>
            </form>
          )}
        </main>
      </div>
    </>
  )
}
