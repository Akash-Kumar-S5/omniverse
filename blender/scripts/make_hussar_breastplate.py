"""R30 ch2: Cleveland Museum of Art 1916.1521 'Breastplate From Hussar's Cuirass' (Sketchfab, CC0, see CREDITS.md), prepared for runtime loading.
Joined, decimated to ~50k tris, centred on x/y, base on z=0 (glTF y=0), scan metres kept (0.38 x 0.20 x 0.44 m), 1K textures, Draco.
  Blender -b -P blender/scripts/make_hussar_breastplate.py  ->  public/assets/scans/armour-breastplate-scan.glb"""
import bpy, bmesh, os, mathutils
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
SRC = os.path.join(REPO, "blender", "props", "hussar-breastplate", "3056e857cf244a3fb651f9d07a66c5a9.glb")
OUT = os.path.join(REPO, "public", "assets", "scans", "armour-breastplate-scan.glb")
TARGET = int(os.environ.get("TARGET_TRIS", "50000"))
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
bpy.context.view_layer.update()
meshes = [o for o in bpy.data.objects if o.type == "MESH"]
for o in meshes:
    o.data.transform(o.matrix_world); o.parent = None; o.matrix_basis = mathutils.Matrix.Identity(4)
for o in [o for o in bpy.data.objects if o.type != "MESH"]: bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.object.select_all(action="DESELECT")
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
if ob.data.shape_keys: ob.shape_key_clear()
bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
n = len(ob.data.polygons)
if n > TARGET:
    m = ob.modifiers.new("dec", "DECIMATE"); m.decimate_type = "COLLAPSE"; m.ratio = TARGET / n; m.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=m.name)
print("HB final faces", len(ob.data.polygons))
pts = [v.co for v in ob.data.vertices]
lo = [min(p[i] for p in pts) for i in range(3)]; hi = [max(p[i] for p in pts) for i in range(3)]
for v in ob.data.vertices:
    v.co = mathutils.Vector((v.co.x - (lo[0] + hi[0]) / 2, v.co.y - (lo[1] + hi[1]) / 2, v.co.z - lo[2]))
print("HB size", [round(hi[i] - lo[i], 3) for i in range(3)])
bpy.ops.object.select_all(action="DESELECT"); ob.select_set(True); bpy.context.view_layer.objects.active = ob
bpy.ops.export_scene.gltf(filepath=OUT, use_selection=True, export_format="GLB", export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7, export_draco_position_quantization=14, export_image_format="JPEG", export_jpeg_quality=82)
print("HB exported", os.path.getsize(OUT))
