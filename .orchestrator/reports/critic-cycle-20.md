# Critic cycle 20 (main @ 93055ed: r26 merged, effigy hotfix, ch0 effigy warm + repositioned, ch2 armour turn / stand / key+rim / copy halo). DESKTOP ONLY

## Method

Build: `npm run build` passed (chunk-size warning only).
Preview: `vite preview --port 4470 --strictPort` (pid 11790). Killed by pid after the shots; lsof confirms 4470 is free. Ports 5173 and 5197 were not touched.
Shots: Playwright Chrome (MCP, real GPU). Each shot used a fresh browser context with a fresh page, `?skipgate&chapter=N`, and a 16 s settle.
- `.orchestrator/reference/critic-c20-ch{0..4}-1920.png`: 1920x1080, DPR 1
- `.orchestrator/reference/critic-c20-ch{0..4}-1512.png`: 1512x982, DPR 2

**Runtime gate, checked first: 0 console errors and 0 page errors on all 10 loads.** Each load logged one warning, the `THREE.Clock` deprecation.
Canvas sizes: 1920x1080 on every chapter at 1920; 2268x1473 on every chapter at 1512 (the DPR floor held).
This build is unpatched main, so the c19 crash is gone.
Coordinates below are CSS px at 1920 unless noted.

## Scores (worse of two sizes)

| Chapter | c19 | 1920 | 1512 | **c20** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.4 | 8.5 | 8.5 | **8.5** | The effigy is now warm stone and reads as a recumbent figure on a slab beside the barrel (x 850-1190, y 680-780). The green lump is gone. The flame now sits seated in the barrel. The bottom ~30% is still empty floor. A small black silhouette at the barrel's foot (x 1205-1230, y 700-770) reads as debris or a stray figure. |
| ch1 About | 8.5 | 8.5 | 8.5 | **8.5** | No change from r26. The plinth is still clay/mud. The room-corner diagonal at bottom right (x 1480-1920, y 880-1060) is a little more visible than in c19. |
| ch2 Work | 7.7 | 8.0 | 8.1 | **8.0** | A big step up. The warm key and rim now model the breastplate, so it reads as aged bronze armour. The heavier stand grounds it, and it is clear of the copy at both sizes (≈80 px at 1920, ≈75 css px at 1512). Still visible: the ragged neck rim (x 1440-1650, y 195-300), the torn left armpit (x 1330-1400, y 560-640), a floating strap tab (x 1540-1630, y 385-415), and no contact shadow under the feet. The front foot crops the frame bottom at 1920 (y ~1040). |
| ch3 Projects | 8.4 | 8.4 | 8.4 | **8.4** | No change from r26. The hard vertical wall band is still there (x 1120-1190), the lantern still reads as a jewel pendant, and the floor diagonal remains at bottom (x 1200-1300, y 990-1080). New at 1920: a faint circular ghost ring behind the pager (x 130-380, y 790-950), probably a fog/sprite or bloom artefact. It is not visible at 1512. |
| ch4 Contact | 8.3 | 8.4 | 8.4 | **8.4** | The effigy behind the barrel is now warm stone instead of a yellow-green blob. The left smoke lobe still reads as a ghost face (x 1090-1180, y 440-560). The rim ring still has no flame root. The barrel's bottom band turns cold blue-grey with rivet noise (x 1060-1350, y 870-935). |
| **Overall** | 8.3 | | | **8.4** (mean 8.36) | Both r26 lanes landed and helped. ch2 cleared 8 for the first time. |

**NOT SHIP / ITERATE.** Overall is 8.4, under the 8.5 bar. No chapter is under 8 (ch2 is at 8.0, exactly on the line).
The fastest path to 8.5 is +0.1 on any two of ch2, ch3 and ch4. ch3 and ch4 got no lane in r26, and their defects are small and well localised.

## Top defects per chapter (lane-sized fixes)

### ch0 Hero (8.5)
1. **Stray black silhouette at the barrel foot** (x 1205-1230, y 700-770). Find the mesh (probably an effigy-scan fragment or a leftover prop) and delete or hide it. *S lane.*
2. **The bottom ~30% is empty floor.** Lower the camera look target ~0.2 m, or move the fire group ~0.3 m toward the camera. *S lane (ChapterLook ch0).*
3. **Ember speckle** (carried c19 partial). Vary ember size 1-4 px and brightness ±40%. *S lane (Embers/SignalField).*

### ch1 About (8.5)
1. **The plinth reads as clay.** Halve the bump/normal strength, and add a chamfered cap slab (~4 cm, slightly lighter stone). *S lane.*
2. **The corner diagonal at bottom right.** Add more fog density at the far right, or end the floor plane before the wall corner. *S lane.*

### ch2 Work (8.0, the line-holder)
1. **Neck rim / armpit tears.** Add a dark gorget cap mesh over the neck opening, or drop the camera ~5° so the neck hole falls into self-shadow. Hide the armpit tear with a further ~10° turn or a small pauldron fill. *M lane.*
2. **No contact shadow under the stand** (cross-vendor flagged in c19 and again in c20). Add a soft radial AO decal under the feet (opacity ~0.6, radius = foot span). *S lane.*
3. **Floating strap tab** (x 1540-1630, y 385-415). Darken it or remove the scan islands. *S lane.*
4. **The front foot crops the frame bottom at 1920.** Lift the camera target ~0.05 m, or pull the stand back 0.1 m. *S lane.*

