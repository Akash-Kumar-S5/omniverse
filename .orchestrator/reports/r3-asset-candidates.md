# Round 3 Dark Fantasy Asset Candidates ("Ember & Ash")

**Agent:** agy-assets  
**Branch:** `r4/agy-assets` (`.worktrees/agy-assets`)  
**Scope:** Step 1 candidate selection (report only, no downloads yet)  
**Guidelines:** CC0/CC-BY only, <=4 MB GLB budget per asset/assembly, login-free reachable sources, original dark fantasy (zero FromSoftware imitation).

---

## Candidate Overview Table

| # | Asset / Kit Name | Source & Author | Licence | Format & Size (GLB) | Primary Role in Sanctum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Ultimate Modular Ruins Pack** | Quaternius | **CC0** (Public Domain) | GLB / modular (~40–180 kB/piece, kit <2.5 MB) | Main gothic hall shell, collapsed stone arches, broken vault |
| **2** | **Castle Kit (3D Modular)** | Kenney (kenney.nl) | **CC0** (Public Domain) | GLB modular (~15–75 kB/piece, assembly <1.2 MB) | Pointed stone archways, buttressed wall doorways, stair plinths |
| **3** | **Modular Dungeon Kit (3D)** | Kenney (kenney.nl) | **CC0** (Public Domain) | GLB modular (~12–90 kB/piece, corridor <1.0 MB) | Ch2 Experience colonnade: heavy stone portal arches & stone flags |
| **4** | **Gothic Statue (`gothic_statue`)** | Poly Haven (Rico Cilliers) | **CC0** (Public Domain) | GLTF / GLB (geom: 912 kB, 1k textures: ~2.1 MB) | Ch1 About niche: weathered stone cathedral statue on carved plinth |
| **5** | **Stone Fire Pit (`stone_fire_pit`)** | Poly Haven | **CC0** (Public Domain) | GLTF / GLB (geom: 96 kB, 1k textures: ~2.4 MB) | Ch0 & Ch4 central hearth: circular stone fire pit for rising embers |
| **6** | **Graveyard Kit (3D Modular)** | Kenney (kenney.nl) | **CC0** (Public Domain) | GLB modular (~10–60 kB/piece, props <800 kB) | Atmospheric props: stone altars, fire braziers, candle clusters |

---

## Detailed Asset Dossiers

### 1. Quaternius — Ultimate Modular Ruins Pack
- **Canonical URL:** https://quaternius.com/packs/ultimatemodularruins.html
- **Direct Download Mirror:** https://drive.google.com/drive/folders/1ETp2ldaHaP0BkS4FBmkT-g9Yf88T_cIX?usp=sharing (and https://poly.pizza/u/Quaternius)
- **Licence:** CC0 1.0 Universal (Public Domain)
- **Author:** Quaternius (quaternius.com)
- **Size:** Individual modular components ~40 kB to 180 kB GLB; assembled architectural hall <= 2.5 MB.
- **Why it fits:** Provides over 90 modular low-poly models of crumbling gothic stone arches, fractured cylindrical pillars, collapsed vault ribs, and floor rubble piles. It allows the headless Blender pipeline to assemble a ruined gothic sanctuary with an open collapsed vault (oculus) looking to the night sky, replacing the brutalist concrete chamber with aged gothic stonework without custom hand-modelling.

### 2. Kenney — Castle Kit (Modular 3D)
- **Canonical URL:** https://kenney.nl/assets/castle-kit
- **Direct Download Mirror:** https://github.com/shorepine/kenney/tree/main/3d/castle (Raw GLBs: `tower-square-arch.glb`, `wall-doorway.glb`, `stairs-stone.glb`, `wall-pillar.glb`)
- **Licence:** CC0 1.0 Universal (Public Domain)
- **Author:** Kenney (kenney.nl)
- **Size:** ~15 kB to 75 kB per GLB component; assembled cathedral walls < 1.2 MB total.
- **Why it fits:** Features clean modular medieval masonry: gothic pointed archways (`tower-square-arch.glb`), heavy stone portal entries (`wall-doorway.glb`), and masonry steps (`stairs-stone.glb`). These elements can form the high perimeter walls and window embrasures through which cold moonlight shafts penetrate into the hall.

