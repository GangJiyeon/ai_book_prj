export interface MockBook {
  id: string
  title: string
  author: string
  coverGradient: string
  tags: string[]
  likes: number
  commentsCount: number
  pausesCount: number
  exchangeAvailable: boolean
  /** Array of 10 values 0-1 representing pause density across book sections */
  pauseHeat: number[]
  excerpt: string
  excerptComments: { user: string; text: string }[]
}

export interface TrendingPause {
  id: string
  quote: string
  bookTitle: string
  commentsCount: number
  comments: { user: string; text: string }[]
}

export const GENRES = [
  "Literary",
  "Mystery",
  "Healing",
  "Quiet",
  "Speculative",
  "Memoir",
  "Philosophy",
  "Romance",
  "Poetry",
  "Thriller",
] as const

export const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "new", label: "New" },
  { value: "most-commented", label: "Most commented" },
  { value: "most-paused", label: "Most paused" },
] as const

export const mockBooks: MockBook[] = [
  {
    id: "1",
    title: "The Namiya Letters",
    author: "K. Hiroshi",
    coverGradient: "linear-gradient(135deg, #1a2744 0%, #2d1b4e 50%, #1e2d52 100%)",
    tags: ["quiet", "healing", "literary"],
    likes: 234,
    commentsCount: 89,
    pausesCount: 156,
    exchangeAvailable: true,
    pauseHeat: [0.2, 0.4, 0.3, 0.8, 0.6, 0.9, 0.5, 0.7, 1.0, 0.3],
    excerpt:
      "Sometimes a single sentence is enough to start over. The letter had no return address, but the words carried a warmth that felt like coming home.",
    excerptComments: [
      { user: "mira.reads", text: "This line hit me harder than I expected." },
      { user: "joon_k", text: "I keep coming back to this paragraph every few months." },
      { user: "quietpages", text: "I stopped here too. What did you feel?" },
    ],
  },
  {
    id: "2",
    title: "Midnight Margin Notes",
    author: "L. Venn",
    coverGradient: "linear-gradient(135deg, #0f1629 0%, #1a2744 50%, #2a1f3d 100%)",
    tags: ["mystery", "literary"],
    likes: 189,
    commentsCount: 67,
    pausesCount: 124,
    exchangeAvailable: false,
    pauseHeat: [0.5, 0.3, 0.7, 0.9, 1.0, 0.6, 0.4, 0.8, 0.2, 0.5],
    excerpt:
      "I thought I understood it\u2014until I read your comment. The margin note was written in pencil, fading like the memory of whoever left it.",
    excerptComments: [
      { user: "nocturn_e", text: "I read it differently\u2014maybe because of where I am lately." },
      { user: "sol.writes", text: "The pencil detail is devastating." },
      { user: "half.moon", text: "Who writes in margins anymore? Ghosts, apparently." },
    ],
  },
  {
    id: "3",
    title: "The Quiet Chapter",
    author: "A. Morel",
    coverGradient: "linear-gradient(135deg, #162040 0%, #1e2d52 50%, #0f1629 100%)",
    tags: ["quiet", "philosophy"],
    likes: 312,
    commentsCount: 134,
    pausesCount: 201,
    exchangeAvailable: true,
    pauseHeat: [0.3, 0.6, 0.8, 0.5, 0.4, 0.7, 0.9, 1.0, 0.6, 0.8],
    excerpt:
      "I paused here, and it felt like the story paused with me. Some chapters exist not to move the plot forward, but to let you breathe.",
    excerptComments: [
      { user: "dawnreader", text: "I stopped here too. What did you feel?" },
      { user: "cartograph", text: "The pacing in this section is a masterclass." },
      { user: "lanternlight", text: "I needed this pause more than the story did." },
    ],
  },
  {
    id: "4",
    title: "Small Fires in Distant Windows",
    author: "J. Linden",
    coverGradient: "linear-gradient(135deg, #2a1f3d 0%, #1a2744 50%, #0f2b3d 100%)",
    tags: ["literary", "speculative"],
    likes: 278,
    commentsCount: 98,
    pausesCount: 177,
    exchangeAvailable: false,
    pauseHeat: [0.8, 0.6, 0.4, 0.5, 0.7, 0.3, 0.9, 0.6, 0.8, 1.0],
    excerpt:
      "From this distance, every lit window looks like a small act of defiance against the dark. You do not know who sits inside, but you know they chose to stay awake.",
    excerptComments: [
      { user: "ink.stains", text: "The image of windows as defiance is unforgettable." },
      { user: "page.turner", text: "I looked out my own window after reading this." },
      { user: "mira.reads", text: "Staying awake as a choice\u2014this reframed my insomnia." },
    ],
  },
  {
    id: "5",
    title: "Undelivered Letters",
    author: "C. Moreau",
    coverGradient: "linear-gradient(135deg, #0f2b3d 0%, #162040 50%, #2d1b4e 100%)",
    tags: ["healing", "memoir"],
    likes: 198,
    commentsCount: 76,
    pausesCount: 143,
    exchangeAvailable: true,
    pauseHeat: [0.4, 0.5, 0.6, 0.7, 0.9, 1.0, 0.8, 0.4, 0.3, 0.2],
    excerpt:
      "I folded the corner knowing I would never come back. The letter was addressed to no one, which meant it was addressed to everyone.",
    excerptComments: [
      { user: "sol.writes", text: "Addressed to no one, addressed to everyone. Perfect." },
      { user: "half.moon", text: "I have a drawer full of these." },
      { user: "quietpages", text: "The act of writing is the delivery." },
    ],
  },
  {
    id: "6",
    title: "The Weight of Bookmarks",
    author: "Y. Tanaka",
    coverGradient: "linear-gradient(135deg, #1e2d52 0%, #2a1f3d 50%, #1a2744 100%)",
    tags: ["quiet", "literary", "philosophy"],
    likes: 256,
    commentsCount: 112,
    pausesCount: 189,
    exchangeAvailable: false,
    pauseHeat: [0.3, 0.7, 0.9, 1.0, 0.8, 0.5, 0.6, 0.4, 0.7, 0.9],
    excerpt:
      "A bookmark is just a promise you made to yourself: I will come back. But how many of those promises do we actually keep?",
    excerptComments: [
      { user: "nocturn_e", text: "I have bookmarks in books I bought five years ago." },
      { user: "cartograph", text: "This made me count my unfinished books. I stopped at 30." },
      { user: "dawnreader", text: "The guilt of an unused bookmark is real." },
    ],
  },
  {
    id: "7",
    title: "An Atlas of Pauses",
    author: "R. Castillo",
    coverGradient: "linear-gradient(135deg, #162040 0%, #0f2b3d 50%, #1a2744 100%)",
    tags: ["speculative", "literary"],
    likes: 167,
    commentsCount: 54,
    pausesCount: 98,
    exchangeAvailable: true,
    pauseHeat: [0.6, 0.8, 0.4, 0.3, 0.5, 0.7, 1.0, 0.9, 0.6, 0.4],
    excerpt:
      "What if you could map all the places where strangers held their breath? Every pause is a coordinate. Every silence is a landmark.",
    excerptComments: [
      { user: "lanternlight", text: "A geography of hesitation. What a concept." },
      { user: "ink.stains", text: "I want this atlas to exist." },
      { user: "joon_k", text: "The mapping metaphor runs so deep in this book." },
    ],
  },
  {
    id: "8",
    title: "Borrowed Evenings",
    author: "S. Nakamura",
    coverGradient: "linear-gradient(135deg, #2d1b4e 0%, #1e2d52 50%, #0f1629 100%)",
    tags: ["romance", "quiet"],
    likes: 203,
    commentsCount: 81,
    pausesCount: 134,
    exchangeAvailable: true,
    pauseHeat: [0.5, 0.4, 0.6, 0.8, 0.7, 0.9, 1.0, 0.5, 0.3, 0.6],
    excerpt:
      "She returned the book with a note tucked inside chapter seven. It said only: 'Thank you for lending me your evening.'",
    excerptComments: [
      { user: "page.turner", text: "The intimacy of lending a book is underrated." },
      { user: "mira.reads", text: "Chapter seven must have meant something to her." },
      { user: "sol.writes", text: "Lending a book is lending a piece of time." },
    ],
  },
  {
    id: "9",
    title: "The Reading Hour",
    author: "P. Svensson",
    coverGradient: "linear-gradient(135deg, #1a2744 0%, #162040 50%, #2a1f3d 100%)",
    tags: ["philosophy", "memoir"],
    likes: 287,
    commentsCount: 103,
    pausesCount: 168,
    exchangeAvailable: false,
    pauseHeat: [0.7, 0.5, 0.8, 0.6, 0.9, 1.0, 0.7, 0.8, 0.4, 0.5],
    excerpt:
      "Reading alone at night is not loneliness. It is a different kind of company\u2014the kind that asks nothing of you but attention.",
    excerptComments: [
      { user: "half.moon", text: "Finally, someone understood this." },
      { user: "dawnreader", text: "The book itself is the company. Always has been." },
      { user: "nocturn_e", text: "Night reading is the original social network." },
    ],
  },
  {
    id: "10",
    title: "Footnotes to a Stranger",
    author: "D. Elgin",
    coverGradient: "linear-gradient(135deg, #0f1629 0%, #1e2d52 50%, #162040 100%)",
    tags: ["literary", "mystery"],
    likes: 145,
    commentsCount: 48,
    pausesCount: 87,
    exchangeAvailable: false,
    pauseHeat: [0.4, 0.6, 0.3, 0.5, 0.8, 0.7, 0.6, 0.9, 1.0, 0.7],
    excerpt:
      "I never met the person who underlined this passage before me. But I trust their judgment more than most people I know.",
    excerptComments: [
      { user: "cartograph", text: "Secondhand annotations are love letters from strangers." },
      { user: "quietpages", text: "I bought a used book once covered in notes. Best purchase ever." },
      { user: "lanternlight", text: "There is trust in following a stranger\u2019s underline." },
    ],
  },
  {
    id: "11",
    title: "Late Returns",
    author: "M. Okonkwo",
    coverGradient: "linear-gradient(135deg, #1e2d52 0%, #0f2b3d 50%, #2d1b4e 100%)",
    tags: ["healing", "quiet", "literary"],
    likes: 176,
    commentsCount: 62,
    pausesCount: 110,
    exchangeAvailable: true,
    pauseHeat: [0.6, 0.4, 0.7, 0.5, 0.8, 0.6, 0.9, 1.0, 0.7, 0.5],
    excerpt:
      "The book was seventeen years overdue. She placed it on the counter and said, 'I needed every one of those days.'",
    excerptComments: [
      { user: "ink.stains", text: "Seventeen years. The weight of that number." },
      { user: "joon_k", text: "Some books refuse to be returned until you are ready." },
      { user: "page.turner", text: "The librarian in me is conflicted but moved." },
    ],
  },
  {
    id: "12",
    title: "Conversations After Dark",
    author: "E. Ashworth",
    coverGradient: "linear-gradient(135deg, #2a1f3d 0%, #0f1629 50%, #1a2744 100%)",
    tags: ["thriller", "mystery", "literary"],
    likes: 221,
    commentsCount: 95,
    pausesCount: 152,
    exchangeAvailable: true,
    pauseHeat: [0.9, 0.7, 0.5, 0.6, 0.4, 0.8, 0.7, 1.0, 0.9, 0.6],
    excerpt:
      "The conversation started at midnight and ended at the bottom of a coffee cup. Neither of them said what they meant, but both heard what they needed.",
    excerptComments: [
      { user: "sol.writes", text: "The coffee cup detail is such a quiet heartbreak." },
      { user: "half.moon", text: "This is every late-night conversation I have ever had." },
      { user: "mira.reads", text: "Hearing what you need, not what was said. Yes." },
    ],
  },
  {
    id: "b2",
    title: "Convenience Store Woman",
    author: "Sayaka Murata",
    coverGradient: "linear-gradient(135deg, #1a3a4a 0%, #2d4a3e 50%, #1e3a3a 100%)",
    tags: ["literary", "quiet", "healing"],
    likes: 289,
    commentsCount: 91,
    pausesCount: 143,
    exchangeAvailable: true,
    pauseHeat: [0.4, 0.7, 0.9, 0.6, 0.8, 1.0, 0.5, 0.7, 0.3, 0.6],
    excerpt:
      "A person who has lived for thirty-six years without conforming to society's expectations must be doing something right.",
    excerptComments: [
      { user: "joon_k", text: "Keiko's logic is impeccable and heartbreaking." },
      { user: "sol.writes", text: "She finds identity in service. That is such a specific kind of peace." },
      { user: "dawnreader", text: "The store as a mirror for society." },
    ],
  },
]

