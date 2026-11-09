# Critic cycle 22 (main @ fbb219b: r28 merged, runtime gate green). DESKTOP ONLY

## Method

Build: `npm run build` passed (chunk-size warning only).
Preview: `vite preview --port 4520 --strictPort`. Every server I started was killed by pid after its shots; `lsof` shows nothing on 4520. Ports 5173 and 5197 were not touched.
Shots: Playwright Chrome (MCP, real GPU). Each shot used a fresh context and page, `?skipgate&chapter=N`, and a 16 s settle.
- `.orchestrator/reference/critic-c22-ch{0..4}-1920.png`: 1920x1080, DPR 1
- `.orchestrator/reference/critic-c22-ch{0..4}-1512.png`: 1512x982, DPR 2

**Runtime gate, checked first: 0 console errors and 0 page errors on all 10 loads, and on every reshoot (31 loads in all).**

**Tier note (read this before comparing with c21).** On the first two passes, PerformanceMonitor dropped every load to **Lite** (1512 canvas 1512x982, no post-FX, fewer embers). That was not an r28 regression. I built c21's commit (9deb9bd) in a scratch worktree and served it on the same port: it also fell to Lite (~54 fps on ch0 and ch2). The cause is GPU contention on this Mac: load average ~5, and another Chrome GPU process was using ~40% CPU. So the scored shots pin **Medium** through the HUD quality control after the settle. Medium is the app's default start tier and matches c21's 2268x1473 canvas. Each shot was taken ~1.2 s after the pin, and the tier was read back after the shot. All 10 were Medium; ch1@1512 took a second try. Canvas sizes: 1920x1080 at 1920 and 2268x1473 at 1512, the same as c21.
→ Ops note for the orchestrator: critic passes need a quiet GPU, or the Medium pin above. Otherwise the score measures load, not art.

Coordinates below are CSS px at the named size.

## Scores (worse of two sizes)

| Chapter | c21 | 1920 | 1512 | **c22** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.5 | 8.6 | 8.6 | **8.6 ↑** | The floating red hoop is gone. After the turn, the effigy now reads as a recumbent figure on a slab (x 935-1210, y 700-770), not rubble. The barrel rim is clean, with no beaded ring. Remaining: the lower ~25% is still empty floor, and the effigy has no visible contact shadow at its slab foot. |
| ch1 About | 8.5 | 8.6 | 8.5 | **8.5** | The halved relief helped: the plinth reads as rough stone more than clay at 1920. At 1512 its lower silhouette is still lumpy (x ~880-1240, y ~860-910). The bottom-right room-corner diagonal is unchanged (1920: x 1480-1920, y 880-1080; 1512: x ~1190-1512, y ~800-982). |
| ch2 Work | 7.8 | 8.1 | 8.0 | **8.0 ↑** | **The revert landed.** The chest takes the key light again, with warm specular on the breastplate and shoulder plates, and the piece reads as armour. The feet are not cropped and the shadow grounds the stand. **New defect:** at 1512 the r28 collar reads as a flat brown lid or box sitting in the neck hole (x ~1182-1264, y ~210-267). At 1920 it is less obvious but still a flat cap (x 1440-1560, y 220-290). The ragged top rim is still there. The strap tab still floats and is *more* visible now that the chest is lit: a pale bar across the right chest (1920: x 1505-1595, y 395-420; 1512: x ~1223-1296, y ~359-381). Copy gap at 1512 is ≈45 px (copy ends at x ~959, plate starts at ~1004), which is OK. |
| ch3 Projects | 8.5 | 8.5 | 8.5 | **8.5** | The widened fog card softened the wall edge into a soft column, but a lighter vertical band still reads (1920: x ~1125-1190; 1512: x ~905-960). The ghost disc under "Previous" is still faint at 1920 (x 250-290, y 800-860). The bottom-right floor diagonal is still there (1920: x 1200-1300, y 1000-1080). The lantern and chain read well. |
| ch4 Contact | 8.4 | 8.5 | 8.5 | **8.5 ↑** | The stray grey box is gone. The barrel base is now rust-brown rather than blue-grey, and the air holes read as pits instead of noise. No beaded rim. Remaining: the smoke lobe left of the flame still reads as a ghost face or skull (1920: x 1080-1180, y 440-600; 1512: x ~855-945, y ~395-545). The coal disc is not visible from this camera height, so the flame still starts at a bare rim line. |
| **Overall** | 8.3 | | | **8.4** (mean 8.42) | Three chapters up (ch0 +0.1, ch2 +0.2, ch4 +0.1), no regressions. |

**NOT SHIP / ITERATE.** Overall is 8.42, under the 8.5 bar. The floor holds: no chapter is under 8 (ch2 sits exactly on 8.0).
The path to 8.5: +0.4 in total across chapters. ch2 is the cheapest, since the collar and strap tab are both S-lane and worth ~+0.3. Then the ch4 smoke lobe (+0.1), then any one ch1 or ch3 corner fix.

## Top defects per chapter (lane-sized fixes)

