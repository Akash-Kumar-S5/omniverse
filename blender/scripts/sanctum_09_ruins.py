"""Step 9 (Round 3, "Ember & Ash"): turn the concrete sanctum into a ruined gothic hall from READY-MADE CC0 GLBs only.
Import / place / scale / light. No new modelling. Run after steps 1-5 and 7 (build_sanctum.py does).
Sources (public/assets/ruins, see CREDITS.md): Quaternius Ultimate Modular Ruins (arch-gothic, wall-hole,
floor-squares, column-round, bricks), Kenney Graveyard Kit (altar-stone, fire-basket, candle-multiple), stone_fire_pit.
Stone pieces take the existing Poly Haven wall/floor materials (box-projected); props keep their own materials.
Names: RUIN_* join the architecture mesh, FLOORT_* join the floor mesh, FIRE_* are warm point lights (never exported)."""
import sys, os, importlib, math, random
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
from sanctum_lib import *
import mathutils

RUINS = os.path.join(REPO, "public", "assets", "ruins")
sc = bpy.context.scene
M_WALL = bpy.data.materials["mat_concrete_wall"]
M_FLOOR = bpy.data.materials["mat_floor_wet"]

def flat_mat(name, col, metal=0.0, rough=0.7, emit=None, estr=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Metallic"].default_value = metal; b.inputs["Roughness"].default_value = rough
    if emit: b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = estr
    return m
# the Kenney kit glbs reference Textures/colormap.png, which is not in the repo (renders magenta): give them plain materials
M_IRON = flat_mat("mat_iron", (0.05, 0.047, 0.045), 0.7, 0.45)
M_WAX = flat_mat("mat_wax", (0.80, 0.72, 0.56), 0.0, 0.55, (1.0, 0.62, 0.28), 2.5)
random.seed(11)

_cache = {}
def source(fn):
    """Import a glb once, bake its transform into the mesh, keep the object out of the scene as a template."""
    if fn in _cache: return _cache[fn]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(RUINS, fn + ".glb"))
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == "MESH"]
    assert len(meshes) == 1, (fn, len(meshes))
    m = meshes[0]
    m.data.transform(m.matrix_world); m.parent = None; m.matrix_world = mathutils.Matrix.Identity(4)
    for o in new:
        if o is not m: bpy.data.objects.remove(o, do_unlink=True)
    for c in list(m.users_collection): c.objects.unlink(m)
    _cache[fn] = m
    return m

def bbox(m):
    pts = [mathutils.Vector(c) for c in m.bound_box]
    return ([min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)])