export type ShelfCategory = "currently-reading" | "paused" | "finished" | "commented"

export interface ShelfBook {
  id: string
  title: string
  author: string
  spineColor: string
  spineAccent: string
  textColor: string
  category: ShelfCategory
  pausesCount: number
  commentsCount: number
  /** progress 0-100 */
  progress: number
  /** An original placeholder quote the user paused at */
  pausedQuote?: string
}

export const shelfCategories: { key: ShelfCategory; label: string }[] = [
  { key: "currently-reading", label: "Currently Reading" },
  { key: "paused", label: "Paused" },
  { key: "finished", label: "Finished" },
  { key: "commented", label: "Commented" },
]

export const shelfBooks: ShelfBook[] = [
  {
    id: "s1",
    title: "The Namiya Letters",
    author: "K. Hiroshi",
    spineColor: "#1a2744",
    spineAccent: "#f5d87a",
    textColor: "#f5d87a",
    category: "currently-reading",
    pausesCount: 12,
    commentsCount: 5,
    progress: 64,
    pausedQuote: "Sometimes a single sentence is enough to start over.",
  },
  {
    id: "s2",
    title: "Midnight Margin Notes",
    author: "L. Venn",
    spineColor: "#2d1b4e",
    spineAccent: "#c4b5fd",
    textColor: "#e8e6e1",
    category: "currently-reading",
    pausesCount: 8,
    commentsCount: 3,
    progress: 38,
    pausedQuote: "I thought I understood it\u2014until I read your comment in the margin.",
  },
  {
    id: "s3",
    title: "An Atlas of Pauses",
    author: "R. Castillo",
    spineColor: "#0f2b3d",
    spineAccent: "#67e8f9",
    textColor: "#e8e6e1",
    category: "currently-reading",
    pausesCount: 15,
    commentsCount: 7,
    progress: 81,
    pausedQuote: "What if you could map all the places where strangers held their breath?",
  },
  {
    id: "s4",
    title: "The Quiet Chapter",
    author: "A. Morel",
    spineColor: "#162040",
    spineAccent: "#f5d87a",
    textColor: "#f5d87a",
    category: "paused",
    pausesCount: 22,
    commentsCount: 9,
    progress: 47,
    pausedQuote: "I paused here, and it felt like the story paused with me.",
  },
  {
    id: "s5",
    title: "Borrowed Evenings",
    author: "S. Nakamura",
    spineColor: "#2a1f3d",
    spineAccent: "#fda4af",
    textColor: "#e8e6e1",
    category: "paused",
    pausesCount: 6,
    commentsCount: 2,
    progress: 23,
    pausedQuote: "She returned the book with a note tucked inside chapter seven.",
  },
  {
    id: "s6",
    title: "Late Returns",
    author: "M. Okonkwo",
    spineColor: "#1e2d52",
    spineAccent: "#a5b4fc",
    textColor: "#e8e6e1",
    category: "paused",
    pausesCount: 4,
    commentsCount: 1,
    progress: 55,
    pausedQuote: "The book was seventeen years overdue.",
  },
  {
    id: "s7",
    title: "Small Fires in Distant Windows",
    author: "J. Linden",
    spineColor: "#0f1629",
    spineAccent: "#f5d87a",
    textColor: "#f5d87a",
    category: "finished",
    pausesCount: 31,
    commentsCount: 14,
    progress: 100,
  },
  {
    id: "s8",
    title: "Undelivered Letters",
    author: "C. Moreau",
    spineColor: "#2d1b4e",
    spineAccent: "#e8e6e1",
    textColor: "#e8e6e1",
    category: "finished",
    pausesCount: 18,
    commentsCount: 8,
    progress: 100,
  },
  {
    id: "s9",
    title: "The Reading Hour",
    author: "P. Svensson",
    spineColor: "#162040",
    spineAccent: "#67e8f9",
    textColor: "#e8e6e1",
    category: "finished",
    pausesCount: 25,
    commentsCount: 11,
    progress: 100,
  },
  {
    id: "s10",
    title: "Conversations After Dark",
    author: "E. Ashworth",
    spineColor: "#1a2744",
    spineAccent: "#fda4af",
    textColor: "#e8e6e1",
    category: "finished",
    pausesCount: 14,
    commentsCount: 6,
    progress: 100,
  },
  {
    id: "s11",
    title: "Footnotes to a Stranger",
    author: "D. Elgin",
    spineColor: "#0f2b3d",
    spineAccent: "#f5d87a",
    textColor: "#f5d87a",
    category: "commented",
    pausesCount: 19,
    commentsCount: 13,
    progress: 72,
    pausedQuote: "I never met the person who underlined this passage before me.",
  },
  {
    id: "s12",
    title: "The Weight of Bookmarks",
    author: "Y. Tanaka",
    spineColor: "#2a1f3d",
    spineAccent: "#c4b5fd",
    textColor: "#e8e6e1",
    category: "commented",
    pausesCount: 27,
    commentsCount: 16,
    progress: 90,
    pausedQuote: "A bookmark is just a promise you made to yourself: I will come back.",
  },
  {
    id: "s13",
    title: "Lanterns at Low Tide",
    author: "W. Sato",
    spineColor: "#1e2d52",
    spineAccent: "#67e8f9",
    textColor: "#e8e6e1",
    category: "commented",
    pausesCount: 10,
    commentsCount: 7,
    progress: 100,
    pausedQuote: "The shore remembers every footprint the tide tries to erase.",
  },
]

