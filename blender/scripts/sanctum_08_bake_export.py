"""Step 8: decimate props -> join -> atlas UV -> Cycles COMBINED bake -> unlit baked materials -> Draco GLBs + spots.json.
Headless (run AFTER build_sanctum.py has produced blender/sanctum.blend; this script does not save the blend):
  /Applications/Blender.app/Contents/MacOS/Blender -b blender/sanctum.blend -P blender/scripts/sanctum_08_bake_export.py
env: BAKE_SAMPLES (256), ARCH_PX (4096), FLOOR_PX (2048), LITE_PX (1024), JPEG_Q (82)
Outputs: public/assets/models/{sanctum.glb, sanctum-lite.glb, sanctum.spots.json}  (intermediates in blender/bake/, gitignored)
Runtime note: the baked colour already includes AgX + exposure, so set material.toneMapped = false (exported as extras) and show it unlit."""
import bpy, os, math, json, time, mathutils

REPO = os.environ.get("SANCTUM_REPO") or "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum"
OUT = os.path.join(REPO, "public", "assets", "models"); BAKE = os.path.join(REPO, "blender", "bake")
os.makedirs(OUT, exist_ok=True); os.makedirs(BAKE, exist_ok=True)
SAMPLES = int(os.environ.get("BAKE_SAMPLES", 256)); ARCH_PX = int(os.environ.get("ARCH_PX", 4096))
FLOOR_PX = int(os.environ.get("FLOOR_PX", 4096)); LITE_PX = int(os.environ.get("LITE_PX", 1024)); Q = int(os.environ.get("JPEG_Q", 82))
sc = bpy.context.scene; D = bpy.data
T0 = time.time()
def log(*a): print(f"[{time.time()-T0:6.0f}s]", *a, flush=True)

def sel(*obs):
    for o in D.objects: o.select_set(False)
    for o in obs: o.select_set(True)
    bpy.context.view_layer.objects.active = obs[0]

# ---------- 0. scene prep ----------
for o in D.objects:
    if o.name.startswith("VOL_"): o.hide_render = True     # haze is runtime (volumetric shaft + motes)
sc.render.engine = "CYCLES"; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
try: sc.cycles.denoiser = "OPENIMAGEDENOISE"
except Exception: pass

# ---------- 1. decimate props (budget) ----------
targets = {"PROP_bronze_whale": 9000}
for o in list(D.objects):
    if o.type != "MESH" or not o.name.startswith("PROP_") or o.name == "PROP_statue_block": continue
    import bmesh
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)   # UV-seam-split verts block collapse; weld them (UVs stay on loops)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(o.data); bm.free()
    n = len(o.data.polygons); tgt = targets.get(o.name, 2500)
    if n > tgt:
        sel(o); m = o.modifiers.new("dec", "DECIMATE"); m.decimate_type = "COLLAPSE"; m.ratio = tgt / n; m.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=m.name)
    log("decimated", o.name, n, "->", len(o.data.polygons))

# ---------- 2. group + join ----------
shell = D.objects["sanctum_shell"]; floor = D.objects["floor"]
ftiles = [o for o in D.objects if o.type == "MESH" and o.name.startswith("FLOORT_")]
if ftiles:  # ruined paving joins the floor mesh (one floor atlas)
    sel(floor, *ftiles); bpy.ops.object.join(); floor = bpy.context.view_layer.objects.active; floor.name = "floor"
def _c(o):
    pts = [o.matrix_world @ mathutils.Vector(c) for c in o.bound_box]
    return sum(p.x for p in pts) / 8, sum(p.y for p in pts) / 8
# the about niche (arch, altar, candles) bakes with the pedestal into its own, denser atlas
niche = [o for o in D.objects if o.type == "MESH" and o.name.startswith("RUIN_") and _c(o)[0] > 7.8 and abs(_c(o)[1]) < 3.0]
arch_parts = [shell] + [o for o in D.objects if o.type == "MESH" and o.name.startswith(("portal", "slab", "plinth", "PROP_", "RUIN_")) and o not in niche]
ped_parts = [D.objects["bust_pedestal"], D.objects["bust_pedestal_cap"]] + niche
def join(parts, name):
    sel(*parts); bpy.ops.object.join(); ob = bpy.context.view_layer.objects.active; ob.name = name; ob.data.name = name; return ob
arch = join(arch_parts, "sanctum_architecture"); ped = join(ped_parts, "bust_pedestal")
log("arch faces", len(arch.data.polygons), "floor", len(floor.data.polygons), "ped", len(ped.data.polygons))
for ob in (arch, ped, floor): ob.data.polygons.foreach_set("use_smooth", [False] * len(ob.data.polygons)) if False else None

# ---------- 3. atlas UVs ----------
sc.tool_settings.use_uv_select_sync = True
def atlas_uv(ob):
    me = ob.data
    orig = me.uv_layers[0] if len(me.uv_layers) else None
    if orig is not None: orig.active_render = True       # source materials keep sampling their own UVs while baking
    lay = me.uv_layers.new(name="atlas"); lay.active = True
    sel(ob); bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.003)
    bpy.ops.uv.average_islands_scale()
    bpy.ops.uv.pack_islands(margin=0.003)
    bpy.ops.object.mode_set(mode="OBJECT")
for ob in (arch, ped, floor): atlas_uv(ob)
log("uv done")

# ---------- 4. bake COMBINED ----------
def bake(ob, name, px):
    img = D.images.new(f"bake_{name}", px, px, alpha=False, float_buffer=True)
    mats = [m for m in ob.data.materials if m]
    for m in mats:
        nt = m.node_tree
        t = nt.nodes.get("BAKE_TARGET") or nt.nodes.new("ShaderNodeTexImage"); t.name = "BAKE_TARGET"
        t.image = img; t.select = True; nt.nodes.active = t
    sel(ob)
    bpy.ops.object.bake(type="COMBINED", margin=8, margin_type="EXTEND", use_clear=True)   # default pass filter = direct+indirect+colour+emission
    log("baked", name, px)
    for m in mats: m.node_tree.nodes.remove(m.node_tree.nodes["BAKE_TARGET"])
    return img
