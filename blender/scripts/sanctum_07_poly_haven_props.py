"""Step 7: Poly Haven CC0 props (REUSE-FIRST). Source glbs live in blender/props/ (gitignored, ~33 MB; re-fetch with the blender MCP
import_asset tool: polyhaven models boulder_01, bronze_whale_statue; or from polyhaven.com/a/<id>).
 - boulder_01 (Rico Cilliers, CC0): 4 rubble boulders at the corridor mouth/base.
 - bronze_whale_statue (Tina, CC0): on a low block at the far end of the projects gallery."""
import sys, os, importlib, math, random
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
from sanctum_lib import *
import mathutils

PROPS = os.path.join(REPO, "blender", "props")

def load_glb(fn):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(PROPS, fn))
    new = [o for o in bpy.data.objects if o not in before]
    return [o for o in new if o.type == "MESH"], [o for o in new if o.type != "MESH"]

def drop_empties(es):
    for e in es: bpy.data.objects.remove(e, do_unlink=True)

def ground(ob, x, y, z0, yaw, scale):
    """Uniform scale about the mesh's own bbox, centre it at (x,y) and rest its lowest vertex on z0."""
    me = ob.data
    pts = [mathutils.Vector(c) for c in ob.bound_box]
    lo = mathutils.Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = mathutils.Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    ob.parent = None; ob.rotation_mode = "XYZ"
    ob.scale = (scale, scale, scale); ob.rotation_euler = (0, 0, math.radians(yaw))
    c = (lo + hi) / 2
    rot = mathutils.Matrix.Rotation(math.radians(yaw), 3, "Z")
    off = rot @ mathutils.Vector((c.x * scale, c.y * scale, lo.z * scale))
    ob.location = (x - off.x, y - off.y, z0 - off.z)

random.seed(7)
# --- rubble: boulders at the corridor mouth, hugging the walls ---
spots = [(-11.2, 2.2, 205, 0.9), (-12.6, -2.3, 40, 1.15), (-17.9, 2.35, 120, 0.8), (-23.4, -2.4, 300, 1.0)]
for i, (x, y, yaw, sc) in enumerate(spots):
    meshes, extra = load_glb("boulder_01.glb")
    drop_empties(extra)
    m = meshes[0]; m.name = f"PROP_boulder{i}"
    ground(m, x, y, 0.0, yaw, sc)

# --- bronze statue on a low block at the far end of the gallery ---
blk = box("PROP_statue_block", -0.9, 0.9, 31.0, 32.6, 0, 0.5)
meshes, extra = load_glb("bronze_whale_statue.glb"); drop_empties(extra)
w = meshes[0]; w.name = "PROP_bronze_whale"
ground(w, 0.0, 31.8, 0.5, 180, 1.2)
print("PROPS7_OK")
