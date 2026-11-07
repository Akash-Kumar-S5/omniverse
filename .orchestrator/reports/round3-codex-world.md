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
