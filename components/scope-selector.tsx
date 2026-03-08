"use client"

import type { ScopeType, ReadingContext } from "@/lib/mock-data"

interface ScopeSelectorProps {
  scope: ScopeType
  onChange: (scope: ScopeType) => void
  readingContext: ReadingContext
}

type Pill = { value: ScopeType; label: string }

export function ScopeSelector({ scope, onChange, readingContext }: ScopeSelectorProps) {
  const isGroup = readingContext.mode === "group"

  const pills: Pill[] = [
    { value: "public", label: "Public" },
    { value: "memo", label: "Memo" },
    ...(isGroup
      ? [{ value: "group" as ScopeType, label: `Group: ${(readingContext as Extract<ReadingContext, { mode: "group" }>).groupName}` }]
      : []),
  ]

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {pills.map((pill) => {
        const isActive = scope === pill.value
        return (
          <button
            key={pill.value}
            onClick={() => onChange(pill.value)}
            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors"
            style={{
              fontFamily: "var(--font-body)",
              backgroundColor: isActive ? "rgba(245, 216, 122, 0.15)" : "transparent",
              color: isActive ? "var(--moonlight)" : "rgba(136, 146, 168, 0.7)",
              border: isActive
                ? "1px solid rgba(245, 216, 122, 0.3)"
                : "1px solid rgba(136, 146, 168, 0.2)",
            }}
          >
            {pill.label}
          </button>
        )
      })}
    </div>
  )
}