### 3. Kenney — Modular Dungeon Kit (3D)
- **Canonical URL:** https://kenney.nl/assets/modular-dungeon
- **Direct Download Mirror:** https://github.com/shorepine/kenney/tree/main/3d/modular-dungeon (Raw GLBs: `corridor.glb`, `corridor-wide.glb`, `gate.glb`, `template-wall.glb`)
- **Licence:** CC0 1.0 Universal (Public Domain)
- **Author:** Kenney (kenney.nl)
- **Size:** 12 kB to 90 kB per GLB component; complete corridor segment < 1.0 MB total.
- **Why it fits:** Directly answers the Chapter 2 (Experience) colonnade requirements: vaulted stone-block corridors and heavy iron-reinforced stone archways. It converts the modern concrete portals into an ancient dungeon passageway where the camera advances between role waypoints.

### 4. Poly Haven — Gothic Statue (`gothic_statue`)
- **Canonical URL:** https://polyhaven.com/a/gothic_statue
- **Direct API & Download:** `https://api.polyhaven.com/files/gothic_statue` (Direct GLTF 1k: `https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/gothic_statue/gothic_statue_1k.gltf` + `.bin`)
- **Licence:** CC0 1.0 Universal (Public Domain)
- **Author:** Rico Cilliers / Poly Haven
- **Size:** Geometry .bin is 912 kB; 1k PBR textures ~2.1 MB; combined GLB <= 3.0 MB (and easily compressed/baked under 800 kB for LITE).
- **Why it fits:** An authentic photogrammetry-sculpted gothic stone statue with folded wings and weathered monastic drapery on a carved stone pedestal. Perfectly replaces the Roman bust in Chapter 1 (About niche), giving the alcove an authentic cathedral guardian aesthetic that meshes naturally with dark fantasy solitude.

### 5. Poly Haven — Stone Fire Pit (`stone_fire_pit`)
- **Canonical URL:** https://polyhaven.com/a/stone_fire_pit
- **Direct API & Download:** `https://api.polyhaven.com/files/stone_fire_pit` (Direct GLTF 1k: `https://dl.polyhaven.org/file/ph-assets/Models/gltf/1k/stone_fire_pit/stone_fire_pit_1k.gltf` + `.bin`)
- **Licence:** CC0 1.0 Universal (Public Domain)
- **Author:** Poly Haven
- **Size:** Geometry .bin is 96 kB; 1k texture maps ~2.4 MB; decimated mesh and baked texture <= 400 kB.
- **Why it fits:** A rough-hewn circular stone ring filled with ashes and charred embers. Positioned on the central plinth beneath the collapsed roof, it acts as the primary light source and origin point for the warm rising ember swarm (Chapter 0) and the final resting hearth (Chapter 4), establishing original dark-fantasy atmosphere with zero game asset rip-offs.

### 6. Kenney — Graveyard Kit (Modular 3D)
- **Canonical URL:** https://kenney.nl/assets/graveyard-kit
- **Direct Download Mirror:** https://github.com/shorepine/kenney/tree/main/3d/graveyard (Raw GLBs: `fire-basket.glb`, `candle-multiple.glb`, `altar-stone.glb`, `stone-wall-damaged.glb`)
- **Licence:** CC0 1.0 Universal (Public Domain)
- **Author:** Kenney (kenney.nl)
- **Size:** 10 kB to 60 kB per GLB model; total prop bundle < 800 kB.
- **Why it fits:** Delivers essential practical props for environmental storytelling: iron fire braziers (`fire-basket.glb`) that emit flickering warm firelight, melting wax candle clusters (`candle-multiple.glb`) for alcoves, and monolithic stone altars (`altar-stone.glb`) to serve as display plinths for project slabs.

---

## Recommendation & Architecture Assembly Plan

1. **Hall Shell & Oculus (Chapters 0, 3, 4):** Assemble Quaternius **Ultimate Modular Ruins** (collapsed vault ribs & fractured arches) with Kenney **Castle Kit** wall bases.
2. **Central Hearth (Chapters 0, 4):** Place Poly Haven **Stone Fire Pit** beneath the open vault; rising ember simulation originates from the pit.
3. **About Niche (Chapter 1):** Place Poly Haven **Gothic Statue** on the pedestal in the side alcove, flanked by Kenney **candle clusters**.
4. **Experience Corridor (Chapter 2):** Construct the 4-portal walkway using Kenney **Modular Dungeon Kit** stone arches and fractured wall segments.
5. **Lighting & Bake:** Single headless Cycles pass baking warm firelight bounce from the central hearth against cold blue moonlight descending from the roof aperture. Total unlit baked GLB target: <= 3.2 MB (HIGH) / <= 950 kB (LITE).