### ch2 Work (8.0, lowest) — fix first
1. **Collar reads as a flat lid** (new in r28). The cylinder is capped and seated 0.12 m below the top vertex, so from the front its flat top disc shows. Make it open-ended (`openEnded: true` in cylinderGeometry), drop it into the opening (y − 0.16), and darken it to #0d0b09 so it only blocks the see-through. Or delete it, since the r28 revert alone hides most of the hole at pos.y 1.0. *S lane.* Accept check: no flat-topped shape inside the neck opening at 1512.
2. **Floating strap tab** (carried since c20, more visible now). Remove the scan islands for that strap, or set the strap material slot to #1a1511. *S lane.*
3. **Ragged top rim.** Once the collar is fixed, consider a slight darkening gradient on vertices above ~0.95 of the plate height so the torn edge sinks into shadow. *S lane, optional.*

### ch4 Contact (8.5)
1. **Ghost-face smoke lobe** (carried). Re-seeding the flame phases in r28 did not move the left lobe, so the lobe is not the flame planes. Find its source: it is probably the smoke sprite or the `contact` plane. Re-seed or rotate the smoke texture UV ~90°, or drop that lobe's opacity ~50%. *S lane.*
2. **Flame starts at a bare rim line.** The coal disc sits below the camera's sightline. Raise it to ~1 cm under the rim, or add a small warm additive glow sprite at the flame base. *S lane (shared FirePit, so it helps ch0 too).*

### ch3 Projects (8.5)
1. **Lighter vertical wall band** (x ~1125-1190 at 1920). Widen the fog card a further ~0.3 m left, or raise its opacity at the centre. *S lane.*
2. **Ghost disc under "Previous"** (1920 only). Toggle layers to find it: the candidates are a fog or bloom sprite and the old pager disc. *S lane.*
3. **Bottom-right floor diagonal.** End the floor plane earlier, or fog it. *S lane.*

### ch1 About (8.5)
1. **Room-corner diagonal at bottom right** (carried). Drop fogFar to ~7.4, or end the floor or wall before the corner. *S lane.*
2. **Plinth lower silhouette lumpy at 1512.** Add a straight bottom plinth course (a thin box like the cap slab) to square the base. *S lane.*

### ch0 Hero (8.6)
1. **Effigy contact.** Add a small soft contact-shadow plane under the slab (as on ch2, opacity ~0.6). *S lane.*
2. **Empty lower floor** (~25%). Low priority; it is deliberate negative space, but a faint floor texture or mist would help. *S lane, optional.*

## Cross-vendor check (advisory; the critic score above stays the gate)

`bun tools/or-vision-review.ts` on the five 1920 shots (Medium tier). The model was `nvidia/nemotron-3.5-super-vl:free` for all five, and all 5 succeeded. The key was never printed. The counter went 14 → 19 of the 40/day cap.
As before, its coordinates are on a downscaled frame (~0.44x) and its absolute scores (5-6) are uncalibrated.

| Shot | OR score | Defects it flagged that I did not | Verdict |
|---|---|---|---|
| ch0 | 6 | No firelight spill on the background columns | **Partial**: the columns are lit only faintly. It is a mood choice, but a weak warm bounce on the nearest column would add depth. Low priority. |
| | | Effigy crushed to near-black | **Reject at Medium**: the figure reads in my shot. It is the same contact issue as ch0 #1. |
| | | Nav logo duplicates the hero title | **Reject**: a standard site mark. |
| ch1 | 5 | Nav links low contrast | **Unmeasured**: they look ≥7:1 by eye. Measure once in c23. |
| | | Statue cutout, no grounding | **Partial**: it is the same as the lumpy plinth base and corner fog (ch1 #1, #2). |
| | | Body column narrow | **Reject**: ~570 px, a deliberate measure. |
| ch2 | 5 | Muddy shading on the breastplate | **Partial**: it is the scan's low-frequency normals. Pair it with ch2 #3 if the rim darkening goes in. |
| | | Body small / low contrast; type scale clash | **Reject**: measured in c19, and the hierarchy is deliberate. |
| ch3 | 6 | Meta line ("Laravel, PHP…") low contrast | **Unmeasured, plausible**: it is the dimmest text on the page. Measure it in c23; if it is under 4.5:1, raise it to the body grey. *XS lane.* |
| | | Frame has no shadow on the wall | **Partial**: it is lit from the lantern but has no occlusion behind it. A faint dark card behind the frame would ground it. *S lane, optional.* |
| | | Chain reads clipped | **Reject**: the chain runs out of frame on purpose (it hangs from above). |
| ch4 | 6 | Body copy low contrast | **Reject**: measured in c19 (16:1 class). |
| | | Barrel is a cutout with no floor interaction | **Reject at Medium**: a warm pool of light is clearly on the floor. |
| | | Gold email underline looks like a stuck hover | **Reject**: it is the site-wide link style. |

Net: no new accepts, 4 partials folded into existing lanes, and 2 contrast items to measure in c23. The model again did not register the ch2 change (5 → 5), so it is still not usable as a regression detector.

## Keep
- 0 console errors across all 31 loads, including Lite fallbacks. The Lite tier still renders a clean, coherent page, which is good as a degraded path.
- The ch2 revert (pos.y 1.0, rotation 1.2) and the 0.8 contact shadow.
- ch4: the grey box removed and the warmer base. ch0: the hoop removed and the effigy turn.
