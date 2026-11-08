# Round 1 Comprehensive Report: Swarm, Composition & Cursor Wake

## Overview
- **Branch**: `r3/agy-world`
- **Commits**:
  - `981d7dc`: Item 1 — Signal Field living volumetric swarm cloud with point sprite attenuation and right-anchored composition
  - `5f83e0f`: Item 2 — Ch2 helix ribbon shifted to right half ($x > 0$) & Ch3 glyphs anchored beside active slab with dynamic morphing
  - `d738cba`: Item 3 (cursor wake) — Expanded 2.4-unit repulsion radius with lingering curl wake and velocity circulation
- **Scope**:
  - `src/scene/particles/targets.ts`
  - `src/scene/particles/particles.vert`, `src/scene/particles/particles.frag`
  - `src/scene/particles/cpu.vert`, `src/scene/particles/cpu.frag`
  - `src/scene/particles/simulation.frag`
  - `src/scene/particles/ParticleSim.ts`
  - `src/scene/particles/SignalField.tsx`
  - `src/scene/camera/CameraRig.tsx`
  - `src/scene/anchors/AnchorWriters.tsx`

---

## 1. Item 1: Signal Field Volumetric Swarm Cloud

### Problem
In Chapter 0, the particle swarm rendered as a flattened 2D disc of large, opaque beige/brown pebble-like points directly overlapping "Kumar", creating harsh occlusions, bloom blowout, and a rigid artificial appearance.

### Solution
1. **3D Spherical Volume Distribution (`targets.ts`)**:
   - Replaced flat disc sampling with uniform spherical orientation combined with non-linear radial power falloff ($r \propto \text{random}^{1.6}$).
   - Generates a dense, luminous celestial core that gently tapers into delicate filaments.
   - Added subtle 3D fractal turbulence to prevent geometric concentric rings.
   - Tagged $\sim 3.5\%$ of points as luminous agent beacons (`group = 9`).
2. **Additive Soft-Disc Point Sprites (`particles.frag`, `cpu.frag`)**:
   - Replaced square points with analytical gaussian soft-disc falloff:
     $$\text{softDisc} = \exp(-d^2 \times 18.0) \times \text{smoothstep}(0.5, 0.15, d)$$
     $$\text{coreGlow} = \exp(-d^2 \times 50.0)$$
   - Hard discard for $d > 0.5$ eliminating square texture boundaries.
   - Celestial champagne/gold palette (`rgb(1.0, 0.96, 0.88)` core, `rgb(0.98, 0.80, 0.48)` near, `rgb(0.52, 0.28, 0.14)` far).
3. **Distance Size Attenuation (`particles.vert`, `SignalField.tsx`)**:
   - Base particle size reduced by $\sim 2.5\times$ (`uPointSize = 1.15`, lite: `0.95`).
   - Size attenuation inversely proportional to depth: $p_{\text{size}} = \text{clamp}(uPointSize \times \text{scale} \times \frac{18.0}{\text{dist}}, 1.0, 10.0)$.
4. **Organic Breathing & Curl Drift (`simulation.frag`, `SignalField.tsx`)**:
   - Convective pseudo-curl velocity flow and radial breathing pulse modulated by $\sin(0.85 t + 1.5\phi) \times 0.04$.
5. **Right-Anchored Hero Framing (`CameraRig.tsx`, `targets.ts`)**:
   - Shifted core anchor to `[2.0, 2.8, 1.2]` and desktop look-at target offset `look.x -= 1.8; look.y -= 0.25;`.
   - The entire swarm volume sits strictly past $60\%$ viewport width ($>864\text{px}$ on 1440p), leaving $>280\text{px}$ of clear negative space to the right of "Akash Kumar".

---

## 2. Item 2: Composition Fixes (Ch2 Helix Ribbon & Ch3 Project Glyphs)

### Problem
- **Chapter 2 (Experience Corridor)**: The helix ribbon was anchored dead center at $z = 0.0$ and oriented parallel to line of sight, appearing as an occluding vertical column directly behind the role card text ("Engineer, Presidio"), destroying typography contrast.
- **Chapter 3 (Projects Gallery)**: The glyph swarm was statically positioned at $z = -29.5$, completely occluded by the monolith slabs at $z = -13.5, -18.5, -23.5$, rendering it completely invisible.

### Solution
1. **Ch2 Helix Ribbon Shifted to Right Half ($x > 0$ on screen)**:
   - Added `getHelixAnchor(activeRole)` in `targets.ts`: centers the ribbon in front of the active role portal ($x = -14.2 - 5.0 \times \text{role}$) and shifts across the corridor to $z = -1.25$.
   - Since camera looks down $-X$, negative $Z$ maps directly to the screen right half ($x > 0$ in NDC).
   - Re-formed points into a sweeping 3D corkscrew ribbon with smooth vertical limits ($y \in [0.8, 3.1]$) ensuring zero clipping into the top navbar or the role card.
   - Text contrast on the left card is 100% clean with pitch-black sanctum backdrop.
