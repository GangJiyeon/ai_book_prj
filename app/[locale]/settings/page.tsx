"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "@/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useRequireAuth } from "@/hooks/use-require-auth"

export default function SettingsPage() {
  const t = useTranslations("settings")
  const tCommon = useTranslations("common")
  const router = useRouter()
  const locale = useLocale()
  const { redirectIfNotAuth } = useRequireAuth()

  const [isPending, startTransition] = useTransition()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  useEffect(() => { redirectIfNotAuth() }, [redirectIfNotAuth])

  function toggleDarkMode(checked: boolean) {
    setIsDark(checked)
    document.documentElement.classList.toggle("dark", checked)
    localStorage.setItem("theme", checked ? "dark" : "light")
  }

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      setEmail(user.email ?? "")
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase
      .from("users")
      .select("username, bio")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (data) {
          setUsername(data.username ?? "")
          setBio(data.bio ?? "")
        }
      })
  }, [userId])

  function handleLanguageChange(value: "en" | "ko") {
    startTransition(() => {
      router.replace("/settings", { locale: value })
    })

    // DB 저장은 navigation 블로킹 없이 병렬 실행
    if (userId) {
      supabase
        .from("users")
        .update({ preferred_locale: value })
        .eq("id", userId)
    }
  }

  async function handleSaveProfile() {
    if (!userId) return
    setProfileSaving(true)
    setProfileMsg(null)
    const { error } = await supabase
      .from("users")
      .update({ username: username.trim(), bio: bio.trim() })
      .eq("id", userId)
    setProfileSaving(false)
    if (error) {
      setProfileMsg({ ok: false, text: error.message })
    } else {
      setProfileMsg({ ok: true, text: t("saved") })
      setTimeout(() => setProfileMsg(null), 3000)
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: t("passwordMismatch") })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ ok: false, text: t("passwordTooShort") })
      return
    }
    setPasswordSaving(true)
    setPasswordMsg(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)
    if (error) {
      setPasswordMsg({ ok: false, text: error.message })
    } else {
      setPasswordMsg({ ok: true, text: t("passwordUpdated") })
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordForm(false)
      setTimeout(() => setPasswordMsg(null), 3000)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
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
              {t("title")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
              {t("subtitle")}
            </p>
          </header>

          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profileInfo")}</CardTitle>
              <CardDescription>{t("profileDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                  {t("username")}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20 hover:border-border"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="bio" className="text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                  {t("bio")}
                </label>
                <input
                  id="bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("bioPlaceholder")}
                  className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20 hover:border-border"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              {profileMsg && (
                <p className={`text-xs ${profileMsg.ok ? "text-green-500" : "text-hotpink"}`} style={{ fontFamily: "var(--font-body)" }}>
                  {profileMsg.text}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="ml-auto h-10 rounded-lg bg-moonlight px-6 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {profileSaving ? t("saving") : tCommon("save")}
              </button>
            </CardFooter>
          </Card>

          {/* Email & Security */}
          <Card>
            <CardHeader>
              <CardTitle>{t("emailSecurity")}</CardTitle>
              <CardDescription>{t("emailSecurityDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-muted-foreground"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              {!showPasswordForm ? (
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="h-10 rounded-lg border border-border bg-secondary/30 px-4 text-sm text-secondary-foreground transition-colors hover:border-moonlight/30 hover:text-moonlight"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t("changePassword")}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                      {t("newPassword")}
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-body)" }}>
                      {t("confirmPassword")}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10 rounded-lg border border-border/60 bg-secondary/20 px-3.5 text-sm text-foreground outline-none focus:border-moonlight/40 focus:ring-1 focus:ring-moonlight/20"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                  {passwordMsg && (
                    <p className={`text-xs ${passwordMsg.ok ? "text-green-500" : "text-hotpink"}`} style={{ fontFamily: "var(--font-body)" }}>
                      {passwordMsg.text}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={passwordSaving}
                      className="h-10 rounded-lg bg-moonlight px-5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {passwordSaving ? t("updating") : t("updatePassword")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowPasswordForm(false); setPasswordMsg(null) }}
                      className="h-10 rounded-lg border border-border px-4 text-sm text-muted-foreground hover:text-foreground"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {tCommon("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reading Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>{t("readingPrefs")}</CardTitle>
              <CardDescription>{t("readingPrefsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{t("language")}</span>
                <select
                  value={locale}
                  onChange={(e) => handleLanguageChange(e.target.value as "en" | "ko")}
                  disabled={isPending}
                  className="h-8 rounded-lg border border-border/60 bg-secondary/20 px-2 text-sm text-foreground disabled:opacity-50"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="hidden md:flex items-center justify-between">
                <span className="text-sm text-foreground">{t("darkMode")}</span>
                <Switch checked={isDark} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-10 rounded-lg border border-border bg-secondary/30 text-sm text-secondary-foreground transition-colors hover:border-hotpink/30 hover:text-hotpink"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {t("logout")}
              </button>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
