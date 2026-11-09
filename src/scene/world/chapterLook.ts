import type { SectionId } from "../../state/store";

export interface ChapterLook {
  ambientIntensity: number;
  ambientColor: string;
  keyLightIntensity: number;
  keyLightColor: string;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

// R17 Lane B: Fog colour ~#0b0907 with higher density so far pillars show as 2-3 faint silhouette layers (target background luminance 3-6%)
export const chapterLook: Record<SectionId, ChapterLook> = {
  boot: {
    ambientIntensity: 0.16,
    ambientColor: "#2a241d",
    keyLightIntensity: 1.8,
    keyLightColor: "#fff1de",
    fogColor: "#0b0907",
    fogNear: 5,
    fogFar: 22,
  },
  about: {
    ambientIntensity: 0.30,   // r20: back toward c14 (0.38) so the warm back glow returns; the wall edges stay hidden by fog and the hidden floor
    ambientColor: "#262220",
    keyLightIntensity: 1.9,
    keyLightColor: "#fff0da",
    fogColor: "#0b0907",
    fogNear: 6.2,
    fogFar: 7.4,   // r25: the bottom-right room corner (~7.7 m) falls mostly into fog; the statue (~6.2 m) is ahead of fogNear
  },
  experience: {
    ambientIntensity: 0.12,
    ambientColor: "#1e1a17",
    keyLightIntensity: 1.4,
    keyLightColor: "#e6eaf0",
    fogColor: "#0b0907",
    fogNear: 5,
    fogFar: 22,
  },
  projects: {
    ambientIntensity: 0.16,
    ambientColor: "#24252a",
    keyLightIntensity: 2.2,
    keyLightColor: "#e0e8f4",
    fogColor: "#0b0907",
    fogNear: 6,
    fogFar: 24,
  },
  contact: {
    ambientIntensity: 0.14,
    ambientColor: "#201e24",
    keyLightIntensity: 1.2,
    keyLightColor: "#8aaae0",
    fogColor: "#0b0907",
    fogNear: 4,
    fogFar: 20,
  },
};
