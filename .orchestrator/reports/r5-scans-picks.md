# R5 Scans Picks — Photoreal Hero Objects & Sanctuary Props Hand-off

> Critic Cycle 1 Dispatch — Fix 3: SOURCING ONLY  
> Hand-off list for `blender-sanctum` and scene wiring.  
> Status: Sourced, decimated (<50k tris), meshopt/webp compressed (<=1.5 MB each), verified, credited.

---

## Executive Summary

Following Critic Cycle 1 finding §2/Fix 3, all chunky, low-poly Quaternius and KayKit characters have been dropped from the sanctum plan. They have been replaced with 100% photorealistic 3D scans and cultural heritage museum photogrammetry assets.

### Strict Budget & Compliance Audit

| Requirement | Budget Limit | Actual | Status |
|---|---|---|---|
| **Max Triangles per Prop** | < 50,000 tris | Max 43,918 tris (`rubble-boulder.glb`) | **PASS** |
| **Max File Size per Prop** | <= 1.50 MB | Max 1.05 MB (`armour-cuirass-scan.glb`) | **PASS** |
| **Total Directory Footprint** | <= 8.00 MB | **5.79 MB** total (10 GLBs) | **PASS** |
| **Licensing** | CC0 or CC-BY only | 100% CC0 1.0 / CC-BY 4.0 | **PASS** |
| **Game Character / Studio IP** | Strictly Zero | 0 FromSoftware/game names, rips, or clones | **PASS** |

---

## Hand-off List for `blender-sanctum` & Scene Wiring

### Chapter 0: Hero / Hearth

