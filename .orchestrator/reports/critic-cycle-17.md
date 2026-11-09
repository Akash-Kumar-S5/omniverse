# Critic cycle 17 (main @ a112567: r21 flame, r21 blender-plinth, r20 ch2 rim, r20 ch3 backing, r22 ch2 plinth merged). DESKTOP ONLY, FULL SCREEN

Build: `npm run build` passed, with only the chunk-size warning.
Preview: `vite preview --port 4400 --strictPort`. Killed by pid after the shots; lsof confirms 4400 is free.
Shots: Playwright Chrome, real GPU. Each chapter got a fresh page and a 16 s settle, in two contexts:
- `.orchestrator/reference/critic-c17-ch{0..4}-1920.png` at 1920x1080, DPR 1
- `.orchestrator/reference/critic-c17-ch{0..4}-1512.png` at 1512x982, DPR 2 (3024x1964 px)

Coordinates are CSS px for that size; for the 1512 shots, double them to get file pixels.
Console: 0 errors and 1 warning per load (the `THREE.Clock` deprecation, unchanged).
References: aengel.io, landing.love, threejspunk and rottensouls, from the c12/r22 captures.
Each chapter is scored as the WORSE of the two sizes.

## Scores

| Chapter | c16 | 1920 DPR1 | 1512 DPR2 | **c17 (worse)** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 7.8 | 8.4 | 8.3 | **8.3** | Big gain: the flame is smooth, with a white-hot core, no stair-steps at 2x, and embers at both sizes. Left: it's a thin candle wisp on a barrel, with no halo on the wall, and the bottom 45% is empty floor. |
| ch1 About | 8.2 | 8.3 | 8.3 | **8.3** | The base now clears the frame at 1512 (y≈890). The plinth still reads as mud, the statue's base overhangs the plinth top, and the room corner line is still visible. |
| ch2 Work | 7.5 | 7.4 | 7.1 | **7.1** | Regression. The camera is now so tight that the plinth bleeds off the bottom at both sizes and off the right at 1512. The new plinth is a cool-grey, self-lit bevelled concrete box. |
| ch3 Projects | 8.1 | 8.3 | 8.3 | **8.3** | Gain: the stepped pool and the backing card are gone. Left: the frame floats unhung under a dark lantern, and the left wall edge is a hard vertical band. |
| ch4 Contact | 7.6 | 8.1 | 8.0 | **8.0** | The flame core is excellent. Its outer tongues are a broad, flat, translucent beige card (they read as cloth or smoke, not fire), and the wall behind gets no glow. |
| **Overall** | 7.8 | 8.1 | 8.0 | **8.0** | The fire is fixed (the c16 #1 drag is gone). ch2 is now the single blocker. |

**ITERATE** (overall 8.0 < 8.5; ch2 at 7.1 is below 8. Every other chapter is at 8.0 or above).

## Breaks at only one size

- **1512 only: ch2's plinth exits the right edge.** At 1512 the top face runs from x≈845 to the edge at 1512, and the cuirass's right shoulder sits at x≈1115 of 1512. At 1920 the plinth ends at x≈1855, with 65 px of air. **The plinth exits the bottom at BOTH sizes** (1920: y 840→1080; 1512: y 600→982), so there's no floor contact in either.
- **1512 only: the ch4 flame dominates.** Its broad side tongues (1512: x 635-870, y 230-450) fill about 15% of the frame and crowd the "Say hello." line. At 1920 they're proportionally smaller (1015-1350, 300-630).
- **Both sizes, ch4 and ch0: a faint vertical warm patch on the right wall** (1920: x 1680-1760, y 500-800; 1512: x 1100-1150, y 330-520). It looks like a light leak or the edge of a stray object. It replaces last cycle's 1920-only sliver, so the c16 stray is gone.
- No size-specific breaks on ch1 or ch3. The ch1 base-crop fix holds at 1512.

## Top 5 reasons it still reads as slop

1. **ch2 is cropped and the plinth looks like CG concrete** (`critic-c17-ch2-1512.png`, whole right half). The r22 commit `0cc93c8` swapped the dark stand for a `RoundedBox` with `color #777a7d`, `emissive #5e6062` and `emissiveIntensity 0.2` (`HeroArmour.tsx`). It self-illuminates as a cool, neutral grey with a clean CG bevel, in a warm firelit world. The block now fills about 30% of the frame and runs off two edges, the cuirass is large and pressed against the right edge, and the cuirass is still lit flat from the front (no visible rim on its left edge, 1920 x≈1270).
2. **The ch4 flame's outer layer is a flat translucent card** (1920: 1015-1350, 300-630). The inner sheet (new soft sprite) is right. The outer billboard reads as beige cloth: low saturation, wide, and planar, with hard silhouette lobes and no orange or red gradient toward the tips. ch0's flame is a single thin wisp, so the same fire looks different in ch0 and ch4.
3. **No firelight reaches the wall** (ch0 and ch4). Behind the barrel, the back wall at ch4 (1920: 900-1600, 100-500) is pure black, and the floor pool is the only bounce. In rottensouls, firelight paints the stone behind the fire. Here the flame looks composited onto black.
4. **ch3's frame floats.** The chain and lantern end at y≈345 (1920) and the frame starts at y≈410, with nothing hanging the frame. The lantern is still a dark silhouette that doesn't read as the light source (c16 #4c, not done). There's also a hard vertical light/dark wall boundary at x 1120-1190 and a diagonal floor line at bottom (1210-1320, 990-1080).
5. **ch1's plinth is a mud block, narrower than the statue's base** (1920: the statue base spans 1090-1460, the plinth top 1150-1415). The statue's base overhangs on both sides, which reads as a scale error. The texture is still crumbly clay, and the room corner at bottom right (1500-1920, 870-1080) still shows as a box edge.

## Top 5 fixes, grouped per chapter (parallel lanes)

### Lane A: ch2 reframe and plinth (`HeroArmour.tsx`, the ch2 spot `exp_role_0` in the camera anchors / `CameraRig.tsx`, `World.tsx` ch2 lights; owner: agy-world)
1. **Pull the camera back and kill the grey self-glow (≈25 min; ch2 +0.8, the one SHIP blocker).**
   - Dolly the `exp_role_0` camera back about 25%, or cut the group scale about 20%, so at 1512 the whole plinth sits inside x ≤ 1440 and its base sits at y ≤ 900 with floor visible. Target the cuirass centre at about x 72%, y 45% of the frame at both sizes.
   - On the `RoundedBox`, remove `emissive`/`emissiveMap` (set `emissiveIntensity 0`), set `color` to a warm dark stone (about `#3a2f27`), and cut the bevel radius to 0.008 so the edge isn't a CG fillet. The plinth's mean luminance should be at most 0.4× the cuirass's.
   - Raise the r20 rim spot (#ffaa55) until a visible warm edge line runs down the cuirass's left silhouette, and drop the front fill about 30%.
   - Verify at both sizes. Proof: the plinth's bottom edge and floor contact are in frame at 1512.

### Lane B: Fire shell and wall glow, ch0 + ch4 (`src/scene/world/Fire.tsx`; owner: copilot-swarm)
2. **Fix the outer flame layer and light the wall (≈25 min; ch4 +0.4, ch0 +0.2).**
   - Re-tint the outer/side billboard from beige to a saturated gradient (body #ff8a2a, tips #b8360f) and cut its opacity about 40%, or its width about 30%, so the tongues read as fire rather than cloth. The core stays as it is.
   - Make ch0 and ch4 use the same flame scale and layer set (ch0 currently shows only the wisp).
   - Raise the glow plane behind the flame (`Fire.tsx` glow mesh) so a soft warm halo at least 300 px wide at 1920 lands on the back wall. Alternatively, add a second distance-limited point light (#ff7a30) about 0.6 m behind the fire to light the wall: a reused light, not a new system.
   - Find the faint vertical warm patch on the right wall (1920: x 1680-1760, y 500-800) and remove it, or hide it in fog.

### Lane C: ch3 hang (`ProjectArtefact.tsx`, lantern in `World.tsx`; owner: agy-review)
3. **Hang the frame and light the lantern (≈15 min; ch3 +0.3).**
   - Either extend the chain down to the frame's top-centre hook, or move the lantern above the frame and add two short wires (reuse the chain mesh) from the frame's corners up to a single nail. Nothing should float.
   - Give the lantern a small emissive core (#ffb060, toneMapped false). This is c16 #4c, still open.
   - Feather the hard vertical wall band at x 1120-1190 (1920) into fog, and push the bottom diagonal floor line into darkness.

### Lane D: ch1 plinth scale (`Sanctum.tsx` pedestal; owner: blender)
4. **Widen the plinth to the statue's base and make it read as stone (≈15 min; ch1 +0.2).**
   - Scale the plinth about 1.25x in X/Z so its top is 3-5% wider than the statue's base on both sides, and keep its height.
   - Lower the normal/bump strength about 50% so it reads as worn dressed stone, not clay.
   - Push the bottom-right room corner (1920: 1500-1920, 870-1080) into fog.

### Lane E: ch0 composition (`chapterLook.ts` / the ch0 camera spot; owner: any lane after A-D)
5. **Fill or crop the empty floor (≈10 min; ch0 +0.2).**
   - Tilt the ch0 camera down about 4°, or lower its target about 0.3 m, so the barrel and relief sit at y≈55% and the bottom 45% of empty floor shrinks to about 30%.
   - Or keep the framing and let the floor pool spread wider (raise penumbra), so the lower frame carries light.
   - Verify that the hero copy still clears the barrel at 1512.

## Keep
- The flame core: a smooth soft sprite with a white-hot centre and no stair-steps at Retina 2x. This is the biggest gain of the cycle.
- Embers that show at both sizes (size normalised in device px).
- ch1's base in frame at 1512, its warm key and statue-first hierarchy.
- ch3's clean pool (no banding), the backing card's removal, and the copy clear of the frame.
- ch4's composition (barrel low and big, relief behind, now dimmer).
