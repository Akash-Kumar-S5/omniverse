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

## Lanes: who does what
| Work | Lane | Why |
|---|---|---|
| Orchestration (briefs, merges, status) | claude **Sonnet 5.5** (`/model sonnet`) | Coordination is mostly reading and writing; Opus here burned the 5h window |
| Hard judgment (concept pick, final art-direction call, a stuck bug after 2 failed fixes) | claude **Opus 5.5**, one turn, then back to Sonnet | Spend Opus only where judgment is the work |
| 3D, shaders, R3F perf | codex **gpt-6-luna medium** (high only for shader/perf bugs) | Strong coder, but its 30-day pool is at 87% |
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
