"""Step 1: shell (rotunda + W corridor + N gallery hall + S passage/court + E niche), relief, floor."""
import sys, os, importlib
_D = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else "/Users/akashkumars/Documents/Personal/portfolio/omniverse/.worktrees/blender-sanctum/blender/scripts"
if _D not in sys.path: sys.path.insert(0, _D)
import sanctum_lib as L; importlib.reload(L)
import math
from sanctum_lib import *

reset_scene()
OCU_Y = -1.5  # oculus offset so the tilted shaft lands on the plinth at the origin

# ---- solids (outer masses) ----
shell = cyl("sanctum_shell", 10.5, -1, 13.5)
for o in [
    box("m_corr", -35, -8.5, -4.5, 4.5, -1, 9),
    box("m_hall", -6.5, 6.5, 8.5, 34, -1, 11),
    box("m_court", -8.5, 8.5, -25, -8, -1, 9),
    box("m_niche", 8, 13.5, -3.5, 3.5, -1, 8),
]:
    boolean(shell, o, "UNION"); delete(o)

# ---- voids ----
voids = [
    cyl("v_rot", 9, 0, 12.0),
    cyl("v_ocu", 2.2, 11, 15, 0, OCU_Y),
    box("v_corr", -34, -8, -3, 3, 0, 7.5),
    box("v_hall", -4.5, 4.5, 8, 33, 0, 9.5),
    box("v_pass", -3.5, 3.5, -12, -8, 0, 7.5),
    box("v_court", -7, 7, -23.5, -11.5, 0, 20),
    box("v_niche", 8, 12.5, -1.75, 1.75, 0, 6.5),
]
# ceiling light slits: corridor (cross bars) and gallery
for x in (-16.5, -21.5, -26.5, -31.5):
    voids.append(box(f"v_slc{x}", x - 0.3, x + 0.3, -2.4, 2.4, 6.5, 10))
for y in (14, 19, 24, 29):
    voids.append(box(f"v_slh{y}", -3.8, 3.8, y - 0.3, y + 0.3, 8.5, 12))
for v in voids:
    boolean(shell, v, "DIFFERENCE")

# ---- relief (rings + pilasters), cut by openings so they never cross a doorway ----
relief = []
def ring(name, rin, rout, z0, z1):
    r = cyl(name, rout, z0, z1); i = cyl("i", rin, z0 - 1, z1 + 1)
    boolean(r, i); delete(i); return r
relief.append(ring("ring_band", 8.55, 9.2, 3.9, 4.5))
relief.append(ring("ring_cornice", 8.1, 9.2, 8.0, 8.9))
relief.append(ring("ring_ocu", 2.2, 2.9, 11.3, 12.0))
for a in range(0, 360, 10):
    d = min(abs((a % 90)), 90 - abs(a % 90))
    if d < 38: continue
    b = box(f"pil{a}", 8.0, 9.3, -0.7, 0.7, 0, 12)
    b.rotation_euler = (0, 0, math.radians(a))
    bpy.context.view_layer.update()
    me = b.data; me.transform(b.matrix_world); b.rotation_euler = (0, 0, 0)
    relief.append(b)
cut = [v for v in voids if v.name in ("v_corr", "v_hall", "v_pass", "v_niche")]
for r in relief:
    for v in cut: boolean(r, v)
    boolean(shell, r, "UNION"); delete(r)
# the ocular ring above intersects the oculus void: re-cut
boolean(shell, voids[1])

# ---- gallery wall relief: rhythm of deep vertical fins along corridor + hall walls ----
for x in (-14, -19, -24, -29):
    for s in (-1, 1):
        f = box(f"fin{x}{s}", x - 0.45, x + 0.45, 2.2 * s if s > 0 else -3, 3 if s > 0 else -2.2, 0, 7.5)
        boolean(shell, f, "UNION"); delete(f)
for y in (11.5, 16.5, 21.5, 26.5, 31):
    for s in (-1, 1):
        f = box(f"hf{y}{s}", 4.0 if s > 0 else -5.5, 5.5 if s > 0 else -4.0, y - 0.4, y + 0.4, 0, 9.5)
        boolean(shell, f, "UNION"); delete(f)
# re-cut slits that fins might cover
for v in voids:
    if v.name.startswith("v_sl"): boolean(shell, v)

# ---- court roof: a thick slab with a ROUND opening, so the night sky is framed like the main oculus ----
roof = box("court_roof", -7.6, 7.6, -24.0, -11.0, 8.2, 9.3)   # full ceiling so concrete surrounds the round opening
rh = cyl("court_hole", 3.7, 7.0, 10.5, 0, -17.5)
boolean(roof, rh); delete(rh)
boolean(shell, roof, "UNION"); delete(roof)

# ---- floor (separate mesh) ----
floor = cyl("floor", 9.2, -0.4, 0.03)
for o in [box("f1", -34, -8, -3, 3, -0.4, 0.03), box("f2", -4.5, 4.5, 8, 33, -0.4, 0.03),
          box("f3", -3.5, 3.5, -12, -8, -0.4, 0.03), box("f4", -7, 7, -23.5, -11.5, -0.4, 0.03),
          box("f5", 8, 12.5, -1.75, 1.75, -0.4, 0.03)]:
    boolean(floor, o, "UNION"); delete(o)

delete(*voids)
print("SHELL_OK", len(shell.data.polygons), len(floor.data.polygons))
