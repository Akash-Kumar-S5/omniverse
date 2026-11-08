# Critic cycle 1 (2026-11-08 14:22 IST)

Build: main @ da47c4a, http://localhost:5173, headed Chrome via Playwright, real GPU (ANGLE Metal, Apple M3 Pro).
Shots: `.orchestrator/reference/critic-c1-ch{0..4}.png` (1440x900), `critic-c1-ch0-390.png`, `critic-c1-ch4-390.png`,
mid-scroll frames `critic-c1-scroll-{a,b,c}.png`.
References: `aengel-03-project-chapter.png` and `bench-seed-2.png`. Both were already in the folder at 1440x900, so I
reused them instead of shooting them again.

## Scores (vs aengel.io / SEED)

| Chapter | Score | One-line reason |
|---|---|---|
| ch0 Hero | 3/10 | A blurry bokeh blob sits in a concrete tube, with no fire, no knight and no keeper. It reads as a broken particle demo. |
| ch1 About | 4/10 | A good scanned statue on a flat-shaded pastel Kenney block plinth, with coloured toy boxes around it. |
| ch2 Work | 4/10 | The arched corridor is the best frame on the site, but it is lit grey-blue and flat, and a glitter column cuts through the text. |
| ch3 Projects | 3/10 | Camera is jammed into an untextured slab. The painting is tiny and off to the side, and an orphan particle smudge has a tooltip pointing at it. |
| ch4 Contact | 2/10 | "Say hello" is meant to sit by the hearth, but the hearth isn't there. You see a black hole, a ring and a smear of glitter. |
| Mobile 390 | 3/10 | Text is readable, but the 3D is a black disc with noise. There is no object at all. |
| **Overall** | **3/10** | |

**ITERATE**

## Root cause (one fact explains most of it)
**Not one prop from the 13:05 direction is in the scene.** `public/assets/props/` holds 19 GLBs (knight, hooded keeper,
cloaked knight, brazier, fire-flame-3d, helmets, shields, candelabra, banner and others), and `rg "props/" src` returns
**zero hits**. The orchestrator logged "props done" because files were downloaded and credited, not because anything
rendered. The site is still the round-2 particle swarm in a re-skinned box. Every chapter still has a glowing particle
blob where an object should be, and that blob is the single strongest "AI demo" signal on the page.

Second fact: the props that *were* sourced are the wrong class. Quaternius and KayKit are chunky, flat-coloured, low-poly
game kits. If they were wired in as-is, they would sit beside the photoscanned Poly Haven statue and Hubert Robert
paintings and produce exactly the mixed-fidelity clash Akash is reacting to. Do not wire them; replace them.

## Top 5 reasons it reads as slop

1. **Glowing particle blobs where the subject should be** (ch0 right side, ch2 right column, ch3 next to the frame, ch4 on
   top of the ring, scroll-b over the body text). Each is a soft white-gold sprite cloud with no form. In ch0 it's meant
   to be a bust, but at this scale it reads as a JPEG artefact. SEED earns its particles because there is a real,
   rim-lit object at the centre (bench-seed-2). Here the particles *are* the object, so nothing anchors the eye.

2. **Mixed asset fidelity, and the cheap side dominates** (ch1, ch2, ch3). The ch1 statue is a real scan, but it stands
   on a matte pastel Kenney block. The "candles" around it are pink and black flat-shaded cubes that look like Monopoly
   houses (Kenney `candle-multiple.glb`, missing its colormap per CREDITS). In the ch2 corridor, Quaternius modular
   walls carry stretched Poly Haven concrete with a visible tiling seam, and the floor is a grid of identical
   bevelled tiles. The ch2 rubble is low-poly boulders with a stretched rock texture. The eye goes straight to the
   cheapest object in frame.

3. **Flat, wrong-coloured lighting: no fire anywhere.** The brief says "light only from fire, candles, moonlight". The
   build is lit by roughly ten blue-white point lights (`World.tsx:42-72`, `#b0d4ff`/`#d4e2f8` at intensity 2.4-2.8),
   so ch2 and scroll-c look like a grey basement under fluorescent light. There is no warm key, no falloff into black,
   and no contrast between cold stone and warm fire. The single orange smudge in ch3 (centre-left) is a light with no
   source. Aengel works because the dark stays black and there is one light on one subject.

4. **Camera framing is broken in three of five chapters.**
   - ch0: the camera looks *up* the oculus tube, so the hero is a black circle with a stripe.
   - ch3: a slab fills about 40% of the frame at near-clip distance. The frame (the one good object) is small and in
     the right third. A callout points at empty air with "SalarySync / Laravel, PHP".
   - ch4: the camera looks straight up at the oculus again.

   No chapter has a deliberate composition: one subject, set off the text column, with depth behind it.

