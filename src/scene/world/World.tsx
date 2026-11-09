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
  const section = useOmni((s) => s.section);
  const isContact = section === "contact";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const offsetY = (isMobile && isContact) ? -0.48 : 0;

  // Ember count multiplier on ch4 (Contact)
  const countMult = isContact ? 0.6 : 1.0;
  const sizeMult = 1.0;

  return (
    <group position={[0, offsetY, 0]}>
      {/* Warm golden-amber embers only (zero red halo, no fat bokeh): 2-4px crisp sparks, more of them, dimmer */}
      {/* 1. Fine glowing spark motes: warm gold, fast rise, randomised across pit radius */}
      <Sparkles
        count={Math.round((quality === "lite" ? 24 : 48) * countMult)}
        scale={[2.4, 2.5, 2.4]}
        position={[0, 1.35, 0]}
        color="#ffd48a"
        speed={0.75}
        size={(quality === "lite" ? 0.9 : 1.3) * sizeMult}
        noise={[0.85, 0.5, 0.85]}
        opacity={0.65}
      />

      {/* 2. Mid-sized ember sparks: warm amber-orange (no red halo), organic drift across pit */}
      <Sparkles
        count={Math.round((quality === "lite" ? 18 : 36) * countMult)}
        scale={[2.2, 2.2, 2.2]}
        position={[0, 1.25, 0]}
        color="#ffa842"
        speed={0.50}
        size={(quality === "lite" ? 1.2 : 1.7) * sizeMult}
        noise={[0.75, 0.5, 0.75]}
        opacity={0.52}
      />

      {/* 3. Small floating ember flakes: warm fiery gold (no red halo, capped size 2-4px) */}
      <Sparkles
        count={Math.round((quality === "lite" ? 14 : 28) * countMult)}
        scale={[2.0, 1.9, 2.0]}
        position={[0, 1.15, 0]}
        color="#ff882e"
        speed={0.35}
        size={(quality === "lite" ? 1.5 : 2.0) * sizeMult}
        noise={[0.65, 0.5, 0.65]}
        opacity={0.42}
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

      {/* Soft oculus light and floating motes */}
      <VolumeCone />
    </>
  );
}
