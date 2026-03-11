"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { ArrowLeft, Users, BookOpen, X, Lock, UserPlus, Check, UserMinus, Copy } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import {
  fetchGroupById,
  setGroupBook,
  joinGroup,
  adminAddMember,
  approveMember,
  rejectMember,
} from "@/lib/queries/groups"
import { searchBooksByTitle } from "@/lib/queries/books"
import type { GroupDetail } from "@/lib/queries/groups"

function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy group ID"
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:text-moonlight"
    >
      {copied
        ? <Check className="h-3.5 w-3.5 text-moonlight" />
        : <Copy className="h-3.5 w-3.5" />
      }
    </button>
  )
}

export default function GroupDetailPage() {
  const { requireAuth, redirectIfNotAuth } = useRequireAuth()
  useEffect(() => { redirectIfNotAuth() }, [redirectIfNotAuth])
  const params = useParams()
  const groupId = params.groupId as string
  const [group, setGroup] = useState<GroupDetail | null | undefined>(undefined)

  // book modal
  const [showBookModal, setShowBookModal] = useState(false)
  const [bookQuery, setBookQuery] = useState("")
  const [bookResults, setBookResults] = useState<{ id: string; title: string; author: string }[]>([])
  const [searching, setSearching] = useState(false)
  const [setting, setSetting] = useState(false)

  // join
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [joining, setJoining] = useState(false)
  const [joinMsg, setJoinMsg] = useState<{ type: "error" | "success"; text: string } | null>(null)

  // admin: add member
  const [showAddModal, setShowAddModal] = useState(false)
  const [addUsername, setAddUsername] = useState("")
  const [adding, setAdding] = useState(false)
  const [addMsg, setAddMsg] = useState<{ type: "error" | "success"; text: string } | null>(null)

  // admin: approve/reject
  const [actingOn, setActingOn] = useState<string | null>(null)

  const reload = useCallback(() => {
    fetchGroupById(groupId).then(setGroup)
  }, [groupId])

  useEffect(() => { reload() }, [reload])

  useEffect(() => {
    if (!bookQuery.trim()) { setBookResults([]); return }
    setSearching(true)
    const timer = setTimeout(() => {
      searchBooksByTitle(bookQuery).then(setBookResults).finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [bookQuery])

  // ── Join handlers ──────────────────────────────────────────

  async function handleJoin(password?: string) {
    setJoining(true)
    setJoinMsg(null)
    try {
      const result = await joinGroup(groupId, password)
      if (result === "approved") {
        reload()
      } else if (result === "pending") {
        setShowPasswordModal(false)
        setJoinMsg({ type: "success", text: "Request sent! Waiting for admin approval." })
        reload()
      } else if (result === "wrong_password") {
        setJoinMsg({ type: "error", text: "Wrong password. Please try again." })
      } else if (result === "already_member") {
        setJoinMsg({ type: "error", text: "You are already a member." })
        reload()
      }
    } catch {
      setJoinMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setJoining(false)
    }
  }

  function handleJoinClick() {
    requireAuth(() => {
      if (!group) return
      if (!group.isPrivate) {
        handleJoin()
      } else if (group.hasPassword) {
        setPasswordInput("")
        setJoinMsg(null)
        setShowPasswordModal(true)
      } else {
        // 비공개 + 비밀번호 없음 → 승인 요청
        handleJoin()
      }
    })
  }

  // ── Book select handler ───────────────────────────────────

  async function handleSelectBook(bookId: string) {
    setSetting(true)
    try {
      await setGroupBook(groupId, bookId)
      setShowBookModal(false)
      setBookQuery("")
      setBookResults([])
      reload()
    } finally {
      setSetting(false)
    }
  }

  // ── Admin: add member ─────────────────────────────────────

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!addUsername.trim()) return
    setAdding(true)
    setAddMsg(null)
    try {
      const result = await adminAddMember(groupId, addUsername.trim())
      if (result === "added") {
        setAddMsg({ type: "success", text: `@${addUsername.trim()} added successfully.` })
        setAddUsername("")
        reload()
      } else if (result === "already_member") {
        setAddMsg({ type: "error", text: "This user is already a member." })
      } else if (result === "user_not_found") {
        setAddMsg({ type: "error", text: "User not found." })
      } else {
        setAddMsg({ type: "error", text: "Not authorized." })
      }
    } catch {
      setAddMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setAdding(false)
    }
  }

  // ── Admin: approve / reject ───────────────────────────────

  async function handleApprove(userId: string) {
    setActingOn(userId)
    try {
      await approveMember(groupId, userId)
      reload()
    } finally {
      setActingOn(null)
    }
  }

  async function handleReject(userId: string) {
    setActingOn(userId)
    try {
      await rejectMember(groupId, userId)
      reload()
    } finally {
      setActingOn(null)
    }
  }

  // ── Loading / not found ───────────────────────────────────

  if (group === undefined) {
    return (
      <>
        <StarField />
        <div className="relative z-10 min-h-screen bg-background">
          <Navbar />
          <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
            <div className="flex flex-col gap-4">
              <div className="h-8 w-40 animate-pulse rounded-lg bg-card" />
              <div className="h-6 w-64 animate-pulse rounded-lg bg-card" />
              <div className="mt-4 h-24 animate-pulse rounded-xl bg-card" />
            </div>
          </main>
        </div>
      </>
    )
  }

  if (group === null) {
    return (
      <>
        <StarField />
        <div className="relative z-10 flex min-h-screen flex-col bg-background">
          <Navbar />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <h1 className="font-sans text-xl font-bold text-foreground">Group not found</h1>
            <Link href="/groups" className="text-sm text-moonlight hover:underline" style={{ fontFamily: "var(--font-body)" }}>
              Back to groups
            </Link>
          </div>
        </div>
      </>
    )
  }

  // ── Join button state ─────────────────────────────────────
  const joinButton = (() => {
    if (group.isMember) return null
    if (group.hasPendingRequest) {
      return (
        <span className="rounded-lg border border-border/60 px-4 py-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Request sent
        </span>
      )
    }
    const label = group.isPrivate && !group.hasPassword ? "Request to Join" : "Join Group"
    return (
      <button
        onClick={handleJoinClick}
        disabled={joining}
        className="flex items-center gap-1.5 rounded-lg bg-moonlight px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {group.isPrivate && <Lock className="h-3 w-3" />}
        {joining ? "..." : label}
      </button>
    )
  })()

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          {/* Back link */}
          <Link
            href="/groups"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-moonlight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All groups
          </Link>

          {/* Group header */}
          <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                {group.isPrivate && <Lock className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />}
                <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
                  {group.name}
                </h1>
                <CopyIdButton id={group.id} />
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {joinButton}
                {joinMsg && (
                  <p
                    className={`text-[11px] ${joinMsg.type === "error" ? "text-red-500" : "text-moonlight"}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {joinMsg.text}
                  </p>
                )}
              </div>
            </div>

            {group.description && (
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {group.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  {group.memberCount} members
                </span>
              </div>
              {group.isMember && (
                <span className="rounded-full bg-moonlight/10 px-2 py-0.5 text-[10px] font-medium text-moonlight" style={{ fontFamily: "var(--font-body)" }}>
                  {group.isAdmin ? "Admin" : "Member"}
                </span>
              )}
              {group.isPrivate && (
                <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  Private
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 h-px bg-border/40" />

          {/* Admin: pending requests + add member */}
          {group.isAdmin && (
            <section className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                  Member Management
                </h2>
                <button
                  onClick={() => { setShowAddModal(true); setAddUsername(""); setAddMsg(null) }}
                  className="flex items-center gap-1 text-[11px] text-moonlight hover:underline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <UserPlus className="h-3 w-3" />
                  Add member
                </button>
              </div>

              {group.pendingMembers.length > 0 ? (
                <div className="flex flex-col gap-2 rounded-xl border border-border/40 p-4">
                  <p className="text-[11px] font-medium text-muted-foreground mb-1" style={{ fontFamily: "var(--font-body)" }}>
                    Pending requests ({group.pendingMembers.length})
                  </p>
                  {group.pendingMembers.map((pm) => (
                    <div key={pm.userId} className="flex items-center justify-between gap-3">
                      <span className="text-[13px] text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                        @{pm.username}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleApprove(pm.userId)}
                          disabled={actingOn === pm.userId}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-moonlight/10 text-moonlight transition-colors hover:bg-moonlight/20 disabled:opacity-40"
                          title="Approve"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(pm.userId)}
                          disabled={actingOn === pm.userId}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                          title="Reject"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground/60" style={{ fontFamily: "var(--font-body)" }}>
                  No pending requests.
                </p>
              )}
            </section>
          )}

          {/* Currently reading */}
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                Currently Reading
              </h2>
              {group.isAdmin && (
                <button
                  onClick={() => setShowBookModal(true)}
                  className="text-[11px] text-moonlight hover:underline"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {group.currentBook ? "Change book" : "Select book"}
                </button>
              )}
            </div>

            {group.currentBook ? (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/40 px-5 py-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-sans text-[14px] font-semibold text-foreground leading-snug">
                    {group.currentBook.title}
                  </span>
                  <span className="text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                    {group.currentBook.author}
                  </span>
                </div>
                <Link
                  href={`/read/${group.currentBook.id}/1?groupId=${group.id}`}
                  className="shrink-0 rounded-lg border border-moonlight/25 bg-moonlight/10 px-3.5 py-2 text-[12px] font-semibold text-moonlight transition-colors hover:bg-moonlight/20"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Read in group
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                No book selected yet.
              </p>
            )}
          </section>

          {/* Recent activity */}
          <section>
            <h2 className="mb-4 text-[11px] uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              Recent Activity
            </h2>

            {group.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                No activity yet. Start reading together!
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {group.recentActivity.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex gap-3 py-3.5 ${idx !== group.recentActivity.length - 1 ? "border-b border-border/20" : ""}`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moonlight/10 text-[10px] font-bold uppercase text-moonlight" style={{ fontFamily: "var(--font-body)" }}>
                      {item.user[0]}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12px] font-medium text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>
                          {item.user}
                        </span>
                        {item.bookTitle && (
                          <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                            on {item.bookTitle}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                          · {item.timeAgo}
                        </span>
                      </div>
                      {item.quote && (
                        <p className="mt-1 border-l-2 border-moonlight/30 pl-2 text-[12px] italic text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                          {item.quote}
                        </p>
                      )}
                      <p className="text-[13px] leading-relaxed text-foreground/75" style={{ fontFamily: "var(--font-body)" }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ── Password modal (private + password) ─────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)} />
          <div className="relative w-full max-w-xs rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-base font-bold text-foreground">Enter Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Group password"
                type="text"
                autoFocus
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/50 focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
                onKeyDown={(e) => { if (e.key === "Enter") handleJoin(passwordInput) }}
              />
              {joinMsg?.type === "error" && (
                <p className="text-xs text-red-500" style={{ fontFamily: "var(--font-body)" }}>{joinMsg.text}</p>
              )}
              <button
                onClick={() => handleJoin(passwordInput)}
                disabled={joining || !passwordInput.trim()}
                className="rounded-lg bg-moonlight py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {joining ? "Joining..." : "Join Group"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin: add member modal ──────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-xs rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-base font-bold text-foreground">Add Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="flex flex-col gap-3">
              <input
                value={addUsername}
                onChange={(e) => setAddUsername(e.target.value)}
                placeholder="Username"
                autoFocus
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/50 focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
              {addMsg && (
                <p
                  className={`text-xs ${addMsg.type === "error" ? "text-red-500" : "text-moonlight"}`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {addMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={adding || !addUsername.trim()}
                className="rounded-lg bg-moonlight py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {adding ? "Adding..." : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Book select modal ────────────────────────────────── */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBookModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-sans text-lg font-bold text-foreground">Select a Book</h2>
              <button
                onClick={() => setShowBookModal(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/50 focus:outline-none"
              style={{ fontFamily: "var(--font-body)" }}
              autoFocus
            />

            <div className="mt-3 flex flex-col gap-1 max-h-60 overflow-y-auto">
              {searching && (
                <p className="py-4 text-center text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>Searching...</p>
              )}
              {!searching && bookQuery && bookResults.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>No books found.</p>
              )}
              {bookResults.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleSelectBook(book.id)}
                  disabled={setting}
                  className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary/40 disabled:opacity-50"
                >
                  <span className="text-sm font-medium text-foreground" style={{ fontFamily: "var(--font-body)" }}>{book.title}</span>
                  <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>{book.author}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
