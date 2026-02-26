import { StarField } from "@/components/star-field"
import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in — NightPage",
  description: "Sign in to NightPage. Pick up where you paused.",
}

export default function LoginPage() {
  return (
    <>
      <StarField />
      <div
        className="relative z-10 flex min-h-screen items-center justify-center py-12"
        style={{
          background:
            "linear-gradient(180deg, #080c18 0%, #0a0e1a 30%, #0f1629 70%, #0a0e1a 100%)",
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(245,216,122,0.03) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <LoginForm />
      </div>
    </>
  )
}
