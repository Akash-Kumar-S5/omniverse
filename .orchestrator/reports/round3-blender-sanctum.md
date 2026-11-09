# Round 3 report: blender-sanctum ("Ember & Ash")

Branch `r3/blender-sanctum`, rebased on main. Assets only: nothing modelled, no shaders written. The scene is the old layout turned into a ruined gothic hall.

## What changed
New `blender/scripts/sanctum_09_ruins.py`, run last by `build_sanctum.py`. It imports and places the CC0 GLBs from `public/assets/ruins`:
- `ruins-arch-gothic` replaces the 4 brutalist portal frames (one per role) and adds arches at the corridor mouth, hall mouth, between the slab pairs, the niche mouth, the court passage, and a far arch framing the court sky.
- `ruins-wall-hole` stands either side of the court entrance.
- `ruins-column-round` (two full, two short) stand in the rotunda.
- `ruins-bricks` rubble heaps sit at the arch feet.
- `stone_fire_pit` sits on the central plinth (centre 0,0, base z 0.42 Blender / y 0.42 glTF, scale 1.7, about 2.5 m wide).
- `altar-stone` and `candle-multiple` sit in the About niche, with 6 candle sets on the altar and bust pedestal and 6 around the plinth steps.
- `fire-basket` ×12 line the corridor and hall.
- `ruins-floor-squares` (46 tiles, 18-20% randomly left out) paves the rotunda and runs as a strip down the corridor, hall and court.

Stone pieces use the existing Poly Haven wall and floor materials. Layout, `sanctum.spots.json` and the node names are unchanged. The oculus, the slabs and the PROP_ rubble are kept.

## Lighting (baked)
The shaft is now cold (0.72, 0.82, 1.0). Warm point lights are baked on cold stone: hearth 300 W + 120 W, 12 basket lights at 70 W, 12 candle lights at 8-14 W. The `FIRE_*` lights are not exported, so the runtime still adds the live flicker. Flames themselves are not modelled. Runtime should place the flame and ember source at glTF (0, ~1.0, 0).

## Budget
`sanctum.glb` 2.33 MB (limit 4), `sanctum-lite.glb` 0.84 MB (limit 1). Bake: 256 samples, arch atlas 4096, floor atlas 4096.

## Evidence
`.orchestrator/reference/r3-ruins-ch0.png` to `ch4.png`, 1440x900, captured through REA `capture_browser_scenario` (headless Chrome, `?skipgate=1&chapter=N`, reduced_motion no-preference, never the gate). I served this worktree on `http://localhost:5197` because 5173 serves the main checkout and would show the old GLB. Interceptor is not installed on this machine, so I did not use it. 390px captures were not taken.

## Known issues / for the next pass
1. The corridor floor still reads near-white ("snow") in ch2 after one rebake with a darker floor tint (0.28). Either the bake is blowing out under the slit and basket lights, or runtime floor handling adds brightness. Next step: lower slit-light energy or compare the baked `floor.jpg` with the runtime view.
2. The Kenney kit GLBs (`altar-stone`, `candle-multiple`, `fire-basket`) reference `Textures/colormap.png`, which is not in the repo (they rendered magenta). They have plain stone, iron and wax materials instead. Dropping the real colormap in would restore the original colours.
3. The ch3 camera is close to the slabs, so the arches barely show there. ch4 (contact) frames only the oculus and sky, with no arch in shot.
4. Rotunda ch0 is dark by design. The hearth only shows in wider views (`boot_wide`).
5. The `sanctum.blend` file is a build artifact and is not committed. Rebuild: `build_sanctum.py`, then `FLOOR_PX=4096 Blender -b blender/sanctum.blend -P blender/scripts/sanctum_08_bake_export.py`.

## Props pass (direction 13:05)
`blender/scripts/sanctum_10_props.py` (after step 9). Lit by fire + moon only: the warm ceiling spots and the bust key spot are removed; fire lights sit at the pit, niche candles, corridor stands and court braziers; moonlight shaft and cool slit lights stay.
- ch0: knight beside the pit on the plinth (facing the fire), hearth logs + flame mesh in the pit.
- ch1: skull, two altar-candle clusters and a tall candelabra at the niche pedestal.
- ch2: greatsword, shield, greathelm, battleaxe, one per role, each on a stone stand right of its arch.
- ch4: two braziers (flame mesh) and tall candelabra flanking the court.
- Exports: sanctum.glb 2.91 MB, sanctum-lite.glb 0.99 MB. Evidence: `.orchestrator/reference/r3-props-ch0..4.png` (served from this worktree on :5197).
- Not placed: the hooded woman and the cloaked female knight statue (not in public/assets/props yet).
- Flame meshes and logs are baked static; the runtime flame/flicker still needs to be wired by agy-world.
- ch0 and ch4 cameras look up at the oculus/sky, so the knight, logs and braziers are out of frame there; the knight reads in the `boot_wide` still, not in the runtime ch0 shot. Camera framing is outside this lane.
- The knight is a T-pose figure (the pack has no pose), so it reads stiff.
- Candle wax is too bright (emission 2.5): worth halving next pass.

