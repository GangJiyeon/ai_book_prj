import { StarField } from "@/components/star-field"
import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login — booki",
  description: "Login to booki. Pick up where you paused.",
}

export default function LoginPage() {
  return (
    <>
      <StarField />
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 bg-background">

        <LoginForm />
      </div>
    </>
  )
}