| File | Target Chapter | Role | Triangles | File Size | Author / Source | License |
|---|---|---|---|---|---|---|
| `public/assets/scans/statue-hooded-mourner.glb` | **ch0 (Hero)** | **Hero Subject**: Scanned 16th-century French hooded mourning sculpture (follower of Germain Pilon) seated/kneeling beside the central resting hearth. Replaces the glowing particle blob. | 26,267 | 714 KB | Thomas Flynn (US National Gallery of Art) / [Sketchfab](https://sketchfab.com/3d-models/veiled-mourner-8cde4ece6b8041ae9e6b4bf9afff3912) | CC-BY 4.0 |
| `public/assets/ruins/stone_fire_pit.glb` | **ch0 (Hero)** & **ch4 (Contact)** | **Central Hearth**: Scanned circular stone fire pit at the plinth centre beneath the oculus. | 14,248 | 448 KB | Rico Cilliers / [Poly Haven](https://polyhaven.com/a/stone_fire_pit) | CC0 |
| `public/assets/scans/lantern-chandelier.glb` | **ch0 (Hero)** | **Atmospheric Lighting**: Wrought iron hanging lantern chandelier with candles over the nave entrance. | 5,894 | 315 KB | Kirill Sannikov / [Poly Haven](https://polyhaven.com/a/lantern_chandelier_01) | CC0 |

---

### Chapter 1: About (The Scholar / Sculptor Niche)

| File | Target Chapter | Role | Triangles | File Size | Author / Source | License |
|---|---|---|---|---|---|---|
| `public/assets/ruins/gothic_statue.glb` | **ch1 (About)** | **Hero Subject**: Classical scanned Gothic drapery stone statue standing inside the wall arch niche. | 28,416 | 918 KB | Rico Cilliers / [Poly Haven](https://polyhaven.com/a/gothic_statue) | CC0 |
| `public/assets/scans/candles-brass.glb` | **ch1 (About)** | **Practical Light**: Antique engraved brass candleholders with dripping wax candles at the statue plinth. | 38,176 | 757 KB | Tina / [Poly Haven](https://polyhaven.com/a/brass_candleholders) | CC0 |
| `public/assets/scans/candlestick-wood.glb` | **ch1 (About)** | **Practical Light**: Turned wooden candlestick with burning candle beside the archival text slab. | 37,272 | 327 KB | Josh Dean / [Poly Haven](https://polyhaven.com/a/wooden_candlestick) | CC0 |

---

### Chapter 2: Work (The Crypt of Crafts / 3 Job Props)

| File | Target Chapter | Role | Triangles | File Size | Author / Source | License |
|---|---|---|---|---|---|---|
| `public/assets/scans/helmet-sallet-scan.glb` | **ch2 (Job 1: Tech Lead / Architect)** | **Hero Prop 1**: Renaissance Lion-Head Sallet battle helmet scan (Zamek Nowy Wiśnicz) mounted on stone plinth 1. | 34,185 | 519 KB | viktorinsky / [Sketchfab](https://sketchfab.com/3d-models/lion-head-sallet-renaissance-helmet-9a9de021922e453d9d4728a2882c5b2e) | CC-BY 4.0 |
| `public/assets/scans/armour-cuirass-scan.glb` | **ch2 (Job 2: Senior Full-Stack)** | **Hero Prop 2**: 144 Sony Alpha camera RAW photogrammetry leather cuirass body armour on stone plinth 2. | 30,254 | 1,075 KB | Peris Digital / [Sketchfab](https://sketchfab.com/3d-models/leather-cuirass-17-fa78d8d2ce994e889279a1b854950943) | CC-BY 4.0 |
| `public/assets/scans/sword-arming-scan.glb` | **ch2 (Job 3: Systems / Performance)** | **Hero Prop 3**: Museum photogrammetry scan of an early 14th-century medieval arming sword ("Moonbrand", Oakeshott Institute) on stone plinth 3. | 11,492 | 860 KB | The Oakeshott Institute / [Sketchfab](https://sketchfab.com/3d-models/moonbrand-early-14th-c-arming-sword-80fa91fc8c974fd0acd2a55cc513edec) | CC-BY 4.0 |
| `public/assets/scans/shield-round-scan.glb` | **ch2 (Corridor / Plinth Alternate)** | **Secondary Prop**: Viking Age round wooden shield photogrammetry scan leaning against the corridor buttress. | 9,070 | 225 KB | Rigsters / [Sketchfab](https://sketchfab.com/3d-models/viking-age-round-shield-b6aeee50315a437fa261d20ad0e39aae) | CC-BY 4.0 |
| `public/assets/scans/rubble-rock-moss.glb` | **ch2 (Corridor)** | **Corridor Rubble**: Photoscanned mossy ruin rocks flanking the gothic corridor arches. | 30,703 | 502 KB | Kless Gyzen / [Poly Haven](https://polyhaven.com/a/rock_moss_set_01) | CC0 |
| `public/assets/scans/rubble-boulder.glb` | **ch2 (Corridor Mouth)** | **Corridor Rubble**: Photoscanned mossy ruin boulder scan hugging the corridor mouth base. | 43,918 | 632 KB | Kless Gyzen / [Poly Haven](https://polyhaven.com/a/rock_moss_set_02) | CC0 |

---

### Chapter 3: Projects (The Masterwork Gallery)

| File | Target Chapter | Role | Triangles | File Size | Author / Source | License |
|---|---|---|---|---|---|---|
| `public/assets/models/standing_picture_frame_01.glb` | **ch3 (Projects)** | **Hero Artefact**: Scanned classical easel / picture frame displaying desaturated project UI blueprints. | 18,240 | 668 KB | James Ray Cock / [Poly Haven](https://polyhaven.com/a/standing_picture_frame_01) | CC0 |
| `public/assets/paintings/painting_*.jpg` | **ch3 (Projects)** | **Gallery Paintings**: 8 Met Museum CC0 masterwork ruin canvases (Hubert Robert, Carus, Church). | — | 1.8 MB | The Metropolitan Museum of Art | CC0 |

---

### Chapter 4: Contact (The Resting Fire at Journey's End)

| File | Target Chapter | Role | Triangles | File Size | Author / Source | License |
|---|---|---|---|---|---|---|
| `public/assets/ruins/stone_fire_pit.glb` | **ch4 (Contact)** | **Hero Subject**: Scanned stone fire pit with dying glowing embers and rising embers. | 14,248 | 448 KB | Rico Cilliers / [Poly Haven](https://polyhaven.com/a/stone_fire_pit) | CC0 |
| `public/assets/scans/candles-brass.glb` | **ch4 (Contact)** | **Practical Light**: Warm candlelight cluster beside the "Say Hello" contact interface. | 38,176 | 757 KB | Tina / [Poly Haven](https://polyhaven.com/a/brass_candleholders) | CC0 |

---

## Verification Audit

All files in `public/assets/scans/` have been processed with:
- `@gltf-transform/cli optimize`
- Texture format: `EXT_texture_webp` (1024x1024 max or 512x512 for secondary props)
- Geometry compression: `EXT_meshopt_compression` + `KHR_mesh_quantization`
- Indexed triangle count verified with `three/examples/jsm/loaders/GLTFLoader` + `MeshoptDecoder`.
