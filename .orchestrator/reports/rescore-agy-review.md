# Round 1 Re-Score Report (Post-Upgrades)

**Reviewer:** agy-review  
**Date:** 2026-11-08  
**Scope:** `main` post-upgrades (`8180254`)  
**Evidence:** `.orchestrator/reference/r1-rescore-agy-ch{0..4}-1440.png`, `r1-rescore-agy-ch{0,3}-390.png`, `r1-rescore-agy-ch3-proj1-1440.png`, `r1-rescore-agy-wake.png`  
**References:** `.orchestrator/reference/aengel-*.png`, `.orchestrator/reports/benchmark-refs.md`  

---

## Chapter Scores (Table First)

| Chapter | 3D Craft | Art Direction | Motion | Typography | Originality | Performance | Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0: Boot / Hero** | 8.8 | 9.0 | 8.5 | 9.2 | 9.0 | 9.8 | **9.05** |
| **1: About** | 8.8 | 8.8 | 8.4 | 8.8 | 8.6 | 9.8 | **8.87** |
| **2: Experience** | 8.7 | 8.8 | 8.6 | 8.8 | 8.8 | 9.8 | **8.92** |
| **3: Projects** | 8.9 | 8.9 | 8.7 | 9.0 | 9.0 | 9.8 | **8.98** |
| **4: Contact** | 9.0 | 9.3 | 8.8 | 9.2 | 9.3 | 9.8 | **9.23** |

**Portfolio Re-Score Average:** **9.01 / 10**  
*(Previous Round 1 Average: 8.36 / 10 — +0.65 point gain)*

---

## Detailed Chapter Evaluations & Benchmark Comparison

### 0: Boot / Hero (Overall: 9.05)
- **Evaluation:** The volumetric spherical transformation is a dramatic improvement. Soft-disc gaussian point attenuation, reduced base point size (`1.15`), champagne/gold palette (`rgb(1.0, 0.96, 0.88)` core to `rgb(0.52, 0.28, 0.14)` far), and luminous agent motes eliminate the previous flat beige pebble appearance. The swarm is strictly anchored past 60% viewport width, leaving $>280\text{px}$ of pristine dark negative space beside "Akash Kumar". The expanded 2.4-unit cursor wake produces distinct tangential circulation and physical displacement.
- **Comparison to Benchmarks:** Rivals `aengel-02` (luminous lily in void) and `SEED` (translucent glowing core) in atmospheric depth and lighting.
- **Remaining Flaws (Top 3):**
  1. Inner core density remains slightly concentrated at center, obscuring mote separation in the deepest interior.
  2. Mobile portrait (390x844) viewport clips the outer haze beam falloff slightly on the right edge.
  3. Cursor wake returns to rest over ~1.6s; adding a persistent micro-trail or turbulence memory would heighten responsiveness.

### 1: About (Overall: 8.87)
- **Evaluation:** Point sampling on the classical marble bust (`65,536` points) benefits immensely from the gaussian soft-disc attenuation. Head, profile, and drapery contours are crisp and legible on the side niche pedestal. Lighting casts gentle shadows into the brutalist alcove, creating an evocative museum atmosphere.
- **Comparison to Benchmarks:** Echoes `Michelangelus` in classical artistic reverence, executed here as an ethereal digital point cloud.
- **Remaining Flaws (Top 3):**
  1. Lacks the dynamic callout leader lines demonstrated in Chapter 3 and `aengel-04` (e.g. pointing to anatomical/sculptural coordinates).
  2. Pedestal surface texture is uniform concrete; subtle marble veining or edge chamfer highlights would elevate the plinth craft.
  3. Sculpture is static; subtle mouse-parallax gaze shift would introduce physical presence.

### 2: Experience / Work (Overall: 8.92)
- **Evaluation:** Shifting the helix ribbon anchor across the corridor to $z = -1.85$ ($x > 0$ on screen) and tightening ribbon radius to $0.52\times$ completely resolves the previous text occlusion issue. Active role cards ("Engineer, Presidio") now sit against deep, clean architectural shadow with an $\sim 80\text{px}$ negative space buffer, while the luminous helix weaves through the portal arches on the right.
- **Comparison to Benchmarks:** Strong split-screen discipline akin to `JOYCO` (3D signpost beside live blue UI) and `aengel.io`.
- **Remaining Flaws (Top 3):**
  1. Role transition snap: jumping between roles directly via the tab list triggers a rapid camera jump rather than a weighted glide deceleration.
  2. Floor rubble rocks are completely inert; subtle dust motes or caustic light reflections near their bases would ground them better.
  3. On compact desktop widths (~1024px), the negative space buffer between the text measure and ribbon narrows.

### 3: Projects (Overall: 8.98)
- **Evaluation:** The single largest upgrade of the round (+1.18 points). Replacing the occluded glyph with camera-billboarded canvas letterforms ('S' for SalarySync, 'R' for Rentify) rendered with display serif typography, sub-pixel edge jitter, and dynamic morphing restores the signature 3D effect. The external frosted HUD callout chip (`rgba(10, 9, 8, 0.85)` + blur) and angled leader line achieve parity with `aengel-04`.
- **Comparison to Benchmarks:** Directly equals the presentation fidelity of `aengel-03` (central monolith) and `aengel-04` (leader line HUD callout).
- **Remaining Flaws (Top 3):**
  1. Mobile portrait (390x844): narrow aspect ratio pushes the letterform glyph offscreen or behind the slab edge.
  2. Monolith stone material is matte; subtle edge bevel highlights or wet floor bounce reflections at the base would enhance realism.
  3. Callout leader line is a static 1px stroke; an animated pulse or glowing connection dot would polish the HUD aesthetic.

### 4: Contact (Overall: 9.23)
- **Evaluation:** Hovering torus particle beacon pulses serenely inside the open Pantheon circular roof opening against the starfield. The upward camera tilt creates an expansive, cinematic finale that rewards the entire journey.
- **Comparison to Benchmarks:** Highest originality score across all evaluated sites; poetic spatial resolution.
- **Remaining Flaws (Top 3):**
  1. Torus particle ring has uniform radius; subtle eccentric satellite particles escaping upward into the sky would add organic texture.
  2. Starfield backdrop is uniform; faint distant stellar nebulae or twinkling clusters would add depth.
  3. Hovering the cursor directly over the beacon currently lacks a dedicated interactive reaction (e.g. gravitational flare).
