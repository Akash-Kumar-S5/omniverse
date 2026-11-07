# Brief: toolsmith (claude Sonnet). Research and install skills + MCP servers for the Omniverse team

Akash asked: "spin up a new agent to research the internet and install all the skills & MCP servers needed for
this task, for all agents & subagents."

## Team you are equipping (herdr workspace w2; never touch w1)
- claude agents (Claude Code): orchestrator, ui-editor, blender-sanctum, and future claude sub-agents
- codex agents (Codex CLI, ChatGPT plan): codex-world (3D / GPGPU / perf)
- agy agents (Antigravity CLI): agy-world (scene integration), agy-review (screenshot QA)
The task: a 3D portfolio site (Vite + React 19 + three r187 + @react-three/fiber 9 + drei 10 + postprocessing),
Blender 5.2 assets (BlenderMCP already installed for claude, project scope), and visual QA by screenshots.

## Known pain points the tools should fix (evidence from tonight)
1. Agents can't reliably screenshot the running site past the Enter gate. Screenshots in headless Chrome use
   software GL, so GPGPU particles collapse to a dot. Agents need a browser tool that can run GPU-backed
   (headed) Chrome, take screenshots, read console errors, and measure FPS/performance traces.
2. Agents guess three/r3f/drei APIs (versions move fast). They need current, version-correct docs on demand.
3. codex and agy can't drive Blender (only claude has BlenderMCP).
4. Performance work needs real traces (frame time, GPU, long tasks), not guesses.

## Research (internet), then propose
Research current (2026) options and pick the smallest set that fixes the pain points. Candidates to evaluate,
not pre-approved:
- Browser + perf: Microsoft's Playwright MCP (@playwright/mcp), Google's Chrome DevTools MCP (chrome-devtools-mcp)
- Library docs: Context7 MCP (Upstash) or an equivalent for three.js / R3F / drei / postprocessing docs
- Blender: BlenderMCP for codex/agy too (same pinned version as claude: mcp-for-blender==2.2.7, DISABLE_TELEMETRY=true)
- Skills: any well-maintained Claude Code skills for three.js / R3F / WebGL / web-perf (official Anthropic skills first)
For each candidate, record: maintainer, repo URL, licence, last release date, stars/adoption, what it can
execute or access, telemetry, and pinned version. Prefer official vendor packages
(Microsoft, Google, Anthropic, Upstash) over random forks.

## Safety rules (hard)
- PROJECT scope only, where the client supports it: Claude Code `claude mcp add --scope project` (writes
  omniverse/.mcp.json) and skills in omniverse/.claude/skills/; Codex project config if supported in trusted
  projects; agy per its docs. NEVER edit ~/.claude/settings.json, ~/.claude.json global entries, ~/.codex/config.toml
  globals, or agy globals yourself. If a client only supports global config, STOP and write the exact proposed
  change in your report for Akash to approve.
- Pin exact versions (no @latest). Disable telemetry where possible. No `curl | sh`, no sudo, no global npm installs.
- Nothing that needs API keys or accounts unless Akash approves (write it up as "needs approval").
- Read each package's README/source entry point before installing. Reject anything that phones home,
  auto-updates, or requests broad filesystem/network access without need.
- Never answer a Claude Code settings dialog with a change (Esc).

## Deliverables
1. `.orchestrator/reports/toolsmith.md`: research table, the chosen set with reasons, rejected options with
   reasons, and the exact install commands you ran or are proposing.
2. Installed and VERIFIED for each agent kind: show `claude mcp list` from omniverse, the Codex equivalent and
   agy's equivalent, plus one smoke test per tool (e.g. a Playwright screenshot of http://localhost:5173/?skipgate=1&chapter=0
   saved to .orchestrator/reference/toolsmith-smoke.png; a Context7 lookup of drei MeshReflectorMaterial props).
3. A short "how to use" section appended to .orchestrator/OPS-NOTES.md so every agent knows the tools exist
   (and that existing agents must be restarted to load new MCP servers).
4. Commit on branch r3/toolsmith (worktree), report back to the orchestrator, and reply in 5 lines max.
