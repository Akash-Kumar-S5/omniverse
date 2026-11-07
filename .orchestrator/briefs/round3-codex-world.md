# Brief: codex-world, round 3 (Signal Field particles)
Read first: `.orchestrator/research/3D-PLAYBOOK.md` (sections 3, 4, 5), `.orchestrator/briefs/round3-contract.md`, `src/state/signal.ts`. Reference code in `.orchestrator/research/refs/` (gitignored, read-only).
Work in your worktree `.worktrees/codex-world` (branch r3/codex-world). Run `git merge --ff-only main` first.

## Outcome
A GPGPU particle swarm (SIM_SIZE per quality) that morphs per chapter shape (CHAPTER_SHAPE), driven by curl noise, repelled by the cursor, using `GPUComputationRenderer`. Particles keep identity across morphs (A -> curl scatter -> B over ~1.2s). Bust must read as a head within 1s. Soft-disc point sprites, additive, colour by depth/velocity using the current warm palette (see `src/scene/world/` palette).

## You own
`src/scene/particles/**` and `src/scene/shaders/**` (curl.glsl; noise libs vendored already). Export `SignalField` (props: SignalFieldProps) from `src/scene/particles/index.ts`. Do not edit anything else; do not mount it (agy-world mounts in Experience.tsx after you merge).
Files per playbook section 4: targets.ts, simulation.frag, ParticleSim.ts, particles.vert/.frag, SignalField.tsx.

## Steps (commit after each; report after step 1 so agy-world can mount early)
1. Minimal working SignalField: core sphere + cursor repel + build green. Write `signal.focus/radius/morph` each frame.
2. Targets: bust (MeshSurfaceSampler on marble_bust_01.glb; if the GLB is heavy, strip textures with `npx @gltf-transform/cli`, local npx OK, put the stripped file in public/assets/models and log in CREDITS.md), helix with 4 clusters (brighten cluster of store.activeRole), per-project glyphs from store.activeProject (text sampled to points via canvas, e.g. project names/initials), beacon with pulse.
3. Morph transitions on chapter change; scroll never pops. Quality tiers; reduced motion = cut to final shape, no turbulence. Write `anchors` for hero.core, about.object, projects.active, contact.beacon (screen-projected).
4. Perf: 262k on HIGH at ~60fps at 1440p. Check with a quick frame-time probe; drop to MEDIUM via a prop, not a store write.

## Rules
No network installs besides npx gltf-transform. Build + lint clean at every commit. Commit with a Co-Authored-By trailer. No push. Keep reply short; write `.orchestrator/reports/round3-codex-world.md` (<=40 lines: what's done, how to see it, known gaps).
