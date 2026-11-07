// Contract (round 2). OWNER: codex-chapters may replace the implementation but must keep the API.
// The overlay layer renders ONLY the chapter returned here; `phase` drives enter/exit transitions,
// so two section overlays are never visible at the same time.
import { useSyncExternalStore } from "react";
import { SECTIONS, useOmni, type SectionId } from "./store";

export type ChapterPhase = "enter" | "idle" | "exit";

export interface ChapterState {
  /** The single chapter whose overlay may be visible. */
  active: SectionId;
  phase: ChapterPhase;
  /** 0..1 progress inside the active chapter. */
  progress: number;
}

const EXIT_MS = 350;
const ENTER_MS = 240;
const FORWARD_THRESHOLD = 0.06;
const BACKWARD_THRESHOLD = 0.94;

let snapshot: ChapterState = { active: "boot", phase: "idle", progress: 0 };
let timer: ReturnType<typeof setTimeout> | undefined;
let pending: SectionId | undefined;
const listeners = new Set<() => void>();

function publish(next: ChapterState) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function clearTransition() {
  if (timer !== undefined) clearTimeout(timer);
  timer = undefined;
  pending = undefined;
}

function transitionTo(section: SectionId, reducedMotion: boolean) {
  clearTransition();
  if (section === snapshot.active) {
    if (snapshot.phase !== "idle") publish({ ...snapshot, phase: "idle" });
    return;
  }

  pending = section;
  if (reducedMotion) {
    publish({ active: section, phase: "idle", progress: useOmni.getState().sectionProgress });
    pending = undefined;
    return;
  }

  publish({ ...snapshot, phase: "exit" });
  timer = setTimeout(() => {
    const next = pending;
    timer = undefined;
    if (!next) return;
    publish({ active: next, phase: "enter", progress: useOmni.getState().sectionProgress });
    timer = setTimeout(() => {
      timer = undefined;
      pending = undefined;
      publish({ ...snapshot, phase: "idle" });
    }, ENTER_MS);
  }, EXIT_MS);
}

function updateFromScroll() {
  const { section, sectionProgress, reducedMotion } = useOmni.getState();
  const activeIndex = SECTIONS.indexOf(snapshot.active);
  const candidateIndex = SECTIONS.indexOf(section);
  const passedBand = candidateIndex > activeIndex
    ? sectionProgress >= FORWARD_THRESHOLD
    : candidateIndex < activeIndex
      ? sectionProgress <= BACKWARD_THRESHOLD
      : true;

  if (section !== snapshot.active && passedBand) {
    if (pending !== section || snapshot.phase !== "exit") transitionTo(section, reducedMotion);
  } else if (snapshot.phase === "exit" && section === snapshot.active) {
    clearTransition();
    publish({ ...snapshot, phase: "idle" });
  }

  if (snapshot.phase !== "exit" && snapshot.progress !== sectionProgress && section === snapshot.active) {
    publish({ ...snapshot, progress: sectionProgress });
  }
}

// Keep one shared transition controller even when several overlays subscribe to the hook.
useOmni.subscribe(updateFromScroll);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** One active overlay, with a small boundary dead-zone and serialized exit/enter phases. */
export function useChapter(): ChapterState {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}
