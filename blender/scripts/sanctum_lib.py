"""Shared helpers for the sanctum build. Coordinates: Blender Z-up, metres. glTF export converts to Y-up."""
import bpy, bmesh, math, os
from mathutils import Vector, Matrix

REPO = os.environ.get("SANCTUM_REPO") or "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum"
TEX = os.path.join(REPO, "blender", "textures")
SEG = 96

def reset_scene():
    bpy.ops.object.select_all(action="SELECT") if bpy.context.object else None
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.images, bpy.data.worlds):
        for d in list(coll):
            coll.remove(d)

def _link(name, bm):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob

def box(name, x0, x1, y0, y1, z0, z1):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 if v.co.x < 0 else x1
        v.co.y = y0 if v.co.y < 0 else y1
        v.co.z = z0 if v.co.z < 0 else z1
    return _link(name, bm)

def cyl(name, r, z0, z1, cx=0.0, cy=0.0, segs=SEG, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=(r if r2 is None else r2), depth=(z1 - z0))
    bmesh.ops.translate(bm, vec=(cx, cy, (z0 + z1) / 2), verts=bm.verts)
    return _link(name, bm)

def apply_mods(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    ev = ob.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev)
    old = ob.data
    ob.modifiers.clear()
    ob.data = me
    bpy.data.meshes.remove(old)

def boolean(ob, other, op="DIFFERENCE"):
    m = ob.modifiers.new("b", "BOOLEAN")
    m.operation = op; m.object = other; m.solver = "EXACT"
    apply_mods(ob)

def delete(*obs):
    for o in obs:
        if o and o.name in bpy.data.objects:
            bpy.data.objects.remove(o, do_unlink=True)

def get(name):
    return bpy.data.objects[name]

def look_at(ob, target):
    d = Vector(target) - ob.location
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()

def empty(name, loc, size=0.5, kind="PLAIN_AXES"):
    e = bpy.data.objects.new(name, None)
    e.empty_display_type = kind; e.empty_display_size = size; e.location = loc
    bpy.context.scene.collection.objects.link(e)
    return e
