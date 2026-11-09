"""R22: two Sketchfab scans (CC-BY, see CREDITS.md) prepared for runtime loading.
 - effigy-knight-scan.glb: the recumbent effigy on its slab; back wall and carpet cut away, ~1.7 m long, base on y=0, front toward +Z, <=40k tris, 1K texture.
 - ruin-church-scan.glb:   the ruined church joined into one mesh, ~50k tris, 512 px texture, base on y=0, centred.
  Blender -b -P blender/scripts/make_effigy_church.py  ->  public/assets/scans/*.glb"""
import bpy, bmesh, os, math, mathutils
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
OUT = os.path.join(REPO, "public", "assets", "scans")
SRC = {"effigy": os.path.join(REPO, "blender", "props", "effigy-knight", "9a5f5ceec9eb48b0b2f7cbcfdf6f5197.glb"),
       "church": os.path.join(REPO, "blender", "props", "ruin-church", "85968ae9da6941bea41614cedfcd3e11.glb")}

def load(path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=path)
    bpy.context.view_layer.update()
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    for o in meshes:
        me = o.data; me.transform(o.matrix_world); o.parent = None; o.matrix_basis = mathutils.Matrix.Identity(4)
    for o in [o for o in bpy.data.objects if o.type != "MESH"]: bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes: o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1: bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active
    if ob.data.shape_keys: ob.shape_key_clear()
    return ob

def decimate(ob, target):
    bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(ob.data); bm.free()
    n = len(ob.data.polygons)
    if n > target:
        m = ob.modifiers.new("dec", "DECIMATE"); m.decimate_type = "COLLAPSE"; m.ratio = target / n; m.use_collapse_triangulate = True
        bpy.context.view_layer.objects.active = ob
        bpy.ops.object.modifier_apply(modifier=m.name)
    return len(ob.data.polygons)

def place(ob, length_axis_target, axis=0):
    """uniform scale so the extent along `axis` is length_axis_target; centre x/y; base on z=0"""
    pts = [v.co for v in ob.data.vertices]
    lo = [min(p[i] for p in pts) for i in range(3)]; hi = [max(p[i] for p in pts) for i in range(3)]
    s = length_axis_target / (hi[axis] - lo[axis])
    for v in ob.data.vertices:
        v.co = mathutils.Vector(((v.co.x - (lo[0] + hi[0]) / 2) * s, (v.co.y - (lo[1] + hi[1]) / 2) * s, (v.co.z - lo[2]) * s))
    return s

def export(name):
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name), export_format="GLB", export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7, export_draco_position_quantization=12, export_image_format="JPEG", export_jpeg_quality=80,
        export_apply=True)
    print("EXPORTED", name, os.path.getsize(os.path.join(OUT, name)))

# ---------- effigy ----------
ob = load(SRC["effigy"]); ob.name = "effigy"
bm = bmesh.new(); bm.from_mesh(ob.data)
for co, no, clear in (((0, 1.05, 0), (0, 1, 0), "outer"), ((0, -1.55, 0), (0, -1, 0), "outer"), ((0, 0, 1.05), (0, 0, 1), "outer")):
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=co, plane_no=no, clear_outer=True)
bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if e.is_boundary], sides=0)
bm.to_mesh(ob.data); bm.free()
print("EFFIGY cut faces", len(ob.data.polygons))
n = decimate(ob, 36000)
s = place(ob, 1.7, axis=0)
bpy.ops.object.shade_smooth() if False else None
print("EFFIGY final faces", n, "scale", round(s, 4))
export("effigy-knight-scan.glb")

# ---------- church ----------
ob = load(SRC["church"]); ob.name = "church"
n = decimate(ob, 50000)
place(ob, 35.0, axis=0)
for im in bpy.data.images:
    if im.size[0] > 512: im.scale(512, 512)
print("CHURCH final faces", n)
export("ruin-church-scan.glb")
