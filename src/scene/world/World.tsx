import { Environment } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Floor from "./Floor";
import VolumeCone from "./VolumeCone";

function WorldLighting() {
  const quality = useOmni((s) => s.quality);

  return (
    <>
      <ambientLight intensity={0.12} color="#0c0e14" />
      <directionalLight position={[-5, 12, -4]} intensity={0.2} color="#d0c4b4" />
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
      {/* Fog precisely matching background (#05060a) to dissolve the floor before 26 units */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Near-black reflective wet floor with seamless fog fade */}
      <Floor />

      {/* Clearly visible volumetric sunlight beam from oculus hitting the swarm */}
      <VolumeCone />

      {/* =========================================================================
          SLOT: Sanctum Architecture GLB
          Delivered by blender-sanctum: public/assets/models/sanctum.glb
          ========================================================================= */}
      <group name="sanctum-architecture-slot" />
    </>
  );
}