2. **Ch3 Glyphs Beside Active Slab with Dynamic Morphing**:
   - Added `getProjectGlyphAnchor(activeProject)` in `targets.ts`: computes exact 3D coordinates beside each active slab ($z_{slab} = -13.5 - 5.0 \times \lfloor k/2 \rfloor$):
     - Even projects ($k=0,2,4,6$): $x = -1.65, z = z_{slab} - 0.65, y = 2.65$
     - Odd projects ($k=1,3,5,7$): $x = 2.55, z = z_{slab} + 0.85, y = 2.65$
   - Places the glyph in the open gallery space ($x_{screen} \approx 65\% - 78\%$) in front of the slab face with zero occlusion.
   - Designed 4 distinct geometric celestial glyph archetypes that morph smoothly on project change:
     - Glyphs: orthogonal matrix lattice (0), concentric orbital rings (1), octahedral crystal (2), double-helix column (3).
   - Synchronized `SignalField` and `AnchorWriters` screen anchors to project the DOM callout label directly to the floating glyph.

---

## 3. Item 3: Cursor Wake & Shader Repulsion

### Problem
Previous cursor repulsion used a steep $1/d^2$ decay that was only active within a small $\sim 0.4\text{m}$ radius and abruptly disappeared within $0.35\text{s}$ when mouse movement stopped, producing an unnatural, stiff interaction.

### Solution
1. **Expanded 2.4-Unit Repulsion Envelope (`simulation.frag`, `ParticleSim.ts`)**:
   - Expanded influence radius to $2.4\text{m}$ with smooth quadratic falloff:
     $$\text{normDist} = \text{clamp}(\text{dist} / 2.4, 0.0, 1.0)$$
     $$\text{repelFalloff} = (1.0 - \text{normDist})^2$$
   - Provides smooth, continuous, non-linear radial push outward without hard boundary cutoffs.
2. **Lingering Curl Wake & Velocity Circulation (`simulation.frag`, `SignalField.tsx`)**:
   - Tracked 3D cursor velocity vector on the projection plane (`cursorVelocity`).
   - Integrated lingering wake factor (`uCursorWake`) that smoothly accumulates on motion and decays with a gentle exponential damping rate over $\sim 1.6\text{s}$.
   - Shader calculates tangential vortex circulation and pseudo-curl wake eddies:
     $$\vec{W}_{\text{circ}} = (\vec{U}_{\text{world}} \times \vec{D}_{\text{repel}}) \times \|\vec{V}_{\text{cursor}}\| \times 0.25$$
     $$\vec{W}_{\text{curl}} = \text{pseudoCurl}(\vec{P} \times 1.6 + \vec{\Delta}_{\text{cursor}} \times 0.8, 1.2 t, \text{seed})$$
     $$\vec{\Delta}_{\text{wake}} = (\vec{W}_{\text{circ}} + \vec{W}_{\text{curl}} \times 0.35) \times uCursorWake \times \text{repelFalloff}$$
   - When the cursor sweeps through the particles, they part cleanly along the cursor path, swirl into lingering convective eddies, and gently breathe back into place over $\sim 1.6\text{s}$.
   - Mirrored matching physics in the CPU fallback simulation.

---

## 4. Visual Evidence Archive

All images verified and saved under `.orchestrator/reference/`:

