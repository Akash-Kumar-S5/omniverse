# Mandatory tools (all briefs, from 2026-11-08)
Project MCP servers in .mcp.json (pinned, telemetry off): playwright, chrome-devtools, context7. Blender MCP: ONE driver at a time.
- REVIEWERS (agy-review, copilot-review): screenshots via the Playwright MCP in HEADED Chrome (real GPU), URL ?skipgate&chapter=N, 1440x900 and 390x844. Evidence = chapter state, never the gate.
- PERF owner (codex-world): Chrome DevTools MCP performance trace (performance_start_trace / analyze_insight), report real frame times and long tasks, no guesses.
- ALL builders: look up three / @react-three/fiber / drei / postprocessing APIs with Context7 (resolve-library-id then query-docs) BEFORE writing code.
- Copilot agents: start with `--additional-mcp-config @.mcp.json` (project scope, per session). Worktree branches must merge main first so .mcp.json exists.
