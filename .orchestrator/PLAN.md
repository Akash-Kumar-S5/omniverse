# Omniverse: build plan (Concept A, Agent Constellation)

## Stack
- Vite 6, React 19 and TypeScript (strict). Static build with no server.
- three, @react-three/fiber 9, @react-three/drei 10 and @react-three/postprocessing 3 (for bloom). Also maath and GSAP.
- zustand for shared state. ESLint with typescript-eslint and react-hooks.
- Fonts: Space Grotesk (display) and JetBrains Mono (HUD), loaded from Google Fonts in index.html.

## Architecture contract
Contract overview. File ownership is in the Team table below.
- `src/content/*`: projects, experiences, education, techStack and profile, copied from the 2D portfolio.
- `src/state/store.ts` exports `useOmni` (zustand) with:
  - `section`, one of `boot | about | experience | projects | contact`
  - `progress`, 0..1 over the whole page
  - `sectionProgress`, 0..1 within the current section
  - `activeProject` with `setActiveProject`, and `activeRole` with `setActiveRole`
  - `booted` with `setBooted`
  - `quality`, either `high` or `lite`
  - `reducedMotion` and `webgl`
- Scene code reads the store per frame with `useOmni.getState()`, so it never re-renders on scroll.
- `src/state/useScrollSync.ts` maps window scroll onto the store. Each DOM section is marked `[data-section]`.
- `src/scene/layout.ts` holds seeded plain data:
  - `projectNodes`, `techNodes` (each with a parent) and `projectEdges`
  - `roleWaypoints` (oldest role first) and the `beacon` position
- `src/scene/Experience.tsx` is the Canvas composition. It imports:
  - `constellation/Constellation`
  - `camera/CameraRig`
  - `fx/Starfield`
  - `fx/Effects`
- `src/ui/Overlay.tsx` is the DOM composition. It imports `boot/Boot`, `hud/Hud` and `sections/Sections`.
- `src/App.tsx` mounts the scene (as a fixed layer) and the overlay. When there is no WebGL or `?nogl` is set, it renders `ui/Fallback` instead. `?lite` turns on lite quality. Env detection runs in an effect.
- `src/styles/tokens.css` holds the design tokens and `src/styles/index.css` the base styles. UI agents keep their CSS inside their own folders.
- `index.html` and the root configs.

## Team
The team was expanded at Akash's request, passed on by Morph (see OPS-NOTES.md). Each builder works in its own worktree at `.worktrees/<name>` on branch `build/<name>`. The orchestrator merges each branch into `main`.

| Name | Kind | Owns (only) | Tab |
|---|---|---|---|
| codex-scene | codex | `src/scene/constellation/**`, `src/scene/fx/**`, `src/scene/layout.ts`: nodes, satellites, edge flow shader, GPU agent particles, beacon, starfield, bloom | scene |
| codex-camera | codex | `src/scene/camera/**`, `src/scene/Experience.tsx`: scroll rig, spline, project focus, parallax, reduced-motion poses, perf (dpr, adaptive) | scene |
| agy-hud | agy | `src/ui/boot/**`, `src/ui/hud/**`, `src/ui/Overlay.tsx`, `src/styles/**`, `index.html` head: boot log, HUD, quality toggle, global styles | ui |
| agy-sections | agy | `src/ui/sections/**`, `src/ui/fallback/**`, `src/ui/Fallback.tsx`: About, Experience, Projects nav, Contact, no-WebGL page, responsive | ui |
| rv-scene | claude | read-only review of codex-scene and codex-camera, written to `review/rv-scene.md` | review |
| rv-ui | claude | read-only review of agy-hud and agy-sections plus browser QA, written to `review/rv-ui.md` | review |

The orchestrator owns `src/state/**`, `src/content/**`, `src/App.tsx`, `src/main.tsx` and the root configs. It does not write scene or UI code.

No agent reviews its own work. Briefs are in `briefs/<name>.md`, and builder reports go to `reports/<name>.md` (15 lines max).

## Flow
1. All 6 builders run in parallel.
2. As each builder finishes, I merge its branch and run build and lint.
3. rv-scene and rv-ui review the merged main. Their findings go back to the owning builders, and this repeats until both reviews are clean.
4. qa checks the merged build in a browser, and its findings go back the same way.
5. I run the final verification and commit locally. Nothing is pushed.

## Done means
- `npm run build` and `npm run lint` are clean.
- Checked in a browser at desktop width and at 390px mobile width.
- The reduced-motion and no-WebGL paths both work.
- Both reviews and QA are clean.
- Desktop holds 60fps.

---

# Round 2 (see ROUND2-BRIEF.md)
New contract on main:
- `store.entered` / `setEntered`, plus `store.loadProgress` / `setLoadProgress`
- `src/state/chapters.ts` with `useChapter()`
- `src/state/smooth.ts` with `useSmoothScroll()`
- `src/state/anchors.ts`, the 3D→DOM label bridge
- vite watch now ignores `.worktrees`

| Name | Kind | Owns (only) | Gaps |
|---|---|---|---|
| codex-world | codex | `src/scene/{world,constellation,fx,anchors}/**`, `src/scene/layout.ts` | 3, anchors, loadProgress |
| codex-chapters | codex | `src/state/{chapters,smooth,useScrollSync}.ts`, `src/scene/camera/**`, `src/scene/Experience.tsx` | 1 (state), 6 |
| agy-type | agy | `src/ui/**`, `src/styles/**`, `index.html` head, `public/fonts/**` | 1 (overlay), 2, 4, 5, 7 |
| claude-assets | claude | `public/assets/**`, `CREDITS.md`, `src/content/**` | assets, 8 |
| claude-review | claude | read-only; writes `review/round2-review.md` and `reference/r2-*.png` | all, acceptance |

Order:
1. The overlap fix goes first: agy-type's step 1, backed by codex-chapters' state machine.
2. claude-assets' first batch is merged early so codex-world can use it.
3. Screenshot-strip checkpoint with Akash before the final merge.