export const trendingPauses: TrendingPause[] = [
  {
    id: "tp-1",
    quote: "Some stories only make sense when you read them beside someone who is also lost.",
    bookTitle: "Small Fires in Distant Windows",
    commentsCount: 34,
    comments: [
      { user: "half.moon", text: "Being lost together is its own kind of found." },
      { user: "quietpages", text: "I shared this line with someone and it changed us." },
      { user: "dawnreader", text: "This is the best description of reading communities." },
    ],
  },
  {
    id: "tp-2",
    quote: "The bookmark was still warm, as if the previous reader had only just left.",
    bookTitle: "The Weight of Bookmarks",
    commentsCount: 28,
    comments: [
      { user: "cartograph", text: "The warmth detail is so intimate." },
      { user: "ink.stains", text: "I check used books for warm bookmarks now." },
      { user: "page.turner", text: "Connection through objects. This book gets it." },
    ],
  },
  {
    id: "tp-3",
    quote: "I folded the corner knowing I would never come back. Some promises are made to be gently broken.",
    bookTitle: "Undelivered Letters",
    commentsCount: 22,
    comments: [
      { user: "sol.writes", text: "Gently broken. That phrase will stay with me." },
      { user: "lanternlight", text: "Every dog-ear is a small betrayal of intention." },
      { user: "mira.reads", text: "I felt called out and comforted at the same time." },
    ],
  },
  {
    id: "tp-4",
    quote: "The best conversations happen in the margins, where no one is performing.",
    bookTitle: "Midnight Margin Notes",
    commentsCount: 41,
    comments: [
      { user: "nocturn_e", text: "Margins are the only honest space left." },
      { user: "joon_k", text: "No one performs in pencil at 2am." },
      { user: "half.moon", text: "This is why margin notes feel more real than reviews." },
    ],
  },
  {
    id: "tp-5",
    quote: "Reading alone at night is not loneliness. It is a different kind of company.",
    bookTitle: "The Reading Hour",
    commentsCount: 37,
    comments: [
      { user: "dawnreader", text: "Finally, someone said it." },
      { user: "quietpages", text: "The book itself is the company. Always has been." },
      { user: "cartograph", text: "Night reading is the original social network." },
    ],
  },
]

