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

## Sanctum Ruins Assets (Round 4, dark fantasy sanctuary)

| Asset | Author | Source | Licence | Files / Use |
|---|---|---|---|---|
| Ultimate Modular Ruins Pack | Quaternius | https://quaternius.com/packs/ultimatemodularruins.html | CC0 1.0 Universal | `ruins-arch-*.glb`, `ruins-wall-*.glb`, `ruins-column-*.glb`, `ruins-floor-*.glb`, `ruins-brick*.glb` (modular hall shell, arches, rubble) |
| Castle Kit | Kenney | https://kenney.nl/assets/castle-kit | CC0 1.0 Universal | `tower-square-arch.glb`, `wall-doorway.glb`, `stairs-stone.glb`, `wall-pillar.glb` (pointed archways, buttressed walls) |
| Graveyard Kit | Kenney | https://kenney.nl/assets/graveyard-kit | CC0 1.0 Universal | `fire-basket.glb`, `candle-multiple.glb`, `altar-stone.glb` (ritual sanctuary props) |
| Gothic Statue | Rico Cilliers / Poly Haven | https://polyhaven.com/a/gothic_statue | CC0 1.0 Universal | `gothic_statue.glb` (chapter 1 About niche statue) |
| Stone Fire Pit | Poly Haven | https://polyhaven.com/a/stone_fire_pit | CC0 1.0 Universal | `stone_fire_pit.glb` (central hearth for ch0 / ch4) |
| Standing Picture Frame 01 | James Ray Cock / Poly Haven | https://polyhaven.com/a/standing_picture_frame_01 | CC0 1.0 Universal | `standing_picture_frame_01.glb` (chapter 3 project screenshot easel/frame) |


### Sanctum bake (Round 3, blender-sanctum)
`public/assets/models/sanctum.glb` / `sanctum-lite.glb` are baked from `blender/scripts/sanctum_09_ruins.py`: the CC0 pieces above
(`ruins-arch-gothic`, `ruins-wall-hole`, `ruins-floor-squares`, `ruins-column-round[-short]`, `ruins-bricks`, `altar-stone`, `fire-basket`,
`candle-multiple`, `stone_fire_pit`) imported, placed, scaled and lit only, textured with the existing Poly Haven stone textures above.
The Kenney kit GLBs reference a `Textures/colormap.png` that is not in the repo, so those props get plain iron/wax materials in the bake.
## Chapter 3 Project Artefact Masterwork Paintings (CC0 Open Access)

| Project | Painting Title | Artist / Date | Source | Licence | File |
|---|---|---|---|---|---|
| SalarySync | *Arches in Ruins* | Hubert Robert (French, 1733–1808), ca. 1785 | [The Metropolitan Museum of Art (Object 437472)](https://www.metmuseum.org/art/collection/search/437472) | CC0 1.0 Universal | `public/assets/paintings/painting_0.jpg` |
| Rentify | *A Colonnade in Ruins* | Hubert Robert (French, 1733–1808), ca. 1785 | [The Metropolitan Museum of Art (Object 437475)](https://www.metmuseum.org/art/collection/search/437475) | CC0 1.0 Universal | `public/assets/paintings/painting_1.jpg` |
| Website Performance Monitor | *Aqueduct in Ruins* | Hubert Robert (French, 1733–1808), ca. 1785 | [The Metropolitan Museum of Art (Object 437471)](https://www.metmuseum.org/art/collection/search/437471) | CC0 1.0 Universal | `public/assets/paintings/painting_2.jpg` |
| Innovation Sprint 2025 | *Gothic Windows in the Ruins of the Monastery at Oybin* | Carl Gustav Carus (German, 1789–1869), ca. 1828 | [The Metropolitan Museum of Art (Object 439122)](https://www.metmuseum.org/art/collection/search/439122) | CC0 1.0 Universal | `public/assets/paintings/painting_3.jpg` |
| MediHub | *The Parthenon* | Frederic Edwin Church (American, 1826–1900), 1871 | [The Metropolitan Museum of Art (Object 10482)](https://www.metmuseum.org/art/collection/search/10482) | CC0 1.0 Universal | `public/assets/paintings/painting_4.jpg` |
| Finaca | *The Old Castle* | Emanuel Murant (Dutch, 1622–ca. 1700), 17th c. | [The Metropolitan Museum of Art (Object 437171)](https://www.metmuseum.org/art/collection/search/437171) | CC0 1.0 Universal | `public/assets/paintings/painting_5.jpg` |
| Fuel Dispenser RFID App | *Evening: Landscape with an Aqueduct* | Théodore Géricault (French, 1791–1824), 1818 | [The Metropolitan Museum of Art (Object 436455)](https://www.metmuseum.org/art/collection/search/436455) | CC0 1.0 Universal | `public/assets/paintings/painting_6.jpg` |
| GenAI Experiments | *Copenhagen Harbor by Moonlight* | Johan Christian Dahl (Norwegian, 1788–1857), 1846 | [The Metropolitan Museum of Art (Object 439343)](https://www.metmuseum.org/art/collection/search/439343) | CC0 1.0 Universal | `public/assets/paintings/painting_7.jpg` |


