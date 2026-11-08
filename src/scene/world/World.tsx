import * as THREE from "three";
import { Environment, Sparkles, Clouds, Cloud } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Sanctum from "./Sanctum";
import VolumeCone from "./VolumeCone";
import Floor from "./Floor";
import ProjectArtefact from "./ProjectArtefact";
import Fire from "./Fire";

/**
 * Light is fire + moon only. The single warm source is the flickering point light in Fire.tsx.
 * The single cold source is one moon key down the oculus, at about 30% of the old key intensity.
 * The old per-chapter blue fills, rim lights and warm candle/spot lights are gone: the walls fall to black.
 */
function WorldLighting() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <ambientLight intensity={0.03} color="#1a1c24" />
      <directionalLight position={[0, 14, -1.5]} intensity={look.keyLightIntensity * 0.3} color="#9fb3d1" />
      <Environment
        files="/assets/hdri/studio_small_09_1k.exr"
        resolution={quality === "lite" ? 128 : 256}
        background={false}
        environmentIntensity={0.04}
      />
    </>
  );
}

function SparksAndMist() {
  const quality = useOmni((s) => s.quality);

  return (
    <group>
      {/* A few small sparks rising from the plinth fire */}
      <Sparkles
        count={quality === "lite" ? 24 : 60}
        scale={[2.2, 4.0, 2.2]}
        position={[0, 2.2, 0]}
        color="#ff721a"
        speed={0.7}
        size={2.2}
        noise={[0.4, 1.2, 0.4]}
        opacity={0.8}
      />

      {/* Low subtle floor mist across the cold stone ruins */}
      <Clouds material={THREE.MeshBasicMaterial} limit={40}>
        <Cloud
          seed={42}
          segments={quality === "lite" ? 8 : 16}
          bounds={[24, 0.7, 32]}
          position={[0, 0.32, -6]}
          volume={3.5}
          color="#2e2824"
          opacity={0.13}
          speed={0.12}
          fade={22}
        />
      </Clouds>
    </group>
  );
}

export default function World() {
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <WorldLighting />
      <SparksAndMist />
      <Fire />
      {/* Fog precisely matching background (#060505) with seamless falloff */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Ruined gothic sanctum architecture with baked firelight */}
      <Sanctum />

      {/* Seamless ground plane matching background to eliminate any hard horizon */}
      <Floor />

      {/* Lit readable hero artefact per project beside the active slab */}
      <ProjectArtefact />

      {/* Volumetric moonbeam descending through the ceiling oculus onto the fire */}
      <VolumeCone />
    </>
  );
}
