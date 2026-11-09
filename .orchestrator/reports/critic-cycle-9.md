# Critic cycle 9 (2026-11-09 09:30 IST)

Build: main @ 289cbad (r12 + r13 merged). Fresh `npm run build`, served by `npx vite preview --port 4392 --strictPort`
(killed by pid 69160 after shots, port confirmed free). Playwright Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c9-ch{0..4}.png` (1440x900), `critic-c9-ch0-390.png`, `critic-c9-ch4-390.png` (390x844).
Reference: aengel.io / landing.love captures from earlier cycles (not re-shot). No transition frames this cycle.
Console: 0 errors, 1 warning (`THREE.Clock` deprecated; unchanged).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c8 | c9 | One-line reason |
|---|---|---|---|
| ch0 Hero | 6.5 | **7** | The kit-bashed pit is gone; one scanned barrel and no pebble ring is a real gain. But the barrel reads as a plain black can with a glowing pink rim (920-1065, 455-610), the flame is three small flat cards (965-1010, 400-460), and the floor spot is still a hard ellipse (615-1440, 515-775). Embers are still round glowing dots, 5-8 px, many with halos (800-1350, 0-580). The relief is cut by the right edge and floats with no base (1280-1410, 335-620). |
| ch1 About | 8 | **8** | Unchanged and still the best frame. Plinth is still a featureless box with no floor contact. |
| ch2 Work | 6 | **7** | Shield replaced by a scanned cuirass on a stand (1015-1305, 300-570): dark, textured, no longer the brightest thing on screen. Fixed. The frame is now too dark: the cuirass has no rim light and sinks into a muddy brown wall; the stand is a flat cuboid (1030-1440, 565-900); corridor litter still shows (500-1000, 700-900). |
| ch3 Projects | 7 | **7.5** | Painting is upright and the frame key is lower. Still a sepia ruin scene unrelated to SalarySync. Lantern hangs in black space with no chain or ceiling (1085-1145, 115-205). |
| ch4 Contact | 6.5 | **6.5** | Seen from above, the barrel's interior is a glowing pink-white disc with translucent flame cards standing inside it (860-1035, 320-440): it reads as a lit cup or candle, not a fire. Spot ellipse edge still cuts the floor (440-700, 380-900). Relief tilted and floating (1195-1355, 195-495). |
| Mobile 390 | 6.5 | **6** | ch0: barrel bottom-centre is fine-ish; embers form a dense blob band behind the CTA (0-390, 530-700). ch4: the barrel is cropped to a black puck with one flame card and a red glowing band at its base (175-325, 715-844); it reads as a candle on a hockey puck. |
| **Overall** | 6.7 | **7.0** | Subject swaps on ch0 and ch2 worked. The fire treatment (pink rim glow, flat flame cards) is now the weakest element, and it is on the first and last screens. Hard spot ellipses and blob embers persist for a fourth cycle. |

**ITERATE** (overall 7.0 < 8.5; ch0, ch2, ch3, ch4, mobile < 8).

## Top 5 reasons it still reads as slop

1. **The fire is the render primitive now.** Barrel swap removed the kit-bash, but the flame is still camera-facing cards and the barrel mouth glows as a flat pink-white disc (ch0 920-1065×455-485, ch4 860-1035×370-440). From the ch4 angle you look straight into a lit cup.
2. **Hard floor-spot ellipse, fourth cycle.** ch0 and ch4 both show a clean elliptical stage spot with a crisp edge. Firelight does not do that.
3. **Embers are bokeh blobs.** Same as c8: round, haloed, 5-8 px. On mobile ch0 they form a band behind the CTA.
4. **Floating props.** The relief (ch0/ch4) and the ch3 lantern have no contact with anything: no base, no chain, no shadow.
5. **ch2 too dark / ch1 and ch2 stands are bare cuboids.** The cuirass vanishes into brown mush; both stands are untextured boxes beside scanned objects (mixed fidelity).

## Top 5 fixes, ranked by visual gain per hour

1. **ch4 (6.5 < 7.5): swap the subject, do not tune the fire (≈45 min; ch4 +1.2, mobile +0.6).** Stop framing the barrel at ch4. Point the ch4 camera at one finished scanned object lit by a warm off-screen point light, with no flame cards in frame: either the existing relief, stood upright on the floor with a ground contact shadow, or a single Poly Haven / Sketchfab CC0 scanned lantern or candle-holder placed on the floor. The barrel may stay in the scene but out of shot; its glow reaches the subject only as light. Mobile ch4 uses the same subject, framed below the link row with ≥ 40 px clearance.
2. **ch0 fire: hide the mouth, kill the pink disc (≈30 min; ch0 +0.5, mobile +0.3).** In `src/scene/world/Fire.tsx`, remove the emissive/glow disc at the barrel mouth (or set it to deep orange at ≤ 30% of current intensity), and lower the ch0 camera a few degrees in `src/scene/camera/` so the rim is seen edge-on and the interior is not visible. Flame cards: more of them, narrower, additive with soft alpha, so no single card silhouette reads.
3. **Spot ellipses off for good (≈15 min; ch0 +0.3, ch4 +0.3).** `CHAPTER_SPOTS` ch0/ch4: penumbra 1.0 and widen the angle until the edge leaves the frame, or remove the spot and rely on the barrel's point light (distance-decay 2). Implementer attaches the ch0 and ch4 crops as proof; this has failed three cycles.
4. **Embers to sparks (≈20 min; ch0 +0.3, ch4 +0.2, mobile +0.3).** Ember size 1.5-3 px at 1440, no halo sprite, slight vertical stretch, count up and brightness down. On mobile cap density so no band forms behind text (keep 0-390×480-560 clear).
5. **Ground the props, lift ch2 (≈30 min; ch0 +0.2, ch2 +0.5, ch3 +0.3).** Relief: stand it on the floor, fully inside the ch0 frame (≤ 1360 px right edge), with a contact shadow. ch3 lantern: add a chain to the top of frame or drop it. ch2: add a cool rim light behind the cuirass (~30% of ch1's rim) and darken the stand; replace both stand cuboids (ch1, ch2) with one scanned stone plinth (Poly Haven) if one fits.

## Keep
- ch1 as is (8). Typography, copy and layout remain the strongest part.
- ch0 barrel swap (no pebble ring, no logs) and ch2 cuirass swap; ch3 upright painting.

**Verdict: ITERATE** (overall 7.0; only ch1 ≥ 8).
