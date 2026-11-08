# Critic cycle 5 (2026-11-09 01:45 IST)

Build: main @ 1b7a6d7 (HEAD 1f8aac2 differs only in `.orchestrator/STATE.md`). Fresh `npm run build`, served by a new
`npx vite preview --port 4360 --strictPort`. Playwright headed Chrome, 10 s settle per shot.
Shots: `.orchestrator/reference/critic-c5-ch{0..4}.png` (1440x900), `critic-c5-ch0-390.png`, `critic-c5-ch4-390.png` (390x844).
Reference: `aengel-03-project-chapter.png` (re-read) and the landing.love bench captures (not re-shot).
Console: 0 errors, 1 warning (unchanged). No transition frames this cycle.

## Scores (vs aengel.io / landing.love refs)

| Chapter | c4 | c5 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7 | **6.5** | Flame is 2x bigger, and that exposes it: a flat cartoon flipbook sprite with a reddish rectangular glow behind it (edges ~x 905/1110). The plinth is still a black puck with a glowing orange rim line, the kindling reads as crumpled paper and white wire, the relief is still an over-bright ivory slab hugging the right edge. |
| ch1 About | 6 | **6** | Heading now settles fully ("lately agent tools." fixed). The x≈663 vertical seam is still there, top to bottom: black left, lit orange right, nothing casts it. Foreground candelabra stands on stepped, untextured blocks (x 750-1080, y 730-900) next to a scanned statue. |
| ch2 Work | 5 | **5.5** | Floating beams gone, scanned shield on a pedestal is in frame. But at this light and blur it reads as a red/white marbled pebble, not a shield. Corridor is still mostly near-black mush with blurred clutter bottom-centre; no clear lit subject. |
| ch3 Projects | 6 | **6** | Lantern no longer clips the nav, but now sits on the frame's top edge (~1110, 210) like a crown. Painting is still a blurry sepia image unrelated to SalarySync; depth of field softens the one object meant to be read. Stray bright dot at ~(1025, 768). |
| ch4 Contact | 5 | **5.5** | Camera pullback landed, the pit is smaller. Still: black puck with a peach glowing top band (reads as a tealight or cake), flat flame sprite with a hard-sided red glow column (x≈825 and ≈1105), teal/cyan bokeh dots in the ember field that are off-palette. |
| Mobile 390 | 5 | **5** | The scrim is now a hard-edged dark band: ch0 y≈343-535, ch4 y≈300-580. The bottom edge is a straight cut from 0.75 to clear; it reads as a rectangle pasted over the scene. Fire below is a blurred orange smear. |
| **Overall** | 6 | **6.0** | Fixes landed (ch1 heading, ch4 framing, ch2 beams) but scaling up the flame traded one problem for another. Every chapter still has one cheap-looking element in its lit area. aengel shows one dark, perfectly finished object; we show a lit object plus a seam, a sprite or a puck. |

**ITERATE** (overall 6.0 < 8.5; every chapter < 8).

## Top 5 reasons it still reads as slop

1. **The fire is a 2D sprite.** ch0/ch4: at 2x scale the flipbook is visibly flat, cartoon-shaded, with a reddish rectangular glow behind it. This is the hero subject on two of five chapters, and it now looks like a sticker.
2. **The plinth puck.** ch0 (880-1100, 530-630) and ch4 (815-1120, 550-680): a smooth black cylinder with an emissive peach band around its top. Nothing else in the scene is that clean. It says "primitive".
3. **Hard seams, still.** ch1 vertical split at x≈663; mobile scrim bottom edge (ch0 y≈535, ch4 y≈580). Both read as layout bugs.
4. **Subjects you cannot read.** ch2 shield is a marbled blob; ch3 painting is blurred sepia with no relation to the project; ch1 statue is soft from depth of field. The camera points at objects, then blurs or underlights them.
5. **Off-palette, preset-looking particles.** ch4 ember field has cyan/teal dots among the orange; round evenly bright bokeh over the whole top half of ch4 and mobile reads as a particle preset.

## Top 5 fixes, ranked by visual gain per hour

1. **Kill the rectangle glow and shrink the flame back (≈30 min; ch0 +0.5, ch4 +0.5).** `src/scene/world/Fire.tsx`: remove or radially mask the `#ff8a3d` glow element (~L120-130) so no straight edge shows; drop flame billboards to ~1.3x the c4 size and lower their opacity so the flame reads as light, not a drawing. Tint every ember warm (no blue/cyan channel; clamp hue to 15-40°) and cut ember count/size on ch4 by half.
2. **Fix the two seams (≈30 min; ch1 +1, mobile +1).** `src/ui/sections/sections.css:387`: the mobile `.chapter-view::before` must also fade out at the bottom, e.g. `0% → 0`, `25% → .75`, `75% → .75`, `100% → 0`, and extend `inset` bottom to ~-48px so the fade happens over the scene, not at text edge. ch1: find the plane or light-cone boundary at x≈663 in `Sanctum.tsx` / ch1 spot in `CHAPTER_SPOTS` and widen its penumbra (spot `penumbra` ≥ 0.8) or move the occluder out of frame.
3. **Replace the puck (≈1 h; ch0 +1, ch4 +1).** Swap the plinth cylinder for a scanned stone base: Poly Haven `stone_fire_pit` or a Sketchfab CC0 scanned stone ring / millstone, dark rock material, no emissive band. If no asset fits within the hour, at minimum remove the emissive rim and apply the existing dark pit stone material with a Poly Haven rock normal map.
4. **Make ch2 and ch3 subjects legible (≈45 min; ch2 +1, ch3 +1).** Reduce depth-of-field blur on the chapter subject (focus distance = subject distance, or bokehScale ≤ 1 in `Effects.tsx` for ch1-3). ch2: aim the right sconce/spot directly at the shield face, raise its key so the metal rim and boss read; move it to x 950-1250, y 350-650. ch3: lower the lantern ~0.3 m so it hangs clear above the frame (gap ≥ 40 px), and replace the sepia painting with a SalarySync UI screenshot via `PAINTING_URLS` in `ProjectArtefact.tsx`; remove the stray light dot at ~(1025, 768).
5. **Clean ch1 foreground and the relief (≈45 min; ch1 +0.5, ch0/ch4 +0.5).** ch1: delete or sink the stepped block table under the foreground candelabra (x 750-1080, y 730-900), or replace it with a scanned wooden table; keep the candles. ch0/ch4: lower the relief's emissive/albedo so it's no brighter than the lit floor, and rotate it 25-30° toward the fire so it reads as an object in the room, not a card at the edge.

## Keep
- Typography, copy and desktop layout: the strongest part of the site.
- ch1 heading reveal fix, ch4 camera distance, ch2 beam removal.

**Verdict: ITERATE** (overall 6.0; no chapter ≥ 8).
