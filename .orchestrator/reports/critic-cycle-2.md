# Critic cycle 2 (2026-11-08 20:39 IST)

Build: main @ 81154dc (HEAD e93968d differs only in `.orchestrator/`; `git diff 81154dc -- src public` is empty).
Production build (`npm run build`), served by `npx vite preview --port 4330`, Playwright headed Chrome with a real GPU
(ANGLE Metal, Apple M3 Pro), 8 s settle per shot.
Shots: `.orchestrator/reference/critic-c2-ch{0..4}.png` (1440x900), `critic-c2-ch0-390.png`, `critic-c2-ch4-390.png` (390x844).
References: the same ones as cycle 1 (`aengel-03-project-chapter.png`, `bench-seed-2.png`).
Console: 0 errors. The cycle-1 LoadProgress setState error is gone. One warning remains (`THREE.Clock` is deprecated).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c1 | c2 | One-line reason |
|---|---|---|---|
| ch0 Hero | 3 | **6** | Now a real scene: a lit fire pit on a plinth, warm key light, black falloff. Let down by a matte untextured plinth, oversized bokeh embers and no visible flame. |
| ch1 About | 4 | **4** | The statue is a dark silhouette, and the subject is a sand-coloured particle blob (the "bust" shape) next to it. Untextured box furniture fills the frame. |
| ch2 Work | 4 | **4** | The corridor is lit so dark it's just black. A glitter column runs down the right edge, and a flat, over-exposed orange shield sits under the bullets. |
| ch3 Projects | 3 | **3** | A dense particle blob sits dead centre, over the body copy. The painting is small, grey and dim in the right third. |
| ch4 Contact | 2 | **6** | Same strengths as ch0, closer in. The close-up shows faceted low-poly coals, a flat-backed relief slab and smoke with no flame. It also repeats the ch0 shot. |
| Mobile 390 | 3 | **4** | The fire is visible now, but it sits directly behind the body text, and the plinth bands fill the bottom 40% with nothing. |
| **Overall** | 3 | **4.5** | Two chapters read as a real place now. Three still lead with a particle blob, and that blob is what makes it look like slop. |

**ITERATE** (overall 4.5 < 8.5; every chapter < 8).

## What changed since cycle 1
Cycle-1 fix #2 (a real fire, relit from it) landed and is the whole gain. `Fire.tsx` adds the Poly Haven pit,
a warm point light with flicker and a flame billboard. `World.tsx` cuts the scene to one cold moon key plus ambient
0.03. Cycle-1 fix #1 (kill the particle blobs) landed **only for ch0 and ch4**. `CHAPTER_SHAPE` in `src/state/signal.ts:12`
still maps about→`bust`, experience→`helix` and projects→`project-glyph`, and those three shapes are the blobs in ch1, ch2 and ch3.

## Top 5 reasons it still reads as slop

1. **Particle blobs are still the subject in 3 of 5 chapters.**
   - ch3: a roughly 300x400 px glitter cloud sits centre-frame, directly behind "Built with Laravel…" and the italic subtitle.
   - ch1: a sand-grain cloud fills the right third and swallows the statue.
   - ch2: a vertical glitter column runs down the right 15%. This is the known bug.

   These are the clearest "AI demo" tell left on the page. Remove them and those three chapters gain at least 2 points each.

2. **Mixed fidelity, and the cheap side is still in frame.**
   - ch0 and ch4: the plinth is a smooth untextured double cylinder with a plastic look, and it fills about 40% of the frame.
   - ch4 close-up: the fire-pit coals are large flat-shaded facets. They read low-poly, as if the normal map is missing or
     lost in the Draco/JPEG export (`blender/scripts/compress_fire_pit.py`; not verified).
   - The relief statue beside the fire is a thin slab with a cut-off back edge.
   - ch1: the pillar, tables and benches are untextured brown boxes.
   - ch2: the shield is one flat orange disc with no wear and no metal response.

3. **The fire has no flame.** The flipbook billboard in `Fire.tsx` renders as faint smoke wisps (ch4, centre). The pit
   glows like a lamp and nothing burns. The ember sprites around it are big soft bokeh discs, 6-12 px, in a mix of
   orange and blue-white. SEED's particles work because they are tiny, warm and sit behind a sharp subject. These
   read as a dusty lens.