/* ──────────────────────────────────────────────
   BOOK DETAIL DATA
   ────────────────────────────────────────────── */

export interface BookAnchor {
  id: string
  quote: string
  pausesCount: number
  commentsCount: number
}

export interface BookChapter {
  number: number
  title: string
  /** 0-100 */
  progress: number
  hasAnchors: boolean
}

export interface BookDetail {
  id: string
  title: string
  author: string
  coverGradient: string
  tags: string[]
  description: string
  pausesCount: number
  commentsCount: number
  anchors: BookAnchor[]
  chapters: BookChapter[]
}

const bookDetails: BookDetail[] = [
  {
    id: "1",
    title: "The Namiya Letters",
    author: "K. Hiroshi",
    coverGradient: "linear-gradient(135deg, #1a2744 0%, #2d1b4e 50%, #1e2d52 100%)",
    tags: ["quiet", "healing", "literary"],
    description:
      "A nameless shop where strangers post their worries and receive handwritten replies. Three young men discover the abandoned store and begin answering letters from the past.",
    pausesCount: 156,
    commentsCount: 89,
    anchors: [
      { id: "a1-1", quote: "Sometimes a single sentence is enough to start over.", pausesCount: 42, commentsCount: 18 },
      { id: "a1-2", quote: "The letter had no return address, but the words carried a warmth that felt like coming home.", pausesCount: 38, commentsCount: 14 },
      { id: "a1-3", quote: "People write to strangers when they have run out of people to trust.", pausesCount: 31, commentsCount: 11 },
      { id: "a1-4", quote: "A reply does not solve a problem. It tells someone they were heard.", pausesCount: 27, commentsCount: 9 },
      { id: "a1-5", quote: "Time bends around a good letter the way light bends around a star.", pausesCount: 22, commentsCount: 7 },
    ],
    chapters: [
      { number: 1, title: "The Abandoned Mailbox", progress: 100, hasAnchors: true },
      { number: 2, title: "Letters from Another Year", progress: 100, hasAnchors: true },
      { number: 3, title: "The Reply that Waited", progress: 100, hasAnchors: false },
      { number: 4, title: "Crossing Timelines", progress: 64, hasAnchors: true },
      { number: 5, title: "A Name on the Envelope", progress: 30, hasAnchors: false },
      { number: 6, title: "The Last Letter", progress: 0, hasAnchors: false },
      { number: 7, title: "Return to Sender", progress: 0, hasAnchors: false },
      { number: 8, title: "Dear Stranger", progress: 0, hasAnchors: false },
    ],
  },
  {
    id: "2",
    title: "Midnight Margin Notes",
    author: "L. Venn",
    coverGradient: "linear-gradient(135deg, #0f1629 0%, #1a2744 50%, #2a1f3d 100%)",
    tags: ["mystery", "literary"],
    description:
      "A used bookshop clerk discovers that someone has been leaving coded messages in the margins of secondhand novels. Following the trail leads to a conversation that spans decades.",
    pausesCount: 124,
    commentsCount: 67,
    anchors: [
      { id: "a2-1", quote: "The margin note was written in pencil, fading like the memory of whoever left it.", pausesCount: 36, commentsCount: 15 },
      { id: "a2-2", quote: "Who writes in margins anymore? Ghosts, apparently.", pausesCount: 29, commentsCount: 12 },
      { id: "a2-3", quote: "Every underlined word was a breadcrumb. She just had to find the loaf.", pausesCount: 25, commentsCount: 10 },
      { id: "a2-4", quote: "The best conversations happen in the margins, where no one is performing.", pausesCount: 22, commentsCount: 8 },
      { id: "a2-5", quote: "He wrote in pencil because certainty felt dishonest.", pausesCount: 18, commentsCount: 6 },
      { id: "a2-6", quote: "A secondhand book is never empty. It arrives with company.", pausesCount: 15, commentsCount: 5 },
    ],
    chapters: [
      { number: 1, title: "Pencil Marks", progress: 100, hasAnchors: true },
      { number: 2, title: "Between the Lines", progress: 100, hasAnchors: true },
      { number: 3, title: "The Trail of Ink", progress: 100, hasAnchors: false },
      { number: 4, title: "An Unsigned Conversation", progress: 80, hasAnchors: true },
      { number: 5, title: "The Missing Volume", progress: 40, hasAnchors: false },
      { number: 6, title: "Erasure", progress: 0, hasAnchors: false },
      { number: 7, title: "Overwritten", progress: 0, hasAnchors: true },
    ],
  },
  {
    id: "3",
    title: "The Quiet Chapter",
    author: "A. Morel",
    coverGradient: "linear-gradient(135deg, #162040 0%, #1e2d52 50%, #0f1629 100%)",
    tags: ["quiet", "philosophy"],
    description:
      "A meditation on the chapters in life where nothing seems to happen. The narrator explores the meaning found in stillness, routine, and the courage to stay when everything says leave.",
    pausesCount: 201,
    commentsCount: 134,
    anchors: [
      { id: "a3-1", quote: "I paused here, and it felt like the story paused with me.", pausesCount: 51, commentsCount: 22 },
      { id: "a3-2", quote: "Some chapters exist not to move the plot forward, but to let you breathe.", pausesCount: 44, commentsCount: 19 },
      { id: "a3-3", quote: "Stillness is not the absence of progress. It is progress learning to wait.", pausesCount: 38, commentsCount: 15 },
      { id: "a3-4", quote: "The most important pages are the ones you almost skipped.", pausesCount: 33, commentsCount: 12 },
      { id: "a3-5", quote: "Staying is its own kind of movement.", pausesCount: 28, commentsCount: 10 },
    ],
    chapters: [
      { number: 1, title: "The Room Before Daylight", progress: 100, hasAnchors: true },
      { number: 2, title: "A Season of Staying", progress: 100, hasAnchors: true },
      { number: 3, title: "The Art of Waiting", progress: 100, hasAnchors: true },
      { number: 4, title: "What the Window Sees", progress: 47, hasAnchors: false },
      { number: 5, title: "Uneventful Days", progress: 0, hasAnchors: false },
      { number: 6, title: "The Last Quiet", progress: 0, hasAnchors: true },
    ],
  },
  {
    id: "4",
    title: "Small Fires in Distant Windows",
    author: "J. Linden",
    coverGradient: "linear-gradient(135deg, #2a1f3d 0%, #1a2744 50%, #0f2b3d 100%)",
    tags: ["literary", "speculative"],
    description:
      "Interconnected stories of people who cannot sleep, each drawn to the window by a light they cannot explain. What they see changes what they remember.",
    pausesCount: 177,
    commentsCount: 98,
    anchors: [
      { id: "a4-1", quote: "From this distance, every lit window looks like a small act of defiance against the dark.", pausesCount: 48, commentsCount: 20 },
      { id: "a4-2", quote: "You do not know who sits inside, but you know they chose to stay awake.", pausesCount: 39, commentsCount: 16 },
      { id: "a4-3", quote: "Some stories only make sense when you read them beside someone who is also lost.", pausesCount: 34, commentsCount: 13 },
      { id: "a4-4", quote: "The fire was small enough to hold and bright enough to share.", pausesCount: 29, commentsCount: 11 },
    ],
    chapters: [
      { number: 1, title: "First Light", progress: 100, hasAnchors: true },
      { number: 2, title: "The Insomniac Cartography", progress: 100, hasAnchors: true },
      { number: 3, title: "Window #7", progress: 100, hasAnchors: false },
      { number: 4, title: "What the Flame Remembers", progress: 100, hasAnchors: true },
      { number: 5, title: "Across the Street", progress: 100, hasAnchors: false },
      { number: 6, title: "Embers", progress: 100, hasAnchors: true },
    ],
  },
]

