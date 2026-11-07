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
  bust?: THREE.Object3D;
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

export function createTargetTexture(options: TargetOptions) {
  const { shape, count, anchors, activeProject, bust } = options;
  const random = seeded((activeProject + 1) * 997 + shape.length * 131);
  const core = anchorPosition(anchors, "core", new THREE.Vector3());
  const shapeAnchor = shape === "core"
    ? core.add(new THREE.Vector3(5.5, 0, 0))
    : anchorPosition(anchors, shape === "project-glyph" ? "glyph" : shape, new THREE.Vector3());
  const radius = anchors?.[shape === "project-glyph" ? "glyph" : shape]?.radius ?? (shape === "bust" ? 1.35 : 1.6);
  let points: { position: THREE.Vector3; group: number }[] | null = null;

  if (shape === "bust" && bust) points = sampleBust(count, bust, shapeAnchor, radius, random);
  if (shape === "helix") {
    points = Array.from({ length: count }, () => {
      const group = Math.min(experiences.length - 1, Math.floor(random() * experiences.length));
      const u = random() * 2 - 1;
      const x = u * radius * 1.55;
      const layer = (group - (experiences.length - 1) * 0.5) * radius * 0.42;
      const ripple = Math.sin(u * Math.PI * 2.3 + group * 0.72) * radius * 0.055;
      return {
        position: new THREE.Vector3(
          shapeAnchor.x + x,
          shapeAnchor.y + layer + ripple + (random() - 0.5) * radius * 0.075,
          shapeAnchor.z + Math.sin(u * Math.PI * 1.4 + group) * radius * 0.11 + (random() - 0.5) * radius * 0.09,
        ),
        group,
      };
    });
  }
  if (shape === "project-glyph") {
    const extent = radius * 1.32;
    const spacing = extent * 0.34;
    const grid = [-2, -1, 0, 1, 2];
    points = Array.from({ length: count }, () => {
      const axis = Math.floor(random() * 3);
      const along = (random() * 2 - 1) * extent;
      const first = grid[Math.floor(random() * grid.length)] * spacing;
      const second = grid[Math.floor(random() * grid.length)] * spacing;
      const jitter = (random() - 0.5) * radius * 0.025;
      const coordinates = axis === 0 ? [along, first, second] : axis === 1 ? [first, along, second] : [first, second, along];
      return {
        position: new THREE.Vector3(shapeAnchor.x + coordinates[0] + jitter, shapeAnchor.y + coordinates[1] + jitter, shapeAnchor.z + coordinates[2] + jitter),
        group: Math.floor(random() * projects.length),
      };
    });
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
      const y = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const ring = Math.sqrt(1 - y * y);
      const r = radius * (0.28 + Math.cbrt(random()) * 0.82);
      return { position: shapeAnchor.clone().add(new THREE.Vector3(Math.cos(angle) * ring * r * 1.18, y * r * 0.78, Math.sin(angle) * ring * r)), group: 0 };
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
