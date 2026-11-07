# rv-scene review, round 2 (6549260..main, src/scene)
Build and lint are clean. Checked live on :5174 at 1440x900 in Chrome, with reduced_motion set to both no-preference and reduce.
Console in both runs has no WebGL/shader errors, and the round-1 feedback-loop errors are gone. The only lines are the vite noise, a THREE.Clock deprecation and an unrelated 404.

## Round-1 findings re-verified
1. FIXED. The instanceColor redefinition is gone, and node cores render with fresnel rims (seen live).
2. FIXED. Edges are a TubeGeometry (r 0.025) with a uv.x-driven dash. Curved, glowing edges with visible flow are seen live.
3. FIXED. Reduced motion uses smoothTime 0.3 and damps until within 1e-4. Under reduce, End lands on the contact pose (live), and the transition re-arms when reducedMotion toggles.
4. FIXED. The contact sphere and halo now sit outside the scaled root. Live under reduce: the sphere is large with a halo, and the graph has contracted around it.
5. FIXED. setActiveRole now runs for both motion modes and only fires on change (CameraRig.tsx:50-54).
6. FIXED. Satellites rotate their offset about the parent node in XZ, with no allocations (Constellation.tsx:128-137).
7. FIXED. Zero feedback-loop errors. Particles are visible travelling along the edges (seen live).
8. FIXED. EffectComposer multisampling is 4.
9. FIXED. tonemapping_fragment and colorspace_fragment are included in all three custom shaders.
10. FIXED. An unmount effect disposes the edge and particle geometries.
11. FIXED. Lights are removed, particles are `visible` false in lite, and the halo is only visible in contact (non-lite).
12. FIXED. `pixelated` is dropped, and PerformanceMonitor has flipflops={3} and onFallback that sets dpr 1.

## New, minor only (non-blocking)
a. Constellation.tsx:49-50 now subscribes to `section` and `quality`, so it re-renders on every section change. The inline `uniforms={{...}}` objects (edges, particles) are then recreated and reassigned. useFrame rewrites the values before draw, so nothing is visible, but memoizing those uniform objects would be cleaner.
b. CameraRig.tsx:50-54 writes activeRole every frame in the experience section. If the UI ever sets activeRole itself (click a role), the camera overrides it on the next frame. That is fine with the current stubs, so note it for agy-sections.
c. Under bloom, the contact halo reads as a hard-edged flat disc (additive sphere at 0.2 opacity). A fresnel or soft radial falloff would look more premium. This is taste only.

## Not verified live
The non-reduced camera choreography for about, experience and projects (right third, and mobile top half) is not checked. The UI is still stubs on main (no section ids, no HUD), so hash navigation did not scroll. The code paths are unchanged from round 1 apart from the role hoist, so rv-ui or the integration pass should screenshot them once the sections land.

## Bundle
The Experience chunk is 1.04 MB / 278.6 kB gzip, unchanged. It is lazy-loaded behind the 71 kB shell, which is acceptable.
Round 2 verdict: CLEAN

## Round 3: App.tsx (f681da4)
The goal is met: no WebGL means `Experience` never mounts, so its chunk is never requested. `?lite` and `setEnv` are both applied before `setEnvReady`, so the Canvas gets its lite gl settings on first mount. Lint and tsc are clean. StrictMode's double effect is fine: the listener cleanup is correct and setEnvReady is idempotent.
1. major App.tsx:20,24: the reduced-motion `change` listener re-runs `apply`, which calls `detectWebGL()` again. Each toggle (and each StrictMode run) creates and leaks a WebGL context. If that probe fails mid-session (context cap, GPU reset), `webgl` flips to false and the live scene is torn down for <Fallback/>. Fix: compute `webgl` once, and have the listener update only `reducedMotion`. In env.ts, release the probe with `getExtension("WEBGL_lose_context")?.loseContext()`.
2. minor App.tsx:17,28: `useEffect` runs after paint, so one empty frame paints (the overlay text used to be in the first paint). Fix: use `useLayoutEffect` (same code), which runs before paint.
3. minor: useScrollSync's initial `update()` (useScrollSync.ts:38) now runs while App renders null, before any section exists. On a mid-page reload the store says `boot` until the next scroll or resize. Fix: re-run the measurement when envReady flips, or call update in an rAF.
Round 3 verdict: CHANGES

## Round 4 (84f69bd)
1. FIXED. WebGL is probed once in the layout effect, the probe context is released via WEBGL_lose_context, and the motion listener only changes reducedMotion (`webgl` is fixed). StrictMode probes twice, but both probe contexts are released.
2. FIXED. `useLayoutEffect` means setEnv, ?lite and envReady are committed before first paint, so no empty frame paints.
3. FIXED by construction. `useScrollSync(envReady)` measures once the sections have committed, and a later scroll-restoration scroll or resize re-syncs. A true mid-page reload was not testable live: REA has no reload action, and a same-URL goto counted as a new navigation (scroll 0, HUD showed 01/05 BOOT, which is correct for scroll 0). Live console is clean, and lint and tsc pass.
VERDICT: CLEAN
