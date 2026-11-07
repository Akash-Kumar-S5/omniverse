# Brief: claude-assets (kind claude). External assets, CREDITS.md, copy (gap 8)

Read `round2-COMMON.md` first. You do NOT write scene or UI code.

## Outcome A: assets (deliver the first batch fast, within about 20 minutes)
Licence rule: CC0 or CC-BY only. Record every asset in `CREDITS.md` at the repo root:
- name
- author
- source URL
- licence
- what it is used for

Use only direct, official download links from the source sites, and download them into `public/assets/` with curl.

What to deliver:
- **HDRI.**
  - One or two Poly Haven HDRIs at 1k.
  - Studio or night/dark moods suit a warm near-black palette.
  - `.hdr` is fine. Convert to a small `.exr` or `.hdr` only if it is under 1.5 MB.
- **Models.** One sculptural "about" object, plus optional crystal, rock or monolith pieces, from:
  - Poly Haven models (CC0)
  - Quaternius or Kenney (CC0)
  - Sketchfab (CC-BY or CC0 only; it often needs a login, so skip it if you can't get a model without logging in)
- **Compression.** Each GLB must be under 2 MB after `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp --texture-size 1024`.
  - If you use Draco, copy the decoder files from `node_modules/three/examples/jsm/libs/draco/gltf/` to `public/assets/draco/`.
- **Optional textures.** A few textures (roughness or normal maps for a rock or stone material), each 1k and CC0.
- **Budget.** Everything in `public/assets` must total under 6 MB.
- **Manifest.** Write `public/assets/MANIFEST.md` listing each file:
  - its path
  - its size
  - its intended use (hero env / about object / monolith / floor texture)
  - its scale and orientation notes

Commit the first batch as soon as the HDRI and the about object are in, report it, and keep going.

## Outcome B: copy rewrite (gap 8)
You own `src/content/**` for this round. Keep every export name and type the same; add only optional fields.
- **profile.pitch** → "I build the tooling that lets AI agents do real work: harnesses, orchestration, developer tools."
- **profile.role** → a short role line, for example "Software Engineer — AI tooling".
- **New `copy.ts`.** Short chapter lines: hero sub-line, about lines, contact CTA. Confident, first person, no clichés. Nothing like "Welcome to…", "SYSTEM ONLINE" or "cutting-edge".
- **experiences.** Keep the 1–2 most concrete achievements per role. Never invent facts. Rephrase only what is already there in `src/content`, or what is in the read-only web repo at `~/Documents/Personal/portfolio/web`.
- **projects.** Add an optional one-line `hook` per project that says what it does in under 12 words.

## You own
- `public/assets/**`
- `CREDITS.md`
- `src/content/**`

## Read-only
- Everything else, including the web repo.

## Acceptance
- Every file is in CREDITS.md with its licence.
- Assets total under 6 MB.
- Build and lint clean.
- No made-up claims about Akash.
