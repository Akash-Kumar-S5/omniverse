# Anti-Slop, Accessibility & Quality Audit (Round 3)

**Date**: 2026-11-08 12:28 IST  
**Reviewer**: agy-review  
**Scope**: `http://localhost:4210/?skipgate&chapter=0..4` (desktop 1440×900 and mobile 390×844)  
**Branch**: `main` (commit `b567b53` / `49e522a`)  
**Verdict**: **PASS** (Zero console errors, zero layout shifts, full AA/AAA contrast compliance, accessible keyboard navigation, authentic editorial craft)

---

## 1. Summary Scorecard

| Area | Status | Evidence / Notes |
|---|---|---|
| **Console Errors** | **PASS** (0 errors) | Zero errors across all chapters 0–4; 1 non-blocking Three.js deprecation warning (`THREE.Clock` -> `THREE.Timer`). |
| **Layout Shift (CLS)** | **PASS** (CLS = 0.000) | Metric-adjusted local woff2 fonts (`font-display: swap`), zero shifts during chapter loads or view transitions. |
| **Keyboard Navigation** | **PASS** | Working skip link (`#main`), visible 2px gold focus ring (`rgb(226, 180, 114)`) on all interactive elements, logical tab order, labeled project dashes. |
| **Accessibility & Contrast** | **PASS** (All > 6.5:1) | Primary headings 20.1:1, body copy 16.5:1, secondary text 9.0:1, muted chrome 6.5:1, gold links 9.9:1 against dark canvas background. |
| **Anti-Slop Typography** | **PASS** | Only `Newsreader` (optical display serif) and `Schibsted Grotesk` (museum signage sans), self-hosted; zero banned AI fonts. |
| **Anti-Slop Copy & Chrome** | **PASS** | Plain first-person human copy, zero `//` separators, no fake telemetry/boot strings, no glowing pill CTAs, no glassmorphism cards. |
| **Mobile 390×844** | **PASS** | `hasHorizontalScroll: false` (`scrollWidth: 384`), zero text collisions; Chapter 3 floating callout cleanly hidden on mobile. |

---

## 2. Detailed Chapter Review

### Chapter 0 — Hero
- **Desktop (1440×900)**: Left-anchored editorial title (*Akash Kumar*) set in Newsreader Light at 86.4px, followed by an unpretentious single sentence description and underlined text link (*See the work*).
- **Mobile (390×844)**: Stacks cleanly at `top: 344px` with 20px side gutters, `scrollWidth: 384px`, zero horizontal overflow.
- **Contrast**:
  - Heading (*Akash Kumar*): `#ffffff` on `#080706` -> **20.13:1** (AAA Pass)
  - Body sentence: `#ede8e1` -> **16.51:1** (AAA Pass)
  - CTA link (*See the work*): `#e2b472` -> **9.95:1** (AAA Pass)
  - Muted city time (*Chennai, 12:20 pm*): `#9a9286` -> **6.55:1** (AA Pass)
- **Focus Order**: Skip Link -> Logo Button (`aria-label="Akash Kumar, back to top"`) -> Nav (About, Work, Projects, Contact) -> Graphics Toggle -> *See the work* CTA. All receive `outline: 2px solid rgb(226, 180, 114)`.

### Chapter 1 — About
- **Desktop (1440×900)**: Asymmetric 12-column layout. Editorial serif headline (*Mostly web apps, lately agent tools.*, Newsreader 67.2px), grounded two-sentence lead paragraph, structured definition list (`Based in`, `Studied`, `Working in`), and underlined link (*Where I’ve worked*).
- **Mobile (390×844)**: Definition list wraps gracefully (`dt` 104px, `dd` 224px). No collisions with background 3D bust or particle swarm.
- **Copy Craft**: Honest, specific, first-person. Mentions real technologies (React, Node, Laravel, Python) and actual sprint work without generic AI buzzwords.
- **Contrast**: Headings 20.13:1, Body 16.51:1, Labels 6.55:1, CTA 9.95:1. All pass WCAG 2.1 AA.

### Chapter 2 — Work (Experience)
- **Desktop (1440×900)**: Clear section heading (*Where I’ve worked*), vertical role tabs on the left column with active role detail panel on the right. Tab buttons display role title and company cleanly.
- **Mobile (390×844)**: Role tab strip scrolls horizontally within its container while keeping `document.documentElement.scrollWidth` strictly constrained to viewport width. Role description cards display period, location, and clear bulleted contributions.
- **Keyboard Navigation**: Each role item is an accessible `<button>` element with `role="tab"` and receives the warm gold focus outline on Tab navigation.
- **Contrast**: Active role title 16.51:1, inactive role titles 6.55:1, achievement bullet copy 16.51:1.

