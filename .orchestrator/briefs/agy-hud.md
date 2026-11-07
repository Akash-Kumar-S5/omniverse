# Brief: agy-hud (kind agy)
Read `.orchestrator/briefs/COMMON.md` and `.orchestrator/PLAN.md` first.

## Outcome
Build the frame around the experience.
- **Boot preloader** (`src/ui/boot/Boot.tsx`):
  - A full-screen terminal boot log in JetBrains Mono that types 6–8 short lines, e.g. `> mounting constellation… ok`, `> spawning agents… 8 nodes`.
  - A progress bar, then a fade-out, then a call to `useOmni.getState().setBooted()`.
  - Skippable with click, Enter or Escape, and capped at about 2.5s.
  - Reduced motion: no typing effect; call `setBooted` after about 300ms.
- **HUD** (`src/ui/hud/`). Fixed corner brackets plus four corner readouts:
  - top-left: the name mark
  - top-right: a live clock in Asia/Kolkata and a status dot reading "online"
  - bottom-left: the section index, `01/05` plus the section name, from the store
  - bottom-right: a Lite/High quality toggle (calls `setQuality`) and a scroll cue that hides after About

  Also add a thin progress line driven by `progress`, and a keyboard-accessible skip link.

  On 390px-wide screens, keep it to a minimal two-corner layout.
- **Global styling.**
  - You own `src/styles/**` (tokens and base) and `src/ui/Overlay.tsx` (the composition).
  - Keep the `Boot`, `Hud` and `Sections` imports in Overlay.
  - Keep the `.scene-layer` and `.overlay` classes, since App.tsx uses them.
  - Typography scale, colors and scrims all live in tokens. agy-sections consumes the tokens and does not edit them.

Never branch render output on matchMedia during first render. Read `reducedMotion` from the store.

## You own
- `src/ui/boot/**` and `src/ui/hud/**`
- `src/ui/Overlay.tsx`
- `src/styles/**`
- `index.html`, for the head and meta only

## Read-only
- `src/state/**`, `src/content/**`, `src/App.tsx` and `src/ui/sections/**`

## Acceptance
- Build and lint are clean.
- WCAG AA contrast.
- Focus-visible styles.
- The HUD never blocks scroll or clicks (use `pointer-events: none` except on its controls).
