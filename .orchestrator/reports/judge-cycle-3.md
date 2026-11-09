# Judge cycle 3 (final judge, stage 2) — fresh Opus juror

Date: 2026-11-10 02:35 IST. Build: main @ 71acf14, `npm run build`, `vite preview --port 4640` (killed by pid after shots; 4640 verified free).
Browser: headed Chrome for Testing (Playwright chromium-1228), `--use-angle=metal`, fresh context per load.
Shots (scratchpad, not committed): `/private/tmp/claude-501/-Users-akashkumars-Documents-Personal-portfolio-omniverse/1008b6c5-03d5-416c-8a52-7990add114ce/scratchpad/shots/`
- `j3-ch{0..4}-{1920,1512}-{3,6,12}s.png`: gate pass 1 (`?skipgate=1&chapter=N`)
- `j3b-ch{0..4}-{1920,1512}-6s.png`: gate pass 2 (repeat, to check reproducibility)
- `j3s-*`: cold load → gate → Enter → full wheel scroll at 1920
- `j3p-0..7.png`: all 8 projects via the Next button at 1920

## Verdict: **ITERATE**

The runtime gate fails. 6 of 20 cold chapter loads show no 3D scene at all, only the `#060505` clear colour (right-half mean luminance 7.1, 0.3 % of pixels lit, identical at 3, 6 and 12 s):

| Load | Pass 1 | Pass 2 |
|---|---|---|
| ch0 @ 1920x1080 DPR1 | **black** | **black** |
| ch2 @ 1512x982 DPR2 | **black** | **black** |
| ch2 @ 1920 | **black** | ok |
| ch3 @ 1920 | ok | **black** |
| ch4 @ 1512 | **black** | ok |
| everything else | ok | ok |

Console: 0 errors on every load (one warning: `THREE.Clock` deprecated). So the failure is silent: the canvas clears but never draws the scene, and it never recovers. ch0 @ 1920 is deterministic (2/2), which matches the earlier r31 ch0-blank report: the r31 fix has not closed it. The gate+Enter path at 1920 rendered fine in this run.

## Scores (worse of 1920 / 1512, as shot)

| Item | Score | Note |
|---|---|---|
| ch0 Hero | **3.0** | Black at 1920 2/2. When it renders (1512, gate path) it is the best frame on the site, about 7.5: warm fire, embers, effigy, good type. |
| ch1 About | **7.0** | Statue on plinth renders 4/4. Lit flat and brown, little rim or silhouette. Body copy is indented ~300 px from the H2 (x=372 vs 72), which looks like a layout slip. |
| ch2 Work | **3.0** | Black at 1512 2/2 and at 1920 1/2. When it renders the breastplate on its stand is strong, about 7.5. |
| ch3 Projects | **5.5** | Black 1/4. All 8 projects use the same gilded frame and lantern; only a generic wireframe glyph inside changes (cube, rings, spiral). There is no real project imagery. On a scroll arrival the frame is missing (see defect 3). |
| ch4 Contact | **5.0** | Black at 1512 1/2. When it renders it is the hero scene re-angled (same barrel fire, effigy now reads as floor debris), so the site ends on a reprise, not a destination. |
| Motion / transitions / load / console | **5.5** | Enter transition is clean. Scroll is smooth, with no console errors. But the gate shows the hero copy bleeding through, project 0 arrives empty, titles reveal letter by letter over an empty stage, and 7.1 MB transfers with the statue and breastplate GLBs finishing at 22.4 s and 23.8 s. |
| **Overall** | **4.5** | At SOTD level the art direction ceiling is about 7.5 today. A silent blank scene on ~30 % of cold loads is disqualifying. |

## Top 5 defects (with evidence)

