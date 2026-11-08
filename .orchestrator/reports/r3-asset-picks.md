# R3 asset picks (copilot-review), revised scope: no licence gate
Criteria per Akash: visual fit (gothic ruin, firelit hall), three.js GLB readiness, size <=4 MB total, nothing from or imitating FromSoftware games. Source and author are listed so CREDITS.md can cite them. Text-only; no downloads. Sizes from Poly Haven's API, others from the candidate report (unverified unless stated). Basis: `r3-asset-candidates.md` on r4/agy-assets.

## Ranked picks
1. **Quaternius Ultimate Modular Ruins**, https://quaternius.com/packs/ultimatemodularruins.html, author Quaternius. Best visual fit: the only real ruin kit (broken arches, pillars, vault, rubble), so it builds the hall shell. Readiness is the weak point: the pack page lists FBX/OBJ/Blend, not GLB, so it needs a Blender import and GLB export of only the pieces used; size is unverified (report claims ~2.5 MB assembled), so keep a small piece list.
2. **Poly Haven Stone Fire Pit**, https://polyhaven.com/a/stone_fire_pit, author Sebastian Platen. Ready-made glTF with the hearth look and an obvious ember and point-light anchor. About 2.5 MB at 1k (96 kB bin plus ~2.4 MB textures), so downscale textures to 512 (roughly 0.7 MB) to leave room for the rest.
3. **Poly Haven Gothic Statue**, https://polyhaven.com/a/gothic_statue, author Benny Weimer. Strong focal object for the About niche (robed, veiled, crowned figure with chains, book and sword; reads as generic fantasy, not a game item). glTF-ready but about 3.97 MB at 1k, so it must be downscaled to ~1 MB or it blows the budget by itself.

Backup: **Kenney Castle Kit**, https://kenney.nl/assets/castle-kit, author Kenney. Native GLBs and tiny (verified filenames on the `shorepine/kenney` mirror, e.g. `tower-square-arch`, `stairs-stone`, `gate`), but flat low-poly, which clashes with the photogrammetry pieces. Use it only if the Quaternius conversion stalls.

## Budget
After downscaling, the three come to roughly 3 MB (ruins portion is an estimate), inside 4 MB. The lite target (<=1 MB) needs a decimated or reduced-piece variant.

## Corrections for CREDITS.md
The candidate report credits the statue to Rico Cilliers and the fire pit to "Poly Haven". The API says Benny Weimer and Sebastian Platen. Its Kenney "direct download" is a third-party mirror, so cite kenney.nl.
