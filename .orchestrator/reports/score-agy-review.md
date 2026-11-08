# Round 1 Benchmark & Scoring Report

**Reviewer:** agy-review  
**Date:** 2026-11-08  
**Scope:** `main` post-swarm fix (`5c8fdcc`)  
**Evidence:** `.orchestrator/reference/r1-score-ch{0..4}-1440.png`  
**References:** `.orchestrator/reference/aengel-*.png`, `.orchestrator/reports/benchmark-refs.md`  

---

## Chapter Scores

| Chapter | 3D Craft | Art Direction | Motion | Typography | Originality | Performance | Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0: Boot / Hero** | 8.0 | 8.5 | 7.5 | 9.0 | 8.5 | 9.5 | **8.5** |
| **1: About** | 8.5 | 8.5 | 7.5 | 8.5 | 8.5 | 9.5 | **8.5** |
| **2: Experience** | 7.5 | 8.0 | 8.0 | 8.0 | 8.5 | 9.5 | **8.2** |
| **3: Projects** | 6.5 | 7.5 | 7.0 | 8.5 | 7.5 | 9.5 | **7.8** |
| **4: Contact** | 8.5 | 9.0 | 8.0 | 9.0 | 9.0 | 9.5 | **8.8** |

**Portfolio Benchmark Average:** **8.36 / 10**

---

## Benchmark Analysis & Chapter Breakdown

### 0: Boot / Hero (Overall: 8.5)
- **3D Craft (8.0):** The brutalist Pantheon concrete rotunda, oculus aperture, and soft volumetric light beam are high quality. The 65k GPGPU particle core renders smoothly under the shaft of light, though its density distribution is somewhat uniform/disc-like rather than multi-layered with celestial tendrils.
- **Art Direction (8.5):** Cold monolithic concrete paired with warm organic particle light produces a distinct signature mood.
- **Motion (7.5):** Breathing core simulation and camera push-in are smooth; cursor disturbance is perceptible but subtle.
- **Typography (9.0):** Saol Display serif title ("Akash Kumar"), clean sans body, and discreet metadata ("Chennai, 8:38 am") provide strong editorial pacing.
- **Originality (8.5):** Strong departure from generic 3D portfolio spheres and mesh grids.
- **Performance (9.5):** 72.2 FPS sustained at 1440x900 HIGH, p50 16.0ms, p95 18.3ms.

### 1: About (Overall: 8.5)
- **3D Craft (8.5):** The classical marble bust is sampled accurately into 65,536 points, resting upon the side niche pedestal with clear anatomical contours (head, shoulders, drapery).
- **Art Direction (8.5):** Evocative side-gallery atmosphere. Contrast between solid stone plinth and luminous particulate sculpture works exceptionally well.
- **Motion (7.5):** Camera spline tracks into the niche with natural damping. Morphing between shapes is glitch-free.
- **Typography (8.5):** Structured tabular metadata ("Based in", "Studied", "Working in") is clean and legible.
- **Originality (8.5):** Point-sampled classical sculpture in a brutalist alcove feels culturally sophisticated.
- **Performance (9.5):** 70+ FPS sustained.

### 2: Experience (Overall: 8.2)
- **3D Craft (7.5):** Colonnade of brutalist concrete portals and scattered rock debris creates strong architectural depth. The particle ribbon winds down the hallway, but sits centered directly behind the text card, creating visual competition.
- **Art Direction (8.0):** Deep atmospheric perspective is striking, but text-to-swarm layering needs horizontal separation.
- **Motion (8.0):** Catmull-Rom camera translation along the corridor as roles change is fluid.
- **Typography (8.0):** Role list selector and details are clean, but contrast is reduced by the bright helix ribbon shining through the card.
- **Originality (8.5):** Architectural portal walkthrough for career progression is a strong narrative device.
- **Performance (9.5):** 70+ FPS sustained.

### 3: Projects (Overall: 7.8)
- **3D Craft (6.5):** Heavy monolith slabs frame the gallery, but the project glyph particle swarm is positioned at `z = -29.5` (behind the active monolith occluder at `z = -13.5`), rendering the swarm invisible to the camera during project inspection.
- **Art Direction (7.5):** Imposing stone monuments, but the absence of the signature glowing particle glyph leaves the right stage looking barren compared to `aengel-03`.
- **Motion (7.0):** Camera transitions between project nodes, but lack of visible glyph morphing leaves the interaction feeling static.
- **Typography (8.5):** Elegant project typography, italic premise statements, pill tags, and clean pagination.
- **Originality (7.5):** Solid architectural staging, but missing its intended digital contrast.
- **Performance (9.5):** 70+ FPS sustained.

### 4: Contact (Overall: 8.8)
- **3D Craft (8.5):** Hovering torus particle beacon pulses cleanly inside the circular ceiling oculus opening against the night sky.
- **Art Direction (9.0):** Upward view through the aperture into starlight creates an expansive, cinematic climax.
- **Motion (8.0):** Upward tilt and beacon pulse breathing provide a serene conclusion.
- **Typography (9.0):** "Say hello." header, warm gold link, and restrained contact actions.
- **Originality (9.0):** Unique celestial perspective that concludes the architectural descent with an upward gaze.
- **Performance (9.5):** 75+ FPS sustained.

---

## 5 Highest-Impact Upgrades (Ranked)

1. **Reposition Chapter 3 Project Glyph swarm adjacent to active monolith:** Move glyph anchor from `z = -29.5` forward to float beside the active project slab with a shape morph on click, restoring the signature effect to Projects.
2. **Offset Chapter 2 Experience helix ribbon to the right viewport:** Shift ribbon anchor to the right half (`x > 0`) so the glowing particles do not sit directly behind the active role description text, resolving contrast and clutter.
3. **Implement 3D-anchored HUD callout lines on Chapter 1 Bust (`aengel-04` pattern):** Project 2–3 DOM micro-labels with thin leader lines connecting to bust landmarks (forehead, profile, pedestal) to elevate craft to parity with benchmark references.
4. **Layer Chapter 0 core swarm noise and radial falloff:** Introduce multi-frequency curl turbulence and soft radial alpha falloff to turn the dense disc into a layered, breathing celestial nebula like SEED/Igloo.
5. **Amplify pointer velocity impulse & wake decay for cursor interaction:** Increase repulsion radius and add a lingering rotational curl wake so desktop cursor movement visibly parts and stirs the swarm with physical presence.
