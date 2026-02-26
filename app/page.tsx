import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { HeroHeader } from "@/components/hero-header"
import { BookCard } from "@/components/book-card"
import { HeroCta } from "@/components/hero-cta"

export default function Home() {
  return (
    <>
      <StarField />
      <div
        className="relative z-10 min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #080c18 0%, #0a0e1a 30%, #0f1629 70%, #0a0e1a 100%)",
        }}
      >
        <Navbar />

        {/* Subtle radial glow behind the card area */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(ellipse at center, rgba(245,216,122,0.04) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <main className="flex flex-col items-center gap-12 px-4 py-16">
          <HeroHeader />
          <BookCard />
          <HeroCta />
        </main>
      </div>
    </>
  )
}
