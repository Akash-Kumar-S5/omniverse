// Orchestrator-owned composition. Builders edit only their own folders.
import { Canvas } from "@react-three/fiber";
import { useOmni } from "../state/store";
import Constellation from "./constellation/Constellation";
import CameraRig from "./camera/CameraRig";
import Starfield from "./fx/Starfield";
import Effects from "./fx/Effects";

export default function Experience() {
  const quality = useOmni((s) => s.quality);
  return (
    <Canvas
      dpr={quality === "lite" ? 1 : [1, 2]}
      gl={{ antialias: quality !== "lite", powerPreference: "high-performance" }}
      camera={{ fov: 50, near: 0.1, far: 200, position: [0, 4, 24] }}
    >
      <color attach="background" args={["#05060a"]} />
      <Starfield />
      <Constellation />
      <CameraRig />
      <Effects />
    </Canvas>
  );
}
