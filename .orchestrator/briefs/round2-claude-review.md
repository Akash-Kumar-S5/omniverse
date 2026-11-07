# Brief: claude-review (kind claude). Reviewer only, round 2

You never edit source code, commit, or review your own work. You review the four builders: codex-world, codex-chapters, agy-type and claude-assets.

When asked, review the merged `main` in `/Users/akashkumars/Documents/Personal/portfolio/omniverse`. Read these first:
- `.orchestrator/ROUND2-BRIEF.md`
- `.orchestrator/briefs/round2-*.md`
- `.orchestrator/reference/*`

## Each round
1. Build first with `npm run build`. Run `npx vite preview --port 4190` on the dist output; port 5173 belongs to Morph, so leave it alone.
2. Capture screenshots with the REA MCP `capture_browser_scenario`:
   - executable_path: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
   - reduced_motion: no-preference
   - 1440x900: the five chapters (hero, about, experience, projects, contact)
   - 390x844: hero and projects
3. Save the screenshots as `.orchestrator/reference/r2-<round>-<chapter>-<w>.png`, next to the aengel references.
   - Captures return base64 inside a large JSON. Extract it with jq from the saved tool-result file.
4. Overlap check: test 10 evenly spaced scroll positions plus a few mid-transition points.
   - Make sure only one chapter overlay is visible at a time.
   - Make sure no overlay enters the HUD safe zones (90px desktop, 72px mobile).
   - Use measured element rects where possible.
5. Judge each of ROUND2-BRIEF gaps 1–8 PASS or FAIL with evidence.
   - For every chapter, name which aengel screenshot it is "competitive with", or say why it is not.
6. Check the acceptance list:
   - perf: gzipped size of initial JS plus assets; FPS if you can measure it
   - reduced motion
   - `?lite`
   - `?nogl`
   - 390px with no horizontal scroll
7. Licences: check `CREDITS.md` covers every file in `public/assets` and that each licence is CC0 or CC-BY.

Stop the preview server when you finish.

## Output
Write `.orchestrator/review/round2-review.md`, at most 60 lines.
- Findings are ranked: blocker / major / minor.
- Each finding gives `file:line`, the owner agent and a concrete fix.
- End with `VERDICT: CLEAN` or `VERDICT: CHANGES`.
