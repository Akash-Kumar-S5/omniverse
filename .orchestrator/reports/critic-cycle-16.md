# Critic cycle 16 (main @ b8ae153: r19 ch3 hang, r20 flame, r20 blender-plinth merged). DESKTOP ONLY, FULL SCREEN

Build: `npm run build` passed, with only the chunk-size warning.
Preview: `vite preview --port 4399 --strictPort`. Killed by pid after the shots; lsof confirms 4399 is free.
Shots: Playwright Chrome, real GPU (ANGLE Metal, Apple M3 Pro). Each chapter got a fresh page and a 16 s settle, in two contexts:
- `.orchestrator/reference/critic-c16-ch{0..4}-1920.png` at 1920x1080, DPR 1
- `.orchestrator/reference/critic-c16-ch{0..4}-1512.png` at 1512x982, DPR 2 (3024x1964 px)

Coordinates are CSS px for that size; for the 1512 shots, double them to get file pixels.
Console: 0 errors and 1 warning per load (the `THREE.Clock` deprecation, unchanged).
References: aengel.io, landing.love, threejspunk and rottensouls, from the earlier c12 captures.
Each chapter is scored as the WORSE of the two sizes.

## Scores

| Chapter | c15 (1440) | 1920 DPR1 | 1512 DPR2 | **c16 (worse)** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.0 | 8.0 | 7.8 | **7.8** | The flame is still stair-stepped (worse on Retina), and the relief is lit as bright as the barrel. |
| ch1 About | 7.8 | 8.4 | 8.2 | **8.2** | The regression is fixed: warm key, back glow and the statue reads first. At 1512 the plinth runs off the bottom edge. |
| ch2 Work | 7.9 | 7.8 | 7.5 | **7.5** | The plinth is an untextured box. At 1512 it runs off the right edge, and the cuirass is clipped at x≈1415. Top right is empty black. |
| ch3 Projects | 8.0 | 8.2 | 8.1 | **8.1** | Gain: the chain clears the nav, the copy clears the frame and the skew is gone. Left: a stepped light-pool edge and a hard backing rectangle. |
| ch4 Contact | 7.7 | 7.8 | 7.6 | **7.6** | Same stair-stepped flame, and its side tongues are blocky. There's no glow on the back wall and the relief is still front-lit. |
| **Overall** | 7.9 | 8.0 | 7.8 | **7.8** | ch1 and ch3 landed, but the flame is the single biggest drag, and Retina exposes it. |

**ITERATE** (overall 7.8 < 8.5; ch0 7.8, ch2 7.5 and ch4 7.6 are below 8).

## Breaks at only one size

- **1512 DPR2 only: the flame stair-steps are about twice as visible.** Each 128 px sprite frame is upscaled to about 800 device px. On ch0 the edges are hard pixel staircases at x 1010-1110, y 290-420 (2x crop: `critic-c16-ch0-1512.png` around 2020-2220, 580-840). At 1920 DPR1 they're softer but still visible (ch0 1240-1340, 380-470).
- **1512 only: ch2 is cropped at the right.** The plinth's top face runs from x 1160 to the edge at 1512. The cuirass's right shoulder ends at x≈1415, with no margin. At 1920 the same group sits at 1270-1690 with air on both sides.
- **1512 only: ch1's plinth runs off the bottom.** Its base reaches y≈960 of 982, so the statue group has no floor contact in frame. At 1920 the base sits at y≈1060 with the floor visible.
- **1920 only: ch4 has a stray sliver at the right edge** (x≈1905, y≈670), an unidentified lit object entering the frame. It isn't visible at 1512.
- **1512 only: ch0 embers show; at 1920 they barely do.** Above the barrel at 1512 (900-1190, 100-330) there are clear embers, while 1920 shows only faint specks. Check whether ember size is in device pixels.

## Top 5 reasons it still reads as slop

1. **The flame is cut out with a hard alpha threshold** (ch0 and ch4). The root cause is `src/scene/world/Fire.tsx:100`: `if (d[i + 3] < 45 || d[i + 1] < 15)` zeroes every pixel below the cutoff. That turns the soft sprite alpha into a binary mask. On a 128 px frame (`flame_sheet_8x8.png` is 1024², 8x8, set at `Fire.tsx:18-19`) the mask shows up as staircase edges, and linear filtering can't smooth a binary mask. The flame also has a flat horizontal base cut (ch4 y≈625 at 1920) and a cream colour with no white-hot core, and it casts no halo on the wall behind.
2. **ch2 is a box on a box in a void.** The plinth is a flat-shaded cuboid with a lit top face, the cuirass is lit flat from the front with no rim, and 50% of the frame (1150-1920, 80-430) is pure black. At 1512 the group is also cropped at the right edge.
3. **The reliefs still compete with the fire** (ch0 1520-1650, 300-650; ch4 1400-1540, 430-900 at 1920). They're lit evenly from the front at about barrel brightness, a light direction the fire can't produce. This is the third cycle running.
4. **ch3 has CG tells in the backdrop.** The lantern's light pool has a visibly stepped, quantized top edge (1190-1600, 185-265 at 1920), and a hard-edged backing rectangle starts at y≈390 behind the frame (1200-1590). The lantern (1400-1445, 270-340) is a dark silhouette that doesn't look like it gives the light.
5. **ch1's plinth is a crumbly mud block.** It's darker now and no longer competes, but it's as tall as the statue's legs and reads as clay, not dressed stone. The room corner line at bottom right (1600-1920, 900-1080 at 1920) is a visible box edge.

