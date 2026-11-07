// Contract (round 3). Orchestrator-owned. Shared by particles (codex-world) and world/camera/fx (agy-world).
import type { Quality, SectionId } from "./store";

/** Particle target shapes. One per chapter, plus per-project glyphs. */
export type ShapeId =
  | "core"            // boot: dense breathing sphere with fbm turbulence
  | "bust"            // about: public/assets/models/marble_bust_01.glb sampled as points
  | "helix"           // experience: helix/timeline ribbon with 4 clusters (one per role)
  | "project-glyph"   // projects: glyph for store.activeProject (index into glyph list)
  | "beacon";         // contact: collapse to a single pulsing point

export const CHAPTER_SHAPE: Record<SectionId, ShapeId> = {
  boot: "core",
  about: "bust",
  experience: "helix",
  projects: "project-glyph",
  contact: "beacon",
};

/** Sim texture side length: particles = side*side. */
export const SIM_SIZE: Record<Quality | "medium", number> = {
  high: 512,   // 262k
  medium: 256, // 65k
  lite: 128,   // 16k
};

/** Quality tiers. store.quality gains "medium"; PerformanceMonitor may step high -> medium -> lite. */
export interface TierFlags {
  dof: boolean;
  reflector: boolean;
  postFx: boolean;      // bloom/noise/vignette/CA; LITE keeps tone mapping only
  transmission: boolean; // monolith transmission material
}
export const TIERS: Record<Quality | "medium", TierFlags> = {
  high: { dof: true, reflector: true, postFx: true, transmission: true },
  medium: { dof: false, reflector: true, postFx: true, transmission: false },
  lite: { dof: false, reflector: false, postFx: false, transmission: false },
};

/**
 * Live, mutable scene signals (no React renders). SignalField WRITES `focus` and `swarmCenter`;
 * CameraRig/Effects READ them. Camera WRITES nothing here.
 */
export const signal = {
  /** World-space point the camera/DOF should focus on (centre of the current shape). */
  focus: [0, 1.2, 0] as [number, number, number],
  /** Radius of the current shape in world units, for DOF/camera framing. */
  radius: 1.5,
  /** 0..1 morph progress between previous and current shape (1 = settled). */
  morph: 1,
  /** Smoothed scroll velocity, 0..1 abs, fed into shaders by anyone who wants it. */
  scrollVelocity: 0,
};

export interface SignalFieldProps {
  /** Shape to form. Defaults to CHAPTER_SHAPE[store.section]. */
  shape?: ShapeId;
  quality?: Quality | "medium";
  reducedMotion?: boolean; // cut to final shape, no turbulence
}
