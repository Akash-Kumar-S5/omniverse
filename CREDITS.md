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
| Animated Particle Effects #2 (flame_01 8x8 flipbook) | para / OpenGameArt | https://opengameart.org/content/animated-particle-effects-2 | CC0 1.0 Universal | `public/assets/fx/flame_sheet_8x8.png` (crossed flame billboards in `Fire.tsx`) |


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

## Chapter Souls-Style 3D Props (Round 3 Direction 13:05)

| Asset | Author | Source | Licence | File / Use |
|---|---|---|---|---|
| Single Knight Pack (`KnightCharacter.glb`, `Helmet*.glb`, `Sword.glb`) | Quaternius | https://quaternius.com | CC0 1.0 Universal | `public/assets/props/knight.glb`, `helmet-*.glb`, `sword-knight.glb` (Ch0 hero resting knight; Ch2 job helmet & sword) |
| Medieval Weapons Pack (`Claymore.glb`, `Shield_*.glb`, `Axe_Double.glb`) | Quaternius | https://quaternius.com | CC0 1.0 Universal | `public/assets/props/greatsword.glb`, `shield-heater.glb`, `shield-round.glb`, `battleaxe.glb` (Ch2 job weapons/shields) |
| Modular Dungeon Pack (`Candelabrum*.glb`, `Torch_wall.glb`, `Bones.glb`) | Quaternius | https://quaternius.com | CC0 1.0 Universal | `public/assets/props/candelabra-tall.glb`, `candelabra.glb`, `torch-wall.glb`, `skull-bones.glb` (Ch0/1/2 sanctuary lighting & crypt props) |
| Survival Pack (`Bonfire_Fire.glb`, `Bonfire.glb`) | Quaternius | https://quaternius.com | CC0 1.0 Universal | `public/assets/props/fire-flame-3d.glb`, `hearth-logs.glb` (Ch0 & Ch4 central hearth 3D flame and firewood) |
| Modular Medieval Buildings (`Banner.glb`) | Quaternius | https://quaternius.com | CC0 1.0 Universal | `public/assets/props/banner.glb` (Ch2 corridor pillar banner) |
| Particle Pack (Flame & Fire Sprites) | Kenney | https://kenney.nl/assets/particle-pack | CC0 1.0 Universal | `public/assets/props/textures/flame-spritesheet-6x1.png`, `flame_0*.png`, `fire_0*.png` (Ch0 & Ch4 animated flame flipbook) |
| Graveyard Kit (`fire-basket.glb`, `candle-multiple.glb`) | Kenney | https://kenney.nl/assets/graveyard-kit | CC0 1.0 Universal | `public/assets/props/brazier-fire-basket.glb`, `candles-altar.glb` (Ch0/Ch4 brazier and Ch1 altar candles) |
| Adventurers Character Pack (`Rogue_Hooded.glb`, `Knight.glb`) | Kay Lousberg (KayKit) | https://kaylousberg.com | CC0 1.0 Universal | `public/assets/props/statue-hooded-keeper.glb`, `public/assets/props/statue-cloaked-knight.glb` (Ch0/Ch4 kneeling keeper & Ch2 cloaked swordswoman - replaced in Critic C1 Fix 3 with photoreal scans below) |

## Photoreal Scans & Cultural Heritage Photogrammetry (Critic Cycle 1 Fix 3)

