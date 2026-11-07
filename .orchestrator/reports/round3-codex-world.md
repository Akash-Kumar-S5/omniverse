# Round 3: codex-world

## Step 1
- Added a minimal `SignalField` using `GPUComputationRenderer`, with a warm, soft point-cloud core and cursor repulsion.
- Publishes `signal.focus`, `signal.radius`, and `signal.morph` each frame; reads optional core anchor and quality props.
- `npm run build` and `npm run lint` pass. Build reports the existing large Experience chunk warning.
- How to see it: mount `<SignalField />` inside the R3F Canvas; it is exported from `src/scene/particles`.
- Gap: not mounted in `Experience.tsx` because that file belongs to agy-world.

## Step 2
- Added cached-per-state target texture generation for the sampled marble bust, four-cluster experience helix, active project text glyph, and pulsing beacon.
- The helix highlights the active role; project targets follow `activeProject`; particle positions publish the four scene anchors.
- Build and lint pass. Target changes currently reinitialize the simulation; step 3 will replace that with continuous morph transitions.
- During the reuse pass, adapted the available Nova and flow-field references; details and notices are recorded below and in `CREDITS.md`.

## Step 3
- Added a curl-noise field and a 1.2-second eased transition from a GPU snapshot of the current swarm to each new target, including retargets mid-flight.
- Reduced motion cuts directly to the final shape and disables turbulence; the beacon pulses when motion is enabled.
- Publishes the active shape focus/radius/morph and projected hero, bust, glyph, and beacon screen anchors.
- Build and lint pass. A target change on the helix now only changes the active-role highlight; it does not regenerate the shape.

## Step 4
- HIGH uses the 512×512 simulation (262k particles). Override with `<SignalField quality="medium" />` to use 256×256 without writing to the store.
- Temporary headless scratch mount, Apple M3 Pro / Metal, 1440×900 at DPR 1: 262,144 points, one draw call; 120 synchronized render samples after 30 warmup frames gave 3.94 ms mean, 3.6 ms p50, 6.2 ms p95 (about 161 FPS at p95).
- Timing synchronized the compute/render queue with `finish()` plus a 1-pixel readback; it is a GPU completion probe, not an end-user RAF cadence result. The scratch Experience and scripts were removed.
- Build and lint pass; agy-review retains the visual checks.

## Reuse-first audit
- Reused the installed Three.js `GPUComputationRenderer` and `MeshSurfaceSampler`, existing `noise4D.glsl`, existing `marble_bust_01.glb`, shared chapter/store types, and the anchors bridge; details are in `CREDITS.md`.
- This particle subsystem has no matching drei/postprocessing component; its GPGPU simulation and point-sprite rendering require compute and point shaders.
- Adapted `nextjs-webgl-templates/src/features/nova/components/particle-field.tsx` for pseudo-curl displacement and damped morph timing, plus `r3f-flow-field-particles/src/components/FlowFieldParticles.jsx` for 4D noise flow and movement-scaled cursor repulsion. Full MIT notices are retained in `src/scene/shaders/lib/THIRD-PARTY-NOTICES.md`.
- Built target packing and signal-bus orchestration for this app's chapter/anchor contract; Three.js `MeshSurfaceSampler` handles bust sampling. No Codrops implementation code was copied.
- Used existing Poly Haven textures and HDRIs remain with the Blender/world owners; no new asset or package was added here.
