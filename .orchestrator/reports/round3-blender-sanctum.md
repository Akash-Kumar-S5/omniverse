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
