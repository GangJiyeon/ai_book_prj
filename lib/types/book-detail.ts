export interface BookDetailData {
  id: string
  title: string
  author: string
  cover_url: string | null
  description: string | null
  tags: string[]
  pausesCount: number
  commentsCount: number
}

export interface ChapterRow {
  id: string
  number: number
  title: string
  progress: number
  hasAnchors: boolean
}

export interface AnchorRow {
  id: string
  quote: string
  commentsCount: number
  pausesCount: number
}
