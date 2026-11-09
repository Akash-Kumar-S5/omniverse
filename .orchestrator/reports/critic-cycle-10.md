# Critic cycle 10 (main @ 5daa3ab, r14 merged)

Build: `npm run build` OK. Preview `vite preview --port 4393`, killed by pid 26873 after shots, port confirmed free.
Playwright Chrome, 10 s settle per shot (ch1 retaken at 16 s, see note).
Shots: `.orchestrator/reference/critic-c10-ch{0..4}.png` (1440x900), `critic-c10-ch1-retake.png`,
`critic-c10-ch0-390.png`, `critic-c10-ch4-390.png` (390x844).
Reference: aengel.io / landing.love captures from earlier cycles (not re-shot). No transition frames this cycle.
Console: 0 errors, 1 warning (`THREE.Clock` deprecated; unchanged).

## Scores (vs aengel.io / landing.love refs)

| Chapter | c9 | c10 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7 | **7.5** | Pink mouth disc is gone and the rim is seen edge-on; the relief now stands on the floor, inside frame (1185-1295, 250-540). But the barrel is still the focal object and reads as a plain black can (925-1060, 395-535), the flame is one small card (985-1010, 330-395), the floor ellipse still has a hard edge (615-1440, 490-630), and the embers are round 4-6 px dots in a column that runs up through the nav over "Contact" (935-1075, 0-400). |
| ch1 About | 8 | **8** | Unchanged. Plinth still a featureless box. Note: the first shot at 10 s caught the heading half-revealed ("lately ag"); at 16 s it was complete. A heading reveal taking more than 10 s on a deep link is slow. |
| ch2 Work | 7 | **7.5** | The cuirass now has warm key light and reads clearly (1015-1305, 300-570). The new cool rim shows up as a separate blue vertical shaft behind it (1130-1300, 80-560), like a blue curtain, not a rim. The stand is still a flat cuboid (1030-1440, 565-900) and corridor litter still shows (500-1000, 700-900). |
| ch3 Projects | 7.5 | **7.5** | A chain was added, but it is two oversized links (1095-1125, 0-60) with a gap of about 55 px before the lantern (1085-1145, 115-205); it reads as a floating ring. The painting is still a sepia ruin with no link to SalarySync. |
| ch4 Contact | 6.5 | **8** | The subject swap worked. One scanned relief, upright, grounded, lit warm from off-screen, no flame cards. Leftovers: the floor's ripple normal map reads as sand dunes at this scale (0-1440, 600-900), and the right third of the frame is empty black (950-1440, 0-560). |
| Mobile 390 | 6 | **6.5** | ch0: embers are now thin sparks with no blob band behind the CTA (fixed). The barrel fills the bottom as a big black can (155-280, 530-670) with a hard floor ellipse (0-390, 590-720), and the relief is cut by the right edge (375-390). ch4: the relief is cropped by the bottom edge, so only its top half shows (215-305, 640-844), with no floor. |
| **Overall** | 7.0 | **7.6** | Best cycle yet. ch4 has reached 8. Every remaining weakness except ch3 comes from the ch0 barrel, the baked floor ellipse and the mobile framing. |

**ITERATE** (overall 7.6 < 8.5; ch0, ch2, ch3 and mobile are below 8).
No desktop chapter is below 7.5. Mobile (6.5) is under the line, so fix 1 applies the subject-swap rule there.

## Top 5 reasons it still reads as slop

1. **The ch0 barrel is a black can.** Desktop and mobile both show a dark untextured-looking cylinder as the hero object. The fire treatment improved, but the vessel carries no detail (ch0 925-1060×395-535; mobile 155-280×530-670).
2. **Hard floor ellipse, fifth cycle.** r14 says "floor spot removal" and `VolumeCone.tsx` confirms that no runtime spot remains. The ellipse is still there (ch0 615-1440×490-630, mobile 0-390×590-720) because it is **baked into the sanctum lightmap** (`Sanctum.tsx:62`: standard material with a baked lightmap). Tuning runtime lights cannot remove it.
3. **Embers are dots streaming through the nav.** On desktop they are round, 4-6 px, in a tight vertical column that crosses the "Contact" link. Mobile has the right look (thin sparks), but desktop does not match it.
4. **Mobile framing crops the subjects.** ch4's relief is cut in half by the bottom edge, and ch0's relief is cut by the right edge.
5. **Leftover mixed fidelity.** The ch1 and ch2 stands are bare cuboids under scanned objects, the ch2 blue rim reads as a separate light shaft, and the ch3 chain is two giant links with a gap.

## Top 5 fixes, ranked by visual gain per hour

1. **Mobile under 7.5: swap the subject, not the tuning (≈30 min; mobile +1.0).** Mobile ch4: move the camera back, or lower the relief, so the whole relief plus about 60 px of floor sits between the link row (+40 px clearance) and the bottom edge. Mobile ch0: take the barrel out of the frame and use the ch4 recipe, framing the scanned relief whole, bottom-centre, lit by the off-screen fire glow, with the sparks kept above it. Do not tune the barrel for mobile.
2. **ch0: demote the barrel, same recipe as ch4 (≈40 min; ch0 +0.6).** ch4 went from 6.5 to 8 by framing one scanned object and keeping the fire off-screen. On ch0, either swing `CAM_boot_wide` so the barrel is cropped at the left frame edge or sits behind and below the relief (its glow and sparks stay visible), or replace the barrel mesh with a finished scanned CC0 fire bowl or brazier (Poly Haven / Sketchfab CC0 scan). Do not add more flame cards.
3. **Rebake the floor without the spot (≈30 min incl. bake; ch0 +0.3, ch4 +0.2, mobile +0.3).** The ellipse is in the lightmap. In Blender, delete or disable the floor spot made by `blender/scripts/spot.py` for the sanctum scene, rebake with only the fire point (soft falloff), and re-export `sanctum.glb` and `sanctum-lite.glb`. Proof required: ch0 and ch4 crops of the floor with no visible edge. This has failed four cycles because the runtime light was the wrong target.
4. **Desktop embers to match mobile (≈15 min; ch0 +0.3, ch4 +0.1).** Use the same sprite and size rule as the 390 build: thin 1.5-3 px sparks, no round halo. Widen the spawn spread so the column does not form, and cap the height below the nav (y < 90 px at 1440x900).
5. **Clean-ups (≈30 min; ch2 +0.4, ch3 +0.3).** ch2 (`HeroArmour.tsx:51`): move the `#8fb0ff` point light behind the cuirass and drop its intensity about 50% so it edges the silhouette instead of lighting the back wall; darken the stand top. ch3: scale the chain links to about 1/3 and extend the chain to the lantern finial with no gap, or remove the chain. Optional: a scanned stone plinth for the ch1/ch2 stands.

## Keep
- ch4 composition (single grounded relief, warm off-screen light). This is the template for ch0 and mobile.
- ch1 as is. Typography and copy are still the strongest part.
- Mobile spark look; the removal of the pink disc and of the runtime spot.

**Verdict: ITERATE** (overall 7.6; ch1 and ch4 are at 8).