5. **Text fights the scene, and some copy is cliché.**
   - In ch2 the glitter column runs straight through the bullet text; in scroll-b it covers it.
   - In ch3 (Fuel Dispenser) the title runs across the bright corridor, so "RFID App" fades to about 30% contrast.
   - ch1's heading "lately ag…" is clipped mid-reveal.
   - The ch4 eyebrow "A RESTING FIRE AT THE JOURNEY'S END" is all-caps tracked mono, which ANTI-SLOP §5 fails outright.
     It's also game-pastiche copy that the round-3 naming rule warns against.
   - The "Graphics: High/Medium" readout flips between loads and adds nothing.

Also seen:
- The console throws `Cannot update a component while rendering a different component (LoadProgress / ReflectorFloorMesh)`
  on every load.
- `gothic_statue.glb` is 3.9 MB uncompressed and `stone_fire_pit.glb` is 2.5 MB, which threatens the 8 MB budget.
- The grain overlay is visible on the flat walls (ch3, scroll-b).

## Top 5 fixes, ranked by visual gain per hour

1. **Kill the particle blobs as subjects (about 1 h, biggest gain).** In `SignalField`, drop every section shape (bust,
   glyphs, column, ring cluster). Keep only a sparse `<Sparkles>` ember lift of about 40-60 points, scoped to a 1 m
   cylinder above the hearth, sized 1-3 px, cooling from orange to grey. Nothing glowing sits behind body text. Without
   this, nothing else will read as quality.

2. **Put a real fire in the frame and relight from it (about 2 h).**
   - Wire `stone_fire_pit.glb` (Poly Haven scan, draco-compress it to under 600 KB) at the plinth.
   - Put Kenney's `flame-spritesheet-6x1.png` flipbook on a camera-facing billboard inside it. That uses an existing
     drei `<Billboard>` plus a texture offset, not a new shader.
   - Add one warm pointLight `#ff8a3d` (intensity 6-8, distance 10, decay 2) with a ±15% flicker as the only warm source.
   - In `World.tsx:42-72`, cut the blue fills to one cold moon key `#9fb3d1` down the oculus at about 30% of the current
     intensity and delete the rest. Let the walls fall to black.
   - Then re-frame ch0 and ch4 at eye level on the fire. Get the camera out of the oculus tube.

3. **Replace the low-poly props with scans, and wire them (about 2-3 h for sourcing plus placement).** Delete the
   Quaternius and KayKit figures from the plan. Source photoscan or photoreal CC0/CC-BY assets only:
   - **Poly Haven:** `stone_fire_pit` (have it), `gothic_statue` (have it), `marble_bust_01`, rock and rubble scans
     (`rock_moss_set_01/02`, `boulder_01` with its real textures), `wooden_candlestick`/`brass_candle_holders` and
     `lantern_chandelier_01` for practical lights.
   - **Smithsonian Open Access (CC0):** a scanned medieval helmet or armour piece for ch2, and a scanned funerary or
     mourning sculpture as the "hooded keeper".
   - **Sketchfab CC-BY photogrammetry:** search "photogrammetry knight statue", "cathedral statue scan",
     "tomb effigy scan", filter Downloadable + CC-BY, and keep each under 50k tris after decimate.

   One hero object per chapter: ch0 a mourning or hooded statue scan by the fire; ch1 the gothic statue; ch2 a scanned
   helmet or armour on a plinth, one per job; ch3 the frame; ch4 the fire pit. Credit everything.

4. **Fix the ch1 plinth and corridor materials (about 1 h, Blender re-bake only).**
   - On `sanctum_09_ruins.py`, swap the Kenney `altar-stone` and `candle-multiple` (missing colormap) for the Poly Haven
     scan candles above, or delete them.
   - Retexture the ch1 plinth and ch2 floor with Poly Haven `castle_brick_broken_06` / `cobblestone_floor_13` at
     triplanar or proper UV scale, with roughness and AO, so there are no stretched seams and no identical tile grid.
   - Re-bake under the new fire-plus-moon light.

5. **Re-frame cameras and clean the text layer (about 1 h).**
   - In `CameraRig` / `chapterLook`:
     - ch0 and ch4 look at the fire from about 1.6 m height, with the subject in the right 2/5.
     - ch3 pulls back about 2 m and centres the frame in the right half, with no slab in the foreground.
     - ch2 holds the corridor vanishing point right of the text column.
   - Add a left-side 0→60% black gradient behind the text column only where the 3D is bright (ch2, ch3). No glass.
   - Replace the ch4 eyebrow with nothing, or a sentence-case line in Schibsted.
   - Delete the callout that points at nothing.
   - Make "Graphics" a quiet icon, or remove it.
   - Fix the LoadProgress setState-in-render error.

## What is actually good (keep it)
The type system (Newsreader + Schibsted) and the copy are now clean and human. Keep the ch2 pointed-arch corridor
composition and the Hubert Robert paintings. Once the 3D stops competing with it, the left-column editorial layout is
stronger than most of the references.

**Verdict: ITERATE** (overall 3/10; every chapter is below 8).
