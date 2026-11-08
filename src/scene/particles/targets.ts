import * as THREE from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { experiences, projects } from "../../content";
import type { ShapeId, SanctumSpots } from "../../state/signal";
import { beacon } from "../layout";

export interface TargetOptions {
  shape: ShapeId;
  count: number;
  anchors?: SanctumSpots["anchors"];
  activeProject: number;
  activeRole?: number;
  bust?: THREE.Object3D;
}

/** Offset from the core anchor that keeps the hero swarm on the right of the boot camera path. */
export const CORE_SHAPE_OFFSET: [number, number, number] = [1.55, 2.8, 0.95];

/** Compute anchor beside the active project's slab in the gallery (Chapter 3). */
export function getProjectGlyphAnchor(activeProject: number): THREE.Vector3 {
  const index = Math.max(0, Math.min(7, activeProject));
  const pair = Math.floor(index / 2);
  const isEven = index % 2 === 0;
  // Slabs are at z = -13.5, -18.5, -23.5, -28.5
  const zSlab = -13.5 - pair * 5.0;
  // Float glyph beside the active slab in clear line of sight (screen right x > 0.68).
  const x = isEven ? -1.65 : 2.55;
  const y = 2.65;
  const z = isEven ? zSlab - 0.65 : zSlab + 0.85;
  return new THREE.Vector3(x, y, z);
}

/** Compute anchor for helix ribbon in the experience corridor (Chapter 2), shifted to the right half (x > 0 on screen). */
export function getHelixAnchor(activeRole?: number): THREE.Vector3 {
  const role = Math.max(0, Math.min(3, activeRole ?? 0));
  // Follow active role portal forward: role 0 -> x = -14.2, role 1 -> -19.2, etc.
  // Camera looks down -X, so negative Z shifts to screen right (x > 0) away from role card.
  return new THREE.Vector3(-14.2 - role * 5.0, 2.05, -1.85);
}

const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

function anchorPosition(anchors: TargetOptions["anchors"], key: keyof NonNullable<TargetOptions["anchors"]>, fallback: THREE.Vector3) {
  const point = anchors?.[key]?.position;
  return point ? new THREE.Vector3(...point) : fallback.clone();
}

function sampleBust(count: number, bust: THREE.Object3D, center: THREE.Vector3, radius: number, random: () => number) {
  bust.updateMatrixWorld(true);
  const meshes: THREE.Mesh[] = [];
  bust.traverse((object) => {
    if ((object as THREE.Mesh).isMesh && (object as THREE.Mesh).geometry.getAttribute("position")) meshes.push(object as THREE.Mesh);
  });
  if (!meshes.length) return null;
  const samplers = meshes.map((mesh) => new MeshSurfaceSampler(mesh).build());
  const sampled = new Array<THREE.Vector3>(count);
  const point = new THREE.Vector3();
  const totalWeight = meshes.reduce((sum, mesh) => sum + (mesh.geometry.index?.count ?? mesh.geometry.getAttribute("position").count), 0);
  const cumulative: number[] = [];
  let total = 0;
  for (const mesh of meshes) {
    total += (mesh.geometry.index?.count ?? mesh.geometry.getAttribute("position").count) / totalWeight;
    cumulative.push(total);
  }
  for (let i = 0; i < count; i++) {
    const choice = random();
    let index = cumulative.findIndex((limit) => choice <= limit);
    if (index < 0) index = meshes.length - 1;
    samplers[index].sample(point);
    sampled[i] = point.clone().applyMatrix4(meshes[index].matrixWorld);
  }
  const bounds = new THREE.Box3().setFromPoints(sampled);
  const sourceCenter = bounds.getCenter(new THREE.Vector3());
  const extent = bounds.getSize(new THREE.Vector3()).length() || 1;
  const scale = radius * 1.8 / extent;
  return sampled.map((position) => ({
    position: position.sub(sourceCenter).multiplyScalar(scale).add(center),
    group: 0,
  }));
}

