"""Rebuild the whole sanctum. Headless: /Applications/Blender.app/Contents/MacOS/Blender -b -P blender/scripts/build_sanctum.py"""
import os, runpy
D = os.path.dirname(os.path.abspath(__file__))
for step in ("sanctum_01_shell.py", "sanctum_02_props.py", "sanctum_03_materials.py", "sanctum_04_light_world.py", "sanctum_05_cameras.py", "sanctum_07_poly_haven_props.py"):
    runpy.run_path(os.path.join(D, step), run_name="__main__")
import bpy
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(os.path.dirname(D), "sanctum.blend"))
print("BUILD_OK")
