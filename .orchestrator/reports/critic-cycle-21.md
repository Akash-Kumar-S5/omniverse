# Critic cycle 21 (main @ 9deb9bd: all r27 merged, runtime gate green). DESKTOP ONLY

## Method

Build: `npm run build` passed (chunk-size warning only).
Preview: `vite preview --port 4500 --strictPort` (npx pid 20626, node pid 20648). Both were killed by pid after the shots. Afterwards `lsof` shows no listener on 4500; the only entry left is a CLOSE_WAIT client socket from Playwright's Chrome. Ports 5173 and 5197 were not touched.
Shots: Playwright Chrome (MCP, real GPU). Each shot used a fresh browser context and page, `?skipgate&chapter=N`, and a 16 s settle.
- `.orchestrator/reference/critic-c21-ch{0..4}-1920.png`: 1920x1080, DPR 1
- `.orchestrator/reference/critic-c21-ch{0..4}-1512.png`: 1512x982, DPR 2

**Runtime gate, checked first: 0 console errors and 0 page errors on all 10 loads.** Each load logged one warning, the `THREE.Clock` deprecation.
Canvas sizes: 1920x1080 on every chapter at 1920; 2268x1473 on every chapter at 1512 (the DPR floor held).
Coordinates below are CSS px at the named size.

## Scores (worse of two sizes)

| Chapter | c20 | 1920 | 1512 | **c21** | One-line reason |
|---|---|---|---|---|---|
| ch0 Hero | 8.5 | 8.5 | 8.5 | **8.5** | The stray black silhouette at the barrel foot is gone. The effigy now sits tight against the barrel (x 945-1210, y 700-775), but at this size it reads as a pile of wood or rubble, not a recumbent figure. The empty floor at the bottom is down to ~27% (barrel base at y ~785). New: a thin red hoop at the barrel's upper band sticks out past the silhouette on both sides (x 1195-1390, y ~655 at 1920; x ~969-1150, y ~594 at 1512), so it reads as a floating ring. |
| ch1 About | 8.5 | 8.5 | 8.5 | **8.5** | The new cap slab (x 1065-1505, y 615-650) gives the statue a proper stone seat. The plinth body below it still reads as mud or clay. The bottom-right room-corner diagonal (x 1480-1920, y 880-1080) is still visible even with fogFar 7.8. |
| ch2 Work | 8.0 | 7.9 | **7.8** | **7.8 ↓** | **Regression.** In r27 the camera went from pos.y 1.0 to 0.7 (0.3 m, far more than the "~4°" in the comment), and the torso turned from 1.2 to 1.35 rad. Together these rotated the lit breastplate front out of the key light. Compare c20 with c21 at 1920: the shoulder flaps now dominate, the warm specular on the chest is gone, and the piece reads as a crumpled leather sack on a stand, not armour. The ragged top rim is still visible (x 1290-1650, y 170-250). The strap tab still floats (x 1520-1600, y 320-360 at 1920; x ~1232-1296, y ~292-324 at 1512). At 1512 the gap to the copy shrank to ≈30 css px (from ≈75). What did land: the feet no longer crop the frame bottom, and the contact shadow (2.1 m, opacity 0.6) faintly grounds the stand. |
| ch3 Projects | 8.4 | 8.5 | 8.5 | **8.5** | The lantern is 1.5x with warm light. It now casts light onto the top of the frame and reads as a light source, though it is still crystalline. The fog card softened the wall band, but a hard vertical edge remains at x ~1125 (1920) / x ~905-915 (1512). The ghost disc behind the pager is still faintly visible at 1920 (x 170-370, y 790-930), even though the commit message says it was removed. It is not visible at 1512. The floor diagonal at bottom right (x 1200-1300, y 1000-1080) is still there. |
| ch4 Contact | 8.4 | 8.4 | 8.4 | **8.4** | The left smoke lobe is softer but still a ghost-face shape (x 1090-1170, y 450-600 at 1920). The barrel base is only slightly warmer; the bottom band is still cool blue-grey with rivet noise (x 1060-1355, y 870-935). The rim still has a beaded bright ring with no flame root (x 1055-1345, y 625-640). New: a pale grey box-shaped prop behind the barrel's right side (x 1350-1450, y 750-800 at 1920; x ~1118-1200, y ~680-750 at 1512) reads as a stray block. |
| **Overall** | 8.4 | | | **8.3** (mean 8.34) | ch3 gained 0.1 and ch2 lost 0.2. |

**NOT SHIP / ITERATE.** Overall is 8.3, under the 8.5 bar, and ch2 is at 7.8, under the 8.0 floor. That breaks both gates.
The fastest path: revert the ch2 camera and turn (one lane, back to ≥8.0), then +0.1 on ch4 to reach a mean of ~8.45, then one more +0.1 anywhere.

## Top defects per chapter (lane-sized fixes)

