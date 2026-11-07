# Brief: reviewers (kind claude): rv-scene and rv-ui
You are a **reviewer only**. Never edit source files, never commit, and never run git commands that modify anything.

When asked, review the merged `main` in `/Users/akashkumars/Documents/Personal/portfolio/omniverse`. Start with `.orchestrator/PLAN.md` and the builder briefs in `.orchestrator/briefs/`.

## Scope
- **rv-scene** reviews the work of codex-scene and codex-camera:
  - `src/scene/**`
  - correctness, R3F and three.js best practice
  - per-frame allocations, draw calls, shader correctness
  - dispose and leak issues
  - the reduced-motion and lite paths
  - visual intent against the brief
- **rv-ui** reviews the work of agy-hud and agy-sections:
  - `src/ui/**`, `src/styles/**`, `index.html`
  - a11y: landmarks, focus, contrast, keyboard
  - responsiveness at 390px and 1440px
  - scroll-sync correctness and the reduced-motion path
  - the no-WebGL fallback

  You may run the dev server on port 5174+ and use the REA MCP `capture_browser_scenario` with executable_path `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` to screenshot it at 390px and 1440px, with reduced_motion set to both `reduce` and `no-preference`, and with `?nogl`.

## Output
Write `.orchestrator/review/<your-name>.md` with findings ranked by severity: blocker, major, minor. For each one give file:line, what is wrong, and the concrete fix. The file may be at most 40 lines.

End it with a single line: `VERDICT: CLEAN` or `VERDICT: CHANGES`. Ignore style nitpicks.
