Files changed: `src/scene/camera/CameraRig.tsx`, `src/scene/Experience.tsx`
What works: Damped section camera poses, role spline follows scroll progress, project framing, touch-aware parallax, reduced-motion transitions, adaptive DPR, hidden-tab pause, lite quality.
Known issues: Vite reports the Experience chunk exceeds 500 kB; build succeeds.
Requests: None.
Commit hash: `7802916bc343c3c3dc050483227f79d438f6f92f` (implementation)
Fix round 1: findings 3, 5, and 12 fixed in `00543a4`.
Fix round 2: removed CameraRig activeRole writes; UI owns that state.
Fix round 3: reframed desktop Experience and Projects views; mobile framing preserved.
