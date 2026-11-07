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

// Seamless near-black fog matching canvas background (#060505) so the floor dissolves before 32 units with NO horizon line
export const chapterLook: Record<SectionId, ChapterLook> = {
  boot: {
    ambientIntensity: 0.35,
    ambientColor: "#221c16",
    keyLightIntensity: 1.8,
    keyLightColor: "#fff1de",
    fogColor: "#060505",
    fogNear: 12,
    fogFar: 34,
  },
  about: {
    ambientIntensity: 0.42,
    ambientColor: "#262220",
    keyLightIntensity: 2.0,
    keyLightColor: "#fff0da",
    fogColor: "#060505",
    fogNear: 10,
    fogFar: 32,
  },
  experience: {
    ambientIntensity: 0.52,
    ambientColor: "#242830",
    keyLightIntensity: 1.8,
    keyLightColor: "#e6eaf0",
    fogColor: "#060505",
    fogNear: 12,
    fogFar: 36,
  },
  projects: {
    ambientIntensity: 0.48,
    ambientColor: "#25262c",
    keyLightIntensity: 2.2,
    keyLightColor: "#e0e8f4",
    fogColor: "#060505",
    fogNear: 12,
    fogFar: 36,
  },
  contact: {
    ambientIntensity: 0.40,
    ambientColor: "#1a2230",
    keyLightIntensity: 1.6,
    keyLightColor: "#8aaae0",
    fogColor: "#060505",
    fogNear: 14,
    fogFar: 38,
  },
};
