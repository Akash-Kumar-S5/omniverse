# Omniverse: build plan (Concept A, Agent Constellation)

## Stack
- Vite 6 + React 18 + TypeScript (strict). Static build, no server.
- three + @react-three/fiber + @react-three/drei + @react-three/postprocessing (bloom).
- GSAP (ScrollTrigger is not used; scroll progress comes from a single native scroll listener into the store).
- zustand for shared state. ESLint (typescript-eslint, react-hooks).

## Architecture contract (orchestrator owns these; builders read, never edit)
- `src/content/*.ts`: data copied from the 2D portfolio (projects, experience, tech, profile).
- `src/state/store.ts`: zustand store:
  - `section: SectionId` ('boot' | 'about' | 'experience' | 'projects' | 'contact')
  - `progress: number` 0..1 over the whole page; `sectionProgress: number` 0..1 inside the section
  - `activeProject: number`, `setActiveProject(i)`; `activeRole: number`
  - `booted: boolean`, `setBooted()`
  - `quality: 'high' | 'lite'`, `reducedMotion: boolean`, `webgl: boolean`
- `src/App.tsx`: mounts `<Experience/>` (scene, fixed full-screen canvas behind) and `<Overlay/>` (DOM,
  scrolls normally). Detects WebGL + reduced motion. If no WebGL, renders `<Fallback/>` only.
- Scroll: the page is real DOM. Each section is a `<section data-section="...">` of fixed height (vh).
  `src/state/useScrollSync.ts` maps window scroll to store `section/progress/sectionProgress`.

## Ownership (no two builders touch the same file)
| Area | Owner | Paths |
|---|---|---|
| Scaffold, contract, store, content, App, configs | orchestrator | `src/state/**`, `src/content/**`, `src/App.tsx`, `src/main.tsx`, root configs |
| 3D scene, shaders, camera, perf | codex | `src/scene/**` only |
| DOM overlay, HUD, sections, fallback, styles, responsiveness | agy | `src/ui/**`, `src/styles/**`, `index.html` meta only |
| Review + QA | claude | read-only; writes `.orchestrator/REVIEW.md` |

Each builder works in its own git worktree on its own branch; orchestrator merges.

## codex: scene
- `src/scene/Experience.tsx` (default export, the `<Canvas>`), dpr clamp [1, 2] (lite: 1), `frameloop` always.
- Constellation: 8 project nodes (instanced, emissive, size by `featured`) placed on a seeded layout;
  18 tech satellites; curved edges (QuadraticBezier → line geometry with a flowing-dash shader);
  GPU particles ("agents") travelling along edges (one InstancedMesh or Points with a time uniform).
- Starfield backdrop (Points, ~3k, lite ~1k). Bloom via postprocessing (disabled in lite).
- Camera rig driven by store `section` + `sectionProgress`: boot ignite → wide orbit → spline follow for
  experience (4 waypoints = roles) → focus on `activeProject` node → collapse to beacon for contact.
  Damped (maath/easing), never snapping. Pointer parallax small.
- Reduced motion: no camera flight (cross-fade between fixed poses), particles static or very slow.
- Perf: target 60fps at 1440p on M-series and mid phones; no per-frame allocations; <= ~30 draw calls.

## agy: UI
- `src/ui/Overlay.tsx` (default export): the scrolling DOM sections over the canvas.
- Boot preloader: terminal boot log typed out, then calls `setBooted()`. Skippable, respects reduced motion.
- HUD frame: corner brackets, section index (`01/05`), live clock (Asia/Kolkata), status "online".
- Sections: About (name, pitch: software engineer building AI tooling), Experience (4 roles as waypoints
  synced to `activeRole`), Projects (list + detail panel, prev/next, keyboard arrows, drag on touch, sets
  `activeProject`), Contact (GitHub, email copy-to-clipboard, LinkedIn if present in content).
- `src/ui/Fallback.tsx`: full content as a styled 2D page for no-WebGL.
- Lite toggle (sets `quality`). Typography: a display font + mono via Google Fonts. Dark palette, one
  accent. Mobile first; text legible over the scene (scrims where needed). Accessible: landmarks, focus
  states, contrast AA.

## Done = 
`npm run build` and `npm run lint` clean; desktop + 390px mobile checked in browser; reduced-motion and
no-WebGL paths work; review clean.
