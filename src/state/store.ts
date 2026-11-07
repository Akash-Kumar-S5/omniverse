import { create } from "zustand";

export const SECTIONS = ["boot", "about", "experience", "projects", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];
export type Quality = "high" | "lite";

export interface OmniState {
  section: SectionId;
  /** 0..1 over the whole scrollable page */
  progress: number;
  /** 0..1 within the current section */
  sectionProgress: number;
  activeProject: number;
  activeRole: number;
  booted: boolean;
  quality: Quality;
  reducedMotion: boolean;
  webgl: boolean;
  setScroll: (s: { section: SectionId; progress: number; sectionProgress: number }) => void;
  setActiveProject: (i: number) => void;
  setActiveRole: (i: number) => void;
  setBooted: () => void;
  setQuality: (q: Quality) => void;
  setEnv: (e: { reducedMotion: boolean; webgl: boolean }) => void;
}

export const useOmni = create<OmniState>()((set) => ({
  section: "boot",
  progress: 0,
  sectionProgress: 0,
  activeProject: 0,
  activeRole: 0,
  booted: false,
  quality: "high",
  reducedMotion: false,
  webgl: true,
  setScroll: (s) => set(s),
  setActiveProject: (i) => set({ activeProject: i }),
  setActiveRole: (i) => set({ activeRole: i }),
  setBooted: () => set({ booted: true }),
  setQuality: (quality) => set({ quality }),
  setEnv: (e) => set(e),
}));
