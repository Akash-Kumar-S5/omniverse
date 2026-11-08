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
