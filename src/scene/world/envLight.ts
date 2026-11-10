import type { SectionId } from "../../state/store";

/**
 * R46 "reveal the sanctum": per-chapter environment light, owned by the orchestrator (design data only).
 * The subject stays the brightest thing; the hall reads as cool moonlit depth behind it.
 * Read by Sanctum.tsx (shell), Moonlight.tsx (glows, shafts, wash) and RuinChurch.tsx (silhouettes).
 */
export type V3 = [number, number, number];

/** Additive radial sprite (fog off) placed BEHIND architecture openings, so arches read as silhouettes. */
export interface Glow { pos: V3; size: number; color: string; opacity: number }
/** Additive moon-shaft plane (fog off), bright at the top and fading down. */
export interface Shaft { pos: V3; rot: V3; w: number; h: number; color: string; opacity: number }
/** The one soft cool spot raking architecture. Moonlight.tsx always mounts exactly one SpotLight (constant light count). */
export interface Wash { pos: V3; target: V3; color: string; intensity: number; angle: number; distance: number }
/** A ruined-church scan instance as a dark cool silhouette (tone = brightness, tinted cool). */
export interface Church { pos: V3; rotY: number; scale: number; tone: number }

export interface EnvLook {
  /** The baked sanctum_architecture shell. emissive lifts its baked lightmap (keep 0 in About: the bake has a hot spot there). */
  shell: { visible: boolean; color: number; emissive: number };
  glows: Glow[];
  shafts: Shaft[];
  wash: Wash | null;
  churches: Church[];
}

const HALL_GLOW: Glow[] = [
  { pos: [12, 5, -24], size: 30, color: "#5d6b86", opacity: 0.38 },
  { pos: [12, 4, -24], size: 70, color: "#2e3646", opacity: 0.25 },
];

export const ENV: Record<SectionId, EnvLook> = {
  boot: {
    shell: { visible: true, color: 1, emissive: 0.12 },
    glows: HALL_GLOW,
    shafts: [],
    wash: null,
    churches: [
      { pos: [14, 0, -6], rotY: 0.6, scale: 0.38, tone: 0.12 },
      { pos: [16, 0, -14], rotY: 1.7, scale: 0.5, tone: 0.12 },
    ],
  },
  about: {
    shell: { visible: true, color: 0.6, emissive: 0 },
    glows: [],
    shafts: [],
    wash: { pos: [11.5, 8, 1.0], target: [12.8, 1.5, 0.2], color: "#9fb2d4", intensity: 14, angle: 0.75, distance: 14 },
    churches: [],
  },
  experience: {
    shell: { visible: false, color: 1, emissive: 0 },
    glows: [{ pos: [-58, 6, 0], size: 44, color: "#4a5670", opacity: 0.32 }],
    shafts: [],
    wash: null,
    churches: [{ pos: [-40, 0, 2], rotY: 1.2, scale: 0.75, tone: 0.1 }],
  },
  projects: {
    shell: { visible: true, color: 0.25, emissive: 0.05 },
    glows: [],
    shafts: [],
    wash: null,
    churches: [],
  },
  contact: {
    shell: { visible: true, color: 1, emissive: 0.12 },
    glows: [
      { pos: [0, 5, -30], size: 30, color: "#5d6b86", opacity: 0.38 },
      { pos: [0, 4, -30], size: 70, color: "#2e3646", opacity: 0.25 },
    ],
    shafts: [],
    wash: null,
    churches: [
      { pos: [14, 0, -6], rotY: 0.6, scale: 0.38, tone: 0.048 },
      { pos: [16, 0, -14], rotY: 1.7, scale: 0.5, tone: 0.048 },
    ],
  },
};
