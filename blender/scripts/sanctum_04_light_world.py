"""Step 4: ONE hard sun shaft through the oculus, night-sky world + star dome, moon over the open court, niche accent, haze volume, Cycles settings."""
import sys, os, importlib
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
import math
from sanctum_lib import *

sc = bpy.context.scene
sc.render.engine = "CYCLES"
c = sc.cycles
c.samples = 128; c.use_denoising = True; c.preview_samples = 32
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1600, 900, 100
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"; prefs.get_devices()
    for d in prefs.devices: d.use = True
    c.device = "GPU"
except Exception as e:
    print("GPU setup skipped:", e)
vt = sc.view_settings
try: vt.view_transform = "AgX"
except TypeError as e: print("view transform:", e)
try: vt.look = "AgX - Medium High Contrast"
except TypeError: pass
vt.exposure = 0.6

# ---- sun: tilt 7 deg so the shaft lands on the plinth (oculus is offset to y=-1.5) ----
sd = bpy.data.lights.new("SUN_shaft", "SUN"); sd.energy = 10.0; sd.angle = math.radians(0.4); sd.color = (1.0, 0.86, 0.68)
sun = bpy.data.objects.new("SUN_shaft", sd); sc.collection.objects.link(sun)
sun.location = (0, -10, 30); sun.rotation_euler = (math.radians(7), 0, 0)

# ---- world: deep night, faint blue ----
w = bpy.data.worlds.new("night"); sc.world = w; w.use_nodes = True
bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
bg.inputs["Color"].default_value = (0.012, 0.022, 0.06, 1); bg.inputs["Strength"].default_value = 1.0

# ---- star dome (visible to camera only; not exported) ----
sky = cyl("SKY_dome", 180, -20, 160, segs=48)
me = sky.data
for p in me.polygons: p.use_smooth = True
sm = bpy.data.materials.new("mat_stars"); sm.use_nodes = True; nt = sm.node_tree; nt.nodes.clear()
out = nt.nodes.new("ShaderNodeOutputMaterial")
em = nt.nodes.new("ShaderNodeEmission")
tc = nt.nodes.new("ShaderNodeTexCoord"); vor = nt.nodes.new("ShaderNodeTexVoronoi"); vor.feature = "F1"
vor.inputs["Scale"].default_value = 0.35  # object coords are metres on a 180 m dome
mp = nt.nodes.new("ShaderNodeMapping")
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs["Vector"], vor.inputs["Vector"])
mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["From Min"].default_value = 0.0; mr.inputs["From Max"].default_value = 0.05
mr.inputs["To Min"].default_value = 25.0; mr.inputs["To Max"].default_value = 0.0; mr.clamp = True
nt.links.new(vor.outputs["Distance"], mr.inputs["Value"])
# keep only ~12% of cells: random per-cell value from the Voronoi colour
vsep = nt.nodes.new("ShaderNodeSeparateColor"); nt.links.new(vor.outputs["Color"], vsep.inputs["Color"])
gate = nt.nodes.new("ShaderNodeMath"); gate.operation = "GREATER_THAN"; gate.inputs[1].default_value = 0.88
nt.links.new(vsep.outputs["Red"], gate.inputs[0])
grad = nt.nodes.new("ShaderNodeTexGradient"); sep = nt.nodes.new("ShaderNodeSeparateXYZ")
nt.links.new(tc.outputs["Object"], sep.inputs["Vector"])
mr2 = nt.nodes.new("ShaderNodeMapRange"); mr2.inputs["From Min"].default_value = 0.0; mr2.inputs["From Max"].default_value = 120.0
mr2.inputs["To Min"].default_value = 0.0; mr2.inputs["To Max"].default_value = 1.0
nt.links.new(sep.outputs["Z"], mr2.inputs["Value"])
cr = nt.nodes.new("ShaderNodeValToRGB"); cr.color_ramp.elements[0].color = (0.04, 0.06, 0.12, 1); cr.color_ramp.elements[1].color = (0.003, 0.006, 0.02, 1)
nt.links.new(mr2.outputs["Result"], cr.inputs["Fac"])
add = nt.nodes.new("ShaderNodeMix"); add.data_type = "RGBA"; add.blend_type = "ADD"; add.inputs["Factor"].default_value = 1.0
nt.links.new(cr.outputs["Color"], add.inputs[6])
stars = nt.nodes.new("ShaderNodeMath"); stars.operation = "MULTIPLY"
nt.links.new(mr.outputs["Result"], stars.inputs[0]); nt.links.new(gate.outputs[0], stars.inputs[1])
nt.links.new(stars.outputs[0], add.inputs[7])
nt.links.new(add.outputs[2], em.inputs["Color"]); nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
sky.data.materials.append(sm)
sky.visible_shadow = False; sky.visible_glossy = False
# flip normals so inside faces are front-facing (not needed for Cycles, harmless)

