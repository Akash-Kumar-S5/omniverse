export function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    // Release the probe context right away so it never counts against the browser's context cap.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
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
