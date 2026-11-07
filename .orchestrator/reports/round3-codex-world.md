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
- Reference checkout `.orchestrator/research/refs/` is absent from this worktree, so the flow-field and Nova source could not be inspected.

## Step 3
- Added a curl-noise field and a 1.2-second eased transition from a GPU snapshot of the current swarm to each new target, including retargets mid-flight.
- Reduced motion cuts directly to the final shape and disables turbulence; the beacon pulses when motion is enabled.
- Publishes the active shape focus/radius/morph and projected hero, bust, glyph, and beacon screen anchors.
- Build and lint pass. A target change on the helix now only changes the active-role highlight; it does not regenerate the shape.

## Step 4
- HIGH uses the 512×512 simulation (262k particles). Override with `<SignalField quality="medium" />` to use 256×256 without writing to the store.
- Build and lint pass. Frame time was not measured here: `SignalField` is intentionally not mounted in this worktree, and agy-review owns the headless visual checks.

## Reuse-first audit
- Reused the installed Three.js `GPUComputationRenderer` and `MeshSurfaceSampler`, existing `noise3D.glsl`, existing `marble_bust_01.glb`, shared chapter/store types, and the anchors bridge; details are in `CREDITS.md`.
- This particle subsystem has no matching drei/postprocessing component; its GPGPU simulation and point-sprite rendering require compute and point shaders.
- Built target packing, cursor interaction, and morph orchestration for the existing signal contract. The requested Nova, flow-field, and Codrops clones are absent from all available worktrees, so no ref files were copied or adapted; the custom curl uses the existing MIT simplex source.
- Used existing Poly Haven textures and HDRIs remain with the Blender/world owners; no new asset or package was added here.