function sampleTextGlyph(
  letter: string,
  count: number,
  shapeAnchor: THREE.Vector3,
  radius: number,
  random: () => number,
  activeProject: number,
): { position: THREE.Vector3; group: number }[] {
  let sampled2D: { x: number; y: number }[] = [];

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      ctx.clearRect(0, 0, 256, 256);
      ctx.font = "bold 170px 'Cinzel', 'Playfair Display', 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 1. Outline stroke: high weight for sharp, recognizable letter boundaries
      ctx.lineWidth = 14;
      ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
      ctx.strokeText(letter, 128, 128);

      // 2. Soft interior fill: low opacity for soft density with edge falloff
      ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
      ctx.fillText(letter, 128, 128);

      const imgData = ctx.getImageData(0, 0, 256, 256).data;
      const pixels: { x: number; y: number; weight: number }[] = [];
      let minX = 256, maxX = 0, minY = 256, maxY = 0;

      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
          const alpha = imgData[(y * 256 + x) * 4 + 3];
          if (alpha > 18) {
            pixels.push({ x, y, weight: alpha / 255 });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (pixels.length > 0) {
        const totalWeight = pixels.reduce((sum, p) => sum + p.weight, 0);
        const cumulative = new Float32Array(pixels.length);
        let runSum = 0;
        for (let i = 0; i < pixels.length; i++) {
          runSum += pixels[i].weight / totalWeight;
          cumulative[i] = runSum;
        }

        const width = Math.max(1, maxX - minX);
        const height = Math.max(1, maxY - minY);
        const cx = (minX + maxX) * 0.5;
        const cy = (minY + maxY) * 0.5;
        const scale = Math.max(width, height) * 0.5;

        for (let i = 0; i < count; i++) {
          const choice = random();
          let low = 0, high = pixels.length - 1;
          while (low < high) {
            const mid = (low + high) >> 1;
            if (cumulative[mid] < choice) low = mid + 1;
            else high = mid;
          }
          const p = pixels[low];
          // Sub-pixel jitter for soft point dispersion
          const jx = p.x + (random() - 0.5) * 1.6;
          const jy = p.y + (random() - 0.5) * 1.6;
          sampled2D.push({
            x: (jx - cx) / scale,
            y: -(jy - cy) / scale, // invert Y so upright
          });
        }
      }
    }
  }

  // Fallback if canvas is unavailable
  if (sampled2D.length === 0) {
    sampled2D = Array.from({ length: count }, () => {
      const a = random() * Math.PI * 2;
      const r = 0.5 + random() * 0.5;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r };
    });
  }

  // Gallery camera orientation vectors for Chapter 3
  const isEven = (activeProject % 2) === 0;
  const right = isEven
    ? new THREE.Vector3(0.7071, 0, -0.7071)
    : new THREE.Vector3(0.7071, 0, 0.7071);
  const up = new THREE.Vector3(0, 1, 0);
  const normal = isEven
    ? new THREE.Vector3(-0.7071, 0, -0.7071)
    : new THREE.Vector3(0.7071, 0, -0.7071);

  const glyphScale = radius * 0.95;
  return sampled2D.map((pt) => {
    // Subtle volumetric depth along normal
    const depth = (random() - 0.5) * radius * 0.22;
    const pos = shapeAnchor.clone()
      .addScaledVector(right, pt.x * glyphScale)
      .addScaledVector(up, pt.y * glyphScale)
      .addScaledVector(normal, depth);

    // Tag ~3.5% as luminous beacons (group = 9) for celestial sparkle
    const isAgent = random() < 0.035 ? 9 : activeProject;
    return { position: pos, group: isAgent };
  });
}

