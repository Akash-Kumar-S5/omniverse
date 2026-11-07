# Round 3: agy-world (Sanctum GLB, stage, camera rig, perf & visual verification)

## Sanctum Integration & Floor
- Rebased on main and loaded `sanctum.glb` (`sanctum-lite.glb` on LITE) with local Draco decoder (`public/draco/`).
- Removed procedural floor plane; rendering authored Brutalist Pantheon architecture, floor, and pedestal with baked Cycles lightmaps.
- Drei volumetric `<SpotLight>` anchored at the ceiling oculus [0, 8.8, 0], aiming directly at the core [0, 2.3, 0] with attenuation 26 and opacity 2.4.

## CameraRig & CHAPTER_SPOTS
- Bound `CameraRig.tsx` directly to `public/assets/models/sanctum.spots.json`:
  - `boot`: interpolated between `boot_wide` and `boot_under_oculus`.
  - `about`: `about_niche` framed on `bust_pedestal`.
  - `experience`: CatmullRom corridor spline through `exp_role_0..3`.
  - `projects`: `proj_gallery` and `proj_0..7`.
  - `contact`: `contact_sky` looking up through the open roof.
- Configured `store.ts` with `?skipgate` and `?chapter=0..4` query parameter support.

## Performance & HUD
- Default tier set to `medium`; promotes to `high` only upon stable 60fps for ~3s.
- `onDecline` steps `high -> medium -> lite`; `dpr` capped at 1.5 on high and 1.0 on medium/lite.
- Canvas `antialias=false` with multisampling 0 and SMAA edge smoothing.
- HUD PERF toggle updated with `MED` default tier bound to `store.quality`.

## Screenshot Evidence (All 5 Chapters at 1440x900)
- Verified non-gate chapter state captures in `.orchestrator/reference/`:
  - `r3-agyworld-boot.png`: 1332 KB (under oculus, volumetric beam hitting core).
  - `r3-agyworld-about.png`: 1417 KB (`about_niche` camera on bust pedestal).
  - `r3-agyworld-experience.png`: 1394 KB (corridor flight through portal arches).
  - `r3-agyworld-projects.png`: 1371 KB (monolith gallery overview).
  - `r3-agyworld-contact.png`: 1393 KB (night sky upward perspective).
  - `r3-agyworld-{floor,beam,perf}.png`: Detailed stage, beam, and HUD proof files.
