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
  /** User passed the Enter gate (set automatically for reduced motion / lite / ?skipgate). */
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
  setSection: (section: SectionId) => void;
}

const getInitialParams = () => {
  if (typeof window === "undefined") {
    return { section: "boot" as SectionId, entered: false };
  }
  const params = new URLSearchParams(window.location.search);
  const skipgate = params.has("skipgate");
  const ch = params.get("chapter");
  let section: SectionId = "boot";
  if (ch === "0" || ch === "boot") section = "boot";
  else if (ch === "1" || ch === "about") section = "about";
  else if (ch === "2" || ch === "experience") section = "experience";
  else if (ch === "3" || ch === "projects") section = "projects";
  else if (ch === "4" || ch === "contact") section = "contact";
  return { section, entered: skipgate };
};

const initial = getInitialParams();

export const useOmni = create<OmniState>()((set) => ({
  section: initial.section,
  progress: 0,
  sectionProgress: 0,
  activeProject: 0,
  activeRole: 0,
  booted: false,
  entered: initial.entered,
  loadProgress: 0,
  quality: "medium", // Default tier MEDIUM for smooth 60fps start
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
  setSection: (section) => set({ section }),
}));

if (typeof window !== "undefined") {
  (window as unknown as { __OMNI_STORE__: typeof useOmni }).__OMNI_STORE__ = useOmni;
}
