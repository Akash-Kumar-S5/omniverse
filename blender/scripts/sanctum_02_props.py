"""Step 2: props — central plinth, bust pedestal + bust proxy, corridor portal frames, gallery monolith slabs."""
import sys, os, importlib
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
import math
from sanctum_lib import *

# central plinth under the shaft: two steps
cyl("plinth_step", 2.7, 0, 0.14)
cyl("plinth_top", 1.9, 0, 0.42)

# bust pedestal in the E niche (proxy bust is NOT exported; real bust is marble_bust_01.glb)
box("bust_pedestal", 10.5, 11.5, -0.5, 0.5, 0, 1.15)
box("bust_pedestal_cap", 10.4, 11.6, -0.6, 0.6, 1.15, 1.25)
# REUSE: the repo's own marble_bust_01.glb stands in as the bust (preview only; BUST_* objects are excluded from the sanctum export)
before = set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=os.path.join(REPO, "public", "assets", "models", "marble_bust_01.glb"))
new = [o for o in bpy.data.objects if o not in before]
roots = [o for o in new if o.parent is None]
bust = bpy.data.objects.new("BUST_PROXY", None); bpy.context.scene.collection.objects.link(bust)
for o in roots: o.parent = bust
bpy.context.view_layer.update()
meshes = [o for o in new if o.type == "MESH"]
import mathutils
pts = [o.matrix_world @ mathutils.Vector(c) for o in meshes for c in o.bound_box]
lo = mathutils.Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
hi = mathutils.Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
h = hi.z - lo.z
k = 0.85 / h
bust.scale = (k, k, k)
bust.rotation_euler = (0, 0, math.radians(BUST_YAW if "BUST_YAW" in globals() else 90))
bust.location = (11.0 - k * (lo.x + hi.x) / 2, 0 - k * (lo.y + hi.y) / 2, 1.25 - k * lo.z)
for o in meshes: o.name = "BUST_" + o.name

# corridor portal frames (one per role): pillars + lintel
for i, x in enumerate((-14, -19, -24, -29)):
    box(f"portal{i}_l", x - 0.5, x + 0.5, -3.0, -2.0, 0, 7.5)
    box(f"portal{i}_r", x - 0.5, x + 0.5, 2.0, 3.0, 0, 7.5)
    box(f"portal{i}_top", x - 0.5, x + 0.5, -3.0, 3.0, 5.9, 7.5)

# gallery monolith slabs (projects 0..7), alternating sides, angled slightly toward the aisle
for i in range(8):
    side = -1 if i % 2 == 0 else 1
    y = 13.5 + (i // 2) * 5.0 + (0.0 if side < 0 else 0.0)
    s = box(f"slab{i}", -0.85, 0.85, -0.3, 0.3, 0, 5.6)
    s.location = (side * 2.7, y, 0)
    s.rotation_euler = (0, 0, math.radians(-side * 14))
print("PROPS_OK")
