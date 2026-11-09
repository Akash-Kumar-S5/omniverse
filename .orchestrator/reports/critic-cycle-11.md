# Critic cycle 11 (main @ 3e45cc0, r15 merged)

Build: `npm run build` OK. Preview `vite preview --port 4394 --strictPort`. Server killed by pid after the shots and port 4394 confirmed free.
Playwright Chrome, 16 s settle per shot. ch0 was retaken at 20 s; see finding 3.
Shots: `.orchestrator/reference/critic-c11-ch{0..4}.png` (1440x900), `critic-c11-ch0-retake.png`,
`critic-c11-ch0-390.png`, `critic-c11-ch4-390.png` (390x844).
References: aengel.io and landing.love captures from earlier cycles, not re-shot. No transition frames this cycle.
Console: 0 errors, 1 warning (`THREE.Clock` deprecated, unchanged).
Direction constraint (Akash): the real flame stays in ch0 and in ch4 (fire beside "Say hello"). The fixes below are about finish quality only, not removing the fire.

## Scores (vs aengel.io / landing.love refs)

| Chapter | c10 | c11 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7.5 | **7.5** | The baked floor ellipse is gone. The floor is now a soft warm pool (620-1440, 440-760), the best floor so far. The embers are sparse thin sparks and clear the nav. The focal object is still a near-black can (925-1065, 395-540) with one small flame card (980-1010, 330-395). On a cold first load the whole 3D half was empty black at 16 s (`critic-c11-ch0.png`). |
| ch1 About | 8 | **8** | Unchanged. At 16 s the heading is still mid-reveal: "tools." is half grey (400-550, 235-295). |
| ch2 Work | 7.5 | **7.5** | The blue shaft is fixed. The cuirass is now underlit and muddy, a dark rust silhouette (1015-1305, 300-565) with little highlight. The stand is still a bare cuboid (1030-1440, 565-900) and corridor litter still shows (500-1100, 700-900). |
| ch3 Projects | 7.5 | **7.5** | The chain links are now a sensible size, but the chain still stops about 45 px short of the lantern (chain ends at y≈75, finial at y≈118, x≈1110). The lantern still floats. The painting is still a sepia ruin with no link to the project. |
| ch4 Contact | 8 | **7** | The barrel is back as the subject (r15) and brings back the ch0 problem. A big black can (690-935, 510-775) is the largest object in frame and carries no readable texture. The flame is one card (785-825, 415-510). A tall dark column rises straight out of the flame axis to the top of the frame (775-830, 125-510) and reads like a chimney or a render error. The relief (1005-1120, 345-745) and the warm floor are good. |
| Mobile 390 | 6.5 | **7** | Framing is fixed: on both ch0 and ch4 the barrel and relief are whole and grounded below the CTA. The barrel is still a black can (150-240, 650-745), and a thin magenta line runs along its rim (152-238, ≈651). |
| **Overall** | 7.6 | **7.4** | ch0, the floor and mobile framing improved. ch4 dropped a full point because the black barrel became its focal object. |

**ITERATE** (overall 7.4 < 8.5; ch0, ch2, ch3, ch4 and mobile are below 8).

## Top 5 reasons it still reads as slop

1. **The fire vessel is a black can everywhere it appears** (ch0, ch4, both mobile shots). The cause is in code, not in the asset. `Fire.tsx:35` multiplies the scanned barrel's albedo by 0.45 (`m.color.multiplyScalar(0.45)`) and forces roughness to 0.96, which flattens a Poly Haven scan into a silhouette. With the fire now required in two chapters, this object decides two scores.
2. **The flame is one billboard.** At 1440 it is about 30-40 px wide with no coal glow, no flicker light on the vessel and no heat haze, so it reads as a sticker on a can, not as fire in a can.
3. **Cold first load shows an empty scene at 16 s** (ch0 first shot: right half pure black). A first-time visitor sees text on black. The same URL rendered fully at 20 s on a warm cache.
4. **ch4 dark column on the flame axis** (775-830, 125-510): a vertical shaft behind the barrel lines up exactly with the flame and runs to the top of the frame.
5. **Leftover finish gaps:** the ch2 cuirass is now too dark, the ch3 chain gap remains, the ch1 heading reveal still runs past 16 s, and the mobile barrel rim has a magenta line (the coal disc's `#ff4000` emissive at `Fire.tsx:59`, seen edge-on).

## Top 5 fixes, ranked by visual gain per hour

1. **Give the barrel its scan back (≈20 min; ch0 +0.4, ch4 +0.6, mobile +0.4).** In `Fire.tsx:32-35`, drop the `multiplyScalar(0.45)` (or use 0.85 at most) and restore roughness to the glTF value. Add one warm, low point light (`#ff7a30`, short distance) just inside the mouth so the inner rim and rust catch flame light, plus the same off-screen warm key that lights the ch4 relief, so the barrel's camera-facing side shows rivets and rust. If the mouth interior blows out, darken only the coal disc, not the whole barrel. Proof: crops of the barrel at 1440 and 390 with visible surface texture.
2. **Finish the flame with what is already in the repo (≈30 min; ch0 +0.3, ch4 +0.5).** Keep the existing CC0 8x8 flipbook. Use 3 crossed cards at different heights, scales and frame offsets, about 1.4x the current height. Add a small additive ember-glow card sitting on the coal bed. Make the inner point light flicker (±15% intensity, about 8 Hz noise) so the barrel rim and relief move with the flame. No new shaders.
3. **Fix the cold-load blank (≈30 min; ch0 +0.3 on first impression).** Measure the time to first scene frame on an empty cache. Preload `fire_barrel.draco.glb`, the relief and `sanctum-lite.glb` before the full sanctum, or render the lite sanctum first and swap. The target is a lit fire within 4 s at 1440 on a cold cache. If that can't be met, fade the scene in rather than leaving black.
4. **ch4: break the column off the flame axis (≈15 min; ch4 +0.3).** Find the shaft behind the barrel (775-830, 125-510; likely a sanctum pillar or the volume cone). Either yaw the ch4 camera about 4° or move the barrel and relief pair so the column falls behind the relief or out of frame, and the flame has dark air above it. While doing that, change the coal-disc emissive at `Fire.tsx:59` to `#ff6a1a` and lower the disc about 2 cm so the magenta rim line on mobile goes away.
5. **Clean-ups (≈30 min; ch2 +0.4, ch3 +0.3, ch1 +0.2).** ch2 (`HeroArmour.tsx`): raise the warm key on the cuirass about 40% so the plates and rivets read again; darken the stand top and push the corridor litter out of frame. ch3: extend the chain to touch the lantern finial (close the ≈45 px gap). ch1: make the heading reveal finish within 6 s of the chapter becoming active.

## Keep
- The new floor with no ellipse and a soft warm pool. It is the template for every chapter floor.
- Desktop and mobile embers (thin, sparse, below the nav).
- Mobile framing (both subjects whole and grounded, below the CTA).
- The ch4 relief placement and lighting, and the ch1 typography and copy.

**Verdict: ITERATE** (overall 7.4; only ch1 is at 8).
