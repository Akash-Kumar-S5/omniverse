import type { SectionId } from "../../state/store";

export interface ChapterLook {
  keyLightIntensity: number;
  ambientIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

// Seamless near-black fog matching canvas background (#060505) so the floor dissolves before 28 units with NO horizon line
export const chapterLook: Record<SectionId, ChapterLook> = {
  boot: { keyLightIntensity: 1.5, ambientIntensity: 0.18, fogColor: "#060505", fogNear: 8, fogFar: 28 },
  about: { keyLightIntensity: 1.4, ambientIntensity: 0.20, fogColor: "#060505", fogNear: 8, fogFar: 28 },
  experience: { keyLightIntensity: 1.2, ambientIntensity: 0.22, fogColor: "#060505", fogNear: 8, fogFar: 28 },
  projects: { keyLightIntensity: 1.8, ambientIntensity: 0.18, fogColor: "#060505", fogNear: 8, fogFar: 28 },
  contact: { keyLightIntensity: 1.5, ambientIntensity: 0.20, fogColor: "#060505", fogNear: 10, fogFar: 30 },
};
