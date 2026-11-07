# Round 2: from "working demo" to "award-site quality"

From Morph, after a side-by-side review against https://aengel.io/ at 1440x900, motion on.
Screenshots: `.orchestrator/reference/` (aengel-*.png = the bar, omni-*.png = where we are).
Akash's verdict request: "if it's not good enough, improve it, use external resources".
Verdict: **not good enough yet.** It works and is clean, but it reads as a dashboard
with a 3D screensaver behind it. aengel reads as a film you walk through.

## What is good (keep)
- Agent Constellation concept fits Akash (AI tooling). Keep it, deepen it.
- Stack, scroll sync, waypoint structure, perf toggle, no-WebGL fallback, reduced motion.
- Real content from the web repo (profile, 4 roles, projects, tech stack).

## Gaps, ranked (each with the fix)

1. **Bug: panels overlap while scrolling** (omni-02, omni-03). The previous section's card
   ghosts at the top of the viewport, two cards stack, and card text collides with the
   top-left HUD ("AKASH KUMAR / AI TOOLING" overprinted by body copy). Exactly one section
   overlay may be visible at a time; outgoing fades/translates out before incoming enters;
   overlays never enter the HUD safe zones (top 90px, bottom 90px). Fix this first.

2. **The 3D is a backdrop, not the subject.** A 520px card covers ~40% of the canvas on every
   section. aengel gives the scene the full frame and keeps text small and anchored.
   Fix: full-bleed scene; text overlays become lightweight (no boxed cards on hero/about/
   projects), max ~420px wide, placed in negative space the camera framing leaves for them.
   Only the dense Experience timeline may use a panel, and it should be glass, not a slab.

3. **No art direction / authored objects.** Every node is the same cyan wireframe icosphere
   with bloom. aengel uses authored GLB models (stone arch, ferns, crystal, a lily), real
   lighting (god rays, fog, reflective water), PBR + transmission materials.
   Fix: give each chapter a hero object with a distinct material, e.g.
   - Hero: a dense constellation "core" (instanced points + a transmissive crystal at center,
     `MeshTransmissionMaterial` from drei with chromatic aberration, HDRI env).
   - Each project node: its own monolith/crystal with an inner emissive "payload" hinting at
     the project, reflective floor (`MeshReflectorMaterial`), volumetric-ish light shafts.
   - About: one organic or sculptural object with callout leader lines (see 5).
   Palette: drop the generic neon-cyan-on-navy. Pick one accent and a near-black with warmth
   or depth; let lighting, not glow, carry it. Bloom subtle (threshold high).

4. **Typography has no voice.** Small card headings + mono labels everywhere. aengel opens with
   huge tight display type ("AENGEL / DESIGN ENGINEER") and per-character rolling CTAs.
   Fix: a display face (free: Clash Display / General Sans / Satoshi from Fontshare, or
   Space Grotesk / Archivo at 800-900 tight tracking from Google Fonts), hero name at
   clamp(64px, 11vw, 180px), uppercase, -0.04em tracking. Mono only for tiny metadata.
   Per-character split reveal on headings (GSAP SplitText is free since 2025).

5. **No 3D-to-text connection.** aengel's About pins labels to points on the 3D model with thin
   leader lines and coordinates ("flower.glb", "computed stem", "based in thailand").
   That data-viz look suits an AI-tooling engineer perfectly.
   Fix: drei `<Html>` or projected screen positions + an SVG line layer; labels like
   "orchestrator.ts", "agents: 5", "based in chennai", live IST clock + lat/long.

6. **Chapters all look the same.** Same constellation from slightly different angles.
   aengel changes the world per chapter (gate scene -> project crystal -> about flower).
   Fix: each waypoint = a distinct camera composition and lighting state; projects become
   full-screen chapters with "01 / 0N  NEXT PROJECT", drag/arrow to switch, camera flies
   node-to-node. Add a smooth scroll layer (Lenis) driving the existing scroll sync.

