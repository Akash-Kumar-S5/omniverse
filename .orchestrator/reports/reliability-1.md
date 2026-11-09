# Reliability 1: rig vs site (R35)

Build: detached checkout of main at `bdcb9c6` (includes the r34 watchdog), `npm run build`, `vite preview` on port 4660 (stopped by pid afterwards; 4660 verified free).
Browser: headed Google Chrome 157 (`channel: chrome`, `--use-angle=metal`) launched by the test script, fresh context per load, closed after each load. URL `?skipgate=1&chapter=N`.
Sizes: 1920x1080 DPR1 and 1512x982 DPR2. Right-half pixel mean from a PNG screenshot at 3, 6 and 12 s. BLACK = mean < 9 at 12 s (clear colour is about 7.1).
Raw data: scratchpad `p1.json` (solo), `p2_0..2.json` (contention), runner `rel.cjs`.

Caveat on "only GPU user": the principal's own Google Chrome app (pids 44687, 14967 and helpers) and the Claude desktop app were still running and were not touched. They hold no visible scene, but they are not zero GPU load.

## Result

| Phase | Loads | BLACK | Console errors | Watchdog remounts | Context lost |
|---|---|---|---|---|---|
| 1 solo, one browser, sequential | 100 (10 x 5 chapters x 2 sizes) | **0** | 0 | 0 | 0 |
| 2 contention, 3 headed browsers at once | 100 (same matrix split 34/33/33) | **0** | 0 | 0 | 0 |

## Black rate per chapter and size

| Size | ch0 | ch1 | ch2 | ch3 | ch4 |
|---|---|---|---|---|---|
| 1920@1 solo | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 |
| 1512@2 solo | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 |
| 1920@1 contention | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 |
| 1512@2 contention | 0/10 | 0/10 | 0/10 | 0/10 | 0/10 |

Right-half mean at 12 s (min over the 10 loads): ch0 15.2-16.3, ch1 9.7-10.6 (inherently dim), ch2 18.2-19.9, ch3 13.6-16.7, ch4 10.4-11.5. Mean at 6 s never below 9.7 in either phase.

## Load-time percentiles (`__omniDiag.firstFrameMs`, ms from Experience mount to first drawn frame)

| Phase | p50 | p90 | max |
|---|---|---|---|
| solo | 609 | 829 | 1145 |
| contention | 693 | 919 | 2356 |

## Slow or odd loads (the only anomalies)

- Contention: 2 of 20 ch0 loads at 1920 were still clear colour (mean 7.1) at 3 s: first frame at 1571 ms and 2356 ms, both fully painted by 6 s (13.6 and 14.0). Not black at 12 s.
- Contention: 3 of 20 ch1 loads at 1920 read 5.2 at 3 s (lite shell, normal dim state); 9.7 at 6 s like the rest.
- The watchdog drove frames (`driven` 1-3) in 12 solo and 16 contention loads (rAF gaps over 200 ms, probably shader compile jank). It never recreated the canvas, and no context was lost.

Black loads' `__omniDiag` dumps: none, there were no black loads.

## Verdict

Black appears neither solo nor under contention in 200 loads, so there is no solo bug to root-cause: no `r35/root-cause` branch was made. The judge's 30% blank rate did not reproduce on this machine at bdcb9c6. What this run cannot show is whether the watchdog is what prevents it, because it was active in every load and acted only as frame-driving, never as a canvas recreation. Keep the watchdog. To separate rig from site properly, run the same matrix on the judge's rig, or run main at `71acf14` (pre-watchdog) here; I did not, as the order named bdcb9c6 only.
