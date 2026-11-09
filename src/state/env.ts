export function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    // r34: no loseContext() on this probe. Forcing a loss on a throwaway context while the real canvas is about to be created is a suspect
    // for the silent blank loads (unproven); an unreferenced probe is simply garbage collected.
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function readTestOverrides(search: string) {
  const params = new URLSearchParams(search);
  const index = Number(params.get("chapter"));
  return {
    skipGate: params.has("skipgate"),
    chapter: params.has("chapter") && Number.isInteger(index) && index >= 0 && index <= 4 ? index : null,
  };
}
