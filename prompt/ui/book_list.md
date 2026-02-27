Create the “Book List / Discovery” page UI for a social reading + book exchange web app.
Frontend-only mock. No backend, no real auth, no database. Use hardcoded mock data arrays.
Theme must match an existing navy “night reading” landing page.

ROUTE / PAGE
- This is the /books page (or a standalone page component if routing is not set).

VISUAL THEME
- Deep navy gradient background with subtle noise/stars (very subtle)
- High contrast readable text
- Accents: moonlight yellow for highlights, hot-pink only for small reaction/emphasis
- Modern, minimal, not cute, not beige/pastel
- Rounded corners, soft shadows, subtle borders

TOP NAV
- Left: app name “NightPage”
- Links: Home, Books, Bookshelf, Profile/Account
- Right: Search icon + “Sign in” button (mock)

PAGE LAYOUT (DESKTOP-FIRST, RESPONSIVE)
1) Header row
- Page title: “Discover”
- Subtitle: “Find books where people leave thoughts at the exact line they paused.”
- Controls on the right:
  - Search input (placeholder: “Search title, author, tag…”)
  - Sort dropdown: Trending / New / Most commented / Most paused
  - Filter button opens a modal/drawer

2) Filter drawer (UI only)
Include filters:
- Genre chips
- Language
- Reading length (Short/Medium/Long)
- “Has many pause comments” toggle
- “Exchange available” toggle
Drawer should be clean, not heavy.

3) Main content: Book list grid
- 3–4 columns on desktop, 2 on tablet, 1 on mobile
Each book card includes:
- Cover thumbnail
- Title + author
- Small tags (e.g., “quiet”, “mystery”, “healing”)
- A “pause heat” indicator (tiny bar or dots showing where people paused most)
- Mini stats row:
  - ♥ likes, 💬 comments, ⏸ pauses
- A small “Exchange” badge on some books
- Primary CTA on card: “View details”
- Secondary: “Preview excerpt” (opens a modal)

4) Right side (on wide screens): “Trending pauses” panel
A sticky side panel showing 5 items:
- Each item: a short ORIGINAL placeholder quote (1 line) + book title + number of comments
Clicking opens a modal with quote + 3 comments (mock).

INTERACTIONS (VISUAL ONLY)
- Hover: card lifts slightly with soft glow
- “Preview excerpt” opens a modal:
  - shows quote (2–3 lines max) + 3 comments + button “Open reader”
- Clicking “View details” goes to /book/[id] (link only)

MOCK DATA
Create 10–12 mock books with:
- id, title, author, coverColor/coverGradient, tags, likes, commentsCount, pausesCount, exchangeAvailable boolean
Create 5 mock trending pause quotes (original placeholder text, not real book quotes).

COPY (ENGLISH)
Use English UI text everywhere.
Do NOT use real copyrighted book excerpts; write original placeholder quotes.

Make it look production-ready and consistent with a navy night-reading brand.