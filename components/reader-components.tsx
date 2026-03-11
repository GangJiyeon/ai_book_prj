"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { ReadingContext, ScopeType } from "@/lib/mock-data"
import type { ParagraphData, ReaderCommentData } from "@/lib/types/reader"
import { ScopeSelector } from "@/components/scope-selector"

/* ─── Sentence splitter ─── */

function splitIntoSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+/)
  return parts.filter(Boolean)
}

/* ─── Reader Paragraph ─── */

interface ReaderParagraphProps {
  paragraph: ParagraphData
  selectedSentence: string | null
  onSentenceClick: (paragraphId: string, sentenceText: string) => void
}

export function ReaderParagraph({
  paragraph,
  selectedSentence,
  onSentenceClick,
}: ReaderParagraphProps) {
  const sentences = splitIntoSentences(paragraph.text)

  return (
    <div className="relative" data-paragraph-id={paragraph.id}>
      <p
        className="text-foreground/90 leading-[1.6]"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(16px, 2.5vw, 18px)",
        }}
      >
        {sentences.map((sentence, i) => {
          const isSelected = selectedSentence === sentence
          return (
            <span
              key={i}
              onClick={() => onSentenceClick(paragraph.id, sentence)}
              className="cursor-pointer rounded transition-colors duration-150 hover:bg-moonlight/10"
              style={
                isSelected
                  ? { backgroundColor: "rgba(245, 216, 122, 0.18)", borderRadius: "3px" }
                  : undefined
              }
            >
              {sentence}
              {i < sentences.length - 1 ? " " : ""}
            </span>
          )
        })}
      </p>
    </div>
  )
}

/* ─── Sentence Panel ─── */

interface SentencePanelProps {
  sentence: { paragraphId: string; text: string }
  comments: ReaderCommentData[]
  loadingComments: boolean
  onClose: () => void
  onSave: (text: string, visibility: ScopeType) => Promise<void>
  readingContext: ReadingContext
}

