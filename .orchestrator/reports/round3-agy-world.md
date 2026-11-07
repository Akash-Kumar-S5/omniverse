# Round 3: agy-world (stage, camera, post, integration)

## Step 1: Stage, Floor & Volumetrics
- Replaced flat additive triangle cones with `VolumeCone.tsx` using drei `<SpotLight volumetric>` and `<Sparkles>` dust motes tracking `signal.focus`. Disabled on LITE tier.
- Built `Floor.tsx` using drei `<MeshReflectorMaterial>` tuned for wet dark concrete (`blur`, `resolution`, `mixStrength`, `roughness`) on HIGH/MEDIUM; plain dark fallback on LITE. Seamless fog blending.
- Removed `src/scene/constellation/Constellation.tsx` and wireframe nodes.
- Preserved a marked slot in `World.tsx` for `public/assets/models/sanctum.glb` delivery from blender-sanctum.

## Step 2: CameraRig
- Upgraded `CameraRig.tsx` with CatmullRomCurve3 paths per chapter scrubbed by scroll progress (`sectionProgress`).
- Look-at targets `signal.focus` with desktop viewport offset to keep particles centered in the open layout area.
- Dynamic per-chapter vertical FOV dampening via maath and cursor parallax.
- Reduced motion preserves static chapter poses without camera flight animations.

## Step 3: Effects per Quality Tiers
- Built `Effects.tsx` utilizing `@react-three/postprocessing` and `postprocessing`:
  - HIGH: `Bloom` (threshold 0.8, mipmapBlur), `DepthOfField` (auto-focusing `signal.focus`), `ToneMapping` (AgX mode 7), `ChromaticAberration`, `Noise` (0.035), `Vignette`.
  - MEDIUM: Bloom, ToneMapping (AgX), ChromaticAberration, Noise, Vignette (no DOF).
  - LITE: ToneMapping only (multisampling 0) to minimize GPU overhead.

## Step 4: Integration
- Mounted `<SignalField />` in `src/scene/Experience.tsx`.
- Reused existing AnchorWriters and LoadProgress bridges; verified build and lint pass cleanly.

## Reuse-first audit
- **drei components**: `<SpotLight volumetric>` (shaft), `<MeshReflectorMaterial>` (wet floor), `<Sparkles>` (dust motes), `<Environment>` (studio HDRI), `<PerformanceMonitor>`, `<AdaptiveDpr>`.
- **postprocessing components**: `Bloom`, `DepthOfField` (tracking `signal.focus`), `ToneMapping` with `ToneMappingMode.AGX`, `ChromaticAberration`, `Noise`, `Vignette`.
- **Existing assets & code**: Extended existing chapter state machine, Lenis scroll sync, `chapterLook.ts` lighting cues, `roleWaypoints`/`projectNodes`/`beacon` layout data, and `anchor` writers. No custom shader files introduced.
