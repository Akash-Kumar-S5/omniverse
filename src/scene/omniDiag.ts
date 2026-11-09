// r34: shared state of the scene watchdog (see SceneGuard.tsx); also exposed as window.__omniDiag for instrumentation
export interface OmniDiag {
  mountedAt: number;
  frames: number;
  lastFrameAt: number;
  firstFrameMs: number | null;
  lost: number;
  lostAt: number;
  blankSamples: number;
  driven: number;
  remounts: number;
  advance: ((t: number) => void) | null;
}

export const omniDiag: OmniDiag = {
  mountedAt: 0,
  frames: 0,
  lastFrameAt: 0,
  firstFrameMs: null,
  lost: 0,
  lostAt: 0,
  blankSamples: 0,
  driven: 0,
  remounts: 0,
  advance: null,
};
(window as unknown as { __omniDiag: OmniDiag }).__omniDiag = omniDiag;

export function resetDiag() {
  omniDiag.mountedAt = performance.now();
  omniDiag.frames = 0;
  omniDiag.lastFrameAt = 0;
  omniDiag.firstFrameMs = null;
  omniDiag.lost = 0;
  omniDiag.lostAt = 0;
  omniDiag.blankSamples = 0;
  omniDiag.advance = null;
}