# ---- faint moon in the sky dome, framed by the court's round opening from CAM_contact_sky ----
import bmesh as _bm
_b = _bm.new(); _bm.ops.create_uvsphere(_b, u_segments=48, v_segments=24, radius=3.0); _me = bpy.data.meshes.new("SKY_moon"); _b.to_mesh(_me); _b.free()
moon_ob = bpy.data.objects.new("SKY_moon", _me); sc.collection.objects.link(moon_ob); moon_ob.location = (5.0, -24.0, 140.0)
_mm = bpy.data.materials.new("mat_moon"); _mm.use_nodes = True; _mt = _mm.node_tree; _mt.nodes.clear()
_mo = _mt.nodes.new("ShaderNodeOutputMaterial"); _me2 = _mt.nodes.new("ShaderNodeEmission")
_me2.inputs["Color"].default_value = (0.82, 0.88, 1.0, 1)
# soft limb: emission falls off toward the disc edge (Layer Weight facing -> ramp -> strength)
_lw = _mt.nodes.new("ShaderNodeLayerWeight"); _lw.inputs["Blend"].default_value = 0.5
_rp = _mt.nodes.new("ShaderNodeValToRGB"); _rp.color_ramp.elements[0].position = 0.25; _rp.color_ramp.elements[1].position = 0.85   # Facing is 0 at disc centre, 1 at the limb
_rp.color_ramp.elements[0].color = (1, 1, 1, 1); _rp.color_ramp.elements[1].color = (0, 0, 0, 1)
_mt.links.new(_lw.outputs["Facing"], _rp.inputs["Fac"])
_sm = _mt.nodes.new("ShaderNodeMath"); _sm.operation = "MULTIPLY"; _sm.inputs[1].default_value = 3.0
_mt.links.new(_rp.outputs["Color"], _sm.inputs[0]); _mt.links.new(_sm.outputs[0], _me2.inputs["Strength"])
_mt.links.new(_me2.outputs["Emission"], _mo.inputs["Surface"]); _me.materials.append(_mm); moon_ob.visible_shadow = False
sc.render.dither_intensity = 2.0   # break up gradient banding in 8-bit output

# ---- moon: cool soft light over the open court; blocker plane stops the sun there (shadow-only, invisible to camera) ----
md = bpy.data.lights.new("MOON_court", "AREA"); md.energy = 1000; md.size = 12; md.color = (0.55, 0.68, 1.0)
moon = bpy.data.objects.new("MOON_court", md); sc.collection.objects.link(moon); moon.location = (0, -17.5, 16)
bd = bpy.data.lights.new("COURT_bounce", "AREA"); bd.energy = 110; bd.size = 10; bd.color = (0.55, 0.68, 1.0); bd.spread = math.radians(160)
bo = bpy.data.objects.new("COURT_bounce", bd); sc.collection.objects.link(bo); bo.location = (0, -17.5, 0.1); bo.rotation_euler = (math.pi, 0, 0)  # faces up
bo.visible_camera = False   # lights the roof underside / walls; never seen directly
blk = box("SUNBLOCK_court", -10, 10, -27, -9, 17, 17.05)
blk.visible_camera = False; blk.visible_glossy = False; blk.visible_diffuse = False  # still casts the sun's shadow

