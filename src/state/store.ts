import { create } from "zustand";

export const SECTIONS = ["boot", "about", "experience", "projects", "contact"] as const;
export type SectionId = (typeof SECTIONS)[number];
export type Quality = "high" | "medium" | "lite";

export interface OmniState {
  section: SectionId;
  /** 0..1 over the whole scrollable page */
  progress: number;
  /** 0..1 within the current section */
  sectionProgress: number;
  activeProject: number;
  activeRole: number;
  booted: boolean;
  /** User passed the Enter gate (set automatically for reduced motion / lite). */
  entered: boolean;
  /** 0..100 asset loading progress, written by the scene (drei useProgress inside the Canvas). */
  loadProgress: number;
  quality: Quality;
  reducedMotion: boolean;
  webgl: boolean;
  setScroll: (s: { section: SectionId; progress: number; sectionProgress: number }) => void;
  setActiveProject: (i: number) => void;
  setActiveRole: (i: number) => void;
  setBooted: () => void;
  setEntered: () => void;
  setLoadProgress: (p: number) => void;
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
  entered: false,
  loadProgress: 0,
  quality: "high",
  reducedMotion: false,
  webgl: true,
  setScroll: (s) => set(s),
  setActiveProject: (i) => set({ activeProject: i }),
  setActiveRole: (i) => set({ activeRole: i }),
  setBooted: () => set({ booted: true }),
  setEntered: () => set({ entered: true }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
  setQuality: (quality) => set({ quality }),
  setEnv: (e) => set(e),
}));
