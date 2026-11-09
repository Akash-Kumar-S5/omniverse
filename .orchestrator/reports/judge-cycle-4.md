# Judge cycle 4: main @ ba52a6d

Fresh context. Read only `briefs/final-judge.md`, the reference images and the live build. No critic or builder reports, no STATE.md.

**Verdict: ITERATE.** Overall 7.8; Work 7.0, Projects 7.6 and Contact 7.8 are all below the 8.5 floor.

## Rig
- `npm run build`, then `vite preview --port 4662`. Killed by pid (9154 and npx wrapper 9130) after the shots; port 4662 confirmed free. Ports 5173 and 5197 were not touched.
- One headed system Chrome 157 at a time, driven by Playwright with a fresh context per load. 1920x1080 DPR1 and 1512x982 DPR2, `?chapter=N`, 9 s settle, then a 2 s rAF fps sample.
- Contention I could not remove: two stale automation Chromes were left from earlier sessions, a playwright-mcp headed instance (pid 68991, started 17:00) and a rea headless instance (pid 44687, started 11:50), each at about 26% CPU. My request to kill them was denied. Treat the fps numbers as lower bounds.
- Mobile was skipped, per the 12:32 update.

## Diagnostics (all 10 chapter loads plus 2 scroll runs)
| vp | ch0 | ch1 | ch2 | ch3 | ch4 |
|---|---|---|---|---|---|
| 1920 fps | 74.5 | 75 | 78.5 | 58.5 | 75 |
| 1512 DPR2 fps | 58 | 56.5 | 60.5 | **45** | 58 |

- `__omniDiag` on every load: `lost 0, blank 0, remounts 0`, firstFrameMs 397–504 (690 on the gate path). Canvas at 1512 DPR2 is 2268x1473, so DPR is capped at 1.5.
- No black canvas on any load, so no blank-canvas claim is made.
- Console: only `THREE.Clock deprecated` warnings. No errors, no pageerror.
- Gate: the enter button is visible 1.95 s after navigation.

## Scores (worse of 1920 / 1512)
| Chapter | Score | Notes |
|---|---|---|
| ch0 Hero | **8.3** | The flame, embers and warm floor falloff are the best thing on the site, and the type is confident. But the brazier is a plain banded cylinder that reads as a tin can (1920: x1205–1385, y610–785). The lower 40% of the frame is an empty floor, and the back architecture is too dark to read as a place. aengel's entry scene is a composed set; this is one object on a floor. |
| ch1 About | **8.4** | The scanned statue holds up and the label/value table is clean. The plinth is a huge flat brown box that takes about 45% of the object's height and is cut by the bottom edge at 1920 (y≈1000). The object sits in a void with no room context. |
| ch2 Work | **7.0** | `?chapter=2` (role 1) alone would score about 8.4: the cuirass on its stand is the best-lit object on the site. **But roles 2–4 show nothing on the right half of the screen.** That is about 1,700 px of scroll (y 2722–4423 at 1920) and it reproduced on two fresh loads with diag clean (frames advancing, blank 0); see `reference/judge-c4-work-role-empty*.png`. Cause: `src/scene/camera/CameraRig.tsx:190` frames the cuirass only when `activeRole === 0`. Roles 1–3 follow `expPath` / `exp_role_N` spots into empty corridor. |
| ch3 Projects | **7.6** | The gilt frame with a live UI inside is a good idea. Problems: (a) the floor has a hard vertical seam at x≈1000–1020 and a bright diagonal plane edge bottom-right (1920: y 880–1080). Those blotchy grey floor reflections read as a render bug. (b) The lantern chain hangs through the lantern and into the top rail of the frame (1920: x1420–1450, y380–410). (c) All 8 projects use the same frame and lantern, and the lantern jumps between left of the frame and above it from project to project. (d) This is the lowest fps chapter (45 at 1512 DPR2), and the wheel run dropped to 14 fps on the project swap into project 2. |
| ch4 Contact | **7.8** | Low-angle brazier: the vessel is cut by the bottom edge in both viewports, and from this angle it looks like a crumpled paper cup. The flame is washed out at 1512. The left architecture is flat, low-poly slabs (1920: x0–560) that read as untextured blocks. The copy and the email link are fine. |
| Motion / load / console | **8.0** | Fast first frame, clean console, no context loss. Gate to enter is a clean crossfade. Back-to-top restores the hero correctly. Minus points: the empty Work stretch, the 14 fps hitch on the project swap, and Projects taking 8640 px of 14688 (59% of the page) with every step a near-identical frame. |
| **Overall** | **7.8** | Against aengel.io and the landing.love benches, the type and grade are at award level, but the 3D staging is one object in a void per chapter, with two visible scene bugs. |

