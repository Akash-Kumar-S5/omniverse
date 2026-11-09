# Critic cycle 7 (2026-11-09 04:45 IST)

Build: main @ 053992d (HEAD d6df384 differs only in `.orchestrator/STATE.md`). Fresh `npm run build`, served by a new
`npx vite preview --port 4380 --strictPort` (killed after shots, port confirmed free). Playwright Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c7-ch{0..4}.png` (1440x900), `critic-c7-ch0-390.png`, `critic-c7-ch4-390.png` (390x844).
Reference: aengel.io / landing.love captures from earlier cycles (not re-shot). No transition frames this cycle.
Console: 0 errors, 1 warning (`THREE.Clock` deprecated; unchanged).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c6 | c7 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7 | **6.5** | The white-wire kindling is gone, but the pit got busier, not cleaner. The inner rim is now a ring of thin, flat, pale-edged slabs that read as cardboard or paper plates (800-1220, 420-470). Outside it sits a second ring of ~30 small faceted rocks with pale tips (730-1260, 530-690): two concentric rings read as a craft project, not a fire pit. The floor spot is a hard-edged ellipse (620-1440, 520-760). The relief is in frame now but blown out to cream (1285-1410, 335-625). The embers stack into a neat vertical cone (900-1130, 60-420) that looks like a Christmas tree. |
| ch1 About | 7 | **7.5** | Foreground candelabras are gone and the statue is the clear, well-lit subject. Still a flat tiled-brick box with a uniform orange wash (900-1270, 490-820) that is bigger than the statue and reads as a texture swatch. Three small unlit candlesticks on its top (915-1235, 445-505) add nothing. Warm vertical wall band at the right edge (1300-1440, 0-900) reads as a light leak. |
| ch2 Work | 6 | **6** | The pedestal is visible now, so the shield no longer floats. But "shield toned" did not land: the face is still near-white beige with smeared low-res red blotches (1070-1250, 210-630) and is still the brightest thing on screen. The small bright bust/lantern sits right under the bullets (800-860, 665-720). The corridor behind the text is still dark mush. |
| ch3 Projects | 6 | **6.5** | Stray dot and warm blob are gone; the mat is darker. The lantern fix overshot: it now hangs from the top edge, cropped and crowding the nav (1060-1155, 0-120). The painting is a soft, low-res sepia smear with no subject (885-1130, 265-570), still unrelated to SalarySync. The frame hangs on pure black with no wall, so it reads as a floating rectangle. |
| ch4 Contact | 6 | **6.5** | The top-down camera fixed the floating saucer; the ring reads as grounded. But the crossed logs are pale blond/white sticks (830-1040, 330-470), not charred, so the "charred scanned logs" change is not visible from this angle. The inside of the ring is an empty flat sand bowl and the fire is small for it. The same busy outer ring of pale-tipped pebbles (620-1250, 500-730) looks like teeth. A hard spot ellipse edge cuts the lower left (460-700, 600-900). The relief is blown-out cream and melted-looking (1210-1355, 200-490). |
| Mobile 390 | 6 | **6** | ch0: the pit now clears "See the work" (fix landed), but a grainy speckle cloud sits in the top-right corner (290-390, 0-150) and looks like a render glitch. The "Chennai 4:43 am" clock sits on top of the stones (y≈820) in both shots. ch4: framing fine, but the logs read as white bones and the pit is cut by the bottom edge. |
| **Overall** | 6.4 | **6.5** | ch3 placement bugs, the ch4 floating dish and the mobile CTA collision are fixed. The hero subject on ch0/ch4 is still the weakest asset on the site, and the ch2 shield did not change at all. No chapter is near 8. |

**ITERATE** (overall 6.5 < 8.5; every chapter < 8).

## Top 5 reasons it still reads as slop

1. **The fire pit is a kit-bash, not an object.** ch0/ch4/mobile: a dark boulder ring, a flat pale slab rim, and a loose outer ring of pale-tipped pebbles, with pale sticks on top. Four materials at four fidelities in one object, and it is the first thing a visitor sees. aengel shows one finished subject.
2. **Overexposed hero textures.** ch2 shield face and ch0/ch4 relief are near-white cream, the brightest pixels on screen, which exposes their low-res, smeared textures. The subject should be darker than the type.
3. **Visible light shapes.** Hard floor-spot ellipses on ch0 and ch4, the neat cone of embers on ch0, the warm wall band on ch1, the speckle cloud on mobile. Each reads as a rendering primitive.
4. **Objects on black void.** ch3 frame has no wall; ch2 corridor and ch0 background are mush. Nothing gives the scene a believable space around its subject.
5. **Placement still hit-and-miss.** ch3 lantern now cropped at the top and over the nav; ch2 bright bust under the bullets; mobile clock over the stones.

## Top 5 fixes, ranked by visual gain per hour

1. **Simplify the pit to one ring (≈45 min; ch0 +0.7, ch4 +0.7, mobile +0.5).** Delete the outer ring of small pale-tipped pebbles entirely and the flat pale slab rim; keep only the continuous dark scanned rock ring. Clamp the logs' albedo to ≤ 0.3 (they read white in ch4 and mobile) or swap for a darker Poly Haven scanned charred log. Fill the ring's floor with a dark ash/char decal or darker floor material so it is not an empty sand bowl, and scale the flame ~1.4x so it fills the ring.
2. **Tone down the shield and relief (≈30 min; ch2 +1, ch0 +0.3, ch4 +0.3).** The c6 shield fix did not land. Multiply the shield face albedo by ~0.4 (or swap the texture for a darker scanned shield) and drop its key-light intensity ~50% so the face sits mid-grey with the rim catching light. Same treatment for the relief panel on ch0/ch4: albedo ×0.5, light it from the side.
3. **Kill the visible light shapes (≈30 min; ch0 +0.3, ch1 +0.3, ch4 +0.3, mobile +0.3).** `CHAPTER_SPOTS` ch0/ch4: penumbra ≥ 0.95 and widen the angle so the ellipse edge falls off-screen. Randomise ember spawn x/z across the pit radius so they stop forming a cone. Remove the right-edge warm wall band on ch1. Find the mobile top-right speckle cloud (likely `Starfield`/`SignalField` at narrow aspect) and cull or hide it at < 600 px.
4. **Fix ch3 and ch2 placement (≈20 min; ch3 +0.5, ch2 +0.3).** ch3: lower the lantern so its full body sits in frame with ≥ 40 px clear above the frame and ≥ 60 px below the nav (target y≈110-200). Put a dark plaster or stone wall plane behind the frame. ch2: remove or dim the small bright bust under the bullets (≈830, 690).
5. **ch1 pedestal and ch3 painting textures (≈45 min; ch1 +0.5, ch3 +0.5).** ch1: replace the tiled brick box with a Poly Haven scanned stone plinth or a darker rough stone material, and cut its height ~25% so the statue dominates; drop the three unlit candlesticks. ch3: swap the painting image in `PAINTING_URLS` (`ProjectArtefact.tsx`) for a sharp SalarySync screenshot toned sepia (the c6 ask, still open). Mobile: move the clock above the pit or hide it at < 600 px.

## Keep
- Typography, copy and desktop layout remain the strongest part.
- ch1 statue framing with clear foreground; ch4 top-down pit angle; ch2 pedestal now visible; ch3 clean of stray dot and blob; mobile ch0 pit clear of the CTA.

**Verdict: ITERATE** (overall 6.5; no chapter ≥ 8).
