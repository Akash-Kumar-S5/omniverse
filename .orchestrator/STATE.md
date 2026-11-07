# Omniverse orchestrator STATE
## STATUS TABLE (17:25 UTC 2026-11-07)
| Agent | Pane | Status | Next |
|---|---|---|---|
| codex-world | w2:pE | 7889e54 MERGED to main (build+lint clean); idle/hold | tune swarm if agy-world screenshots show it weak |
| agy-world | w2:pK | 19c2795 (step 3 Effects); BLOCKED from merge; my rebase + visual-fix prompt is queued behind its running build | rebase on main, 5 chapter screenshots (SignalField 35-45% right half, near-black reflector floor+fog, volumetric SpotLight) |
| blender-sanctum | w2:pJ | d135a4f stills fixed, APPROVED 17:27; GLB export (<=4 MB) prompted | merge after size + build check |
| agy-review | w2:pM | idle, waiting | full review vs playbook s8 once agy-world + export merged |


## Phase
Round 2 (ROUND2-BRIEF.md) is in progress: builders are on step 2 (integration and polish). The review rounds have not started.
Round 1 is complete and reviewed clean, tagged in history at `3b98f7d`.

## Main
- HEAD: `7c083d2`. Build is clean. Lint is clean; eslint ignores `.worktrees`, `.tsbuild` and `dist`.
- Repo: `~/Documents/Personal/portfolio/omniverse`, branch `main`.
- No remote. Never push or deploy.
- Morph runs a dev server for main at http://localhost:5173; leave it alone. Use ports 4180/4190 for preview.
- Vite ignores `.worktrees` in its watcher.

## Contract (orchestrator-owned)
- `src/state/store.ts`: adds `entered`/`setEntered` and `loadProgress`/`setLoadProgress`.
- `src/state/anchors.ts`: the 3D→DOM label bridge, anchor IDs `hero.core`, `about.object`, `about.city`, `projects.active`, `contact.beacon`.
- `src/state/env.ts`, `src/App.tsx`, `src/main.tsx`, and the root configs.
- Handed over this round:
  - `chapters.ts`, `smooth.ts` and `useScrollSync.ts` → codex-chapters
  - `src/content/**` → claude-assets

## Agents (workspace w2; never touch w1)
| Name | Kind / lane now | Pane | Tab | Branch | Status at handoff |
|---|---|---|---|---|---|
| codex-world | codex (default effort) | w2:p8 | t5 r2-scene | r2/codex-world | step 2: use `public/assets/hdri/studio_small_09_1k.exr` as the env and `marble_bust_01.glb` as the About object; apply `camera/chapterLook.ts` |
| codex-chapters | codex (default effort) | w2:pA | t5 r2-scene | r2/codex-chapters | step 2: mount World, AnchorWriters and LoadProgress in `Experience.tsx`; push-in off `store.entered` |
| agy-type | agy `--mode auto` (gemini flash) | w2:p9 | t6 r2-ui | r2/agy-type | still on brief steps 3–4 (preloader/Enter gate, callouts). Steps 1–2 are merged. |
| claude-assets | claude auto (Opus default!) | w2:pB | t6 r2-ui | r2/claude-assets | Outcome B copy rewrite plus verifying HDRI authors in CREDITS.md via the Poly Haven API |
| agy-review | agy auto, claude-opus-4-6-thinking | w2:pD | t8 r2-review | none | started 13:1x UTC; waiting for builders before review (w2:pC Opus closed) |

All worktrees are at `.worktrees/<name>`, with `node_modules` symlinked to `../../node_modules`.
- Briefs are in `.orchestrator/briefs/round2-*.md`.
- Reports go to `.worktrees/<name>/.orchestrator/reports/round2-<name>.md` (on the branch).
- Builders sync with `git merge --ff-only main` before each step.

## Merged to main (round 2)
1. Contract `b9f0115`; eslint ignore `6b2f50a`.
2. r2/codex-chapters, up to `5c660ae`: state machine, Lenis, camera compositions, `chapterLook`, hidden-tab pause.
3. r2/claude-assets `8cea0d6`: two CC0 Poly Haven HDRIs and the marble bust (2.4 MB), CREDITS.md and MANIFEST.md.
4. r2/codex-world `a4b1e4e`: palette, procedural core, monoliths, reflector floor, lights, post, anchors, LoadProgress. Mounting it in Experience.tsx is pending.
5. r2/agy-type `47d25d5`: the OVERLAP FIX (one fixed overlay layer driven by `useChapter`), typography and the warm palette.

