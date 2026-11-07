# Brief: codex-chapters (kind codex). Gaps 1 and 6: chapters, camera, Lenis, overlay state

Read `round2-COMMON.md` first.

## Outcome
Each chapter should feel like its own place, and the overlays must never overlap.

### 1. Overlay state machine (do this first: it backs the overlap bug fix)
Implement `useChapter()` in `src/state/chapters.ts` and keep its API.

- **Single active chapter.** Exactly one chapter is `active` at a time.
- **Hysteresis.** Switch chapters at a section-progress band, not at a single pixel, so it does not flicker at the boundaries.
- **Phase sequence.** When the chapter changes:
  1. The outgoing chapter runs `phase: 'exit'` for about 350ms.
  2. Then the new chapter runs `enter`.
  3. Then it goes to `idle`.
- **Reduced motion.** The phases become instant.

Commit this on its own and report, so agy-type can rely on it.

### 2. Lenis
Implement `useSmoothScroll()` in `src/state/smooth.ts`:
- Use lenis 1.3, with a duration of about 1.1 and a smooth wheel.
- Drive it from one rAF loop, or from gsap.ticker if you use ScrollTrigger.
- It must keep `useScrollSync` correct: native scroll events still fire with Lenis, but verify it.
- No-op for reduced motion. Expose a way to scroll to a section, for example `scrollToSection(id)` exported from `smooth.ts`. agy-type will use it for "next" buttons.

### 3. Camera compositions (`src/scene/camera/**`)
Give each chapter a distinct composition and lighting state.
- **Boot/hero:** low, wide, and looking up at the crystal core, with the core about 60% right of centre. Leave the left 45% free for huge type.
- **About:** cut away from the graph to the about object, framed on the right, with negative space on the left for the text and callouts.
- **Experience:** a slow lateral dolly along a path past four waypoints. The panel sits on the left in glass.
- **Projects:** full-screen chapters. The camera flies node to node when `activeProject` changes (DepthOfField focus pull if codex-world adds it). Frame the active monolith centre-right, as the subject.
- **Contact:** pull up and back to show the whole constellation collapsing into the beacon.

Expose a per-chapter "light state" (for example key light intensity and fog) for codex-world to read. Agree the shape by putting it in `src/scene/camera/chapterLook.ts`. codex-world reads it; you own it.

Reduced motion: cut between fixed poses with a short fade, and no flights.

### 4. `Experience.tsx`
Mount `<World/>` from `src/scene/world` (codex-world; a stub at first) next to the existing pieces. Keep `PerformanceMonitor` and `AdaptiveDpr`. Pause rendering on hidden tabs.

## You own
- `src/state/chapters.ts`
- `src/state/smooth.ts`
- `src/state/useScrollSync.ts` (handed over to you; keep the `enabled` argument)
- `src/scene/camera/**`
- `src/scene/Experience.tsx`

## Read-only
- `src/scene/world/**`, `constellation/**` and `fx/**` (codex-world)
- `src/ui/**` (agy-type)
- `store.ts` and `anchors.ts`

## Acceptance
- No overlay flicker at chapter boundaries.
- Smooth on both trackpad and wheel.
- A steady 60fps.
- Build and lint clean.
