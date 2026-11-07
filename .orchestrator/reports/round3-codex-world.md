# Round 3: codex-world

## Step 1
- Added a minimal `SignalField` using `GPUComputationRenderer`, with a warm, soft point-cloud core and cursor repulsion.
- Publishes `signal.focus`, `signal.radius`, and `signal.morph` each frame; reads optional core anchor and quality props.
- `npm run build` and `npm run lint` pass. Build reports the existing large Experience chunk warning.
- How to see it: mount `<SignalField />` inside the R3F Canvas; it is exported from `src/scene/particles`.
- Gap: not mounted in `Experience.tsx` because that file belongs to agy-world.