### Chapter 3 — Projects
- **Desktop (1440×900)**: Full-width project showcase (*SalarySync*, *Rentify*, *Website Performance Monitor*, etc.). Headline in Newsreader 92.16px, italic subtitle (27.5px), descriptive paragraph (17.6px), technology stack metadata (14.08px), and plain text link (*Read the code*).
- **Mobile (390×844)**:
  - **Prior issue verified resolved**: The floating 3D callout is hidden on narrow screens via responsive media query, eliminating the prior collision with the italic subtitle.
  - Heading (top: 255px) -> Subtitle (top: 313px) -> Description (top: 411px) -> Stack (top: 488px) -> Code link (top: 525px) -> Pager controls (top: 588px). Zero overlap.
- **Keyboard Navigation**:
  - Project pager dashes are semantic `<button>` elements each having an explicit accessible label (`aria-label="Project 1: SalarySync"`, etc.).
  - Code link includes full descriptive label (`aria-label="Read the code for SalarySync on GitHub"`).
  - Pager buttons (*Previous*, *Next*) operate with standard keyboard interaction.

### Chapter 4 — Contact
- **Desktop (1440×900)**: Large headline (*Say hello.*, Newsreader 120.96px), concise invite copy, high-contrast gold email link (*akashkumar20485@gmail.com*, Newsreader 36px), and three inline action buttons (*Copy address*, *GitHub*, *LinkedIn*).
- **Mobile (390×844)**: Responsive email size scales down to 276px width to avoid breaking line boxes. Action buttons stack inline-flexibly without wrapping awkwardly.
- **Keyboard Navigation**: Interactive copy button has explicit status announcements (`aria-label="Copy akashkumar20485@gmail.com"`), social links have explicit targets and rel attributes.
- **Note on Hearth Badge**: `<span className="contact-hearth-badge">` currently has `text-transform: uppercase` in `sections.css:336`. While short and atmospheric, converting this to standard sentence case would fully align with §2 guidelines for IBM Plex Mono.

---

## 3. Fallback View Verification (`src/ui/fallback/`)
- Checked `src/ui/fallback/FallbackView.tsx` and `fallback.css` (refactored in commit `b567b53`):
  - Prior issues reported by copilot review (uppercase mono microcopy, glassmorphism cards, buzzword copy) are **fully resolved**.
  - Fallback view now uses the exact same `Newsreader` / `Schibsted Grotesk` typography, clean 12-column grid, authentic content items from `src/content/`, and plain text links.
  - Zero backdrop blur, zero glowing pill buttons.

---

## 4. Overall Anti-Slop Checklist

- [x] **No banned fonts**: No Clash Display, Space Grotesk, JetBrains Mono, Inter, or Geist.
- [x] **No ALL-CAPS mono microcopy blocks**: Microcopy is restrained, legible, and sentence case throughout the core experience.
- [x] **No `//` separators**: Clean typographic whitespace and em-dashes used exclusively.
- [x] **No fake systems telemetry / boot text**: Boot strings, fake status readouts, and orchestrator callouts eliminated.
- [x] **No pill CTAs with glow**: All interactive CTAs are authentic underlined text links or quiet buttons.
- [x] **No glassmorphism cards**: Brutalist, high-contrast typography directly anchored against concrete sanctum and particle space.
- [x] **No gradient text**: Solid, accessible typographic fills.
- [x] **No generic buzzwords**: Clear, concrete, first-person language.
- [x] **No layout shift on font load**: Preloaded local woff2 fonts with zero cumulative shift (`CLS = 0`).
- [x] **Fully responsive on 390px mobile**: Zero horizontal scroll, proper vertical rhythm, no colliding elements.
- [x] **WCAG 2.1 AA Contrast**: All text satisfies or exceeds the 4.5:1 ratio (ranging from 6.55:1 to 20.13:1).

---

## 5. Recommendations for Next Polish Cycle
1. **Chapter 4 Hearth Badge**: In `src/ui/sections/sections.css:336`, remove `text-transform: uppercase;` and `letter-spacing: 0.1em;` on `.contact-hearth-badge` so it renders in sentence case, matching the rest of the site's editorial signage.
2. **Three.js Deprecation Warning**: In `SignalField` / scene animations, replace `THREE.Clock` with `THREE.Timer` to ensure clean console logs across upcoming Three.js versions.
