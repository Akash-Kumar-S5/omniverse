# Round 1 - Item 1 Report: Volumetric Living Swarm Cloud

## Overview
- **Branch**: `r3/agy-world` (commit `981d7dc`)
- **Reference Issue**: Item 1 of `.orchestrator/ROUND-1-PLAN.md` & `r3-morph-main-5c8fdcc-ch0.png`
- **Scope**: `src/scene/particles/targets.ts`, `src/scene/particles/particles.vert`, `src/scene/particles/particles.frag`, `src/scene/particles/cpu.vert`, `src/scene/particles/cpu.frag`, `src/scene/particles/simulation.frag`, `src/scene/particles/SignalField.tsx`, `src/scene/camera/CameraRig.tsx`

---

## 1. Problem Statement
In Chapter 0, the particle swarm rendered as a flattened 2D disc of large, opaque beige/brown pebble-like discs directly overlapping the title "Kumar", obscuring typography and looking like rigid debris rather than a living, intelligent volumetric signal cloud.

---

## 2. Implementation Details

### A. 3D Volumetric Spherical Distribution
- **Target Generation** (`src/scene/particles/targets.ts`):
  - Replaced the flattened cylindrical generator (`y * r * 0.78`) with a true 3D spherical coordinate mapping using uniform spherical direction vectors.
  - Applied a non-linear radial distribution ($r \propto \text{random}^{1.6}$) creating a dense, luminous core surrounded by soft, dissipating outer filaments.
  - Added subtle 3D fractal turbulence perturbations to break up spherical banding.
  - Tagged ~3.5% of particles as luminous agent beacons (`group = 9`).

### B. Additive Soft-Disc Point Sprites
- **Fragment Shaders** (`src/scene/particles/particles.frag`, `src/scene/particles/cpu.frag`):
  - Implemented analytical soft-disc falloff via `gl_PointCoord`:
    $$\text{softDisc} = \exp(-d^2 \times 18.0) \times \text{smoothstep}(0.5, 0.15, d)$$
    $$\text{coreGlow} = \exp(-d^2 \times 50.0)$$
  - Hard discards at $d > 0.5$ to eliminate square sprite borders.
  - Celestial warm palette: warm champagne/gold core (`rgb(1.0, 0.96, 0.88)`), amber midtones (`rgb(0.98, 0.80, 0.48)`), and deep bronze depth falloff (`rgb(0.52, 0.28, 0.14)`).
  - Agent particles glow with an ethereal white-gold luminescence (`rgb(1.0, 0.98, 0.92)`) at $2.2\times$ intensity without blowing out postprocessing bloom or obscuring UI text.

### C. Size Attenuation & Particle Dimensions
- **Vertex Shaders & Uniforms** (`src/scene/particles/particles.vert`, `SignalField.tsx`):
  - Reduced base point size by $\sim 2.5\times$ (`uPointSize = 1.15`, lite: `0.95`).
  - Added true distance attenuation:
    $$p_{\text{size}} = \text{clamp}\left(uPointSize \times \text{agentScale} \times \frac{18.0}{\text{dist}}, 1.0, 10.0\right)$$
  - Agent particles feature a subtle breathing size pulse ($\pm 20\%$).

### D. Organic Swarm Dynamics
- **Simulation & Dynamics** (`src/scene/particles/simulation.frag`, `SignalField.tsx`):
  - Integrated slow organic breathing: radial volumetric pulse modulated by $\sin(0.85 t + 1.5\phi)$.
  - Enhanced curl-noise flow displacement for gentle convective drift.
  - Mirrored identical organic breathing calculations in the CPU fallback path.

### E. Composition & Framing (>58% Screen Width Rule)
- **CameraRig & Swarm Anchors** (`src/scene/camera/CameraRig.tsx`, `targets.ts`):
  - Offset swarm core anchor to `[2.0, 2.8, 1.2]` (previously `[1.1, 3.0, 0.9]`).
  - Tuned desktop Chapter 0 camera look-at offset to `look.x -= 1.8`, `look.y -= 0.25`.
  - Result: On 1440x900 desktop, the left boundary of the swarm sits strictly past $60\%$ viewport width ($> 864\text{px}$), leaving $>280\text{px}$ of clear negative space to the right of "Akash Kumar".

---

## 3. Verification & Evidence

### Screenshot Evidence
All screenshots captured using Playwright MCP with `?skipgate=1&chapter=N`:

| Chapter | Desktop (1440x900) | Mobile (390x844) | Verification Notes |
|---|---|---|---|
| **Ch 0 (Hero)** | `.orchestrator/reference/r1-swarm-ch0-1440.png` | `.orchestrator/reference/r1-swarm-ch0-390.png` | Swarm fully right of 60% width; airy 3D cloud; title completely clear |
| **Ch 1 (About)** | `.orchestrator/reference/r1-swarm-ch1-1440.png` | `.orchestrator/reference/r1-swarm-ch1-390.png` | Marble bust clear of text column; warm soft background signal drift |
| **Ch 2 (Work)** | `.orchestrator/reference/r1-swarm-ch2-1440.png` | `.orchestrator/reference/r1-swarm-ch2-390.png` | Sanctum architecture lit and readable; particles accent without occlusion |
| **Ch 3 (Projects)** | `.orchestrator/reference/r1-swarm-ch3-1440.png` | `.orchestrator/reference/r1-swarm-ch3-390.png` | Slabs separated with rim lighting; particle field subtle in background |
| **Ch 4 (Contact)** | `.orchestrator/reference/r1-swarm-ch4-1440.png` | `.orchestrator/reference/r1-swarm-ch4-390.png` | Halo oculus well-framed; warm soft celestial field |

### Build & Quality Checks
- `npm run build && npm run lint`: PASSED cleanly with 0 TypeScript and ESLint errors.
- Frame rate: 60 fps stable across all quality tiers.
