# Critic cycle 6 (2026-11-09 02:35 IST)

Build: main @ 6d1ab75 (HEAD 984e83a differs only in `.orchestrator/STATE.md`). Fresh `npm run build`, served by a new
`npx vite preview --port 4370 --strictPort` (stopped after shots). Playwright Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c6-ch{0..4}.png` (1440x900), `critic-c6-ch0-390.png`, `critic-c6-ch4-390.png` (390x844).
Reference: aengel.io / landing.love captures from earlier cycles (not re-shot). No transition frames this cycle.
Console: 0 errors, 1 warning (`THREE.Clock` deprecated; unchanged).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c5 | c6 | One-line reason |
|---|---|---|---|
| ch0 Hero | 6.5 | **7** | Puck is gone; scanned boulder ring reads as a real fire pit, flame is smaller and the rectangle glow is gone. Still: kindling reads as crumpled paper and white wire (900-1060, 420-500), a row of pale faceted pebbles in front (875-1110, 545-610) looks like popcorn, and a hard diagonal spotlight edge cuts the left third (x≈460→560 at top). |
| ch1 About | 6 | **7** | Stepped block table gone, the x≈663 seam is now a soft falloff, statue is sharp and legible. The brick pedestal is a flat tiled texture with a uniform orange wash (920-1230, 490-820), and two candelabras are cropped by the bottom edge (870-990, 760-900) as if half-sunk in the floor. |
| ch2 Work | 5.5 | **6** | The shield now reads as a shield, but its face is blown out: near-white with smeared, low-res red blotches (1060-1270, 250-730). Its pedestal is invisible, so it floats. The corridor behind the bullets is still mush; a small bright bust (≈950, 715) sits right under the body text. |
| ch3 Projects | 6 | **6** | Painting is sharper, but still a sepia image unrelated to SalarySync, with a near-white mat that is the brightest thing on screen. The lantern still sits on the frame's top edge (1070-1160, 85-210); the "≥40 px gap" fix did not land. Stray dot at ≈(1025, 768) is still there. An unexplained warm blob bottom-left (0-250, 560-900) sits behind "Previous". |
| ch4 Contact | 5.5 | **6** | No more puck or cyan dots. New problem: from this lower angle the boulder ring reads as a big dark floating dish with a hard underside line (700-1300, 540-580) and the pale stones tucked under it like legs. Flame is small for the pit and still has a soft red oval column (900-1030, 290-430). The relief is cropped at the right edge (1270-1400) and its sculpt looks melted. |
| Mobile 390 | 5 | **6** | Scrim is now a soft fade; the hard rectangle is gone. ch0: the pit crown collides with "See the work" (y≈500-560), and the scrim's top edge is still visible as a line at y≈345. ch4: OK framing, but the white kindling sticks read as bones/wire. |
| **Overall** | 6.0 | **6.4** | Real progress: every c5 fix except the lantern landed, and the cheapest-looking primitive (puck) is gone. But each chapter still has one element that breaks the illusion, and ch2-ch4 have no single, well-lit, finished subject the way aengel does. |

**ITERATE** (overall 6.4 < 8.5; every chapter < 8).

## Top 5 reasons it still reads as slop

1. **Kindling and pebbles.** ch0/ch4/mobile: the logs inside the pit look like crumpled paper and white wire, and the loose pale pebbles in front are faceted and over-bright. This is the hero subject on two chapters and the first thing a visitor sees.
2. **Overexposed subjects.** ch2 shield face and ch3 painting mat are near-white, the brightest pixels on the page, and expose the low-res textures. aengel keeps its subject darker than its type.
3. **Floating objects.** ch2 shield has no visible base; ch4 boulder ring reads as a hovering saucer from the low camera; ch3 frame hangs on black with no wall. Nothing is grounded by contact shadow or a visible surface.
4. **Placement errors that look like bugs.** ch3 lantern sitting on the frame (again), ch1 candelabras cropped by the bottom edge, ch0/ch4 relief clipped by the right edge, ch0 mobile pit colliding with the CTA.
5. **Light shapes, not light.** Hard diagonal spotlight edge across the ch0/ch4 left third, the red oval flame halo in ch4, the unexplained warm blob behind ch3's pager. Each reads as a visible rendering primitive.

## Top 5 fixes, ranked by visual gain per hour

1. **Replace kindling, cut the pebbles (≈45 min; ch0 +0.5, ch4 +0.5, mobile +0.5).** In `Fire.tsx` / the pit asset: swap the white kindling for a Poly Haven scanned `dead_tree_trunk`/branch set or a Sketchfab CC0 scanned burnt-log pile with charred albedo (no near-white values; clamp albedo ≤ 0.35). Delete the loose pale pebbles in front of the ring, or replace with 2-3 darker scanned rocks half-sunk into the floor. In ch4 drop the flame halo opacity another 50% so no red oval reads.
2. **Expose the subjects down (≈30 min; ch2 +1, ch3 +0.5).** ch2: cut the shield wall spot intensity ~50% and narrow it to graze from the side so the rim and boss read and the face falls to mid-grey; raise the camera or the shield so its pedestal top is in frame (y ≤ 760). ch3: darken the mat to ≤ 40% luminance (aged paper, not white), and swap the image in `PAINTING_URLS` (`ProjectArtefact.tsx`) for a SalarySync screenshot toned sepia to match.
3. **Fix the three placement bugs (≈30 min; ch1 +0.5, ch3 +0.5, ch0/ch4 +0.3).** ch3: move the lantern up ≥ 0.3 m or off the frame's axis entirely (verify ≥ 40 px clear gap in the shot this time). ch1: move the two foreground candelabras fully into frame or out of it. ch0/ch4: shift the relief ~0.4 m left/in so it is fully in frame, or remove it from ch4.
4. **Ground ch4's pit (≈30 min; ch4 +1).** Raise the ch4 camera / lower its target so the ring is seen from above at ~25-30° like ch0, or sink the ring 0.1-0.15 m into the floor so the underside line disappears. Add a contact shadow under the ring (drei `ContactShadows` already fits, if present) instead of the dark gap.
5. **Soften the light shapes (≈30 min; ch0 +0.3, ch3 +0.3, ch4 +0.3, mobile +0.3).** Raise `penumbra` to ≥ 0.9 on the hero/contact spot that makes the left diagonal edge (`CHAPTER_SPOTS` ch0/ch4) or widen its angle so the edge falls off-screen. Find and remove the warm source behind ch3's pager (0-250, 560-900) and the stray dot at ≈(1025, 768). Mobile: start the scrim fade 80 px higher so its top edge is not a line, and move the ch0 mobile camera so the pit sits ≥ 40 px below "See the work".

## Keep
- Typography, copy and desktop layout remain the strongest part.
- Boulder pit base, ch1 statue framing, soft ch1 falloff, mobile scrim fade, warm-only embers.

**Verdict: ITERATE** (overall 6.4; no chapter ≥ 8).
