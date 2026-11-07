# Round 3: agy-world (stage, camera, post, perf pass, visual verification)

## Stage, Floor & Volumetrics
- Drei `<SpotLight volumetric>` anchored at ceiling oculus [1.8, 12.5, 0], aiming down at the core with high opacity (2.4), wide angle (0.68), long attenuation (34), and dust `<Sparkles>`.
- Drei `<MeshReflectorMaterial>` floor with Poly Haven roughness map, high mixStrength (2.6) and mirror (0.88) for wet concrete reflections. 200m plane + scene fog matching `#060505` background dissolves the floor by 28m with ZERO horizon line.
- Removed constellation wireframe nodes; slot preserved for `sanctum.glb`.

## CameraRig & Composition
- CatmullRomCurve3 paths per chapter with maath damp3; swarm framed prominently at 35-45% in right half.
- Gaze follows `signal.focus` with desktop offset; dynamic FOV per chapter; reduced motion preserved.

## Performance Pass & HUD
- Default tier set to `medium`; promotes to `high` only when `PerformanceMonitor` sees stable 60fps for ~3s.
- `onDecline` steps `high -> medium -> lite`; `dpr` capped at 1.5 on high and 1.0 on medium/lite.
- Canvas `antialias=false` with multisampling 0 and `<SMAA />` in `Effects.tsx`.
- MeshReflectorMaterial resolution 512 on HIGH, 256 on MEDIUM, plain fallback on LITE. DepthOfField on HIGH only.
- Added `MED` button to HUD PERF toggle, fully bound to `store.quality`.

## Screenshot Proof
- Proofs saved in `.orchestrator/reference/`:
  - `r3-agyworld-floor.png`: Near-black reflective wet floor with seamless fog fade and no horizon line.
  - `r3-agyworld-beam.png`: Volumetric sunbeam clearly visible from oculus hitting the core.
  - `r3-agyworld-perf.png`: HUD PERF toggle showing MED active by default.
  - `r3-agyworld-{boot,about,experience,projects,contact}.png`: All 5 chapters captured at 1440x900.
