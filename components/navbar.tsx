"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Search, Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const isLoggedIn = !!user

  useEffect(() => {
    const stored = localStorage.getItem("user")
    setUser(stored ? JSON.parse(stored) : null)
  }, [pathname])

  function handleLogout() {
    localStorage.removeItem("user")
    setUser(null)
    setAvatarOpen(false)
    setMobileOpen(false)
  }

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileOpen])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(e.target as Node)
      ) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const mainNavLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-md"
      style={{ backgroundColor: "rgba(10, 14, 26, 0.85)" }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-5 w-5 text-moonlight" aria-hidden="true" />
          <span className="font-sans text-lg font-bold tracking-tight text-foreground">
            Night<span className="text-moonlight">Page</span>
          </span>
        </Link>

        {/* Nav links desktop */}
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
                    ? "text-moonlight after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-moonlight"
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
          <button
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>

          {!isLoggedIn ? (
            <>
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
            </>
          ) : (
            <div className="relative" ref={avatarRef}>
              <button
                onClick={() => setAvatarOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
                aria-label="Open menu"
              >
                <User className="h-4 w-4" />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-navy-deep/95 py-1 shadow-lg" style={{ fontFamily: "var(--font-body)" }}>
                  <Link
                    href="/bookshelf"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/30 transition-colors"
                    onClick={() => setAvatarOpen(false)}
                  >
                    My Bookshelf
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-secondary/30 transition-colors"
                    onClick={() => setAvatarOpen(false)}
                  >
                    Profile
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

          {/* mobile login button (logged out only) */}
          {!isLoggedIn && (
            <Link
              href="/login"
              className="flex md:hidden h-8 items-center justify-center rounded-lg border border-border bg-secondary/30 px-3 text-xs font-medium text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Login
            </Link>
          )}

          {/* mobile hamburger */}
          <button
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] min-h-screen backdrop-blur-md p-4"
          style={{
            backgroundColor: "rgba(10, 14, 26, 0.98)",
            fontFamily: "var(--font-body)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-sans text-lg font-bold text-foreground">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4" style={{ fontFamily: "var(--font-body)" }}>
            {/* Navigation section */}
            <Link
              href="/"
              className={cn(
                "px-3 py-2 text-base rounded-lg transition-colors",
                pathname === "/" ? "bg-secondary/30 text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={cn(
                "px-3 py-2 text-base rounded-lg transition-colors",
                pathname === "/books" ? "bg-secondary/30 text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setMobileOpen(false)}
            >
              Books
            </Link>

            <div className="h-px bg-border/40" />

            {/* User section (logged in only) */}
            {isLoggedIn && (
              <>
                <Link
                  href="/bookshelf"
                  className={cn(
                    "px-3 py-2 text-base rounded-lg transition-colors",
                    pathname === "/bookshelf" ? "bg-secondary/30 text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  My Bookshelf
                </Link>
                <Link
                  href="/settings"
                  className={cn(
                    "px-3 py-2 text-base rounded-lg transition-colors",
                    pathname === "/settings" ? "bg-secondary/30 text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>

                <div className="h-px bg-border/40" />

                <button
                  className="px-3 py-2 text-base rounded-lg text-hotpink hover:text-hotpink/80 transition-colors text-left"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            )}

            {/* Auth section (logged out only) */}
            {!isLoggedIn && (
              <>
                <div className="h-px bg-border/40" />
                <Link
                  href="/login"
                  className="px-3 py-2 text-base rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-2 text-base rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
