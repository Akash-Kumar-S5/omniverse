# Credits

| Asset | Author | Source | Licence | Used for |
|---|---|---|---|---|
| Studio Small 09 (HDRI, 1k EXR) | Sergej Majboroda / Poly Haven | https://polyhaven.com/a/studio_small_09 | CC0 | Hero / product environment lighting |
| Moonless Golf (HDRI, resized to 512x256 .hdr) | Greg Zaal / Poly Haven | https://polyhaven.com/a/moonless_golf | CC0 | Night / dark mood environment |
| Marble Bust 01 (model, 1k textures) | Rico Cilliers / Poly Haven | https://polyhaven.com/a/marble_bust_01 | CC0 | About chapter sculptural object |

## Blender source textures (round 3, collected by Morph)
| Asset | Author / source | URL | Licence |
|---|---|---|---|
| concrete_wall_003 (2k diff/nor_gl/rough/ao) | Poly Haven | https://polyhaven.com/a/concrete_wall_003 | CC0 |
| concrete_floor_worn_001 (2k diff/nor_gl/rough/ao) | Poly Haven | https://polyhaven.com/a/concrete_floor_worn_001 | CC0 |
| marble_01 (2k diff/nor_gl/rough/ao) | Poly Haven | https://polyhaven.com/a/marble_01 | CC0 |
| boulder_01 (model, corridor rubble) | Rico Cilliers, Poly Haven | https://polyhaven.com/a/boulder_01 | CC0 |
| bronze_whale_statue (model, gallery statue) | Tina, Poly Haven | https://polyhaven.com/a/bronze_whale_statue | CC0 |
| Simplex noise GLSL (`src/scene/shaders/lib/noise3D.glsl`, `noise4D.glsl`) | Ashima Arts / Stefan Gustavson | https://github.com/ashima/webgl-noise | MIT | Existing shader library; 4D simplex drives Signal Field turbulence |

## Reused code

| File / component | Author / source | Licence | Use |
|---|---|---|---|
| `GPUComputationRenderer` (`three/addons/misc/GPUComputationRenderer.js`) | Three.js | MIT | GPGPU position simulation and GPU snapshot |
| `MeshSurfaceSampler` (`three/addons/math/MeshSurfaceSampler.js`) | Three.js | MIT | Sampling the existing marble bust mesh |
| `noise4D.glsl` (`src/scene/shaders/lib/noise4D.glsl`) | Ashima Arts / Stefan Gustavson | MIT | Existing simplex implementation used by adapted flow field |
| `particle-field.tsx` (`nextjs-webgl-templates/src/features/nova/components/particle-field.tsx`) | Somnath Khadanga | MIT | Adapted pseudo-curl displacement and damped morph timing |
| `FlowFieldParticles.jsx` (`r3f-flow-field-particles/src/components/FlowFieldParticles.jsx`) | Benjamin Miles | MIT | Adapted 4D flow turbulence and movement-scaled cursor repulsion |
| `THIRD-PARTY-NOTICES.md` (`src/scene/shaders/lib/`) | Nova and R3F Flow Field authors | MIT | Full notices for adapted shader logic |
