# 3D playbook for Omniverse (research handover from Morph)

Akash's verdict, 2026-11-07 20:40 IST: "everything except the 3D is good. The 3D output is very average."
**UI, typography, copy, HUD and overlay are now FROZEN.** Round 3 changes only `src/scene/**`,
`src/scene/shaders/**`, `public/assets/**` and the scene-facing parts of `src/state/**`.

## 1. Why the current 3D reads as average (diagnosis of Akash's screenshot)
The whole 3D layer is ~1,000 lines, built from three.js primitives with stock materials. Specifically:
1. **Programmer-art objects.** The nodes are wireframe icospheres. Primitive geometry plus a wireframe
   says "demo" instantly. There's no hero object and no focal point.
2. **Fake light.** The "spotlight cones" are flat additive triangles with hard edges, no falloff or
   noise, and no depth fade where they meet the floor.
3. **A dead floor.** A flat grey noisy plane with a hard horizon line: no reflection, no roughness
   variation, and no fog blending it into the sky.
4. **No depth cues.** No depth of field, no atmospheric fog, no scale contrast, and the objects
   all sit at one depth band in the lower right.
5. **No motion language.** Things orbit or bob. Nothing reacts to the cursor, scroll or chapter
   in a way that feels physical.
6. **No custom shader anywhere.** Every award-level 3D site has its look in custom GLSL/TSL.

## 2. How award-level 3D sites are actually built (the pattern)
Studied: aengel.io, Igloo Inc (Awwwards case study), Lusion, Active Theory, Bruno Simon, plus
the landing.love 3D category. They share one recipe:

| Layer | What they do | What we do now |
|---|---|---|
| Assets | Authored meshes (Blender/Houdini), often with baked lighting in textures, or fully procedural shader worlds | primitives |
| Signature effect | ONE custom effect the site is remembered by: GPGPU particles (Igloo, Lusion), fluid sim, a glowing lily (aengel) | none |
| Lighting | HDRI environment + key/rim lights + volumetric shafts + fog | flat cones |
| Materials | Custom shaders or tuned PBR: transmission, fresnel rims, dissolve, noise displacement | stock |
| Camera | Spline paths scrubbed by scroll, damped look-at, FOV/DOF changes per chapter | lerped positions |
| Post | Bloom (high threshold), DOF, AgX/ACES tone mapping, grain, vignette, tiny chromatic aberration | basic bloom |
| Interaction | Cursor displaces or attracts the world; scroll velocity feeds shaders | none |
| Perf | Instancing/GPGPU, KTX2 textures, Draco/Meshopt, adaptive DPR, quality tiers | partial |

Igloo Inc stack (from its case study): Three.js, three-mesh-bvh, Svelte, GSAP, Vite, custom volume
exporter and a fluid sim, with Houdini/Blender for assets. **The look comes from the custom simulation,
not from the framework.**

## 3a. UPDATE (Akash, 20:45): Blender is approved and installed. Direction = "Sanctum + Signal Field"
Blender 5.2.3 LTS is at `/Applications/Blender.app/Contents/MacOS/Blender`. It runs headless; verified:
`blender/scripts/smoke_bake_export.py` builds geometry, Cycles-bakes a COMBINED lightmap, and exports
GLB with Draco (SMOKE_OK). This is the pipeline Immersive Garden (Awwwards case study, 2025) and
Bruno Simon use: **author in Blender, bake the expensive light, ship cheap unlit textures.**

The look = two layers:
1. **Sanctum (Blender-authored, baked)**: a brutalist concrete chamber, Pantheon-like. A circular
   oculus in the ceiling throws ONE hard shaft of light onto a central plinth/pool; the floor is wet
   polished concrete; walls are layered concrete with deep shadow. All light (sun shaft, bounce, AO,
   soft shadows) is baked in Cycles into 1-2 lightmaps, so runtime cost is near zero and it looks
   photographic. CC0 textures are already downloaded to `blender/textures/` (Poly Haven 2k:
   concrete_wall_003, concrete_floor_worn_001, marble_01).
   Each chapter is a different camera spot or alcove in the same building, so chapters differ by
   composition and light: hero = under the oculus; about = the bust on a pedestal in a side niche
   (`marble_bust_01.glb`); experience = a long corridor of 4 pillars/doorways (one per role);
   projects = a gallery of monolith slabs; contact = the open roof and night sky.
