# Brief: codex-camera (kind codex)
Read `.orchestrator/briefs/COMMON.md` and `.orchestrator/PLAN.md` first.

## Outcome
Choreograph the camera and own the Canvas and perf setup. Read store state each frame with `useOmni.getState()` (`section`, `sectionProgress`, `activeProject`, `reducedMotion`). Damp every move (maath `easing.damp3` or a similar smoothing function) so nothing ever snaps.

What the camera does in each section:
- **Boot:** a slow push-in from far away.
- **About:** a wide 3/4 orbit of the whole graph that drifts slowly.
- **Experience:** follows a CatmullRom spline through `roleWaypoints`, driven by `sectionProgress`. Call `setActiveRole(i)` when the camera passes waypoint i, and only when the value changes.
- **Projects:** frames `projectNodes[activeProject]`, offset so the node sits in the right third (the UI panel is on the left). On mobile (aspect < 1), the node sits in the top half.
- **Contact:** pulls back and centers on `beacon`.

Other behaviour:
- Add a small pointer parallax and turn it off on touch devices.
- Reduced motion: fixed poses per section, with a short damped move only when the section changes.
- Perf, in `Experience.tsx`:
  - Use drei `PerformanceMonitor` to drop dpr.
  - Use `AdaptiveDpr`.
  - Pause rendering while the tab is hidden.
  - Keep `quality === 'lite'` at dpr 1 with no antialiasing.

## You own
- `src/scene/camera/**`, with the default export `CameraRig`
- `src/scene/Experience.tsx` (keep the imports of Constellation, Starfield and Effects from their current paths)

## Read-only
- `src/scene/layout.ts`, which codex-scene owns and you consume
- `src/state/**` and `src/content/**`

## Acceptance
- Build and lint are clean.
- No per-frame allocations: keep the scratch vectors in refs.
- Smooth on both trackpad and wheel scroll.
