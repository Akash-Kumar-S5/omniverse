# Round 2: rules for every agent

Goal: move Omniverse from "working demo" to award-site quality.

Read these in order before you start:
1. `.orchestrator/ROUND2-BRIEF.md`: the gaps, the external resources and the acceptance bar.
2. The images in `.orchestrator/reference/`. `aengel-*.png` is the bar and `omni-*.png` is where we are now.
3. Your own `round2-<name>.md` brief.

Study aengel.io; never copy its assets, text or layout.

## Contract
The orchestrator owns these files. They are read-only to every agent unless your brief hands one to you.
- `src/state/store.ts`
- `src/state/anchors.ts`
- `src/state/env.ts`
- `src/App.tsx`
- `src/main.tsx`
- `vite.config.ts`, `package.json` and the other root configs

The store holds:
- `section`, `progress` and `sectionProgress`
- `activeProject` and `activeRole`: the UI writes these, the camera only reads them
- `booted`
- `entered`, with `setEntered()`: the Enter gate
- `loadProgress`, from 0 to 100: the scene writes it and the preloader reads it
- `quality`, either `high` or `lite`
- `reducedMotion` and `webgl`

The other shared interfaces:
- `src/state/chapters.ts` exports `useChapter()`, which returns `{active, phase, progress}`. It is the only thing that decides which chapter's overlay may be visible. codex-chapters owns its implementation.
- `src/state/smooth.ts` exports `useSmoothScroll()` (Lenis). codex-chapters owns it.
- `src/state/anchors.ts` defines the anchor IDs and holds a mutable `anchors` record:
  - The scene writes projected screen positions into it every frame.
  - The UI reads them in rAF to draw callouts and leader lines.
  - If you need a new anchor ID, ask for it in your report.

Need a contract change? Put it under "Requests" in your report. Never make it yourself.

## Hard rules
- Edit only the paths your brief gives you. Work in your own worktree (your current directory).
- Libraries already installed: three, @react-three/fiber 9, drei 10, @react-three/postprocessing 3, gsap 3.15 (SplitText and ScrollTrigger are included), lenis, zustand and maath.
- Ask in your report before adding a package. `npx` tools such as gltf-transform and gltfjsx are fine.
- No runtime network fetches except Google Fonts or self-hosted fonts. drei `Environment` presets fetch from a CDN, so do not use them; use the local HDRI files in `public/assets/`.
- Respect `reducedMotion` and `quality === 'lite'`:
  - lite drops transmission and post-processing
  - reduced motion means no camera flights and no Enter gate
- Never branch render output on matchMedia during the first render.
- No per-frame allocations. Dispose of the GPU resources you create.
- Never git push, add a remote, use sudo, or `rm -rf` outside your own folders.

## Finish
1. Run `npm run build && npm run lint`. Both must be clean.
2. Commit on your branch, adding a `Co-Authored-By:` trailer naming you.
3. Write `.orchestrator/reports/round2-<name>.md`, at most 15 lines:
   - files
   - what works
   - known issues
   - requests
   - commit hash
4. Commit the report, then stop.

Long answers fold in the terminal, so put detail in the report file.
