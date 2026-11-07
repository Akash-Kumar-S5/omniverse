# Proves the headless pipeline: build -> UV -> Cycles bake (COMBINED lightmap) -> glTF+Draco export.
# Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P blender/scripts/smoke_bake_export.py -- <out_dir>
import bpy, sys, os
out = sys.argv[sys.argv.index("--")+1] if "--" in sys.argv else "/tmp"
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.render.engine = "CYCLES"; sc.cycles.samples = 32; sc.cycles.device = "CPU"
bpy.ops.mesh.primitive_plane_add(size=6); floor = bpy.context.object
bpy.ops.mesh.primitive_cube_add(size=1.5, location=(0,0,0.75)); plinth = bpy.context.object
bpy.ops.object.light_add(type="AREA", location=(0,0,5)); bpy.context.object.data.energy = 800
bpy.ops.object.select_all(action="DESELECT"); floor.select_set(True); bpy.context.view_layer.objects.active = floor
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.uv.smart_project(); bpy.ops.object.mode_set(mode="OBJECT")
img = bpy.data.images.new("floor_lightmap", 512, 512)
mat = bpy.data.materials.new("floor"); mat.use_nodes = True; floor.data.materials.append(mat)
n = mat.node_tree.nodes.new("ShaderNodeTexImage"); n.image = img; mat.node_tree.nodes.active = n
bpy.ops.object.bake(type="COMBINED", margin=6)
img.filepath_raw = os.path.join(out, "floor_lightmap.png"); img.file_format = "PNG"; img.save()
bpy.ops.export_scene.gltf(filepath=os.path.join(out, "smoke.glb"), export_format="GLB", export_draco_mesh_compression_enable=True, export_lights=False)
print("SMOKE_OK", out)
