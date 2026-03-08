"use client"

import { useState, useEffect } from "react"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function SettingsPage() {
  const [language, setLanguage] = useState<"en" | "ko">("en")

  useEffect(() => {
    const stored = localStorage.getItem("language") as "en" | "ko" | null
    if (stored) setLanguage(stored)
  }, [])

  function handleLanguageChange(value: "en" | "ko") {
    setLanguage(value)
    localStorage.setItem("language", value)
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-12 lg:px-6 space-y-10">
          {/* Page header */}
          <header className="text-center">
            <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Account Settings
            </h1>
            <p
              className="mt-2 text-sm text-muted-foreground"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Manage your profile and reading identity.
            </p>
          </header>

          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Info</CardTitle>
              <CardDescription>
                Basic information for your public identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-secondary/30" />
                <button
                  type="button"
                  className="text-sm text-moonlight underline"
                >
                  Change avatar
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  defaultValue="reader123"
                  className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20 hover:border-border"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="bio"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Bio
                </label>
                <input
                  id="bio"
                  type="text"
                  defaultValue="Avid night reader."
                  className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20 hover:border-border"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <button
                className="ml-auto h-10 rounded-lg bg-moonlight px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Save
              </button>
            </CardFooter>
          </Card>

          {/* Email & Security */}
          <Card>
            <CardHeader>
              <CardTitle>Email & Security</CardTitle>
              <CardDescription>
                Manage how you log in and secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value="reader@example.com"
                  readOnly
                  className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <button
                type="button"
                className="h-10 rounded-lg border border-border bg-secondary/30 px-4 text-sm text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Change password
              </button>
              <div className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
                Logged in with GitHub
              </div>
            </CardContent>
          </Card>

          {/* Reading Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Reading Preferences</CardTitle>
              <CardDescription>
                Adjust your reader settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Font size</span>
                <select
                  defaultValue="medium"
                  className="h-8 rounded-lg border border-border/60 bg-secondary/20 px-2 text-sm text-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Language</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as "en" | "ko")}
                  className="h-8 rounded-lg border border-border/60 bg-secondary/20 px-2 text-sm text-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option value="en">English</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
              {/* Dark mode — hidden on mobile (accessible via top navbar toggle) */}
              <div className="hidden md:flex items-center justify-between">
                <span className="text-sm text-foreground">Dark mode</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Show pause highlights</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Control how others see you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Public profile</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Show comments publicly</span>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="bg-navy-deep/80">
            <CardContent className="space-y-4">
              <button
                type="button"
                className="w-full h-10 rounded-lg border border-border bg-secondary/30 text-sm text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Log out
              </button>
              <button
                type="button"
                className="w-full text-xs text-hotpink hover:underline"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Delete account
              </button>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
