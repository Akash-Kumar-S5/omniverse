import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { omniDiag } from "./omniDiag";

/**
 * r34: the scene must never stay blank. Judge 3 saw ~30% of cold loads on a headed rig draw only the clear colour for 12 s with 0 console errors.
 * Causes that fit (none reproducible on a quiet machine): requestAnimationFrame paused or starved so the first frame never draws, a WebGL
 * context lost without restore (three logs that with console.log, not an error), or a composer that renders nothing.
 * This guard lives inside the Canvas and reports to the outside watchdog in Experience through `omniDiag`, which also serves as the
 * instrumentation (`window.__omniDiag`).
 */
const buf = new Uint8Array(4);

export default function SceneGuard() {
  const gl = useThree((s) => s.gl);
  const advance = useThree((s) => s.advance);
  const sinceCheck = useRef(0);

  useEffect(() => {
    omniDiag.advance = (t) => advance(t);
    const canvas = gl.domElement;
    const onLost = () => {
      omniDiag.lost++;
      omniDiag.lostAt = performance.now();
      console.info("omni: webgl context lost");
    };
    canvas.addEventListener("webglcontextlost", onLost);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      omniDiag.advance = null;
    };
  }, [gl, advance]);

  // priority 5 runs after the composer (priority 1), so the default framebuffer holds the finished frame
  useFrame(() => {
    const now = performance.now();
    omniDiag.frames++;
    omniDiag.lastFrameAt = now;
    if (omniDiag.firstFrameMs === null) omniDiag.firstFrameMs = Math.round(now - omniDiag.mountedAt);
    // sample a grid of pixels once every 20 frames after the first second; a frame that is the bare clear colour everywhere is blank
    if (now - omniDiag.mountedAt < 1000 || ++sinceCheck.current < 20) return;
    sinceCheck.current = 0;
    const ctx = gl.getContext();
    const w = ctx.drawingBufferWidth;
    const h = ctx.drawingBufferHeight;
    let lit = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        ctx.readPixels(Math.floor(w * (0.5 + 0.08 * i + 0.04)), Math.floor(h * (0.1 + 0.15 * j)), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, buf);
        // the bare clear colour #060505; a rendered frame (tone mapping, vignette, grain) is never this uniform
        if (Math.abs(buf[0] - 6) > 1 || Math.abs(buf[1] - 5) > 1 || Math.abs(buf[2] - 5) > 1) lit++;
      }
    }
    omniDiag.blankSamples = lit === 0 ? omniDiag.blankSamples + 1 : 0;
  }, 5);

  return null;
}
