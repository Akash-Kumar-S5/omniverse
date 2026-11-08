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
