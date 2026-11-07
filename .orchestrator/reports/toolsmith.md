# toolsmith report (2026-11-08)

## Research table (versions verified with `npm view` on 2026-11-07; entry points read from the packed tarballs)
| Candidate | Maintainer / licence | Version (modified) | Reach | Telemetry / outbound | Verdict |
|---|---|---|---|---|---|
| @playwright/mcp | Microsoft, Apache-2.0, github.com/microsoft/playwright-mcp | 0.0.84 (2026-11-03) | ~6M dl/month | none found in cli.js/index.js (thin wrapper over playwright-core) | **CHOSEN** |
| chrome-devtools-mcp | Google ChromeDevTools, Apache-2.0 | 1.12.0 (2026-10-22) | official | Google Clearcut usage stats ON by default, update check ON by default. Off via `--no-usage-statistics` + env `CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS`, `CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS` (verified in build/src) | **CHOSEN** (traces, lighthouse, heap) |
| @upstash/context7-mcp | Upstash, MIT | 4.5.1 (2026-11-06) | widely used | Sends the doc query text to context7.com (stated in tool descriptions). Works anonymously, no key. Keep secrets out of queries. | **CHOSEN** |
| mcp-for-blender | already used | ==2.2.7 | | DISABLE_TELEMETRY=true | reused for codex |
| Third-party three.js/R3F skills (cloudai-x, freshtechbro, 404kidwiz, OpenAEC) | individuals, unaudited | n/a | 11 to 2.5k stars | n/a | **REJECTED**: no official Anthropic/pmndrs skill exists; Context7 covers version-correct docs; unreviewed skills are prompt-injection surface |

## Chosen set and pain-point mapping
1. Screenshots past the gate with GPU: playwright, headed by default, using system Chrome (`--executable-path`), `--isolated` so parallel agents don't collide. Also has tracing, network, video.
2. API guessing: context7 (`resolve-library-id` then `query-docs`; drei resolves to /pmndrs/drei, verified).
3. Blender for codex: pinned blender server in .codex/config.toml. agy: proposal below. Only ONE agent may drive live Blender.
4. Perf traces: chrome-devtools (`performance_start_trace`, `performance_analyze_insight`, `lighthouse_audit`, `take_heapsnapshot`). Run it headed for GPU: it is configured headed.

## Installed
- Claude (project scope, `.mcp.json`):
  `claude mcp add --scope project playwright -- npx -y @playwright/mcp@0.0.84 --isolated --executable-path "<Chrome>" --caps=devtools`
  `claude mcp add --scope project chrome-devtools -e CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1 -e CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS=1 -- npx -y chrome-devtools-mcp@1.12.0 --no-usage-statistics --isolated --executablePath "<Chrome>"`
  `claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp@4.5.1`
  `claude mcp list` shows all three as "Pending approval". **Akash must start `claude` in omniverse once and approve the project servers** (I did not touch approval settings).
- Codex: `.codex/config.toml` (project scope, same pins, plus blender). Loads only if codex trusts the project. Not run-verified through codex itself.
- agy: **NOT installed.** `agy mcp add` has no project scope and writes global config. Proposed (needs Akash's OK):
  `agy mcp add playwright npx -y @playwright/mcp@0.0.84 --isolated --executable-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`
  `agy mcp add context7 npx -y @upstash/context7-mcp@4.5.1`
  (and chrome-devtools / blender likewise). Until then agy can read screenshots other agents save.

## Smoke tests (raw stdio JSON-RPC, because Claude approval is pending)
- context7: resolve-library-id "drei" -> /pmndrs/drei. OK. (query-docs for MeshReflectorMaterial not run.)
- playwright: navigate + screenshot of localhost:5173/?skipgate=1&chapter=0 -> .orchestrator/reference/toolsmith-smoke.png, 0 console errors, 1 warning. Whether the particles render correctly under GPU was NOT inspected by me.
- chrome-devtools: new_page loaded the site (I ran it --headless for the test); list_console_messages needs a `pageId` argument. Perf trace not run yet.

## Caveats
- First use downloads packages via npx into the npm cache (pinned versions, not global installs).
- chrome-devtools without MCP roots restricts file output to the OS temp dir; add `--allow-unrestricted-paths` only if needed.
- Existing agents must be restarted to load new servers.
