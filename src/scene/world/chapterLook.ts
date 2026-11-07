import type { SectionId } from "../../state/store";

/** Lighting cues mirrored from codex-chapters' chapterLook.ts until that file merges. */
export interface ChapterLook {
  keyLightIntensity: number;
  ambientIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
}

export const chapterLook: Record<SectionId, ChapterLook> = {
  boot: { keyLightIntensity: 2.2, ambientIntensity: 0.24, fogColor: "#11100f", fogNear: 18, fogFar: 70 },
  about: { keyLightIntensity: 1.5, ambientIntensity: 0.32, fogColor: "#10110f", fogNear: 14, fogFar: 58 },
  experience: { keyLightIntensity: 1.15, ambientIntensity: 0.38, fogColor: "#0e1111", fogNear: 12, fogFar: 54 },
  projects: { keyLightIntensity: 2.6, ambientIntensity: 0.2, fogColor: "#0d1014", fogNear: 10, fogFar: 46 },
  contact: { keyLightIntensity: 1.8, ambientIntensity: 0.28, fogColor: "#11100f", fogNear: 20, fogFar: 76 },
};
