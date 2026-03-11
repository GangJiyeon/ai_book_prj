export interface ReaderCommentData {
  id: string
  user: string
  text: string
  timeAgo: string
}

export interface ParagraphData {
  id: string
  order: number
  text: string
  comments: ReaderCommentData[]
}

export interface MyAnchorData {
  id: string
  quote: string
  text: string
  visibility: "public" | "memo" | "group"
  bookId: string
  bookTitle: string
  bookAuthor: string
  chapterNumber: number
  timeAgo: string
}

export interface ChapterContentData {
  chapterId: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  chapterNumber: number
  chapterTitle: string
  totalChapters: number
  paragraphs: ParagraphData[]
}
