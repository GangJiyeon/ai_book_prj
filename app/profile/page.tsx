"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, BookMarked, Settings, LogOut, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StarField } from "@/components/star-field"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ username: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    setUser(stored ? JSON.parse(stored) : null)
  }, [])

  function handleLogout() {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const menuItems = [
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      description: "Profile and reading preferences",
    },
  ]

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-xl px-4 py-8" style={{ fontFamily: "var(--font-body)" }}>
          {/* User info */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary border border-border">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {user ? `@${user.username}` : "Not logged in"}
              </p>
              <p className="text-sm text-muted-foreground">booki reader</p>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-2">
            {menuItems.map(({ href, icon: Icon, label, description }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-moonlight/40 hover:bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}

            <div className="mt-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-hotpink/30 hover:bg-secondary/30"
              >
                <LogOut className="h-4 w-4 text-hotpink" />
                <p className="text-sm font-medium text-hotpink">Log out</p>
              </button>
            </div>
          </div>

          {/* Not logged in fallback */}
          {!user && (
            <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
              <p className="mb-3 text-sm text-muted-foreground">Sign in to access your profile</p>
              <div className="flex justify-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-border bg-secondary/30 px-4 py-2 text-sm text-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-moonlight px-4 py-2 text-sm text-white transition-opacity hover:opacity-90"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
