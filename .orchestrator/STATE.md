# Omniverse orchestrator STATE (updated 2026-11-07 13:12 UTC, before /clear)

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
| claude-review | claude auto (Opus default!) | w2:pC | t7 r2-review | none | idle, never prompted. Per MODEL-POLICY, REPLACE it with agy `--model claude-opus-4-6-thinking`. |

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
