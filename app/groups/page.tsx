"use client"

import Link from "next/link"
import { Users } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { MOCK_GROUPS } from "@/lib/mock-data"

export default function GroupsPage() {
  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-1">
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
              Reading Groups
            </h1>
            <p
              className="text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Join a group to read and discuss together.
            </p>
          </div>

          {/* Group list */}
          <div className="flex flex-col gap-3">
            {MOCK_GROUPS.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="group flex items-start justify-between gap-4 rounded-xl border border-border/40 px-5 py-4 transition-colors hover:border-moonlight/30"
                style={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className="font-sans text-base font-semibold text-foreground group-hover:text-moonlight transition-colors"
                  >
                    {group.name}
                  </span>
                  <span
                    className="text-[13px] text-muted-foreground"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {group.description}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span
                    className="text-[12px] text-muted-foreground"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {group.members}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
