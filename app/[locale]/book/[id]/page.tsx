import { notFound } from "next/navigation"
import { StarField } from "@/components/star-field"
import { Navbar } from "@/components/navbar"
import { BookDetailHeader } from "@/components/book-detail-header"
import { PopularAnchors } from "@/components/popular-anchors"
import { ChaptersList } from "@/components/chapters-list"
import { getBookById, getChaptersByBookId, getPopularAnchors } from "@/lib/queries/book-detail"

interface BookPageProps {
  params: Promise<{ id: string }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params
  const [book, chapters, anchors] = await Promise.all([
    getBookById(id),
    getChaptersByBookId(id),
    getPopularAnchors(id),
  ])

  if (!book) {
    notFound()
  }

  return (
    <>
      <StarField />
      <div className="relative z-10 min-h-screen bg-background">
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
          <div className="flex flex-col gap-14">
            {/* Section 1: Book Header */}
            <BookDetailHeader book={book} />

            {/* Divider */}
            <div className="h-px w-full bg-border/40" aria-hidden="true" />

            {/* Section 2: Popular Anchors */}
            <PopularAnchors
              anchors={anchors}
              bookTitle={book.title}
              bookAuthor={book.author}
            />

            {/* Divider */}
            <div className="h-px w-full bg-border/40" aria-hidden="true" />

            {/* Section 3: Chapters List */}
            <ChaptersList chapters={chapters} bookId={book.id} />
          </div>
        </main>
      </div>
    </>
  )
}
