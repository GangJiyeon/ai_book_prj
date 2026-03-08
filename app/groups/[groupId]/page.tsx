"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Users, BookOpen } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { getGroupById, mockBooks } from "@/lib/mock-data"

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string

  const group = getGroupById(groupId)

  if (!group) {
    return (
      <>
        <StarField />
        <div
          className="relative z-10 flex min-h-screen flex-col"
          style={{
            background: "linear-gradient(180deg, #080c18 0%, #0a0e1a 30%, #0f1629 70%, #0a0e1a 100%)",
          }}
        >
          <Navbar />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <h1 className="font-sans text-xl font-bold text-foreground">Group not found</h1>
            <Link
              href="/groups"
              className="text-sm text-moonlight hover:underline"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Back to groups
            </Link>
          </div>
        </div>
      </>
    )
  }

  const groupBooks = group.bookIds
    .map((id) => mockBooks.find((b) => b.id === id))
    .filter(Boolean) as (typeof mockBooks)[number][]

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
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
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
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              {group.name}
            </h1>
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {group.description}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className="text-[12px] text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {group.members} members
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-border/40" />

          {/* Currently reading */}
          <section className="mb-10">
            <h2
              className="mb-4 text-[11px] uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Currently Reading
            </h2>

            <div className="flex flex-col gap-3">
              {groupBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/40 px-5 py-4"
                  style={{ backgroundColor: "rgba(15, 22, 41, 0.6)" }}
                >
                  {/* Book cover strip */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="h-14 w-9 shrink-0 rounded-md"
                      style={{ background: book.coverGradient }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span
                        className="font-sans text-[14px] font-semibold text-foreground leading-snug"
                      >
                        {book.title}
                      </span>
                      <span
                        className="text-[12px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {book.author}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/read/${book.id}/1?groupId=${group.id}`}
                    className="shrink-0 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-colors"
                    style={{
                      fontFamily: "var(--font-body)",
                      backgroundColor: "rgba(245, 216, 122, 0.12)",
                      color: "var(--moonlight)",
                      border: "1px solid rgba(245, 216, 122, 0.25)",
                    }}
                  >
                    Read in group
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <h2
              className="mb-4 text-[11px] uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Recent Activity
            </h2>

            <div className="flex flex-col gap-0">
              {group.recentActivity.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex gap-3 py-3.5 ${
                    idx !== group.recentActivity.length - 1 ? "border-b border-border/20" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold uppercase"
                    style={{
                      backgroundColor: "rgba(245, 216, 122, 0.1)",
                      color: "var(--moonlight)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.user[0]}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[12px] font-medium text-foreground/80"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.user}
                      </span>
                      <span
                        className="text-[10px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        on {item.bookTitle}
                      </span>
                      <span
                        className="text-[10px] text-muted-foreground"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        · {item.timeAgo}
                      </span>
                    </div>
                    <p
                      className="text-[13px] leading-relaxed text-foreground/75"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
