"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff, Loader2, AlertCircle, ChevronLeft } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSent, setForgotSent] = useState(false)
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem("user", JSON.stringify({ username: id || "guest" }))
    window.location.href = "/"
  }

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault()
    setForgotSent(true)
  }

  return (
    <div className="relative w-full max-w-[420px] mx-auto px-4 sm:px-0">
      {/* back button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute top-4 left-4 z-10 flex items-center justify-center rounded-full p-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Card */}
      <div
        className="relative rounded-xl border border-border bg-card overflow-hidden"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >

        <div className="px-6 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-10">
          {/* Brand + heading */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-moonlight" aria-hidden="true" />
              <span className="font-sans text-lg font-bold tracking-tight text-foreground">
                book<span className="text-moonlight">i</span>
              </span>
            </Link>
            <div className="text-center">
              <h1 className="font-sans text-2xl font-semibold text-foreground tracking-tight">
                Welcome back
              </h1>
              <p
                className="mt-1.5 text-sm text-muted-foreground"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Pick up where you paused.
              </p>
            </div>
          </div>

          {/* Error state */}
          {showError && (
            <div
              className="flex items-center gap-2.5 rounded-lg border border-hotpink/30 bg-hotpink/5 px-3.5 py-2.5 mb-5"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-hotpink" />
              <p className="text-sm text-hotpink" style={{ fontFamily: "var(--font-body)" }}>
                Invalid email or password.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="you@example.com"
                autoComplete="email"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20 hover:border-border"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border/60 bg-secondary/20 px-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20 hover:border-border"
                  style={{ fontFamily: "var(--font-body)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label
                className="flex items-center gap-2 cursor-pointer select-none"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    rememberMe
                      ? "border-moonlight bg-moonlight"
                      : "border-border/60 bg-secondary/20 hover:border-border"
                  }`}
                >
                  {rememberMe && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#0a0e1a"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-xs text-muted-foreground">Remember me</span>
              </label>

              <Dialog.Root open={forgotOpen} onOpenChange={(open) => { setForgotOpen(open); if (!open) setForgotSent(false) }}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground transition-colors hover:text-moonlight"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Forgot password?
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
                  <Dialog.Content
                    className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/60 p-6 outline-none"
                    style={{
                      background: "#ffffff",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Dialog.Title className="font-sans text-lg font-semibold text-foreground">
                      Reset password
                    </Dialog.Title>
                    <Dialog.Description
                      className="mt-1.5 text-sm text-muted-foreground"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {forgotSent
                        ? "Check your inbox for a reset link."
                        : "Enter your email and we'll send a reset link."}
                    </Dialog.Description>

                    {!forgotSent ? (
                      <form onSubmit={handleForgotSubmit} className="mt-4 flex flex-col gap-3">
                        <input
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20"
                          style={{ fontFamily: "var(--font-body)" }}
                        />
                        <button
                          type="submit"
                          className="h-10 rounded-lg bg-moonlight text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Send reset link
                        </button>
                      </form>
                    ) : (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-moonlight/20 bg-moonlight/5 px-3.5 py-2.5">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="7" stroke="#f5d87a" strokeWidth="1.5" />
                          <path d="M5 8L7 10L11 6" stroke="#f5d87a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-sm text-moonlight" style={{ fontFamily: "var(--font-body)" }}>
                          Reset link sent to {forgotEmail}
                        </p>
                      </div>
                    )}

                    <Dialog.Close asChild>
                      <button
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Close"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-moonlight text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-3 text-xs text-muted-foreground"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: "#ffffff",
                }}
              >
                or
              </span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2.5 rounded-lg border border-border/60 bg-secondary/15 text-sm text-foreground transition-all hover:border-border hover:bg-secondary/30 active:scale-[0.98]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M15.68 8.18c0-.57-.05-1.12-.15-1.64H8v3.1h4.31a3.68 3.68 0 01-1.6 2.42v2h2.59c1.51-1.4 2.38-3.45 2.38-5.88z" fill="#4285F4"/>
                <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.59-2a4.85 4.85 0 01-2.71.77 4.8 4.8 0 01-4.51-3.31H.82v2.07A8 8 0 008 16z" fill="#34A853"/>
                <path d="M3.49 9.52a4.81 4.81 0 010-3.04V4.41H.82a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"/>
                <path d="M8 3.17a4.33 4.33 0 013.07 1.2l2.3-2.3A7.72 7.72 0 008 0 8 8 0 00.82 4.41l2.67 2.07A4.8 4.8 0 018 3.17z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2.5 rounded-lg border border-border/60 bg-secondary/15 text-sm text-foreground transition-all hover:border-border hover:bg-secondary/30 active:scale-[0.98]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.63 7.63 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Privacy note */}
          <p
            className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/70"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We only use your email to save your anchors.
          </p>

          {/* Create account link */}
          <p
            className="mt-4 text-center text-sm text-muted-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {"Don't have an account? "}
            <Link
              href="/signup"
              className="text-moonlight transition-colors hover:text-moonlight-dim"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
