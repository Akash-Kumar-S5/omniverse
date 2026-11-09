# Critic cycle 12 (main @ 856a626, r16 merged)

Build: `npm run build` OK (chunk-size warning only). Preview `vite preview --port 4395 --strictPort`. I killed the server by pid after the shots and confirmed port 4395 is free.
Playwright Chrome, 16 s settle per shot, one fresh navigation per chapter.
Shots: `.orchestrator/reference/critic-c12-ch{0..4}.png` (1440x900) and `critic-c12-ch{0..4}-390.png` (390x844).
Console: 0 errors, 1 warning (`THREE.Clock` deprecated, unchanged).
References: aengel.io and landing.love from earlier captures. I shot threejspunk.vercel.app and rottensouls.com this cycle
(`ref-threejspunk-c12.png`, `ref-rottensouls-c12.png`), but both stopped at their own gates ("compiling shaders" and the click-to-start screen), so those shots only show a gate.
I cite them below for the techniques named in `lighting-references.md` and for what the rottensouls gate backdrop shows.
That backdrop never goes pure black: it builds depth from 3-4 grey fog layers of silhouette.
No transition frames this cycle.
Direction constraint (Akash): the real flame stays in ch0 and ch4. Every fix below is about finish quality.

## Scores

| Chapter | c11 | c12 | One-line reason |
|---|---|---|---|
| ch0 Hero | 7.5 | **7.5** | The barrel now shows its scan: rust and banding read (925-1065, 395-540). New fault: a ring of hot orange dots runs along the barrel base (930-1060, 520-535) and the rim lip glows as a solid orange line (925-1062, ≈397). Together they read as fairy lights or an LED strip, not iron. The flame is still small for the vessel (975-1020, 300-395, about 1/3 of barrel height). Everything above y=300 behind the subject is flat black with no depth. The cold-load blank did not repeat. |
| ch1 About | 8 | **8.5** | The heading reveal now finishes inside 16 s. The statue is well lit with good rim separation. The only weak spot is the plinth, a bare black cuboid (925-1230, 500-820). |
| ch2 Work | 7.5 | **7.5** | The cuirass now reads with weave, plates and rivets, which is a real improvement. But it is cropped by the right frame edge (1070-1440, 375-700), so the subject looks accidental. Faint blue-grey vertical streaks behind it (1100-1440, 80-700) read as dirty glass. |
| ch3 Projects | 7.5 | **8** | The chain meets the finial now. The painting reads as a SalarySync payroll UI, so it is finally on-topic. But the canvas texture is soft, with blurred table rows (885-1130, 320-630). The frame is skewed and floats in black with no wall or shadow under it. The lantern glints are the hottest pixels in frame and pull the eye off the project. |
| ch4 Contact | 7 | **7.5** | The column on the flame axis is gone and the barrel shows rust. The same base ring of orange dots (725-960, 740-768) and rim dots are the loudest detail in frame. A partial statue is clipped by the right edge (1385-1440, 455-565). The flame is still one flat-looking sheet at this distance. |
| Mobile 390 | 7 | **6.5** | Mobile now covers all 5 chapters. ch0 and ch4 are fine and identical in framing (the same dot ring at 150-235, ≈740). ch2 has no subject at all: just broken corridor fragments along the bottom (0-390, 730-820). ch3 shows only a sliver of the painting behind the text at the right edge (315-390, 280-620). ch1 puts the statue directly behind body copy (100-330, 80-450). |
| **Overall** | 7.4 | **7.6** | Real gains on ch1 and ch3. The fire vessel still decides ch0 and ch4, and mobile ch2 and ch3 are unfinished. |

**ITERATE** (overall 7.6 < 8.5; ch0, ch2, ch4 and mobile are below 8).

## Top 5 reasons it still reads as slop

1. **The barrel's glowing dot ring** (ch0 base 930-1060 ≈528, ch4 base 725-960 ≈755, both mobiles). The likely cause: the scan's rivets catch the new near-floor warm lights (`Fire.tsx:229-231`) and push past the bloom threshold (`Effects.tsx:61`, 0.96). I haven't verified that; it could also be embers resting at the base. The result reads as a toy.
2. **Pure-black backdrops.** On ch0, ch2 and ch4 the upper 40% of the frame is RGB ≈0. The rottensouls backdrop and the threejspunk alley (fog depth layers) both keep the background one or two stops above black, so the subject sits *in* a space. Ours sit on a void, which is the "template" look.
3. **Subjects cropped by the frame edge:** the ch2 cuirass (right edge), the ch4 extra statue (right edge), the ch3 painting on mobile, and the ch2 subject missing on mobile.
4. **The flame is undersized and flat** at 1440 compared with its vessel. rottensouls-style firelight relies on a flame big enough to justify the light pool on the floor. Ours lights a floor pool far bigger than its flame could cast.
5. **Soft hero-asset textures in ch3:** the payroll canvas is blurred compared with the crisp lantern and the crisp type next to it.

