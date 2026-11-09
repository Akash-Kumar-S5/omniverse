"""R25 ch2: the wooden armour stand (Sketchfab 'Armor Stand' by AspectStudios, CC-BY, see CREDITS.md) prepared for runtime loading.
Centred on x/z, feet on y=0, scan units kept (3.0 wide, 4.56 tall); textures 512 px; Draco.
  Blender -b -P blender/scripts/make_armour_stand.py  ->  public/assets/scans/armour-stand-scan.glb"""
import bpy, os, mathutils
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
SRC = os.path.join(REPO, "blender", "props", "armour-stand", "ebde5d6ad411472db69a95a79e5888af.glb")
OUT = os.path.join(REPO, "public", "assets", "scans", "armour-stand-scan.glb")
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
bpy.context.view_layer.update()
meshes = [o for o in bpy.data.objects if o.type == "MESH"]
for o in meshes:
    o.data.transform(o.matrix_world); o.parent = None; o.matrix_basis = mathutils.Matrix.Identity(4)
for o in [o for o in bpy.data.objects if o.type != "MESH"]: bpy.data.objects.remove(o, do_unlink=True)
pts = [v.co for o in meshes for v in o.data.vertices]
lo = [min(p[i] for p in pts) for i in range(3)]; hi = [max(p[i] for p in pts) for i in range(3)]
for o in meshes:
    for v in o.data.vertices:
        v.co = mathutils.Vector((v.co.x - (lo[0] + hi[0]) / 2, v.co.y - (lo[1] + hi[1]) / 2, v.co.z - lo[2]))
print("STAND size", [round(hi[i] - lo[i], 3) for i in range(3)])
# r29: the upper crossbar arms poked through the plate as a "floating strap tab"; keep the post, the legs and the feet only
import bmesh
for o in meshes:
    bm = bmesh.new(); bm.from_mesh(o.data)
    kill = [f for f in bm.faces if any(v.co.z > 1.9 and (v.co.x ** 2 + v.co.y ** 2) ** 0.5 > 0.3 for v in f.verts)]
    bmesh.ops.delete(bm, geom=kill, context="FACES")
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
    bm.to_mesh(o.data); bm.free()
for im in bpy.data.images:
    if im.size[0] > 512: im.scale(512, 512)
bpy.ops.object.select_all(action="DESELECT")
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
bpy.ops.export_scene.gltf(filepath=OUT, use_selection=True, export_format="GLB", export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7, export_draco_position_quantization=14, export_image_format="JPEG", export_jpeg_quality=80)
print("STAND exported", os.path.getsize(OUT))
