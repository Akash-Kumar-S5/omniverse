# Fallback recheck (copilot-review, main merged at ca4855b)
Method: Playwright MCP, headed Chrome, `?nogl` (src/App.tsx:24), 1440x900 and 390x844, DOM audit plus screenshots.

| Item | Desktop | Mobile |
|---|---|---|
| No backdrop-filter/glass (fallback) | PASS (0 elements) | PASS (0) |
| No ALL-CAPS microcopy (text-transform + literal caps) | PASS | PASS |
| No buzzwords ("AI harness", "Passionate") | PASS | PASS |
| AA contrast (computed fg/bg, 4.5 / 3 large) | PASS (0 failures) | PASS (0) |
| No horizontal overflow | PASS (1440/1440) | PASS (390/390) |
| Hero reveal, chapter=0 | PASS: name, line, CTA visible, no overflow | PASS |
| Mobile project callout, chapter=3 (SalarySync) | PASS | PASS: title, summary, stack, "Read the code", Previous/Next legible over scene, no overflow, 0 backdrop-filter |

Caveats: contrast check ignores text over images/canvas (uses nearest opaque background); chapter shots judged by eye. Console: 0 errors, 1 warning.
Shots: cr2-fallback-{desktop,mobile}.png, cr2-ch{0,3}-{d,m}.png