| Asset | Author | Source | Licence | File / Chapter / Use |
|---|---|---|---|---|
| Veiled Mourner (US National Gallery of Art scan) | Thomas Flynn (nebulousflynn) | https://sketchfab.com/3d-models/veiled-mourner-8cde4ece6b8041ae9e6b4bf9afff3912 | CC Attribution 4.0 | `public/assets/scans/statue-hooded-mourner.glb` (Ch0 Hero: 16th c. French follower of Germain Pilon hooded mourner sculpture by hearth; 26,267 tris, 714 KB) |
| Lion-Head Sallet — Renaissance Helmet | viktorinsky | https://sketchfab.com/3d-models/lion-head-sallet-renaissance-helmet-9a9de021922e453d9d4728a2882c5b2e | CC Attribution 4.0 | `public/assets/scans/helmet-sallet-scan.glb` (Ch2 Work: Zamek Nowy Wiśnicz historical Renaissance helmet scan for Job 1 plinth; 34,185 tris, 519 KB) |
| Leather Cuirass 17 | Peris Digital | https://sketchfab.com/3d-models/leather-cuirass-17-fa78d8d2ce994e889279a1b854950943 | CC Attribution 4.0 | `public/assets/scans/armour-cuirass-scan.glb` (Ch2 Work: 144 Sony Alpha camera RAW photogrammetry cuirass scan for Job 2 plinth; 30,254 tris, 1075 KB) |
| Moonbrand (Early 14th C Arming Sword) | The Oakeshott Institute | https://sketchfab.com/3d-models/moonbrand-early-14th-c-arming-sword-80fa91fc8c974fd0acd2a55cc513edec | CC Attribution 4.0 | `public/assets/scans/sword-arming-scan.glb` (Ch2 Work: 14th c. European arming sword museum photogrammetry scan for Job 3 plinth; 11,492 tris, 860 KB) |
| Viking Age Round Shield | Rigsters | https://sketchfab.com/3d-models/viking-age-round-shield-b6aeee50315a437fa261d20ad0e39aae | CC Attribution 4.0 | `public/assets/scans/shield-round-scan.glb` (Ch2 Work: Society for Combat Archaeology round shield scan; 9,070 tris, 225 KB) |
| Brass Candleholders | Tina / Poly Haven | https://polyhaven.com/a/brass_candleholders | CC0 1.0 Universal | `public/assets/scans/candles-brass.glb` (Ch1 About & Ch4 Contact: antique engraved brass candleholders with real wax taper candles; 38,176 tris, 757 KB) |
| Wooden Candlestick | Josh Dean / Poly Haven | https://polyhaven.com/a/wooden_candlestick | CC0 1.0 Universal | `public/assets/scans/candlestick-wood.glb` (Ch1 About & Ch3 Projects: turned wood candlestick with candle; 37,272 tris, 327 KB) |
| Lantern Chandelier 01 | Kirill Sannikov / Poly Haven | https://polyhaven.com/a/lantern_chandelier_01 | CC0 1.0 Universal | `public/assets/scans/lantern-chandelier.glb` (Ch0 Hero & Ch2 Work: wrought iron lantern chandelier with candles; 5,894 tris, 315 KB) |
| Rock Moss Set 01 | Kless Gyzen / Poly Haven | https://polyhaven.com/a/rock_moss_set_01 | CC0 1.0 Universal | `public/assets/scans/rubble-rock-moss.glb` (Ch0 & Ch2: mossy ruin rock rubble scan; 30,703 tris, 502 KB) |
| Rock Moss Set 02 (Granite Boulder) | Kless Gyzen / Poly Haven | https://polyhaven.com/a/rock_moss_set_02 | CC0 1.0 Universal | `public/assets/scans/rubble-boulder.glb` (Ch2 Work: corridor mouth mossy granite boulder scan; 43,918 tris, 632 KB) |





### Sanctum props placed (Round 3, blender-sanctum)
`knight`, `hearth-logs`, `fire-flame-3d`, `greatsword`, `shield-heater`, `helmet-greathelm`, `battleaxe`, `skull-bones`, `candles-altar`,
`candelabra-tall`, `brazier-fire-basket` from `public/assets/props` (credits in the props picks report) are baked into `sanctum.glb`.

### Round 5 blender-fire
`castle_brick_broken_06`, `cobblestone_floor_13` (Poly Haven, CC0, 2k textures for the ch1 plinth and the floor), `wooden_candlestick` (Poly Haven, CC0, scan candles in the niche, on the altar and around the plinth), `stone_fire_pit.draco.glb` (Poly Haven scan, Draco-recompressed with `blender/scripts/compress_fire_pit.py`, 428 KB), `flame-spritesheet-6x1.png` (Kenney particle pack, CC0, flipbook on a drei Billboard in `src/scene/world/Fire.tsx`).

### Round 5 blender-scans
Photoreal scans from `public/assets/scans` (see the agy-scans credits) are baked into `sanctum.glb`: hooded mourner by the fire, helmet, cuirass, sword and shield on the ch2 stands. The earlier figure and weapon props are removed from the scene.

## Round 6 scenes (blender-scenes)

No new third-party assets. Reuse of already credited CC0 files in new places:

| Asset | Source | Licence | New use |
|---|---|---|---|
| Lantern Chandelier 01 (`public/assets/scans/lantern-chandelier.glb`) | Kirill Sannikov / Poly Haven | CC0 1.0 Universal | Ch3 Projects: the warm practical that lights the framed painting |
| cobblestone_floor_13, castle_brick_broken_06 | Poly Haven | CC0 | Ch0/Ch4 hearth stone and flagstone surround; ch1 pedestal (greyer tint) |
| Floor Squares (Quaternius Ultimate Modular Ruins) | Quaternius | CC0 | Flagstones now run up to the hearth stone |
| Shield / helmet / cuirass / arming sword scans | see Scans section | CC0 | Ch2: albedo desaturated and darkened in Blender so they read as aged metal |

