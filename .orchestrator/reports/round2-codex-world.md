# Round 2 codex-world
Files: `src/scene/constellation/`, `src/scene/fx/`, `src/scene/world/`, `src/scene/anchors/`.
Works: warmer palette; procedural agent core, marble bust with procedural loading fallback, varied project monoliths, reflector floor, local EXR HDRI, fog and light shafts.
Works: chapter-specific lighting and fog; lite mode removes transmission, reflector and post; anchors and Canvas load progress writer exported.
Checks: `npm run build` and `npm run lint` pass.
Known issues: chapterLook values are mirrored locally because `src/scene/camera/chapterLook.ts` is on the codex-chapters branch and is not on main yet; no runtime FPS or screenshot review was performed.
Known issues: Vite warns that the Experience chunk exceeds 500 kB minified (about 278 kB gzip).
Integration: codex-chapters should mount `World`, `AnchorWriters`, and `LoadProgress` inside the Canvas.
Requests: no new anchor IDs or contract changes.
Commit: `9bc45d48c964c47934550acc2b4a8afa89e91c25`.
