"""Step 3: PBR materials from blender/textures (CC0, Poly Haven), box-projected so no UVs are needed for authoring."""
import sys, os, importlib
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
from sanctum_lib import *

def _img(nt, fname, nc, loc):
    n = nt.nodes.new("ShaderNodeTexImage")
    n.image = bpy.data.images.load(os.path.join(TEX, fname), check_existing=True)
    n.image.colorspace_settings.name = "Non-Color" if nc else "sRGB"
    n.projection = "BOX"; n.projection_blend = 0.25; n.location = loc
    return n

def pbr(name, prefix, tile_m, tint=(1, 1, 1), rough_mul=1.0, ao_mix=0.8, metallic=0.0, flat=0.6):
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
    nm = nt.nodes.new("ShaderNodeNormalMap"); nm.location = (150, -300); nm.inputs["Strength"].default_value = 0.8
    nt.links.new(nn.outputs["Color"], nm.inputs["Color"]); nt.links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Metallic"].default_value = metallic
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat

# tile sizes ~5x smaller than the first pass, diffuse contrast flattened (flat=0.6-0.75) so no rust-blotch read
wall = pbr("mat_concrete_wall", "concrete_wall_003", 0.7, tint=(0.52, 0.55, 0.62), flat=0.7)
slab = pbr("mat_monolith", "concrete_wall_003", 0.6, tint=(0.28, 0.29, 0.33), rough_mul=0.8, flat=0.7)
floor = pbr("mat_floor_wet", "concrete_floor_worn_001", 0.6, tint=(0.55, 0.56, 0.60), rough_mul=0.30, flat=0.6)
marble = pbr("mat_marble", "marble_01", 0.9, tint=(0.9, 0.9, 0.95), rough_mul=0.35, flat=0.3)
# plinth: smooth polished dark concrete (not marble, which read as tiled wood under the warm key)
plinth = pbr("mat_plinth_polished", "concrete_floor_worn_001", 0.8, tint=(0.75, 0.77, 0.82), rough_mul=0.18, flat=0.85)
_b = next(n for n in plinth.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
_b.inputs["Coat Weight"].default_value = 0.4; _b.inputs["Coat Roughness"].default_value = 0.05

def assign(ob, mat):
    ob.data.materials.clear(); ob.data.materials.append(mat)

for ob in bpy.data.objects:
    if ob.type != "MESH": continue
    n = ob.name
    if n == "floor": assign(ob, floor)
    elif n.startswith("slab"): assign(ob, slab)
    elif n.startswith("plinth"): assign(ob, plinth)
    elif n.startswith("bust_pedestal_cap"): assign(ob, marble)
    elif n.startswith("BUST_"): pass  # keep the glb's own marble material
    else: assign(ob, wall)
print("MATERIALS_OK")
