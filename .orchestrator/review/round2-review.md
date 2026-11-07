# Round 2 Review — `main` @ 2026-11-07

**Reviewer:** claude-review (headless Chrome 1440×900 + 390×844, SwiftShader)
**Build:** clean (`npm run build` exit 0, no lint errors)
**Note:** WebGL canvas does not initialise in headless Chrome; all screenshots show the no-WebGL fallback path. 3D-specific gaps marked INCONCLUSIVE.

## Gap Judgements

| Gap | Title | Verdict | Evidence |
|-----|-------|---------|----------|
| 1 | Overlay overlap | **INCONCLUSIVE** | Canvas never mounts (`canvasFound: false`). Fallback sections flow normally — max 2 adjacent `fallback-section` visible, no stacking. 3D overlay state machine untestable. |
| 2 | 3D is backdrop | **INCONCLUSIVE** | No canvas rendered. Fallback layout is full-width (984px content inside 1440px viewport). Cannot measure scene-vs-overlay ratio. |
| 3 | Art direction | **INCONCLUSIVE** | Assets present: `marble_bust_01.glb` (663 KB), 2 HDRIs, Clash Display font. Visual output untestable. |
| 4 | Typography | **FAIL** | Hero H1 "Akash Kumar" measured **60.8px** Clash Display, -1.824px tracking. Brief requires `clamp(64px, 11vw, 180px)` → 158.4px at 1440w. Actual is 38% of target. _Owner: agy-type._ Fix: apply the clamp to fallback `.fallback-title` as well. |
| 5 | 3D-to-text connection | **INCONCLUSIVE** | Leader lines are 3D-layer features; not visible in fallback. |
| 6 | Chapters all look same | **PASS (fallback)** | Fallback sections are visually distinct: Hero (name+pitch), About (2-col cards), Experience (timeline cards), Projects (2-col grid with tags), Tech (skill grids), Contact. Each has unique layout and content. 3D distinctness untestable. |
| 7 | Entrance moment | **FAIL** | No preloader, no Enter gate, no loading counter. `gateElements: []`, page loads directly to content. _Owner: agy-type._ Fix: implement `useProgress`-bound preloader + Enter button; skip for reduced-motion/LITE. |
| 8 | Copy | **PASS** | Hero pitch: "I build the tooling that lets AI agents do real work: harnesses, orchestration, developer tools." Matches brief's identity line exactly. No "SYSTEM ONLINE" clichés. |

## Acceptance Checklist

| Check | Result | Evidence |
|-------|--------|----------|
| Perf: gzipped JS+assets ≤ 8 MB | **PASS** | JS 450 KB gz, CSS 7 KB gz, assets ~2.4 MB. Total ~2.9 MB. |
| Reduced motion | **PASS** | Fallback renders, content fully readable. `hasCanvas: false`. |
| `?lite` | **PASS** | Renders 2D fallback, content readable, `hasCanvas: false`. |
| `?nogl` | **PASS** | Renders 2D fallback, content readable. |
| 390px no horizontal scroll | **PASS** | `scrollWidth == innerWidth (390)`. Screenshot `r2-1-hero-390.png` clean. |
| CREDITS.md | **PASS** | 3 assets listed, all CC0 (Poly Haven). Matches `public/assets/` contents exactly. |
| Build + lint clean | **PASS** | `npm run build` exit 0. |

## Findings (ranked)

1. **BLOCKER** — Hero font size 60.8px vs required 158.4px (r2-1-hero-1440.png). _Owner: agy-type._ Apply `clamp(64px, 11vw, 180px)` to both 3D overlay and fallback hero.
2. **BLOCKER** — No preloader/Enter gate (gate check: 0 elements). _Owner: agy-type._ Implement `useProgress` preloader.
3. **MAJOR** — 3D experience untestable in headless; 5 of 8 gaps cannot be verified. _Owner: all builders._ Recommend manual verification or headed Playwright test on Apple Silicon.

## Screenshots

- `r2-1-hero-1440.png` / `r2-1-hero-390.png` — hero fallback
- `r2-1-about-1440.png` — about section
- `r2-1-experience-1440.png` — work experience
- `r2-1-projects-1440.png` — projects grid
- `r2-1-contact-1440.png` — tech stack + contact
- `r2-1-projects-390.png` — mobile projects

VERDICT: CHANGES
