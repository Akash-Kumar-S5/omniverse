# Round 3: "Ember & Ash", an original dark-fantasy direction (Akash, 2026-11-08 10:25 IST)

Akash asked for a souls-like feel (inspired by Dark Souls / Elden Ring). He approved an ORIGINAL dark-fantasy
direction. Hard rule: **no assets, textures, models, music, logos, characters, UI or names ripped from or imitating
FromSoftware/Bandai Namco games.** We evoke the mood (ruin, ember, solitude, cold stone vs warm fire) with our own
and CC0 material. Don't name anything after their games or items ("bonfire" as a UI word is out; say "fire" or "hearth").

## OVERRIDE (Akash, 10:22 IST): "this time don't build anything new, only use the assets"
- NO new modelling in Blender, NO custom-built geometry, NO new shaders or effect code.
- Use ready-made CC0/CC-BY assets AS-IS: complete ruin/cathedral/dungeon models or modular kits (Sketchfab CC0/CC-BY
  "gothic ruin", "ruined cathedral", "dungeon"; Quaternius modular dungeon/medieval kits (CC0); Kenney; Poly Haven
  statues/rubble/candles; Smithsonian CC0 scans). Blender is only for importing, placing, scaling, lighting, baking and
  exporting them.
- Effects come only from existing components: drei `<Sparkles>` for embers/ash, drei `<Cloud>`/`<Clouds>` for mist,
  a plain pointLight with a flicker for firelight, and the existing SignalField retuned (colour/size/params only).
- If no suitable ready asset exists for something, leave it out rather than build it.

## What changes (the type, copy, 5 sections and editorial UI stay)
1. **Architecture** (blender-sanctum, Blender MCP): turn the concrete chamber into a ruined gothic hall in the same
   layout: pointed arches, broken pillars, rubble, a collapsed vault opening onto the night sky (keep the oculus idea).
   CC0 sources: Poly Haven (rocks, rubble, statues, stone textures), Smithsonian 3D (scanned sculpture, CC0),
   Sketchfab CC0 only (gothic/ruin), Kenney/Quaternius only where it fits. Every asset in CREDITS.md with its licence.
   Re-bake the lighting (warm firelight on cold stone), export <= 4 MB total, lite <= 1 MB.
2. **Embers instead of the swarm** (agy-world): the Signal Field becomes rising embers and ash. A warm core at a fire on
   the central plinth, particles drift up the light shaft with curl noise, flicker, and cool from orange to grey ash.
   Each section still has its shape (the About bust is outlined by embers, the project glyphs are formed from embers).
   The cursor stirs the embers.
3. **Atmosphere:** low floor mist (soft volumetric/sprite fog), a warm flickering point light from the fire, the cold
   moonlight beam kept, candle clusters as small practical lights in alcoves.
4. **Contact section:** the fire as the resting place, with "Say hello." beside the hearth.
5. **Sound (optional, off by default):** a CC0 fire-crackle loop, only after the user enables it. Skip if it costs a round.

## Constraints
- Perf budgets unchanged (>=55fps HIGH 1440p, LITE smooth on mobile, payload <=8 MB).
- The anti-slop rules still apply; the fantasy mood must not drift into clichés (no gothic blackletter fonts, keep the type).
- Reuse-first: drei Sparkles/Cloud for mist, existing SignalField sim retuned (not rewritten), Blender scripts extended.
- Evidence = screenshots per section via ?skipgate&chapter=N; both reviewers score again afterwards (improvement loop).
