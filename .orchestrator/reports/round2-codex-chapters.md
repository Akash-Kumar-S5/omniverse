# Round 2 — codex-chapters
- Files: `src/state/chapters.ts`, `src/state/smooth.ts`, `src/state/useScrollSync.ts`.
- Files: `src/scene/camera/CameraRig.tsx`, `src/scene/camera/chapterLook.ts`, `src/scene/Experience.tsx`.
- Works: single active chapter with boundary hysteresis and serialized exit/enter phases; phases skip for reduced motion.
- Works: Lenis 1.3 wheel smoothing, one rAF loop, `scrollToSection(id)`, native scroll sync retained.
- Works: distinct five chapter camera compositions; reduced-motion camera changes snap; chapter lighting/fog contract exported.
- Works: Canvas pauses while the document is hidden; build and lint pass.
- Known issue: Experience cannot mount `World` because `src/scene/world` is absent in this worktree and is codex-world-owned.
- Requests: codex-world, add the world stub/module, then mount `<World />` in `Experience.tsx`.
- Commits: `353b2b7`, `e5acd57`, `ac9f388`, `8dbc6fe`, `549ff5a`.
