// Contract (round 2). OWNER: codex-chapters may replace the implementation but must keep the API.
// The overlay layer renders ONLY the chapter returned here; `phase` drives enter/exit transitions,
// so two section overlays are never visible at the same time.
import { useOmni, type SectionId } from "./store";

export type ChapterPhase = "enter" | "idle" | "exit";

export interface ChapterState {
  /** The single chapter whose overlay may be visible. */
  active: SectionId;
  phase: ChapterPhase;
  /** 0..1 progress inside the active chapter. */
  progress: number;
}

/** Stub: follows store.section directly. codex-chapters adds hysteresis and exit/enter phases. */
export function useChapter(): ChapterState {
  const active = useOmni((s) => s.section);
  const progress = useOmni((s) => s.sectionProgress);
  return { active, phase: "idle", progress };
}