def place(fn, name, x, y, z, yaw=0.0, scale=1.0, mat=None, sink=0.0):
    """Instance a template: footprint centred on (x,y), lowest vertex at z (minus sink, in template units * scale)."""
    t = source(fn)
    lo, hi = bbox(t)
    ob = bpy.data.objects.new(name, t.data.copy())
    sc.collection.objects.link(ob)
    ob.rotation_mode = "XYZ"; ob.scale = (scale,) * 3; ob.rotation_euler = (0, 0, math.radians(yaw))
    c = mathutils.Vector(((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, lo[2]))
    off = mathutils.Matrix.Rotation(math.radians(yaw), 3, "Z") @ (c * scale)
    ob.location = (x - off.x, y - off.y, z - off.z - sink * scale)
    if mat is not None:
        ob.data.materials.clear(); ob.data.materials.append(mat)
    return ob

def firelight(name, loc, watts, col=(1.0, 0.55, 0.24), r=0.25):
    d = bpy.data.lights.new(name, "POINT"); d.energy = watts; d.color = col; d.shadow_soft_size = r
    o = bpy.data.objects.new(name, d); sc.collection.objects.link(o); o.location = loc; return o

# ---- 0. out with the brutalist portal frames, in with gothic arches ----
for o in [o for o in bpy.data.objects if o.name.startswith("portal")]:
    bpy.data.objects.remove(o, do_unlink=True)

n = 0
def R(fn, x, y, z, yaw=0.0, s=1.0, mat="wall", sink=0.0):
    global n; n += 1
    m = {"wall": M_WALL, "brick": bpy.data.materials.get("mat_brick"), "iron": M_IRON, "wax": M_WAX}.get(mat)   # None keeps the glb own material (fire pit)
    return place(fn, f"RUIN_{fn}_{n}", x, y, z, yaw, s, m, sink)

# ---- 1. arches frame every chapter ----
for x in (-14, -19, -24, -29):                    # experience: one pointed arch per role (spans Y -> yaw 90)
    R("ruins-arch-gothic", x, 0, 0, 90, 1.9)
R("ruins-arch-gothic", -9.2, 0, 0, 90, 1.9)       # corridor mouth
for y in (9.2, 14.4, 19.4, 24.4, 29.4):           # projects: hall mouth + between the slab pairs (spans X)
    R("ruins-arch-gothic", 0, y, 0, 0, 2.3)
# r7: the niche-mouth arch pier read as a black box behind the statue, removed       # about: niche mouth
R("ruins-arch-gothic", 0, -10.0, 0, 0, 2.0)       # contact: passage arch
R("ruins-arch-gothic", 0, -22.2, 0, 0, 2.0)       # contact: far arch framing the open sky
R("ruins-wall-hole", -5.2, -12.4, 0, 0, 1.6)
R("ruins-wall-hole", 5.2, -12.4, 0, 180, 1.6)

# ---- 2. rotunda columns (two broken) around the central fire ----
for a, fn, s in ((45, "ruins-column-round", 1.4), (135, "ruins-column-round-short", 1.5),
                 (225, "ruins-column-round", 1.4), (315, "ruins-column-round-short", 1.5)):
    R(fn, 6.9 * math.cos(math.radians(a)), 6.9 * math.sin(math.radians(a)), 0, a, s)

# ---- 3. rubble: brick heaps at the arch feet ----
for x, y, yaw, s in ((-13.3, 2.2, 20, 1.6), (-18.6, -2.3, 140, 1.5), (-23.5, 2.1, 260, 1.7),
                     (-3.1, 14.0, 60, 1.6), (3.0, 19.8, 200, 1.5), (-3.0, 25.0, 310, 1.7),
                     (5.0, -3.6, 90, 1.5), (-5.8, 4.4, 10, 1.6), (0.8, -22.6, 120, 1.5)):
    R("ruins-bricks", x, y, 0, yaw, s)

# ---- 4. the fire pit on the central plinth (plinth_top r=1.9, z=0.42) ----

# ---- 5. altar in the about niche, candles on it and on the bust pedestal ----
# r6: the untextured box altar in the about niche is gone (candles stand on the textured pedestal)
CANDLES = [(10.42, 0.45, 1.25), (10.42, -0.45, 1.25),
           (11.6, 0.5, 1.25), (11.6, -0.5, 1.25)]
for i, (x, y, z) in enumerate(CANDLES):
    firelight(f"FIRE_candle{i}", (x, y, z + 0.3), 14, (1.0, 0.62, 0.3), 0.05)

# ---- 6. fire baskets along the corridor and hall (practical warm lights) ----
BASKETS = []
for x in (-11.5, -16.5, -21.5, -26.5):
    BASKETS += [(x, 2.35), (x, -2.35)]
for y in (11.5, 21.5):
    BASKETS += [(-3.9, y), (3.9, y)]
for i, (x, y) in enumerate(BASKETS):
    R("fire-basket", x, y, 0, random.randint(0, 359), 2.4, mat="iron")
    firelight(f"FIRE_basket{i}", (x, y, 0.75), 70, (1.0, 0.5, 0.2), 0.2)

# ---- 7. THE fire: warm key over the pit on cold stone (runtime adds the flicker) ----
firelight("FIRE_hearth", (0, 0, 1.35), 150, (1.0, 0.48, 0.18), 0.35)
firelight("FIRE_hearth_low", (0, 0, 0.8), 50, (1.0, 0.42, 0.14), 0.3)

# ---- 8. ruined paving: floor-squares in the rotunda + a runner down corridor, hall and court (join the floor mesh) ----
import bmesh
def tile(x, y, yaw):
    t = place("ruins-floor-squares", f"FLOORT_{int(x*10)}_{int(y*10)}", x, y, 0.0, yaw, 1.0, M_FLOOR)
    t.location.z += 0.015
    bm = bmesh.new(); bm.from_mesh(t.data)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.normal.z < -0.5], context="FACES")
    bm.to_mesh(t.data); bm.free()
tiles = 0
for ix in range(-4, 5):
    for iy in range(-4, 5):
        x, y = ix * 2.0, iy * 2.0
        r = math.hypot(x, y)
        continue   # r6: solid flagstones round the hearth, ruined further out
        tile(x, y, random.choice((0, 90, 180, 270))); tiles += 1
print("tiles", tiles)

# ---- 9. cold moonlight shaft kept; warm fire on top ----
sun = bpy.data.lights.get("SUN_shaft")
if sun: sun.color = (0.72, 0.82, 1.0)

for t in _cache.values(): bpy.data.objects.remove(t, do_unlink=True)
print("RUINS_OK", n, "pieces,", len(BASKETS), "baskets")
