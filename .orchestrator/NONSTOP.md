# NON-STOP MODE (Akash, 2026-11-08 01:00 IST)

> "Run everything non-stop and complete all the features and graphics, optimize the web, do all the things
> needed. If the Claude limit is near, hand the orchestrator work to another agent that still has limits, and
> switch back to Claude once the limit resets."

## Mandate
Drive Omniverse to DONE without waiting for Akash between steps. Decisions inside the approved direction
(Sanctum + Signal Field, editorial type, anti-slop rules) are yours. Akash reviews the final result.
Never idle: when every agent is idle, take the next item from the BACKLOG in STATE.md and assign it.

## Still forbidden (unchanged)
No git push, no remotes, no deploy, no rm -rf / git reset --hard / git clean, no sudo, no global installs,
no edits to the web repo, to ~/.claude or to other global configs. Destructive or out-of-scope requests stop and
go to Akash via Morph.

## Definition of DONE (all must pass, proven by screenshots with ?skipgate&chapter=0..4 at 1440x900 and 390x844)
1. 3D (3D-PLAYBOOK §8): the sanctum is visible in every chapter; a recognisable swarm shape per chapter;
   the cursor disturbs the swarm; soft haze beam (no opaque cone); no hard horizon; the camera moves through
   the building between chapters; the reviewer rates it "competitive" against aengel.io references.
2. Anti-slop (ANTI-SLOP.md §5): zero fails.
3. Perf: >=55fps HIGH at 1440x900 on Akash's Mac (Blender idle), measured; LITE smooth at 390px; initial
   payload <=8 MB; tier auto-step works; no-WebGL fallback works; reduced motion works.
4. Quality: npm run build + lint clean; no console errors; no layout shift on font load; AA contrast;
   keyboard navigation; meta/OG tags; favicon.
5. Two independent reviewers pass it (agy-review + copilot-review). Neither reviews its own work.
6. Final: everything merged to local main, worktrees cleaned up, a final screenshot strip in
   .orchestrator/reports/FINAL.md for Akash.

## Improvement loop (Akash, 01:12 IST: "if the final result isn't satisfying compared to other 3D sites,
## decide on my behalf, plan new graphics/features and implement them; don't wait for my approval")
When the DONE criteria pass, the round is NOT over. Run this loop:
1. BENCHMARK: capture our 5 chapters (Playwright MCP, headed Chrome, 1440x900) next to a reference set:
   aengel.io (`.orchestrator/reference/aengel-*.png`) plus 4 current sites from
   https://www.landing.love/categories/3d-website/ (capture fresh; study only, never copy assets/text).
2. JUDGE: two independent reviewers (agy-review, copilot-review) score each chapter 1-10 on: 3D craft, art
   direction, motion, typography, originality, performance. Morph makes the final call.
3. DECIDE (no approval needed): if any chapter scores < 8 or the overall < 8.5, the orchestrator writes
   `.orchestrator/ROUND-N-PLAN.md`: the 3 highest-impact upgrades (new graphics, effects, interactions or features),
   each with an owner, the reuse-first resources and acceptance screenshots. Then implement immediately.
4. Repeat from 1. Stop when: overall >= 8.5 with every chapter >= 8 (both reviewers + Morph agree), OR 4
   improvement rounds are done, OR two rounds in a row gain < 0.5 points (diminishing returns). Then write FINAL.md.
Guardrails stay: the approved direction can evolve but not be thrown away without Morph's sign-off; the forbidden
list applies; perf must not regress below DONE §3 (a rejected upgrade is better than a slow site).

## Orchestrator failover (run by Morph, supervised; an unattended daemon was refused by the safety check)
- While Claude's 5-hour usage is below 85%: the claude orchestrator (w2:p1) is ACTIVE.
- At 85%+, or on a 'limit reached' message: the ops script asks the active orchestrator to update STATE.md
  (reply HANDOVER-READY), then starts `orchestrator-b` (Copilot, claude-sonnet-5.5, a separate GitHub credit pool)
  as the interim orchestrator, reading the same files.
- After Claude's reset time: orchestrator-b updates STATE.md (reply HANDBACK-READY), is closed, and the
  claude orchestrator is restarted fresh on Sonnet and resumes from STATE.md.
- STATE.md is the single source of truth. Whoever is active keeps it current after every merge or assignment.
- While Claude is limited, assign new work to codex, agy or copilot agents; claude sub-agents just pause and resume.