## Pending / open
- Integration: World, AnchorWriters and LoadProgress are not mounted in `Experience.tsx` yet (codex-chapters' step 2).
- agy-type: preloader bound to `loadProgress`, the Enter gate, and the callouts reading `anchors`.
- Copy rewrite (gap 8) is not done. HDRI author names in CREDITS.md are unverified.
- The overlap fix is merged but NOT yet verified in a browser (10 scroll positions plus transitions).
- The shell JS grew to 119 kB gzip (gsap/SplitText). The Experience chunk is 278 kB gzip.
- claude-assets asked for `@gltf-transform/cli`. Declined for now; the current assets are fine without Draco.

## Next 3 steps
1. Swap the reviewer lane:
   - `herdr pane close w2:pC` (the Opus claude-review).
   - Then `herdr tab create --workspace w2 --cwd <repo> --label r2-review --no-focus` and `herdr agent start agy-review --kind agy --pane <new> -- --mode auto --model claude-opus-4-6-thinking`. Its brief is `.orchestrator/briefs/round2-claude-review.md` (it applies to agy-review).
   - Also consider moving claude-assets to Haiku: after its copy task, close it and use `--model haiku` for any further mechanical work.
2. As each builder reports done:
   - Check that `git diff --name-only main...r2/<name>` stays within the paths it owns.
   - Merge with `--no-ff` and a Co-Authored-By trailer.
   - Run `npm run build` and `npm run lint`.
   - Update this file.
3. When all four are merged, prompt agy-review to run the brief's review: screenshots `r2-*.png`, the overlap check, gaps 1–8 judged pass/fail. Send fixes to owners, at most about 2 rounds.
   - Then build the **screenshot strip checkpoint for Akash** before the final merge. He is away from this Mac, so publish it as a private Artifact page.
   - Then do the final verification (fps script at `<scratchpad>/fps.mjs`, `?nogl`, `?lite`, 390px), commit, close the panes and remove the worktrees.

## Operational gotchas
- agy asks before running commands even in auto mode. The options are:
  - "Allow creation of this file?" / "Accept this file edit?": option 1 allows, **option 2 denies**.
  - Command prompts: option 2 = allow the prefix for this conversation.
- herdr reports agy as "done" while a dialog is open, so read the pane.
- codex needs approval for writes outside its worktree: `git commit` (the index lives in `.git/worktrees`) and the Vite cache in the shared `node_modules`.
- Claude agents can show a Claude Code "autocompact" dialog that looks idle. Press Esc or Enter on "Keep auto", then re-send the prompt.
- The watcher script at `<scratchpad>/watch3.sh <names…>` auto-allows agy file dialogs and wakes on a new r2/* commit, a block or a finish. The scratchpad is `/private/tmp/claude-501/-Users-akashkumars-Documents-Personal-portfolio-omniverse/ada568f1-b238-410f-946e-2a9dc19d51f2/scratchpad`; it may not survive /clear, so recreate the script if needed.
- The REA `capture_browser_scenario` output is huge. Extract the screenshot with jq from the saved tool-result file, and never read big JSON into context.
- Akash is away from this Mac: anything he must see goes in an Artifact link, never a localhost URL.

## Akash directive (2026-11-07 13:14 UTC)
Review OUTPUT only (screenshots, behaviour, measurements), not code. Brief briefs/round2-claude-review.md updated; agy-review (w2:pD, t8) is the reviewer.

## Update 2026-11-07 14:35 UTC
- Merged to main (no-ff, build+lint clean): r2/codex-world (asset load), r2/codex-chapters (mount World/AnchorWriters/LoadProgress, push-in), r2/agy-type (preloader, Enter gate, callouts). Experience chunk 330 kB gzip, shell 120 kB.
- Lanes: claude-assets is now Haiku (pane w2:pB; someone ran /model haiku in it; global default is still "opus", verified). Haiku does HDRI author verification only.
- Copy rewrite (gap 8) reassigned to agy-type (owns src/content/** now). claude-assets no longer owns it.
- Builders codex-world and codex-chapters are idle, done with step 2. Close them once review confirms no fixes needed.
- Next: when agy-type and claude-assets report, merge, then prompt agy-review (output-only review, brief round2-claude-review.md).

## Update 2026-11-07 15:05 UTC
- Merged agy-type copy rewrite (gap 8) and claude-assets author check (all 3 authors verified correct, no change). Main build+lint clean. claude-assets pane closed.
- All four builders merged. agy-review prompted for output-only review; report at .orchestrator/review/round2-review.md.
- Next: read verdict, route fixes to owners (max ~2 rounds), then Artifact screenshot strip for Akash, final verification, close panes, remove worktrees.

## ROUND 3 (2026-11-07 15:30 UTC) — supersedes Round 2 plan above
Akash: UI/type/copy/HUD/overlay FROZEN ("everything except the 3D is good; 3D is very average"). Round 3 = 3D only per `research/3D-PLAYBOOK.md` (Signal Field GPGPU swarm). Contract: `briefs/round3-contract.md` + `src/state/signal.ts` (store.quality now high|medium|lite).
Main HEAD after round 2: all four builders merged; round 3 briefs committed.
| Name | Lane | Pane | Tab | Branch | Owns |
|---|---|---|---|---|---|
| codex-world | codex gpt-6-luna HIGH effort | w2:pE | t9 r3-scene | r3/codex-world | src/scene/particles/**, src/scene/shaders/** |
| agy-world | agy auto, claude-opus-4-6-thinking | w2:pF | t9 r3-scene | r3/agy-world | Floor, VolumeCone, CameraRig, fx/Effects, Experience.tsx |
| agy-review | agy auto, claude-opus-4-6-thinking | w2:pD | t8 r2-review | none | judges against playbook section 8 (output only) |
Retired + closed: codex-chapters, agy-type, claude-assets (+ old worktrees removed). Old r2 branches are merged.
Order: codex-world step 1 (SignalField exported) -> merge -> tell agy-world step 4 (mount). agy-review still finishing a round-2 baseline (overlap check); after it reports, re-point it at the playbook section 8 review once round 3 merges.
Checkpoint: screenshot strip Artifact for Akash BEFORE the final merge. Akash is away: Artifact links only.
Next 3: (1) wait for codex-world step-1 report, merge, notify agy-world; (2) merge agy-world steps 1-3; (3) agy-review vs playbook s8, fix rounds (max 2), Artifact strip, final verify (fps, ?nogl, ?lite, 390px).

## HOLD (2026-11-07 15:18 UTC) from Morph
Playbook being revised (deeper internet research, Blender in the pipeline), ETA ~20 min. DO NOT brief or start 3D builders until Morph says go and the new 3D-PLAYBOOK.md is read.
- codex-world (w2:pE) and agy-world (w2:pF) had been started and briefed before the hold arrived. Both were stopped and told to hold; their worktrees (.worktrees/codex-world, .worktrees/agy-world) have no edits and no commits, so nothing to revert.
- Done under the hold: round-2 work all merged, research files committed, contract written (`briefs/round3-contract.md`, `src/state/signal.ts`; may need revising for the new playbook).
- Round 3 briefs (`briefs/round3-codex-world.md`, `round3-agy-world.md`) are STALE until the playbook update. Rewrite them after reading the new playbook.
- Next: wait for Morph's go, re-read the playbook, revise contract and briefs, re-prompt both held agents.

## ROUND 3 GO (2026-11-07 15:30 UTC) — hold lifted, direction "Sanctum + Signal Field"
Contract: `briefs/round3-contract.md` + `src/state/signal.ts` (CHAPTER_SPOTS names shared by Blender `CAM_*` and CameraRig; ANCHOR_* empties; SanctumSpots manifest; tiers). Committed on main.
| Name | Lane | Pane | Branch | Status |
|---|---|---|---|---|
| blender-sanctum | agy claude-opus-4-6-thinking (codex pool is 87% used) | w2:pG | r3/blender-sanctum | step 1-2 (scripted scene + Cycles stills), STOP at stills: show Akash BEFORE export |
| codex-world | codex gpt-6-luna high | w2:pE | r3/codex-world | step 1 (SignalField minimal) |
| agy-world | agy opus-4-6-thinking | w2:pF | r3/agy-world | HOLDING, start after codex-world step 1 (needs SignalField export) and sanctum stills |
| agy-review | agy opus-4-6-thinking | w2:pD | none | idle/finishing round-2 baseline; judges playbook s8 later |
Rules: BlenderMCP needs Akash's OK (not installed). Cycles stills per chapter before export. Akash away: stills go in an Artifact.
Next 3: (1) wait for blender stills -> publish Artifact of stills for Akash (private) -> on go, tell blender-sanctum to export; (2) merge codex-world step 1, then prompt agy-world; (3) integrate, agy-review, strip Artifact, final verify.

## BlenderMCP (2026-11-07 15:32 UTC)
Akash installed it himself: Claude MCP server "blender" (uvx mcp-for-blender==2.2.7) shows Connected; addon file in ~/Library/Application Support/Blender/5.2/scripts/addons/blender_mcp_addon.py. Only Claude-kind agents can call it; blender-sanctum (agy) keeps using headless scripts. Needs Blender GUI open with the addon connected to drive a live scene. I did not read the addon source; it can execute arbitrary Python in Blender by design.

## Lane swap (2026-11-07 15:35 UTC): agy Opus 4.6 quota exhausted (~4.5h)
- blender-sanctum -> kind claude Sonnet, auto, pane w2:pJ, cwd .worktrees/blender-sanctum (r3/blender-sanctum), uses blender MCP; steps saved as blender/scripts/*.py; STOP at Cycles stills.
- agy-world -> agy gemini-3.8-flash-high, pane w2:pK, still HELD until codex-world step 1 merges.
- agy-review -> agy gemini-3.8-flash-high, pane w2:pM, idle (its round-2 baseline was lost to the quota; re-run later vs playbook s8).
- codex-world unchanged (w2:pE).

## Reuse-first (15:50 UTC)
Section 0 of the playbook + paragraph in round3-contract.md sent to codex-world and blender-sanctum. agy-world (still held) gets it with its start prompt: drei SpotLight volumetric / MeshReflectorMaterial / Sparkles / Environment before any custom shader; extend CameraRig, do not replace.

## 2026-11-07 16:30 UTC watch update
- Merged r3/codex-world (Signal Field steps 1-4: SignalField, targets, curl morph, tiers). eslint now ignores .orchestrator and blender (cloned refs made lint fail). Build+lint clean on main.
- codex-world (w2:pE): sent a reuse pass (refs live at the MAIN repo path .orchestrator/research/refs, absent from worktrees): adapt Nova morph + flow-field, then measure frame time, report.
- agy-world (w2:pK, flash): STARTED, steps 1-3 + mount SignalField + slot for sanctum GLB, reuse-first.
- blender-sanctum (w2:pJ, claude sonnet): commit e1727bb (scripted build). Stills boot_wide and boot_under_oculus exist in its worktree; full-quality render of the rest was still running. Report at its worktree .orchestrator/reports/round3-blender-sanctum.md. NO export until Akash sees stills and says go.
- Monitor armed (agent status, commits, stills count). Sonnet pool shows 100% on the status line; Claude 5H 52%, weekly 70%.

## 16:27 UTC
Morph visual check at 4fe37fa: SignalField not visible; old spheres/cones/floor remain. agy-world told its first commit must mount SignalField and delete constellation + cones + old floor, with a hero screenshot as proof. Note: a stale Vite dep cache after merges gives a blank page; restart dev server with --force.

## CHECKPOINT 2026-11-07 17:00 UTC (READY-FOR-CLEAR; context heavy from repeated memory injections)
Main HEAD: 383a3c3+ (eslint ignores .orchestrator, blender). r3/codex-world step 1-4 MERGED (4fe37fa). Contract: briefs/round3-contract.md + src/state/signal.ts. Reuse-first rule applies (playbook s0).
Live agents (w2): codex-world w2:pE (gpt-6-luna high; reuse pass: adapt Nova/flow-field from MAIN-repo path .orchestrator/research/refs; measuring frame time via Chrome :9222; told NOT to commit probe-*.mjs); agy-world w2:pK (gemini-3.8-flash-high; worktree .worktrees/agy-world; commit 6d25e0d "step 1 Floor, VolumeCone, remove constellation" on r3/agy-world, Experience.tsx mounting SignalField in progress; CHECK: it wrote a custom VolumeCone.tsx although contract says use drei SpotLight volumetric first: make it justify/replace); blender-sanctum w2:pJ (claude sonnet, worktree .worktrees/blender-sanctum, branch r3/blender-sanctum commit e1727bb + uncommitted; Poly Haven ON, props added; re-rendering stills; 4 of 6 stills exist at .worktrees/blender-sanctum/.orchestrator/reference/r3-blender-*.png: boot_wide, boot_under_oculus, about_niche, +1; needs exp_role_0, proj_gallery, contact_sky); agy-review w2:pM (flash, idle, nothing to review yet).
Dialog handling (agy): "Allow creation of this file?" -> send ONLY "1" (no Enter; Enter queues a stray message). Claude autocompact dialog -> Esc. herdr marks blocked/done while a dialog is open; read the pane.
Gates: (1) NO Blender export until Akash sees the 6 Cycles stills (publish a private Artifact page with all six) and says go. (2) merge agy-world after its screenshot proof (.orchestrator/reference/r3-agyworld-hero.png): old spheres/cones/grey floor gone, particles visible; run build+lint (restart vite with --force after merges if blank page). (3) merge codex-world reuse pass when committed (no probe files). (4) after sanctum export, agy-world loads sanctum.glb + CameraRig splines from sanctum.spots.json. (5) agy-review vs playbook s8 with screenshots; fix rounds max 2; Artifact strip checkpoint for Akash BEFORE final merge; final verify (fps, ?nogl, ?lite, 390px).
Monitor expired; re-arm if needed (script polls herdr agent list + r3 branch commits + stills count).

## 17:00 UTC Morph visual check of 6d25e0d: DO NOT MERGE r3/agy-world until: SignalField mounted filling 35-45% of right half; near-black MeshReflectorMaterial floor with fog, no horizon; drei SpotLight volumetric visible; agy-world must screenshot all 5 chapters itself. Requirements sent to agy-world.
