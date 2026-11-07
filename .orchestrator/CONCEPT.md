# Omniverse: concept options

## Research notes

**aengel.io** (fetched as text; the rendered scene was not seen). A design-engineer portfolio framed as
storytelling ("lines of code that tell a story"). Sci-fi instrument-panel HUD details (status "Online",
counters like `0011/06`, glyph strings), a loading/"fetching assets" state, a SCROLL cue, a three-line scroll
narrative, then a drag-to-switch project carousel with "Discover / Next project", plus Lite and Lab versions
and a WebGPU toggle. Letter-by-letter text reveals. Stack: Next.js, Three.js, TSL shaders, GSAP ScrollTrigger,
Zustand.

**landing.love 3D gallery**: returned HTTP 403 to automated fetches, so it was not sampled. Patterns below
come from aengel.io plus the wider 3D-portfolio genre (scroll-driven camera flights, one hero object that
morphs per section, HUD overlays on WebGL, a lite/2D mode, preloader as part of the story).

**Content available** (from the 2D portfolio, read-only): 8 projects (SalarySync, Rentify, Website Performance
Monitor, Innovation Sprint 2025, MediHub, Finaca, Fuel Dispenser RFID, GenAI Experiments), 4 roles
(Presidio Intern → Associate Engineer → Engineer; Mallow Technologies intern), education, 18 tech items.
Positioning: software engineer moving into AI tooling (agents, harnesses, dev tools).

Patterns worth taking: a single strong metaphor, scroll as the main input, HUD text over 3D, a lite mode,
the preloader as the first beat. Pitfalls to avoid: heavy GLTF downloads, scroll-jacking that breaks
trackpads, unreadable text on top of busy scenes.

---

## Option A: Agent Constellation (recommended)

A dark cosmos where Akash's work is a living node graph. Each project is a glowing node; tech items are
smaller satellites; streams of particles ("agents") travel along curved edges between them, the way work
flows through a harness. Scroll flies the camera through four beats:

1. **Boot**: preloader prints a terminal-style boot log, then the graph ignites from one seed point.
2. **Orbit / About**: wide shot of the whole constellation, name and one-line pitch in a HUD frame.
3. **Trajectory / Experience**: camera follows one particle along a spline; each role is a waypoint.
4. **Systems / Projects**: camera settles near a cluster; drag or arrow keys hop node to node, a side
   panel shows the project. Click to "dock" into detail.
5. **Uplink / Contact**: the graph collapses into a single pulsing beacon with contact links.

Why: the metaphor *is* his focus (agents, orchestration, AI tooling), it is all procedural (instanced
spheres, line geometry, GPU particles, bloom) so no heavy assets, and it scales as projects get added.
Risk: node graphs can look generic; the edge-flow shader and camera choreography must carry it.

## Option B: The Harness (instrument room)

A wireframe workshop in the dark: one bench with a floating holographic terminal, rendered in thin
emissive lines (aengel-adjacent HUD feel, but Akash's own). Scroll moves the camera between "stations":
a rack of monitors for projects, a conveyor timeline for experience, a tool wall for the tech stack.

Why: very legible, strong craft feel, easy to read text. Risk: closer to the aengel look, needs more
modelling (Blender or hand-built geometry), and the "room" metaphor says less about AI.

## Option C: Signal Terrain

A generative shader landscape (displaced plane, flowing noise) at dusk. Experience is a road across the
terrain; projects rise out of it as monoliths as you pass. Calm, cinematic, mostly one big shader.

Why: beautiful with very little geometry, great performance ceiling. Risk: atmospheric more than
meaningful; weaker link to AI tooling; text sections feel bolted on.

---

## Recommendation

**Option A, Agent Constellation.** It ties the visual metaphor to what Akash builds, stays procedural
(fast load, good mobile perf), and gives codex a clear shader/particle job and agy a clear HUD/content job.
Shared across all options: reduced-motion mode (static camera, fades only), a no-WebGL fallback that renders
the same content as a styled 2D page, and a "Lite" toggle.
