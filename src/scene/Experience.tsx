// Orchestrator-owned composition. Builders edit only their own folders.
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { useOmni } from "../state/store";
import Constellation from "./constellation/Constellation";
import CameraRig from "./camera/CameraRig";
import Starfield from "./fx/Starfield";
import Effects from "./fx/Effects";

export default function Experience() {
  const quality = useOmni((s) => s.quality);
  const [dpr, setDpr] = useState(2);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => setVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={quality === "lite" ? 1 : [1, dpr]}
      gl={{ antialias: quality !== "lite", powerPreference: "high-performance" }}
      camera={{ fov: 50, near: 0.1, far: 200, position: [0, 4, 24] }}
    >
      {quality !== "lite" && (
        <>
          <PerformanceMonitor
            flipflops={3}
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(2)}
            onFallback={() => setDpr(1)}
          />
          <AdaptiveDpr />
        </>
      )}
      <color attach="background" args={["#05060a"]} />
      <Starfield />
      <Constellation />
      <CameraRig />
      <Effects />
    </Canvas>
  );
}
