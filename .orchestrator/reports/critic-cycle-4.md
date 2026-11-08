# Critic cycle 4 (2026-11-09 00:05 IST)

Build: main @ e4c9e6a (HEAD da384b0 differs only in `.orchestrator/STATE.md`). Fresh `npm run build`, served by a new
`npx vite preview --port 4350 --strictPort` (port was free). Playwright headed Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c4-ch{0..4}.png` (1440x900), `critic-c4-ch0-390.png`, `critic-c4-ch4-390.png` (390x844).
References: `aengel-03-project-chapter.png` and the landing.love bench captures (existing; not re-shot).
Console: 0 errors, 1 warning (the `THREE.Clock` deprecation, unchanged). No transition frames this cycle.

## Scores (vs aengel.io / landing.love refs)

| Chapter | c3 | c4 | One-line reason |
|---|---|---|---|
| ch0 Hero | 6.5 | **7** | Floor fix landed: the ground now falls off to black and the fire is the subject. Still a small flame on a smooth, glowing tan "puck" plinth, off-white crumpled ring stones, round bokeh embers, and the ivory relief slab reads as a bar of soap cut by the right third. |
| ch1 About | 5 | **6** | Biggest gain: the candelabra lights the statue and it finally reads. But a hard vertical seam at x≈665 splits the frame into black/orange halves, the room is a flat orange box with a visible corner (~1300), the candelabra is chunky low-poly next to a scanned statue, and the heading renders as "lately ag" with the rest faded out after 10 s. |
| ch2 Work | 5 | **5** | Shield moved off the text, but now it's a huge matte beige disc cropped by the bottom-right edge, reading as a drum skin. Corridor is muddy brown, floating brown slab beams top-right, armour prop sits directly under the second bullet. Still no lit subject. |
| ch3 Projects | 6.5 | **6** | The lantern is no longer cut by the nav, but it now sits on/through the frame's top-right corner (intersection at ~1060-1150, 200-250). Painting is still a generic sepia image. Soft orange vertical band still runs down the left-centre behind the body copy. |
| ch4 Contact | 5.5 | **5** | The flame is real now but the close-up makes the pit the worst object on the site: faceted low-poly logs, crude black boulders, glowing pink-tan rim, relief cut by the right edge, a thin red horizontal streak at ~860-1060, 318. |
| Mobile 390 | 4 | **5** | Fire now sits below the CTAs (fixed). New problem: the text panel has a hard top edge (ch0 y≈343, ch4 y≈297), a visible dark rectangle. ch0 "See the work" still overlaps the rocks. |
| **Overall** | 5.5 | **6** | Real progress: one lit subject per chapter in ch0/ch1, ground no longer dominates. But every close look hits low-poly or untextured geometry, and two hard-edged UI/scene seams are new. References show one flawless object in black; we show a decent object surrounded by cheap ones. |

**ITERATE** (overall 6 < 8.5; every chapter < 8).

## What changed since cycle 3
- `078ce1c` floor falloff, hearth stone hidden, ch1 candle light, ch2 shield right + sconce, darker pit stone. Floor and ch1 light landed well.
- `831ee2e` CC0 flame flipbook: a real flame now burns, but it's ~60 px tall at 1440 and too small to carry the hero.
- `fbdf29e` ch4 camera raised: it now shows the coals, and the coals are the problem.
- Not done: plinth rim swap, relief rotate/replace, ch3 painting, scrollbar.

## Top 5 reasons it still reads as slop

1. **The fire pit is low-poly and the camera keeps getting closer to it.** ch4 (and mobile ch4): logs are 6-8-face boxes with hard specular facets, boulders are dark lumps with no texture detail, the plinth rim glows pink-tan like plastic. ch0 hides this with distance; ch4 puts it at 60% of the frame.
2. **Hard seams.** ch1: vertical light/dark split at x≈665 from top to bottom, with no object casting it. Mobile ch0/ch4: the text scrim's top edge is a hard horizontal line (`sections.css:388`, gradient starts at 0.70 instead of 0). Both look like layout bugs.
3. **Mixed fidelity in every lit shot.** ch0: scanned relief next to the smooth puck plinth. ch1: scanned statue next to a chunky candelabra and a flat box room. ch2: scanned armour next to the untextured shield disc and floating slab beams.
4. **ch2 still has no subject, and ch3's artefact still says nothing.** ch2 is a muddy corridor with a cropped beige disc. ch3's lantern now collides with the frame, and the sepia painting is unrelated to SalarySync.
5. **Visible glitches.** ch1 heading stuck at "lately ag" (rest faded) after 10 s settle; ch4 red horizontal streak at ~(860-1060, 318); round, evenly sized bokeh embers (ch0/ch4) read as a particle preset.

## Top 5 fixes, ranked by visual gain per hour

1. **Pull ch4 back and shrink the pit's screen share (≈30 min; ch4 +1.5, mobile +0.5).** `chapterLook.ts` ch4: move the camera back ~1.5x and lower it so the pit fills ≤25% of frame, lower-right, with the flame as the brightest point; let the dark floor and wall fill the rest. Keep the email over black. Don't show the coals at this distance until fix 4 lands.
2. **Fix the two hard seams and the ch1 heading (≈30 min; ch1 +1, mobile +1).** `sections.css:388`: make the mobile `.chapter-view::before` gradient start at 0 and ramp to ~0.75 over the first 30% (and drop `border-radius`). ch1: find what draws the x≈665 edge (likely a wall/occluder plane in `Sanctum.tsx` or the chapter's spot cone; it isn't `.sections-scrim-left`, which fades to 0) and soften or remove it. ch1 heading: find why "lately agent tools." stays masked at `?chapter=1` (reveal animation not completing) and make it settle fully visible.
3. **Give ch2 a subject (≈1 h; ch2 +2).** Delete the shield, or replace it with a Poly Haven/Sketchfab CC0 scanned metal shield (metalness ~0.8, roughness ~0.45) fully in frame at x 1000-1300, y 400-700, lit by the right-arch sconce as the one bright object. Remove the floating slab beams top-right. Move the armour prop out from under the bullet list (x > 1000) or delete it.
4. **Replace the low-poly pit parts (≈1 h; ch0 +0.5, ch4 +1).** Swap the faceted logs/coals for a scanned CC0 firewood or burnt-log asset (Poly Haven `dead_tree_trunk`/log scans, or a Sketchfab CC0 campfire scan); give the ring boulders a scanned rock texture (Poly Haven `rock_moss_set`/`boulder_01`) instead of flat black. Replace the glowing tan plinth rim with the dark pit stone material. Scale the flame billboards up ~2x so the flame reads at hero distance.
5. **ch3 and ch1 props (≈45 min; ch3 +1, ch1 +0.5).** ch3: lower the lantern ~0.25 m and move it forward so it hangs above, not into, the frame; put a real SalarySync screenshot on the canvas (`PAINTING_URLS` in `ProjectArtefact.tsx`); kill or narrow the left-centre orange band behind the copy. ch1: darken the room walls to near-black so the box corner disappears; swap the chunky candelabra for a scanned candle cluster or the Poly Haven lantern already used in ch3. Also: turn the ch0/ch4 relief 25-30° or remove it, and hide the scrollbar (`index.css`, `scrollbar-width: none`).

## Keep
- ch0's new floor falloff and ch1's single warm practical on the statue: that's the lighting model to copy.
- Typography and copy remain the strongest part of the site.

**Verdict: ITERATE** (overall 6; no chapter ≥ 8).
