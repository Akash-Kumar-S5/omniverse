# codex-scene report
- Files changed: `src/scene/constellation/Constellation.tsx`, `src/scene/fx/Effects.tsx`, `src/scene/fx/Starfield.tsx`, `src/scene/layout.ts`.
- What works: Instanced project cores/rims and orbiting tech, shader-flow edges and GPU particles, contact beacon, boot ignite, seeded 3k/1k starfield, high-quality bloom.
- Reduced motion freezes particle and edge flow and skips ignite; lite mode reduces star count and disables bloom.
- Verification: `npm run build` and `npm run lint` pass.
- Known issues: Vite warns the scene chunk is 1,026.60 kB minified.
- Requests: None.
- Commit hash: `87b5c6d3d1d86a50c1e65b9792df2cee6f0fe451`.
