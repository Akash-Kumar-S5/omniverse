# Critic cycle 18 (main @ 7622152: r23 fire shell + wall glow, r23 ch0 tilt, r24 ch2 breastplate scan, r22 effigy + ruined-church scans). DESKTOP ONLY

Build: `npm run build` passed, with only the chunk-size warning.
Preview: `vite preview --port 4420 --strictPort` (pid 94036). Killed by pid after the shots; lsof confirms 4420 is free.
Shots: Playwright Chrome, real GPU. Each chapter got a fresh page and a 16 s settle, in two contexts:
- `.orchestrator/reference/critic-c18-ch{0..4}-1920.png` at 1920x1080, DPR 1
- `.orchestrator/reference/critic-c18-ch{0..4}-1512.png` at 1512x982, DPR 2 (3024x1964 px)

Coordinates are CSS px for that size.
Console: 0 errors and 1 warning per load (`THREE.Clock` deprecation, unchanged).
Canvas backing size at 1512 DPR2: 2268x1473 (the `[1, 1.5]` cap) for ch0/1/2/4. **ch3 came up at 1512x982, so DPR 1**: PerformanceMonitor dropped quality during load (see "Breaks at only one size").
Each chapter is scored as the WORSE of the two sizes.

## Scores

| Chapter | c17 | 1920 DPR1 | 1512 DPR2 | **c18 (worse)** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.3 | 8.3 | 8.3 | **8.3** | The flame is now one tall, clean tongue. The new wall glow is a hard-edged red disc, not light on stone. The new effigy scan is a green-grey, unlit lump on the floor. The bottom ~35% is still empty floor. |
| ch1 About | 8.3 | 8.3 | 8.3 | **8.3** | Unchanged (Lane D not landed). The statue's base still overhangs a mud-textured plinth, and the room corner is still a box edge at bottom right. |
| ch2 Work | 7.1 | 7.6 | 7.2 | **7.2** | The new breastplate scan has much better material than the grey box, but it floats in black with no support or floor contact. Scan tear holes at both shoulders and a ragged hem read as broken mesh. At 1512 the copy column runs into the armour. |
| ch3 Projects | 8.3 | 8.3 | 8.1 | **8.1** | Unchanged composition (Lane C not landed): the frame still floats under the lantern. At 1512 it rendered at DPR 1, so the carving is visibly soft on Retina. |
| ch4 Contact | 8.0 | 8.2 | 8.1 | **8.1** | The outer flame is now orange smoke rather than beige cloth (gain). The wall glow is a hard round disc behind the barrel. At 1512 the flame tip nearly reaches the nav. The effigy reads as a yellow-green blob. |
| **Overall** | 8.0 | 8.1 | 8.0 | **8.0** | The fire and the ch2 material improved. ch2 is still the single blocker, now with a new text collision. |

**NOT SHIP / ITERATE** (overall 8.0 < 8.5; ch2 at 7.2 is below 8).

## Breaks at only one size

- **1512 only, ch2: the copy overlaps the armour.** The detail column runs x≈530-955 and the breastplate's left edge starts at x≈905, so "production" / "features" / the second bullet sit on the plate's left shoulder (y≈620-690). At 1920 the gap is ~40 px (text ends x≈1125, plate starts x≈1165): tight but clear.
- **1512 only, ch3: DPR 1 render.** The canvas is 1512x982 on a DPR 2 screen, so the frame carving and the screen texture are upscaled and soft. Cause: `Experience.tsx:54` uses `dpr={quality === "high" ? [1, 1.5] : 1}`, and PerformanceMonitor stepped quality down during this load. That makes it non-deterministic per load, and it may hit any chapter on a real Retina laptop.
- **1512 only, ch4: the flame crowds the nav.** The flame tip reaches y≈90, just under the nav row (y≈38). At 1920 it stops at y≈100 of 1080, which is proportionally lower.
- **Both sizes, ch0 + ch4: a hard-edged glow disc.** 1920 ch0: x 1180-1540, y 240-600. 1920 ch4: x 830-1460, y 180-800. The circle's edge is visible against the black wall.

## Top 5 reasons it still reads as slop

