# Brief: codex-scene (kind codex)
Read `.orchestrator/briefs/COMMON.md` and `.orchestrator/PLAN.md` first.

## Outcome
Build the constellation itself, so that it looks premium and runs at 60fps:
- **Project nodes.** 8 nodes as an InstancedMesh. Each has an emissive core and a fresnel rim. Featured projects are larger. The node at `activeProject` brightens and pulses.
- **Tech satellites.** 18 small satellites, each slowly orbiting its parent node.
- **Edges.** Curved edges (quadratic bezier with an upward bow) drawn with a custom ShaderMaterial. A flowing dash/glow runs along each edge, driven by a time uniform.
- **Agent particles.** GPU particles travel along the edges. Use one Points or InstancedMesh whose positions are computed in the vertex shader from per-edge control points, so the CPU does no per-particle work.
- **Beacon.** At `beacon`, a beacon grows as `section === 'contact'`, while the graph contracts toward it.
- **Boot ignite.** On boot, everything scales up from the center once `booted` turns true.
- **Starfield and post.** A starfield of about 3k Points (about 1k in lite), plus Bloom from @react-three/postprocessing. Turn bloom off in lite.

Reduced motion: no ignite animation; particles and dashes either static or very slow.

## You own
- `src/scene/constellation/**`
- `src/scene/fx/**`
- `src/scene/layout.ts` (you may tune the positions; keep the export names and shapes)

Keep the default exports `Constellation`, `Starfield` and `Effects`.

## Read-only
- `src/state/**` and `src/content/**`
- `src/scene/Experience.tsx`, which belongs to codex-camera

## Acceptance
- Build and lint are clean.
- No allocations inside `useFrame`.
- No more than about 25 draw calls.
- No texture downloads.
