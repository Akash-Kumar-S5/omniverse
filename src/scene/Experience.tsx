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

// Calibrated chapter shape anchors placing the particle swarm at 35-45% in the right frame
const SCENE_ANCHORS = {
  core: { position: [1.8, 0.4, 0] as [number, number, number], radius: 2.8 },
  bust: { position: [1.6, 0.2, 0] as [number, number, number], radius: 2.5 },
  helix: { position: [1.6, 0.2, 0] as [number, number, number], radius: 2.6 },
  glyph: { position: [1.8, 0.4, 0] as [number, number, number], radius: 2.8 },
  beacon: { position: [0.0, 1.2, 0] as [number, number, number], radius: 0.3 },
};

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
    // Upgrade to HIGH only if stable ~60fps maintained for ~3s
    if (current === "medium") {
      setQuality("high");
    } else if (current === "lite") {
      setQuality("medium");
    }
  };

  const handleDecline = () => {
    const current = useOmni.getState().quality;
    // Step down quality high -> medium -> lite on performance drop
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
      camera={{ fov: 48, near: 0.1, far: 200, position: [-1.6, 0.0, 11.2] }}
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
      <SignalField anchors={SCENE_ANCHORS} />
      <World />
      <AnchorWriters />
      <LoadProgress />
      <CameraRig />
      <Effects />
    </Canvas>
  );
}