1. **ch2's armour floats and looks torn** (`critic-c18-ch2-1920.png`, x 1165-1700, y 245-810). The plinth was removed and nothing replaced it, so a headless torso hovers in a void above a soft floor pool. Open scan edges at both shoulders (x≈1580-1690, y≈420-470) and a ragged hem read as broken geometry, not as an artefact. At 1512 the copy also overlaps it.
2. **The fire's wall glow is a visible disc, not light** (ch0 and ch4). The c17 fix asked for light on the back wall, and it arrived as a sprite. A round red-orange gradient with a hard edge sits in the black, so the eye reads a circle. In the references, the stone texture catches the light. Here no texture is lit.
3. **The effigy scan doesn't belong to the scene** (ch0 1920 x 1380-1800, y 670-770; ch4 x 1350-1690, y 800-900). It's desaturated green-yellow with no warm fire response, so it reads as a different capture under different light. At ch0 it lies like a log; nobody will read "recumbent figure" at this size.
4. **ch3's frame still floats, and at 1512 it's soft** (c17 #4, Lane C not done). The chain and lantern end at y≈345 and the frame starts at y≈410. The lantern still has no lit core. The hard vertical wall band (x 1120-1190) and the bottom diagonal floor line are still there. The DPR 1 drop makes the carving mushy on Retina.
5. **ch1's plinth is unchanged mud, narrower than the statue's base** (c17 #5, Lane D not done; 1920 statue base 1090-1460 vs plinth top 1150-1415). The bottom-right room corner still shows as a box edge.

## Top fixes, grouped per chapter (parallel lanes)

### Lane A: ch2 grounding (`HeroArmour.tsx`, `exp_role_0` camera spot; ≈30 min; ch2 +0.8, the SHIP blocker)
- Give the breastplate a support: a simple dark armour stand (a vertical post plus a crossbar at the shoulders, reusing the old plinth material made warm and dark, #2a211b, with no emissive), or set it on a low warm-stone block that sits fully in frame with visible floor contact. It must not float.
- Hide the tear holes: rotate the scan about 15-20° toward three-quarter view so the open shoulder faces away, or tilt the key so those openings fall into shadow.
- Move the armour (or the camera target) right so its left edge sits at x ≥ 1000 at 1512 and the copy column stays clear by at least 40 px. Alternatively, scale it about 10% down. Verify at both sizes.

### Lane B: Fire glow, ch0 + ch4 (`src/scene/world/Fire.tsx`; ≈20 min; ch0 +0.2, ch4 +0.2)
- Remove the glow disc, or feather it: a radial falloff to 0 well before the quad edge (smoothstep from 0.15 to 0.5 of the radius), at about 50% of the current opacity.
- Light the wall with a real light instead: one distance-limited point light (#ff7a30, distance ~3 m, decay 2) about 0.5 m behind and above the flame, so the existing wall and church geometry pick up texture.
- At ch4, cap the flame height so its tip stays ≥ 120 px below the nav at 1512 (scale the flame group about 0.85, or lower the camera target about 0.15 m).

### Lane C: Effigy grade (`EffigyKnight.tsx`; ≈15 min; ch0 +0.1, ch4 +0.1)
- Make the material respond to the firelight: drop any emissive, set roughness ≥ 0.8, and multiply the albedo toward warm stone (`color #8a7560`) so the green cast goes.
- At ch0, rotate it about 25° so it reads as a figure, not a log, or push it back into the fog so it's only a silhouette.

### Lane D: ch3 hang + DPR (`ProjectArtefact.tsx`, lantern in `World.tsx`, `Experience.tsx`; ≈20 min; ch3 +0.3)
- Carried from c17: run the chain down to a hook at the frame's top centre, or add two short wires up to one nail. Give the lantern an emissive core (#ffb060, toneMapped false). Feather the vertical wall band into fog.
- Stop the DPR collapse: keep a `[1, 1.5]` floor on `medium` too (only `lite` goes to 1), or delay PerformanceMonitor until ~3 s after the first frame so the load spike can't downgrade quality.

### Lane E: ch1 plinth (`Sanctum.tsx` pedestal; ≈15 min; ch1 +0.2)
- Carried from c17: scale the plinth about 1.25x in X/Z so it's wider than the statue's base, halve the bump strength, and fog the bottom-right room corner.

## Keep
- ch0's flame: one tall, smooth tongue with a white-hot core. It reads as fire at both sizes.
- ch4's outer flame: warm, smoky orange instead of beige card. The c17 #2 fix landed.
- ch2's breastplate material: real hammered metal with warm specular. This is the right asset class. It needs grounding, not replacing.
- ch1's key light and statue-first hierarchy, and ch3's clean wall pool.
- Embers at both sizes, and 0 console errors.
