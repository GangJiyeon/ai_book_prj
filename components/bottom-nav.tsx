"use client"

import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import { Home, BookOpen, PenLine, Users, Library } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export function BottomNav() {
  const t = useTranslations("nav")
  const pathname = usePathname()

  const tabs = [
    { href: "/" as const, icon: Home, label: t("home") },
    { href: "/books" as const, icon: BookOpen, label: t("books") },
    { href: "/sentences/new" as const, icon: PenLine, label: t("share"), accent: true },
    { href: "/groups" as const, icon: Users, label: t("groups") },
    { href: "/saved" as const, icon: Library, label: t("bookshelf") },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ href, icon: Icon, label, accent }) => {
          const isActive =
            href === "/" ? /^\/[^/]+\/?$/.test(pathname) : pathname.includes(href)

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
