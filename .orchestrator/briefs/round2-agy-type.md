# Brief: agy-type (kind agy). Gaps 1, 2, 4, 5 and 7: overlays, type, gate, callouts

Read `round2-COMMON.md` first.

## Step 1: fix the overlap bug (commit and report this first)
omni-02 and omni-03 show the bug:
- sticky panels from the previous section ghost in
- two panels stack on top of each other
- body copy prints over the top-left HUD

Rebuild the overlay layer:
- **Spacer sections.** `<section data-section>` elements become empty spacers that only set scroll length. Scroll sync needs them.
- **One fixed overlay layer.** Render a single `position: fixed` layer that shows ONLY the chapter from `useChapter().active`.
- **Transitions.** The outgoing chapter fades and translates out on `phase === 'exit'`, then the new one enters. Use GSAP or CSS. Reduced motion: an instant swap.
- **HUD safe zones.** Overlays never enter the top 90px or bottom 90px on desktop. On mobile, use 72px.
- Until codex-chapters lands its state machine, `useChapter()` simply follows the store section. Build against its API anyway.

## Step 2: art-directed type and layout
- **Fonts.**
  - Display: Clash Display or General Sans (Fontshare, free) or Archivo at 800–900.
  - Self-host them in `public/fonts/` with `@font-face`.
  - Mono only for tiny metadata.
- **Hero.** "AKASH KUMAR" at `clamp(64px, 11vw, 180px)`, uppercase, -0.04em tracking, left-anchored. Under it, a small role line and one confident sentence: "I build the tooling that lets AI agents do real work: harnesses, orchestration, developer tools." Take the copy from `src/content` after claude-assets rewrites it. No boxed card. The scene owns 70% or more of the frame.
- **Other chapters.** Lightweight text at most about 420px wide, sitting in the negative space the camera leaves. No slabs.
  - Only Experience may use a panel, and it must be glass (backdrop-blur, 1px hairline, translucent).
  - Projects are full-screen chapters: a large project title, a "01 / 08" counter and "NEXT PROJECT". Drag, the arrow keys or buttons set `activeProject`, and the counter advances through the scroll.
- **Motion.** Per-character reveals on headings with GSAP SplitText. Rolling per-character hover on CTAs. Reduced motion: none.
- **HUD.** Restyle it minimal and in the new palette (warm near-black, one accent; match codex-world). Keep the safe zones. Drop the clichés ("SYSTEM ONLINE // CONSTELLATION READY").

## Step 3: preloader and Enter gate
- The preloader shows a real counter from store `loadProgress` (0–100) and the name in display type.
- At 100, show an "Enter" button that calls `setEntered()`, followed by the camera push-in, which codex-chapters handles off `entered`.
- Skip the gate (`setEntered()` automatically) for reduced motion and lite. Keep it skippable with Enter or Escape.

## Step 4: callouts and leader lines
On Hero, About, Projects and Contact, read `anchors` from `src/state/anchors.ts` in a rAF loop. Draw small labels connected by thin SVG leader lines to the anchor points. Example labels:
- `orchestrator.ts`
- `agents: 8`
- `based in chennai` with lat/long 13.08° N, 80.27° E
- a live IST clock
- the active project's stack

Hide a label when its anchor is not `visible`. No React re-render per frame: update the DOM in the rAF loop.

## Mobile (390)
Readable text, no horizontal scroll, scene still visible. Callouts reduce to one or two.

## You own
- `src/ui/**`
- `src/styles/**`
- `index.html` (head only)
- `public/fonts/**`

## Read-only
- `src/state/**`, `src/content/**` and `src/scene/**`

## Acceptance
- No overlap at 10 evenly spaced scroll positions or during transitions.
- Hero type at least 11vw on desktop.
- WCAG AA.
- Keyboard-operable.
- The `?nogl` fallback still works and is restyled to match.
