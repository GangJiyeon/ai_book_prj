export type ShelfCategory = "currently-reading" | "paused" | "finished" | "commented"

export interface ShelfBook {
  id: string
  title: string
  author: string
  spineColor: string
  spineAccent: string
  textColor: string
  coverUrl?: string
  category: ShelfCategory
  pausesCount: number
  commentsCount: number
  /** progress 0-100 */
  progress: number
  pausedQuote?: string
}

export const shelfCategories: { key: ShelfCategory; label: string }[] = [
  { key: "currently-reading", label: "Currently Reading" },
  { key: "paused", label: "Paused" },
  { key: "finished", label: "Finished" },
  { key: "commented", label: "Commented" },
]
