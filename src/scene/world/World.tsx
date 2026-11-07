import { Environment } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Floor from "./Floor";
import VolumeCone from "./VolumeCone";

function WorldLighting() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <ambientLight intensity={look.ambientIntensity} color="#d7c5ae" />
      <hemisphereLight args={["#b8a58b", "#171310", 0.42]} />
      <directionalLight position={[-7, 10, 5]} intensity={look.keyLightIntensity} color="#f0dbc0" />
      <pointLight position={[5, 3, -5]} intensity={quality === "lite" ? 1 : 1.8} color="#c8a77e" distance={28} />
      <Environment files="/assets/hdri/studio_small_09_1k.exr" resolution={quality === "lite" ? 128 : 256} background={false} />
    </>
  );
}

export default function World() {
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <WorldLighting />
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Dark reflective floor blending seamlessly into fog */}
      <Floor />

      {/* Volumetric light shaft from the ceiling oculus with floating dust motes */}
      <VolumeCone />

      {/* =========================================================================
          SLOT: Sanctum Architecture GLB
          Delivered by blender-sanctum: public/assets/models/sanctum.glb
          Nodes: sanctum_architecture, floor, oculus_shaft, bust_pedestal
          ========================================================================= */}
      <group name="sanctum-architecture-slot">
        {/* Placeholder group awaiting sanctum.glb delivery from blender-sanctum */}
      </group>
    </>
  );
}
