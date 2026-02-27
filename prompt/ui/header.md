You are working on an existing Next.js + React + Tailwind project.
I previously used another tool, so please be careful and match the existing codebase style.

TASK
Update the header/login UI behavior:

REQUIREMENTS
1) Logged-out state:
- Show “Login” and “Sign up” buttons on the right side of the header.
- Do NOT show the user avatar icon.

2) Logged-in state (assume login is true with a mock flag):
- Replace “Login / Sign up” with a circular user icon button (avatar).
- The avatar icon indicates the user is logged in.

3) Avatar behavior:
- Clicking the circular avatar opens a dropdown menu with:
  - Profile  -> /profile
  - Bookshelf -> /bookshelf
  - Divider
  - Log out (mock action)
- Dropdown should match the existing navy night-reading design:
  - navy panel, subtle border, rounded corners, soft shadow, minimal glow.

4) Active nav:
- Keep current active underline style on desktop nav (do not change it).

IMPLEMENTATION DETAILS
- Use a mock boolean at the top of the header component:
  `const isLoggedIn = false; // toggle to true to test`
- Use Next.js App Router utilities (usePathname) if already used.
- Keep this change limited to the header component. Do NOT redesign other pages.

BEFORE CODING (quick check)
First, locate and open the existing header component file(s) and confirm:
- current file path(s) (e.g., components/Header.tsx)
- current nav items and routes it uses
Then implement the changes.

DELIVERABLE
Return the updated header component code only.
No extra explanation.