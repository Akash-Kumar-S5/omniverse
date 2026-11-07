import { Environment } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Sanctum from "./Sanctum";
import VolumeCone from "./VolumeCone";
import Floor from "./Floor";

function WorldLighting() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      {/* Chapter-driven ambient and key lighting */}
      <ambientLight intensity={look.ambientIntensity} color={look.ambientColor} />
      <directionalLight position={[-5, 12, -4]} intensity={look.keyLightIntensity} color={look.keyLightColor} />

      {/* Chapter 1: About - warm key light and cool rim light for marble bust */}
      {section === "about" && (
        <group>
          <spotLight
            position={[8.4, 2.9, 1.6]}
            target-position={[11.0, 1.5, 0.0]}
            color="#fff2df"
            intensity={3.2}
            angle={0.55}
            penumbra={0.7}
          />
          <spotLight
            position={[12.6, 2.6, -1.4]}
            target-position={[11.0, 1.5, 0.0]}
            color="#99bbff"
            intensity={2.4}
            angle={0.45}
            penumbra={0.6}
          />
          <pointLight position={[9.5, 1.8, 0]} color="#556688" intensity={0.6} distance={8} />
        </group>
      )}

      {/* Chapter 2: Experience - portal aisle forward lights and archway definition */}
      {section === "experience" && (
        <group>
          <pointLight position={[-14, 4.2, 0]} intensity={2.8} distance={24} color="#d4e2f8" decay={1.1} />
          <pointLight position={[-21, 4.2, 0]} intensity={2.4} distance={22} color="#f0e4d0" decay={1.1} />
          <directionalLight position={[-20, 8, 2]} intensity={1.4} color="#e0e8f4" />
        </group>
      )}

      {/* Chapter 3: Projects - monolith rim lights separating slabs from dark background + lifted midtones */}
      {section === "projects" && (
        <group>
          {/* Rim lights grazing the tops and edges of slabs from behind */}
          <directionalLight position={[0, 6.5, -30]} intensity={2.6} color="#a0c8ff" />
          <pointLight position={[-4.2, 4.5, -16]} intensity={2.4} distance={18} color="#b0d4ff" decay={1.2} />
          <pointLight position={[4.2, 4.5, -21]} intensity={2.4} distance={18} color="#b0d4ff" decay={1.2} />
          {/* Midtone lift fill down the gallery */}
          <pointLight position={[0, 5.5, -18]} intensity={2.6} distance={25} color="#d8e4f8" decay={1.1} />
          <directionalLight position={[5, 4, -12]} intensity={1.4} color="#e4ddd2" />
        </group>
      )}

      {/* Chapter 4: Contact - open night court moon light and cool courtyard bounce */}
      {section === "contact" && (
        <group>
          <directionalLight position={[2, 16, 14]} intensity={2.2} color="#8cb0f0" />
          <pointLight position={[0, 4, 14]} intensity={1.6} distance={20} color="#557db8" decay={1.1} />
        </group>
      )}

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
      {/* Fog precisely matching background (#060505) with seamless falloff */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Authored Brutalist Sanctum Architecture & Marble Bust with baked lightmaps */}
      <Sanctum />

      {/* Seamless ground plane matching background to eliminate any hard horizon */}
      <Floor />

      {/* Volumetric sunbeam descending through the ceiling oculus onto the core */}
      <VolumeCone />
    </>
  );
}
