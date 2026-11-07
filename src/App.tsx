import { lazy, Suspense, useEffect } from "react";
import { useOmni } from "./state/store";
import { detectWebGL, prefersReducedMotion } from "./state/env";
import { useScrollSync } from "./state/useScrollSync";
import Overlay from "./ui/Overlay";
import Fallback from "./ui/Fallback";

const Experience = lazy(() => import("./scene/Experience"));

export default function App() {
  const webgl = useOmni((s) => s.webgl);
  useScrollSync();

  useEffect(() => {
    const forceNoGL = new URLSearchParams(location.search).has("nogl");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => useOmni.getState().setEnv({ reducedMotion: prefersReducedMotion(), webgl: !forceNoGL && detectWebGL() });
    apply();
    if (new URLSearchParams(location.search).has("lite")) useOmni.getState().setQuality("lite");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