### ch2 Work (7.8, the blocker) — fix first
1. **Revert the r27 camera drop and extra turn.** Set `CameraRig.tsx` ch2 `pos.y` back to 1.0 (or 0.9 at most) and `HeroArmour.tsx` rotation y back to 1.2. Hide the neck hole with geometry instead: a dark gorget cap (a short open cylinder, ~0.16 m radius, #161310, roughness 0.9) seated over the neck opening. Keep the r27 stand pull-back and the contact shadow. *S lane.* Accept check: the c21 ch2 shot shows the lit chest highlight that c20 had, no neck hole visible, and feet not cropped at 1920.
2. **Floating strap tab** (carried from c20). Remove the scan islands or darken that material slot to #1a1511. *S lane.*
3. **Copy gap at 1512 is ≈30 px.** After the revert, re-measure. If it is under 45 px, nudge `BASE.x` by +0.05 m (toward the right). *S lane.*

### ch4 Contact (8.4)
1. **Flame root / beaded rim** (carried since c19). Add a glowing coal disc ~3 cm below the rim (emissive #ff7a2a, intensity ~2) and drop the beaded ring's emissive by ~60%. *S lane (FirePit; fixes ch0 as well).*
2. **Stray grey box behind the barrel** (new). Find the mesh (probably a ruin block or crate from Sanctum) and hide it in ch4, or tint it into shadow. *S lane.*
3. **Cold barrel base** (r27 only partly fixed it). Multiply the bottom band's albedo by a warm tint (#c08060) and reduce normal strength ~50%. *S lane.*
4. **Ghost-face smoke lobe.** Re-seed the noise offset; softening alone did not break the face. *S lane.*

### ch0 Hero (8.5)
1. **Floating red hoop on the barrel band** (new). It is wider than the barrel silhouette. Scale the ring to the barrel radius or remove it. *S lane.*
2. **The effigy reads as rubble.** Rotate it ~20° so the head end faces the camera, or raise the key light on it slightly so the figure's profile reads. *S lane.*

### ch3 Projects (8.5)
1. **Ghost disc behind the pager at 1920** (still present). Find the source with a layer toggle (bloom on a disc? a fog sprite?) and kill it. *S lane.*
2. **Hard wall edge at x ~1125.** Widen the fog card ~0.3 m left so it covers the edge itself. *S lane.*
3. **Floor diagonal at bottom right.** Fog it or end the floor plane earlier. *S lane.*

### ch1 About (8.5)
1. **Plinth body still clay.** Halve normal/bump strength on the body (the cap slab is right; match its stone). *S lane.*
2. **Bottom-right corner diagonal.** Drop fogFar to ~7.4, or end the floor plane before the corner. *S lane.*

## Cross-vendor check (advisory; the critic score above stays the gate)

`bun tools/or-vision-review.ts` on the five 1920 shots. The model was `nvidia/nemotron-3.5-super-vl:free` for all five. The key was never printed.
**The r27 tool fix held:** all 5 requests succeeded with no TLS crash, and the counter went 11 → 14. The counter read 11 before this run, so other callers had used some of today's budget; 14 of the 40-request daily cap are now used.
As before, the model's coordinates are on a downscaled frame and its absolute scores are uncalibrated (4-6).

| Shot | OR score | Defects it flagged that I did not | Verdict |
|---|---|---|---|
| ch0 | 6 | Embers look like low-res noise sprites | **Partial**: same as the standing ember-speckle partial. Low priority. |
| | | Floor prop (effigy) lacks a contact shadow | **Partial**: it is closer to the barrel now and catches its light, but the slab-to-floor join is soft. Fold it into ch0 #2. |
| | | Footer timestamp illegible | **Not measured this cycle** (selector missed; c20 asked for one measurement). Carry it to c22. |
| ch1 | 4 | Statue block floats in a void | **Partial**: the plinth base fades into fog with no visible floor contact. It is the same fog trade-off as the corner diagonal, so pair it with ch1 #2. |
| | | Body copy low contrast | **Reject**: measured 16-17:1 in c19. |
| | | Empty space right/bottom | **Reject**: it is deliberate negative space. |
| ch2 | 5 | Stand has no ground contact or shadow | **Partial**: r27 added a shadow, but it is too faint to register at a glance. Raise the opacity to ~0.8 after the revert. |
| | | Narrow column / rivers | **Reject**: the column is ~450 px and ragged-right, with no rivers visible. |
| | | Orange gradient banding behind the text | **Reject at 1920 DPR1**: no banding visible. It is the warm fill falloff. |
| ch3 | 6 | Low-contrast body | **Reject**: measured 9.1:1 in c19. |
| | | Pagination misaligned | **Reject**: the layout is consistent. |
| | | Headline ignores scene lighting | **Reject**: it is a deliberate flat editorial layer. |
| ch4 | 6 | Mustard email clashes | **Reject**: the gold accent is the site-wide link colour and is consistent across chapters. |
| | | Barrel looks like a cutout; lighting fails to integrate with the floor | **Partial**: it matches the cold base and the flame-root defects already listed (ch4 #1, #3). |
| | | Body copy small/thin | **Reject**: 18 px, consistent with the other chapters. |

Net: no new accepts and 5 partials, all folded into existing lanes. The model did not notice the ch2 regression (it scored ch2 5 here, vs 5 in c20), so it cannot be relied on to catch regressions.

## Keep
- 0 console errors on main across all 10 loads. The DPR floor (2268x1473) holds.
- The ch3 lantern light, the ch1 cap slab, and the removal of the ch0 stray silhouette.
- The ch2 stand pull-back and contact shadow. Revert only the camera Y and the torso turn.
- The `or-vision-review.ts` fetch guard now works under load.
