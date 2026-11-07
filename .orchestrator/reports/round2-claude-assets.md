# round2 claude-assets — PARTIAL (session usage limit hit)
Files: public/assets/{hdri/studio_small_09_1k.exr, hdri/moonless_golf_512.hdr, models/marble_bust_01.glb, MANIFEST.md}, CREDITS.md
Works: 2 CC0 Poly Haven HDRIs (1.32 MB EXR + 0.42 MB HDR, HDR range verified) and the about object, a marble bust
GLB (0.68 MB, 17k tris, WebP textures, no Draco); loads in three GLTFLoader in node (all 3 maps present). Assets ~2.4 MB of 6 MB.
Known issues:
- gltf-transform could not run: npx fetch blocked by the permission classifier, and it isn't in node_modules. A local packer did the job (no Draco, so no decoder files needed).
- HDRI author names in CREDITS.md are from memory; check them on polyhaven.com (the bust author was checked through the API).
- NOT DONE: Outcome B copy rewrite (src/content profile.pitch/role, copy.ts, experience trim, project hooks); optional rock textures.
- npm run build / lint not run (no source changes made).
Requests: add @gltf-transform/cli as a devDependency or allow npx for it.
Commit: f6054f0 (assets batch 1)

## Author check (after ff-merge to main)
- Verified against api.polyhaven.com/info: studio_small_09 = Sergej Majboroda; moonless_golf = Greg Zaal; marble_bust_01 = Rico Cilliers. All match CREDITS.md, no changes.
- src/content not touched (reassigned to agy-type). Build exit 0, lint exit 0 on merged tree.
