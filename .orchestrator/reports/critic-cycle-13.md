# Critic cycle 13 (main @ 664920a, r17 lanes A-D merged). DESKTOP ONLY

Scope: Akash said to skip mobile, so this cycle has no 390 shots and no mobile score.
Build: `npm run build` passed with only the chunk-size warning. Preview ran as `vite preview --port 4396 --strictPort`. I killed it by pid (62203) after the shots, and lsof confirms port 4396 is free.
Shots: Playwright Chrome at 1440x900, one fresh navigation per chapter, 16 s settle each.
Files: `.orchestrator/reference/critic-c13-ch{0..4}.png`.
Console: 0 errors and 1 warning (the `THREE.Clock` deprecation, unchanged).
References: aengel.io, landing.love, threejspunk and rottensouls, all from earlier captures (c12). I did not shoot them again.
Direction constraint (Akash): the real flame stays in ch0 and ch4.

## Scores

| Chapter | c12 | c13 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7.5 | **7.8** | Fixed: the dot ring is gone, the flame is taller, and the backdrop now has faint pillar layers instead of pure black. New faults:<br>• The flame reads as 3-4 separate flat tongues with hard card edges (965-1025, 220-385). Its base is narrower than half the barrel mouth (925-1062).<br>• The matte barrel lost its rust and now reads as a dark plain cylinder (925-1065, 395-540).<br>• The relief panel on the right is lit as brightly as the barrel (1185-1295, 250-540) and reads as a flat cardboard cutout. |
| ch1 About | 8.5 | **8** | Regression. The statue is muddier and greyer than in c12, with less warm key and the cool rim doing nothing. A new hard-edged lighter rectangle sits behind the plinth: its top edge is at y≈705 (670-1440) and its left edge at x≈700. It reads as a box of geometry or a fog card edge. The plinth is still a bare black cuboid (925-1230, 505-820). |
| ch2 Work | 7.5 | **8** | Framing is fixed: the cuirass sits at 975-1305 with about 135 px of air on the right. New loudest fault: a large flat blue-grey angular slab behind it (930-1440, 0-700) reads as an untextured plane or tarp. It is very likely the new cool rim light (#6a7a90) washing a back wall. There is also a stray warm glow at the bottom-left (150-220, 780-880) with no source. |
| ch3 Projects | 8 | **7.5** | Regression. The canvas is sharper, but that exposes AI-gibberish text ("IASAIIC EIIIN…", mangled "$142,830", 880-1130, 300-630). It looks generated at a glance. The lantern now hangs off-axis (1085-1145, 0-205), and its chain doesn't reach the frame, so nothing holds anything. The frame is still keystoned (top 820-1180, bottom 845-1185). The wall plane isn't visible, so the frame still floats in black. |
| ch4 Contact | 7.5 | **7.5** | Fixed: the base ring is gone and the clipped statue is out of frame. Remaining faults:<br>• The flame is a pinched card stack hovering above the rim (base 885-945, ≈515). It fills only about 25% of a 240 px mouth.<br>• A line of tiny hot specks runs along the rim (800-1040, ≈522).<br>• The relief panel's face is lit brighter and warmer than the barrel standing next to the fire (1085-1200, 360-750), so the light logic is backwards.<br>• The barrel reads as a dark silhouette lit only at its foot. |
| **Overall** | 7.6 | **7.7** | r17 fixed what it targeted (dot ring, framing, backdrop depth, canvas sharpness). Each fix exposed the next layer: card-edge flame, a backlit cutout relief, a light-washed blue slab and gibberish canvas text. |

**ITERATE** (overall 7.7 < 8.5; ch0, ch3 and ch4 are below 8).

## Top 5 reasons it still reads as slop

1. **The flame is visibly made of cards** (ch0 965-1025 at 220-385; ch4 885-945 at 260-515). The hard-edged tongues, the narrow pinched base and the gap above the rim read as a 2010-era billboard fire. rottensouls fire fills its vessel mouth and has no readable edges.
2. **Light hierarchy is inverted around the fire** (ch0 relief 1185-1295; ch4 relief 1085-1200). The relief scan shows its own baked light (`Sanctum.tsx:65` comment), so a prop 1 m from the fire is brighter than the barrel the fire sits in. The eye goes to a flat cutout instead of the flame.
3. **Cool rim leak paints flat planes** (ch2 slab 930-1440 at 0-700; ch1 rectangle edge at y≈705, x≈700). The r17 Lane B rim and fog layers light large flat back surfaces evenly, so the geometry reads as boxes. threejspunk keeps its rim on the subject silhouette only.
4. **Generated-looking project art** (ch3 880-1130 at 300-630). Pseudo-UI text that is sharp enough to read and still wrong is worse than blur. A visitor reads it as AI filler on the one chapter about real work.
5. **Unsupported objects** (ch3 lantern off-axis with a chain to nowhere and a floating keystoned frame; ch1 and ch2 bare cuboid plinths). Nothing rests on or hangs from anything believable.

## Top 5 fixes, grouped per chapter (lanes can run in parallel)

### Lane A: Fire, ch0 + ch4 (`src/scene/world/Fire.tsx`, relief placement in `Sanctum.tsx` / `World.tsx:47,55`)
1. **Seat and widen the flame (≈25 min; ch0 +0.3, ch4 +0.4).**
   - Widen the card stack's base to about 60% of the mouth diameter, and sink the base 3 cm below the rim so the flame sits in the barrel with no gap.
   - Rotate each card to a different yaw (for example 0°, 55°, 115°) so no tongue is seen edge-on.
   - Soften the card alpha edges using the existing texture's alpha falloff or opacity, not a new shader.
   - Find the source of the rim speck line (ch4 ≈522): embers spawning at the rim height, or rivet specular. Then start the embers 5 cm inside the mouth.
   - Proof: 1440 crops show no visible card edge and no gap between the flame base and the rim.
2. **Fix the light hierarchy flame > barrel > relief (≈20 min; ch0 +0.3, ch4 +0.3).**
   - Scale the relief's baked or emissive contribution to about 0.35, or push it 1.2-1.5 m back into the fog so it reads as a silhouette.
   - Raise the barrel's upper half: put one warm point light at the mouth with a short `distance` (≈1.2) so the top third of the barrel shows rust (threejspunk key/rim split).
   - Target: the relief's mean luminance is below the barrel's in both shots.

### Lane B: Rim leak, ch1 + ch2 (`World.tsx` cool rims, fog layers, `chapterLook.ts`)
3. **Confine the cool rim to the subject and kill the boxes (≈25 min; ch1 +0.4, ch2 +0.4).**
   - Give each `#6a7a90` rim a spot cone or short `distance` and `decay: 2`, aimed at the subject silhouette only. The ch2 blue slab should drop to fog colour.
   - Find what draws the ch1 rectangle edge (y≈705, x≈700): a fog silhouette card, the ch3 wall plane, or a sanctum wall caught by the rim. Hide it in ch1 or feather it.
   - Restore the c12 ch1 warm key level on the statue. c12 was the bar.
   - Remove or source the stray ch2 warm glow at 150-220, 780-880.

### Lane C: ch3 project art (`ProjectArtefact.tsx`, `src/content/projects.ts` `image`)
4. **Replace the gibberish canvas with a real screenshot (≈20 min; ch3 +0.5).**
   - Set SalarySync's `image` to a real 2048 px SalarySync UI screenshot, cropped to the canvas ratio and toned warm or sepia to sit in the scene.
   - If there's no real screenshot, use an abstract texture with no fake text (a blank ledger or paper texture) rather than pseudo-UI.
   - Apply the same rule to all 8 paintings.
5. **Hang it properly (≈20 min; ch3 +0.3; ch1 and ch2 +0.1).**
   - Move the lantern so it's centred above the frame's top edge (frame centre x≈1000 in the shot) with its chain ending at the frame's hanging point. Or hang it in front and above, with the chain going out of frame top, and drop the implied connection.
   - Zero the frame's yaw and pitch against the camera so the keystone is under 5 px.
   - Make the wall plane visible: dark stone, lit by the lantern spill so it shows about 3-5% luminance.
   - Optional if time remains: swap the ch1 and ch2 plinth cuboids for the same scanned stone material.

## Keep
- No dot ring at the base, ch2 framing, ch4 clipped-statue fix and backdrop silhouette layers in ch0 and ch4.
- Floor pools with no ellipse, sparse embers and the ch0 composition (text left, subject right third).

**Verdict: ITERATE** (overall 7.7; ch1 8 and ch2 8 pass; ch0 7.8, ch3 7.5 and ch4 7.5 do not).
