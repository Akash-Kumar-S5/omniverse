"""Post-pass for sanctum-lite.glb when the baked scan textures push it past 1 MB: re-open the GLB, halve the props/pedestal
textures, re-export with Draco (same names, extras and quantisation as sanctum_08). Headless:
  Blender -b -P blender/scripts/shrink_lite.py"""
import bpy, os
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
p = os.path.join(REPO, "public", "assets", "models", "sanctum-lite.glb")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=p)
LIM = {"props": 512, "ped": 256, "bust_pedestal": 256}
for im in bpy.data.images:
    key = next((k for k in LIM if k in im.name.lower()), None)
    print("IMG", im.name, tuple(im.size))
    if key: im.scale(LIM[key], LIM[key])
for o in bpy.data.objects: o.select_set(True)
bpy.ops.export_scene.gltf(filepath=p, export_format="GLB", use_selection=True, export_apply=False,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14, export_draco_normal_quantization=8, export_draco_texcoord_quantization=12,
    export_lights=False, export_cameras=False, export_extras=True, export_yup=True, export_image_format="JPEG", export_jpeg_quality=80,
    export_normals=False, export_texcoords=True, export_materials="EXPORT")
print("LITE_OK", os.path.getsize(p))
