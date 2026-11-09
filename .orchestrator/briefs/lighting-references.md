# Lighting and mood references (Akash approved, 09-Nov 11:45 IST)

Reference only: study the look, don't copy code or assets into our repo. Our stack stays WebGL (three r187 + R3F 9).
The round-3 rule still holds: use ready-made assets plus existing components; no new shader or effect systems.

1. ektogamat/threejs-conference (MIT), live demo: https://threejspunk.vercel.app/
   Rainy alley by the TSL author. Study: how a dark scene stays readable (key/rim separation, wet-stone
   specular, fog depth layers, light pools on the floor instead of hard spot ellipses). AGENTS.md lists
   technique recipes; translate the ideas into our existing lights/materials (roughness/env intensity,
   light placement, fog), not their WebGPU/TSL code.
2. igorjohn/rotten-souls (MIT), live: https://rottensouls.com
   Original browser dark-fantasy arena at night with embers. Closest mood match. Study: firelight falloff on
   stone, ember density and scale, how much of the frame stays black, how the subject is separated from the background.
   Don't use its names, characters or assets anywhere.

Use: critic and judge may cite these alongside aengel.io and landing.love. Lanes open the live demos in Playwright
(screenshot to .orchestrator/reference/ref-*.png) before changing lights on ch0/ch2/ch4.
Later (v2, after SHIP only): WebGPURenderer plus Voluma-ai/vlam (MIT) Gaussian splats for photoreal subjects.
