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
    ambientIntensity: 0.18,
    ambientColor: "#2a2520",
    keyLightIntensity: 2.0,
    keyLightColor: "#fff0da",
    fogColor: "#0b0907",
    fogNear: 6,
    fogFar: 24,
  },
  experience: {
    ambientIntensity: 0.16,
    ambientColor: "#24252a",
    keyLightIntensity: 1.8,
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
    ambientIntensity: 0.16,
    ambientColor: "#222026",
    keyLightIntensity: 1.2,
    keyLightColor: "#8aaae0",
    fogColor: "#0b0907",
    fogNear: 4,
    fogFar: 20,
  },
};
