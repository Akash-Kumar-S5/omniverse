# Round 3 contract (orchestrator-owned). Read with .orchestrator/research/3D-PLAYBOOK.md

UI, typography, copy, HUD and overlay are FROZEN. Round 3 touches only `src/scene/**`, `public/assets/**`, `CREDITS.md`.
Shared types live in `src/state/signal.ts` (ShapeId, CHAPTER_SHAPE, SIM_SIZE, TIERS, `signal` bus, SignalFieldProps). `store.quality` is now high | medium | lite.
Do not edit `src/state/**`, `src/App.tsx`, `src/ui/**`. If you need a contract change, write it in your report and stop.

## Ownership
- codex-world (r3/codex-world, `.worktrees/codex-world`): `src/scene/particles/**`, `src/scene/shaders/**` (curl.glsl etc). Writes `signal.focus/radius/morph`. Mounts nothing outside particles; exports `SignalField` from `src/scene/particles/index.ts`.
- agy-world (r3/agy-world, `.worktrees/agy-world`): `src/scene/world/Floor.tsx`, `VolumeCone.tsx`, `src/scene/camera/CameraRig.tsx`, `src/scene/fx/Effects.tsx`, `src/scene/Experience.tsx`.
  Reads `signal.*`. Removes wireframe icosphere nodes (`constellation/`) and flat cones. Keeps Starfield (dim), LoadProgress, AnchorWriters.
- Experience.tsx mounts `<SignalField />` from `./particles`. agy-world adds that import and mount; until codex-world merges, it stubs with a local `null` component behind the same import path via a placeholder `src/scene/particles/index.ts` that codex-world replaces (agy-world must NOT create it; just wait-import after merge, or guard with a TODO and keep build green by mounting after the first codex-world merge).

## Anchors (existing bridge, keep working)
`about.object` = bust head point, `hero.core` = core centre, `projects.active` = current glyph centre, `contact.beacon`. SignalField or AnchorWriters writes them (codex-world owns the particle-side values once SignalField exists).

## Quality and motion
Tiers per `TIERS`/`SIM_SIZE`. Reduced motion: no morph animation, no turbulence. No-WebGL: existing fallback. Both builders honor `?lite` and `?nogl`.

## Merge order
codex-world first (particles + shaders), then agy-world (mount + world/camera/fx). Builders `git merge --ff-only main` before each step. Reports go to `.orchestrator/reports/round3-<name>.md`.

## Acceptance
Playbook section 8. Build + lint clean. Initial JS gzip budget unchanged +-15%.
