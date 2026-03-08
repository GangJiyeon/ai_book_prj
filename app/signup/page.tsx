import { StarField } from "@/components/star-field"
import { SignupForm } from "@/components/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create account — booki",
  description: "Sign up for booki. Start keeping your anchors.",
}

export default function SignupPage() {
  return (
    <>
      <StarField />
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 bg-background">

        <SignupForm />
      </div>
    </>
  )
}
