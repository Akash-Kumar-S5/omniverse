# R3 asset picks (copilot-review), text-only check of r4/agy-assets `r3-asset-candidates.md`
Checked against ROUND-3-DARK-FANTASY.md (assets-only override: CC0/CC-BY, no FromSoftware source or imitation, <=4 MB total, lite <=1 MB). Evidence: Poly Haven API (`/info`, `/files`), the Quaternius pack page, the Kenney mirror's GitHub contents API. No downloads, no images.

## Verification
| # | Candidate | Licence | FromSoft clean | Size vs candidate report | Notes |
|---|---|---|---|---|---|
| 1 | Quaternius Ultimate Modular Ruins | PASS, CC0 on the pack page (90 models) | PASS | UNVERIFIED | Pack page lists FBX, OBJ and Blend, not GLB, so the report's "GLB ~40-180 kB/piece" is unconfirmed. Needs Blender import and GLB export, which the override allows. The Google Drive mirror may need a login; the pack's own Download button is the safer route. |
| 2 | Kenney Castle Kit | PASS, CC0 (Kenney) | PASS | Plausible (tiny low-poly GLBs, shared textures) | `tower-square-arch`, `stairs-stone`, `door`, `gate` exist in the mirror (`shorepine/kenney`); `wall-doorway.glb` and `wall-pillar.glb` were not seen in the first 60 files. Prefer the official kenney.nl zip. |
| 3 | Kenney Modular Dungeon | PASS, CC0 | PASS | Plausible | `corridor`, `corridor-wide`, `gate`, `template-wall` all exist. |
| 4 | Poly Haven Gothic Statue | PASS, CC0 | PASS (robed, veiled, crowned figure with chains, book and sword; generic fantasy, not a game item) | FAIL as written | Report says 912 kB geometry plus ~2.1 MB textures and credits Rico Cilliers. The API gives 912 + 1065 + 1037 + 961 kB, about 3.97 MB at 1k (it alone fills the budget), and the author is Benny Weimer. Fix the CREDITS entry. Needs texture downscale or recompress. |
| 5 | Poly Haven Stone Fire Pit | PASS, CC0 | PASS | Roughly right | API: 96 kB bin plus ~2.44 MB textures, about 2.5 MB at 1k. Author is Sebastian Platen, not "Poly Haven". Downscale textures to hit lite. |
| 6 | Kenney Graveyard Kit | PASS, CC0 | PASS | Plausible | `fire-basket`, `candle-multiple`, `altar-stone` exist. Kit also contains skeleton/vampire/zombie characters; skip those. |

Two caveats on the list: (a) the report's Kenney "direct download" is a third-party mirror, and I did not verify the mirror's own licence, only that the filenames exist; use kenney.nl. (b) No item is a complete ruined cathedral, so the Quaternius pack (#1) is the only real ruin source.

## Ranked recommendation (best 3)
1. **Quaternius Ultimate Modular Ruins (CC0)**: the only true ruin kit (broken arches, pillars, vault, rubble), so it carries the hall shell; convert and export only the pieces used to stay in budget.
2. **Poly Haven Stone Fire Pit (CC0, Sebastian Platen)**: the central hearth and ember source; it is about 2.5 MB at 1k, so downscale textures to 512 (roughly 0.7 MB) and place a flickering point light on it.
3. **Poly Haven Gothic Statue (CC0, Benny Weimer)**: a realistic stone guardian that replaces the About bust; at about 3.97 MB at 1k it must be downscaled (roughly 1 MB) and it cannot ship at 1k beside the others.

Backup: Kenney Castle Kit (small, verified GLBs) if Quaternius conversion stalls; its flat low-poly look will clash with the photogrammetry statue and fire pit. Estimated total for the three, after downscaling, is about 3 MB (ruins portion unverified), inside the 4 MB budget but not the 1 MB lite budget; lite needs a decimated variant.
