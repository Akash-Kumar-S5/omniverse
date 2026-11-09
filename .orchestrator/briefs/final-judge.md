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