### ch3 Projects (8.4; no lane in r26)
1. **Vertical wall band** (x 1120-1190, carried from c17). Fade it with a fog card in front of that wall segment, or remove the segment. *S lane.*
2. **The lantern reads as a jewel.** Scale it ~1.5x and add a point light (#ffb060, distance ~1 m) so it lights the frame top. *S lane.*
3. **Ghost ring behind the pager** (x 130-380, y 790-950, 1920 only). Identify it (a fog sprite or bloom on an off-screen light) and clamp or move it. *S lane.*
4. **Floor diagonal at bottom.** Fog it or end the floor earlier. *S lane.*

### ch4 Contact (8.4; no fire lane in r26)
1. **Flame root / rim ring** (c19 ch0 #3 + cross-vendor accept). Seat the flame base ~3 cm inside the barrel and add a glowing coal disc at the rim, so the bright ring reads as heat, not a sticker. *S lane (FirePit; fixes ch0 as well).*
2. **Ghost-face smoke lobe** (x 1090-1180, y 440-560). Cut the outer shell's opacity on the left by ~50%, or re-seed its noise offset. *S lane.*
3. **Cold blue-grey barrel base** (x 1060-1350, y 870-935, cross-vendor accept). Warm the base albedo and lower its roughness/normal noise, or add AO so it falls into shadow instead of turning blue. *S lane.*

## Cross-vendor check (advisory; the critic score above stays the gate)

`bun tools/or-vision-review.ts` on the five 1920 shots. The model was `nvidia/nemotron-3.5-super-vl:free` for all five. The key was never printed.

**Tool bug found:** the first run crashed with `EPROTO: TLS handshake failed` on the ch2 request after ch0 and ch1 had answered. `fetch` is not wrapped in try/catch, so the crash also skipped the `openrouter-usage.json` write, and those 3 requests were never counted. I retried ch2-ch4 successfully. The counter reads 9/40 for today, but the true count is ~12.
**Fix (S lane, tools):** wrap the fetch in try/catch and treat a throw as a model failure. Write the usage file after each request, not only at the end.

As in c19, the model's coordinates are on a downscaled frame, and its absolute scores are harsher than mine and uncalibrated (3-7). The contrast figures are the c19 measurements (body 16-17:1, labels 6.6:1, nav 14.8:1). ch2's copy only got lighter in r26.

| Shot | OR score | Defects it flagged that I did not | Verdict |
|---|---|---|---|
| ch0 | 7 | Effigy "flat, poorly integrated with the lighting" | **Partial**: it is warm-lit now, but it is low relief with no contact shadow on the floor. Fold it into ch0 with a small AO decal under the slab. |
| | | Sparks are a 2D overlay without depth | **Partial**: same as the c19 ember-speckle partial (ch0 #3). |
| | | Nav low contrast | **Reject**: measured 14.8:1. |
| ch1 | 6 | Labels illegible | **Reject**: measured 6.6:1 (AA). |
| | | Statue is a flat cutout with no grounding | **Reject for the statue**: it sits on the plinth and is lit by the key. The plinth-to-floor join is fogged, which is a taste call. |
| | | Body crushed under the headline | **Reject**: there is a ~45 px gap and a deliberate indented column. |
| ch2 | 5 | Body/location text faint | **Reject**: the card is ≥16:1 and r26 lightened it further. |
| | | Experience list orphaned from the content column | **Reject**: it is an intentional master/detail layout. |
| | | Prop has no floor contact or shadow | **Accept**: the c19 accept is still unfixed and is now ch2 #2. Already priced into 8.0. |
| ch3 | 3 | Body copy low contrast | **Reject**: measured 9.1:1. |
| | | Frame grainy / noisy | **Partial**: the carved frame is fine, but film grain is heavy on the warm wall behind it. If anything, drop grain ~20% on this chapter. Low priority, no score change. |
| | | Pagination cluttered | **Reject**: the dashes are a consistent progress indicator, and the spacing is even. |
| ch4 | 7 | Bottom-left timestamp illegible | **Reject for this cycle**: it's the site-wide locale clock and was out of scope in c19. It's worth one contrast measurement next cycle. |
| | | Hard edge on the left where the environment cuts to black (≈ x 860-1060) | **Reject**: no hard edge is visible at either size. There is a faint pillar base at x 890-910, y 745-815, but it is not a seam. |
| | | Barrel base noisy, loses material definition | **Accept**: I had seen the cold blue band, and this confirms it. It is ch4 #3. |

Net: 1 new accept (ch4 barrel base), 1 re-confirmed accept (ch2 contact shadow), and 3 partials (ch0 effigy AO, ember depth, ch3 grain). No score changes.

## Keep
- 0 console errors on unpatched main, across all 10 loads. The effigy material fix holds.
- ch0/ch4 effigy as warm stone. It finally belongs in the firelight.
- ch2's warm key + rim and the heavier stand. They are what lifted ch2 past 8.
- The DPR floor (2268x1473 everywhere), the ch3 chain hang, the ch4 flame cap, and the glow-disc removal.
