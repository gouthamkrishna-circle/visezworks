# Portfolio Site — Recreation of the Recorded Design

Rebuilding the site from your recording as a single-page TanStack Start app: same layout, cream/graph-paper canvas, orange-on-black typography, and the same motion language (scroll reveals, magnetic hover, text scramble, marquee, cursor-following EXPLORE bubble, dark-mode toggle).

One note up front: the recording is a live personal portfolio belonging to someone else, including their name, photo, employers and client logos. I'll rebuild the design, layout, typography and animations faithfully, but ship your own identity content in those slots (or neutral placeholders until you give me yours) rather than copying that person's personal details and brand assets.

## Sections to build (in recorded order)

1. **Floating pill navbar** — wordmark left; center pill with Home/About/Blogs/Expertise/Work/Experience each with a small superscript index; dark-mode moon toggle; white "Connect" pill with arrow. Scroll-progress bar pinned to the very top. Nav labels do a per-character scramble/shuffle animation on hover.
2. **Hero** — three stacked display lines: a small pixel/dotted "GRAPHICS" line, a giant orange line that cycles through roles (UI/UX, DEVELOPER, DESIGNER…) with a physical 3D toggle-switch graphic inline, and a giant black line. Sub-line "Design Engineer & Full Stack Developer." Rotating "35+ Projects Completed" circular badge top-right. Bottom-right "Hi! I Am <name>" with a dotted curved connector to a circular avatar with a soft orange glow. Below: an infinite logo marquee of partner/client logos.
3. **About** — "WHO I AM" eyebrow + big "About" heading. Large mixed-content paragraph where inline pills, the avatar chip, a year chip and icon glyphs sit inside the running text. "Expertise in Tools" row of circular tool badges ending in a "more" badge.
4. **Expertise** — asymmetric 2x2 card grid (top-left narrow / top-right wide, bottom-left wide / bottom-right narrow). Each card: outlined icon tile, title, truncated description, external-link icon. Hover paints a gradient border, turns the title orange, and a round orange "EXPLORE" bubble follows the cursor inside the card.
5. **Featured Works** — "My portfolio" eyebrow + heading, project cards.
6. **Experience** — "MY JOURNEY" eyebrow + heading. Accordion timeline grouped by company (orange bullet + orange company name), each role row expandable with chevron, showing type, date range, description with bolded metrics, and monospace tech-stack tags.
7. **Blogs + Footer** — matching the tail of the page.
8. **Floating chat bubble** — bottom-left dark circular button; expands into a "Hire me to bring your ideas to life!" glass panel with Contact / email / WhatsApp buttons and floating skill chips, with a blur-and-dim overlay behind it.

## Design system

- Background: warm cream with a faint graph-paper grid overlay; near-black text; single orange accent.
- Typography: geometric grotesque display (heavy, very tight tracking) for headings, clean sans for body, monospace for tags/superscripts. Loaded via Google Fonts in the root head.
- Full light/dark theming through semantic tokens in `src/styles.css` — no hardcoded colors.

## Technical notes

- Rewrite `src/routes/index.tsx` as the home page; sections as components under `src/components/sections/`.
- Motion for React for scroll reveals, layout transitions, the accordion, and the cursor-following hover bubble; CSS keyframes for the marquee, badge rotation and glow.
- Theme toggle via a `dark` class on `<html>`, persisted to localStorage and read after hydration to avoid mismatch.
- Anchor-based scroll navigation with active-section tracking for the nav indices.
- Avatar, badge and any illustrative imagery generated as assets; client logos as neutral placeholder marks.
- Route `head()` with a real title, description and og/twitter tags.

## What I need from you

Your name/wordmark, role lines, the tools and companies to list, and any real project entries. Without them I'll fill every slot with sensible placeholder content styled exactly as recorded, easy to swap later.
