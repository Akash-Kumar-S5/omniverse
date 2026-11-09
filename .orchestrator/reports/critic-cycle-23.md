# Critic cycle 23 (main @ 289cb49: r29 merged, runtime gate green). DESKTOP ONLY

## Method

Build: `npm run build` passed (chunk-size warning only).
Preview: `vite preview --port 4550 --strictPort` (pid 87316). I killed it by pid after the shots, and `lsof` shows nothing on 4550. Ports 5173 and 5197 were not touched.
Shots: Playwright Chrome (MCP). Each shot used a fresh context, `?skipgate&chapter=N`, a 16 s settle, then a **Medium pin** through the HUD quality control (same as c22), with the shot taken ~1.2 s later.
- `.orchestrator/reference/critic-c23-ch{0..4}-1920.png`: 1920x1080, DPR 1, canvas 1920x1080
- `.orchestrator/reference/critic-c23-ch{0..4}-1512.png`: 1512x982, DPR 2, canvas 2268x1473

**Runtime gate, checked first: 0 console errors and 0 page errors on all 10 loads.**
Tier readback: 7 of 10 loads had already dropped to Lite before the pin (load average ~7; same GPU contention as c22). All 10 read back **Medium** after the pin, so this pass is comparable with c22.

Coordinates below are CSS px at the named size.

## Scores (worse of two sizes)

| Chapter | c22 | 1920 | 1512 | **c23** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.6 | 8.6 | 8.6 | **8.6** | The r29 glow at the flame base helps; the flame no longer starts at a bare line. The effigy's contact is better. Remaining: the barrel's top rim still reads as a thin, hard, pale line (1920: x 1205-1380, y 612-618), and the lower ~25% of the floor is still empty. |
| ch1 About | 8.5 | 8.6 | 8.5 | **8.5** | The base course is in, and the plinth now has a stepped foot. At both sizes, though, the course reads as a thin outline offset *behind* the base rather than a solid slab (1920: x 1055-1530, y 925-1000; 1512: x ~840-1270, y ~820-905). The room-corner diagonal at bottom right is still there (1920: x 1520-1920, y 900-1080). |
| ch2 Work | 8.0 | 8.4 | 8.3 | **8.3 ↑** | **Both r29 fixes landed.** The strap tab is gone, so the right chest is clean. The collar no longer reads as a lid; the neck is now dark, with torn plate edges. Remaining: the top rim is still ragged, with pale angular shards catching light (1920: x 1440-1600, y 230-330; 1512: x ~1168-1295, y ~203-280). The waist hem is a jagged scan edge (1920: x 1330-1500, y 590-650), and the breastplate shading is still low-frequency and muddy. |
| ch3 Projects | 8.5 | 8.6 | 8.6 | **8.6 ↑** | The wider fog card and the hidden shell worked. The ghost disc under "Previous" is gone, and so is the bottom-right floor diagonal. The wall band is now a faint dark seam only (1920: x ~1000-1025, full height). Small nit: the chain kinks left between the lantern and the frame (1920: x 1425-1455, y 340-405), so it reads like a broken link. |
| ch4 Contact | 8.5 | 8.6 | 8.6 | **8.6 ↑** | **The ghost-face lobe is gone.** The left smoke now reads as faint wisps (1512: x ~880-940, y ~405-560), not a face. The base glow helps. Remaining: the same hard pale rim line as ch0 (1920: x 1060-1345, y 625-635), and the flame narrows to a thin dim stem just above the rim (1920: x 1185-1215, y 560-625). |
| **Overall** | 8.4 | | | **8.5** (mean 8.52) | Three chapters up (ch2 +0.3, ch3 +0.1, ch4 +0.1), no regressions. |

**SHIP.** Overall is 8.52, which meets the ≥8.5 bar, and no chapter is under 8 (the lowest is ch2 at 8.3).
The margin is thin (+0.02): one chapter dropping 0.1 would flip this back to ITERATE. The fixes below are polish that would widen the margin; none blocks the ship.