7. **No entrance moment.** aengel: preloader with real % (asset loading), editorial grid,
   then an "Enter the experience" gate (also the place to unlock optional audio).
   Fix: preloader bound to drei `useProgress`, the counter + name in display type, Enter
   button, then a camera push-in. Skip the gate for reduced-motion and LITE.

8. **Copy describes the site instead of Akash.** "Welcome to the Agent Constellation. A 3D
   interactive cosmos where..." Fix: one confident line about what he builds
   (from PRINCIPAL identity: "I build the tooling that lets AI agents do real work:
   harnesses, orchestration, developer tools."). Cut boilerplate achievement bullets to
   the 1-2 most concrete per role. No "SYSTEM ONLINE // CONSTELLATION READY" clichés.

## External resources (allowed, encouraged)
Licence rule: CC0 or CC-BY only, never rip assets/text from aengel or other sites.
Record every external asset in `CREDITS.md` (name, author, URL, licence).
- HDRIs, textures, models: https://polyhaven.com (CC0). Small 1k/2k HDRIs only.
- Models: https://sketchfab.com (filter "Downloadable" + CC-BY/CC0), https://quaternius.com,
  https://kenney.nl (CC0). Prefer < 2 MB each after compression.
- Compression: `npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`
  (local npx, no global installs) and `npx gltfjsx` for typed components.
- drei: MeshTransmissionMaterial, MeshReflectorMaterial, Environment, Float, Sparkles,
  Text3D/Text, Html, useProgress, PerformanceMonitor, AdaptiveDpr.
- @react-three/postprocessing: Bloom (subtle), DepthOfField on chapter transitions,
  Noise, Vignette, ChromaticAberration (tiny), GodRays if cheap.
- Motion: Lenis (smooth scroll), GSAP + ScrollTrigger + SplitText.
- Study (do not copy): aengel.io, landing.love 3D category, Awwwards "three.js" SOTD,
  pmndrs examples (https://docs.pmnd.rs/react-three-fiber/getting-started/examples),
  Bruno Simon / Lusion / Active Theory sites for chapter transitions.
- Fonts: Fontshare (free commercial) or Google Fonts, self-hosted in public/fonts.

## Team for round 2 (spin these up in w2, extra tab if > 4 panes)
Old builder panes are closed; start fresh agents, each in its own worktree/branch:
- `codex-world` (codex): materials, lighting, HDRI, hero objects, post-fx (gaps 3).
- `codex-chapters` (codex): per-chapter camera compositions, project carousel flight,
  Lenis integration, overlay-visibility state machine (gaps 1, 6).
- `agy-type` (agy, `-- --mode auto`): typography system, overlay redesign, preloader +
  Enter gate, leader-line callout layer, mobile layout (gaps 2, 4, 5, 7).
- `claude-assets` (claude, `-- --permission-mode auto`): scout + download CC0/CC-BY assets
  into public/assets, compress, write CREDITS.md, report sizes. Also rewrite copy (gap 8)
  from src/content using Akash's identity line above.
- `claude-review` (claude): reviewer only. Must capture screenshots at 1440x900 and 390x844
  after each round and put them next to `.orchestrator/reference/aengel-*.png`, then judge
  each gap above pass/fail with evidence. Never reviews its own work.

## Acceptance (all must hold)
- No overlay overlap at any scroll position (check 10 evenly spaced positions + transitions).
- Each of the 5 chapters is visually distinct in a screenshot strip; reviewer says which
  aengel screenshot each one is "competitive with" and why.
- Hero: display type >= 11vw desktop, scene owns >= 70% of the frame.
- Perf: initial JS+assets <= 8 MB gzipped, steady 60fps HIGH on Apple Silicon at 1440p,
  LITE mode drops transmission/post-fx; `npm run build` and lint clean.
- 390px mobile: readable, no horizontal scroll, scene still visible.
- Reduced motion: no camera flights, gate skipped, content fully readable.
- No-WebGL fallback still works.

## Rules (unchanged)
Commit locally only, no push/deploy. Web repo read-only. Ask Akash before global installs
or anything outside omniverse. Close panes when done. Checkpoint with Akash with the
screenshot strip before the final merge.