## Round 7 scenes (blender-scenes)

No new third-party assets; reused CC0 files in new places.

| Asset | Source | Licence | New use |
|---|---|---|---|
| cobblestone_floor_13 (floor, 1.1 m tile, plinth skin) | Poly Haven | CC0 | Flat real-scale stone floor and hearth stone, replaces bevelled tile pieces |
| Wall torch (`public/assets/props/torch-wall.glb`) | see Props section | CC0 | Ch2 right-arch wall sconce |
| Candelabra (`candelabra-tall.glb`) | see Props section | CC0 | Ch1 warm practical front-left of the statue |
| Stone fire pit scan (`stone_fire_pit.draco.glb`) | Poly Haven | CC0 | Albedo darkened 50% so the ring rocks read as the dark scan stone under the fire light |

## Round 8 scenes (blender-scenes)

| Asset | Author | Source | Licence | Used for |
|---|---|---|---|---|
| Kite Shield (scan, 1k, `blender/props/kite_shield/`) | Poly Haven | https://polyhaven.com/a/kite_shield | CC0 1.0 Universal | Ch2 role 0: the scanned metal shield on a pedestal, baked into `sanctum.glb` |
| Dry Branches Medium 01 (scan, 1k, `blender/props/dry_branches_medium_01/`) | Poly Haven | https://polyhaven.com/a/dry_branches_medium_01 | CC0 1.0 Universal | Ch0/ch4: charred kindling in the fire pit, replaces the faceted hearth logs |
| Brass Candleholders (`public/assets/scans/candles-brass.glb`) | Tina / Poly Haven | https://polyhaven.com/a/brass_candleholders | CC0 1.0 Universal | Ch1: scanned candle cluster front-left of the statue, replaces the chunky candelabra |
| Stone fire pit scan, albedo darkened | Poly Haven | https://polyhaven.com/a/stone_fire_pit | CC0 1.0 Universal | Pit stones read as dark scan stone |

## Round 9 scenes (blender-scenes)

| Asset | Author | Source | Licence | Used for |
|---|---|---|---|---|
| Boulder 01 (`public/assets/scans/rubble-boulder.glb`) | Rico Cilliers / Poly Haven | https://polyhaven.com/a/boulder_01 | CC0 1.0 Universal | Ch0/ch4: scanned dark rock base under the fire pit, replaces the smooth plinth puck |
| Kite Shield, Dry Branches Medium 01, Brass Candleholders, Wall torch | see Round 8 / Props | CC0 | Re-lit and re-placed in ch1, ch2 and the pit |

## Round 10 scenes (blender-scenes)

| Asset | Author | Source | Licence | Used for |
|---|---|---|---|---|
| Dead Tree Trunk 02 (scan, 1k, `blender/props/dead_tree_trunk_02/`) | Poly Haven | https://polyhaven.com/a/dead_tree_trunk_02 | CC0 1.0 Universal | Ch0/ch4: three charred logs laid crosswise in the pit (albedo darkened to <= 0.3), replace the pale kindling |
| Boulder 01 / Rubble Rock Moss (`public/assets/scans/rubble-boulder.glb`, `rubble-rock-moss.glb`) | Rico Cilliers, Poly Haven | https://polyhaven.com/a/boulder_01 | CC0 1.0 Universal | Ch0/ch4: nine dark half-sunk scanned rocks ring the pit foot |
| Kite Shield, Brass Candleholders, wall torch | see Round 8 | CC0 | Re-lit, re-placed (ch2 shield on a taller pedestal, ch1 candles removed from the foreground) |

## Round 11 scenes (blender-scenes)

| Asset | Author | Source | Licence | Used for |
|---|---|---|---|---|
| Stone fire pit scan (`stone_fire_pit.draco.glb`, albedo x0.35, ground disc darkened) | Poly Haven | https://polyhaven.com/a/stone_fire_pit | CC0 1.0 Universal | Ch0/ch4: the pit keeps its own dark boulders, ground is now dark ash |
| Boulder 01 (`rubble-boulder.glb`) | Rico Cilliers, Poly Haven | https://polyhaven.com/a/boulder_01 | CC0 1.0 Universal | Ch0/ch4: nine-stone dark ring (darker albedo, boulder only) |
| Dead Tree Trunk 02 (shape only, flat charcoal material) | Poly Haven | https://polyhaven.com/a/dead_tree_trunk_02 | CC0 1.0 Universal | Ch0/ch4: charred log shapes |
| cobblestone_floor_13, concrete_wall_003 | Poly Haven | CC0 | Dark rough stone for the ch1 plinth; plaster backdrop planes behind the ch3 paintings |