4. **Lighting stops at the fire.** ch1, ch2 and ch3 have no warm practical source. The corridor (ch2) and gallery (ch3)
   are almost pure black. The ch3 painting, the only good object there, is grey and unlit. ch2's one lit object is an
   over-exposed orange shield. Each chapter needs one practical light on its one subject. Right now it's either the fire or nothing.

5. **Composition repeats, and text collides with the 3D.**
   - ch0 and ch4 are the same shot (fire pit on the right, relief on the far right), only closer in ch4.
   - Mobile: the fire's glowing coals sit directly under "agents finish a job" and "Email is the quickest way".
   - ch2: the shield sits right under the bullet list.
   - ch3: the blob sits behind the body copy.
   - Minor: a tiny dark figurine on the plinth rim (ch0 at about 670,630; ch4 bottom-left at about 375,860) reads as a
     scale error or a stray object.
   - A desktop scrollbar shows at the right edge of every shot.

## Top 5 fixes, ranked by visual gain per hour

1. **Finish killing the blobs (about 1 h, biggest gain: ch1, ch2 and ch3 each +2).**
   - In `src/state/signal.ts:12`, map about, experience and projects to the same sparse ember mode ch0 and ch4 now use,
     or don't mount `SignalField` (`src/scene/Experience.tsx:69`) outside boot and contact.
   - Delete the `bust`, `helix` and `project-glyph` target code in `SignalField.tsx`. That also drops the
     `marble_bust_01.glb` load at `SignalField.tsx:62`.
   - This fixes the known ch2 right-edge column at its root.

2. **Give ch1, ch2 and ch3 one practical warm light each, on their one subject (about 1.5 h).** Reuse the `FireLight` pattern from `Fire.tsx`.
   - ch1: a candle light `#ffb070`, intensity about 3, distance 4, placed front-left of the gothic statue so its face
     and folds catch light.
   - ch2: a low wall-sconce light per role along the corridor. Cut the shield's emissive or exposure so it reads as
     metal, and move it out from under the text column.
   - ch3: a narrow spot from above-front on `standing_picture_frame_01`, so the painting is the brightest thing in frame.

3. **Fix the fire itself (about 1 h).**
   - Make the flame billboard read as flame: size about 0.6 m, `color` `#ffd29a`, two or three crossed billboards at
     different phases, sitting *in* the coals. Today it renders as smoke.
   - Embers: 1-3 px, warm only (drop the blue-white sprites), half the count, and confined above the pit.
   - Check that the fire pit's normal map survived `compress_fire_pit.py`. If it didn't, re-export with the normal map
     kept, because the faceted coals are the ch4 close-up's worst flaw.

4. **Texture the plinth and swap the box props (about 1.5 h, Blender re-bake).**
   - Plinth: Poly Haven `castle_brick_broken_06` or a worn marble/limestone set at real UV scale, with roughness and AO.
     Add a bevel highlight so it stops reading as plastic.
   - ch1 furniture: replace the untextured boxes with Poly Haven `wooden_table_02` or `WoodenTable_01`-class scans,
     or delete them.
   - Replace the relief slab beside the fire with a full-round scan (Poly Haven `marble_bust_01` on a pedestal, or a
     Smithsonian CC0 sculpture scan), or turn it so its back edge isn't visible.
   - Remove the tiny figurine on the plinth rim.

5. **Re-frame ch4 and mobile, and clean up (about 45 min).**
   - ch4: a lower, closer angle across the coals, looking toward the opposite wall, so it isn't the ch0 shot again.
     Or frame the email over clean darkness, with the fire in the lower right.
   - Mobile (`CameraRig`/`chapterLook`, 390 width): drop the camera target so the fire sits in the bottom 35% of the
     frame below the CTA, and add a 0→70% black gradient behind the text block.
   - Hide the page scrollbar (Lenis already handles scrolling).
   - Replace `THREE.Clock` with `THREE.Timer`.

## Keep
The typography, copy and left-column layout are still the strongest part of the site. The ch0 and ch4 lighting model
(one warm source, cold moon, black falloff) is right. Copy it to the other three chapters instead of inventing new looks.

**Verdict: ITERATE** (overall 4.5; every chapter is below 8).