## Contrast items carried from c22 (measured from tokens)
- Nav links use `--fg-dim` #b4ada1 on `--bg` #080706, about 9:1. **Pass.**
- ch3 meta line (`.project-stack`) uses `--fg-muted` #9a9286, about 6.5:1. **Pass** AA for small text. Closed.

## Top defects per chapter (lane-sized fixes, optional polish)

### ch2 Work (8.3, lowest)
1. **Pale shards on the torn top rim.** Extend r29's rim shading further down, from ~0.95 to ~0.90 of the plate height, and darken more strongly, so the shards fall into shadow. *S lane.* Accept check: no pale angular edges above the shoulder line at 1512.
2. **Jagged waist hem.** Apply the same vertex darkening on the bottom ~5% of the plate, or a tiny contact shadow under the hem. *S lane.*

### ch1 About (8.5)
1. **The base course reads as an outline.** Bring the course box forward and flush with the base faces (same footprint +2-3 cm), and give it the plinth's stone material at the same brightness, so it reads as one solid slab. *S lane.*
2. **Room-corner diagonal** (carried). Drop fogFar to ~7.4, or end the floor before the corner. *S lane.*

### ch0 Hero / ch4 Contact (8.6, shared FirePit)
1. **Hard pale rim line on the barrel.** Darken the rim edge, or raise the coal and glow disc 1 cm so the rim reads as a lit lip and not a stroke. *S lane; fixes both chapters.*
2. **ch4 thin flame stem.** Widen the flame's lower width slightly, or move the base glow sprite up ~3 cm. *S lane.*
3. **ch0 empty lower floor.** Low priority; it is deliberate negative space. *Optional.*

### ch3 Projects (8.6)
1. **Faint dark wall seam** at x ~1000-1025 (1920). Shift the fog card ~0.2 m left. *XS lane.*
2. **Chain kink** between lantern and frame. Straighten the lower chain segment. *XS lane.*

## Cross-vendor check (advisory; the critic score above stays the gate)

`bun tools/or-vision-review.ts` on the five 1920 shots (Medium tier). The models were `nvidia/nemotron-3.5-super-vl:free` (ch0, ch2, ch3, ch4) and `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` (ch1). All 5 succeeded, and the key was never printed. The counter is now 26 of the 40/day cap.
As before, its coordinates are on a downscaled frame (~0.44x) and its absolute scores (4-9) are uncalibrated.

| Shot | OR score | Defects it flagged that I did not | Verdict |
|---|---|---|---|
| ch0 | 6 | Flame looks like a flat decal | **Reject at Medium**: the flame has a glow and embers. The rim line, which I already have as ch0/ch4 #1, is the real flatness cue. |
| | | Foreground floor is a dead zone | **Partial**: it is the same as ch0 #3 (deliberate negative space). |
| ch1 | 9 | Blue artefacts on the statue head | **Reject**: none are visible at full resolution. |
| | | Pedestal base blends into the shadows | **Partial**: it is the same as ch1 #1. |
| ch2 | 4 | Torso floats with no contact shadow | **Reject**: the stand is grounded, and the 0.8 contact shadow is present. |
| | | Nav and list text low contrast | **Reject**: measured above (~9:1 and ~6.5:1). |
| ch3 | 6 | Dashboard inside the frame is illegible | **Reject**: it is a deliberate texture, not content to read; the copy carries the content. |
| | | Pager is generic | **Reject**: a site-wide component. |
| ch4 | 4 | Barrel looks like a low-poly primitive | **Reject**: the dents, bands and air holes all read at full resolution. |
| | | Black void between copy and scene | **Reject**: a deliberate split layout. |

Net: no new accepts and 2 partials already covered above. Contrast complaints repeat on every shot, and the measured tokens rule them out. The ch2 score moved 5 → 4 while ch2 visibly improved, so it is still not a regression detector.

## Keep
- 0 console errors across all 10 loads, including the 7 that started at Lite.
- r29 ch2: the strap tab removed and the open dark collar. r29 ch4: the smoke-lobe cut. r29 ch3: the hidden shell and the wider fog card. Do not revert any of these.