/** Look up a BookDetail by id. Falls back to generating a default from MockBook data. */
export function getBookDetail(id: string): BookDetail | undefined {
  const found = bookDetails.find((b) => b.id === id)
  if (found) return found

  // Fallback: create a minimal detail from MockBook data
  const book = mockBooks.find((b) => b.id === id)
  if (!book) return undefined

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverGradient: book.coverGradient,
    tags: book.tags,
    description: `A compelling exploration of themes found within ${book.title}. Readers have paused ${book.pausesCount} times across its pages, leaving ${book.commentsCount} thoughts along the way.`,
    pausesCount: book.pausesCount,
    commentsCount: book.commentsCount,
    anchors: [
      { id: `${book.id}-fa1`, quote: book.excerpt, pausesCount: Math.floor(book.pausesCount * 0.3), commentsCount: Math.floor(book.commentsCount * 0.3) },
    ],
    chapters: Array.from({ length: 6 }, (_, i) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      progress: i < 3 ? 100 : i === 3 ? 50 : 0,
      hasAnchors: i % 2 === 0,
    })),
  }
}

/* ──────────────────────────────────────────────
   READER DATA
   ────────────────────────────────────────────── */

export interface ReaderComment {
  id: string
  user: string
  text: string
  timeAgo: string
}

