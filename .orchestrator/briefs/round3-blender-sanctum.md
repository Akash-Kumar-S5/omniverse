# Brief: blender-sanctum, round 3 (author the sanctum in Blender)
Read first: `.orchestrator/research/3D-PLAYBOOK.md` section 3a and 7b, `.orchestrator/briefs/round3-contract.md`, `blender/scripts/smoke_bake_export.py` (verified headless bake + Draco export), `src/state/signal.ts`. Reference stills: `.orchestrator/reference/aengel-*.png` (mood only).
Worktree `.worktrees/blender-sanctum`, branch r3/blender-sanctum. Run `git merge --ff-only main` first. Blender 5.2.3 at /Applications/Blender.app/Contents/MacOS/Blender, headless only.

## Outcome
A brutalist concrete chamber, Pantheon-like: round oculus in the ceiling throwing ONE hard shaft onto a central plinth/pool; wet polished concrete floor; layered concrete walls with deep shadow; a side niche with pedestal for the bust; a corridor of 4 pillars/doorways (experience); a gallery of monolith slabs (projects); an open-roof area under night sky (contact). Textures: CC0 in `blender/textures/` (concrete_wall_003, concrete_floor_worn_001, marble_01). Cameras and anchors per the contract (names are law).

## Steps
1. Script the scene (`blender/scripts/build_sanctum.py`, reproducible, no manual GUI): modelling, materials, sun/oculus light, cameras `CAM_*`, empties `ANCHOR_*`.
2. **Cycles stills, one per chapter camera (boot_wide, boot_under_oculus, about_niche, exp_role_0, proj_gallery, contact_sky at minimum, 1600x900, 128+ samples, denoise)** to `.orchestrator/reference/r3-blender-<spot>.png`. STOP and report. The orchestrator will show these to Akash before you export. Do not export before you get a go.
3. After go: bake COMBINED (256-512 samples + denoise, margin 8+) into base colour, export `public/assets/models/sanctum.glb` (Draco, export_lights=False), `sanctum-lite.glb` (1k textures, same node names), `sanctum.spots.json`. Optimise locally with `npx @gltf-transform/cli`. Log new assets in CREDITS.md. Verify the GLB loads (a tiny three.js check script is fine) and report sizes.

## Rules
Keep outputs inside the repo. Never edit src/**. Co-Authored-By trailer, no push. Reply in 2 lines; report `.orchestrator/reports/round3-blender-sanctum.md`.

## UPDATE (agent is now kind claude Sonnet, with the blender MCP)
You drive the LIVE Blender (GUI listening on 127.0.0.1:9876) through the `blender` MCP tools; load them with ToolSearch first. Ask for nothing from Akash. Rules that still hold:
- Every modelling/material/light/camera step you run live MUST also be saved as a reproducible script in `blender/scripts/*.py` (the build must be re-runnable headless with `-b -P`). Save the .blend to `blender/sanctum.blend` (gitignore it if large).
- Render Cycles stills per chapter camera (via the MCP or the saved scripts) to `.orchestrator/reference/r3-blender-<spot>.png`. STOP after the stills and report. No GLB export until the orchestrator says go.
- Live viewport screenshots via MCP are for your own checking; only Cycles stills count for review.
- Do not read huge JSON/base64 into context; write files and refer to paths. Keep replies to 2 lines.
