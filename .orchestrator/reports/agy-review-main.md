# Omniverse Review: main

**Reviewer:** agy-review (independent reviewer)  
**Date:** 2026-11-08  
**Tested commit:** `9f18daa`  
**Preview URL:** `http://localhost:4210/?skipgate&chapter=0..4` (1440x900 and 390x844)  
**Screenshots:** `.orchestrator/reference/ar-ch{0..4}-{1440,390}.png`  

---

## 1. Per Chapter Evaluation: DONE Criteria (3D Playbook §8)

### Chapter 0: Boot / Hero
- **sanctum visible:** PASS — The Pantheon-style brutalist concrete chamber with overhead circular oculus and central plinth is clearly rendered.
- **swarm shape:** FAIL — The breathing luminous core does not render at all due to WebGL error `GL_INVALID_OPERATION: glDrawArrays: Vertex buffer is not big enough for the draw call` caused by missing `position` attribute in GPU geometry.
- **cursor disturbs swarm:** FAIL — Cursor cannot disturb the swarm because the particle system is entirely dropped by WebGL.
- **haze beam:** PASS — Soft light shaft falls through the oculus toward the floor plinth with smooth falloff and no harsh cone edges.
- **no horizon:** PASS — Reflective concrete floor fades seamlessly into the `#060505` background fog with zero visible horizon line.
- **camera moves through building:** PASS — Camera is positioned under the oculus with wide architectural framing and responds to scroll progression.

### Chapter 1: About
- **sanctum visible:** PASS — Side niche with concrete plinth and brutalist alcove walls is clearly rendered.
- **swarm shape:** FAIL — Marble bust particle shape does not render on the pedestal due to the identical WebGL vertex buffer issue.
- **cursor disturbs swarm:** FAIL — Cursor cannot interact with particles that are not rendered.
- **haze beam:** PASS — Soft ambient illumination fills the side niche with diffuse shadows across the pedestal.
- **no horizon:** PASS — Niche floor and walls dissolve smoothly into deep shadows and fog without a horizon line.
- **camera moves through building:** PASS — Camera travels smoothly along the spline from the central rotunda into the side niche.

### Chapter 2: Experience / Work
- **sanctum visible:** PASS — Colonnade corridor of brutalist concrete portals and floor rubble rocks is clearly rendered.
- **swarm shape:** FAIL — Helix timeline ribbon with role clusters is completely invisible due to the WebGL vertex buffer failure.
- **cursor disturbs swarm:** FAIL — Cursor interaction is inoperative with no visible particles.
- **haze beam:** PASS — Subtle atmospheric illumination spills between portal arches down the corridor length.
- **no horizon:** PASS — Corridor floor dissolves into distance fog (`#060505`) with no hard horizon cutoff.
- **camera moves through building:** PASS — Camera glides along the Catmull-Rom spline down the portal corridor between roles.

### Chapter 3: Projects
- **sanctum visible:** PASS — Brutalist monolith gallery slabs and textured stone walls are clearly rendered.
- **swarm shape:** FAIL — Project glyph particle shape is not rendered due to the WebGL vertex buffer failure.
- **cursor disturbs swarm:** FAIL — Cursor interaction is inoperative with no visible particles.
- **haze beam:** PASS — Atmospheric spotlight shaft illuminates the monolith gallery slabs with soft edge falloff.
- **no horizon:** PASS — Floor blends into the dark backdrop with no discernible floor/sky boundary.
- **camera moves through building:** PASS — Camera positions cleanly in front of the monolith stage for project presentation.

### Chapter 4: Contact
- **sanctum visible:** PASS — Open circular ceiling oculus looking out toward the dark sky is clearly rendered.
- **swarm shape:** FAIL — Beacon ring/point particle shape does not render due to the WebGL vertex buffer failure.
- **cursor disturbs swarm:** FAIL — Cursor interaction is inoperative with no visible particles.
- **haze beam:** PASS — Gentle atmospheric glow halos the rim of the open circular roof.
- **no horizon:** PASS — Floor recedes entirely as camera tilts upward into the void, eliminating any horizon.
- **camera moves through building:** PASS — Camera tilts up toward the oculus aperture, transitioning the architectural journey to open sky.

---

## 2. Competitive Comparison vs aengel.io

Side by side with `aengel-03-project-chapter.png` and `aengel-04-about-callouts.png`:
- **Current State:** NOT YET COMPETITIVE. The sanctum architecture, lighting, camera choreography, and typography are high quality, but without the signature Signal Field particle swarm rendered in the scene, the central focal points (hero core, bust sculpture, helix ribbon, project glyph, beacon) remain vacant stone plinths. Once the vertex buffer attribute mismatch is resolved and particles render, the composition will be competitive.

---

## 3. Chapter Scores (1–10)

| Chapter | 3D Craft | Art Direction | Motion | Typography | Originality | Performance | Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0: Boot / Hero** | 5 | 8 | 6 | 9 | 7 | 9 | 7.3 |
| **1: About** | 5 | 8 | 6 | 9 | 7 | 9 | 7.3 |
| **2: Experience** | 6 | 9 | 7 | 8 | 8 | 9 | 7.8 |
| **3: Projects** | 6 | 8 | 7 | 9 | 8 | 9 | 7.8 |
| **4: Contact** | 6 | 9 | 7 | 9 | 8 | 9 | 8.0 |

**Average Overall:** 7.6 / 10

---

## 4. Root Cause for Swarm Failures
- `SignalField.tsx` creates `BufferGeometry` for GPU mode with attribute `"uv"`, but omits attribute `"position"`.
- Three.js r187 `WebGLBinding` defaults to binding attribute 0 (`position`); with 0 or 1 vertex bound, calling `gl.drawArrays(gl.POINTS, 0, count)` triggers `GL_INVALID_OPERATION: Vertex buffer is not big enough for the draw call`, causing WebGL to abort rendering the particle points every frame.
- `<Sparkles count={50} />` in `VolumeCone.tsx` also triggers vertex buffer warnings on draw calls.
