"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { ReaderParagraph as ParagraphType, ReadingContext, ScopeType, CommentWithScope } from "@/lib/mock-data"
import type { ReaderComment } from "@/lib/mock-data"
import { Anchor } from "lucide-react"
import { ScopeSelector } from "@/components/scope-selector"

interface ReaderParagraphProps {
  paragraph: ParagraphType
  isSelected: boolean
  onSelect: (id: string) => void
}

export function ReaderParagraph({
  paragraph,
  isSelected,
  onSelect,
}: ReaderParagraphProps) {
  const commentCount = paragraph.comments.length

  return (
    <div
      className="group relative"
      role="button"
      tabIndex={0}
      aria-label={`Paragraph with ${commentCount} comments. Click to view.`}
      onClick={() => onSelect(paragraph.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(paragraph.id)
        }
      }}
    >
      {/* Hover / selected highlight */}
      <div
        className="absolute -left-3 -right-3 -top-1.5 -bottom-1.5 rounded-lg transition-colors duration-200 sm:-left-4 sm:-right-4 sm:-top-2 sm:-bottom-2"
        style={{
          backgroundColor: isSelected
            ? "rgba(245, 216, 122, 0.06)"
            : "transparent",
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-2">
        {/* Anchor icon - visible on hover or when selected */}
        <div
          className={`mt-0.5 flex shrink-0 items-center justify-center transition-opacity duration-200 ${
            isSelected || commentCount > 0
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-60"
          }`}
        >
          <Anchor
            className="h-3.5 w-3.5"
            style={{
              color: isSelected
                ? "var(--moonlight)"
                : commentCount > 0
                  ? "rgba(245, 216, 122, 0.4)"
                  : "var(--muted-foreground)",
            }}
          />
        </div>

        {/* Paragraph text */}
        <p
          className="cursor-pointer text-foreground/90 leading-[1.6] transition-colors duration-200 group-hover:text-foreground"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(16px, 2.5vw, 18px)",
          }}
        >
          {paragraph.text}
        </p>

        {/* Comment count badge */}
        {commentCount > 0 && (
          <span
            className="mt-1 flex shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: isSelected
                ? "rgba(245, 216, 122, 0.15)"
                : "rgba(245, 216, 122, 0.08)",
              color: isSelected
                ? "var(--moonlight)"
                : "rgba(245, 216, 122, 0.6)",
            }}
          >
            {commentCount}
          </span>
        )}
      </div>

      {/* Left accent bar when selected */}
      {isSelected && (
        <div
          className="absolute -left-3 top-0 bottom-0 w-0.5 rounded-full sm:-left-4"
          style={{ backgroundColor: "var(--moonlight)" }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

/* ─── Group badge (shown above input in group mode) ─── */

function GroupBadge({ groupName }: { groupName: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        fontFamily: "var(--font-body)",
        backgroundColor: "rgba(245, 216, 122, 0.1)",
        color: "rgba(245, 216, 122, 0.75)",
        border: "1px solid rgba(245, 216, 122, 0.2)",
      }}
    >
      {groupName}
    </span>
  )
}

/* ─── Helpers ─── */

function isCommentVisible(visibility: ScopeType, groupId: string | undefined, readingContext: ReadingContext): boolean {
  if (visibility === "public") return true
  if (visibility === "memo") return true
  if (visibility === "group") {
    return readingContext.mode === "group" && groupId === readingContext.groupId
  }
  return false
}

/* ─── Comment Panel ─── */

interface CommentPanelProps {
  paragraph: ParagraphType | null
  onClose: () => void
  readingContext: ReadingContext
}

export function CommentPanel({ paragraph, onClose, readingContext }: CommentPanelProps) {
  const [scope, setScope] = useState<ScopeType>(
    readingContext.mode === "group" ? "group" : "public"
  )
  const [inputValue, setInputValue] = useState("")
  const [localComments, setLocalComments] = useState<CommentWithScope[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    const newComment: CommentWithScope = {
      id: `p-${Date.now()}`,
      content: inputValue.trim(),
      visibility: scope,
      groupId:
        scope === "group" && readingContext.mode === "group"
          ? readingContext.groupId
          : undefined,
    }
    setLocalComments((prev) => [...prev, newComment])
    setInputValue("")
  }, [inputValue, scope, readingContext])

  if (!paragraph) return null

  const visibleLocal = localComments.filter((c) =>
    isCommentVisible(c.visibility, c.groupId, readingContext)
  )

  return (
    <div
      ref={panelRef}
      className="flex h-full flex-col border-l border-border/40 bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <span
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Paragraph comments
        </span>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          aria-label="Close comments"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="3" x2="11" y2="11" />
            <line x1="11" y1="3" x2="3" y2="11" />
          </svg>
        </button>
      </div>

      {/* Selected paragraph preview */}
      <div className="border-b border-border/20 px-4 py-3">
        <div
          className="rounded-lg px-3 py-2.5 text-[13px] leading-[1.55] text-foreground/70 italic"
          style={{
            fontFamily: "var(--font-body)",
            backgroundColor: "rgba(245, 216, 122, 0.04)",
            borderLeft: "2px solid rgba(245, 216, 122, 0.3)",
          }}
        >
          {paragraph.text.length > 160
            ? paragraph.text.slice(0, 160) + "..."
            : paragraph.text}
        </div>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-none">
        {paragraph.comments.length === 0 && visibleLocal.length === 0 ? (
          <p
            className="py-8 text-center text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No comments on this paragraph yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Existing mock comments (all treated as public) */}
            {paragraph.comments.map((comment) => (
              <MockCommentRow key={comment.id} comment={comment} />
            ))}
            {/* New local comments (filtered by scope/context) */}
            {visibleLocal.map((comment) => (
              <LocalCommentRow key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

      {/* Comment input */}
      <div className="border-t border-border/30 px-4 py-3">
        <div className="mb-2">
          {readingContext.mode === "group" ? (
            <GroupBadge groupName={readingContext.groupName} />
          ) : (
            <ScopeSelector scope={scope} onChange={setScope} readingContext={readingContext} />
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Leave a thought..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
            className="flex-1 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-moonlight/40"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            onClick={handleSubmit}
            className="shrink-0 rounded-lg bg-moonlight px-3 py-2 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim disabled:opacity-40"
            style={{ fontFamily: "var(--font-body)" }}
            disabled={!inputValue.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile Bottom Sheet ─── */

interface MobileCommentSheetProps {
  paragraph: ParagraphType | null
  onClose: () => void
  readingContext: ReadingContext
}

export function MobileCommentSheet({
  paragraph,
  onClose,
  readingContext,
}: MobileCommentSheetProps) {
  const [scope, setScope] = useState<ScopeType>(
    readingContext.mode === "group" ? "group" : "public"
  )
  const [inputValue, setInputValue] = useState("")
  const [localComments, setLocalComments] = useState<CommentWithScope[]>([])
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    if (paragraph) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [paragraph])

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    const newComment: CommentWithScope = {
      id: `m-${Date.now()}`,
      content: inputValue.trim(),
      visibility: scope,
      groupId:
        scope === "group" && readingContext.mode === "group"
          ? readingContext.groupId
          : undefined,
    }
    setLocalComments((prev) => [...prev, newComment])
    setInputValue("")
  }, [inputValue, scope, readingContext])

  if (!paragraph) return null

  const visibleLocal = localComments.filter((c) =>
    isCommentVisible(c.visibility, c.groupId, readingContext)
  )

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="relative flex max-h-[75vh] flex-col overflow-hidden rounded-t-2xl border-t border-border/40 bg-card"
      >
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ backgroundColor: "rgba(136, 146, 168, 0.4)" }}
            aria-hidden="true"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <span
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Paragraph comments
          </span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>

        {/* Selected paragraph preview */}
        <div className="border-b border-border/20 px-4 pb-3">
          <div
            className="rounded-lg px-3 py-2 text-[13px] leading-normal text-foreground/70 italic"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: "rgba(245, 216, 122, 0.04)",
              borderLeft: "2px solid rgba(245, 216, 122, 0.3)",
            }}
          >
            {paragraph.text.length > 120
              ? paragraph.text.slice(0, 120) + "..."
              : paragraph.text}
          </div>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-none">
          {paragraph.comments.length === 0 && visibleLocal.length === 0 ? (
            <p
              className="py-6 text-center text-xs text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              No comments on this paragraph yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {paragraph.comments.map((comment) => (
                <MockCommentRow key={comment.id} comment={comment} />
              ))}
              {visibleLocal.map((comment) => (
                <LocalCommentRow key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border/30 px-4 py-3">
          <div className="mb-2">
            {readingContext.mode === "group" ? (
              <GroupBadge groupName={readingContext.groupName} />
            ) : (
              <ScopeSelector scope={scope} onChange={setScope} readingContext={readingContext} />
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Leave a thought..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }}
              className="flex-1 rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-moonlight/40"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button
              onClick={handleSubmit}
              className="shrink-0 rounded-lg bg-moonlight px-3 py-2 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim disabled:opacity-40"
              style={{ fontFamily: "var(--font-body)" }}
              disabled={!inputValue.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared comment row sub-components ─── */

function MockCommentRow({ comment }: { comment: ReaderComment }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase"
          style={{
            backgroundColor: "rgba(245, 216, 122, 0.12)",
            color: "var(--moonlight)",
            fontFamily: "var(--font-body)",
          }}
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
  )
}

function LocalCommentRow({ comment }: { comment: CommentWithScope }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase"
          style={{
            backgroundColor: "rgba(136, 146, 168, 0.12)",
            color: "rgba(200, 210, 230, 0.8)",
            fontFamily: "var(--font-body)",
          }}
        >
          Y
        </div>
        <span className="text-[11px] font-medium text-foreground/70" style={{ fontFamily: "var(--font-body)" }}>
          you
        </span>
        <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          just now
        </span>
      </div>
      <p className="pl-7 text-[13px] leading-relaxed text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
        {comment.content}
      </p>
    </div>
  )
}

/* ─── Chapter Discussion ─── */

interface ChapterDiscussionProps {
  comments: ReaderComment[]
  chapterTitle: string
  readingContext: ReadingContext
}

export function ChapterDiscussion({
  comments,
  chapterTitle,
  readingContext,
}: ChapterDiscussionProps) {
  const [scope, setScope] = useState<ScopeType>(
    readingContext.mode === "group" ? "group" : "public"
  )
  const [inputValue, setInputValue] = useState("")
  const [localComments, setLocalComments] = useState<CommentWithScope[]>([])

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    const newComment: CommentWithScope = {
      id: `d-${Date.now()}`,
      content: inputValue.trim(),
      visibility: scope,
      groupId: readingContext.mode === "group" ? readingContext.groupId : undefined,
    }
    setLocalComments((prev) => [...prev, newComment])
    setInputValue("")
  }, [inputValue, scope, readingContext])

  const visibleLocal = localComments.filter((c) =>
    isCommentVisible(c.visibility, c.groupId, readingContext)
  )

  return (
    <section className="flex flex-col gap-5">
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/40" aria-hidden="true" />
        <span
          className="shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Chapter Discussion
        </span>
        <div className="h-px flex-1 bg-border/40" aria-hidden="true" />
      </div>

      <h3 className="font-sans text-lg font-bold tracking-tight text-foreground text-balance">
        Thoughts on &ldquo;{chapterTitle}&rdquo;
      </h3>

      {/* Large comment input */}
      <div className="flex flex-col gap-2">
        <div className="mb-1">
          {readingContext.mode === "group" ? (
            <GroupBadge groupName={readingContext.groupName} />
          ) : (
            <ScopeSelector scope={scope} onChange={setScope} readingContext={readingContext} />
          )}
        </div>
        <textarea
          placeholder="Share your thoughts on this chapter..."
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full resize-none rounded-lg border border-border/50 bg-secondary/20 px-4 py-3 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-moonlight/40"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-moonlight px-4 py-2 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-moonlight-dim disabled:opacity-40"
            style={{ fontFamily: "var(--font-body)" }}
            disabled={!inputValue.trim()}
          >
            Post to discussion
          </button>
        </div>
      </div>

      {/* Thread-style comments */}
      <div className="flex flex-col gap-0">
        {/* Existing mock comments (always shown as public) */}
        {comments.map((comment, idx) => (
          <div
            key={comment.id}
            className={`flex gap-3 py-3.5 ${
              idx !== comments.length - 1 || visibleLocal.length > 0
                ? "border-b border-border/20"
                : ""
            }`}
          >
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase"
              style={{
                backgroundColor: "rgba(245, 216, 122, 0.1)",
                color: "var(--moonlight)",
                fontFamily: "var(--font-body)",
              }}
            >
              {comment.user[0]}
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                  {comment.user}
                </span>
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  {comment.timeAgo}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                {comment.text}
              </p>
            </div>
          </div>
        ))}

        {/* New local comments */}
        {visibleLocal.map((comment, idx) => (
          <div
            key={comment.id}
            className={`flex gap-3 py-3.5 ${idx !== visibleLocal.length - 1 ? "border-b border-border/20" : ""}`}
          >
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase"
              style={{
                backgroundColor: "rgba(136, 146, 168, 0.1)",
                color: "rgba(200, 210, 230, 0.8)",
                fontFamily: "var(--font-body)",
              }}
            >
              Y
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                  you
                </span>
                <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  just now
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
