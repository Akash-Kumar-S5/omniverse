// Orchestrator-owned composition.
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useOmni } from "../state/store";
import CameraRig from "./camera/CameraRig";
import Starfield from "./fx/Starfield";
import Effects from "./fx/Effects";
import { World, LoadProgress } from "./world";
import { AnchorWriters } from "./anchors";
import { SignalField } from "./particles";
import spotsData from "../../public/assets/models/sanctum.spots.json";
import type { SanctumSpots } from "../state/signal";

const sanctumSpots = spotsData as unknown as SanctumSpots;

export default function Experience() {
  const quality = useOmni((s) => s.quality);
  const setQuality = useOmni((s) => s.setQuality);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => setVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const handleIncline = () => {
    const current = useOmni.getState().quality;
    if (current === "medium") {
      setQuality("high");
    } else if (current === "lite") {
      setQuality("medium");
    }
  };

  const handleDecline = () => {
    const current = useOmni.getState().quality;
    if (current === "high") {
      setQuality("medium");
    } else if (current === "medium") {
      setQuality("lite");
    }
  };

  const handleFallback = () => {
    setQuality("lite");
  };

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={quality === "high" ? [1, 1.5] : 1}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 62, near: 0.1, far: 200, position: [-4.6, 1.7, 5.2] }}
    >
      <PerformanceMonitor
        iterations={12}
        ms={250}
        threshold={0.85}
        bounds={(refreshrate) => [55, Math.min(refreshrate, 59)]}
        onIncline={handleIncline}
        onDecline={handleDecline}
        onFallback={handleFallback}
      />
      <color attach="background" args={["#060505"]} />
      <Starfield />
      <SignalField anchors={sanctumSpots.anchors} />
      <World />
      <AnchorWriters />
      <LoadProgress />
      <CameraRig />
      <Effects />
    </Canvas>
  );
}