# ---- niche accent for the bust: warm, soft ----
# (the flat even NICHE_light fill was removed: key + rim spots only, so the niche edges fall into shadow)
# bust key (front-right, warm) + rim (behind-left, cool) so the head reads as a head from the wide shot
def spot(name, loc, tgt, watts, col, deg, blend=0.6):
    d = bpy.data.lights.new(name, "SPOT"); d.energy = watts; d.color = col; d.spot_size = math.radians(deg); d.spot_blend = blend; d.shadow_soft_size = 0.15
    o = bpy.data.objects.new(name, d); sc.collection.objects.link(o); o.location = loc; look_at(o, tgt); return o
# camera at -X looking +X: screen-left is +Y. Key: warm, upper left, tight cone (walls vignette to shadow). Rim: cool, behind the bust.
spot("BUST_key", (8.6, 1.5, 4.4), (11.0, 0, 1.5), 700, (1.0, 0.82, 0.62), 36, 1.0)
spot("BUST_rim", (12.1, -1.0, 3.1), (10.95, 0, 1.95), 200, (0.6, 0.76, 1.0), 14, 0.6)
_fd = bpy.data.lights.new("NICHE_fill", "AREA"); _fd.energy = 45; _fd.size = 3.0; _fd.color = (0.6, 0.7, 1.0)
_fo = bpy.data.objects.new("NICHE_fill", _fd); sc.collection.objects.link(_fo); _fo.location = (6.0, 0.5, 3.0); look_at(_fo, (11.0, 0, 1.6))

# ---- world volume scatter: very faint, so the whole sanctum carries air and the oculus beam reads in wide shots ----
# NOTE: a true World volume is infinite, so Cycles attenuates the sun through it to zero (the shaft vanishes).
# Same effect, bounded: one big air box around the whole sanctum.
air = box("VOL_air", -36, 14, -26, 35, 0.02, 13.4)
am = bpy.data.materials.new("mat_air"); am.use_nodes = True; an = am.node_tree; an.nodes.clear()
ao_ = an.nodes.new("ShaderNodeOutputMaterial"); asv = an.nodes.new("ShaderNodeVolumeScatter")
asv.inputs["Density"].default_value = 0.004; asv.inputs["Anisotropy"].default_value = 0.5
an.links.new(asv.outputs["Volume"], ao_.inputs["Volume"])
air.data.materials.append(am); air.visible_shadow = False
# ---- local haze volume in the rotunda (stills only; excluded from export): denser, so the shaft reads ----
haze = cyl("VOL_haze", 8.8, 0.05, 11.9, segs=48)
hm = bpy.data.materials.new("mat_haze"); hm.use_nodes = True; hn = hm.node_tree; hn.nodes.clear()
ho = hn.nodes.new("ShaderNodeOutputMaterial"); pv = hn.nodes.new("ShaderNodeVolumeScatter")
pv.inputs["Density"].default_value = 0.012; pv.inputs["Anisotropy"].default_value = 0.55
hn.links.new(pv.outputs["Volume"], ho.inputs["Volume"])
haze.data.materials.append(hm); haze.visible_shadow = False
# ---- project "stations": a narrow warm spot from the ceiling onto each monolith (slab geometry from step 2) ----
for i in range(8):
    side = -1 if i % 2 == 0 else 1
    y = 13.5 + (i // 2) * 5.0
    spot(f"SPOT_proj_{i}", (side * 1.3, y - 0.2, 9.2), (side * 2.5, y, 2.8), 3200, (1.0, 0.85, 0.68), 18, 0.6)

# ---- sky fill leaking through the ceiling slits (corridor + gallery): soft cool area lights sitting in each slit ----
def slit_light(name, loc, size):
    d = bpy.data.lights.new(name, "AREA"); d.shape = "RECTANGLE"; d.size, d.size_y = size
    d.energy = 280; d.color = (0.62, 0.74, 1.0); d.spread = math.radians(130)
    o = bpy.data.objects.new(name, d); sc.collection.objects.link(o); o.location = loc  # area lights point down (-Z) by default
for i, x in enumerate((-16.5, -21.5, -26.5, -31.5)): slit_light(f"SLIT_corr{i}", (x, 0, 7.4), (0.6, 4.8))
for i, y in enumerate((14, 19, 24, 29)): slit_light(f"SLIT_hall{i}", (0, y, 9.4), (7.6, 0.6))
print("LIGHT_OK")
