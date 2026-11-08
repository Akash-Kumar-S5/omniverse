"""Draco-compress the Poly Haven stone_fire_pit scan for the runtime fire. Headless:
  Blender -b -P blender/scripts/compress_fire_pit.py   ->  public/assets/ruins/stone_fire_pit.draco.glb (target < 600 KB)"""
import bpy, os
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
src = os.path.join(REPO, "public", "assets", "ruins", "stone_fire_pit.glb")
dst = os.path.join(REPO, "public", "assets", "ruins", "stone_fire_pit.draco.glb")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
for im in bpy.data.images:
    print("IMG", im.name, tuple(im.size), im.packed_file is not None)
    im.scale(1000, 1000)   # forces a re-encode at export quality
    if im.name.endswith("_diff"):   # r7: the runtime fire light blows the scan albedo out to cream; pull the albedo down so the ring rocks read as the dark scan stone
        import numpy as np
        px = np.empty(len(im.pixels), dtype=np.float32); im.pixels.foreach_get(px)
        px = px.reshape(-1, 4); px[:, :3] *= 0.5
        # r8: the glowing tan rim is the central ground disc of the atlas (circle at ~ (500, 610) px from the top, r ~ 330): pull it down to dark pit stone
        w = 1000; yy, xx = np.mgrid[0:w, 0:w]; d = np.hypot(xx - 500, yy - (w - 610))
        m = np.clip((345 - d) / 40.0, 0.0, 1.0).reshape(-1)
        px[:, :3] *= (1.0 - 0.6 * m)[:, None]
        im.pixels.foreach_set(px.ravel()); im.update()
bpy.ops.export_scene.gltf(filepath=dst, export_format="GLB", export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7, export_draco_position_quantization=14, export_image_format="JPEG", export_jpeg_quality=80)
print("PIT_OK", os.path.getsize(dst))
