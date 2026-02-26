import { BookOpen } from "lucide-react"

export function HeroHeader() {
  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-2.5">
        <BookOpen className="h-6 w-6 text-moonlight" aria-hidden="true" />
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Night
          <span className="text-moonlight">Page</span>
        </h1>
      </div>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
        Read a passage. Leave a thought. Continue with someone else{"'"}s perspective.
      </p>
    </header>
  )
}
