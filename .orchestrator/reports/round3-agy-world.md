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

## Morph Review Fixes (Branch `r3/agy-world-frame` from `main`):
1. Replaced canvas-drawn fake UI with authentic, desaturated CC0 masterwork paintings from The Met Open Access (Hubert Robert *Arches in Ruins* and 7 others), with full attributions in `CREDITS.md`.
2. Scaled and repositioned the Poly Haven standing picture frame (`scale: 4.2`, `x: -1.35`, `y: 1.78`), pulling it completely into the 1440x900 viewport with all 4 borders and stand clear of edges.
3. Elevated the celestial ember glyph anchor (`y: 3.35`, `x: -2.05`), ensuring zero collision and a distinct clearance gap above-left of the frame; verified via `.orchestrator/reference/r3-ch3-frame-v2-1440.png` and `r3-ch3-frame-v2-390.png`.

