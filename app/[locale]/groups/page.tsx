"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { Users, Plus, X, BookOpen, Lock, Copy, Check, ChevronDown, Search } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { fetchGroups, fetchMyGroups, createGroup } from "@/lib/queries/groups"
import type { Group, FetchGroupsOptions } from "@/lib/queries/groups"

type Tab = "mine" | "browse"
type SortBy = "newest" | "members" | "name"

const SORT_LABELS: Record<SortBy, string> = {
  newest: "Newest",
  members: "Most members",
  name: "Name",
}

/* ── Copy group ID button ─────────────────────────────────── */
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
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground/40 transition-colors hover:text-moonlight"
    >
      {copied
        ? <Check className="h-3 w-3 text-moonlight" />
        : <Copy className="h-3 w-3" />
      }
    </button>
  )
}

/* ── Group card ───────────────────────────────────────────── */
function GroupCard({ group }: { group: Group }) {
  return (
    <Link
      href={`/groups/${group.id}`}
      className="group flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-card px-5 py-4 transition-colors hover:border-moonlight/30 hover:bg-card/80"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          {group.isPrivate && <Lock className="h-3 w-3 shrink-0 text-muted-foreground/60" />}
          <span className="truncate font-sans text-base font-semibold text-foreground transition-colors group-hover:text-moonlight">
            {group.name}
          </span>
          <CopyIdButton id={group.id} />
        </div>
        {group.description && (
          <span className="truncate text-[13px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            {group.description}
          </span>
        )}
        {group.currentBook && (
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground/70" style={{ fontFamily: "var(--font-body)" }}>
            <BookOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">{group.currentBook.title}</span>
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[12px] text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
          {group.memberCount}
        </span>
      </div>
    </Link>
  )
}

/* ── Main page ────────────────────────────────────────────── */
export default function GroupsPage() {
  const { redirectIfNotAuth } = useRequireAuth()
  useEffect(() => { redirectIfNotAuth() }, [redirectIfNotAuth])
  const [tab, setTab] = useState<Tab>("mine")
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("newest")
  const [showSortMenu, setShowSortMenu] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // create modal
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [joinPassword, setJoinPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const load = useCallback(async (opts: FetchGroupsOptions, t: Tab) => {
    setLoading(true)
    try {
      const data = t === "mine" ? await fetchMyGroups(opts) : await fetchGroups(opts)
      setGroups(data)
    } finally {
      setLoading(false)
    }
  }, [])

  // tab or sort 변경 시 재로드
  useEffect(() => {
    setSearch("")
    load({ sortBy }, tab)
  }, [tab, sortBy]) // eslint-disable-line

  function handleSearchChange(value: string) {
    setSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      load({ search: value, sortBy }, tab)
    }, 350)
  }

  function handleCloseModal() {
    setShowModal(false)
    setName(""); setDescription(""); setIsPrivate(false); setJoinPassword(""); setCreateError(null)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true); setCreateError(null)
    try {
      await createGroup(
        name.trim(),
        description.trim(),
        isPrivate,
        isPrivate && joinPassword.trim() ? joinPassword.trim() : null,
      )
      handleCloseModal()
      load({ sortBy }, tab)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create group")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-1">
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">Reading Groups</h1>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              Join a group to read and discuss together.
            </p>
          </div>

          {/* Tab menu */}
          <div className="flex items-center gap-1 border-b border-border/40 mb-4">
            {(["mine", "browse"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? "-mb-px border-b-2 border-moonlight text-moonlight"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {t === "mine" ? "내 그룹" : "그룹 조회"}
              </button>
            ))}
          </div>

          {/* New Group button */}
          <button
            onClick={() => setShowModal(true)}
            className="mb-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-2.5 text-xs text-muted-foreground transition-colors hover:border-moonlight/40 hover:text-moonlight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Plus className="h-3.5 w-3.5" />
            New Group
          </button>

          {/* Search + Sort */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={tab === "browse" ? "이름 또는 그룹 ID로 검색..." : "이름으로 필터..."}
                className="h-8 w-full rounded-lg border border-border bg-secondary/30 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/40 focus:outline-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex h-8 items-center gap-1 rounded-lg border border-border bg-secondary/30 px-3 text-xs text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {SORT_LABELS[sortBy]}
                <ChevronDown className={`h-3 w-3 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
              </button>
              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-xl">
                    {(["newest", "members", "name"] as SortBy[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSortBy(s); setShowSortMenu(false) }}
                        className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                          sortBy === s ? "bg-moonlight/10 text-moonlight" : "text-secondary-foreground hover:bg-secondary/40"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {SORT_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Group list */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card/50" />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                {tab === "mine"
                  ? search ? "검색 결과가 없습니다." : "아직 참여한 그룹이 없습니다."
                  : "그룹을 찾을 수 없습니다."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Create group modal ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sans text-lg font-bold text-foreground">New Group</h2>
              <button
                onClick={handleCloseModal}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4" style={{ fontFamily: "var(--font-body)" }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Group name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Night Readers"
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/50 focus:outline-none"
                  maxLength={60}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will your group read?"
                  rows={3}
                  className="resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/50 focus:outline-none"
                  maxLength={200}
                />
              </div>

              {/* 공개/비공개 토글 */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">Private group</span>
                    <span className="text-[11px] text-muted-foreground">
                      {isPrivate ? "Approval or password required" : "Anyone can join"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsPrivate(!isPrivate); setJoinPassword("") }}
                  className={`relative h-5 w-9 rounded-full transition-colors ${isPrivate ? "bg-moonlight" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isPrivate ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </button>
              </div>

              {isPrivate && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Password <span className="font-normal text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Leave empty for approval flow"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-moonlight/50 focus:outline-none"
                    maxLength={50}
                  />
                </div>
              )}

              {createError && <p className="text-xs text-red-500">{createError}</p>}

              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="rounded-lg bg-moonlight py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? "Creating..." : "Create Group"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