## Top 5 fixes, grouped per chapter (lanes can run in parallel)

### Lane A: Fire (ch0 + ch4, `src/scene/world/Fire.tsx`)
1. **Kill the dot ring and the hot rim (≈20 min; ch0 +0.4, ch4 +0.4, mobile +0.2).** First find the source: toggle the `[-1.7,0.75,1.7]` key and the 3.2 mouth light, and check whether embers spawn at y≈0.
   If it's rivet specular, clamp it. Set barrel `metalness` ≤0.3 or raise `roughness` to at least 0.7 on the scan material only. Or lift the key to y≈1.4 so it grazes from above (threejspunk's key/rim split), not from rivet height.
   If it's embers, start the spawn y at the mouth (≈0.65). The rim line is the mouth light hitting the lip edge, so drop that light 8 cm into the mouth.
   Proof: 1440 crops of the base with no dots above luminance 0.8.
2. **Scale the flame to the vessel (≈15 min; ch0 +0.3, ch4 +0.3).** Make the crossed-card stack about 1.6x taller, so the flame reaches roughly 0.6x the barrel height above the rim. Lower the floor-pool light intensity about 15% so the pool matches the flame size (rottensouls falloff: bright near the source, black by 2 m).

### Lane B: Backdrop depth (ch0, ch2, ch4; Sanctum/fog, `World.tsx` / `chapterLook.ts`)
3. **Lift the void to "dark, not black" (≈30 min; ch0 +0.3, ch2 +0.3, ch4 +0.3).** Use existing fog and lights only, with no new effects. Set the scene fog colour to about `#0b0907` and raise its density so the far sanctum pillars show as 2-3 faint silhouette layers (threejspunk depth layers; rottensouls backdrop).
   Add one very low cool rim light (`#6a7a90`, intensity ≈0.3) from behind each chapter subject to separate it from the background.
   Target: background luminance 3-6% instead of 0%, with the subject still the brightest object.

### Lane C: Framing (ch2, ch4, mobile ch2/ch3; `ChapterLook` camera targets)
4. **Put every subject fully in frame (≈30 min; ch2 +0.5, ch4 +0.2, mobile +0.8).**
   - ch2 desktop: pan or yaw the camera so the cuirass sits at x≈1000-1300 with 80+ px of air to the right edge.
   - ch4 desktop: move or hide the extra statue clipped at 1385-1440, or yaw it fully out of frame.
   - Mobile ch2: frame the cuirass in the bottom third under the card, as ch0 and ch4 frame the barrel, and remove the corridor fragments at 730-820.
   - Mobile ch3: show the whole painting below the Previous/Next row (y 620-840) and don't let it show behind the text.
   - Mobile ch1: drop the statue below the "Where I've worked" link, or dim it another 30% behind the copy.

### Lane D: ch3 finish (`ProjectArtefact.tsx`)
5. **Sharpen the canvas and seat the frame (≈25 min; ch3 +0.4).**
   - Raise the payroll texture resolution, or set `anisotropy` to max with mipmaps off, so the table rows read.
   - Square the frame to the camera (or keep at most 5° of skew).
   - Add a soft contact shadow or a dark wall plane behind it so it hangs on something.
   - Cap the lantern emissive or bloom so the canvas, not the lantern glints, is the brightest area.
   - Optional, ch1: a scanned stone plinth top instead of the bare cuboid (+0.2).

## Keep
- The ch1 statue lighting and reveal timing, which currently set the bar.
- The barrel scan albedo at 0.85 (r16): rust now reads.
- The ch3 chain-to-finial connection and the on-topic payroll painting.
- Floor pools with no ellipse, the sparse embers, and ch0/ch4 mobile framing.

**Verdict: ITERATE** (overall 7.6; ch1 8.5 and ch3 8 pass; ch0 7.5, ch2 7.5, ch4 7.5 and mobile 6.5 do not).
