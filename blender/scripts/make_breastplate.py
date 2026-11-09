"""R24b: isolate the rider's breastplate from the Cleveland Museum of Art armour scan (1964.88, CC0) for ch2.
Crops the single welded mesh to a torso box (faces whose centroid is inside), drops the lance and arms by a second tighter test,
decimates, re-bases the origin (centred on x/y, feet/base on y=0) and exports Draco GLB.
  Blender -b -P blender/scripts/make_breastplate.py            -> previews to $PREVIEW_DIR (if set) and public/assets/models/ch2-breastplate.glb
Box numbers are in the scan's own metres (z up in Blender)."""
import bpy, bmesh, os, math, mathutils
REPO = os.environ.get("SANCTUM_REPO") or os.getcwd()
SRC = os.path.join(REPO, "blender", "props", "cleveland-armour", "faca2ad557f64809b598c3a646a8804f.glb")
OUT = os.path.join(REPO, "public", "assets", "models", "ch2-breastplate.glb")
PREV = os.environ.get("PREVIEW_DIR")
BOX = [float(v) for v in os.environ.get("BOX", "-0.42,0.14,-1.5,-0.78,1.22,1.78").split(",")]   # x0,x1,y0,y1,z0,z1
TARGET = int(os.environ.get("TARGET_TRIS", "40000"))

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)
bpy.context.view_layer.update()
ob = bpy.data.objects["Object_2"]
for o in list(bpy.data.objects):
    if o is not ob: bpy.data.objects.remove(o, do_unlink=True)
ob.data.transform(ob.matrix_world); ob.matrix_basis = mathutils.Matrix.Identity(4); ob.parent = None
bm = bmesh.new(); bm.from_mesh(ob.data)
x0, x1, y0, y1, z0, z1 = BOX
kill = [f for f in bm.faces if not (x0 <= f.calc_center_median().x <= x1 and y0 <= f.calc_center_median().y <= y1 and z0 <= f.calc_center_median().z <= z1)]
bmesh.ops.delete(bm, geom=kill, context="FACES")
# keep only the largest connected piece (drops stray bits of arm, rein and lance that survive the box)
bm.faces.ensure_lookup_table()
seen = set(); islands = []
for f in bm.faces:
    if f.index in seen: continue
    st = [f]; seen.add(f.index); part = []
    while st:
        c = st.pop(); part.append(c)
        for e in c.edges:
            for n in e.link_faces:
                if n.index not in seen: seen.add(n.index); st.append(n)
    islands.append(part)
islands.sort(key=len, reverse=True)
keep = set(islands[0]) if islands else set()
bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context="FACES")
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
bmesh.ops.triangulate(bm, faces=bm.faces)
bm.to_mesh(ob.data); bm.free()
print("BP islands", len(islands), "kept faces", len(ob.data.polygons))
if len(ob.data.polygons) > TARGET:
    m = ob.modifiers.new("dec", "DECIMATE"); m.decimate_type = "COLLAPSE"; m.ratio = TARGET / len(ob.data.polygons); m.use_collapse_triangulate = True
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.modifier_apply(modifier=m.name)
print("BP final faces", len(ob.data.polygons))
# origin: centred on x/y, base on z=0 (becomes y=0 in glTF), scale left at the scan's metres
pts = [v.co for v in ob.data.vertices]
lo = [min(p[i] for p in pts) for i in range(3)]; hi = [max(p[i] for p in pts) for i in range(3)]
for v in ob.data.vertices:
    v.co = mathutils.Vector((v.co.x - (lo[0] + hi[0]) / 2, v.co.y - (lo[1] + hi[1]) / 2, v.co.z - lo[2]))
print("BP size", [round(hi[i] - lo[i], 3) for i in range(3)])
if PREV:
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_WORKBENCH"; sc.display.shading.light = "STUDIO"; sc.display.shading.color_type = "TEXTURE"
    sc.render.resolution_x = 500; sc.render.resolution_y = 500
    cam = bpy.data.objects.new("c", bpy.data.cameras.new("c")); sc.collection.objects.link(cam); sc.camera = cam
    size = max(hi[i] - lo[i] for i in range(3)); ctr = mathutils.Vector((0, 0, (hi[2] - lo[2]) / 2))
    for tag, off in (("front", (0, -2.2, 0.2)), ("side", (2.2, 0, 0.2)), ("back", (0, 2.2, 0.2)), ("top", (0.01, -0.2, 2.2))):
        cam.location = ctr + mathutils.Vector(off) * size
        cam.rotation_euler = (ctr - cam.location).to_track_quat("-Z", "Y").to_euler()
        sc.render.filepath = os.path.join(PREV, f"bp_{tag}.png"); bpy.ops.render.render(write_still=True)
else:
    TEX = int(os.environ.get("TEX_PX", "768"))
    for im in bpy.data.images:
        if im.size[0] > TEX: im.scale(TEX, TEX)   # keeps the GLB under the 1.5 MB budget
    bpy.ops.object.select_all(action="DESELECT"); ob.select_set(True); bpy.context.view_layer.objects.active = ob
    bpy.ops.export_scene.gltf(filepath=OUT, use_selection=True, export_format="GLB", export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7, export_draco_position_quantization=14, export_image_format="JPEG", export_jpeg_quality=82)
    print("BP exported", os.path.getsize(OUT))