## Round 5 (critic cycle 1, fixes 2 and 4) on branch r5/blender-fire
- Fix 2: `src/scene/world/Fire.tsx` wires the Draco fire pit on the plinth, a 6-frame flame flipbook on a drei `<Billboard>` (plinth, plus the two court braziers in the contact chapter) and ONE warm `#ff8a3d` point light (7, distance 10, decay 2, +-15% flicker; it moves to the court for ch4). `World.tsx` now has one cold moon key `#9fb3d1` (30% of the old key intensity) plus a near-zero ambient; all per-chapter blue fills, candle lights and warm spots are deleted, and the warm point light in `ProjectArtefact.tsx` is removed. The `VolumeCone` spot is recoloured to the same cold moon.
- ch0 and ch4 are re-framed at eye level through the camera spots (`sanctum_05_cameras.py` -> `sanctum.spots.json`): boot_under_oculus (0.3,1.45,4.4)->fire, contact_sky is now a court view at the braziers. CameraRig/chapterLook/SignalField untouched.
- Fix 4: Kenney candles replaced by the Poly Haven `wooden_candlestick` scan (decimated to 2.5k tris); ch1 plinth/pedestal/altar use `castle_brick_broken_06`, the floor uses `cobblestone_floor_13` (box-projected with the existing anti-tile blend, no AO map shipped for it so a flat white is used); the regular floor-tile runner is gone. The pit is no longer baked (the runtime scan replaces it). Re-baked under fire + moon: sanctum.glb 2.62 MB, sanctum-lite.glb 0.89 MB.
- Evidence: `.orchestrator/reference/r5-blender-fire-ch0..4.png` (1440x900, ?skipgate=1&chapter=N).
- Known: ch2 and ch3 are now near black (the single fire light is at the plinth; the baked baskets only show through the dim runtime light), the ember helix is still agy-world's, the ch4 court shows one brazier at the right edge and the other behind the text, the knight reads as a stiff figure.

## Round 5 scans pass (branch r5/blender-scans, based on r5/agy-scans since main does not yet hold the scans)
- Removed: the armoured figure, greatsword, heater shield, greathelm, battleaxe and skull props. `sanctum_10_props.py` now places the scans: hooded mourner beside the pit with a low warm light, and on brick stands along the ch2 corridor one scan per role (sword, shield, sallet helmet, cuirass) with a warm accent plus a cool spot from the slit above. Scans bake into their own `sanctum_props` atlas (2048) so the scan detail survives; they are decimated to 3.5-7k tris each.
- ch0: the plinth ring is now dark weathered cobble stone (no polished coat). ch4: `contact_sky` is now a side view of the plinth fire at eye level, pit centre-right and large next to the copy; `Fire.tsx` no longer moves the light to the court and the court flames and sparks are gone. ch1: pedestal, altar and stands use `castle_brick_broken_06`.
- Exports: sanctum.glb 3.65 MB, sanctum-lite.glb 0.99 MB (the lite file needed `blender/scripts/shrink_lite.py`, which halves the props and pedestal textures after export).
- Known: the mourner scan is a standing relief panel, not a kneeling figure, so it reads as an upright icon beside the fire. The plinth still looks warm-peach at runtime because the fire light is strong on it. The ch2 props sit far down the corridor and are small and dark in the 1440 shot. The ember helix is still agy-world's.

## Round 5 scans2 (branch r5/blender-scans2)
- The "thin sliver" is the real shape of the asset: `statue-hooded-mourner.glb` is a flat bas-relief slab (front, side and top views checked in Blender: 0.27 : 1 : 0.13 w:h:d, flat back). A kneeling figure cannot come out of it without modelling, so it now stands as a carved stele 1.55 m tall, 1.5 m from the fire on the lit side, front turned to camera-left, with a low warm light under it. It reads as a whole figure in ch0 and ch4.
- ch2: the four scans (sword upright 1.3 m, round shield 0.95 m, sallet 0.55 m, cuirass 0.8 m) now stand on 0.75 m brick plinths 1.5 m ahead of each camera, right of centre, each with a 140 W warm accent and a 2500 W cool moon spot. `Sanctum.tsx` shows the baked `sanctum_props` mesh with emissive = its baked map (0.85), so the props stay lit in the dark corridor while the architecture still falls to black.
- ch4 camera moved back and left (-1.2, 1.35, 3.6) -> (-0.5, 0.95, -0.2) so the pit and the full stele sit centre-right beside the copy. Exports: sanctum.glb 3.80 MB, sanctum-lite.glb 0.97 MB (shrink_lite.py with LITE_PROPS=384). Evidence r5-scans2-ch0/2/4.png.

