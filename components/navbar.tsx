"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Search, User, PenLine, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const isLoggedIn = !!user
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    setUser(stored ? JSON.parse(stored) : null)
  }, [pathname])

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  function handleLogout() {
    localStorage.removeItem("user")
    setUser(null)
    setAvatarOpen(false)
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const mainNavLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/groups", label: "Groups" },
    { href: "/saved", label: "Bookshelf" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-md bg-card/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-5 w-5 text-moonlight" aria-hidden="true" />
          <span className="font-sans text-lg font-bold tracking-tight text-foreground">
            book<span className="text-moonlight">i</span>
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-4" style={{ fontFamily: "var(--font-body)" }}>
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative px-3 py-1 text-sm transition-colors",
                  isActive
                    ? "text-moonlight after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-moonlight"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Share button — desktop only */}
          <Link
            href="/sentences/new"
            className="hidden md:inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-moonlight px-3 text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <PenLine className="h-3.5 w-3.5" />
            Share
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Search */}
          <button
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Auth — desktop only */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="h-8 inline-flex items-center justify-center rounded-lg border border-border bg-secondary/30 px-4 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="h-8 inline-flex items-center justify-center rounded-lg border border-border bg-secondary/30 px-4 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                  aria-label="Open user menu"
                >
                  <User className="h-4 w-4" />
                </button>
                {avatarOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-card py-1 shadow-lg"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/30 transition-colors"
                      onClick={() => setAvatarOpen(false)}
                    >
                      Setting
                    </Link>
                    <div className="my-1 h-px bg-border/40" />
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-hotpink hover:bg-secondary/30 transition-colors"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
