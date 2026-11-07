import { Environment } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Sanctum from "./Sanctum";
import VolumeCone from "./VolumeCone";

function WorldLighting() {
  const quality = useOmni((s) => s.quality);

  return (
    <>
      <ambientLight intensity={0.16} color="#0c0e14" />
      <directionalLight position={[-5, 12, -4]} intensity={0.25} color="#d0c4b4" />
      <Environment
        files="/assets/hdri/studio_small_09_1k.exr"
        resolution={quality === "lite" ? 128 : 256}
        background={false}
        environmentIntensity={0.25}
      />
    </>
  );
}

export default function World() {
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <WorldLighting />
      {/* Fog precisely matching background (#060505) */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Authored Brutalist Sanctum Architecture & Floor with baked Cycles lightmaps */}
      <Sanctum />

      {/* Volumetric sunbeam descending through the ceiling oculus onto the core */}
      <VolumeCone />
    </>
  );
}
