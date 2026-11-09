# Judge cycle 2 (fresh Opus, final judge stage 2), 2026-11-09

**Verdict: ITERATE**. Overall 5.8. Three chapters are below 8.5, and two of them render an empty scene.

Build: `main` @ f42ba12, `npm run build`, `vite preview --port 4600`. Preview killed by pid (66833), and port 4600 was confirmed free afterwards.
Rig: headed Chromium 1228 (Chrome for Testing, `--use-angle=metal`), a fresh context for every load, deep link `?skipgate=1&chapter=N`, shots at 9 s and 12 s after load.
Shots are in `.orchestrator/tmp/judge-c2/` (`chN-1920*.png`, `chN-1512*.png`, `s*.png` for the scroll run).

## Runtime gate: PASS
0 console errors and 0 page errors on all 10 chapter loads (ch0..ch4 × 2 sizes) and on the full scroll run.
Deep-link load to the shot took 12.5–14.9 s. The gate→Enter→scroll run sampled fps at 46, 52, 42, 50 in the 3D chapters, 86–104 in the light chapters and 46 at Contact.

## Scores (worse of 1920×1080 DPR1 and 1512×982 DPR2)

| Chapter | 1920 | 1512@2x | Score | Note |
|---|---|---|---|---|
| ch0 Hero / gate | 8.0 | 8.0 | **8.0** | Candle and ember particles are the best image on the site. The gate (`s01-gate.png`) is plain type on flat black with no scene behind it |
| ch1 About | 7.8 | 7.8 | **7.8** | Statue on plinth reads well. The text column is pushed to x≈372 under a full-width headline, which leaves a dead band between copy and statue |
| ch2 Work | 7.8 | 7.8 | **7.8** | Armour on stand is the strongest artefact. The experience list is solid but generic |
| ch3 Projects | **3.0** | 7.5 | **3.0** | No 3D at 1920 at 9 s or 12 s. In the scroll run, 3 of 4 sampled projects show an empty right half |
| ch4 Contact | **3.5** | 3.5 | **3.5** | Deep link is empty at both sizes. Via scroll it renders a candle that repeats the hero |
| Motion / transitions / load | | | **6.5** | Smooth scroll, nav state tracks correctly, and gate→hero enter is clean. 3D chapters run at 42–52 fps, under 60. Load to first meaningful 3D takes about 13 s |
| **Overall** | | | **5.8** | A juror who scrolls past Projects sees a portfolio with no work on screen |

## Top 5 defects (evidence)

1. **Projects 3D missing at 1920 DPR1**. In `ch3-1920.png` and `ch3-1920-b.png` the right 60% is flat #080706: no frame, no lantern, no floor. There is also a hard vertical luminance seam at x≈700 where the copy panel ends. The same deep link at 1512@2x renders the gilt frame and lantern (`ch3-1512-b.png`), so the failure depends on viewport or DPR.
2. **Project artefact absent during real scrolling**. `s1009-y5400`, `s1015-y8999` (MediHub) and `s1018-y10799` (Finaca) show only the dark floor or haze with no frame. `s1012-y7200` (Website Performance Monitor) shows only a bare grey slab at bottom right (x 600–1920, y 880–1080). The section is about the work, and the work is invisible. Code anchor: `src/scene/world/ProjectArtefact.tsx:20-68` loads 8 painting textures plus 2 GLBs with `useTexture`/`useGLTF` inside suspense. My unverified guess is that a suspended texture or GLB hides the frame (and on deep link the whole Experience suspense at `src/App.tsx:52`) until everything has loaded.
3. **Contact deep link is a blank scene**. `ch4-1920.png` and `ch4-1512-b.png` show a flat black right side at both sizes. It renders via scroll (`s1024-y13608.png`), so cold load at chapter 4 is broken.
4. **Contact reuses the hero candle**. `s1024-y13608.png` is the `ch0-1920.png` candle and effigy from another angle. The close of the journey has no image of its own, and an SOTD juror reads that as a loop rather than an arrival.
5. **Gate has no atmosphere** (`s01-gate.png`). Both references (aengel loader, michelangelus) give the first frame a designed visual, while here it is only "Akash Kumar" on #080706 with no light, grain or motion. The cross-vendor check also flagged low-contrast body copy and nav (ch0 nav x 500–645 y 25–45 in its own scale, ch1 body copy). The nav at #9a9590-ish on near-black is the valid part, and I accept it as a minor defect.

## Top 5 fixes, ranked by gain per hour

1. **Make the project artefact always render** (gain about +4 on ch3, roughly 1–2 h). Give `ProjectArtefact` its own `<Suspense>` with a lit placeholder frame, preload all `PAINTING_URLS` and both GLBs at boot with `useTexture.preload`/`useGLTF.preload`, and swap the texture rather than re-suspending per project. Verify with 1920 DPR1 deep links on ch3 and mid-scroll shots of all 8 projects.
2. **Fix cold deep link to ch3/ch4 at 1920** (+3 on ch4, +part of ch3, about 1 h). Find why the whole canvas is empty at DPR1 1920 but not at 1512@2x (suspense boundary at `src/App.tsx:52`, or camera/anchor init when `chapter` is set before assets resolve). Gate it with a pixel test: right-half mean luminance above a threshold at 9 s.
3. **Give Contact its own final image** (+1.5 on ch4, about 2–3 h). For example, the fire pit or plinth "rest point" from the concept, with the camera pulled back so the whole sanctum is seen at once. A CC0 asset is fine.
4. **Dress the gate** (+0.5 on ch0 and motion, about 1 h). Put a faint ember field or the candle bloom behind the gate type, or a slow light leak, so frame 1 promises the 3D.
5. **Frame budget and contrast pass** (+0.5 motion, +0.3 across chapters, about 1 h). 3D chapters at 42–52 fps: cap DPR at 1.25 on DPR2 screens and check the particle and volume cone cost. Lift nav and secondary text one step in contrast.

Fixes 1 and 2 alone would move ch3/ch4 into the 7.5–8 range and overall to about 7.6. DONE (≥9, no chapter <8.5) also needs fixes 3–4 and a stronger art pass on the ch1/ch2 layouts.

## Cross-vendor check (`bun tools/or-vision-review.ts`, 1920 shots)
- ch0-1920 (Nemotron 3.5 Super VL): **6**. Defects: low body-copy contrast; nav nearly invisible; candle lacks contact shadow or bounce. Works: editorial type hierarchy.
- ch1-1920 (Nemotron): **5**. Defects: low body contrast; a central dead zone between copy and statue; statue lacks contact shadow on the plinth. Works: serif headline mood.
- ch2-1920: Gemma fallback returned 429, so no result.
- ch3-1920, ch4-1920: SKIPPED because the daily cap (40) was already reached before this cycle.

Disposition: I **accept** the nav/body contrast point (folded into fix 5) and the ch1 dead zone (defect list, ch1 score). I **reject** "candle lacks contact shadow": `ch0-1920.png` shows a clear warm light pool on the floor around the base (x 1150–1450, y 740–800). I accept the statue contact shadow as minor because the plinth top edge is lit but the statue base has no AO, and it is not ranked. ch2–ch4 were never reviewed cross-vendor this cycle, and the next cycle should re-run them.
