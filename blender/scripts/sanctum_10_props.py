"""Step 10 (Round 3, direction 13:05): real props from public/assets/props (see .orchestrator/reports/r3-props-picks.md).
Import / place / scale / light only. Run after step 9. Light is fire + moon only: the warm ceiling spots and the bust key spot are removed.
ch0: armoured knight figure beside the fire pit, hearth logs + flame in the pit. ch1: skull + altar candles on the niche pedestal.
ch2: one job prop per role on a stone stand (greatsword, shield, helmet, battleaxe). ch4: braziers + tall candelabra in the court.
Not placed: the hooded woman and the cloaked female knight statue (not in public/assets/props yet)."""
import sys, os, importlib, math
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
from sanctum_lib import *
import mathutils

PROPS = os.path.join(REPO, "public", "assets", "props")
sc = bpy.context.scene
M_IRON = bpy.data.materials.get("mat_iron"); M_WAX = bpy.data.materials.get("mat_wax"); M_WALL = bpy.data.materials["mat_concrete_wall"]

def emissive(name, col, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Emission Color"].default_value = (*col, 1); b.inputs["Emission Strength"].default_value = strength
    return m
M_FLAME = emissive("mat_flame", (1.0, 0.45, 0.12), 6.0)

DEC = {"../scans/statue-hooded-mourner": 7000, "../scans/helmet-sallet-scan": 5000, "../scans/armour-cuirass-scan": 5000, "../scans/sword-arming-scan": 3500, "../scans/shield-round-scan": 4000}
# r6: (saturation, value) pulled down on the albedo so scans read as aged metal under warm light, not flat orange
TUNE = {"../scans/shield-round-scan": (0.22, 0.5), "../scans/helmet-sallet-scan": (0.5, 0.75), "../scans/armour-cuirass-scan": (0.5, 0.75), "../scans/sword-arming-scan": (0.6, 0.8)}
METAL = {"../scans/shield-round-scan": (0.8, 0.45)}
_cache = {}
def source(fn):
    if fn in _cache: return _cache[fn]
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(PROPS, fn + (".gltf" if fn.endswith("_1k") else ".glb")))
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == "MESH"]
    bpy.context.view_layer.update()   # importer leaves matrix_world stale; without this the baked-in scale is wrong
    for m in meshes:
        mw = m.matrix_world.copy()
        m.data.transform(mw); m.parent = None
        m.matrix_basis = mathutils.Matrix.Identity(4)
    bpy.context.view_layer.update()
    for o in new:
        if o.type != "MESH": bpy.data.objects.remove(o, do_unlink=True)
    for m in meshes:
        for c in list(m.users_collection): c.objects.unlink(m)
    if len(meshes) > 1:   # knight arrives as 2 meshes: link back, join, unlink again
        sc.collection.objects.link(meshes[0])
        for m in meshes[1:]: sc.collection.objects.link(m)
        for o in bpy.data.objects: o.select_set(False)
        for m in meshes: m.select_set(True)
        bpy.context.view_layer.objects.active = meshes[0]
        bpy.ops.object.join()
        for c in list(meshes[0].users_collection): c.objects.unlink(meshes[0])
    t = meshes[0]
    if len(t.data.polygons) > DEC.get(fn, 2500):   # scanned props arrive dense: decimate the template once
        sc.collection.objects.link(t)
        if t.data.shape_keys: t.shape_key_clear()   # scans can carry shape keys, which block the modifier
        for o in bpy.data.objects: o.select_set(False)
        t.select_set(True); bpy.context.view_layer.objects.active = t
        md = t.modifiers.new("dec", "DECIMATE"); md.ratio = DEC.get(fn, 2500) / len(t.data.polygons)
        bpy.ops.object.modifier_apply(modifier=md.name)
        for c in list(t.users_collection): c.objects.unlink(t)
    for mat in t.data.materials:   # flat PBR props: no env map in the bake, so tame metals
        if mat and mat.use_nodes:
            for b in (n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"):
                b.inputs["Metallic"].default_value = min(b.inputs["Metallic"].default_value, 0.25)
                b.inputs["Roughness"].default_value = max(b.inputs["Roughness"].default_value, 0.55)
    if fn in METAL:
        for mat in t.data.materials:
            if mat and mat.use_nodes:
                for b in (n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"):
                    b.inputs["Metallic"].default_value, b.inputs["Roughness"].default_value = METAL[fn]
    if fn in TUNE:
        for mat in t.data.materials:
            if not (mat and mat.use_nodes): continue
            nt = mat.node_tree
            for b in (n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"):
                lk = b.inputs["Base Color"].links
                if not lk: continue
                src = lk[0].from_socket
                hs = nt.nodes.new("ShaderNodeHueSaturation")
                hs.inputs["Saturation"].default_value, hs.inputs["Value"].default_value = TUNE[fn]
                nt.links.new(src, hs.inputs["Color"]); nt.links.new(hs.outputs["Color"], b.inputs["Base Color"])
    _cache[fn] = t
    return t

def bbox(m):
    pts = [mathutils.Vector(c) for c in m.bound_box]
    return ([min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)])

n = 0
def P(fn, x, y, z, height, yaw=0.0, mat=None, face=None, tag=None, rot=None, dyaw=0.0):
    """Place a prop scaled so its height (bbox z) is `height` m, bbox-centred on (x,y), lowest vertex on z. face=(tx,ty) turns its front (-Y) toward that point.
    rot=(rx,ry,rz) degrees pre-rotates the mesh first (e.g. ry=90 stands a lying sword upright)."""
    global n; n += 1
    t = source(fn)
    me = t.data.copy()
    if rot:
        me.transform(mathutils.Euler([math.radians(a) for a in rot], "XYZ").to_matrix().to_4x4())
    pts = [v.co.copy() for v in me.vertices]
    lo = [min(p[i] for p in pts) for i in range(3)]; hi = [max(p[i] for p in pts) for i in range(3)]
    s = height / (hi[2] - lo[2])
    if face is not None:
        yaw = math.degrees(math.atan2(face[0] - x, -(face[1] - y))) + dyaw
    ob = bpy.data.objects.new(f"RUIN_prop_{tag or fn}_{n}", me)
    sc.collection.objects.link(ob)
    ob.rotation_mode = "XYZ"; ob.scale = (s,) * 3; ob.rotation_euler = (0, 0, math.radians(yaw))
    c = mathutils.Vector(((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, lo[2]))
    off = mathutils.Matrix.Rotation(math.radians(yaw), 3, "Z") @ (c * s)
    ob.location = (x - off.x, y - off.y, z - off.z)
    if mat is not None:
        ob.data.materials.clear(); ob.data.materials.append(mat)
    return ob

def firelight(name, loc, watts, col=(1.0, 0.55, 0.24), r=0.2):
    d = bpy.data.lights.new(name, "POINT"); d.energy = watts; d.color = col; d.shadow_soft_size = r
    o = bpy.data.objects.new(name, d); sc.collection.objects.link(o); o.location = loc; return o

# ---- fire + moon only: drop the warm ceiling spots and the bust key spot ----
for o in [o for o in bpy.data.objects if o.type == "LIGHT" and (o.name.startswith("SPOT_") or o.name == "BUST_key")]:
    bpy.data.objects.remove(o, do_unlink=True)

# ---- ch0: the fire. Logs and flame sit in the pit (pit centre 0,0, floor of bowl ~z 0.5) ----
P("hearth-logs", 0, 0, 0.55, 0.32, 0)
# hooded mourner: the scan is a flat bas-relief slab (0.27 : 1 : 0.13 in w : h : d), so it stands as a carved stele,
# 1.5 m from the fire on the lit (camera-right) side, front turned to camera-left, warm light from below
P("../scans/statue-hooded-mourner", 1.35, -0.65, 0.0, 1.55, face=(-3.4, -3.8), dyaw=28, tag="scan_mourner")
firelight("FIRE_flame", (0, 0, 1.0), 120, (1.0, 0.5, 0.18), 0.3)
firelight("FIRE_mourner_low", (0.6, -0.45, 0.55), 100, (1.0, 0.45, 0.15), 0.15)

# ---- ch1: altar candles on the niche pedestal (cap top z=1.25, x 10.4..11.6) ----
CS = "../../../blender/props/wooden_candlestick/wooden_candlestick_1k"   # Poly Haven CC0 scan
for i, (x, y, z) in enumerate(((10.42, 0.45, 1.25), (10.42, -0.45, 1.25), (11.6, 0.5, 1.25), (11.6, -0.5, 1.25), (10.6, 0.42, 1.25))):
    P(CS, x, y, z, 0.26, i * 53, tag="candlestick")
for i, (x, y) in enumerate(((10.6, 0.42), (11.45, -0.45), (10.7, -0.42))):
    firelight(f"FIRE_niche{i}", (x, y, 1.65), 28, (1.0, 0.6, 0.28), 0.06)
# a candelabra in the niche corner
P("candelabra-tall", 9.7, 0.95, 0, 1.4, face=(5.4, 0), mat=M_IRON, tag="candelabra")
firelight("FIRE_niche_cand", (9.7, 0.95, 1.5), 60, (1.0, 0.58, 0.25), 0.1)
# the statue itself is a runtime model, so the light that reveals its face and folds ships inside sanctum.glb (#ffb070)
rt = bpy.data.lights.new("RT_ch1_candle", "POINT"); rt.energy = 3.2; rt.color = (1.0, 0.434, 0.162)
rto = bpy.data.objects.new("RT_ch1_candle", rt); sc.collection.objects.link(rto); rto.location = (9.7, 0.95, 1.65)

# ---- ch2: one job prop per role, on a stone stand to the right of each arch (camera at x+4.2 looks -X; +Y is screen right) ----
# (file, height m, pre-rotation): the sword stands upright (blade up) so it reads from eye level
JOB = (("../scans/shield-round-scan", 0.85, None), ("../scans/armour-cuirass-scan", 0.8, None), ("../scans/helmet-sallet-scan", 0.55, None), ("../scans/sword-arming-scan", 1.3, (0, 90, 0)))
for k, (x, (fn, h, rot)) in enumerate(zip((-14, -19, -24, -29), JOB)):
    sx, sy = x + 0.5, 1.5          # r7: 3 m ahead of the camera and hard right, clear of the text column (screen x > 1000 px)
    P("../ruins/altar-stone", sx, sy, 0, 0.75, 90, mat=bpy.data.materials.get("mat_brick") or M_WALL, tag="stand")
    P(fn, sx, sy, 0.75, h, face=(x + 4.2, 0), rot=rot, tag=f"scan_job{k}")
    firelight(f"FIRE_job{k}", (sx + 0.3, sy - 0.9, 1.7), 60, (1.0, 0.62, 0.3), 0.1)
# one wall sconce on the right-hand arch (wall at y ~ +2.4), a real torch prop + a warm practical
P("torch-wall", -12.9, 2.3, 2.2, 0.6, face=(-12.9, 0), tag="sconce")
firelight("FIRE_sconce", (-12.9, 1.9, 2.7), 90, (1.0, 0.6, 0.28), 0.08)

# ---- ch4: braziers + tall candelabra flank the court (camera at y=-14.6 looks up and away) ----
for i, sx in enumerate((-2.3, 2.3)):
    P("brazier-fire-basket", sx, -16.0, 0, 0.55, 0, mat=M_IRON, tag="brazier")
    firelight(f"FIRE_court{i}", (sx, -16.0, 1.0), 110, (1.0, 0.5, 0.2), 0.2)
    P("candelabra-tall", sx * 1.6, -15.2, 0, 1.5, face=(0, -17.5), mat=M_IRON, tag="candelabra")
    firelight(f"FIRE_courtcand{i}", (sx * 1.6, -15.2, 1.6), 30, (1.0, 0.58, 0.25), 0.1)

for t in _cache.values():
    for c in list(t.users_collection): c.objects.unlink(t)
    bpy.data.objects.remove(t, do_unlink=True)
print("PROPS10_OK", n, "props")
