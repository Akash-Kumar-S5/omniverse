# Asset research 1: dark-fantasy swaps (desktop only, 09-Nov)

Method: web search, then page reads to verify licence, triangle count and texture size. Nothing was downloaded and no code was edited.
Fields marked "unverified" are ones the page didn't show, or the fetch failed (Sketchfab returned empty 202s on some pages).
Ranking is by visual gain per hour, scored against the c13 defects in `critic-cycle-13.md`.
Subjects stay by kind: a real fire in ch0 and ch4, a statue in ch1, the cuirass or armour in ch2, and framed project art in ch3.
Licence filter: I kept only CC0 and CC-BY assets.
Excluded:
- NC or ND licences: the Llantwit Major effigies, Cryptic3D's Devon church, the St Sophia interior and GSXNet's statue.
- Paid store items, and the Korea Heritage brazier (its free/premium status was unclear).
- One fan recreation of a game church that turned up in search.

## Top 5 to swap now

| # | Swap | Candidate | Licence / author | Size | Fixes (c13) | Cost | Gain |
|---|---|---|---|---|---|---|---|
| 1 | ch0+ch4 flame flipbook (`public/assets/fx/flame_sheet_8x8.png`, `Fire.tsx`) | **CGHEVEN "Large Campfire Loop" (No Smoke variant)**, https://cgheven.com/blog/real-fire-flipbooks-for-unity-unreal-blender. Backup: **Unity Labs Flame02 / Flame03**, https://unity.com/blog/engine-platform/free-vfx-image-sequences-flipbooks (zip pattern `unity3d.com/files/labs/downloads/vfx/assets01/Flame02/Flame02-flipbooks.zip`) | CGHEVEN: CC0 ("no attribution needed"), Ammar Khan. Unity: CC0, Thomas Iche / Unity Labs (Houdini sims) | 6x6 or 8x8 grid; pixel resolution unverified for both. The Unity link dates from 2016 and may be dead | Hard card edges, separate "tongues", pinched base. A campfire loop is wide at the base and fills the mouth. Our current OpenGameArt sheet is a small stylised flipbook | 30-45 min if the grid matches the existing flipbook code (texture swap plus a frames/cols constant); +20 min to check alpha vs black background and set blending | ch0 +0.4, ch4 +0.5 |
| 2 | ch3 frame (`standing_picture_frame_01.glb`, `ProjectArtefact.tsx`) | **Poly Haven Fancy Picture Frame 02**, https://polyhaven.com/a/fancy_picture_frame_02 | CC0. Rico Cilliers (model), Rob Tuytel (scan and paint) | 35K tris; 1K-8K textures (use 1K or 2K, ≈1-3 MB) | Replaces a plain modern easel frame with a carved gilt rococo frame that has worn patina. It's a wall frame, so it hangs flat on the wall plane, which fixes the floating and keystoned easel. Lighter option: **Fancy Picture Frame 01** (https://polyhaven.com/a/fancy_picture_frame_01, CC0, 938 tris, beaded and rope gilt) | ≈45 min: export glTF at 1K, swap the inset painting material for our project texture, hang it on the wall plane, re-aim the lantern | ch3 +0.4. The gibberish canvas fix from c13 #4 is still needed; this asset doesn't solve it |
| 3 | ch1+ch2 plinths and the hall shell (Quaternius/Kenney low-poly pieces, bare cuboids) | **Poly Haven Medieval Blocks 03**, https://polyhaven.com/a/medieval_blocks_03, and **Stone Brick Wall 001**, https://polyhaven.com/a/stone_brick_wall_001 | CC0. Rob Tuytel; Dimitrios Savva and Rico Cilliers | Textures only, 1K-16K (use 1K/2K diff + nor + rough) | The bare black cuboid plinths (ch1 925-1230; ch2 1010-1440 below y 695) become chiselled blocks. The ch2 blue slab and ch1 box edge read as stone wall instead of flat planes. Kit-fidelity mismatch drops because the shell takes on photo-texture | ≈45 min: material swap in the existing sanctum bake (`blender/scripts/pbr`, `assign`) plus re-bake; no new geometry | ch1 +0.2, ch2 +0.2, hall +0.2 |
| 4 | ch0+ch4 relief panel (the cutout beside the barrel) | **"Effigy of a knight probably Sir John Rossington"**, https://sketchfab.com/3d-models/effigy-of-a-knight-probably-sir-john-rossington-9a5f5ceec9eb48b0b2f7cbcfdf6f5197 | CC-BY (credit required), Shiro Morturn. Photogrammetry (Metashape) | 73.9k tris; texture size unverified | The relief is lit brighter than the barrel and reads as a flat cardboard cutout. A recumbent stone tomb figure lies low beside the fire, so it can't out-shout the flame, and it takes firelight on real 3D form instead of baked light. This is the strongest "rest by the fire in a ruined chapel" read of any option. Alt: **Funeral Effigy of Sir Walter de Teyes**, https://sketchfab.com/3d-models/funeral-effigy-of-sir-walter-de-teyes-7e37b0865a224dd3a8da0d849fd7ce84 (CC-BY, GeoLan 3D, 200.6k tris, damaged c.1325 knight, heavier) | ≈1 h: decimate to about 25k, 1K textures, place on the floor 0.6-1 m from the barrel, light it with the fire and no baked emissive. Add the CREDITS line | ch0 +0.3, ch4 +0.3 |
| 5 | Backdrop silhouettes behind ch0/ch4 (the fog layers that read faint and generic) | **Ruined Church (drone scan, Bucharest)**, https://sketchfab.com/3d-models/ruined-church-85968ae9da6941bea41614cedfcd3e11 | CC-BY, andreidrmb. Photogrammetry | 330k tris; texture size unverified | Real broken walls and collapsed towers as 2-3 fog-depth silhouettes (the threejspunk and rottensouls depth layers) instead of repeated kit pillars. It's only a silhouette, so texture res barely matters | ≈1.5 h: decimate to about 40-60k, 512 texture, place 15-25 m back in the fog, check the size budget | ch0 +0.2, ch4 +0.2 |

