# Critic cycle 8 (2026-11-09 07:05 IST)

Build: main @ 10d3a1d (r11 merged). Fresh `npm run build`, served by `npx vite preview --port 4390 --strictPort`
(killed by pid after shots, port confirmed free). Playwright Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c8-ch{0..4}.png` (1440x900), `critic-c8-ch0-390.png`, `critic-c8-ch4-390.png` (390x844).
Reference: aengel.io / landing.love captures from earlier cycles (not re-shot). No transition frames this cycle.
Console: 0 errors, 1 warning (`THREE.Clock` deprecated; unchanged).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c7 | c8 | One-line reason |
|---|---|---|---|
| ch0 Hero | 6.5 | **6.5** | Embers now spread across the pit (cone fixed) and the inner rim is darker. Still: the outer ring of ~30 pale-tipped pebbles is untouched and reads as teeth / a toy Stonehenge (760-1260, 510-680). The floor spot is still a hard ellipse (610-1440, 520-780). The flame sits in front of a soft **red rectangle** glow (930-1085, 300-440) that reads as a billboard. Pale white sticks still show in the pit (930-1050, 425-460). Embers are now fat glowing bokeh discs, some red and 10+ px (870-1200, 120-420), which reads as particles, not sparks. |
| ch1 About | 7.5 | **8** | Best frame on the site. Brick swatch and candlesticks are gone; the statue is lit with a clean rim and dominates. The plinth is now a featureless black cuboid (925-1230, 495-820) with no floor under it, so it floats in a warm vignette; acceptable, but it's a box. |
| ch2 Work | 6 | **6** | Shield unchanged for the third cycle: near-white parchment face with smeared red blotches (1065-1255, 195-635), still the brightest thing on screen and cut by the right edge of the text column. Corridor floor is dark mush with small bright litter (540-1100, 720-900) behind the timeline. |
| ch3 Projects | 6.5 | **7** | Lantern now sits fully in frame below the nav (1085-1145, 115-205); a dark wall reads behind the frame. Painting is still a soft sepia smear unrelated to SalarySync, and its content reads upside-down/reflected (885-1135, 315-630). Frame is lit flat and is the warmest, brightest object, competing with the H1. |
| ch4 Contact | 6.5 | **6.5** | Same pit problems as ch0 seen from above: crossed logs are pale blond/white (830-1040, 330-470), outer pebble ring still there (610-1250, 460-730), red rectangular glow behind the flame with a visible vertical seam (860-1060, 200-330). Spot ellipse edge still cuts the floor (460-700, 580-900). Relief still pale cream (1215-1350, 200-480). |
| Mobile 390 | 6 | **6.5** | Clock and speckle cloud are gone (fixed). ch0: pit fills the bottom third, cropped both sides; the outer pebble row dominates the bottom 150 px. ch4: flame tips rise behind the "GitHub / LinkedIn" link row (170-300, 560-600), so text sits on the fire; logs read as white bones. |
| **Overall** | 6.5 | **6.7** | ch1 crossed 8. Placement fixes (ch3 lantern, mobile clock/speckle, ember spread) landed. The pit (ch0/ch4/mobile, the first and last thing a visitor sees) and the ch2 shield were not materially changed and hold the score down. |

**ITERATE** (overall 6.7 < 8.5; ch0, ch2, ch3, ch4, mobile < 8).

## Top 5 reasons it still reads as slop

1. **The pit is still a kit-bash.** c7 fix #1 (delete outer pebble ring, darken logs) did not land. ch0/ch4/mobile all show the dark boulder ring + an outer ring of pale-tipped pebbles + white sticks. Three fidelities in the hero object.
2. **The fire glow is a visible shape.** A red rectangle behind the flame cards (ch0, ch4, both mobiles), with a seam on ch4. Flame itself is flat camera-facing cards. This is the single most "rendering primitive" thing on screen.
3. **ch2 shield, third cycle unchanged.** Brightest pixels in the frame, low-res smeared texture, beside the body copy.
4. **Hard floor-spot ellipse** on ch0 and ch4 still visible; the light reads as a stage spot, not firelight.
5. **Embers became bokeh blobs.** Spread is right now, but sizes 6-12 px with red halos read as glowing particle blobs, not sparks.

## Top 5 fixes, ranked by visual gain per hour

1. **Pit cleanup, for real this time (≈40 min; ch0 +0.8, ch4 +0.8, mobile +0.5).** In the pit component (`src/scene/world/FirePit.tsx` / its GLB): remove the outer ring of small pebbles entirely (verify by screenshot that ch0 760-1260×510-680 is empty floor). Multiply the log material albedo by 0.25 and set roughness 0.9, or swap to a dark Poly Haven scanned log; the sticks must read charcoal, not blond. Have the implementer attach a before/after ch4 crop as proof, because this ask has failed twice.
2. **Kill the red glow rectangle (≈20 min; ch0 +0.4, ch4 +0.5, mobile +0.3).** The glow plane/sprite behind the flame: use a radial-falloff texture with alpha reaching 0 well inside the quad (or remove it and rely on the point light + bloom). No straight edges or seams may be visible at any chapter.
3. **Shield: darken or replace (≈30 min; ch2 +1).** Multiply the shield face albedo by ~0.35 or swap for a darker scanned shield (Sketchfab CC0/CC-BY metal/wood shield scan). Cut its key light ~50% so the face sits mid-grey and only the rim catches light. Target: shield face luminance below the body text.
4. **Soften the floor spots (≈15 min; ch0 +0.3, ch4 +0.3).** `CHAPTER_SPOTS` ch0/ch4: penumbra 1.0, angle widened until the ellipse edge leaves the frame, intensity down ~30%; let the pit's point light do the falloff.
5. **Embers smaller, ch3/mobile polish (≈30 min; ch0 +0.3, ch3 +0.4, mobile +0.3).** Ember size → 2-4 px at 1440 with no red halo, more of them dimmer. ch3: flip the painting texture (it reads upside-down) and/or swap for a sharp sepia SalarySync screenshot; drop frame key light ~30%. Mobile ch4: lower the pit/camera so flame tips stay ≥ 40 px below the link row.

## Keep
- ch1 as is (8). Typography, copy and layout remain the strongest part.
- ch3 lantern placement and wall; mobile with clock and speckle removed; ember spread across the pit radius.

**Verdict: ITERATE** (overall 6.7; only ch1 ≥ 8).
