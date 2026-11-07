# Brief: agy-sections (kind agy)
Read `.orchestrator/briefs/COMMON.md` and `.orchestrator/PLAN.md` first.

## Outcome
Build the scrolling content over the 3D scene, plus the 2D fallback.

`src/ui/sections/Sections.tsx` must render one `<section data-section="...">` for each SectionId, in this order: boot, about, experience, projects, contact. The scroll sync depends on that.

Heights: boot about 100vh, about 120vh, experience about 60vh per role, projects about 100vh per project, contact 100vh.

Keep content on the left 40% on desktop and on bottom sheets on mobile, with scrims so it stays legible over the scene. Data comes from `src/content` (`profile`, `experiences`, `education`, `projects`, `techStack`).

Each section:
- **About:** the name, the role and the pitch, with a staggered letter reveal (reduced motion: a simple fade).
- **Experience:** 4 role cards (company, role, period, 2–3 achievements). The active card is the one matching `activeRole` from the store.
- **Projects:** a sticky panel showing `projects[activeProject]` (title, description, tags, GitHub and live links).
  - Scrolling through the section sets `activeProject` from `sectionProgress`.
  - Prev and Next buttons, the arrow keys and a horizontal swipe on touch also set it. They should scroll to the matching position so scroll and state stay in sync.
  - Show a `03 / 08` counter.
- **Contact:** a short CTA, an email button that copies to the clipboard and shows "copied", and links to GitHub and LinkedIn.

Fallback (`src/ui/Fallback.tsx` and `src/ui/fallback/**`): a complete, good-looking 2D page with the same content for browsers without WebGL. Test it with `?nogl`. Use a CSS-only gradient backdrop and no three.js import anywhere in the fallback tree.

Use semantic landmarks and headings, and design mobile-first for 390px. Put your CSS in your own folders (for example `sections.css`) and use the tokens from `src/styles/tokens.css`, which you may not edit.

## You own
- `src/ui/sections/**`
- `src/ui/fallback/**`
- `src/ui/Fallback.tsx`

## Read-only
- Everything else: `src/styles/**`, `Overlay.tsx` and `src/ui/hud/**` belong to agy-hud.

## Acceptance
- Build and lint are clean.
- No horizontal scroll at 390px.
- Everything is keyboard-operable.
- WCAG AA contrast.