Projected total if all five land with the c13 lighting fixes: ch0 ≈8.5, ch1 ≈8.3, ch2 ≈8.3, ch3 ≈8.2, ch4 ≈8.5. These are estimates, not measured.

## Per-chapter candidates (full list)

### ch0 / ch4: barrel fire (and the relief)
- **Flame flipbook:** CGHEVEN Large Campfire Loop or Ground Fire 03 (CC0, 6x6/8x8; Top 5 #1). Unity Labs Flame02 or Flame03, or SmallFlame01 for embers at the mouth (CC0; Top 5 #1 backup).
- **Live-action fire footage:** FX Elements free fire clips (https://www.fxelements.com/free/fire), live action shot on RED at 4K, pre-keyed for screen blend.
  - The licence is FX Elements' own royalty-free, no-attribution licence, **not CC0**. Web-embedding and redistribution terms are on `/license-agreement`, which I haven't read.
  - It needs a video-texture path, which is new pipeline work. Hold it as v2 unless #1 still reads as cards.
- **Brazier:** "Medieval brazier" by dzubei777 (https://sketchfab.com/3d-models/medieval-brazier-22357284793a44e7848c241f5e5816f3), CC-BY, 5.1k tris, 1K PBR. It's hand-modelled, not scanned, so it's lower fidelity than our Poly Haven barrel scan. **Not recommended**: the barrel stays as Akash's subject.
- **Relief replacement:** the knight effigies (Top 5 #4). Generic tombstone "CC0 - Tombstone" by plaggy (https://sketchfab.com/3d-models/cc0-tombstone-3990a38c91c5435f84bd2f8c05dfb189): its description says CC0 but the licence field says CC-BY, so treat it as CC-BY. It's low value.
- **Current source note:** the OpenGameArt page for the current flame sheet returned 403, so I couldn't re-verify its CC0 licence. CREDITS.md records CC0.

### ch1: statue + plinth
- **Statue:** keep the Poly Haven Gothic Statue (CC0). ch1 is at 8, and the c13 loss is lighting, not the asset.
- **Statue alternatives (unverified; the fetches failed):**
  - "Stone statue of the Virgin Mary" by Seweryn Stachula (https://sketchfab.com/3d-models/stone-statue-of-the-virgin-mary-f62e86afa14742878c0d22fabe2e170d), CC-BY per search.
  - SMK Digital Casts (https://sketchfab.com/smkmuseum/collections/smk2-presents-digital-casts), public domain per search, but the collection page failed so its seven works are unlisted.
  - The SMK Gothic casts (Bamberg and Mainz cathedral figures) are on MyMiniFactory with unconfirmed licences.
- **Plinth:** the texture swap (Top 5 #3). Scan options:
  - "Pedestal (Photogrammetry)" by pigfinite (https://sketchfab.com/3d-models/pedestal-photogrammetry-3f199cb6fb6b463f8ec70441b24f16f4), CC-BY per search, page unverified. The author says the textures are low-res.
  - "Stone Pedestal (Test)" by Maka (https://sketchfab.com/3d-models/stone-pedestal-test-f57d8a8aac2749c493c430918b18bb53), CC-BY, about 1.3M tris, too heavy.
  - The texture route is cheaper and safer.

### ch2: cuirass
- **Cleveland Museum of Art "1964.88 Armor for Man and Horse"** (https://sketchfab.com/3d-models/196488-armor-for-man-and-horse-faca2ad557f64809b598c3a646a8804f): CC0, 119.8k tris, downloadable. It's c.1575 North Italian etched steel.
  - Cost ≈2 h: isolate the breastplate in Blender and drop the horse barding.
  - Gain ch2 +0.3 (etched steel plate reads far more dark-fantasy than leather). Rank 6: worth doing after the top 5, since ch2 already passes at 8.
- **Hussar's cuirass breastplate (CMA 1916.1521):** CC0 per a mirror site, but the Sketchfab page is unverified (403). Ask the orchestrator to check the clevelandart Sketchfab account.
- **Keep:** the Peris Digital leather cuirass (CC-BY) stays until the CMA swap is done.

### ch3: framed art + lantern
- Fancy Picture Frame 02 or 01 (Top 5 #2). Hanging Picture Frame 03 (https://polyhaven.com/a/hanging_picture_frame_03), CC0, an oval carved wood frame, is a weaker fit for screenshots.
- **Keep:** the lantern chandelier (Poly Haven, CC0). The c13 issue is placement, not the asset.

### Hall: floor, walls, arches, backdrop
- **Textures (CC0):**
  - Poly Haven Medieval Blocks 03 and Stone Brick Wall 001 (Top 5 #3).
  - Castle Brick 01 (moss and wet grime, https://polyhaven.com/a/castle_brick_01) for the lower walls.
  - ambientCG Rocks025 (https://ambientcg.com/view?id=Rocks025, a photogrammetry medieval stone floor) and Tiles130 (https://ambientcg.com/view?id=Tiles130, broken castle floor). Either would replace the speckled floor that reads as carpet in c13 ch0/ch4.
- **Backdrop scans (CC-BY):**
  - Ruined Church (Top 5 #5).
  - "Ruins of Neo-Gothic Church in Central Europe" by grzes19 (https://sketchfab.com/3d-models/ruins-of-neo-gothic-church-in-central-europe-5d199bb965b047d38e6ef42c449e739f), 1.5M tris, flat cloudy-day lighting. It's too heavy unless decimated hard.
- **Arch:** "Medieval village stone archway" by yelizegi (https://sketchfab.com/3d-models/medieval-village-stone-archway-956b1d3dd18e4d2ca76ea0e5b4cac6ee), CC-BY, 1.5M tris, a photogrammetry archway. It's also sold on Fab, so confirm the free download is the same mesh. Only worth it as one hero arch behind ch2, decimated.
- **Wall:** "Stone Wall (HQ 3D scan)" by ABSTRACT_DUCK (https://sketchfab.com/3d-models/stone-wall-hq-3d-scan-ed3af535601446e69e9679ddf8674a2b), CC-BY, 132.7k tris, with an optimised version linked. It could be a real wall behind ch3's frame.

## Licence obligations if adopted
- **CC-BY items** (effigy, ruined church, any Sketchfab scan): each needs a CREDITS.md row with author, URL and licence. Use generic file names (for example `effigy-knight-scan.glb`, `ruin-church-scan.glb`).
- **CC0 items** (Poly Haven, ambientCG, CGHEVEN, Unity Labs, CMA): no attribution required. Add a CREDITS row anyway for provenance.

## Sources
[Poly Haven fancy frames](https://polyhaven.com/a/fancy_picture_frame_02) ·
[Poly Haven medieval blocks](https://polyhaven.com/a/medieval_blocks_03) ·
[Poly Haven stone brick wall](https://polyhaven.com/a/stone_brick_wall_001) ·
[Poly Haven licence](https://polyhaven.com/license) ·
[CGHEVEN fire flipbooks](https://cgheven.com/blog/real-fire-flipbooks-for-unity-unreal-blender) ·
[Unity Labs VFX flipbooks](https://unity.com/blog/engine-platform/free-vfx-image-sequences-flipbooks) ·
[FX Elements free fire](https://www.fxelements.com/free/fire) ·
[CMA armour](https://sketchfab.com/3d-models/196488-armor-for-man-and-horse-faca2ad557f64809b598c3a646a8804f) ·
[Rossington effigy](https://sketchfab.com/3d-models/effigy-of-a-knight-probably-sir-john-rossington-9a5f5ceec9eb48b0b2f7cbcfdf6f5197) ·
[de Teyes effigy](https://sketchfab.com/3d-models/funeral-effigy-of-sir-walter-de-teyes-7e37b0865a224dd3a8da0d849fd7ce84) ·
[Ruined Church](https://sketchfab.com/3d-models/ruined-church-85968ae9da6941bea41614cedfcd3e11) ·
[Neo-Gothic ruins](https://sketchfab.com/3d-models/ruins-of-neo-gothic-church-in-central-europe-5d199bb965b047d38e6ef42c449e739f) ·
[Stone archway](https://sketchfab.com/3d-models/medieval-village-stone-archway-956b1d3dd18e4d2ca76ea0e5b4cac6ee) ·
[Stone wall scan](https://sketchfab.com/3d-models/stone-wall-hq-3d-scan-ed3af535601446e69e9679ddf8674a2b) ·
[Medieval brazier](https://sketchfab.com/3d-models/medieval-brazier-22357284793a44e7848c241f5e5816f3) ·
[ambientCG Rocks025](https://ambientcg.com/view?id=Rocks025)
