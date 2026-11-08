# Round 1 score: copilot-review (main 995ba7b)
Method: build, `vite preview`, Playwright MCP headed Chrome, `?skipgate&chapter=0..4`, 1440x900, 5 shots (`.orchestrator/reference/cr3-ch{0..4}.png`). Motion is judged from stills only, not from watching transitions. Performance is rAF over 90 frames per chapter on this Mac, which is not a low-end device.

| Ch | 3D craft | Art dir | Motion | Type | Original | Perf | Overall |
|---|---|---|---|---|---|---|---|
| 0 Hero | 6 | 5 | 6 | 8 | 6 | 9 (121fps, max 10ms; Graphics auto = Medium) | 6.5 |
| 1 About | 8 | 8 | 6 | 8 | 7 | 7 (75fps, max 25ms) | 7.5 |
| 2 Work | 7 | 7 | 6 | 7 | 7 | 7 (73fps, max 26ms) | 7 |
| 3 Projects | 5 | 5 | 6 | 8 | 5 | 7 (72fps, max 26ms) | 5.5 |
| 4 Contact | 7 | 7 | 6 | 8 | 7 | 7 (76fps, max 25ms) | 7 |

Notes
- **Ch0:** the particle disc reads as grey sand or noise, not a focal object, and it sits right against the "r" of the name. The top-left black ring and floor planes are unreadable. The aengel reference has a clear hero object.
- **Ch1:** the strongest frame. The lit bust on a plinth with DoF, grain and a hard light edge is a clear subject. The text panel is balanced.
- **Ch2:** the corridor has good depth and the DoF'd figure is atmospheric. The body copy collides with the bright figure (the "REST APIs" overlap in the shot), which hurts legibility.
- **Ch3:** the camera looks at blurred grey slabs with no subject, so the project has no visual identity. This is the weakest chapter against the benchmarks, where the object (JOYCO signpost, SEED seed) carries each beat.
- **Ch4:** the halo over a ring is a nice end image. "Say hello." is large and the gold email is a good accent. The paragraph overlaps the halo glow.
- **Type:** the pairing is the best asset (display serif, italic accents, grotesk body, mono labels) and is consistent across chapters. Micro-labels are small, but contrast is fine.
- **Perf:** all frames are smooth here. Ch1-4 at ~73-76fps with ~25ms worst frames suggests headroom is limited on weaker GPUs. Ch0 at 121fps is on Medium, so Graphics auto-picks a lower tier than the other chapters (High) on this machine.

## Top 5 upgrades (ranked)
1. **Give every chapter one hero object, starting with ch3.** Replace the blurred slabs with a lit, readable subject per project (framed screen or artefact that changes per project). Why: the benchmarks (JOYCO signpost, SEED seed, Prekesh objects) all carry the beat with a clear object; ch0 and ch3 currently have none.
2. **Reframe ch0.** Turn the sand disc into a shaped, lit form (sculpted particle form that assembles from noise on load), and move it clear of the headline. Why: the hero is the first impression and it looks like noise.
3. **Text-over-scene legibility pass.** Add a soft local dark gradient or shift the focal object off the copy column in ch2 and ch4. Why: the figure and halo run through body text.
4. **Scroll-linked camera and transitions between chapters.** Add a continuous dolly/rack-focus (one camera path with DoF pull) rather than separate states, plus per-chapter heading reveal (mask or line stagger). Why: Michelangelus and JOYCO keep one continuous scene, so motion is the signature, and stills here look good but nothing shows an authored transition.
5. **One signature interaction.** Pointer-reactive particles or light (cursor repels or illuminates the particles, bust relights) with a tactile hover on the project Next control. Why: Prekesh and SEED reward touching the scene; this site is currently view-only.
