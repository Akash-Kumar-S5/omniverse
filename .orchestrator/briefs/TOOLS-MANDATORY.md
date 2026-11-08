# Mandatory tools (all briefs, from 2026-11-08)
Project MCP servers in .mcp.json (pinned, telemetry off): playwright, chrome-devtools, context7. Blender MCP: ONE driver at a time.
- REVIEWERS (agy-review, copilot-review): screenshots via the Playwright MCP in HEADED Chrome (real GPU), URL ?skipgate&chapter=N, 1440x900 and 390x844. Evidence = chapter state, never the gate.
- PERF owner (codex-world): Chrome DevTools MCP performance trace (performance_start_trace / analyze_insight), report real frame times and long tasks, no guesses.
- ALL builders: look up three / @react-three/fiber / drei / postprocessing APIs with Context7 (resolve-library-id then query-docs) BEFORE writing code.
- Copilot agents: start with `--additional-mcp-config @.mcp.json` (project scope, per session). Worktree branches must merge main first so .mcp.json exists.

## Browser hygiene (Akash, 2026-11-08)
- Playwright MCP: open ONE browser per agent session and REUSE it: navigate the same tab (browser_navigate / browser_tabs to switch), never launch a new Chrome for each shot.
- When your task ends, call browser_close. If you spawned any Chrome yourself (puppeteer, --remote-debugging-port, --user-data-dir under /tmp), close it before you report; kill only the PIDs you started.
- Before starting a browser, check for one you already own (ps for your own profile dir); reuse it instead of opening another.
- Never touch Chrome windows without a temp profile dir: those are Akash's own.
