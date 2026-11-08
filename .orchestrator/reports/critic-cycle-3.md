# Critic cycle 3 (2026-11-08 22:10 IST)

Build: main @ b51feff. Fresh `npm run build`, served by a new `npx vite preview --port 4340 --strictPort` (port was free;
no stale server reused). Playwright headed Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c3-ch{0..4}.png` (1440x900), `critic-c3-ch0-390.png`, `critic-c3-ch4-390.png` (390x844).
References: `aengel-03-project-chapter.png`, `bench-seed-2.png` (existing captures; not re-shot this cycle).
Console: 0 errors, 1 warning (the `THREE.Clock` deprecation, unchanged).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c2 | c3 | One-line reason |
|---|---|---|---|
| ch0 Hero | 6 | **6.5** | Flagstones finally ground the pit, but the floor now dominates: oversized pillowy tiles read like toy blocks. Still no flame, blue-white bokeh embers, flat-backed relief slab. |
| ch1 About | 4 | **5** | Blob is gone and the frame is clean. But the statue is an unlit dark silhouette on an untextured box pillar, and the right half is near-black mud. No subject reads. |
| ch2 Work | 4 | **5** | Corridor arches now read as a place. The shield is still a flat beige disc parked under the bullets, and two bright white shard planes glitch on the right edge (~1350-1410, 470-750). |
| ch3 Projects | 3 | **6.5** | Biggest jump. The lit frame plus lantern is a real hero composition. Lets down: the painting is a generic sepia picture unrelated to SalarySync, the lantern is cropped by the top edge into the nav, and a hard orange vertical light band cuts the left-centre. |
| ch4 Contact | 6 | **5.5** | The close-up exposes everything cheap: faceted coals, smoke wisp instead of flame, pillow tiles, flat relief slab, stray figurine bottom-left (~375,860). Still the ch0 shot, closer. |
| Mobile 390 | 4 | **4** | Unchanged problem: the coals sit directly behind the body copy (ch0) and behind the email/CTAs (ch4). The floor fills the bottom 40%. Scrollbar gutter visible at the right edge. |
| **Overall** | 4.5 | **5.5** | No more particle blobs anywhere, and ch3 now has a hero. But nothing is at reference level: aengel/SEED show one sharp, perfectly lit object in huge black negative space; we show busy, mid-fidelity clutter at mid exposure. |

**ITERATE** (overall 5.5 < 8.5; every chapter < 8).

## What changed since cycle 2
- `84b2641`: swarms disabled in about/experience/projects, embers constrained in ch0/ch4. Cycle-2 fix #1 landed: no blob in any chapter. But `SignalField.tsx:62` still loads `marble_bust_01.glb`, so the dead bust target code is still shipped.
- `c8e1a31`: flagstone hearth, ch3 painting with lantern, ch2 aged-metal scans, ch1 box furniture removed. ch3 lighting fix landed; ch1 and ch2 practical lights did not (both chapters are still lit by nothing).
- Not done: the flame (cycle-2 fix #3), the plinth/relief swap, ch4 reframe, mobile reframe, scrollbar, `THREE.Clock`.

## Top 5 reasons it still reads as slop

1. **The flagstone floor is now the loudest object, and it's the cheapest-looking one.** ch0/ch4: each tile is a soft rounded box about 80-120 px wide, with dark gaps as wide as grout trenches. The scale is wrong (each stone reads as roughly 1 m when the pit is about 1.2 m) and the tops are bevelled like pillows. It fills the bottom 45% of the frame at full warm exposure. The references keep the ground in shadow; ours lights it like the subject.
2. **The fire still doesn't burn.** ch4 centre: a grey smoke curl (`Fire.tsx` flipbook, Kenney sheet) above faceted black coals with a pink glow underneath. The off-white "rocks" ringing the pit in ch0 read like crumpled paper. A fire portfolio whose fire is a lamp is the single most noticed flaw.
3. **ch1 and ch2 have no lit subject.** ch1: the statue is ~10% luminance against ~5% background, on a smooth untextured pillar box (left-centre, 700-1000 px). ch2: the only bright object is the flat, matte, beige shield (790-930, 655-805), sitting right under the bullet list, plus white z-fighting/emissive shards at the right edge. Both chapters look unfinished next to ch3.
4. **Mixed fidelity is still in frame.** Photoscanned relief and lantern next to the bevelled toy flagstones, the smooth plastic orange plinth rim (ch0 ~820-1170, 515-640), untextured ch1 pillar, flat-backed relief slab (back edge visible in ch0 and ch4). The eye jumps between "scan" and "blockout" in every desktop shot.
5. **Composition: text collisions and repeats.** ch4 repeats ch0. Mobile ch0 coals under "agents finish a job", mobile ch4 coals under the email and CTA row. ch3 lantern clipped by the top edge behind the nav. Stray dark figurine at ch4 bottom-left. Visible 6 px scrollbar (`src/styles/index.css:157`) on every shot.

## Top 5 fixes, ranked by visual gain per hour

1. **Kill or darken the floor (≈45 min; ch0 +1, ch4 +1.5, mobile +1).** In the hearth scene (the `c8e1a31` flagstones): either swap to a flat Poly Haven floor texture at real scale (`cobblestone_floor_08` or `castle_brick_broken_06`, ~0.3-0.4 m stones, roughness + normal + AO, no geometric bevel) or keep the mesh and drop its albedo to ~25% with a radial falloff so only a 1.5 m ring around the pit catches the fire light. The ground should fade to black by mid-frame like the aengel water.
2. **Real flame (≈1 h; ch0 +1, ch4 +1.5).** Replace the Kenney smoke sheet in `Fire.tsx:15` with a real flame flipbook (e.g. a CC0 fire sprite sheet from OpenGameArt or the Unity/Godot CC0 fire packs, 8x8 frames), 2-3 crossed additive billboards ~0.6 m tall, colour `#ffd29a` core, sitting inside the coals. Drop blue-white embers; keep warm 1-3 px only. Re-export the pit from `compress_fire_pit.py` with the normal map kept to fix the faceted coals; recolour the off-white ring stones to the scan's original albedo.
3. **One practical light each for ch1 and ch2 (≈1 h; ch1 +1.5, ch2 +1.5).** Copy the ch3 lantern pattern (`ProjectArtefact.tsx:11,151`, Poly Haven lantern-chandelier + warm point light): ch1, a candle or lantern front-left of `gothic_statue.glb` (`Sanctum.tsx:7`) at `#ffb070`, intensity ~3, distance 4, so the face and folds read; texture or delete the pillar box. ch2, move the shield off the text column (to x > 1000 px) and swap it for a metal-read material (metalness 0.8, roughness 0.45) or a Poly Haven scanned shield; add one wall sconce on the right arch; find and remove the white shard planes on the right edge.
4. **Swap the cheap props by the fire (≈1 h; ch0 +0.5, ch4 +1).** Replace the smooth orange plinth rim with the same stone as the floor or hide it under the floor plane. Turn the relief slab 25-30° away so its cut back edge isn't visible, or replace it with a full-round CC0 scan. Delete the stray figurine (ch4 ~375,860; ch0 ~670,630).
5. **Reframe ch4, mobile and ch3 crops (≈45 min; ch4 +1, mobile +2, ch3 +0.5).** `chapterLook.ts`: ch4, a low angle across the coals toward the dark wall with the email over black, fire lower-right. Mobile (390): drop the camera target so the fire sits in the bottom 30% below the CTA row, and add a 0→70% black gradient behind the text block. ch3: lower the lantern ~0.3 m or tilt the camera down so it isn't clipped by the nav; soften the hard orange light band. ch3 painting: put the project's real screenshot on the canvas (`PAINTING_URLS` in `ProjectArtefact.tsx`) instead of a generic sepia painting, so the hero says something about SalarySync. Hide the scrollbar (`index.css:157`, `scrollbar-width: none`).

## Keep
- Typography, copy and left-column layout remain the best part of the site.
- ch3's lighting model (one warm practical above-front of one subject, everything else black) is the template. Copy it to ch1 and ch2, and push ch0/ch4 toward it by darkening the floor.

**Verdict: ITERATE** (overall 5.5; no chapter ≥ 8).
