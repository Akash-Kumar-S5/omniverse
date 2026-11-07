// Contract (round 3). Orchestrator-owned. Shared by blender-sanctum, codex-world (particles) and agy-world (stage/camera).
import type { Quality, SectionId } from "./store";

/** Particle target shapes. */
export type ShapeId =
  | "core"            // boot: dense breathing sphere with fbm turbulence, under the oculus
  | "bust"            // about: marble_bust_01.glb sampled as points, in the side niche
  | "helix"           // experience: helix/timeline ribbon with 4 clusters (one per role)
  | "project-glyph"   // projects: glyph for store.activeProject (0..7)
  | "beacon";         // contact: collapse to a single pulsing point under open sky

export const CHAPTER_SHAPE: Record<SectionId, ShapeId> = {
  boot: "core",
  about: "bust",
  experience: "helix",
  projects: "project-glyph",
  contact: "beacon",
};

/**
 * Camera spots. Blender cameras are named `CAM_<spot>`; empties where shapes form are named
 * `ANCHOR_<shape>` (core, bust, helix, glyph, beacon). Both are exported to
 * `public/assets/models/sanctum.spots.json` (see SanctumSpots) and CameraRig reads that file.
 * Roles 0..3 and projects 0..7 each get their own spot so the camera can fly node to node.
 */
export const CHAPTER_SPOTS = {
  boot: ["boot_wide", "boot_under_oculus"],        // wide entry shot, then push-in beneath the oculus
  about: ["about_niche"],
  experience: ["exp_role_0", "exp_role_1", "exp_role_2", "exp_role_3"],
  projects: ["proj_gallery", "proj_0", "proj_1", "proj_2", "proj_3", "proj_4", "proj_5", "proj_6", "proj_7"],
  contact: ["contact_sky"],
} as const satisfies Record<SectionId, readonly string[]>;

export type SpotName = (typeof CHAPTER_SPOTS)[SectionId][number];

export interface SpotDef {
  /** world position, metres, Y up (glTF convention; export with +Y up) */
  position: [number, number, number];
  /** look-at target */
  target: [number, number, number];
  /** vertical field of view, degrees */
  fov: number;
}
export interface SanctumSpots {
  cameras: Record<SpotName, SpotDef>;
  /** where each particle shape forms, world space, plus its radius */
  anchors: Record<"core" | "bust" | "helix" | "glyph" | "beacon", { position: [number, number, number]; radius: number }>;
}
export const SANCTUM_FILES = {
  high: "/assets/models/sanctum.glb",
  lite: "/assets/models/sanctum-lite.glb",   // 1k textures, same node names
  spots: "/assets/models/sanctum.spots.json",
} as const;

/** Sim texture side length: particles = side*side. */
export const SIM_SIZE: Record<Quality, number> = {
  high: 512,   // 262k
  medium: 256, // 65k
  lite: 128,   // 16k
};

/** Quality tiers. PerformanceMonitor may step high -> medium -> lite. */
export interface TierFlags {
  dof: boolean;
  reflector: boolean;   // real-time floor reflection
  postFx: boolean;      // bloom/noise/vignette/CA; LITE keeps tone mapping only
  volumetrics: boolean; // runtime shaft shader + dust motes
}
export const TIERS: Record<Quality, TierFlags> = {
  high: { dof: true, reflector: true, postFx: true, volumetrics: true },
  medium: { dof: false, reflector: false, postFx: true, volumetrics: true },
  lite: { dof: false, reflector: false, postFx: false, volumetrics: false },
};

/**
 * Live, mutable scene signals (no React renders).
 * SignalField WRITES `focus`, `radius`, `morph`. CameraRig/Effects READ them.
 */
export const signal = {
  focus: [0, 1.2, 0] as [number, number, number],
  radius: 1.5,
  /** 0..1 morph progress between previous and current shape (1 = settled). */
  morph: 1,
  scrollVelocity: 0,
};

export interface SignalFieldProps {
  shape?: ShapeId;           // defaults to CHAPTER_SHAPE[store.section]
  quality?: Quality;
  reducedMotion?: boolean;   // cut to final shape, no turbulence
  /** Anchors from sanctum.spots.json; before it loads, fall back to origin. */
  anchors?: SanctumSpots["anchors"];
}
