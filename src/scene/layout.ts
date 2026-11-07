// Orchestrator-owned contract. Plain data shared by constellation and camera.
import { projects, techStack, experiences } from "../content";

export type Vec3 = [number, number, number];

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20485);

/** Project nodes on a tilted ring-ish galaxy, radius ~6..10. Index matches content `projects`. */
export const projectNodes: { position: Vec3; size: number }[] = projects.map((p, i) => {
  const a = (i / projects.length) * Math.PI * 2 + rand() * 0.4;
  const r = 6 + rand() * 4;
  return { position: [Math.cos(a) * r, (rand() - 0.5) * 3, Math.sin(a) * r], size: p.featured ? 0.55 : 0.35 };
});

/** Tech satellites. `parent` = index of the nearest-related project node. */
export const techNodes: { position: Vec3; parent: number }[] = techStack.map((t) => {
  const tag = t.name.toLowerCase();
  let parent = projects.findIndex((p) => p.tags.some((x) => tag.includes(x.toLowerCase()) || x.toLowerCase().includes(tag)));
  if (parent < 0) parent = Math.floor(rand() * projects.length);
  const [px, py, pz] = projectNodes[parent].position;
  const a = rand() * Math.PI * 2, b = (rand() - 0.5) * Math.PI;
  const r = 1.2 + rand() * 1.0;
  return { position: [px + Math.cos(a) * Math.cos(b) * r, py + Math.sin(b) * r, pz + Math.sin(a) * Math.cos(b) * r], parent };
});

/** Edges between project nodes (indices into projectNodes): ring + a few chords. */
export const projectEdges: [number, number][] = [
  ...projects.map((_, i) => [i, (i + 1) % projects.length] as [number, number]),
  [0, 3], [1, 5], [2, 6], [4, 7],
];

/** Experience waypoints for the camera spline (oldest role first). */
export const roleWaypoints: Vec3[] = experiences
  .slice()
  .reverse()
  .map((_, i, arr) => {
    const t = i / Math.max(1, arr.length - 1);
    return [-12 + t * 24, 2 - t * 1.5, 14 - t * 6];
  });

/** Contact beacon position: galaxy center. */
export const beacon: Vec3 = [0, 0, 0];