export function createTargetTexture(options: TargetOptions) {
  const { shape, count, anchors, activeProject, activeRole, bust } = options;
  const random = seeded((activeProject + 1) * 997 + shape.length * 131 + (activeRole ?? 0) * 43);
  const core = anchorPosition(anchors, "core", new THREE.Vector3());
  let shapeAnchor: THREE.Vector3;
  let radius: number;

  if (shape === "core") {
    shapeAnchor = core.add(new THREE.Vector3(...CORE_SHAPE_OFFSET));
    radius = anchors?.core?.radius ?? 1.6;
  } else if (shape === "bust") {
    shapeAnchor = anchorPosition(anchors, "bust", new THREE.Vector3());
    radius = anchors?.bust?.radius ?? 1.35;
  } else if (shape === "helix") {
    shapeAnchor = getHelixAnchor(activeRole);
    radius = 0.85;
  } else if (shape === "project-glyph") {
    shapeAnchor = getProjectGlyphAnchor(activeProject);
    radius = 0.55;
  } else {
    shapeAnchor = anchorPosition(anchors, shape, new THREE.Vector3());
    radius = anchors?.[shape]?.radius ?? 1.6;
  }

  let points: { position: THREE.Vector3; group: number }[] | null = null;

  if (shape === "bust" && bust) points = sampleBust(count, bust, shapeAnchor, radius, random);
  if (shape === "helix") {
    // Elegant 3D corkscrew timeline ribbon placed in the right half of the corridor
    // (negative Z in world space, screen right x > 0), cleanly off the left role card text.
    points = Array.from({ length: count }, () => {
      const group = Math.min(experiences.length - 1, Math.floor(random() * experiences.length));
      const t = (random() * 2 - 1) * Math.PI * 1.4;
      const ribbonRadius = radius * 0.52;
      const hx = Math.sin(t * 1.2) * ribbonRadius * 0.65 + (random() - 0.5) * 0.2;
      const hy = t * 0.28 + (group - 1.5) * 0.16 + (random() - 0.5) * 0.15;
      const hz = Math.cos(t * 1.2) * ribbonRadius * 0.7 + (random() - 0.5) * 0.15;
      const isAgent = random() < 0.04 ? 9 : group;
      return {
        position: new THREE.Vector3(shapeAnchor.x + hx, shapeAnchor.y + hy, shapeAnchor.z + hz),
        group: isAgent,
      };
    });
  }
  if (shape === "project-glyph") {
    // Per-project initial letterform sampled to points via canvas text/outline sampling
    const project = projects[Math.max(0, Math.min(projects.length - 1, activeProject))] || projects[0];
    const letter = project?.title?.charAt(0) || "S";
    points = sampleTextGlyph(letter, count, shapeAnchor, radius, random, activeProject);
  }
  if (shape === "beacon") {
    const point = anchors?.beacon?.position ? new THREE.Vector3(...anchors.beacon.position) : new THREE.Vector3(...beacon);
    points = Array.from({ length: count }, () => {
      const angle = random() * Math.PI * 2;
      const major = radius * 2.4;
      const tube = (random() - 0.5) * radius * 0.22;
      return { position: point.clone().add(new THREE.Vector3(Math.cos(angle) * (major + tube), Math.sin(angle) * (major + tube), (random() - 0.5) * radius * 0.09)), group: 0 };
    });
  }
  if (!points) {
    points = Array.from({ length: count }, () => {
      // Uniform spherical direction
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(u);
      const sinPhi = Math.sin(phi);
      // Volumetric radial distribution: dense luminous core with soft outer filaments
      const rDist = Math.pow(random(), 1.6);
      const r = radius * (0.22 + rDist * 0.92);
      // Gentle fractal turbulence displacement to avoid geometric banding
      const nx = Math.sin(theta * 3.0 + rDist * 4.0) * radius * 0.08;
      const ny = Math.cos(phi * 3.0 + rDist * 4.0) * radius * 0.08;
      const nz = Math.sin((theta + phi) * 2.0) * radius * 0.08;
      const pos = shapeAnchor.clone().add(
        new THREE.Vector3(
          r * sinPhi * Math.cos(theta) + nx,
          r * Math.cos(phi) + ny,
          r * sinPhi * Math.sin(theta) + nz,
        ),
      );
      // Mark ~3.5% as luminous agent particles (group = 9)
      const isAgent = random() < 0.035 ? 9 : 0;
      return { position: pos, group: isAgent };
    });
  }

  const data = new Float32Array(count * 4);
  points.forEach(({ position, group }, index) => {
    const offset = index * 4;
    data[offset] = position.x;
    data[offset + 1] = position.y;
    data[offset + 2] = position.z;
    data[offset + 3] = group;
  });
  const texture = new THREE.DataTexture(data, Math.sqrt(count), Math.sqrt(count), THREE.RGBAFormat, THREE.FloatType);
  texture.needsUpdate = true;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}
