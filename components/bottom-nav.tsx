"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, PenLine, Library, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/books", icon: BookOpen, label: "Books" },
  { href: "/sentences/new", icon: PenLine, label: "Share", accent: true },
  { href: "/saved", icon: Library, label: "Bookshelf" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ href, icon: Icon, label, accent }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href)

          if (accent) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center"
                aria-label={label}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moonlight text-white shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors",
                isActive ? "text-moonlight" : "text-muted-foreground"
              )}
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
              <span
                className="text-[10px] font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