## Top 5 defects (evidence)
1. **Work roles 2–4 have no object** (empty right half). Evidence: `reference/judge-c4-work-role-empty.png` and `-load2.png`; cause at `CameraRig.tsx:176-200`.
2. **Projects floor seam and plane edge** with blotchy reflections. Evidence: `judge-c4-ch3-1920.png` x1000 vertical seam, bottom-right diagonal edge.
3. **Contact brazier cropped and crude.** Evidence: `judge-c4-ch4-1920.png` vessel x1265–1590 cut at y1080; low-poly slabs at x0–560.
4. **Projects monotony and lantern placement.** Evidence: `judge-c4-scroll41-sheet.png` rows 3–6: same frame 8 times, lantern side changes per project, chain clipping the frame top.
5. **Hero emptiness and tin-can brazier.** Evidence: `judge-c4-ch0-1920.png` y800–1080 empty floor; plain banded cylinder.

## Top 5 fixes, ranked by gain per hour
1. **Keep the cuirass framed for every role** (about 1 h, +1.4 on ch2). In `CameraRig.tsx`, apply the role-0 framing to all roles and drift the camera slightly per role for motion, or stage one object per role along `expPath`. Accept: shots at each of the 4 roles in both viewports, all with an object on the right.
2. **Fix the Projects floor** (about 1–2 h, +0.6 on ch3). Remove the seam between the two floor planes, extend the plane past the frustum so no edge shows, and tame or blur the reflection hot spots. Accept: no visible seam or edge at 1920 or 1512.
3. **Reframe Contact** (about 1 h, +0.5 on ch4). Raise or pull back the camera so the whole vessel sits above the bottom edge with ≥80 px of air, push the low-poly slabs into darkness or out of frame, and restore flame intensity at DPR2.
4. **Projects lantern and variety** (2–3 h, +0.4). Fix the lantern side and height relative to the frame, shorten the chain so it ends at the lantern, and vary per project (frame size, tilt, a second prop, or light colour) so 8 steps don't read as one frame. Preload the project screen textures to remove the 14 fps swap hitch.
5. **Replace the brazier mesh** (2–4 h, +0.3 on ch0 and ch4). Use a CC0/CC-BY scanned or modelled bronze or iron brazier with legs or a bowl instead of a banded cylinder, credited in CREDITS.md. Add a low foreground element or floor detail to the empty lower hero floor.

## Cross-vendor check (OpenRouter)
`bun tools/or-vision-review.ts` on the five 1920 shots returned `SKIPPED: daily OpenRouter cap (40) reached` for all five. `.orchestrator/openrouter-usage.json` shows `{"day":"2026-11-09","n":40}`; the tool keys on the UTC day, which resets at 00:00 UTC. No advisory output this cycle; re-run on the same shots after the reset if wanted. The shots are saved as `reference/judge-c4-ch{0..4}-1920.png`.

## Saved evidence
`.orchestrator/reference/judge-c4-ch{0..4}-{1920,1512}.png`, `judge-c4-motion-sheet.png` (gate to end wheel run), `judge-c4-scroll41-sheet.png` (41 evenly spaced positions, second load), `judge-c4-work-role-empty.png`, `judge-c4-work-role-empty-load2.png`.