export interface ReaderParagraph {
  id: string
  text: string
  comments: ReaderComment[]
}

export interface ChapterContent {
  bookId: string
  bookTitle: string
  bookAuthor: string
  chapterNumber: number
  chapterTitle: string
  paragraphs: ReaderParagraph[]
  discussionComments: ReaderComment[]
}

export function getChapterContent(
  bookId: string,
  chapter: number
): ChapterContent | undefined {
  return readerChapters.find(
    (c) => c.bookId === bookId && c.chapterNumber === chapter
  )
}

/* ──────────────────────────────────────────────
   READING CONTEXT & SCOPE
   ────────────────────────────────────────────── */

export interface MockGroupActivity {
  id: string
  user: string
  text: string
  bookTitle: string
  timeAgo: string
}

export interface MockGroup {
  id: string
  name: string
  description: string
  members: number
  bookIds: string[]
  recentActivity: MockGroupActivity[]
}

export const MOCK_GROUPS: MockGroup[] = [
  {
    id: "g1",
    name: "Night Readers",
    description: "Late night quiet reading — one chapter at a time.",
    members: 12,
    bookIds: ["1"],
    recentActivity: [
      { id: "ra1", user: "mira.reads", text: "The scar metaphor in the first paragraph hit different this time.", bookTitle: "The Namiya Letters", timeAgo: "2h ago" },
      { id: "ra2", user: "quietpages", text: "Thirty years of silence, then three boys answer every letter. Beautiful.", bookTitle: "The Namiya Letters", timeAgo: "5h ago" },
      { id: "ra3", user: "nocturn_e", text: "Finishing chapter 2 tonight — the Rabbit letter is devastating.", bookTitle: "The Namiya Letters", timeAgo: "1d ago" },
    ],
  },
  {
    id: "g2",
    name: "Tokyo Book Club",
    description: "Japanese lit and slow discussions, no spoilers.",
    members: 48,
    bookIds: ["1", "b2"],
    recentActivity: [
      { id: "ra4", user: "joon_k", text: "Keiko's relationship with routine is so relatable. The store is her world.", bookTitle: "Convenience Store Woman", timeAgo: "1h ago" },
      { id: "ra5", user: "sol.writes", text: "The mailbox scene at the end of chapter 1 is unforgettable.", bookTitle: "The Namiya Letters", timeAgo: "3h ago" },
      { id: "ra6", user: "half.moon", text: "Can we discuss the ending of Convenience Store Woman this weekend?", bookTitle: "Convenience Store Woman", timeAgo: "2d ago" },
    ],
  },
]

export function getGroupById(id: string): MockGroup | undefined {
  return MOCK_GROUPS.find((g) => g.id === id)
}

/* ──────────────────────────────────────────────
   SENTENCE FEED (MVP core)
   ────────────────────────────────────────────── */

export interface SentenceComment {
  id: string
  user: string
  text: string
  timeAgo: string
  likes: number
}

export interface MockSentence {
  id: string
  text: string
  bookTitle: string
  author: string
  uploadedBy: string
  uploadedAt: string
  likes: number
  saves: number
  comments: SentenceComment[]
}

export const SENTENCE_SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "most-commented", label: "Most commented" },
] as const

