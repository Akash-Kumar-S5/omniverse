# round3 blender-sanctum — stills stage (NO export yet)
Status: sanctum built in live Blender via scripts; Cycles stills rendered. Waiting for orchestrator go before bake/export.

## Scripts (blender/scripts/, re-runnable headless with -b -P)
sanctum_lib.py, sanctum_01_shell.py, _02_props.py, _03_materials.py, _04_light_world.py, _05_cameras.py, build_sanctum.py (runs 1-5, saves blender/sanctum.blend, gitignored), sanctum_06_render_stills.py (-- spot...; env SAMPLES/RES_PCT/OUT).
Contract names present: CAM_<spot> x17 (boot_wide, boot_under_oculus, about_niche, exp_role_0..3, proj_gallery, proj_0..7, contact_sky), TARGET_<spot>, ANCHOR_core/bust/helix/glyph/beacon.
Layout (Blender Z-up): rotunda r9 h12 (oculus r2.2 offset y=-1.5 so the 7deg-tilted sun lands on the plinth), E niche+pedestal (bust), W corridor with 4 portal frames, N gallery with 8 monolith slabs, S gateway to open-roof court (night sky dome).

## Stills (1600x900, 128 spl, denoise): .orchestrator/reference/r3-blender-{boot_wide,boot_under_oculus,about_niche,exp_role_0,proj_gallery,contact_sky}.png

## Morph feedback applied
1 textures: box projection, tile 0.6-0.7 m (was 2.5-3 m), diffuse contrast flattened toward grey, cooler tint; 2 plinth: polished dark concrete + coat (not marble); 3 bust: BUST_key warm spot + BUST_rim cool spot; real marble_bust_01.glb imported as preview (not exported); 4 haze: a true World volume made Cycles attenuate the sun to zero (infinite path), so it is a bounded VOL_air box (0.004) + denser VOL_haze in the rotunda; shaft now reads. VOL_*, SKY_dome, SUNBLOCK_court, BUST_* are preview-only, excluded from export.

## Reused vs built
Reused: blender/textures (Poly Haven CC0), repo marble_bust_01.glb, smoke_bake_export.py pipeline, Cycles/AgX, Blender's Voronoi for stars.
Poly Haven props (enabled via scene.blendermcp_use_polyhaven=True): boulder_01 x4 (corridor rubble), bronze_whale_statue (gallery end), sources in blender/props (gitignored), step sanctum_07. Logged in CREDITS.md. Also reused: marble_bust_01.glb as preview bust.
Built from scratch: architecture shell (as instructed), lights, cameras.

## Known issues / next
Corridor + gallery lit by area lights in the ceiling slits (fake sky fill); both read flat-ish at the far end. Wall tile pattern is visible on the court walls. Floor reflection is Cycles-only; runtime uses the reflector. Bake step (UV unwrap, combine into sanctum_architecture, export) not started.

## EXPORT (after go) — public/assets/models/
sanctum.glb 1,218,832 B (3 JPEG atlases: arch 4096² 984 KB, floor 2048² 128 KB, pedestal 512² 15 KB) | sanctum-lite.glb 302,616 B (1k/1k/256 same maps downscaled, same node names) | sanctum.spots.json 2.8 KB. Total high 1.22 MB (<= 4 MB).
Nodes: sanctum_architecture (19.7k verts, boulders decimated 66k->2.5k tris each, props + slabs + frames + plinth + court roof joined), floor, bust_pedestal, oculus_shaft (empty at (0,12,1.5) glTF, radius 2.2) with child shaft_axis (unit direction of the sun, glTF (0,-0.993,-0.122)).
Bake: Cycles COMBINED 256 spl, margin 8 (extend), AgX + exposure baked in, VOL_*/haze not baked. Materials: baseColor = emissive = baked map, roughness 1, extras {toneMapped:false}: runtime should render them unlit with material.toneMapped = false (colour is already tonemapped), swap `floor` for the reflector. Draco level 7 (Draco decode verified via gltf-transform inspect).
Spots: 17 cameras (glTF Y-up, TARGET_ empties as targets, vertical fov deg) + 5 anchors. Re-run: build_sanctum.py then sanctum_08_bake_export.py (~25 min bake on this Mac). Final tweak round (contact_sky roof, softer moon, slab material) is in the export; stills for those two cameras re-rendered after export.
