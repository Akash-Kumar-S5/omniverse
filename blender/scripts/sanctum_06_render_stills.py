"""Step 6: Cycles stills per chapter camera -> .orchestrator/reference/r3-blender-<spot>.png
Headless: Blender -b blender/sanctum.blend -P blender/scripts/sanctum_06_render_stills.py -- [spot ...]"""
import bpy, os, sys
REPO = os.environ.get("SANCTUM_REPO") or "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum"
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
spots = args or ["boot_wide", "boot_under_oculus", "about_niche", "exp_role_0", "proj_gallery", "contact_sky"]
sc = bpy.context.scene
sc.render.image_settings.file_format = "PNG"
if os.environ.get("SAMPLES"): sc.cycles.samples = int(os.environ["SAMPLES"])
if os.environ.get("OUT"): REPO_OUT = os.environ["OUT"]
else: REPO_OUT = os.path.join(REPO, ".orchestrator", "reference")
RES = os.environ.get("RES_PCT")
if RES: sc.render.resolution_percentage = int(RES)
for s in spots:
    sc.camera = bpy.data.objects[f"CAM_{s}"]
    sc.render.filepath = os.path.join(REPO_OUT, f"r3-blender-{s}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", s)
