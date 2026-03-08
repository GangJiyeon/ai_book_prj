You are building a PROFILE PAGE for an existing social reading web app.
This is NOT a new design system — you MUST follow the existing UI style.

IMPORTANT CONTEXT
- The app already has a navy “night reading” design system.
- Deep navy gradients, subtle glow, minimal modern layout.
- Clean, calm, reading-focused. NOT cute, NOT corporate dashboard.
- Follow existing spacing, typography scale, and component style.

ROUTE
This page is opened when clicking “Profile” in the header navigation.

PAGE NAME
Bookshelf (User Profile)

GOAL
This page should feel like a personal reading space, quiet and reflective.
It is not a social feed. It is a personal archive.

LAYOUT STRUCTURE

1. TOP PROFILE HEADER
- Circular avatar (placeholder)
- Username
- Short bio (1 line)
- Small stats row:
  - Books read
  - Pauses (bookmarks)
  - Comments left
- Edit profile button (subtle ghost button, not primary)

2. TAB NAVIGATION (important)
Use horizontal tabs under the header:

[ My Books ]
[ Anchors ]
[ Comments ]

Do NOT use sidebar navigation.

3. TAB CONTENT

=== My Books ===
Grid layout (same card style as Book List page):
- Book cover
- Title
- Reading progress bar (thin)
- Last opened timestamp (small text)

=== Anchors ===
Vertical list of bookmarked passages:
Each item:
- Short quote (1–2 lines, original placeholder text)
- Book title
- Small “Open in reader” button
- Tiny reaction icons (heart / comment count)

This section must feel calm and readable.

=== Comments ===
Minimal list layout:
- Comment text
- Book title (small muted text)
- Anchor location (e.g. Chapter 3)
- Timestamp
No heavy cards.

VISUAL STYLE RULES
- Deep navy background
- Soft card surfaces (#1C2541 style tone)
- Moonlight yellow only for highlights
- Hot pink ONLY for reaction counts
- Rounded corners, soft shadows
- Avoid strong borders or bright white backgrounds

INTERACTION RULES
- Hover = subtle lift + glow
- Tabs switch with smooth fade (no sliding animation)

TECH NOTES
- Frontend-only mock UI
- Use placeholder data arrays
- Keep components reusable
- English placeholder text only