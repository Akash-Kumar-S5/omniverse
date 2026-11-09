# Judge cycle 1: final judge (stage 2), fresh Opus juror

Date: 2026-11-09 · Build: `main` @ f3bcd6a, `npm run build`, `vite preview --port 4560` (killed by pid after the shots; port verified free)
Inputs read: briefs/final-judge.md, reference/aengel-*, bench-*. No critic or builder reports and no STATE.md.
Rig: headed Chromium 1228 (Metal ANGLE, GPU), 1920x1080 DPR1 and 1512x982 DPR2, `?chapter=N&skipgate`, 9 s settle.
Then one cold load at 1920: gate, Enter, a 60-step wheel scroll to the end, with rAF frame timing.
Shots: `.orchestrator/reference/judge-c1-*` (chN-1920, chN-1512, gate, enter-transition, scroll-00..09, scroll-end, ch0-1920-recheck*).

## Runtime gate

| Check | Result |
|---|---|
| Console errors ch0..ch4 @1920 and @1512 | **0 / 0** (pass) |
| Errors during the full cold-load scroll | 0. Only warning: `THREE.Clock deprecated, use THREE.Timer` |
| Page load event | 94 ms (local); the 3D chunk `Experience-*.js` is 1.36 MB (408 kB gzip); dist is 42 MB |
| Frame timing while scrolling (1920, headed) | avg 21.7 ms (~46 fps), p95 37.6 ms, **38 frames > 50 ms** out of 1252 |

## Scores (worse of 1920 and 1512)

| | Score | Note |
|---|---|---|
| ch0 Hero | **7.6** | The real path (gate, Enter) renders well: fire barrel, embers, faint nave. The `?chapter=0` deep link at 1920 is **blank**, reproduced 3/3 at 3, 6, 12 and 18 s |
| ch1 About | 7.6 | Good statue scan and warm rim light. The pedestal is a plain extruded box; the body column is indented 300 px off the heading grid |
| ch2 Work | 7.2 | Typography and list are clean. The armour scan reads as melted or blobby at 1512 DPR2 (left pauldron, chest), and the stand is low-detail |
| ch3 Projects | **6.8** | The frame floats in a black void; the lantern hangs detached above it; the screen texture is illegible. Mid-scroll shows clipping and a light leak (see defects) |
| ch4 Contact | 8.2 | The strongest frame. Chiaroscuro works and the gold email reads as the call to action. The effigy on the floor is an unreadable lump |
| Motion / transitions / load | 6.8 | Header and section reveals are good and the gate is elegant. Fps is uneven, and the last ~40% of the scroll is a static contact frame |
| **Overall** | **7.3** | Against aengel.io: a coherent mood but no signature moment. Chapters read as "one prop on the right, text on the left" five times over |

## Top 5 defects (with evidence)

1. **ch0 deep link renders no scene at 1920x1080 DPR1.** The canvas is 1920x1080 at opacity 1, but the frame is pure black (`judge-c1-ch0-1920.png`, `judge-c1-ch0-1920-recheck{1,2}-*.png`). The same URL renders correctly at 1512 DPR2, and the normal gate path renders correctly at 1920 (`judge-c1-enter-transition.png`). Likely in the chapter-jump effect `src/App.tsx:39-44` (forces `sectionProgress: 0.5` and an immediate scroll for ch0) or in the camera/visibility logic keyed on it; cause not verified. Anyone sharing a `?chapter=0` link sees an empty hero, and every automated gate shoots this URL.
2. **Contact chapter dead scroll.** 5 of the 10 evenly spaced scroll frames (`scroll-05..09`, `scroll-end`) are the same "Say hello." frame. Roughly the last 40% of the 13,608 px scroll height does nothing visible, which reads as broken pacing to a juror.
3. **ch3 project transitions break framing.** `scroll-02` ("Website Perfo…"): the frame crosses the title and a hard white floor wedge appears at bottom right (~x 1500-1900, y 900-1080 in 1920 space). `scroll-04` ("GenAI Exper…"): the frame is clipped at the right viewport edge (x ≈ 1880+). The settled ch3 has the frame floating with no ground, shadow or wall, and a lantern ~100 px above it on a broken chain (`judge-c1-ch3-1512.png` ~x 1840-1940, y 250-590 @2x).
4. **ch2 armour scan quality at Retina.** `judge-c1-ch2-1512.png` x 1580-2180, y 300-900 @2x: melted geometry and smeared texture on the pauldrons. It is the most visible asset-quality miss on the site.
5. **Frame hitches while scrolling.** 38 frames over 50 ms and a p95 of 37.6 ms on an M-series GPU, headed. Lenis smoothing makes the drops visible as stutter between chapters. The 1.36 MB scene chunk and the 42 MB dist also suggest heavy textures.

