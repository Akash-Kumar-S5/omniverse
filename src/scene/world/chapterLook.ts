import type { SectionId } from "../../state/store";

export interface ChapterLook {
  keyLightIntensity: number;
  ambientIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

// Seamless dark fog matching canvas background (#05060a) to eliminate any horizon line
export const chapterLook: Record<SectionId, ChapterLook> = {
  boot: { keyLightIntensity: 1.8, ambientIntensity: 0.22, fogColor: "#05060a", fogNear: 10, fogFar: 32 },
  about: { keyLightIntensity: 1.5, ambientIntensity: 0.26, fogColor: "#05060a", fogNear: 8, fogFar: 30 },
  experience: { keyLightIntensity: 1.2, ambientIntensity: 0.28, fogColor: "#05060a", fogNear: 8, fogFar: 32 },
  projects: { keyLightIntensity: 2.0, ambientIntensity: 0.20, fogColor: "#05060a", fogNear: 8, fogFar: 30 },
  contact: { keyLightIntensity: 1.6, ambientIntensity: 0.24, fogColor: "#05060a", fogNear: 12, fogFar: 36 },
};
