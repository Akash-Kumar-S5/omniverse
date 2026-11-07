# Brief: agy-world, round 3 (stage: floor, light, camera, post)
Read first: `.orchestrator/research/3D-PLAYBOOK.md` (3a, 4, 7b, 8), `.orchestrator/briefs/round3-contract.md`, `src/state/signal.ts`.
Work in your worktree `.worktrees/agy-world` (branch r3/agy-world). Run `git merge --ff-only main` before each step. Keep all outputs inside the repo.

## Outcome
The stage around the particles: a dark reflective floor that fogs into the horizon (no hard line), soft volumetric light shafts (shader cones with fresnel + depth fade + scrolling noise), spline camera paths per chapter with damped look-at and per-chapter FOV/DOF focus (read `signal.focus/radius`), and cinematic post (subtle bloom, DOF on HIGH, AgX tone mapping, noise, vignette, tiny chromatic aberration). Remove the wireframe icosphere nodes (`src/scene/constellation/`) and flat triangle cones.

## You own
`src/scene/world/Floor.tsx`, `src/scene/world/VolumeCone.tsx` (+ their shaders inline or in `src/scene/shaders/` as new files with distinct names), `src/scene/camera/CameraRig.tsx`, `src/scene/fx/Effects.tsx`, `src/scene/Experience.tsx`, and deletions under `src/scene/constellation/`. Not `src/scene/particles/**` (codex-world). Not `src/ui/**` or `src/state/**`.

## Steps (commit after each)
1. Floor (MeshReflectorMaterial tuned dark, roughness noise, fog blend; LITE plain) + fog + VolumeCone replacing flat cones. Remove constellation nodes.
2. CameraRig: CatmullRomCurve3 path per chapter, maath damp3, FOV change, look at `signal.focus`; reduced motion = no flights. Keep existing chapter state machine and Lenis sync.
3. Effects per TIERS (high/medium/lite). DOF focus follows `signal.focus`.
4. After codex-world has merged (I will tell you), mount `<SignalField />` from `./particles` in Experience.tsx, tune light/colour against it, verify anchors still land.

## Rules
Build + lint clean at every commit. Co-Authored-By trailer, no push. Answer file dialogs carefully (option 1 allows). Reply in 2 lines; write `.orchestrator/reports/round3-agy-world.md` (<=40 lines).