## Top 5 fixes, ranked by gain per hour

1. **Fix the ch0 deep-link blank** (~0.5 h, +0.4 ch0 and restores gate trust). Make `?chapter=0` go through the same camera/visibility state as the post-Enter path; check `src/App.tsx:39-44` and whichever scene component gates on `sectionProgress`/`entered`.
2. **Trim or fill the contact tail** (~1 h, +0.5 motion). Shorten the contact spacer so the page ends about one viewport after "Say hello.", or use that run for a slow camera push into the fire with the ember field thickening. See `src/ui/sections/Spacers`.
3. **Ground the ch3 frame and fix the transitions** (~2 h, +0.8 ch3). Hang the frame from the lantern chain or put it on an easel or wall with a contact shadow. Keep the frame inside the 60% right column during the project swap, and kill the white floor wedge (likely a spot/volume cone or a floor plane catching a light during the swap: `src/scene/world/VolumeCone`, `ProjectArtefact`).
4. **Swap or retopo the ch2 armour** (~2 h, +0.6 ch2). Use a cleaner CC0 scan or decimate and bake normals from the current one. Darken the key light on the pauldrons so the melted areas fall into shadow.
5. **Frame budget** (~2 h, +0.3 motion). Cap DPR at 1.5 for the canvas on DPR2 screens. Check the postprocessing chain in `src/scene/fx/Effects` for redundant passes and compress the textures with KTX2. Target p95 < 20 ms.

These five are worth about +0.6 to +0.8 overall, which still leaves ~8.0. Reaching 9 needs a signature moment the references have (the aengel.io refraction crystal, the Michelangelus bench): one chapter where the camera moves through the set instead of cutting to a new prop.

## Cross-vendor check (OpenRouter free vision, advisory)

| Shot | Model | Score | Defects raised |
|---|---|---|---|
| ch0 (enter-transition) | nemotron-3.5-super-vl | 6 | Low-contrast nav; footer clock breaks immersion; fire doesn't reveal the architecture |
| ch1 | nemotron-3.5-super-vl | 4 | Statue reads as an unlit scan in a void; left 2/3 empty; bio table looks like a form |
| ch2 | nemotron-3.5-super-vl (retry after a TLS failure on nano-omni) | 5 | Low-contrast body text; armour lacks a contact shadow; list disconnected from detail |
| ch3 | nemotron-3.5-super-vl | 5 | Illegible dashboard texture; lantern has no light or shadow on the frame; nav too small |
| ch4 | nemotron-3-nano-omni | 6 | Clock overlay; gold email clashes; empty right side |

What I do with them:
- **Agree, added to the fixes:** the ch3 lantern isn't lighting the frame (fix 3); the ch2 armour has no contact shadow (fix 4); the ch3 screen texture is illegible (raise its emissive or texture resolution as part of fix 3).
- **Agree, minor:** the ch0 fire could rim-light the nave pillars a little more.
- **Rejected:** the gold email "clashes": it is the one accent and the call to action, and it works. "Nav too small or low contrast": it measures as a quiet, normal award-site nav. "Footer clock is an artifact": it is a deliberate locale detail. "Left 2/3 empty" (ch1/ch4): the text column sits there by design, and the model misread it.

## Verdict

**ITERATE.** Overall 7.3 (< 9), and every chapter except ch4 is below 8.5.