export const mockSentences: MockSentence[] = [
  {
    id: "s1",
    text: "Sometimes a single sentence is enough to start over.",
    bookTitle: "The Namiya Letters",
    author: "K. Hiroshi",
    uploadedBy: "mira.reads",
    uploadedAt: "2d ago",
    likes: 312,
    saves: 148,
    comments: [
      { id: "sc1", user: "joon_k", text: "I've been sitting with this line for three days. It's the kind of sentence that makes you want to write something.", timeAgo: "2d ago", likes: 24 },
      { id: "sc2", user: "quietpages", text: "Read this during a rough week. It actually helped.", timeAgo: "1d ago", likes: 18 },
      { id: "sc3", user: "sol.writes", text: "What makes a sentence 'enough'? I think it's when it asks nothing of you but still gives everything.", timeAgo: "20h ago", likes: 31 },
      { id: "sc4", user: "nocturn_e", text: "Starting over implies something ended. That tension is baked right into the line.", timeAgo: "14h ago", likes: 9 },
    ],
  },
  {
    id: "s2",
    text: "From this distance, every lit window looks like a small act of defiance against the dark.",
    bookTitle: "Small Fires in Distant Windows",
    author: "J. Linden",
    uploadedBy: "ink.stains",
    uploadedAt: "3d ago",
    likes: 278,
    saves: 103,
    comments: [
      { id: "sc5", user: "page.turner", text: "I looked out my own window after reading this. Every one of them suddenly meant something.", timeAgo: "3d ago", likes: 41 },
      { id: "sc6", user: "mira.reads", text: "Staying awake as defiance. Insomnia reframed completely.", timeAgo: "2d ago", likes: 27 },
      { id: "sc7", user: "dawnreader", text: "The word 'defiance' does so much work here. It's not just light, it's resistance.", timeAgo: "1d ago", likes: 19 },
    ],
  },
  {
    id: "s3",
    text: "A bookmark is just a promise you made to yourself: I will come back. But how many of those promises do we actually keep?",
    bookTitle: "The Weight of Bookmarks",
    author: "Y. Tanaka",
    uploadedBy: "cartograph",
    uploadedAt: "5d ago",
    likes: 256,
    saves: 89,
    comments: [
      { id: "sc8", user: "nocturn_e", text: "I have bookmarks in books I bought five years ago. This hit.", timeAgo: "5d ago", likes: 33 },
      { id: "sc9", user: "lanternlight", text: "The guilt of an unused bookmark is so specific and so real.", timeAgo: "4d ago", likes: 22 },
      { id: "sc10", user: "half.moon", text: "Is it worse to lose the bookmark or to find it again in a book you forgot?", timeAgo: "2d ago", likes: 16 },
    ],
  },
  {
    id: "s4",
    text: "Reading alone at night is not loneliness. It is a different kind of company — the kind that asks nothing of you but attention.",
    bookTitle: "The Reading Hour",
    author: "P. Svensson",
    uploadedBy: "half.moon",
    uploadedAt: "1d ago",
    likes: 234,
    saves: 117,
    comments: [
      { id: "sc11", user: "sol.writes", text: "This is the most accurate description of why I read. Saved.", timeAgo: "1d ago", likes: 44 },
      { id: "sc12", user: "quietpages", text: "Night reading is the original social network. Someone said that once and I never forgot it.", timeAgo: "20h ago", likes: 28 },
    ],
  },
  {
    id: "s5",
    text: "I never met the person who underlined this passage before me. But I trust their judgment more than most people I know.",
    bookTitle: "Footnotes to a Stranger",
    author: "D. Elgin",
    uploadedBy: "lanternlight",
    uploadedAt: "4d ago",
    likes: 198,
    saves: 76,
    comments: [
      { id: "sc13", user: "cartograph", text: "Secondhand annotations are love letters from strangers. This whole book understands that.", timeAgo: "4d ago", likes: 37 },
      { id: "sc14", user: "joon_k", text: "There is trust in following a stranger's underline. Completely agree.", timeAgo: "3d ago", likes: 21 },
      { id: "sc15", user: "ink.stains", text: "I bought a used book once covered in notes. Best purchase I ever made.", timeAgo: "1d ago", likes: 14 },
    ],
  },
  {
    id: "s6",
    text: "The letter was addressed to no one, which meant it was addressed to everyone.",
    bookTitle: "Undelivered Letters",
    author: "C. Moreau",
    uploadedBy: "sol.writes",
    uploadedAt: "6d ago",
    likes: 189,
    saves: 64,
    comments: [
      { id: "sc16", user: "mira.reads", text: "Addressed to no one, addressed to everyone. This is what great sentences do.", timeAgo: "6d ago", likes: 29 },
      { id: "sc17", user: "dawnreader", text: "The act of writing is the delivery. The destination is secondary.", timeAgo: "5d ago", likes: 18 },
    ],
  },
  {
    id: "s7",
    text: "What if you could map all the places where strangers held their breath? Every pause is a coordinate. Every silence is a landmark.",
    bookTitle: "An Atlas of Pauses",
    author: "R. Castillo",
    uploadedBy: "dawnreader",
    uploadedAt: "1w ago",
    likes: 167,
    saves: 58,
    comments: [
      { id: "sc18", user: "lanternlight", text: "A geography of hesitation. What a concept.", timeAgo: "1w ago", likes: 26 },
      { id: "sc19", user: "page.turner", text: "I want this atlas to exist. I want to see where people paused in the books I love.", timeAgo: "6d ago", likes: 15 },
    ],
  },
  {
    id: "s8",
    text: "She returned the book with a note tucked inside chapter seven. It said only: 'Thank you for lending me your evening.'",
    bookTitle: "Borrowed Evenings",
    author: "S. Nakamura",
    uploadedBy: "nocturn_e",
    uploadedAt: "1w ago",
    likes: 145,
    saves: 52,
    comments: [
      { id: "sc20", user: "half.moon", text: "Lending a book is lending a piece of time. That's exactly it.", timeAgo: "1w ago", likes: 23 },
      { id: "sc21", user: "ink.stains", text: "The intimacy of lending a book is so underrated. It's the most personal thing.", timeAgo: "5d ago", likes: 11 },
    ],
  },
]

export function getSentenceById(id: string): MockSentence | undefined {
  return mockSentences.find((s) => s.id === id)
}

export function getSortedSentences(sort: string): MockSentence[] {
  const list = [...mockSentences]
  if (sort === "newest") {
    // already roughly ordered by recency in mock; reverse for demonstration
    return list.reverse()
  }
  if (sort === "most-commented") {
    return list.sort((a, b) => b.comments.length - a.comments.length)
  }
  // trending: by likes
  return list.sort((a, b) => b.likes - a.likes)
}

export type ReadingContext =
  | { mode: "solo" }
  | { mode: "group"; groupId: string; groupName: string }

export type ScopeType = "public" | "memo" | "group"

export interface CommentWithScope {
  id: string
  content: string
  visibility: ScopeType
  groupId?: string
}

