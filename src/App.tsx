import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { useOmni } from "./state/store";
import { detectWebGL, prefersReducedMotion, readTestOverrides } from "./state/env";
import { useScrollSync } from "./state/useScrollSync";
import { scrollToSection, useSmoothScroll } from "./state/smooth";
import { SECTIONS } from "./state/store";
import Overlay from "./ui/Overlay";
import Fallback from "./ui/Fallback";

const Experience = lazy(() => import("./scene/Experience"));

export default function App() {
  const webgl = useOmni((s) => s.webgl);
  const { skipGate, chapter } = readTestOverrides(location.search);
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
    if (skipGate || chapter !== null) {
      useOmni.getState().setEntered();
      useOmni.getState().setBooted();
    }
    setEnvReady(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => useOmni.getState().setEnv({ reducedMotion: mq.matches, webgl: webglOk });
    mq.addEventListener("change", onMotionChange);
    return () => mq.removeEventListener("change", onMotionChange);
  }, [chapter, skipGate]);

  useLayoutEffect(() => {
    if (!envReady || chapter === null) return;
    const section = SECTIONS[chapter];
    useOmni.getState().setScroll({ section, progress: chapter / (SECTIONS.length - 1), sectionProgress: 0.5 });
    scrollToSection(section, true);
  }, [chapter, envReady]);

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
