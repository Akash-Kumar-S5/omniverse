"""R13: ONE complete scanned fire vessel for ch0/ch4: Poly Haven barrel_stove (CC0), an open rusted iron drum.
Widened 1.35x (0.80 m across, 0.81 m tall), albedo pulled down to dark rust, Draco-compressed.
  Blender -b -P blender/scripts/make_fire_barrel.py  ->  public/assets/ruins/fire_barrel.draco.glb"""
import bpy, os
import numpy as np
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
src = os.path.join(REPO, "blender", "props", "barrel_stove", "barrel_stove_1k.gltf")
dst = os.path.join(REPO, "public", "assets", "ruins", "fire_barrel.draco.glb")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
ob = next(o for o in bpy.data.objects if o.type == "MESH")
bpy.context.view_layer.objects.active = ob
for o in bpy.data.objects: o.select_set(o is ob)
ob.scale = (ob.scale.x * 1.35, ob.scale.y * 1.35, ob.scale.z * 0.95)   # glTF y (height) is Blender Z after import
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
for im in bpy.data.images:
    if im.name.endswith("_diff"):
        px = np.empty(len(im.pixels), dtype=np.float32); im.pixels.foreach_get(px)
        px = px.reshape(-1, 4); px[:, :3] *= 0.55
        im.pixels.foreach_set(px.ravel()); im.update()
bpy.ops.export_scene.gltf(filepath=dst, export_format="GLB", export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7, export_draco_position_quantization=14, export_image_format="JPEG", export_jpeg_quality=82)
print("BARREL_OK", os.path.getsize(dst))