2. **Signal Field (code, GPGPU)**: the particle swarm from section 3 below lives INSIDE the sanctum,
   lit by the shaft. That contrast is the signature: organic living light inside cold stone.
   Runtime extras: a real-time reflector on the wet floor (HIGH only), a volumetric shaft shader
   matching the baked shaft, dust motes in the beam, fog.

Blender pipeline rules:
- Everything is scripted (`blender/scripts/*.py`, run with `-b -P`) so it's reproducible and
  reviewable. The `.blend` is a build artifact, and the GLBs go to `public/assets/models/`.
- Bake: Cycles, 256-512 samples + denoise, margin 6-16px, lightmap on UV1 (second UV set; three.js
  `lightMap` reads `uv1` in r15x+), or bake COMBINED straight into the base color and use unlit
  `MeshBasicMaterial` for static architecture (simplest, best looking).
- Export: glTF/GLB, Draco mesh compression, `export_lights=False`. Then locally:
  `npx @gltf-transform/cli optimize in.glb out.glb --texture-compress ktx2` (or webp) for textures.
- Budget: sanctum GLB + lightmaps <= 4 MB total; textures 2k max (1k for LITE via a second file).
- Optional live control: BlenderMCP (https://github.com/ahujasid/blender-mcp) lets a Claude agent
  drive an open Blender GUI. It needs a Blender addon plus `claude mcp add`, which changes Claude
  config, so **ask Akash first**. Headless scripts are the default.

## 3. "Signal Field" particle layer (lives inside the sanctum)
One signature effect we can build in code, without a 3D artist: a **GPGPU particle swarm
(~200k points HIGH, ~40k LITE) that morphs between shapes, one shape per chapter**. It's driven by
curl noise and reacts to the cursor. It reads as "many agents moving as one system", which is
exactly Akash's work.

| Chapter | Particles form | Supporting 3D |
|---|---|---|
| 01 Boot / hero | A dense luminous core (sphere with fbm turbulence) breathing slowly. The cursor parts the swarm. | Volumetric light shaft from above, reflective wet floor, fog horizon |
| 02 About | The marble bust (`public/assets/models/marble_bust_01.glb`, sampled with MeshSurfaceSampler) | Callout anchors on bust points (anchors bridge already exists) |
| 03 Experience | A helix/timeline ribbon with 4 dense clusters (one per role); the active role's cluster brightens | Camera glides along the helix |
| 04 Projects | One distinct glyph per project (text or SVG outline sampled to points, or a GLB) with a burst transition between them | Monolith silhouettes as the stage (transmission material, HIGH only) |
| 05 Contact | The swarm collapses into a single beacon point and pulses | Floor ripple |

Morph transitions: target A → curl-noise scatter → target B over ~1.2s, triggered by the existing
chapter state machine (`src/state/chapters.ts`). Particles keep their identity, so it looks like
one organism reorganising.

## 4. Components to build (file plan)
```
src/scene/shaders/lib/noise3D.glsl, noise4D.glsl   (vendored, MIT, from ashima/webgl-noise; done)
src/scene/shaders/curl.glsl                       curl noise from simplex (Bridson-style)
src/scene/particles/targets.ts                    sample N points from GLB/geometry/text -> Float32Array -> DataTexture (cache per shape)
src/scene/particles/simulation.frag               position update: attract to uTarget, curl turbulence, mouse repel, morph uProgress
src/scene/particles/ParticleSim.ts                GPUComputationRenderer setup (three/examples/jsm/misc/GPUComputationRenderer.js, present in node_modules)
src/scene/particles/particles.vert/.frag          point sprites: size attenuation, soft disc, color by depth/velocity, additive or premultiplied
src/scene/particles/SignalField.tsx               R3F component: owns sim, reads chapter + pointer, drives uniforms, quality tiers
src/scene/world/VolumeCone.tsx                    shader cone: fresnel edge fade + depth fade (soft particles) + scrolling noise
src/scene/world/Floor.tsx                         MeshReflectorMaterial (drei) tuned dark + roughness noise + fog blend; LITE = plain
src/scene/camera/CameraRig.tsx                    replace lerps with CatmullRomCurve3 path per chapter, maath damp3, FOV/DOF focus per chapter
src/scene/fx/Effects.tsx                          Bloom (luminanceThreshold ~0.8, mipmapBlur), DepthOfField (focus = active target), ToneMapping AgX, Noise 0.04, Vignette, ChromaticAberration ~0.0008
```
Remove: the wireframe icosphere nodes and the flat triangle cones. Keep: Starfield (as a dim far layer),
LoadProgress, AnchorWriters, the chapter machine and Lenis.

Quality tiers (drei `PerformanceMonitor` + existing PERF toggle):
HIGH = 512x512 sim (262k) + DOF + reflector; MEDIUM = 256x256 (65k), no DOF; LITE = 128x128 (16k), no reflector,
no post except tone mapping. Reduced motion = no morph animation (cut to final shape) and no turbulence.
No-WebGL = the existing fallback.

Stretch (only after the above ships): WebGPU + TSL compute (`three/webgpu`) for 1M particles, behind a
feature check with the WebGL2 path as fallback. Don't start here.

## 5. Learning resources (read before building)
Particles / GPGPU
- three.js GPGPU example source: `node_modules/three/examples/jsm/misc/GPUComputationRenderer.js`; demo https://threejs.org/examples/#webgl_gpgpu_birds
- Codrops, Surface Sampling in Three.js: https://tympanus.net/codrops/2021/08/31/surface-sampling-in-three-js/ (repo cloned to `.orchestrator/research/refs/codrops-surface-sampling`)
- drei `<Sampler>` and `useFBO`: https://drei.docs.pmnd.rs/
- Maxime Heckel, "The magical world of Particles with React Three Fiber and Shaders": https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/ (the FBO particles section is the core pattern)
- Three.js Journey GPGPU flow-field particles lesson (paid course, Bruno Simon): https://threejs-journey.com/
Light, atmosphere, shaders
- Maxime Heckel, volumetric lighting with post-processing and raymarching: https://blog.maximeheckel.com/posts/shaping-light-volumetric-lighting-with-post-processing-and-raymarching/
- The Book of Shaders (noise, fbm): https://thebookofshaders.com/
- Inigo Quilez articles (SDFs, palettes, smoothstep tricks): https://iquilezles.org/articles/
- Simplex/curl noise GLSL: https://github.com/ashima/webgl-noise (vendored)
Blender to three.js
- Codrops, "Building a Fully-Featured 3D World in the Browser with Blender and Three.js" (Apr 2025): https://tympanus.net/codrops/2025/04/08/3d-world-in-the-browser-with-blender-and-three-js/
- Awwwards, Immersive Garden case study (Blender/Houdini, a gltf-transform + Blender-script export pipeline, KTX compression, channel packing): https://www.awwwards.com/case-study-immersive-gardens-new-website.html
- Awwwards, Bruno's portfolio case study (Blender naming conventions drive behaviour, WebGPU/TSL): https://www.awwwards.com/brunos-portfolio-case-study.html
- Bake, glTF, Draco, load walkthrough: https://dev.to/heygalatea/how-to-export-blender-to-threejs-bake-gltf-draco-and-load-4ac9 (its exact bake numbers are unverified)
- Lightmap on the second UV in three.js (forum): https://discourse.threejs.org/t/apply-uv-coordinates-and-lightmaps-baked-from-blender-to-mesh/63910
Cloned reference code (all MIT, in `.orchestrator/research/refs/`, gitignored)
- `r3f-flow-field-particles`: GPGPU flow-field particles in R3F (GPUComputationRenderer). The closest match to our Signal Field sim.
- `nextjs-webgl-templates`: 13 R3F templates incl. Nova (90k-particle scroll morph), Flux (GPU fluid), Mycelia (1M-agent Physarum). Read Nova first.
- `Three-VFX`: WebGPU compute particle system with an R3F wrapper (the stretch path).
- `codrops-surface-sampling`: MeshSurfaceSampler demos (bust → points).
- `webgl-noise`: simplex/curl noise (also vendored in `src/scene/shaders/lib`).
More Codrops (2025-26)
- Dissolve effect with shaders + particles (Feb 2025): https://tympanus.net/codrops/2025/02/17/implementing-a-dissolve-effect-with-shaders-and-particles-in-three-js/ (use for the chapter transitions)
- Particle trails with TSL (May 2025): https://tympanus.net/codrops/2025/05/05/matrix-sentinels-building-dynamic-particle-trails-with-tsl/
- Procedural vortex in a glass sphere, TSL (Mar 2025): https://tympanus.net/codrops/2025/03/10/rendering-a-procedural-vortex-inside-a-glass-sphere-with-three-js-and-tsl/
- WebGPU dissolve of MSDF text into dust (Jan 2026): https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/
- Maxime Heckel, "The Study of Shaders with R3F": https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/
Craft references (study, never copy assets)
- Igloo Inc case study: https://www.awwwards.com/igloo-inc-case-study.html and forum thread https://discourse.threejs.org/t/landing-site-igloo-inc/67249
- aengel.io (screens in `.orchestrator/reference/aengel-*.png`), lusion.co, activetheory.net, bruno-simon.com
- pmndrs example gallery: https://r3f.docs.pmnd.rs/getting-started/examples

## 6. Asset sources (CC0 / CC-BY only, log in CREDITS.md)
- Poly Haven (CC0 models, HDRIs, textures): https://polyhaven.com, API https://api.polyhaven.com
- Smithsonian 3D open access (CC0 scans, GLB): https://3d.si.edu (use the low-res GLB, never the multi-GB full-res)
- ambientCG (CC0 PBR textures): https://ambientcg.com
- Sketchfab, filtered by Downloadable + CC0/CC-BY: https://sketchfab.com
- pmndrs market (~400 CC0 glTF models): https://market.pmnd.rs
- Fab (filter by CC0): https://www.fab.com. Poly Pizza is mostly CC-BY 3.0, so credit the author.
Downloaded for Blender (CC0, Poly Haven 2k: diffuse, normal (GL), rough, AO): `blender/textures/`
concrete_wall_003, concrete_floor_worn_001, marble_01. More are available via the API:
`curl -A omniverse-build https://api.polyhaven.com/files/<slug>` (add each to CREDITS.md).
Already in repo: `public/assets/hdri/studio_small_09_1k.exr`, `moonless_golf_512.hdr`, `public/assets/models/marble_bust_01.glb`.
Point sampling needs geometry only. Strip textures from any GLB used purely as a particle target
(`npx @gltf-transform/cli` locally via npx is approved for this; no global install).

## 7. Packages (local installs only)
Already present: three 0.187, @react-three/fiber 9, drei 10, @react-three/postprocessing 3, postprocessing 6, maath, gsap, lenis.
Allowed to add if needed: `three-custom-shader-material` (extend standard material with custom GLSL), `r3f-perf` (dev only), `leva` (dev only, tuning panel, stripped in prod).

## 7b. Team for round 3 (per MODEL-POLICY)
- `blender-sanctum` (codex gpt-6-luna high, or agy claude-opus-4-6-thinking if the codex quota is short):
  owns `blender/**` and the exported `public/assets/models/sanctum*.glb` + lightmaps. Scripted build, bake and export.
  It renders a Cycles still per chapter camera to `.orchestrator/reference/r3-blender-*.png` for review BEFORE export.
- `codex-world` (gpt-6-luna high): `src/scene/particles/**` + `src/scene/shaders/**` (Signal Field).
- `agy-world` (agy claude-opus-4-6-thinking): loading the sanctum GLB, floor reflector, volumetric shaft,
  dust motes, CameraRig splines through the building, fx/Effects.
- `agy-review` (existing): judges section 8 with screenshots. Never reviews its own work.
Order: contract first (chapter → camera spot names shared between the Blender cameras and CameraRig,
shape ids, quality tiers), then blender-sanctum and codex-world in parallel, then agy-world integrates.

## 8. Acceptance for the 3D (the reviewer judges these with screenshots)
1. A stranger can describe the hero 3D in one sentence that isn't "spheres and lines".
2. Each chapter's particle shape is recognisable within 1s of arriving (the bust must read as a head).
3. The cursor visibly disturbs the swarm on desktop. Scroll morphs never pop or snap.
4. Light shafts have soft edges and fade into the floor and the fog; no hard horizon line.
5. Side by side with `aengel-03-project-chapter.png` and `aengel-04-about-callouts.png`, the reviewer rates it "competitive" and gives a reason.
6. HIGH holds ~60fps at 1440p on Apple Silicon; LITE at 390px mobile stays smooth; build + lint clean; reduced motion and no-WebGL still work.
