"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { StarField } from "@/components/star-field"
import { getChapterContent } from "@/lib/mock-data"
import {
  ReaderParagraph,
  CommentPanel,
  MobileCommentSheet,
  ChapterDiscussion,
} from "@/components/reader-components"

export default function ReaderPage() {
  const params = useParams()
  const bookId = (params.id as string) || "1"
  const chapterNum = Number(params.chapter) || 1

  const chapter = getChapterContent(bookId, chapterNum)

  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(
    null
  )

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedParagraphId((prev) => (prev === id ? null : id))
    },
    []
  )

  const handleClose = useCallback(() => {
    setSelectedParagraphId(null)
  }, [])

  const selectedParagraph =
    chapter?.paragraphs.find((p) => p.id === selectedParagraphId) ?? null

  if (!chapter) {
    return (
      <>
        <StarField />
        <div
          className="relative z-10 flex min-h-screen flex-col items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, #080c18 0%, #0a0e1a 30%, #0f1629 70%, #0a0e1a 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-4 px-4 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <h1 className="font-sans text-xl font-bold text-foreground">
              Chapter not found
            </h1>
            <p
              className="max-w-sm text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              This chapter does not exist yet in our mock data. Try Chapter 1 of
              The Namiya Letters.
            </p>
            <Link
              href="/read/1/1"
              className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-moonlight px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Go to Chapter 1
            </Link>
          </div>
        </div>
      </>
    )
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
        {/* Minimal top bar */}
        <header
          className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-md"
          style={{ backgroundColor: "rgba(10, 14, 26, 0.9)" }}
        >
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 lg:px-6">
            <Link
              href={`/book/${bookId}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-moonlight"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{chapter.bookTitle}</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="flex flex-col items-center">
              <span
                className="text-[11px] font-medium text-foreground/70"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Chapter {chapter.chapterNumber}
              </span>
              <span
                className="text-[10px] text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {chapter.chapterTitle}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground disabled:opacity-30"
                aria-label="Previous chapter"
                disabled={chapterNum <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
                aria-label="Next chapter"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main reading area */}
        <div className="flex">
          {/* Reading column */}
          <main
            className={`mx-auto w-full transition-all duration-300 ${
              selectedParagraphId ? "lg:mr-[360px]" : ""
            }`}
            style={{ maxWidth: "680px" }}
          >
            <div className="px-4 py-8 sm:px-6 lg:px-4">
              {/* Chapter heading */}
              <div className="mb-8 flex flex-col gap-1">
                <span
                  className="text-[11px] uppercase tracking-widest text-moonlight/60"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Chapter {chapter.chapterNumber}
                </span>
                <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
                  {chapter.chapterTitle}
                </h1>
                <p
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {chapter.bookTitle} &mdash; {chapter.bookAuthor}
                </p>
              </div>

              {/* Paragraphs */}
              <div className="flex flex-col gap-5">
                {chapter.paragraphs.map((p) => (
                  <ReaderParagraph
                    key={p.id}
                    paragraph={p}
                    isSelected={selectedParagraphId === p.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>

              {/* Chapter discussion */}
              <div className="mt-14">
                <ChapterDiscussion
                  comments={chapter.discussionComments}
                  chapterTitle={chapter.chapterTitle}
                />
              </div>

              {/* Bottom spacing */}
              <div className="h-20" aria-hidden="true" />
            </div>
          </main>

          {/* Desktop side panel */}
          <aside
            className={`fixed right-0 top-12 bottom-0 hidden w-[360px] transition-transform duration-300 lg:block ${
              selectedParagraphId
                ? "translate-x-0"
                : "translate-x-full"
            }`}
            aria-label="Comment panel"
          >
            <CommentPanel
              paragraph={selectedParagraph}
              onClose={handleClose}
            />
          </aside>

          {/* Mobile bottom sheet */}
          <div className="lg:hidden">
            <MobileCommentSheet
              paragraph={selectedParagraph}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </>
  )
}
