import { useEffect } from "react";
import { SECTIONS, useOmni, type SectionId } from "./store";

/**
 * Maps window scroll onto store section/progress/sectionProgress.
 * Sections are DOM elements with data-section="<SectionId>" rendered by the overlay.
 * Writes to the store via getState() so the scene can read it per frame without re-renders.
 */
export function useScrollSync() {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / max));
      const mid = y + window.innerHeight * 0.5;
      let section: SectionId = "boot";
      let sectionProgress = 0;
      for (const id of SECTIONS) {
        const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
        if (!el) continue;
        const top = el.offsetTop;
        const h = Math.max(1, el.offsetHeight);
        if (mid >= top) {
          section = id;
          sectionProgress = Math.min(1, Math.max(0, (mid - top) / h));
        }
      }
      const s = useOmni.getState();
      if (s.section !== section || s.progress !== progress || s.sectionProgress !== sectionProgress) {
        s.setScroll({ section, progress, sectionProgress });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
