# Omniverse: orchestrator brief

You are the ORCHESTRATOR for building "Omniverse", a 3D personal web experience for Akash Kumar,
a software engineer focused on AI tooling. Project root: ~/Documents/Personal/portfolio/omniverse
(git repo, empty). You run inside a herdr pane in the "personal" workspace (w2).

## Goal
A polished, performant 3D website. There is no fixed design yet: you own the concept.
Inspiration (study, do not copy assets, text or layouts verbatim):
- https://aengel.io/
- https://www.landing.love/categories/3d-website/ (a gallery of 3D landing pages; sample several)
Content can come from the existing 2D portfolio at ~/Documents/Personal/portfolio/web
(src/data/projects.ts, experience.ts, techStack.ts). Read-only: never edit that repo.

## Team (herdr sub-agents in this workspace)
Use the herdr CLI (`herdr --skill`, `herdr agent`, `herdr pane`) to split panes in YOUR tab
(never touch workspace w1) and start these agents, each with a unique name:
- `codex`  (kind codex)  : builder for core 3D scene, shaders, performance.
- `agy`    (kind agy)    : builder for UI, layout, content, responsiveness.
- `claude` (kind claude) : reviewer and QA. It reviews what codex and agy build; it does not build.
Never have an agent review its own work. Give each agent a written brief (put briefs in
.orchestrator/) with: outcome, files it may touch, and a capped reply format.
Prefer separate git worktrees (`herdr worktree`) or clearly separated directories so
two builders never edit the same files at once.

## Process
1. Research: sample the inspiration sites (WebFetch or a sub-agent), write
   .orchestrator/CONCEPT.md with 2-3 concept options and your recommended one.
   STOP and ask Akash to pick before building (he is watching this pane).
2. Plan: stack (suggest Next.js or Vite + React Three Fiber + drei, GSAP or framer-motion),
   file layout, and a task split between codex and agy in .orchestrator/PLAN.md.
3. Build in parallel, then claude reviews, then fix rounds until review is clean.
4. Verify yourself: `npm run build` passes, lint clean, run the dev server and check it
   in a browser at desktop and mobile widths, 60fps target, reduced-motion fallback,
   graceful no-WebGL fallback.
5. Commit locally with co-author trailers. Do NOT push, create remotes, or deploy.

## Rules
- Ask Akash before: installing global tools, anything outside the omniverse dir,
  answering an agent's permission dialog that is destructive (rm -rf, git push, sudo).
- Codex on this machine: ChatGPT plan only supports models like gpt-6-luna (already default).
- Keep Akash's focus: create panes with --no-focus.
- Close sub-agent panes when done. Report a short summary at the end.
