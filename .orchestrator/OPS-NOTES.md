# Ops notes from Morph (Akash's main assistant), learned earlier today on this machine

## Scale: Akash's direction
Spin up as many sub-agents as the work actually needs, across codex, agy and claude kinds.
Split by independent ownership areas (e.g. scene/particles, camera/scroll, shaders/post-fx,
HUD/overlay, content/sections, fallback/a11y, perf). One agent per area, unique names,
each in its own git worktree/branch (`herdr worktree`) or a strictly disjoint path set.
Keep reviewers separate from builders: an agent never reviews its own output.
Layout: panes get unusable below ~60 cols x 15 rows. Past ~4 panes per tab, put
agents in additional tabs of THIS workspace (`herdr tab create --workspace w2 --no-focus`),
never in workspace w1. Close panes/tabs when an agent's job is done.
Still checkpoint with Akash before big direction changes; he is watching.

## Agent CLI gotchas (verified today)
- codex: ChatGPT plan rejects gpt-5.1-codex and gpt-6.1-sol. Default is now gpt-6-luna (high). If
  codex errors with "model not supported", open /model and pick GPT-6-Luna.
- codex startup shows "Hooks need review": answer 3 (Continue without trusting).
- codex asks before network commands (e.g. `npx next build` downloading fonts): option 2/p = allow prefix.
- agy (Antigravity, Gemini 3.8 Flash): first run asks "Do you trust this folder" -> Enter on Yes.
  It asks per command; its dialogs differ:
    * "Run this command?"  option 2 = always allow this prefix in this conversation
    * "Allow access to this file?" option 2 = always allow non-workspace access
    * "Allow creation of this file?" option 1 = allow, OPTION 2 = DENY (easy to get wrong)
  You can start agy with native args: `herdr agent start <name> --kind agy --pane <id> -- --mode auto`
  to cut prompts (do this for builders inside their own worktree).
- claude sub-agents: `-- --permission-mode auto` works.
- `herdr agent prompt ... --wait` can return "idle" instantly before the agent picks the prompt up;
  re-check with `herdr agent get` after a few seconds, then wait again.
- Long agent answers get folded in the TUI: have agents write results to files under .orchestrator/.
- agy writes outside its workspace (e.g. /private/tmp) trigger access prompts: keep its outputs in-repo.

## Verification
- Headless browser checks: the REA MCP `capture_browser_scenario` with
  executable_path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" works; check
  reduced_motion both "reduce" and "no-preference", and 390px + 1440px widths.
- A hydration/attr warning about `caret-color: transparent` during screenshots is a Playwright
  artifact, not a bug. `data-darkreader-*` mismatches come from Akash's Dark Reader extension:
  add `<meta name="darkreader-lock" content="true">` (non-empty content) in index.html.
- Never branch render output on useReducedMotion()/matchMedia during first render (SSR/hydration).

## Tools added by toolsmith (r3/toolsmith) — restart agents to load them
- **playwright** (headed system Chrome, GPU): `browser_navigate`, `browser_take_screenshot` (save under .orchestrator/reference/), `browser_console_messages`, `browser_start_tracing`. Use `?skipgate=1&chapter=N`.
- **chrome-devtools**: `performance_start_trace`/`performance_stop_trace`/`performance_analyze_insight`, `lighthouse_audit`, `list_console_messages` (needs pageId). Telemetry off.
- **context7**: `resolve-library-id` then `query-docs` (e.g. /pmndrs/drei) for version-correct three/r3f/drei docs. Never put secrets in queries.
- blender: claude (live) and codex (.codex/config.toml); only ONE agent drives live Blender at a time.
- Claude must approve the project servers once (`claude` in omniverse). agy servers installed (global, approved); see .orchestrator/reports/toolsmith.md.
