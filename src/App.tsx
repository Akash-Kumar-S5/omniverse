import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { useOmni } from "./state/store";
import { detectWebGL, prefersReducedMotion } from "./state/env";
import { useScrollSync } from "./state/useScrollSync";
import { useSmoothScroll } from "./state/smooth";
import Overlay from "./ui/Overlay";
import Fallback from "./ui/Fallback";

const Experience = lazy(() => import("./scene/Experience"));

export default function App() {
  const webgl = useOmni((s) => s.webgl);
  // Env is detected in a layout effect (before first paint, never during render).
  // Render nothing until then so the 3D chunk is never requested on no-WebGL devices.
  const [envReady, setEnvReady] = useState(false);
  useScrollSync(envReady);
  useSmoothScroll();

  useLayoutEffect(() => {
    const params = new URLSearchParams(location.search);
    // WebGL support is probed once; only reduced motion can change at runtime.
    const webglOk = !params.has("nogl") && detectWebGL();
    useOmni.getState().setEnv({ reducedMotion: prefersReducedMotion(), webgl: webglOk });
    if (params.has("lite")) useOmni.getState().setQuality("lite");
    setEnvReady(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => useOmni.getState().setEnv({ reducedMotion: mq.matches, webgl: webglOk });
    mq.addEventListener("change", onMotionChange);
    return () => mq.removeEventListener("change", onMotionChange);
  }, []);

  if (!envReady) return null;
  if (!webgl) return <Fallback />;

  return (
    <>
      <div className="scene-layer" aria-hidden="true">
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </div>
      <Overlay />
    </>
  );
}
