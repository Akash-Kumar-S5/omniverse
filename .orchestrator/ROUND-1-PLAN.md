# Round 1 plan (draft; items 2-3 finalised after reviewer score tables)
## 1. Signal Field: living volumetric swarm (Morph's check of 5c8fdcc ch0) — owner agy-world
Problem: flat disc of large opaque beige pebbles, overlaps "Kumar".
Do: particles ~3-4x smaller, size attenuation + depth falloff; additive soft-disc sprites, luminous core, dim edges,
a few brighter "agent" particles; volume (turbulent sphere/core, curl-noise drift) not a flat disc; slow breathing;
composition fully right of ~58% width on ch0 (desktop), never touching the name; keep mobile sane and perf >=55fps HIGH.
Use Context7 (drei Points/three PointsMaterial/ShaderMaterial point sprites). Reuse existing SignalField/targets.
Acceptance: ?skipgate&chapter=0..4 at 1440x900 + 390x844 screenshots, no GL console errors, build+lint clean.
## 2. Composition fixes: ch3 glyph visible + ch2 ribbon off the text — owner agy-world (after item 1; same files)
ch3 glyph swarm sits at z=-29.5 behind the monolith occluder (z=-13.5): bring it beside the active slab, morph on project change.
ch2 helix ribbon sits behind the role card: shift to right half (x>0). Acceptance: ?skipgate&chapter=2,3 shots, swarm visible, text contrast intact.
## 3. Cursor wake + ch1 bust callouts — owner agy-world (cursor wake, shader) then copilot (bounded: HUD leader-line callouts, aengel-04 pattern, one turn)
Larger repulsion radius + lingering curl wake; 2-3 DOM micro-labels with thin leader lines on the bust. Acceptance: chapter=1 shot + a cursor-move before/after pair.
Scores (agy-review): ch0 8.5, ch1 8.5, ch2 8.2, ch3 7.8, ch4 8.8; avg 8.36. Morph's eye says ch0 swarm is weaker than 8.0 3D craft (agy is generous): weight Morph's check. copilot-review table pending.
