# Round 3 Benchmark & Re-Score Report

**Reviewer:** agy-review  
**Date:** 2026-11-08 13:00 IST  
**Scope:** `main` at `7eb4818` (merged ruined gothic hall bake + Met CC0 framed paintings + typography overhaul)  
**Preview Port:** `http://localhost:4230/?skipgate&chapter=0..4`  
**Evidence:** `.orchestrator/reference/r3-score-ch{0..4}-{1440,390}.png`  
**References:** `.orchestrator/reference/aengel-*.png`, `.orchestrator/reports/benchmark-refs.md`  

---

## Chapter Scores

| Chapter | 3D Craft | Art Direction | Motion | Typography | Originality | Performance | Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0: Hero / Oculus** | 9.2 | 9.4 | 9.0 | 9.4 | 9.3 | 9.8 | **9.35** |
| **1: About / Niche** | 9.4 | 9.3 | 8.8 | 9.0 | 9.2 | 9.8 | **9.25** |
| **2: Work / Colonnade** *(floor blown)* | 7.8 | 8.0 | 8.7 | 8.8 | 8.8 | 9.8 | **8.65** |
| **3: Projects / Gallery** | 9.3 | 9.4 | 8.9 | 9.3 | 9.3 | 9.8 | **9.33** |
| **4: Contact / Hearth** | 9.3 | 9.5 | 9.0 | 9.2 | 9.4 | 9.8 | **9.37** |

**Portfolio Benchmark Average:** **9.19 / 10**  
*(Round 1 Baseline: 8.36 / 10 | Round 1 Re-Score: 9.01 / 10 | Round 3 Gain: +0.18 net, despite Ch2 floor penalty)*

---

## Benchmark Analysis & Chapter Breakdown

### 0: Hero / Oculus (Overall: 9.35)
- **3D Craft (9.2):** The ruined gothic hall and oculus aperture are dramatically elevated. The conical volumetric haze beam cuts down through the ceiling opening, illuminating a deep multi-layered GPGPU particle core with floating fire embers rising in the air.
- **Art Direction (9.4):** Monumental concrete and stone architecture paired with warm amber light and embers. Direct spiritual peer to `aengel-02` (luminous organic form in high-contrast void), but grounded in architectural brutalism.
- **Motion (9.0):** Natural particle breathing, smooth camera push-in, and responsive cursor disturbance that circulates motes organically.
- **Typography (9.4):** Newsreader serif display (86.4px) left-anchored with generous negative space (>300px), authentic non-slop copy, quiet "Chennai, 12:51 pm" timestamp, and underlined text CTA.
- **Originality (9.3):** Avoids standard creative agency clichés (no floating 3D spheres or wireframe torus meshes).
- **Performance (9.8):** 120 FPS sustained (p50 8.3ms, p95 8.8ms).

### 1: About / Niche (Overall: 9.25)
- **3D Craft (9.4):** The gothic statue (Poly Haven CC0) sits in a dedicated architectural alcove upon a raised plinth surrounded by candles. A prominent foreground gothic arch pillar frames the composition with natural depth of field.
- **Art Direction (9.3):** Museum-grade side-gallery lighting. Soft warm candlelight washes over the statue's drapery against deep architectural shadows.
- **Motion (8.8):** Camera Catmull-Rom spline curves gracefully around the foreground pillar to present the alcove.
- **Typography (9.0):** Newsreader 67.2px headline (*Mostly web apps, lately agent tools.*) paired with structured Schibsted Grotesk tabular metadata.
- **Originality (9.2):** Classical sculpture in a brutalist niche evokes museum gallery curation (`aengel-04`).
- **Performance (9.8):** 120 FPS sustained.

### 2: Work / Colonnade (Overall: 8.65)
- **3D Craft (7.8):** Architecture features a rhythmic colonnade of pointed gothic arches, buttresses, and scattered rubble blocks with a glowing standing figure on the right. **Scored as is per instructions**: The center cobblestone floor suffers from an overexposed blown-white bake highlight that washes out surface detail and draws undue luminance to the lower plane.
- **Art Direction (8.0):** Archway silhouette and colonnade perspective are compelling, but the blown floor flattens the ground plane contrast.
- **Motion (8.7):** Camera translation down the corridor as roles change is smooth and weighted.
- **Typography (8.8):** Role selectors on the left sit in deep architectural shadow, preserving clean AA/AAA contrast. Mobile view uses a protective dark backing to ensure zero readability degradation.
- **Originality (8.8):** Physical progression along a ruined colonnade to convey career history is a strong spatial metaphor.
- **Performance (9.8):** 120 FPS sustained.

### 3: Projects / Gallery Frame (Overall: 9.33)
- **3D Craft (9.3):** The canvas fake-UI plane is replaced with real framed Met CC0 classical paintings hung in the sanctuary, illuminated by a warm firelit beam hitting the flanking stone column. The 3D tethered callout line and badge (*SalarySync / Laravel, PHP*) pin accurately to the frame.
- **Art Direction (9.4):** Directly rivals `aengel-03` (gallery frame with precision callout label), elevated by the dramatic gothic stone lighting and floating embers.
- **Motion (8.9):** Project switching cycles framed paintings with smooth cross-fade; dashed pager track updates seamlessly.
- **Typography (9.3):** Newsreader 92px display title, italic subtitle, crisp tech stack metadata, and quiet dashed pager.
- **Originality (9.3):** Presenting digital projects as curated classical artworks in a stone sanctuary completely transcends typical tech portfolios.
- **Performance (9.8):** 120 FPS sustained.

### 4: Contact / Central Hearth (Overall: 9.37)
- **3D Craft (9.3):** The central stone fire pit features a luminous floating halo ring and rising embers, seen through the circular sanctuary portal.
- **Art Direction (9.5):** Stark, hypnotic contrast between obsidian stone and glowing amber firelight. Concludes the architectural narrative with ritual solemnity.
- **Motion (9.0):** Rising ember dynamics and gentle camera settling.
- **Typography (9.2):** Monumental *Say hello.* (120px Newsreader), high-contrast gold email link, copy button, and social links.
- **Originality (9.4):** "A resting fire at the journey’s end" completes the sanctuary sequence with cohesive thematic closure.
- **Performance (9.8):** 120 FPS sustained.

---

## Remaining Focus Areas for Final Polish
1. **Chapter 2 Floor Bake**: Balance the ground plane albedo/lighting intensity to match the atmospheric gothic tone of the walls and eliminate the blown-white hotspot.
2. **Contact Hearth Badge Case**: Remove `text-transform: uppercase` in `sections.css:336` to align with the rest of the site's editorial sentence-case museum signage.