1. **Silent blank 3D scene on cold load (gate blocker).** See the table above. Evidence: `j3-ch0-1920-12s.png` (fully black right side, hero copy only), `j3-ch2-1920-12s.png`, `j3-ch4-1512-12s.png`, `j3b-ch3-1920-6s.png`. The frame is identical from 3 s to 12 s, so the scene never starts; this is not a mid-load stall or a quality-tier drop (PerformanceMonitor only mounts at 5 s, `src/scene/Experience.tsx:21-25`). 0 console errors, so the failure gives no signal. Hypothesis, not verified: a Suspense/asset or render-target init race that differs by drawing-buffer size (1920x1080x1 and 1512x982x1.5 clamped DPR), or the `dpr={[1,1.5]}` resize at mount (`Experience.tsx:51`) landing during effect-composer setup.
2. **Projects look identical.** Evidence: `j3p-0.png` … `j3p-7.png`: the same frame, lantern, chain and camera for all 8; the only change is a ~200 px wireframe glyph inside the frame (e.g. `j3p-1.png` x1310-1520, y450-720). A juror sees one artefact eight times, and the glyphs read as placeholder UI rather than the project.
3. **Project chapter arrives empty on scroll.** Evidence: `j3s-scroll-004-y5361.png`: no frame and no lantern, only a lit floor wedge (x500-1920, y780-1080), and the title is caught mid-reveal ("Sala…" at x72-260, y330-420). The frame appears later (`j3s-scroll-010`). Lazy GLB fetches finish at 22-24 s (`gothic_statue.glb` 918 kB at 22.4 s, `armour-breastplate-scan.glb` 582 kB at 23.8 s, from the Resource Timing in the scroll run).
4. **Gate overlay leaks the page beneath.** Evidence: `j3s-gate-ready.png`: ghosted hero H1 and paragraph visible through the gate (x80-560, y400-600), the nav visible at full position (x970-1250, y38), and a particle cloud clipped by the top edge (x1230-1510, y0-200). Compare aengel-01, a clean single-purpose loader.
5. **Contact reuses the hero scene, and About is lit flat.** Evidence: `j3-ch4-1920-12s.png` vs `j3s-enter-3000ms.png`: same barrel fire, effigy shifted to the foreground (x1330-1500, y830-1030), where it reads as a smudge. `j3-ch1-1920-12s.png`: the statue (x1050-1520, y190-1000) is a uniform brown with no rim or key separation from the back wall, and the body copy is offset to x=372 under an H2 at x=72.

Minor: in mid-scroll frames a ~10 px dark band sits above the header, which shifts down 10 px (`j3s-scroll-004`, y0-10, nav at y49 vs y39 at rest).

## Top 5 fixes, ranked by gain per hour

1. **Fix the blank-scene race (needed for DONE; +3 to +4 overall).** Reproduce with `?skipgate=1&chapter=0` at 1920x1080 DPR1 on headed Chromium (deterministic 2/2). Bisect by removing `<Effects/>`, then `<SignalField/>`, then fixing `dpr` to a constant. Add a watchdog that checks the canvas has drawn N frames with non-clear pixels (e.g. via `gl.readPixels` inside `useFrame` after render) and remounts or rebuilds the composer if not. Gate test: 10 cold loads per chapter per viewport, 0 black. ~2-3 h.
2. **Preload chapter GLBs during the gate** (`useGLTF.preload` for the statue, breastplate and frame/lantern once the gate shows "ready"), and hold the project title reveal until its artefact is mounted. This fixes defect 3 and removes the 22 s tail. ~1 h, +0.5 motion, +0.5 ch3.
3. **Make the gate opaque.** Hide the hero copy and nav until Enter, and keep the particle cloud inside the frame. ~0.5 h, +0.5 motion and first impression.
4. **Give each project its own identity inside the shared frame.** Put a real screenshot or poster of each project on the frame canvas (texture swap, emissive at a low level), and vary the lantern warmth or frame angle per project. ~2 h, +1 ch3.
5. **Give Contact its own composition and give About a rim light.** For Contact, move the camera to a distinct angle (e.g. low, through the ember column toward a doorway) or end on a new rest-point prop; drop the floor effigy from frame. For About, add a cool rim/back light on the statue and align the body copy to the H2 column. ~1.5 h, +0.5-1 each on ch1 and ch4.

## Cross-vendor check

Not run: `bun tools/or-vision-review.ts` returned `SKIPPED: daily OpenRouter cap (40) reached` for all five 1920 shots (`j3-ch{0..4}-1920-12s.png`). No second opinion this cycle; re-run it next cycle before any DONE verdict.

## Method notes

- The in-page canvas readback returns 0 because the drawing buffer is not preserved, so the gate luminance was measured from the screenshots (right half downsampled to 96x108, lit = luminance > 20).
- The gate "ready" text probe did not match the gate copy, so the gate-ready shot was taken at the 15 s probe timeout. The load event fired at 137 ms; the time to a usable gate was not measured.
- Next steps through the 8 projects at scrollY 4968 → 11448 (1080 px each); Next correctly stops at 8/8.
