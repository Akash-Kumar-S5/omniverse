# Critic cycle 14 (main @ 88686de, r18 lanes A-C merged). DESKTOP ONLY

Scope: desktop only, so there are no 390 shots and no mobile score.
Build: `npm run build` passed, with only the chunk-size warning.
Preview: `vite preview --port 4397 --strictPort` ran as pid 81178. I killed it after the shots, and lsof confirms port 4397 is free.
Shots: Playwright Chrome at 1440x900, one fresh navigation per chapter, 16 s settle each. Files: `.orchestrator/reference/critic-c14-ch{0..4}.png`.
Console: 0 errors and 1 warning (the `THREE.Clock` deprecation, unchanged).
References: aengel.io, landing.love, threejspunk and rottensouls, all from earlier captures (c12). I did not shoot them again.
Direction constraint (Akash): the real flame stays in ch0 and ch4.

## Scores

| Chapter | c13 | c14 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7.8 | **8.0** | Fixed: the flame now sits in the mouth with no gap, and the barrel's upper half shows rust. Remaining faults:<br>• The flame is an opaque, flat-painted sticker: hard tongue outlines, no glow or halo, and no light on the air around it (955-1045, 215-390).<br>• The relief panel (1185-1295, 250-540) is still lit as brightly as the barrel, so the eye splits between two subjects. |
| ch1 About | 8 | **8.2** | Fixed: the warm key on the statue is back to the c12 level. Remaining faults:<br>• The room now reads as a CG box: there's a hard vertical wall edge at x≈1295 (0-700), and the lit floor plane ends in a straight line at y≈705 (660-1440).<br>• The plinth is still an untextured black cuboid (925-1230, 505-830). |
| ch2 Work | 8 | **8.0** | The blue slab is dimmer, but its angular tarp silhouette is still legible (920-1440, 0-700) and reads as an untextured plane. The cuirass is lit flat from the front, with no rim to separate it from the dark. The plinth is a bare cuboid (1090-1440, 695-900). |
| ch3 Projects | 7.5 | **8.0** | Fixed: the gibberish text is gone and the lantern is centred with its chain running out of frame. New faults:<br>• The chain runs straight through the nav (x≈993, crossing "Contact").<br>• The lantern's bottom touches or clips the frame's top edge (995-1025, 235-255).<br>• The frame is still skewed: the top spans 830-1180 and the bottom 835-1215.<br>• The "wall" is a hard-edged dark rectangle offset left of the frame (740-1180, 200-700). It reads as a floating card, not a wall.<br>• The ledger art is generic dashboard lines. It's better than gibberish but still reads as filler. |
| ch4 Contact | 7.5 | **7.8** | Fixed: the flame is seated, and the barrel's top third shows rust. Remaining faults:<br>• The flame is a stack of translucent, pale yellow-green sheets whose overlaps you can see (865-965, 265-520).<br>• The flame's base is only about 40% of the mouth (mouth 800-1045).<br>• The flame casts no visible glow.<br>• The relief (1085-1200, 360-750) is still lit as brightly as the barrel, and lit from the front, which the fire can't do. |
| **Overall** | 7.7 | **8.0** | r18 landed every c13 fix it targeted. What's left is the flame itself and room geometry that shows its edges. |

**ITERATE** (overall 8.0 < 8.5; ch4 7.8 < 8).

## Top 5 reasons it still reads as slop

1. **The flame looks drawn, not burning** (ch0 955-1045 at 215-390; ch4 865-965 at 265-520). It has flat fills, visible card overlaps and hard outlines, and it gives off no glow. rottensouls fire is mostly additive light with a bloom halo, and its shape can't be read as discrete tongues.
2. **The relief competes with the fire** (ch0 1185-1295; ch4 1085-1200). It's front-lit at barrel brightness, so the light logic is impossible: the fire is beside it, not in front of it.
3. **Room geometry shows its edges** (ch1 wall edge x≈1295 and floor line y≈705; ch2 slab 920-1440; ch3 card 740-1180). Straight, evenly lit planes that end inside the frame read as boxes. threejspunk hides every plane edge in fog or darkness.
4. **Untextured cuboid plinths** (ch1 925-1230; ch2 1090-1440). They're bare blocks under scanned statues, so asset fidelity is mixed in the frame.
5. **ch3 hanging fixtures collide with the UI and each other.** The chain crosses the nav, the lantern kisses the frame, and the frame is still skewed.

## Top 5 fixes, grouped per chapter (lanes can run in parallel)

### Lane A: Fire, ch0 + ch4 (flame material in `FirePit.tsx`, relief in `Sanctum.tsx` / `World.tsx`)
1. **Make the flame emit, not paint (≈25 min; ch0 +0.3, ch4 +0.4).**
   - Switch the flame cards to `blending: AdditiveBlending`, `depthWrite: false` and `toneMapped: false`, with colour boosted above 1 so the existing `Effects` bloom picks it up. That gives a halo with no new shader.
   - Drop the per-card opacity so the overlaps add up to a hot core instead of layering pale sheets.
   - Widen the base to about 60% of the mouth.
   - Proof: in a 1440 crop there's no visible card outline, the core is near white-yellow and the tips are orange, and a soft halo extends at least 20 px beyond the tongues.
2. **Relief: dimmer and side-lit (≈15 min; ch0 +0.2, ch4 +0.3).**
   - Cut the relief's emissive or baked contribution to about 0.15, or move it 1.2 m back into the fog.
   - Make sure the only light on it comes from the fire side, so the edge nearest the fire is brightest and the far edge falls to black.
   - Target: the relief's mean luminance is below half the barrel's.

### Lane B: Room edges and plinths, ch1 + ch2 (`Sanctum.tsx`, `Floor.tsx`, `World.tsx`, `chapterLook.ts`)
3. **Hide every plane edge (≈25 min; ch1 +0.3, ch2 +0.3).**
   - ch1: the wall edge at x≈1295 and the floor line at y≈705 should fall into fog. Either raise the fog density for ch1 or move the camera or the wall so the corner is out of frame.
   - ch2: drop the slab's colour and roughness response so it matches the fog colour exactly, or hide the slab in ch2.
   - Rule: no straight, lit plane edge inside the frame.
4. **Texture the plinths with a scanned stone (≈20 min; ch1 +0.2, ch2 +0.2).**
   - Apply one Poly Haven CC0 stone or concrete PBR set (for example `rock_wall` or `concrete_floor_worn` at 1k) to the ch1 and ch2 plinth cuboids.
   - Add a slight bevel only if the asset ships one. No modelling.

### Lane C: ch3 hang (`ProjectArtefact.tsx`, the lantern in `World.tsx`)
5. **Clean up the hang (≈20 min; ch3 +0.4).**
   - Shift the lantern and chain so the chain clears the nav: it should land at x ≥ 1060, or start below y=80. Either aim keeps it out of the nav text.
   - Raise the lantern so there's at least 25 px of air above the frame.
   - Zero the frame's yaw so the left and right edges are parallel (skew under 5 px).
   - Make the backing wall wider than the frame and centred behind it, or fade it into the fog so it has no visible edge.
   - Optional: swap the ledger art for a real SalarySync screenshot toned to sepia.

## Keep
- The seated flame, rusted barrel tops, ch1 warm key, ch2 framing, ch3 centred lantern and clean art, and floor light pools.
- The ch0 composition: text on the left, subject in the right third.

**Verdict: ITERATE** (overall 8.0 is under 8.5. ch0, ch1, ch2 and ch3 are at 8.0 or above and pass the chapter bar. ch4 at 7.8 fails it.)