## Round 6 scenes (r6/blender-scenes)
- ch0/ch4: plinth step disc removed, hearth stone shrunk (r 1.08 to 0.98) and darkened; solid flagstones (floor-squares, cobblestone_floor_13 atlas) run up to it.
- ch3: painting is the hero, 6x scale, squared to the camera each frame, right-centre; lit by one flickering warm point light with the lantern chandelier scan hung above it.
- ch2: scan albedos desaturated and darkened in Blender (shield 0.22 sat / 0.5 value), job warm accents 95 W, props emissive 0.62; shield reads as aged metal, not flat orange.
- ch1: Kenney box altar deleted, brick pedestal tinted to grey stone; two altar candlesticks removed.
- Exports: sanctum.glb 3.87 MB, sanctum-lite.glb 0.997 MB (shrink_lite.py, LITE_PROPS=256). Evidence: .orchestrator/reference/r6-scenes-ch0..4.png.

## Round 7 scenes (r7/blender-scenes)
- ch0/ch4: bevelled floor tiles deleted; one flat cobblestone floor at 1.1 m tile, darker tint; oculus sun cut to 2.5 and hearth bake lights halved, so only a ~2 m ring around the fire catches light and the rest falls to black. Plinth is now a 0.34 m stone skinned with the floor material and hidden under the pit. The candlestick ring (the stray figurine in ch4) is gone. Mourner relief turned 28 deg. Pit albedo x0.5.
- ch1: wooden candelabra front-left of the statue plus one point light (#ffb070) exported inside sanctum.glb (KHR light, RAW candela) because the statue is a runtime model; niche-mouth arch pier (the black box) removed.
- ch2: shield is role 0, 2.5 m ahead of the camera and hard right (screen x > 1000 px), metallic 0.8 / roughness 0.45; wall sconce on the right arch (90 W); moon spots (source of the white patches at the right edge) removed.
- Exports: sanctum.glb 3.07 MB, sanctum-lite.glb 0.77 MB. Evidence: .orchestrator/reference/r7-scenes-ch0..4.png. Limits: the pit scan's own bowl top still glows peach under the fire light (runtime, in Fire.tsx); the shield albedo reads tan leather with a dark metal boss.

## Round 8 scenes (r8/blender-scenes)
- ch2: kite_shield scan (Poly Haven) on a 1.5 m brick pillar at screen x 1050-1170, y 440-700; torch sconce behind it; the stepped arch pier at x=-14 (the floating slab beams) removed; cuirass moved to the far end of the corridor, other stands hug the right wall.
- ch0/ch4: hearth-logs replaced by 4 crossed dry_branches_medium_01 scans (charred in the albedo); hearth stone shrunk to r 0.62 so no plinth rim shows; pit albedo ground disc darkened; relief turned the other way (-26 deg).
- ch1: wall tint 0.2/0.21/0.24 (near black); candelabra replaced by the candles-brass scan on a low stone; the RT light moved to the candles.
- sanctum.glb 3.06 MB, sanctum-lite.glb < 1 MB. Evidence r8-scenes-ch0..4.png.
- The ring boulders are the pit scan itself (its own Poly Haven rock texture); no extra rock asset was added.

## Round 9 scenes (r9/blender-scenes)
- ch0/ch4: plinth puck deleted; a squashed Poly Haven boulder scan (1.55 x 0.36 m, albedo darkened) is the pit base, so no peach band. Relief turned 28 deg toward the fire and its albedo pulled down.
- ch2: kite shield 1.3 m on a 1.5 m pillar, 2.7 m from the camera at screen x 1050-1280; a 700 W warm spot from the right wall is aimed at its face; torch prop kept.
- ch1: stepped block table deleted, candle cluster stands on the floor.
- ch3: the stray dot at ~(1025,768) is NOT in the baked mesh (no mesh or empty projects there; I raised the hall basket lights to 1.5 m anyway and the dot is unchanged), so it is a runtime element in src and needs the src lane.
- sanctum.glb 2.76 MB, sanctum-lite.glb 0.82 MB. Dev server for evidence ran on port 5211 and was stopped.

## Round 10 scenes (r10/blender-scenes)
- ch0/ch4: pale kindling replaced by 3 dead_tree_trunk_02 scans (charred); the loose pebbles and the tan disc under the pit are gone; 9 dark scanned rocks half-sunk (0.13 m) form a continuous ring; relief moved to (1.75,-0.2) so it is fully in the ch4 frame. Hearth lights raised and weakened so logs are not overexposed; the linked metal map on scanned props is now unlinked (it mirrored the fire and bleached them).
- ch2: shield albedo toned to mid-grey (sat .75 / value .5), wall spot cut to 260 W and moved to graze from the side, pedestal 1.75 m so its top shows at y~640, pedestal fill light; the small helmet under the body text removed.
- ch1: both foreground candelabras removed.
- sanctum.glb 2.54 MB, sanctum-lite.glb 0.81 MB. Evidence r10-scenes-ch0..4.png. Dev server (port 5211) stopped.

## Round 11 scenes (r11/blender-scenes)
- Pit: kept the scan's own dark boulders (albedo x0.35, ground disc x0.12 = dark ash), my ring is boulder-only and darker; the rock-moss pebbles are gone. Logs are flat charcoal (0.03). The pale crossed sticks still visible in ch4 are not the baked logs (those are now near-black); they appear to be a runtime flame element in Fire.tsx (not mine, not verified).
- ch2: shield albedo x0.4 (sat .7), spot 130 W; only the shield stands in the corridor so the small bright bust under the bullets is gone (verified in r11-scenes-ch2).
- ch0/ch4 relief: albedo x0.3, lit from the side at 45 W.
- ch1: bust pedestal is dark rough cobble stone (not brick), the five candlesticks and their lights are deleted, wall tint 0.12, key light 2.4. The pedestal height could not be cut by 25%: the runtime statue is fixed at y=1.25 in Sanctum.tsx.
- ch3: eight plaster backdrop planes (one per painting) added behind the frames; in r11-scenes-ch3 the backdrop reads almost black, so the effect is subtle.
- sanctum.glb 1.90 MB, sanctum-lite.glb 0.69 MB. Dev server on port 5211 stopped.

## Round 12 scenes (r12/blender-scenes) — before/after crops in .orchestrator/reference/r12-before-*.png and r12-after-*.png
- ch0/ch4 outer ring (scan_ring) deleted: ch0 x760-1260 y510-680 now plain dark floor (r12-before/after-ch0-ring).
- Pit sticks: a fast bake with the logs removed made the pale crossed sticks disappear, so they were the baked logs (even as flat 0.009 charcoal, roughness 0.9, they read blond: the props atlas islands of decimated meshes bleed). Logs removed; the pit is dark ash plus the flame planes.
- ch2 shield: albedo x0.35 (sat .6), spot 65 W; face is dark rust-bronze, darker than the body text (r12-before/after-ch2-shield).
- ch4 relief: albedo x0.15 and 25 W side fill; no longer cream (r12-before/after-ch4-relief).
- ch3: the 8 painting JPEGs flipped vertically (src untouched except ProjectArtefact pointLight 4.5 -> 3.15, -30%); the painting reads upright (r12-before/after-ch3-painting).
- Not done (not in my files): the red glow rectangle and ember size live in Fire.tsx.
- sanctum.glb 1.78 MB, sanctum-lite.glb 0.53 MB. Dev server on port 5211 stopped.

## Round 13 scenes (r13/blender-scenes) — swap the subject
- ch0/ch4: Fire.tsx now loads fire_barrel.draco.glb (Poly Haven barrel_stove, one object, dark albedo, 0.80 m across x 0.81 m tall, base on the floor); flames re-seated at y 0.52 (1.0 m tall, lite 0.86), light at y 1.0. No rocks, logs or pebbles remain. A near-black occluder inside the barrel footprint throws a contact shadow into the baked floor. Verified in r13-scenes-ch0 / ch4.
- ch2: the shield is gone. The subject is the scanned woven cuirass (src/scene/world/HeroArmour.tsx, full-detail runtime mesh) on a dark stone stand, dark albedo (x0.5), one warm practical; nothing else lit. The first pick, helmet-sallet-scan, turned out to be a lion-head mask with red cloth and two rods, so it was dropped. Verified in r13-scenes-ch2.
- Not verified: no mobile shots this round.
- sanctum.glb 1.75 MB, sanctum-lite.glb 0.52 MB. Dev server (port 5211) stopped.

## Round 14 scenes (r14/blender-scenes)
- ch4: ONE subject, the scanned relief, upright on the floor right of centre with a baked contact shadow, lit by the barrel's point light; Fire.tsx hides the barrel and flame cards at ch4 (the light stays); CameraRig contact camera moved (landscape and mobile). Mobile 390: relief top ~60 px below the GitHub/LinkedIn row. Shots r14-scenes-ch4 and r14-scenes-ch4-390.
- ch0: relief moved 0.55 m left, right edge ~1290 px, standing on the floor with its shadow (r14-scenes-ch0).
- ch3: chain of 22 links runs from the lantern to the top of frame; alternate links are edge-on so it reads as a dotted chain (r14-scenes-ch3).
- ch2: cool rim light (#8fb0ff) behind and above the cuirass; stand is still a textured block, no Poly Haven plinth model exists; ch1 plinth unchanged (r14-scenes-ch2).
- sanctum.glb 1.76 MB, sanctum-lite.glb under 0.6 MB. Dev server (port 5211) stopped. The CameraRig contact case was edited in addition to chapterLook (the ch4 framing lives there, not in chapterLook.ts).

## Round 15 scenes (r15/blender-scenes)
- ch4 desktop: barrel + real flame are the subject again, seen from a low side camera (rim edge-on, interior hidden); relief behind, dark (albedo x0.07, no extra fill) but still catches the fire light (r15-scenes-ch4).
- Floor ellipse: it was the oculus sun (SUN_shaft) baked into the lightmap; sun set to 0, the floor is baked with the fire points only. Crops r15-floor-crop-ch0.png and r15-floor-crop-ch4.png show a soft falloff and no edge.
- Mobile 390: ch0 and ch4 use one portrait camera (pos -4.4,0.9,5.2 / look 0,3.0,0 / fov 62): barrel, flame and relief fully in frame, flame top ~100 px below the link row, ~100 px of floor under the barrel (r15-scenes-ch0-390, ch4-390). The first try at 8 m put the camera inside a wall pilaster (black frame); r = 6.8 m fixes it.
- ch2: the #8fb0ff rim sits behind the cuirass at half strength (1.7), stand darker (r15-scenes-ch2). ch3: 64 small links (about 1/3 size) run to the lantern finial (r15-scenes-ch3).
- Edited: Fire.tsx (contact guards and mobile offset removed), CameraRig.tsx (contact + portrait boot), HeroArmour.tsx, ProjectArtefact.tsx. Dev server 5211 stopped.

## r17 Lane A (fire, ch0 + ch4)
- Dot ring source: the barrel scan's air-intake holes at the base, where fire light lit the interior and showed through as hot dots. Rivet specular was not the cause. A black unlit open liner (r 0.37, h 0.26) now sits behind the holes.
- Barrel material pinned matte (metalness 0.25, roughness 0.78, scan maps dropped); key light lifted to y 1.4, mouth light dropped to y 0.66.
- Flame cards 1.6x taller (and ~1.3x wider); floor-pool lights -15% (main 8.5 to 7.2, mouth 3.2 to 2.7).
- Proof: `.orchestrator/reference/r17-blender-scenes-ch{0,4}-{1440,390}.png`. Lighting references: `ref-threejspunk.png`, `ref-rottensouls.png` (title gate only; the in-game scene did not load headless).
- Embers already spawn at y 0.65 (World.tsx), unchanged. Build, tsc and eslint clean.

## r18 Lane A (fire seat + light hierarchy, desktop)
- Flame: card widths 0.9-1.15 m (base ~45% of the mouth in the crop, short of the 60% target), stack sunk 3 cm, yaws 0/55/115 deg, softer radial alpha falloff (existing mask, no new shader).
- Embers: start y 0.70 (5 cm inside the rim) and spawn radius 0.35 (World.tsx, two constants).
- Barrel: the scan's rust and roughness maps are back (r17 had dropped them; the hot base dots were the air holes, which stay lined); colour x1.5, metalness factor 0.35, roughness factor 1. New short warm light (r 1.3 m) at rim height on the camera side lights the top third.
- Relief: baked prop glow 0.62 to 0.22 (~0.35x) on ch0 and ch4 only (Sanctum.tsx). It reads dimmer than the barrel on ch0; on ch4 its lit face is still close to the barrel's.
- Proof: `.orchestrator/reference/r18-blender-scenes-ch{0,4}-1440.png` and `r18-blender-scenes-ch4-crop-flamebase.png`.
