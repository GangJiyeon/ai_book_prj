export interface Book {
  id: string
  title: string
  author: string
  cover_url: string | null
  tags: string[]
  description: string | null
  gutenberg_id: string | null
  // Phase 2: aggregated stats (0 until implemented)
  likes: number
  commentsCount: number
  pausesCount: number
  pauseHeat: number[]
}