## Top 5 fixes, grouped per chapter (parallel lanes)

### Lane A: Fire, ch0 + ch4 (`src/scene/world/Fire.tsx`, owner: blender or copilot-swarm)
1. **Kill the hard alpha cut and go higher-res (≈25 min; ch0 +0.4, ch4 +0.5).**
   - Delete the threshold at `Fire.tsx:100`, or replace it with a smooth ramp: `alpha *= smoothstep(10, 80, a)`, done per pixel in the canvas pass.
   - Better: switch the source to the higher-res smooth sheet that's already in the repo, `public/assets/props/textures/flame-spritesheet-6x1.png` (3072x512, 512 px frames, soft greyscale wisps). Tint it in the material: core #fff3d0, body #ff9a3c, tips #c2410c, with colour × 2-3 so bloom haloes it. Set COLS=6, ROWS=1.
   - Feather the base so there's no horizontal cut: multiply by the bottom 15% of the existing radial mask.
   - Raise the glow plane at `Fire.tsx:210` from opacity 0.5 to about 0.8, and scale it about 1.5x, so the back wall gets a halo.
   - Proof: a 2x crop at 1512 DPR2 shows no stair-step longer than 2 device px, a near-white core, and a halo at least 40 device px wide.
2. **Dim and side-light the reliefs (≈15 min; ch0 +0.2, ch4 +0.2).** Repeat of c14 #2 and c15 #2.
   - Relief mean luminance should be at most 0.5× the barrel's. Drop its material colour or envMapIntensity to about 0.35.
   - Light it only from the fire side, with a point light at the flame position and no fill.
   - Also find and remove the ch4 stray object at the right edge (1920: x≈1905, y≈670).

### Lane B: ch2 framing and plinth (`World.tsx` ch2 group, `chapterLook.ts` ch2 camera/lights, owner: agy-world)
3. **Reframe for both sizes and dress the plinth (≈25 min; ch2 +0.5).**
   - Move the cuirass group about 0.4 m left (or pull the camera back about 8%) so at 1512 the right shoulder sits at x ≤ 1360 and the plinth's right edge stays inside the frame.
   - Raise the group so the cuirass centre sits at about y 45% (now about 62%).
   - Apply the ch1 scanned-stone pedestal material to the ch2 cuboid, kept dark. The r20 note says it took "the same stone", but on screen it still reads as a flat box, so verify the material actually binds.
   - Add one warm rim spot from behind-left on the cuirass, plus a faint warm fog gradient or wall glow behind it, to fill the top-right void (threejspunk layering).
   - Verify at both sizes.

### Lane C: ch3 backdrop polish (`ProjectArtefact.tsx` wall/backing, lantern light in `World.tsx`, owner: agy-review)
4. **Smooth the pool and hide the backing (≈15 min; ch3 +0.3).**
   - The stepped edge is 8-bit banding or a stepped geometry falloff. Swap the pool for a radial-gradient texture with dithering, or a spotlight with penumbra about 0.8, instead of the feathered mesh arch.
   - Fade the backing rectangle's top and side edges into the fog, or delete it.
   - Give the lantern a small emissive core (#ffb060, toneMapped false) so it reads as the light source.

### Lane D: ch1 plinth crop and finish (`Sanctum.tsx` pedestal, `chapterLook.ts` ch1 camera, owner: blender)
5. **Fit the base at 1512 and make it read as stone (≈15 min; ch1 +0.2).**
   - Shorten the plinth about 25%, or lower the ch1 camera target slightly, so its base and some floor show at 1512 (base at y ≤ 900 of 982).
   - Lower the roughness variation or normal strength so it reads as worn dressed stone, not mud.
   - Push the room corner at bottom right into fog.

## Keep
- ch1's restored warm key, back glow and statue-first hierarchy.
- ch3's clean hang: chain clear of the nav, copy clear of the frame, no skew.
- The ch0/ch4 barrel scan and the floor light pools.
- The ch4 composition (barrel low and big, relief behind).
