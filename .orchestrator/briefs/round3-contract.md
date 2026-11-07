# Round 3 contract (orchestrator-owned). Direction: "Sanctum + Signal Field". Read `.orchestrator/research/3D-PLAYBOOK.md` (3a, 3, 4, 7b, 8).

UI, typography, copy, HUD, overlay are FROZEN. Do not edit `src/ui/**`, `src/state/**`, `src/App.tsx`, root configs. Need a contract change? Say so in your report and stop.
Shared types/constants: `src/state/signal.ts` (ShapeId, CHAPTER_SHAPE, CHAPTER_SPOTS, SanctumSpots, SANCTUM_FILES, SIM_SIZE, TIERS, `signal` bus). `store.quality` = high | medium | lite.

## The shared names
- **Camera spots** (`CHAPTER_SPOTS`): boot_wide, boot_under_oculus, about_niche, exp_role_0..3, proj_gallery, proj_0..7, contact_sky. In Blender: cameras named `CAM_<spot>`.
- **Shape anchors**: Blender empties named `ANCHOR_core`, `ANCHOR_bust`, `ANCHOR_helix`, `ANCHOR_glyph`, `ANCHOR_beacon` (radius = empty display size). The glyph anchor is where all 8 project glyphs form.
- **Manifest**: blender-sanctum exports `public/assets/models/sanctum.spots.json` matching `SanctumSpots` (positions in glTF space, Y up, metres; target = point 3 m ahead along the camera forward axis unless a `TARGET_<spot>` empty exists; fov in degrees vertical).
- **Files** (`SANCTUM_FILES`): `sanctum.glb` (HIGH/MEDIUM), `sanctum-lite.glb` (1k textures, SAME node names), `sanctum.spots.json`. Budget: GLB + lightmaps <= 4 MB total HIGH.
- **Node names in the GLB**: `sanctum_architecture` (baked static mesh, unlit basic material is fine), `floor` (separate mesh so the runtime reflector can replace its material), `oculus_shaft` (empty at the oculus centre + `shaft_axis` direction), `bust_pedestal`. The marble bust stays its own file `marble_bust_01.glb`.

## Ownership (worktrees under .worktrees/, branches r3/<name>)
- **blender-sanctum**: `blender/**`, `public/assets/models/sanctum*`, CREDITS.md rows for new assets. Cycles stills per chapter camera to `.orchestrator/reference/r3-blender-<spot>.png` BEFORE any export; STOP after stills and report so the orchestrator can show Akash. Then export.
- **codex-world**: `src/scene/particles/**`, `src/scene/shaders/**`. Exports `SignalField` from `src/scene/particles/index.ts`. Reads anchors from props (falls back to origin until the manifest exists).
- **agy-world**: loading `sanctum.glb`, `src/scene/world/**` (Floor reflector, VolumeCone shaft, dust motes), `src/scene/camera/CameraRig.tsx` (splines through the CHAPTER_SPOTS from the manifest), `src/scene/fx/Effects.tsx`, `src/scene/Experience.tsx`. Removes `src/scene/constellation/` and flat cones.
- agy-review judges playbook section 8 with screenshots.

## Rules
Merge order: codex-world step 1 -> blender-sanctum export -> agy-world integrates. Builders `git merge --ff-only main` first. Reports: `.orchestrator/reports/round3-<name>.md` (<=40 lines). Build + lint clean at every commit. Co-Authored-By trailer. No push. Blender runs headless only: `/Applications/Blender.app/Contents/MacOS/Blender -b -P blender/scripts/<x>.py`. No BlenderMCP, no global installs (local npx OK). Reduced motion: no flights/morph/turbulence. No-WebGL fallback unchanged.

## REUSE-FIRST (Akash; playbook section 0): applies to every agent
Before writing anything new, use ready-made resources and say in your report what you reused: drei/postprocessing components (SpotLight volumetric, MeshReflectorMaterial, Sparkles, Environment, Sampler, ContactShadows, PerformanceMonitor, AdaptiveDpr; built-in Bloom/DOF/AgX/Noise/Vignette); cloned MIT refs in `.orchestrator/research/refs/` (Nova morph, r3f-flow-field-particles, codrops-surface-sampling; keep licence headers and list reused files in CREDITS.md); assets on disk; BlenderMCP's Poly Haven integration for props (model only the architecture shell); round 1-2 code (chapter machine, Lenis, anchors, LoadProgress, CameraRig: extend, don't replace). Build from scratch only when none fits, and say why. Supersedes any "custom VolumeCone" wording in the briefs: use drei `<SpotLight volumetric>` first.
