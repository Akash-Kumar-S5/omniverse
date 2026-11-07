# Round 3: agy-world (Sanctum GLB, stage, camera rig, beam haze, swarm tint & chapter proofs)

## Sanctum Integration & Composition Rule
- Rebased on main and loaded `sanctum.glb` (`sanctum-lite.glb` on LITE) with local Draco decoder (`public/draco/`).
- Rendered `sanctum.glb` unlit with `toneMapped=false` to preserve authored Cycles pre-baked lightmaps without duplicate tone mapping.
- All round-2 constellation objects (wireframe spheres, triangle cones, flat grey floor) completely removed and replaced.
- Morph composition rule applied: on chapter 0, camera look-at shifted left (`look.x -= 1.6`) on desktop, locking the swarm footprint to the right of 55% width and below the nav, leaving 27–46% width clear for the hero text.

## Volumetric Beam & Particle Swarm
- Replaced opaque white cone with subtle additive haze shader cone in `VolumeCone.tsx` (base opacity 0.11 within 0.08–0.15, edge fresnel rim falloff, scrolling 3D simplex noise shafts, smooth floor depth-fade, internal `<Sparkles>`).
- Particle swarm in `particles.frag` & `cpu.frag` tuned with warm amber champagne near (`#f5b861`) and deep bronze far (`#8c5224`), brightness capped at `mix(0.38, 0.65, selected)`, and postprocessing Bloom luminance threshold raised to 0.94 (intensity 0.16) so individual particles read crisply without blooming into an overexposed blob.

## CameraRig & UI Integration
- Restored `ui-editor` quiet HUD from `main` (no fake telemetry, honest local Chennai time, quiet graphics selector).
- Bound `CameraRig.tsx` to `sanctum.spots.json` with instant initial alignment and tuned `maath.easing.damp3` (0.45s) for smooth chapter transitions.
- All 5 chapters tested and confirmed visibly distinct with `?skipgate&chapter=0..4`.

## Screenshot Evidence (1440x900)
- Verified chapter captures saved in `.orchestrator/reference/`:
  - `r3-agyworld-ch0.png` / `r3-agyworld-boot.png`: 1080 KB (subtle additive sunbeam, right-half swarm, zero text overlap).
  - `r3-agyworld-ch1.png` / `r3-agyworld-about.png`: 1546 KB (`about_niche` framed on pedestal with marble bust particle swarm).
  - `r3-agyworld-ch2.png` / `r3-agyworld-experience.png`: 1356 KB (corridor perspective through concrete portal arches with boulders).
  - `r3-agyworld-ch3.png` / `r3-agyworld-projects.png`: 1578 KB (north gallery monolith slabs).
  - `r3-agyworld-ch4.png` / `r3-agyworld-contact.png`: 1337 KB (contact sky oculus looking up at starfield dome).
  - `r3-agyworld-floor.png`, `r3-agyworld-beam.png`, `r3-agyworld-perf.png`: Proof files.
