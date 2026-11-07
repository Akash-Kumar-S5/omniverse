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
  activeRole: number;
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

function glyphPoints(count: number, name: string, center: THREE.Vector3, random: () => number) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 144;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 58px Arial, sans-serif";
  let label = name;
  while (context.measureText(label).width > 476 && label.length > 3) label = label.slice(0, -1);
  context.fillText(label, canvas.width / 2, canvas.height / 2, 476);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const occupied: [number, number][] = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 80) occupied.push([x, y]);
    }
  }
  if (!occupied.length) return null;
  return Array.from({ length: count }, () => {
    const [x, y] = occupied[Math.floor(random() * occupied.length)];
    return { position: new THREE.Vector3(center.x + (x / 512 - 0.5) * 4.6, center.y + (0.5 - y / 144) * 1.35, center.z + (random() - 0.5) * 0.12), group: 0 };
  });
}

export function createTargetTexture(options: TargetOptions) {
  const { shape, count, anchors, activeProject, activeRole, bust } = options;
  const random = seeded((activeProject + 1) * 997 + (activeRole + 1) * 131 + shape.length * 17);
  const core = anchorPosition(anchors, "core", new THREE.Vector3());
  const shapeAnchor = shape === "core" ? core : anchorPosition(anchors, shape === "project-glyph" ? "glyph" : shape, new THREE.Vector3());
  const radius = anchors?.[shape === "project-glyph" ? "glyph" : shape]?.radius ?? (shape === "bust" ? 1.35 : 1.6);
  let points: { position: THREE.Vector3; group: number }[] | null = null;

  if (shape === "bust" && bust) points = sampleBust(count, bust, shapeAnchor, radius, random);
  if (shape === "helix") {
    const centers = experiences.slice().reverse().map((_, index, all) => {
      const progress = index / Math.max(1, all.length - 1);
      return new THREE.Vector3(shapeAnchor.x + Math.sin(progress * Math.PI * 2) * radius * 0.48, shapeAnchor.y + (progress - 0.5) * radius * 1.45, shapeAnchor.z + Math.cos(progress * Math.PI * 2) * radius * 0.48);
    });
    points = Array.from({ length: count }, () => {
      const group = Math.min(centers.length - 1, Math.floor(random() * centers.length));
      const t = random() * Math.PI * 2;
      const r = radius * (0.12 + random() * 0.2);
      return { position: centers[group].clone().add(new THREE.Vector3(Math.cos(t) * r, (random() - 0.5) * r * 2.6, Math.sin(t) * r)), group };
    });
  }
  if (shape === "project-glyph") {
    const project = projects[Math.max(0, Math.min(projects.length - 1, activeProject))];
    points = glyphPoints(count, project?.title ?? "SIGNAL", shapeAnchor, random);
  }
  if (shape === "beacon") {
    const point = anchors?.beacon?.position ? new THREE.Vector3(...anchors.beacon.position) : new THREE.Vector3(...beacon);
    points = Array.from({ length: count }, () => {
      const y = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const ring = Math.sqrt(1 - y * y);
      const r = 0.025 + random() * 0.095;
      return { position: point.clone().add(new THREE.Vector3(Math.cos(angle) * ring * r, y * r, Math.sin(angle) * ring * r)), group: 0 };
    });
  }
  if (!points) {
    points = Array.from({ length: count }, () => {
      const y = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const ring = Math.sqrt(1 - y * y);
      const r = radius * Math.cbrt(random());
      return { position: shapeAnchor.clone().add(new THREE.Vector3(Math.cos(angle) * ring * r, y * r, Math.sin(angle) * ring * r)), group: 0 };
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
