# Brief: codex-world (kind codex). Gap 3: art direction, materials, lighting, post

Read `round2-COMMON.md` first.

## Outcome
The scene should look authored and lit, not like a wireframe screensaver.

### Palette
Drop the neon cyan on navy. Use a warm near-black (for example #0b0a09) with a single accent, for example a pale amber #e8c39e or bone white. Lighting carries the look, not glow. Bloom stays subtle: a high threshold and low intensity.

### Hero core
A dense instanced point cloud of "agents", with a transmissive crystal at the centre:
- `MeshTransmissionMaterial`: thickness, slight chromatic aberration, roughness of about 0.1.
- Lit by a local HDRI and two or three `Lightformer`s.
- Must read well at the 1440x900 hero framing.

### Project nodes
Each of the 8 projects becomes its own monolith or crystal. Vary the shape (box, prism, shard) and give each a small inner emissive "payload" mesh. The active project gets a key light and subtle `Sparkles`.

### Ground and light
- A `MeshReflectorMaterial` floor under the constellation: dark and low-res (512 or less).
- Light shafts from cheap additive cones or planes.
- Distance fog.

### About object
One sculptural object, placed apart from the graph, for the About chapter. Use a GLB from `public/assets/models/` once claude-assets delivers one. Until then, use a procedural fallback, such as a TorusKnot with transmission or a displaced icosahedron.

### Edges and particles
Keep them, but restyle them to the new palette, thinner and calmer.

### Post
Bloom (subtle), Vignette, Noise at 0.03 and a tiny ChromaticAberration. Add DepthOfField only if it holds 60fps. In lite: no post, no transmission (use MeshPhysical or Standard instead), no reflector.

### Load progress
Inside the Canvas, call `useProgress` from drei and write `loadProgress` to the store on change.

### Anchors
Every frame, project these into `anchors` from `src/state/anchors.ts` (reuse the vectors):
- the hero core centre → `hero.core`
- a point on the about object → `about.object`
- a point on the floor or map tagged Chennai → `about.city`
- the active project node → `projects.active`
- the beacon → `contact.beacon`

Set `visible` to false when the point is off-screen or behind the camera.

## Assets
claude-assets is putting CC0 HDRIs and models into `public/assets/` on its own branch. I will merge them to main and tell you; then run `git merge main`. Until then, use placeholders and code the paths from `public/assets/MANIFEST.md` when it exists. Load GLBs with `useGLTF`, using the Draco decoder from `/assets/draco/` if claude-assets provides it. Otherwise use non-Draco models.

## You own
- `src/scene/constellation/**`
- `src/scene/fx/**`
- `src/scene/world/**` (new; put the hero core, monoliths, floor, lights and about object here)
- `src/scene/anchors/**` (new; anchor writers)
- `src/scene/layout.ts`

Export the new world pieces as components from `src/scene/world/index.ts` (for example `World`). codex-chapters will mount them in `Experience.tsx`. To let it integrate early, also export `<World/>` straight away as a stub.

## Read-only
- `src/scene/camera/**` and `src/scene/Experience.tsx` (owned by codex-chapters)
- `src/state/**`

## Acceptance
- A steady 60fps at HIGH on Apple Silicon at 1440x900.
- At most about 40 draw calls.
- No console errors.
- Initial JS plus assets you reference: at most 8 MB gzipped.
