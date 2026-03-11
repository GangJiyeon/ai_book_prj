"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { StarField } from "@/components/star-field"
import { fetchGroupName } from "@/lib/queries/groups"
import type { ChapterContentData, ReaderCommentData } from "@/lib/types/reader"


type ScopeType = "public" | "memo" | "group"
type ReadingContext = { mode: "solo" } | { mode: "group"; groupId: string; groupName: string }
import {
  ReaderParagraph,
  SentencePanel,
  ChapterDiscussion,
} from "@/components/reader-components"
import { getChapterWithParagraphs, getSentenceComments, saveReaderComment, getChapterComments, saveChapterComment } from "@/lib/queries/reader"
import { markBookAsReading } from "@/lib/queries/bookshelf"

export default function ReaderPageWrapper() {
  return (
    <Suspense>
      <ReaderPage />
    </Suspense>
  )
}

interface SelectedSentence {
  paragraphId: string
  text: string
}

function ReaderPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const bookId = (params.id as string) || ""
  const chapterNum = Number(params.chapter) || 1
  const groupIdParam = searchParams.get("groupId")

  const [chapter, setChapter] = useState<ChapterContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSentence, setSelectedSentence] = useState<SelectedSentence | null>(null)
  const [sentenceComments, setSentenceComments] = useState<ReaderCommentData[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [readingContext, setReadingContext] = useState<ReadingContext>({ mode: "solo" })
  const [chapterComments, setChapterComments] = useState<ReaderCommentData[]>([])

  useEffect(() => {
    setLoading(true)
    markBookAsReading(bookId)
    getChapterWithParagraphs(bookId, chapterNum)
      .then((data) => {
        setChapter(data)
        if (data) {
          const groupId = readingContext.mode === "group" ? readingContext.groupId : undefined
          getChapterComments(data.chapterId, groupId).then(setChapterComments)
        }
      })
      .finally(() => setLoading(false))
  }, [bookId, chapterNum]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!groupIdParam) return
    fetchGroupName(groupIdParam).then((name) => {
      if (name) setReadingContext({ mode: "group", groupId: groupIdParam, groupName: name })
    })
  }, [groupIdParam])

  const handleSentenceClick = useCallback(async (paragraphId: string, text: string) => {
    setSelectedSentence({ paragraphId, text })
    setSentenceComments([])
    setLoadingComments(true)
    try {
      const groupId = readingContext.mode === "group" ? readingContext.groupId : undefined
      const comments = await getSentenceComments(paragraphId, text, groupId)
      setSentenceComments(comments)
    } finally {
      setLoadingComments(false)
    }
  }, [readingContext])

  const handleClose = useCallback(() => {
    setSelectedSentence(null)
    setSentenceComments([])
  }, [])

  const handleSave = useCallback(
    async (text: string, visibility: ScopeType) => {
      if (!selectedSentence) throw new Error("선택된 문장이 없습니다")
      await saveReaderComment({
        paragraphId: selectedSentence.paragraphId,
        quote: selectedSentence.text,
        text,
        visibility,
        groupId: readingContext.mode === "group" ? readingContext.groupId : undefined,
      })
      // Re-fetch comments to show new one
      const groupId = readingContext.mode === "group" ? readingContext.groupId : undefined
      if (visibility === "public" || visibility === "group" || visibility === "memo") {
        const updated = await getSentenceComments(selectedSentence.paragraphId, selectedSentence.text, groupId)
        setSentenceComments(updated)
      }
    },
    [selectedSentence, readingContext]
  )

  const handleChapterSave = useCallback(
    async (text: string, visibility: ScopeType) => {
      if (!chapter) throw new Error("챕터 정보가 없습니다")
      await saveChapterComment({
        chapterId: chapter.chapterId,
        text,
        visibility,
        groupId: readingContext.mode === "group" ? readingContext.groupId : undefined,
      })
      const groupId = readingContext.mode === "group" ? readingContext.groupId : undefined
      const updated = await getChapterComments(chapter.chapterId, groupId)
      setChapterComments(updated)
    },
    [chapter, readingContext]
  )

  const backHref =
    readingContext.mode === "group"
      ? `/groups/${readingContext.groupId}`
      : `/book/${bookId}`

  const backLabel =
    readingContext.mode === "group" ? readingContext.groupName : chapter?.bookTitle

  if (loading) {
    return (
      <>
        <StarField />
        <div className="relative z-10 flex min-h-screen items-center justify-center bg-background">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-moonlight border-t-transparent" />
        </div>
      </>
    )
  }

  if (!chapter) {
    return (
      <>
        <StarField />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4 px-4 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <h1 className="font-sans text-xl font-bold text-foreground">Chapter not found</h1>
            <p className="max-w-sm text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              This chapter does not exist yet. Check the book detail page for available chapters.
            </p>
            <Link
              href={`/book/${bookId}`}
              className="mt-2 inline-flex h-9 items-center justify-center rounded-lg bg-moonlight px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Back to book
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-md bg-card/90">
          <div className="relative mx-auto flex h-12 max-w-5xl items-center px-4 lg:px-6">
            {/* Left: back */}
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-moonlight"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="max-w-28 truncate">{backLabel}</span>
            </Link>

            {/* Center: chapter info — always perfectly centered */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <span className="text-[11px] font-medium text-foreground/70" style={{ fontFamily: "var(--font-body)" }}>
                Ch. {chapter.chapterNumber}
              </span>
              {chapter.chapterTitle && (
                <span className="max-w-40 truncate text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  {chapter.chapterTitle}
                </span>
              )}
            </div>

            {/* Right: chapter nav */}
            <div className="ml-auto flex items-center gap-1">
              <Link
                href={`/read/${bookId}/${chapterNum - 1}`}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground ${chapterNum <= 1 ? "pointer-events-none opacity-30" : ""}`}
                aria-label="Previous chapter"
                aria-disabled={chapterNum <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/read/${bookId}/${chapterNum + 1}`}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground ${chapterNum >= chapter.totalChapters ? "pointer-events-none opacity-30" : ""}`}
                aria-label="Next chapter"
                aria-disabled={chapterNum >= chapter.totalChapters}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Reading area */}
        <main className="mx-auto w-full" style={{ maxWidth: "680px" }}>
          <div className="px-4 py-8 sm:px-6 lg:px-4">
            <div className="mb-8 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-widest text-moonlight/60" style={{ fontFamily: "var(--font-body)" }}>
                Chapter {chapter.chapterNumber}
              </span>
              <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
                {chapter.chapterTitle}
              </h1>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {chapter.bookTitle} &mdash; {chapter.bookAuthor}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {chapter.paragraphs.map((p) => (
                <ReaderParagraph
                  key={p.id}
                  paragraph={p}
                  selectedSentence={selectedSentence?.paragraphId === p.id ? selectedSentence.text : null}
                  onSentenceClick={handleSentenceClick}
                />
              ))}
            </div>

            <div className="mt-16">
              <ChapterDiscussion
                comments={chapterComments}
                chapterTitle={chapter.chapterTitle}
                readingContext={readingContext}
                onSave={handleChapterSave}
              />
            </div>

            <div className="h-20" aria-hidden="true" />
          </div>
        </main>

        {/* Sentence panel */}
        {selectedSentence && (
          <SentencePanel
            sentence={selectedSentence}
            comments={sentenceComments}
            loadingComments={loadingComments}
            onClose={handleClose}
            onSave={handleSave}
            readingContext={readingContext}
          />
        )}
      </div>
    </>
  )
}
