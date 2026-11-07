# public/assets manifest

| Path | Size | Use | Notes |
|---|---|---|---|
| hdri/studio_small_09_1k.exr | 1.32 MB | hero env (studio) | Load with EXRLoader; equirect 1024x512 |
| hdri/moonless_golf_512.hdr | 0.42 MB | dark/night env | Load with RGBELoader (HDR range kept); 512x256 |
| models/marble_bust_01.glb | 0.68 MB | about object | 17,456 tris, no Draco (no decoder needed). Textures WebP via EXT_texture_webp (three supports natively). Real-world metres: 0.27 W x 0.52 H x 0.30 D; Y-up, base at y=0, faces +Z. Scale ~6-8x for a hero-size object. Material doubleSided, metalness 0. |

Total: ~2.4 MB (budget 6 MB). Draco decoders not copied because no asset uses Draco.
