# Brief: agy-review (kind agy, gemini-3.8-flash-high). Output-only reviewer, Round 3

**OUTPUT ONLY: do NOT review source code.** Judge what a visitor sees and experiences: screenshots, scroll behaviour, measured DOM rects, console errors, load/fps, fallbacks. Findings cite screenshots or measurements, name the owning builder agent, and state the visible fix.

## Trigger & Gate
**DO NOT START** until Akash confirms that both `ui-editor` and `agy-world` have been merged into `main`.

---

## Part A: 3D Acceptance Review (from `.orchestrator/research/3D-PLAYBOOK.md` §8)
1. **Hero Recognition**: Stranger can describe the hero 3D in one sentence that isn't "spheres and lines".
2. **Chapter Morphing**: Each chapter particle shape is recognisable within 1s of arrival (e.g. bust reads as a head).
3. **Interactivity & Transitions**: Cursor visibly disturbs the swarm on desktop. Scroll morphs never pop or snap.
4. **Lighting & Atmosphere**: Light shafts have soft edges and fade into floor/fog; no hard horizon line.
5. **Competitive Evaluation**: Compare side-by-side with reference stills (`aengel-03-project-chapter.png`, `aengel-04-about-callouts.png`); rate "competitive" and provide concrete rationale.
6. **Performance & Fallbacks**:
   - HIGH holds ~60fps at 1440p on Apple Silicon.
   - LITE at 390px mobile stays smooth.
   - Build + lint clean (`npm run build`, `npm run lint`).
   - Reduced motion and no-WebGL fallbacks still render cleanly.

---

## Part B: Anti-Slop Audit (from `.orchestrator/research/ANTI-SLOP.md` §5)
Audit the merged live build to guarantee zero traces of "AI slop".

### Fail Conditions (Fail if ANY are visible):
1. **Banned Fonts**: Clash Display, Space Grotesk, JetBrains Mono, Inter, Geist, Satoshi, General Sans, Syne, Unbounded, Sora, Instrument Serif, DM Sans, Manrope, Outfit, Plus Jakarta.
   - *Target*: Newsreader (Display), Schibsted Grotesk (Text/UI), IBM Plex Mono (Metadata only, max 3 uses).
2. **ALL-CAPS Mono Microcopy**: Microcopy blocks formatted in uppercase monospace.
3. **`//` Separators**: Any decorative double-slash delimiters.
4. **Fake Systems Theatre & Boot Text**: "INITIALIZING AGENT SYSTEMS", "SYSTEM ONLINE", "ORCHESTRATOR.TS / agents: 8 // synchronized", "01/05 BOOT", "AGENT SYSTEMS // TOOLING", fake lat/long, corner brackets, live clocks.
5. **Pill CTA with Glow**: Glowing gold pill buttons ("EXPLORE CONSTELLATION ↓", "ENTER EXPERIENCE →", keycaps). Must be plain text link with hover underline ("See the work").
6. **Glass Cards & Gradients**: Glassmorphism panels, gradient text.
7. **Banned Buzzwords**: "constellation", "harness" (as decoration), "synchronized", "orchestration", "seamless", "cutting-edge", "leverage", "passionate", "innovative", "real work", "experience" (as noun for the site).
8. **Generic Layout Rhythm**: Centred hero with stock subtitle and button; uniform spacing without grid tension.

### Additional Pass Requirements:
- **No Layout Shift on Font Load**: Self-hosted woff2 with `font-display: swap` + metric-adjusted fallbacks (`size-adjust`/`ascent-override`).
- **Mobile Readability**: Clean, responsive layout at 390px width.
- **Contrast**: AA contrast compliance across all sections.

---

## Deliverables
1. **Audit Report**: `.orchestrator/reports/anti-slop-audit.md`
   - Detailed section-by-section breakdown.
   - **Exactly one screenshot per section** (Hero, About, Experience, Projects, Contact, plus mobile).
   - Clear PASS / FAIL verdict for each item with visual citations.
2. **Round 3 Review Report**: `.orchestrator/review/round3-review.md`
   - 3D acceptance assessment against playbook §8.
   - Overall status and blocker/major/minor rankings.
