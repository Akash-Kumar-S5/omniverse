"""Step 5: chapter cameras CAM_<spot>, TARGET_<spot> empties, shape anchors ANCHOR_*. Names are the contract (src/state/signal.ts)."""
import sys, os, importlib
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
import math
from sanctum_lib import *

SPOTS = {
    # name: (position, target, vertical fov deg)
    "boot_wide":         ((-4.4, -6.2, 1.7), (0.0, 0.0, 1.3), 58),
    "boot_under_oculus": ((0.3, -4.4, 1.45), (-0.2, 0.0, 1.05), 50),
    "about_niche":       ((5.4, 0.0, 1.7), (11.0, 0.0, 1.55), 40),
    "contact_sky":       ((-1.2, -3.6, 1.35), (-0.5, 0.2, 0.95), 50),   # the plinth fire, centre-right, beside the left-hand copy
    "proj_gallery":      ((0.0, 10.5, 2.0), (0.0, 26.0, 2.8), 52),
}
for k, x in enumerate((-14, -19, -24, -29)):
    SPOTS[f"exp_role_{k}"] = ((x + 4.2, 0.0, 1.7), (x, 0.0, 2.6), 56)
for i in range(8):
    side = -1 if i % 2 == 0 else 1
    y = 13.5 + (i // 2) * 5.0
    SPOTS[f"proj_{i}"] = ((-side * 0.9, y - 3.6, 1.8), (side * 2.7, y, 2.9), 44)

for name, (pos, tgt, fov) in SPOTS.items():
    cd = bpy.data.cameras.new(f"CAM_{name}"); cd.angle_y = math.radians(fov); cd.sensor_fit = "VERTICAL"
    cd.lens_unit = "FOV"; cd.clip_start = 0.05; cd.clip_end = 400
    cam = bpy.data.objects.new(f"CAM_{name}", cd); bpy.context.scene.collection.objects.link(cam)
    cam.location = pos; look_at(cam, tgt)
    empty(f"TARGET_{name}", tgt, 0.15, "SPHERE")

ANCH = {
    "core": ((0.0, 0.0, 2.3), 1.6),
    "bust": ((11.0, 0.0, 1.9), 0.55),
    "helix": ((-21.5, 0.0, 2.6), 2.2),
    "glyph": ((0.0, 29.5, 3.2), 2.2),
    "beacon": ((0.0, -17.5, 11.0), 0.6),
}
for k, (pos, r) in ANCH.items():
    empty(f"ANCHOR_{k}", pos, r, "SPHERE")
bpy.context.scene.camera = bpy.data.objects["CAM_boot_wide"]
print("CAMERAS_OK", len(SPOTS))
