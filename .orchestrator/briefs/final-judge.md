# Final judge (stage 2 of the quality loop) — Akash 01:00 IST 09-Nov, via Morph

Trigger: the stage-1 critic (w2:pX, briefs/critic-loop.md) returns SHIP (overall >= 8.5, no chapter < 8).

Then the orchestrator spins up a NEW judge agent in a new tab (`judge`, Claude Opus, `--permission-mode auto`).
Each judge cycle starts fresh (/clear, or a new pane) so it never anchors on earlier scores.
- It never sees the critic reports, the builders' reports or STATE.md. It gets only this brief, the reference
  images (.orchestrator/reference/aengel-*, bench-*) and the live build.
- It shoots main the same way the critic does: production build, headed Playwright, 1440 for ch0-4, 390 for ch0/ch4,
  mid-scroll frames. It also scrolls the whole site once and judges motion, transitions, load and console.
- It scores 0-10 per chapter, plus mobile, motion and overall, against aengel.io and the landing.love sites, as a
  harsh award-site juror (Awwwards SOTD level).
- It writes .orchestrator/reports/judge-cycle-N.md: the scores, the top 5 defects with evidence (file:line or
  screenshot coords), the top 5 fixes ranked by gain per hour, and a verdict.

Verdict: DONE only at **overall >= 9 with no chapter below 8.5**. Otherwise ITERATE.
On ITERATE, the orchestrator dispatches the fixes to lanes (usage check first, /model fusion on copilot), merges on
passing evidence, then runs a fresh judge cycle. This repeats until DONE. Stage 1 is not rerun.

Autonomy (Akash): no need to wait for his input. Lanes may fetch from the internet whatever they need:
CC0/CC-BY assets (Poly Haven, Sketchfab via tools/sketchfab-dl.ts, Smithsonian, museum scans, Kenney, ambientCG),
references, docs and libraries. Every asset goes in CREDITS.md.
The standing rules still hold: no FromSoftware material, no game-character names anywhere, nothing paid or
pirated, no push, no deploy, no rm -rf.

## Update 12:32 IST 09-Nov (Akash): desktop web only
"lets skip mobile devices for now, concentrate purely on web view." Score and gate on desktop (1440 ch0-4 plus
motion/load/console) only. No 390 shots, no mobile score, no mobile lanes until Akash re-enables it. Mobile must not
crash or show a blank page, but it is out of scope for quality.

## Update 17:05 IST 09-Nov (Akash): validate at true full-screen sizes
Shots so far were 1440x900 at DPR 1, which is smaller and softer than a real full screen. From c16 on, the critic and judge shoot
every chapter at 1920x1080 DPR 1 (common desktop monitor) and at 1512x982 DPR 2 (MacBook 14" full-screen, Retina).
Score the worse of the two. Keep 1440x900 only for comparison with older cycles.

## Update 19:50 IST 09-Nov (Akash): OpenRouter free vision models as a second opinion
`bun tools/or-vision-review.ts <png...>` sends each shot to a free OpenRouter vision model (Nemotron 3.5 Super VL, Gemma 4 31B
fallback) and returns SCORE, 3 defects with pixel regions, and 1 thing that works. The key is read only from env or
~/.claude/.env and is never printed. Budget: the free tier allows ~50 requests/day; the tool caps at 40/day
(.orchestrator/openrouter-usage.json). Use it once per cycle on the 1920 shots (5 requests) and append its output to the
critic/judge report under "Cross-vendor check". It is advisory: the Claude critic/judge score stays the gate, but any defect it
finds that the critic missed must be addressed or explicitly rejected with a reason. Never use it for code-building lanes.

## Rig rule (R35, reliability-1.md)
Use ONE browser at a time (headed Chrome, fresh context per load). Do not run other GPU work, previews or agents' browsers while judging. 200 cold loads on main bdcb9c6 gave 0 black frames solo and under 3-browser contention, so a black canvas in your run is evidence only if it reproduces on a second fresh load with window.__omniDiag captured; record that dump with the claim.
