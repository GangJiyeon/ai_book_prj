"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroCta() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-moonlight px-7 font-sans text-sm font-semibold text-primary-foreground transition-all hover:bg-moonlight-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => router.push("/books")}
        >
          Get started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/30 px-7 font-sans text-sm font-medium text-secondary-foreground transition-all hover:border-moonlight/30 hover:text-moonlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => {}}
        >
          Browse excerpts
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        No login needed to explore mock excerpts.
      </p>
    </div>
  )
}