const readerChapters: ChapterContent[] = [
  {
    bookId: "1",
    bookTitle: "The Namiya Letters",
    bookAuthor: "K. Hiroshi",
    chapterNumber: 1,
    chapterTitle: "The Abandoned Mailbox",
    paragraphs: [
      {
        id: "p1-1",
        text: "The mailbox had not been opened in thirty years. Rust had grown over the slot like a scar, sealing whatever waited inside from the rest of the world. The three of them stood at the edge of the sidewalk, staring at it the way you stare at something you know you should leave alone.",
        comments: [
          { id: "c1", user: "mira.reads", text: "The scar metaphor sets the whole tone. You know this story will hurt.", timeAgo: "3d ago" },
          { id: "c2", user: "quietpages", text: "Thirty years is such a specific kind of neglect.", timeAgo: "2d ago" },
        ],
      },
      {
        id: "p1-2",
        text: "It was Shota who reached out first. He always did. Not because he was brave, but because waiting made him anxious, and action was the only medicine he trusted. The metal was cold even though it was August.",
        comments: [
          { id: "c3", user: "joon_k", text: "Action as medicine for anxiety. That is such an honest detail.", timeAgo: "4d ago" },
        ],
      },
      {
        id: "p1-3",
        text: "Inside the mailbox there were eleven letters. Eleven envelopes, each addressed to the shop by name. The handwriting varied from careful to desperate, and the paper had yellowed into something that looked more like skin than stationery.",
        comments: [],
      },
      {
        id: "p1-4",
        text: "Atsuya held one of the letters up to the streetlight. The ink had faded, but the words were still legible. Someone had written: I do not know who will read this. I only know that I need someone to. That is enough.",
        comments: [
          { id: "c4", user: "sol.writes", text: "Sometimes a single sentence is enough to start over. This is that sentence.", timeAgo: "1d ago" },
          { id: "c5", user: "half.moon", text: "The need to be heard, distilled into one line. I keep rereading it.", timeAgo: "5d ago" },
          { id: "c6", user: "dawnreader", text: "This paragraph is the heart of the entire book.", timeAgo: "2d ago" },
        ],
      },
      {
        id: "p1-5",
        text: "They sat on the floor of the empty shop, surrounded by dust and the faint smell of old wood. The letters were spread between them like a map of strangers. No one spoke for a while. The silence felt necessary, the way silence feels before you agree to something you cannot take back.",
        comments: [
          { id: "c7", user: "nocturn_e", text: "Silence before agreement. That image will stay with me.", timeAgo: "3d ago" },
        ],
      },
      {
        id: "p1-6",
        text: "It was Kohei who finally said it. His voice was quiet, almost embarrassed. What if we answer them? What if we write back? Shota laughed, but it was the kind of laugh that means you are already considering it. Atsuya said nothing, which was his way of saying yes.",
        comments: [
          { id: "c8", user: "lanternlight", text: "Saying nothing as a way of saying yes. I know people exactly like this.", timeAgo: "1d ago" },
          { id: "c9", user: "cartograph", text: "Three distinct characters established in a single paragraph. Efficient and beautiful.", timeAgo: "4d ago" },
        ],
      },
      {
        id: "p1-7",
        text: "The first letter they opened was from a woman who called herself Rabbit. She wrote about a choice she could not make: whether to follow the person she loved, or follow the life she had built. The paper smelled faintly of perfume, though it had been sealed for decades.",
        comments: [
          { id: "c10", user: "ink.stains", text: "The perfume surviving the decades. Details like this make fiction feel real.", timeAgo: "2d ago" },
        ],
      },
      {
        id: "p1-8",
        text: "Shota picked up a pen from the counter. It was dried out, so Kohei found another in his bag. They sat in a circle on the floor and began to draft a reply to someone they would never meet. The pen scratched against the paper, and for a moment the old shop felt less abandoned.",
        comments: [],
      },
      {
        id: "p1-9",
        text: "When they finished the first reply, Atsuya read it aloud. His voice cracked on the last line, not from sadness, but from the weight of talking to someone who had already lived the answer. They slid the letter back through the mailbox slot, as though it could still reach her.",
        comments: [
          { id: "c11", user: "page.turner", text: "Sending a reply through a rusted mailbox to someone who already lived the answer. Devastating and hopeful at once.", timeAgo: "6d ago" },
          { id: "c12", user: "mira.reads", text: "I paused here for a long time. The gesture matters more than the delivery.", timeAgo: "1d ago" },
        ],
      },
      {
        id: "p1-10",
        text: "They did not leave the shop that night. One by one, they opened the remaining letters. Each one was a small window into a life that had reached a crossroad. And one by one, they answered, not because they had wisdom, but because they had time, and sometimes that is the more generous gift.",
        comments: [
          { id: "c13", user: "quietpages", text: "Time as a gift more generous than wisdom. That is the thesis of this book, right here.", timeAgo: "3d ago" },
        ],
      },
    ],
    discussionComments: [
      { id: "dc1", user: "mira.reads", text: "This opening chapter sets up everything so quietly. No drama, just three people sitting on a floor choosing to care.", timeAgo: "2d ago" },
      { id: "dc2", user: "half.moon", text: "The pacing is perfect. Every paragraph earns the next one. I read the whole chapter without looking away.", timeAgo: "1d ago" },
      { id: "dc3", user: "joon_k", text: "Rabbit's letter is the emotional anchor of this chapter. The choice between love and life is such a universal tension.", timeAgo: "5d ago" },
      { id: "dc4", user: "sol.writes", text: "I noticed the shop is described through textures: rust, dust, old wood, yellowed paper. Not through sight but through touch. Brilliant.", timeAgo: "3d ago" },
      { id: "dc5", user: "lanternlight", text: "Every time I revisit this chapter I find a new line that means something different.", timeAgo: "4d ago" },
    ],
  },
]
