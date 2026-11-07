# Benchmark refs (study only, no assets or text copied)
Source: landing.love/categories/3d-website (sites listed there; aengel.io excluded). Playwright MCP, headed Chrome, 1440x900, 8s load wait, wheel scroll through 3 positions. Shots: `.orchestrator/reference/bench-<site>-{1,2,3}.png`. Aengel refs already live in the same folder (`aengel-01..04-*.png`), so no copy was needed.

## Michelangelus (Studiogusto) — https://michelangelus.studiogusto.com/
- 3D/motion: one WebGL canvas under Lenis smooth scroll; the whole scene is post-processed into a two-colour halftone (pink on blue), so every frame reads as one print. Circular stroke loader on a framed solid colour.
- Type: the typeface itself is the hero, with giant glyphs cropped by the viewport behind the 3D objects, and a small italic serif header plus a dropdown specimen selector. Shot 1 is the loader; 2 and 3 are content.

## Prekesh Chavda — https://www.prekesh.design/
- 3D/motion: 3 canvases; a grid of tilted physical-looking objects (CRT monitors, stickers, patches) with soft shadows that are rearranged and reset by one control, so the interaction is playful and tactile.
- Type: minimal. One 16px grotesk name and role line in the corner, a single icon button, and no copy competing with the objects.

## JOYCO — https://joyco.studio/
- 3D/motion: 3 canvases, Lenis. A textured, lit 3D signpost whose signs are the nav (Lab, Positions, Adventures). It sits in a split layout with a live blue panel beside it, and the camera tracks it as you scroll.
- Type: custom display face at ~156px for the h1, set against a mono ticker bar (phone, coordinates, tagline, year) and mono micro-labels. The scale contrast between huge and tiny carries the layout.

## SEED (Volm) — https://theseed.volm.studio/
- 3D/motion: a single lit, translucent seed with a rim light and fuzz edge, floating over depth-of-field bokeh particles in warm gold on black. The gate is "press and hold the seed", with sound, so the first interaction is the object itself. Shots are the pre-gate state because the hold gate was not passed.
- Type: Saol Display serif (~89px, uppercase) for titles, tracked mono microcopy for prompts, and very low-contrast secondary text.

Caveats: the screenshots are a time-based sample, since Lenis and scroll-driven scenes do not land on identical sections each run. Michelangelus shot 1 is the loader.