imgs = {"arch": bake(arch, "arch", ARCH_PX), "floor": bake(floor, "floor", FLOOR_PX), "ped": bake(ped, "ped", 2048)}

# ---------- 5. save JPEGs through the scene colour management (AgX baked in), plus 1k lite copies ----------
scene_fmt = sc.render.image_settings
scene_fmt.file_format = "JPEG"; scene_fmt.quality = Q; scene_fmt.color_mode = "RGB"
def save(img, fn):
    p = os.path.join(BAKE, fn); img.save_render(p, scene=sc); return p
hi = {k: save(v, f"{k}.jpg") for k, v in imgs.items()}
lite = {}
for k, px in (("arch", LITE_PX), ("floor", LITE_PX // 2 if False else LITE_PX), ("ped", 512)):
    im = D.images.load(hi[k]); im.colorspace_settings.name = "sRGB"; im.scale(px, px)
    p = os.path.join(BAKE, f"{k}_lite.jpg"); im.filepath_raw = p; im.file_format = "JPEG"
    sc.render.image_settings.quality = Q; im.save(); lite[k] = p
log("jpegs", {k: os.path.getsize(v) for k, v in hi.items()}, {k: os.path.getsize(v) for k, v in lite.items()})

# ---------- 6. unlit baked materials (baseColor = emissive = baked map; 1 shared texture per mesh) ----------
def baked_mat(name, path):
    m = D.materials.new(name); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); b = nt.nodes.new("ShaderNodeBsdfPrincipled"); t = nt.nodes.new("ShaderNodeTexImage")
    img = D.images.load(path, check_existing=False); img.colorspace_settings.name = "sRGB"; t.image = img
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); nt.links.new(t.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 1.0; b.inputs["Roughness"].default_value = 1.0; b.inputs["Metallic"].default_value = 0.0
    b.inputs["Specular IOR Level"].default_value = 0.0
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"]); m["toneMapped"] = False
    return m, t
def assign(variant):
    paths = hi if variant == "high" else lite
    for ob, key in ((arch, "arch"), (floor, "floor"), (ped, "ped")):
        m, t = baked_mat(f"{ob.name}_baked_{variant}", paths[key])
        ob.data.materials.clear(); ob.data.materials.append(m)
        for lay in list(ob.data.uv_layers):
            if lay.name != "atlas": ob.data.uv_layers.remove(lay)
        for a in list(ob.data.attributes):
            if a.name.startswith(("Col", "Color")) and a.domain == "CORNER": ob.data.attributes.remove(a)

# ---------- 7. contract empties ----------
sun = D.objects["SUN_shaft"]
d = (sun.matrix_world.to_3x3() @ mathutils.Vector((0, 0, -1))).normalized()
osh = D.objects.new("oculus_shaft", None); osh.empty_display_type = "CIRCLE"; osh.empty_display_size = 2.2; osh.location = (0.0, -1.5, 12.0)
sc.collection.objects.link(osh)
ax = D.objects.new("shaft_axis", None); ax.empty_display_type = "SINGLE_ARROW"; ax.empty_display_size = 1.0
sc.collection.objects.link(ax); ax.parent = osh; ax.location = d  # one metre along the shaft, relative to the oculus
bpy.context.view_layer.update()

# ---------- 8. export ----------
def export(variant, fn):
    assign(variant); bpy.context.view_layer.update()
    sel(arch, floor, ped, osh, ax)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(OUT, fn), export_format="GLB", use_selection=True, export_apply=True,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
        export_draco_position_quantization=14, export_draco_normal_quantization=8, export_draco_texcoord_quantization=12,
        export_lights=False, export_cameras=False, export_extras=True, export_yup=True,
        export_image_format="AUTO", export_normals=False, export_texcoords=True, export_materials="EXPORT")
    log("exported", fn, os.path.getsize(os.path.join(OUT, fn)))
export("high", "sanctum.glb")
# lite = same node names, 1k textures: swap the three baked maps
for ob in (arch, floor, ped): pass
export("lite", "sanctum-lite.glb")

# ---------- 9. spots manifest (glTF space: Y up, metres) ----------
def g(v): return [round(v.x, 3), round(v.z, 3), round(-v.y, 3)]
cams = {}
for o in D.objects:
    if o.type == "CAMERA" and o.name.startswith("CAM_"):
        spot = o.name[4:]; tgt = D.objects.get(f"TARGET_{spot}")
        t = tgt.matrix_world.translation if tgt else (o.matrix_world.translation + (o.matrix_world.to_3x3() @ mathutils.Vector((0, 0, -3.0))))
        cams[spot] = {"position": g(o.matrix_world.translation), "target": g(t), "fov": round(math.degrees(o.data.angle_y), 2)}
anch = {}
for k in ("core", "bust", "helix", "glyph", "beacon"):
    e = D.objects[f"ANCHOR_{k}"]; anch[k] = {"position": g(e.matrix_world.translation), "radius": round(e.empty_display_size * max(e.scale), 3)}
with open(os.path.join(OUT, "sanctum.spots.json"), "w") as f: json.dump({"cameras": cams, "anchors": anch}, f, indent=1)
log("spots", len(cams), "cameras", len(anch), "anchors")
for fn in ("sanctum.glb", "sanctum-lite.glb", "sanctum.spots.json"): print("SIZE", fn, os.path.getsize(os.path.join(OUT, fn)))
print("EXPORT_OK")
