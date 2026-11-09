# Critic cycle 15 (main @ c404e0a: r18 blender-plinth, r19 lanes merged). DESKTOP ONLY

Scope: desktop only, so there are no 390 shots and no mobile score.
Build: `npm run build` passed, with only the chunk-size warning.
Preview: `vite preview --port 4398 --strictPort`. I killed it by pid after the shots, and lsof confirms port 4398 is free.
Shots: Playwright Chrome at 1440x900, one fresh navigation per chapter, 16 s settle each. Files: `.orchestrator/reference/critic-c15-ch{0..4}.png`.
Console: 0 errors and 1 warning (the `THREE.Clock` deprecation, unchanged).
References: aengel.io, landing.love, threejspunk and rottensouls, from earlier captures (c12). I did not shoot them again.
Constraint (Akash): the real flame stays in ch0 and ch4.

## ch1 check: did the scanned plinth make it darker? Yes, it regressed.

I measured mean grey luminance (0-255) in matching regions of the c14 and c15 shots:

| Region | c14 | c15 | Change |
|---|---|---|---|
| Statue body | 33.6 | 24.2 | **-28%** |
| Plinth | 9.8 | 25.2 | +157% |
| Background right of statue (1240-1440) | 4.9 | 2.0 | -59% |

What went wrong:
- The statue lost the warm bronze key. Its highlights now read grey-tan and flat, without the c14 rim.
- The plinth is now as bright as the statue and is the larger shape, so it competes for the eye. It also reads as a rough mud or clay pillar, not dressed stone.
- The warm back glow and wall that separated the statue in c14 are gone. The statue now floats in pure black.
- The camera or statue also moved: the crown now reaches y≈75, just under the nav line, so the top of the frame feels cramped.

## Scores

| Chapter | c14 | c15 | One-line reason |
|---|---|---|---|
| ch0 Hero | 8.0 | **8.0** | Unchanged. The flame (955-1045, 200-390) is still a flat painted sticker: stair-stepped, pixel-hard edges at the base and no halo. The relief (1185-1295, 250-540) is still front-lit as bright as the barrel. |
| ch1 About | 8.2 | **7.8** | **Regression** (see above). The plinth texture is real, but it won the frame: statue -28%, plinth +157%, back glow gone. |
| ch2 Work | 8.0 | **7.9** | Fixed: the blue tarp slab is gone. New problems:<br>• The frame is now an empty black void.<br>• The cuirass is still lit flat from the front, with no rim.<br>• Its plinth is still a bare cuboid with hard, lit edges: a top edge at y≈695 and a left edge at x≈1095, spanning 1010-1440. |
| ch3 Projects | 8.0 | **8.0** | Gain: the ornate scanned frame is a real fidelity upgrade, and the lantern now has air above the frame. Losses:<br>• The chain still cuts through the nav (x≈857, between "Work" and "Projects").<br>• The body copy now runs over the frame ("records", "payment", "else.", x 650-708, y 440-510).<br>• A dark backing card still shows behind the frame (635-1085, 260-765).<br>• The frame is still skewed: the top spans 650-1050 and the bottom 640-1075. |
| ch4 Contact | 7.8 | **7.7** | Unchanged and still the weakest chapter. The flame (860-975, 260-520) is translucent yellow-green, with visible stacked sheets and stair-stepped edges, and casts no glow. Its base covers about 47% of the mouth (800-1045). The relief (1085-1200, 360-750) is still lit from the front. |
| **Overall** | 8.0 | **7.9** | ch3's frame swap and ch2's slab removal helped. The ch1 plinth regression cancelled them, and the flame (the c14 #1 fix) did not land. |

**ITERATE** (overall 7.9 < 8.5; ch1 7.8, ch2 7.9 and ch4 7.7 are below 8).

## Top 5 reasons it still reads as slop

1. **The flame still looks drawn, not burning** (ch0 and ch4). The c14 fix #1 did not land. The commit log shows "Report blocked flame asset download", and nothing changed on screen.
2. **ch1's plinth outshines its statue.** A rough, bright block takes the eye from the subject, and nothing lights the background.
3. **The reliefs compete with the fire** (ch0 and ch4). They're front-lit at barrel brightness, a light direction the fire can't produce.
4. **The ch2 void and cuboid.** With the slab gone there's nothing behind the cuirass, and the plinth is still an untextured box with lit edges.
5. **ch3's hang collides with the UI.** The chain crosses the nav and the copy overlaps the frame.

## Top 5 fixes, grouped per chapter

### Lane A: Fire, ch0 + ch4 (`FirePit.tsx`; reliefs in `Sanctum.tsx` / `World.tsx`)
1. **Flame emits instead of painting (≈25 min; ch0 +0.3, ch4 +0.4).** Repeat of c14 #1, still open, and it needs no new asset.
   - Use the existing flame cards with `AdditiveBlending`, `depthWrite: false`, `toneMapped: false` and colour × 2-3, so the existing `Effects` bloom adds a halo.
   - Remove the per-card opacity layering.
   - Turn on linear filtering or mipmaps on the flame texture to kill the stair-stepped edges. If it's a pixel-filtered sprite, set `minFilter`/`magFilter` to `LinearFilter`.
   - Widen ch4's base to about 60% of the mouth.
   - Proof: no visible card edge in a 1440 crop, a near-white core, and a halo at least 20 px wide.
2. **Reliefs dimmer and side-lit (≈15 min; ch0 +0.2, ch4 +0.3).** Repeat of c14 #2.
   - Bring relief luminance below half the barrel's: cut the baked or emissive light to about 0.15, or move the relief 1.2 m back into the fog.
   - Light it only from the fire side.

### Lane B: ch1 plinth regression (`Sanctum.tsx` pedestal material, `chapterLook.ts` ch1 lights)
3. **Put the statue back on top (≈20 min; ch1 +0.4).** The goal is c14's subject lighting on c15's textured plinth.
   - Drop the plinth's albedo or envMapIntensity until its mean luminance is at or below 0.5× the statue's (target: plinth ≈12, statue ≥33). The baked atlas is probably too bright; darken that tile or set the material colour to about #555.
   - Restore the c14 ch1 warm key intensity and position on the statue.
   - Restore the warm back glow (the c14 background measured 4.9 at 1240-1440 and now measures 2.0).
   - Pull the camera back or the statue down so the crown sits at y ≥ 110.

### Lane C: ch2 plinth and backdrop (`World.tsx` ch2 group, `chapterLook.ts`)
4. **Reuse the ch1 scanned-stone material on ch2's plinth, add a rim, and give the void depth (≈20 min; ch2 +0.3).**
   - Apply the same pedestal atlas tile to ch2's cuboid, kept dark per fix 3's ratio.
   - Add one warm rim spot from behind-left on the cuirass.
   - Add a faint warm floor pool or fog gradient behind it, so there's layered depth (threejspunk style) instead of flat black.

### Lane D: ch3 hang and layout (`ProjectArtefact.tsx`, lantern in `World.tsx`, `ProjectsSection`)
5. **Clear the UI collisions (≈20 min; ch3 +0.4).**
   - Move the chain to x ≥ 1060, or start it below y=80.
   - Shift the frame group right by about 80 px of screen, or narrow the copy column to end at x ≤ 620, so no text sits on the frame.
   - Zero the frame's yaw (skew under 5 px).
   - Delete the backing card or fade it into the fog.

## Keep
- ch3's ornate scanned frame and lantern air.
- The removal of ch2's slab.
- ch1's textured plinth surface (once it's darkened).
- The ch0 composition and the rusted barrels.
