// Contract (round 2). OWNER: codex-chapters. Mounts Lenis for the page.
import { useEffect } from "react";
import Lenis from "lenis";
import { useOmni, type SectionId } from "./store";

let activeLenis: Lenis | undefined;

/** Scroll to a chapter element, using the active Lenis instance when available. */
export function scrollToSection(id: SectionId, immediate = false) {
  const element = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
  if (!element) return;

  if (immediate) {
    if (activeLenis) {
      activeLenis.scrollTo(element, { immediate: true });
    }
    element.scrollIntoView({ block: "start", behavior: "instant" });
    return;
  }

  if (activeLenis) {
    activeLenis.scrollTo(element, { duration: 1.1 });
  } else {
    const top = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

/** One animation-frame loop drives Lenis; reduced-motion users keep native scrolling. */
export function useSmoothScroll(enabled = true): void {
  const reducedMotion = useOmni((state) => state.reducedMotion);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: false });
    activeLenis = lenis;
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = undefined;
    };
  }, [enabled, reducedMotion]);
}