export function SentencePanel({
  sentence,
  comments,
  loadingComments,
  onClose,
  onSave,
  readingContext,
}: SentencePanelProps) {
  const [inputValue, setInputValue] = useState("")
  const [scope, setScope] = useState<ScopeType>(
    readingContext.mode === "group" ? "group" : "public"
  )
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bottomOffset, setBottomOffset] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150)
    return () => clearTimeout(timer)
  }, [])

  // Mobile keyboard handling via visualViewport
  // Also accounts for BottomNav height (56px) on mobile
  useEffect(() => {
    const navHeight = window.innerWidth < 768 ? 56 : 0
    const vv = window.visualViewport
    if (!vv) {
      setBottomOffset(navHeight)
      return
    }
    const update = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      setBottomOffset(Math.max(navHeight, keyboardHeight))
    }
    update()
    vv.addEventListener("resize", update)
    vv.addEventListener("scroll", update)
    return () => {
      vv.removeEventListener("resize", update)
      vv.removeEventListener("scroll", update)
    }
  }, [])

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onSave(inputValue.trim(), scope)
      setSubmitted(true)
      setInputValue("")
      setTimeout(() => setSubmitted(false), 1500)
    } catch (e) {
      console.error("[SentencePanel] save failed:", e)
      setError(e instanceof Error ? e.message : "저장에 실패했습니다")
    } finally {
      setSubmitting(false)
    }
  }, [inputValue, scope, submitting, onSave])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-hidden="true" />

      {/* Sheet */}
      <div
        className="relative flex max-h-[75vh] flex-col overflow-hidden rounded-t-2xl border-t border-border/40 bg-card"
        style={{ marginBottom: bottomOffset }}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div className="h-1 w-8 rounded-full" style={{ backgroundColor: "rgba(136, 146, 168, 0.4)" }} aria-hidden="true" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            문장 댓글
          </span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            aria-label="닫기"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>

        {/* Selected sentence */}
        <div className="px-4 pb-3">
          <div
            className="rounded-lg px-3 py-2 text-[13px] leading-normal text-foreground/70 italic"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "rgba(245, 216, 122, 0.04)",
              borderLeft: "2px solid rgba(245, 216, 122, 0.3)",
            }}
          >
            {sentence.text.length > 140 ? sentence.text.slice(0, 140) + "..." : sentence.text}
          </div>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto border-t border-border/20 px-4 py-3 scrollbar-none">
          {loadingComments ? (
            <div className="flex justify-center py-6">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-moonlight border-t-transparent" />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              이 문장에 첫 번째 댓글을 남겨보세요.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase"
                      style={{ backgroundColor: "rgba(245, 216, 122, 0.12)", color: "var(--moonlight)", fontFamily: "var(--font-body)" }}
                    >
                      {comment.user[0]}
                    </div>
                    <span className="text-[11px] font-medium text-foreground/70" style={{ fontFamily: "var(--font-body)" }}>
                      {comment.user}
                    </span>
                    <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="pl-7 text-[13px] leading-relaxed text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/30 px-4 py-3">
          {error && (
            <p className="mb-2 text-[12px] text-red-400" style={{ fontFamily: "var(--font-body)" }}>{error}</p>
          )}
          <div className="mb-2">
            {readingContext.mode === "group" ? (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: "rgba(245, 216, 122, 0.1)",
                  color: "rgba(245, 216, 122, 0.75)",
                  border: "1px solid rgba(245, 216, 122, 0.2)",
                }}
              >
                {readingContext.groupName}
              </span>
            ) : (
              <ScopeSelector scope={scope} onChange={setScope} readingContext={readingContext} />
            )}
          </div>
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              rows={2}
              placeholder={scope === "memo" ? "개인 메모를 남겨보세요..." : "이 문장에 대한 생각을 남겨보세요..."}
              value={inputValue}
              disabled={submitting}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() }
              }}
              className="flex-1 resize-none rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-moonlight/40 disabled:opacity-50"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || submitting}
              className="shrink-0 self-end rounded-lg bg-moonlight px-3 py-2 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim disabled:opacity-40"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {submitted ? "✓" : submitting ? "..." : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Chapter Discussion ─── */

interface ChapterDiscussionProps {
  comments: ReaderCommentData[]
  chapterTitle: string
  readingContext: ReadingContext
  onSave: (text: string, visibility: ScopeType) => Promise<void>
}

export function ChapterDiscussion({
  comments,
  chapterTitle,
  readingContext,
  onSave,
}: ChapterDiscussionProps) {
  const [scope, setScope] = useState<ScopeType>(
    readingContext.mode === "group" ? "group" : "public"
  )
  const [inputValue, setInputValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    if (!inputValue.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onSave(inputValue.trim(), scope)
      setSubmitted(true)
      setInputValue("")
      setTimeout(() => setSubmitted(false), 1500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다")
    } finally {
      setSubmitting(false)
    }
  }, [inputValue, scope, submitting, onSave])

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/40" aria-hidden="true" />
        <span className="shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Chapter Discussion
        </span>
        <div className="h-px flex-1 bg-border/40" aria-hidden="true" />
      </div>

      <h3 className="font-sans text-lg font-bold tracking-tight text-foreground text-balance">
        Thoughts on &ldquo;{chapterTitle}&rdquo;
      </h3>

      <div className="flex flex-col gap-2">
        <div className="mb-1">
          {readingContext.mode === "group" ? (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: "rgba(245, 216, 122, 0.1)",
                color: "rgba(245, 216, 122, 0.75)",
                border: "1px solid rgba(245, 216, 122, 0.2)",
              }}
            >
              {readingContext.groupName}
            </span>
          ) : (
            <ScopeSelector scope={scope} onChange={setScope} readingContext={readingContext} />
          )}
        </div>
        {error && (
          <p className="text-[12px] text-red-400" style={{ fontFamily: "var(--font-body)" }}>{error}</p>
        )}
        <textarea
          placeholder="이 챕터에 대한 생각을 남겨보세요..."
          rows={3}
          value={inputValue}
          disabled={submitting}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full resize-none rounded-lg border border-border/50 bg-secondary/20 px-4 py-3 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-moonlight/40 disabled:opacity-50"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-moonlight px-4 py-2 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim disabled:opacity-40"
            style={{ fontFamily: "var(--font-body)" }}
            disabled={!inputValue.trim() || submitting}
          >
            {submitted ? "✓ 저장됨" : submitting ? "..." : "Post to discussion"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-0">
        {comments.map((comment, idx) => (
          <div
            key={comment.id}
            className={`flex gap-3 py-3.5 ${idx !== comments.length - 1 ? "border-b border-border/20" : ""}`}
          >
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase"
              style={{ backgroundColor: "rgba(245, 216, 122, 0.1)", color: "var(--moonlight)", fontFamily: "var(--font-body)" }}
            >
              {comment.user[0]}
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>{comment.user}</span>
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>{comment.timeAgo}</span>
              </div>
              <p className="text-[14px] leading-relaxed text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            이 챕터에 첫 번째 토론을 시작해보세요.
          </p>
        )}
      </div>
    </section>
  )
}
