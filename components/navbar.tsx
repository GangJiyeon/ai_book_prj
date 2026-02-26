"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Search, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/bookshelf", label: "Bookshelf" },
  { href: "/settings", label: "Profile" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-md"
      style={{ backgroundColor: "rgba(10, 14, 26, 0.85)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Left: brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-5 w-5 text-moonlight" aria-hidden="true" />
          <span className="font-sans text-lg font-bold tracking-tight text-foreground">
            Night<span className="text-moonlight">Page</span>
          </span>
        </Link>

        {/* Center: desktop links */}
        <div className="hidden md:flex items-center gap-1" style={{ fontFamily: "var(--font-body)" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-lg transition-colors",
                  isActive
                    ? "text-moonlight bg-moonlight/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right: search icon + sign in */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/login"
            className="hidden md:inline-flex h-8 items-center justify-center rounded-lg border border-border bg-secondary/30 px-4 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden md:inline-flex h-8 items-center justify-center rounded-lg border border-border bg-secondary/30 px-4 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Sign up
          </Link>
          {/* Mobile hamburger */}
          <button
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-navy-deep/95 backdrop-blur-md px-4 pb-4 pt-2">
          <div className="flex flex-col gap-1" style={{ fontFamily: "var(--font-body)" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive
                      ? "text-moonlight bg-moonlight/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/login"
              className="mt-2 h-9 w-full rounded-lg border border-border bg-secondary/30 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="mt-2 h-9 w-full rounded-lg border border-border bg-secondary/30 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
              onClick={() => setMobileOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
