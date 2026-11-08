"""Step 3: PBR materials from blender/textures (CC0, Poly Haven), box-projected so no UVs are needed for authoring."""
import sys, os, importlib
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
from sanctum_lib import *

def _img(nt, fname, nc, loc):
    n = nt.nodes.new("ShaderNodeTexImage")
    p = os.path.join(TEX, fname)
    if os.path.exists(p): n.image = bpy.data.images.load(p, check_existing=True)
    else:  # no AO map shipped for this set (cobblestone_floor_13): flat white
        n.image = bpy.data.images.get("white_ao") or bpy.data.images.new("white_ao", 4, 4); n.image.pixels = [1.0] * 64
    n.image.colorspace_settings.name = "Non-Color" if nc else "sRGB"
    n.projection = "BOX"; n.projection_blend = 0.25; n.location = loc
    return n

def pbr(name, prefix, tile_m, tint=(1, 1, 1), rough_mul=1.0, ao_mix=0.8, metallic=0.0, flat=0.6, normal=0.8):
    mat = bpy.data.materials.new(name); mat.use_nodes = True
    nt = mat.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); out.location = (900, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled"); bsdf.location = (600, 0)
    tc = nt.nodes.new("ShaderNodeTexCoord"); tc.location = (-900, 0)
    mp = nt.nodes.new("ShaderNodeMapping"); mp.location = (-700, 0)
    s = 1.0 / tile_m; mp.inputs["Scale"].default_value = (s, s, s)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    d = _img(nt, f"{prefix}_diff_2k.jpg", False, (-400, 300))
    r = _img(nt, f"{prefix}_rough_2k.jpg", True, (-400, 0))
    nn = _img(nt, f"{prefix}_nor_gl_2k.jpg", True, (-400, -300))
    ao = _img(nt, f"{prefix}_ao_2k.jpg", True, (-400, 600))
    for t in (d, r, nn, ao): nt.links.new(mp.outputs["Vector"], t.inputs["Vector"])
    # anti-tiling: sample diffuse/rough/AO a second time at a different scale + rotation and blend with a low-frequency noise mask
    mp2 = nt.nodes.new("ShaderNodeMapping"); mp2.location = (-700, -500)
    s2 = s * 0.41; mp2.inputs["Scale"].default_value = (s2, s2, s2); mp2.inputs["Rotation"].default_value = (0.35, 0.28, 0.9)
    mp2.inputs["Location"].default_value = (0.37, 0.61, 0.19)
    nt.links.new(tc.outputs["Object"], mp2.inputs["Vector"])
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.location = (-700, -800); nz.inputs["Scale"].default_value = 0.35; nz.inputs["Detail"].default_value = 3
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.location = (-500, -800)
    ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[1].position = 0.65
    nt.links.new(nz.outputs["Fac"], ramp.inputs["Fac"])
    def _aa(a, nc, fname, loc):
        b = _img(nt, fname, nc, (loc[0], loc[1] - 250)); nt.links.new(mp2.outputs["Vector"], b.inputs["Vector"])
        m = nt.nodes.new("ShaderNodeMix"); m.data_type = "RGBA"; m.location = (loc[0] + 200, loc[1])
        nt.links.new(ramp.outputs["Color"], m.inputs["Factor"])
        nt.links.new(a.outputs["Color"], m.inputs[6]); nt.links.new(b.outputs["Color"], m.inputs[7]); return m
    d_m = _aa(d, False, f"{prefix}_diff_2k.jpg", (-150, 800)); r_m = _aa(r, True, f"{prefix}_rough_2k.jpg", (-150, 100))
    ao_m = _aa(ao, True, f"{prefix}_ao_2k.jpg", (-150, 1300))
    class _O:  # adapter so the rest of the function can keep calling .outputs["Color"]
        def __init__(self, m): self.outputs = {"Color": m.outputs[2]}
    d, r, ao = _O(d_m), _O(r_m), _O(ao_m)
    # colour = diffuse * tint * mix(1, ao, ao_mix)
    mixao = nt.nodes.new("ShaderNodeMix"); mixao.data_type = "RGBA"; mixao.blend_type = "MULTIPLY"; mixao.location = (-100, 400)
    mixao.inputs["Factor"].default_value = ao_mix
    # flatten diffuse contrast: blend toward a mid grey so the rust/stain blotches stop reading
    fl = nt.nodes.new("ShaderNodeMix"); fl.data_type = "RGBA"; fl.blend_type = "MIX"; fl.location = (-250, 400)
    fl.inputs["Factor"].default_value = flat; fl.inputs[7].default_value = (0.42, 0.42, 0.42, 1)
    nt.links.new(d.outputs["Color"], fl.inputs[6])
    nt.links.new(fl.outputs[2], mixao.inputs[6]); nt.links.new(ao.outputs["Color"], mixao.inputs[7])
    tnt = nt.nodes.new("ShaderNodeMix"); tnt.data_type = "RGBA"; tnt.blend_type = "MULTIPLY"; tnt.location = (150, 400)
    tnt.inputs["Factor"].default_value = 1.0; tnt.inputs[7].default_value = (*tint, 1)
    nt.links.new(mixao.outputs[2], tnt.inputs[6]); nt.links.new(tnt.outputs[2], bsdf.inputs["Base Color"])
    rm = nt.nodes.new("ShaderNodeMath"); rm.operation = "MULTIPLY"; rm.location = (150, 0)
    rm.inputs[1].default_value = rough_mul; rm.use_clamp = True
    nt.links.new(r.outputs["Color"], rm.inputs[0]); nt.links.new(rm.outputs[0], bsdf.inputs["Roughness"])
    nm = nt.nodes.new("ShaderNodeNormalMap"); nm.location = (150, -300); nm.inputs["Strength"].default_value = normal
    nt.links.new(nn.outputs["Color"], nm.inputs["Color"]); nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Metallic"].default_value = metallic
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

# tile sizes ~5x smaller than the first pass, diffuse contrast flattened (flat=0.6-0.75) so no rust-blotch read
wall = pbr("mat_concrete_wall", "concrete_wall_003", 0.7, tint=(0.52, 0.55, 0.62), flat=0.7)
slab = pbr("mat_monolith", "concrete_wall_003", 1.1, tint=(0.30, 0.32, 0.37), rough_mul=0.8, flat=0.8, normal=0.4)  # larger tile + softer relief: no rocky/dirt read under the warm spots
floor = pbr("mat_floor_wet", "cobblestone_floor_13", 1.1, tint=(0.34, 0.31, 0.28), rough_mul=0.95, flat=0.25, normal=1.0)   # Poly Haven cobblestone_floor_13, box-projected + anti-tile blend
brick = pbr("mat_brick", "castle_brick_broken_06", 1.6, tint=(0.46, 0.45, 0.45), rough_mul=1.0, flat=0.2, normal=1.0)   # Poly Haven castle_brick_broken_06 for the ch1 plinth
# pedestal cap: ONE marble slab, so the 2k texture spans the whole 1.2 m top (tile 3 m) with no repeat, polished
marble = pbr("mat_marble", "marble_01", 3.0, tint=(0.80, 0.84, 0.95), rough_mul=0.25, flat=0.2)
# plinth: smooth polished dark concrete (not marble, which read as tiled wood under the warm key)
plinth = pbr("mat_plinth_polished", "cobblestone_floor_13", 0.9, tint=(0.05, 0.047, 0.045), rough_mul=1.0, flat=0.3, normal=1.0)   # weathered dark stone (was a pale pink polished coat)

def assign(ob, mat):
    ob.data.materials.clear(); ob.data.materials.append(mat)

for ob in bpy.data.objects:
    if ob.type != "MESH": continue
    n = ob.name
    if n == "floor": assign(ob, floor)
    elif n.startswith("slab"): assign(ob, slab)
    elif n.startswith("plinth"): assign(ob, floor)   # r7: same stone as the floor, no smooth rim
    elif n.startswith("bust_pedestal"): assign(ob, brick)
    elif n.startswith("BUST_"): pass  # keep the glb's own marble material
    else: assign(ob, wall)
print("MATERIALS_OK")
