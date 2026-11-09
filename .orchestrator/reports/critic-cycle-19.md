# Critic cycle 19 (main @ a595b94: r25 fire glow removal + ch4 flame cap, effigy warm stone, DPR floor, ch1 plinth, ch3 hang, ch2 stand). DESKTOP ONLY

## BLOCKER: main renders a black page in every chapter

`npm run build` passes (chunk-size warning only), but at runtime the app throws
`TypeError: Cannot read properties of undefined (reading 'set')` at `src/scene/world/EffigyKnight.tsx:23`
(`mat.emissive.set("#000000")`, added in cad69ba). The effigy scan's material has no `emissive`
property (it's an unlit/basic material), so the throw inside `useMemo` unmounts the whole React root.
Result: `<div id="root"></div>`, no canvas, a black screen at ch0-ch4 and both sizes.
The first shot pass on unmodified main confirmed this: 10/10 shots were black, with `canvas=none`.

**Fix (one line):** `mat.emissive?.set("#000000");`. Better still, replace the material with
`new THREE.MeshStandardMaterial({ map: oldMat.map, color: "#8a7560", roughness: 0.9 })`. The scan is
unlit, so it can't respond to the firelight however the color is graded. That's why it still looks
green (see ch0/ch4 below).

As shipped, main scores **0**.

## Method

Build: `npm run build` passed.
Preview: `vite preview --port 4440 --strictPort` (pid 39114). Killed by pid after the shots; lsof confirms 4440 is free.
Shots: Playwright Chrome (headed, real GPU), a fresh page per chapter, `?skipgate&chapter=N`, 16 s settle.
- `.orchestrator/reference/critic-c19-ch{0..4}-1920.png`: 1920x1080, DPR 1
- `.orchestrator/reference/critic-c19-ch{0..4}-1512.png`: 1512x982, DPR 2

**The scored shots come from a local patched build**: the one-line `emissive?.` guard was applied,
built and shot, then reverted with `git checkout`. src is clean. `dist/` still holds the patched
build; rebuild before any deploy.
Console on the patched build: 0 errors and 1 warning per load (`THREE.Clock` deprecation).
Canvas at 1512 DPR2: 2268x1473 on **all five** chapters. The DPR floor fix held, and there was no ch3 drop this time.
Coordinates are CSS px.

## Scores (patched build; worse of two sizes)

| Chapter | c18 | 1920 | 1512 | **c19** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.3 | 8.4 | 8.4 | **8.4** | The glow disc is gone; the back wall now reads as dark stone, not a sprite. The flame is clean. The effigy is still a green-moss lump (x 1380-1780, y 670-760). The bottom ~35% is still empty floor. |
| ch1 About | 8.3 | 8.5 | 8.5 | **8.5** | The plinth now covers the statue's base and reads as a block. The corner edge is mostly fogged, though a faint diagonal remains at bottom right (x 1700-1920, y 880-1060). The plinth texture is still clay-like. |
| ch2 Work | 7.2 | 7.9 | 7.7 | **7.7** | The stand grounds it: it no longer floats, and the copy is clear at 1512 (~95 px gap). The scan's neck/shoulder rim is still ragged and gnarled (1920 x 1330-1790, y 195-330), and the left armpit is torn (x 1390-1430, y 560-620). At 1512 the armour nearly touches the right edge (≈44 px). The stand is spindly and reads as a sawhorse. |
| ch3 Projects | 8.1 | 8.4 | 8.4 | **8.4** | The hang now works: the chain runs into the frame top, and it's sharp at DPR 2. The lantern core reads as a small bright pendant, not a lantern. The hard vertical wall band is still visible (1920 x 1120-1190, full height), and so is the floor diagonal at bottom (x 1200-1260, y 990-1060). |
| ch4 Contact | 8.1 | 8.3 | 8.3 | **8.3** | The disc is gone and the flame tip now sits ~200 px under the nav at both sizes. The outer smoke lobe on the left reads as a ghostly face/blob (1920 x 1090-1270, y 400-620). The effigy is a yellow-green blob behind the barrel (x 1350-1690, y 800-900). |
| **Overall** | 8.0 | 8.3 | 8.3 | **8.3** (patched) / **0** (main as merged) | Every r25 lane landed and helped. ch2 is still below 8, and main is crashed. |

**NOT SHIP / ITERATE.** Main crashes on load. Even when patched, overall is 8.3 < 8.5 and ch2 is at 7.7 < 8.

## Top defects per chapter

### ch0 Hero
1. The effigy is green and unlit. The material grade can't work on an unlit material, so swap it for MeshStandardMaterial (see Blocker).
2. The bottom ~35% is empty floor. Lower the camera target ~0.2 m or move the fire group down/forward.
3. The barrel's top rim has a hard bright ring (x 1200-1380, y 575) with a dark gap above it before the flame starts. Seat the flame base lower into the barrel.

### ch1 About
1. The plinth surface reads as mud/clay. Halve the bump/displacement and add a chamfered top edge or a cap slab.
2. A faint room-corner diagonal remains at bottom right. Add more fog there, or end the floor plane earlier.

### ch2 Work (blocker below 8)
1. The scan's top rim and armpit are torn. Rotate a further ~20° so the open neck faces away, or tilt the camera down slightly so the neck hole sits in shadow. Alternatively, add a dark gorget/cap mesh over the neck opening.
2. The armour crowds the right edge at 1512. Move it ~60 px left (there is now room: the copy gap is 95 px) or scale it 0.92.
3. The stand is a thin sawhorse. Thicken the post ~1.5x, or give it a heavier base (a cross-foot with a block). Keep the warm wood.
4. Add a warm rim/key on the plate. The breastplate is mostly black, and only the shoulder edges catch light.

### ch3 Projects
1. The vertical wall band is still a hard stripe (carried from c17/c18). Fade it with a fog card or remove that wall segment.
2. The lantern reads as a jewel pendant. Scale it ~1.5x and add a soft point light (#ffb060, distance 1 m) so it lights the frame top.
3. The floor diagonal at bottom centre is still visible.

### ch4 Contact
1. The left smoke lobe reads as a ghost face. Reduce the outer shell's opacity on the left, or randomize its noise offset.
2. The effigy is a yellow-green blob (same root cause as ch0).
3. The barrel fills the frame centre with flat, low-detail metal. Add a darker roughness/AO band, or pull the camera back ~10%.

## Cross-vendor check (advisory; the critic score above stays the gate)

`bun tools/or-vision-review.ts` on the five 1920 shots (patched build). All 5 answered on the first model
(`nvidia/nemotron-3.5-super-vl:free`), so it used 5 requests. The counter reads 6/40 for today, so one
earlier request was already logged. The key was never printed.
The model's pixel coordinates are on a downscaled image (~1000 px wide); multiply by ~1.9 to map to 1920.
Its scores are on a harsher, uncalibrated scale (it gives 4-6 to everything), so read the deltas, not the absolute numbers.

**Contrast, measured.** WCAG ratio of the 99.5th-percentile glyph pixel against the median background, per text block:

| Block | Text | Ratio |
|---|---|---|
| ch2 card paragraph (x 673-1120, y 570-640) | rgb(237,232,225) | 16.1:1 |
| ch2 card bullets (x 673-1100, y 665-745) | rgb(180,173,161) | 8.8:1 |
| ch2 "Chennai" meta | rgb(152,144,132) | 6.5:1 |
| ch1 labels "Based in / Studied" | rgb(154,146,134) | 6.6:1 |
| ch3 body / tech line | 180,173,161 / 154,146,134 | 9.1:1 / 6.6:1 |
| ch0 / ch4 body | rgb(237,232,225) | 17.1:1 / 17.0:1 |
| nav links | rgb(221,217,210) | 14.8:1 |

Every block passes AA (4.5:1), and all body copy passes AAA (7:1). **The c18 ch2 LOW-CONTRAST flag on the card does not
reproduce in c19**: the card paragraph is 16.1:1 and the bullets are 8.8:1. The model flags "low contrast" on every
dark-background shot regardless of the pixels, so I treat it as a prior, not an observation.

| Shot | OR score | Defects it flagged that I did not | Verdict |
|---|---|---|---|
| ch0 | 5 | Body copy low contrast | **Reject**: measured 17.1:1. |
| | | Embers read as digital noise (≈ x 1090-1460, y 260-575) | **Partial**: at 1920 the embers are uniform 2-3 px dots of one size and brightness, which can read as speckle. Low priority: vary their size and brightness, and add a slight motion streak. |
| | | Bottom-left "Chennai, 7:51 pm" reads as debug UI | **Reject**: it's an intentional locale clock, consistent on every chapter. |
| ch1 | 5 | Grey labels illegible | **Reject**: measured 6.6:1. |
| | | (Muddy pedestal) | Already in my list, so it's agreement, not new. |
| | | White serif on black causes halation | **Reject**: the text is warm off-white (237,232,225), not pure white. It's a taste call, not a defect. |
| ch2 | 6 | Card body low contrast | **Reject**: measured 16.1:1 / 8.8:1 (the known c18 flag, re-checked). |
| | | Stand base has no contact shadow (≈ x 1340-1740, y 890-990) | **Accept**: the cross-feet sit on a barely lit floor with no darkening under the feet, which adds to the sawhorse read. Add a soft contact shadow/AO blob under the stand. Added to ch2 fixes. |
| | | Nav links too small | **Reject**: 14.8:1, a site-wide style that's out of scope for a chapter critic. |
| ch3 | 4 | Body copy critically low contrast | **Reject**: measured 9.1:1. |
| | | Screen content in the frame is illegible blur | **Reject**: at 1920 it reads clearly as a dashboard (table rows, gauge, line chart). It's a glyph, not meant to be read. |
| | | Nav lacks a hover state | **Reject**: it can't be judged from a still. |
| ch4 | 5 | Flame detaches from the barrel rim, looks pasted (≈ x 1055-1345, y 620-640) | **Accept**: same root cause as my ch0 #3. The bright rim ring with no flame root reads as a sticker. Seat the flame base inside the barrel and add a glowing coal/ember layer at the rim. |
| | | Body copy illegible | **Reject**: measured 17.0:1. |
| | | Email link looks like a typo | **Reject**: it's the gold accent with an underline, clearly a link. |

Net effect: 2 accepted (ch2 contact shadow, ch4 flame root) and 1 partial (ember speckle). No score changes:
ch2 stays 7.7 and ch4 stays 8.3, because both defects were already within the margin I scored.

## Keep
- The glow-disc removal (ch0/ch4): the walls now read as stone in shadow.
- The ch4 flame cap: good headroom under the nav at both sizes.
- The DPR floor: 2268x1473 on every chapter at 1512.
- ch2's stand concept: grounding fixed the worst c18 defect.
- ch3's chain + hook hang, and ch1's wider plinth.
- Embers, and 0 console errors on the patched build.
