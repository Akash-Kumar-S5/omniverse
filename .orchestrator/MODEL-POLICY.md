# Model policy (from Morph, Akash's request: "longer sessions, not hitting limits")

## Budgets observed 2026-11-07 18:40 IST (status lines)
- Claude Code (Pro plan): 5h window hit 100% at ~16:35, almost all on Opus 5.5.
  Weekly 77% used, resets Sun 18:30 IST. Leaves about 23% of the week for ~24h, so Claude is the scarce pool.
- Codex (ChatGPT plan): 30-day window 87% used, resets Mon 13:54. Also scarce; use sparingly.
- Antigravity (agy, Google quota, separate from both): Gemini 3.8 Flash (high/medium/low),
  **Claude Opus 4.6 Thinking**, **Claude Sonnet 4.6 Thinking**, and GPT-OSS 120B. This is the roomy pool.
  It gives Claude-family quality without touching Akash's Claude Pro limits.

## Update 21:00 IST
- agy's Claude Opus 4.6 has its OWN individual quota, and it ran out (resets ~01:40 IST). While it's out,
  agy agents use `gemini-3.8-flash-high`. Return to Opus 4.6 for review after the reset.
- BlenderMCP is installed for the omniverse project only (`claude mcp list` → blender ✔ Connected;
  Blender GUI listening on 127.0.0.1:9876, telemetry off). Only **claude** agents started in the omniverse
  dir see it. Exactly ONE agent drives the live Blender at a time. It saves every scene step as a script in
  `blender/scripts/` so the build stays reproducible headless.

## Update 02:58 IST: CODEX LOCKED until Mon 13:54 IST (30-day quota at 0%)
codex agents can't run. Their lanes (3D/shaders/particles/perf) go to copilot claude-sonnet-5.5 (or gpt-6-luna for
simple fixes) and agy gemini-3.8-flash-high. Return to codex after the reset.

## Update 00:55 IST: GitHub Copilot CLI added (Akash's Copilot Pro)
- `copilot` 1.0.107 is installed and signed in (herdr kind `copilot`). Verified models: **claude-sonnet-5.5** and
  **gpt-6-luna**. Not available: opus-5.5, gpt-6.1-sol, gemini. It bills GitHub AI credits (a test prompt cost 0.13),
  a SEPARATE pool from Claude Pro, the ChatGPT plan and Google.
- Use it to take Sonnet-class work OFF the Claude Pro pool: UI/type polish, copy, focused fixes, and a second-opinion
  code review. Keep claude agents for BlenderMCP work (MCP is project-scoped to claude for now).
- Start: `herdr agent start <name> --kind copilot --pane <id> -- --model claude-sonnet-5.5 --allow-all-tools
  --deny-tool 'shell(rm)' --deny-tool 'shell(git push)' --deny-tool 'shell(sudo)'` (deny wins over allow).
  Scope it to its own worktree. Never `--allow-all-paths`.
- Budget: Pro has a monthly AI-credit allowance. Don't run it as an always-on watcher; give it bounded tasks.

## Lanes: who does what
| Work | Lane | Why |
|---|---|---|
| Orchestration (briefs, merges, status) | claude **Sonnet 5.5** (`/model sonnet`) | Coordination is mostly reading and writing; Opus here burned the 5h window |
| Hard judgment (concept pick, final art-direction call, a stuck bug after 2 failed fixes) | claude **Opus 5.5**, one turn, then back to Sonnet | Spend Opus only where judgment is the work |
| 3D, shaders, R3F perf | copilot **claude-sonnet-5.5** (codex LOCKED until Mon 13:54 IST) | Separate GitHub credit pool; watch AIC burn |
| UI, typography, layout, CSS, copy | agy **gemini-3.8-flash-high** | Fast and cheap, on the separate pool |
| Code review / QA / second look | agy **claude-opus-4-6-thinking** (`agy --model claude-opus-4-6-thinking`) | Opus-class review on Google quota; a different lineage from the builders |
| Mechanical work (asset download, compression, renames, CREDITS.md) | claude **Haiku** (`--model haiku`) or agy **gemini-3.8-flash-low** | Near-script work |
| Overflow when the Claude window caps | agy claude-sonnet-4-6 / opus-4-6 | Keep moving instead of waiting for the reset |

Do NOT use `/model` inside a claude pane: it also saves the choice as Akash's global default in
~/.claude/settings.json (this happened once and Morph reverted it). To change a claude agent's
model, exit it and start it again with `--model`.

Starting agents with a model (herdr passes args after `--`):
- `herdr agent start <name> --kind claude --pane <id> -- --model sonnet --permission-mode auto`
- `herdr agent start <name> --kind agy --pane <id> -- --mode auto --model claude-opus-4-6-thinking`
- `herdr agent start <name> --kind codex --pane <id> -- -m gpt-6-luna -c model_reasoning_effort=medium`

## Context hygiene: the biggest cost lever
Every turn re-sends the whole context. A 368k-token orchestrator costs roughly 60x a 6k one per turn.
1. The orchestrator keeps durable state in files, not in its head: `.orchestrator/STATE.md`
   (phase, agents and their lanes, branches, merged/pending, open bugs, next 3 steps). Update it after each merge.
2. When context passes ~150k, or at a phase boundary: update STATE.md, then `/clear` and re-read
   BRIEF.md, ROUND2-BRIEF.md, MODEL-POLICY.md and STATE.md. Never let it grow to 300k+.
3. Sub-agents get one brief each and are closed or `/clear`ed between rounds. No long-lived reviewer context.
4. Read agent results from report files (`.orchestrator/reports/`), not by scrolling panes; use `herdr pane read --lines 20`.
5. Don't paste screenshots or big logs into the orchestrator. Reviewers write verdicts to files and the orchestrator reads the summary.
6. Prefer `herdr agent wait` over polling loops.

## Update 12:10 IST 08-Nov (Akash): "always check usage on agents and if available use them"
- On every wake/dispatch, check each pool before deciding: Claude 5H/WK (usage-cache.json `.five_hour/.seven_day`; pane status lines can be stale),
  Copilot session AIC (pane footer), agy model quota (pane errors), codex (pane errors: locked until Mon 13:54 IST).
- If a pool has room, put idle lanes to work on it now; never park work "until the reset" when the pool already reset.
- Claude 5H reset at ~10:40 IST today (now ~5-26%), weekly ~50% (resets 18:30 IST): Claude is AVAILABLE, use it for orchestration (Sonnet) and Blender.

## Update 20:52 IST 08-Nov (Akash): Copilot Fusion
- When starting or dispatching a Copilot lane (copilot-review w2:pQ, copilot-swarm w2:pS or new ones), first switch it with `/model fusion`:
  30% off Copilot Fusion usage through 2026-11-30. After 30 Nov, re-check the price before defaulting to it.
- This applies to Copilot panes only. Never use `/model` in Claude panes.

## Update 08:45 IST 10-Nov (Akash): token-saving tiers
- Orchestrator: top model at max effort. Launch: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=40 claude --model opus --effort max --permission-mode auto`.
- Every worker sub-agent doing build work (blender, world, ui, flow, assets): Haiku. Launch: `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=40 claude --model haiku --permission-mode auto`.
- All Claude panes auto-compact at 40% of the context window (CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=40).
- Exception (Morph): the stage-2 judge stays a fresh Opus per briefs/final-judge.md, because it is a scorer, not a worker. Copilot/agy rules are unchanged.
- Model changes happen by launching new panes with flags, never via `/model` in a Claude pane. Briefs to Haiku lanes must be small, explicit and file-scoped: the orchestrator does the thinking, Haiku executes.