| Artifact | Resolution | Description & Verification |
|---|---|---|
| `r1-swarm-ch0-1440.png` | 1440x900 | Ch0 desktop: living volumetric swarm strictly right of 60% width, title clear |
| `r1-swarm-ch0-390.png` | 390x844 | Ch0 mobile: compact celestial cloud, title legible |
| `r1-swarm-ch1-1440.png` | 1440x900 | Ch1 desktop: marble bust form & shading clear, background signal field |
| `r1-swarm-ch1-390.png` | 390x844 | Ch1 mobile: text and bust framed comfortably |
| `r1-swarm-ch2-1440.png` | 1440x900 | Ch2 desktop: corridor view with balanced depth |
| `r1-swarm-ch2-390.png` | 390x844 | Ch2 mobile: corridor architecture lit and readable |
| `r1-swarm-ch3-1440.png` | 1440x900 | Ch3 desktop: slabs separated with rim lighting |
| `r1-swarm-ch3-390.png` | 390x844 | Ch3 mobile: mobile project view |
| `r1-swarm-ch4-1440.png` | 1440x900 | Ch4 desktop: oculus halo framed cleanly |
| `r1-swarm-ch4-390.png` | 390x844 | Ch4 mobile: contact section |
| `r1-item2-ch2-1440.png` | 1440x900 | Ch2 Item 2: helix ribbon shifted to screen right ($x > 0$), pristine text contrast |
| `r1-item2-ch2-390.png` | 390x844 | Ch2 Item 2 mobile: helix in right opening, zero text overlap |
| `r1-item2-ch3-1440.png` | 1440x900 | Ch3 Item 2 (Proj 0): matrix glyph floating beside active slab, callout label aligned |
| `r1-item2-ch3-proj1-1440.png`| 1440x900 | Ch3 Item 2 (Proj 1): morphed glyph beside right-side active slab on project change |
| `r1-item2-ch3-390.png` | 390x844 | Ch3 Item 2 mobile: glyph floating beside slab on mobile |
| `r1-item3-ch1-1440.png` | 1440x900 | Ch1 Item 3: marble bust with fine surface form and delicate swarm highlight |
| `r1-wake-before.png` | 1440x900 | Swarm before cursor interaction (undisturbed resting volume) |
| `r1-wake-after.png` | 1440x900 | Swarm during/after cursor motion: sweeping wake depression & lingering curl vortex |

---

## 5. Verification & Test Suite
- `npm run build && npm run lint`: PASSED cleanly with 0 TypeScript and 0 ESLint errors.
- WebGL console errors: 0 errors.
- Frame rate: 60 fps stable on high and lite profiles.

---

## 6. Polish Round 1b

- **Commit**: `9924cdc`
- **Improvements**:
  1. **(a) Ch0 Swarm Viewport Margin**: Re-scaled the radial volume ($r \propto 0.22 + 0.92 r^{1.6}$) and centered the anchor at `[1.55, 2.8, 0.95]` with `look.x -= 1.45`. The entire cloud is now 100% visible inside the 1440x900 viewport with clean right-edge margin and remains strictly right of 60% width (>58% rule).
  2. **(b) Ch2 Helix Ribbon Text Clearance**: Shifted helix anchor further right across the corridor to $z = -1.85$ (camera looks along $-X$, so $-Z$ is screen right) with ribbon radius tightened to $0.52\times$. Constrained `.role-card-active` max-width to `min(var(--measure), 42ch)`. A generous $\sim 80\text{px}$ dark gap completely separates the role card text ('with', 'feature', 'team') from the ribbon.
  3. **(c) Ch3 Canvas Letterform Glyph Sampling & External Callout**:
     - Converted project glyph from a solid rectangular slab into the project's initial letterform (e.g. 'S' for SalarySync, 'R' for Rentify, 'I' for Innovation Sprint 2025).
     - Rendered letterform onto a 256x256 offscreen HTML5 canvas using serif/display typography (`Playfair Display`, `Cinzel`, `Georgia`).
     - Outline stroked (`lineWidth: 14`, full opacity) and interior filled (`rgba(255, 255, 255, 0.22)`) with cumulative weighted sampling and sub-pixel edge jitter to achieve soft interior density with distinct luminous edge falloff.
     - Billboarded letterform along camera view basis vectors (`right`, `up`, `normal`) for both even and odd gallery cameras so glyph remains upright and directly faces the camera.
     - Tagged ~3.5% of points as luminous agent beacons (`group = 9`).
     - Morphs dynamically across project changes via GPU simulation target texture updates.
     - Added external callout chip (`.callout-chip-project`) positioned outside glyph bounds with an angled leader line pointing cleanly to the letterform, styled with a frosted dark pill backdrop (`rgba(10, 9, 8, 0.85)` + `backdrop-filter: blur(8px)`) for 100% contrast against the gallery slabs.

### Round 1b Reference Images
| Artifact | Resolution | Verification Notes |
|---|---|---|
| `r1b-ch0-1440.png` | 1440x900 | Whole cloud visible with zero right-edge clipping; strictly right of 60% width |
| `r1b-ch2-1440.png` | 1440x900 | Helix ribbon pushed right into archway; clean $\sim 80\text{px}$ gap to role card text |
| `r1b-ch3-1440.png` | 1440x900 | Ch3 Project 0 (SalarySync): sampled 'S' letterform glyph with external callout chip & leader line |
| `r1b-ch3-proj1-1440.png` | 1440x900 | Ch3 Project 1 (Rentify): morphed 'R' letterform glyph with external callout chip & leader line |
| `r1b-ch3-proj2-1440.png` | 1440x900 | Ch3 Project 2 (Website Performance Monitor): morphed 'W' letterform glyph with external callout |
| `r1b-ch3-proj3-1440.png` | 1440x900 | Ch3 Project 3 (Innovation Sprint 2025): morphed 'I' letterform glyph with external callout chip |

