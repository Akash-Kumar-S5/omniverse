# Anti-slop audit (copilot-review, ANTI-SLOP.md §5)
Build: `npm run build` + `vite preview :4200`, `?skipgate&chapter=N`, real chapter state (puppeteer, 9s settle, swiftshader).
Screenshots: `.orchestrator/reference/cr-ch{0..4}-{1440,390}.png`. Overall: **main UI passes; 3 fails below**.

## Criteria
| Criterion | Result |
|---|---|
| Banned fonts | PASS – only Newsreader, Schibsted Grotesk, IBM Plex Mono in `public/fonts`; no Clash/Space Grotesk/JetBrains/Google link in src or index.html |
| ALL-CAPS mono microcopy | PASS in main UI; **FAIL in `src/ui/fallback/fallback.css`** (uppercase at lines 83, 127, 374, 417) |
| `//` separators | PASS – none visible |
| Fake metrics / boot text | PASS – gate/boot/orchestrator.ts/counters gone; only "Chennai, 1:0x am" |
| Pill CTA with glow | PASS – plain underlined text links ("See the work", "Read the code") |
| Glass cards | PASS main UI; **FAIL fallback** (`backdrop-filter` blur, fallback.css:49, 247, plus box-shadow) |
| Gradient text | PASS, but hero name was still half-faded ("Akash K") at 9s on desktop; verify the reveal completes, else it reads as gradient text |
| Buzzwords | PASS main UI; **FAIL fallback** `FallbackView.tsx:109-110` ("AI harness engineering", "Passionate") |
| Centred hero + stock subtitle + button | PASS – left-aligned, asymmetric, plain sentence |
| No layout shift on font load | PASS by inspection (swap + local woff2); CLS not measured |
| Readable 390px | **FAIL (minor)**: ch3 callout "SalarySync / Laravel, PHP" collides with the italic subtitle. ch2 role tabs scroll horizontally (acceptable). No horizontal overflow (scrollWidth=390) |
| AA contrast | Mostly pass; borderline: inactive nav, "Graphics: High", inactive roles, footer clock (dim grey on near-black over 3D, unmeasured) |

## Per chapter
- ch0 Hero: 1440 left name + plain sentence + underlined link, clean; name still fading at capture. 390 good.
- ch1 About: serif headline, definition list, good asymmetry; body text overlaps 3D orbs/lines at 1440 (tolerable); "Chennai" callout is true, sentence case.
- ch2 Work: clean tab list + detail; mono used for date only (1 of 3 allowed).
- ch3 Projects: strong; 390 callout overlaps subtitle (fail); pager dashes fine.
- ch4 Contact: "Say hello." clear; gold email overlaps orb centrepiece at 1440 (minor); 390 fine.

## Fixes to request
1. Mobile: hide or reposition the project callout under 600px.
2. Strip glass/uppercase/buzzwords from `ui/fallback/*` (still ships to low-perf/no-WebGL users).
3. Confirm hero name reveal completes; measure contrast of dim greys (>=4.5:1).
