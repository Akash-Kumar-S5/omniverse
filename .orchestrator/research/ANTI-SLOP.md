# Anti-slop brief (Akash, 2026-11-07 23:20 IST)

> "The outcome should not have any trace of AI slop. It should be a high quality product, and the fonts
> should be changed, since most AI websites look like this one."

This UNFREEZES typography, UI chrome and copy (round-2 freeze lifted for these items only).
The 3D direction (Sanctum + Signal Field) is unchanged.

## 1. Why it currently reads as "AI-made" (audited on the live build)
1. **The font stack is the #1 AI-site tell**: Clash Display + Space Grotesk + JetBrains Mono. This exact trio
   is the default output of AI site generators in 2025-26. Also banned for the same reason: Inter, Geist,
   Satoshi, General Sans, Syne, Unbounded, Sora, Instrument Serif, DM Sans, Manrope, Outfit, Plus Jakarta.
2. **Fake "systems" theatre**: "INITIALIZING AGENT SYSTEMS", "SYSTEM ONLINE", "ORCHESTRATOR.TS / agents: 8 //
   synchronized", "01/05 BOOT", "AGENT SYSTEMS // TOOLING", lat/long readouts, corner brackets, a live clock.
   None of it carries information. It's decoration pretending to be data.
3. **ALL-CAPS letter-spaced mono microcopy with `//` separators** (48 occurrences of `//` in src).
4. **The glowing gold pill CTA** ("EXPLORE CONSTELLATION ↓") and "ENTER EXPERIENCE →" with keycaps.
5. **Effects on everything**: bloom on UI-adjacent elements, a grain overlay everywhere, glass panels, gradient fades.
6. **Buzzword copy**: constellation, harness, synchronized, orchestration, "real work". Vague and self-describing.
7. **Generic layout rhythm**: hero = giant name on the left plus a subtitle and a button. Uniform spacing, no grid tension.

## 2. Typography (replace entirely)
Direction: **editorial / museum signage**, matching the brutalist concrete sanctum. A person, not a product.
- **Display: Newsreader** (Google Fonts, OFL, Production Type). Use its optical sizes at large sizes
  (`font-optical-sizing: auto`), weight 300-400, with italics for emphasis. Name set in a refined serif
  at ~9-12vw, tight but not crushed (-0.02em).
- **Text/UI: Schibsted Grotesk** (Google Fonts, OFL). Body 17-18px, 1.5 line height, 60-70ch measure.
- **Metadata only: IBM Plex Mono** (OFL), at most 3 uses on the whole site (dates, coordinates if kept), sentence case.
- Self-host all of them as woff2 in `public/fonts/`, subset to Latin, `font-display: swap` + metric-adjusted
  fallbacks (`size-adjust`/`ascent-override`) so the layout doesn't shift on load. Delete the Clash Display
  files and the Google Fonts `<link>` for Space Grotesk / JetBrains Mono.
- Details that signal craft: real quotes and apostrophes (’ “ ”), en dashes for ranges (2024–2025),
  `font-variant-numeric: tabular-nums` for dates, `text-wrap: balance` on headings, `text-wrap: pretty`
  on paragraphs, hanging punctuation where supported, and a consistent modular type scale (1.25).

## 3. UI chrome rules
- Remove the fake telemetry: boot strings, "agents: 8 // synchronized", the orchestrator.ts callout, the
  chapter counter "01/05 BOOT", and the corner brackets. Keep at most ONE small honest detail (e.g. local
  time in Chennai), set quietly.
- 3D callout labels may stay ONLY if they say something true and specific (a project name and year), in
  sentence case, without fake metrics.
- The CTA becomes a plain text link with an underline that draws on hover ("See the work"). No pill, no glow, no keycaps.
- The PERF toggle moves out of the hero chrome into a small, quiet settings control (or auto only).
- Bloom applies to the 3D light only, never near text. Grain at most 2-3% opacity or none.
- Layout: a real 12-column grid with asymmetry; generous, deliberate whitespace; one strong alignment line per section.

## 4. Copy rules
- First person, concrete, short. Name actual things: projects, companies, years, what changed for users.
- Banned words: constellation, harness (as decoration), synchronized, orchestration (unless naming a real project),
  seamless, cutting-edge, leverage, passionate, innovative, "real work", "experience" as a noun for the site.
- Source content: `src/content/*` (from the web repo). The hero line should be one plain sentence a human would
  say about their own work.

## 5. Acceptance: an "AI-slop audit" the reviewer runs on screenshots
Fail if ANY of these are visible: a banned font; ALL-CAPS mono microcopy blocks; `//` separators; fake metrics or
boot text; pill CTA with glow; glass cards; gradient text; buzzwords from section 4; centred hero with a stock
subtitle and button. Pass also requires: no layout shift on font load, readable 390px mobile, AA contrast.
The reviewer writes the audit into `.orchestrator/reports/anti-slop-audit.md` with one screenshot per section.
