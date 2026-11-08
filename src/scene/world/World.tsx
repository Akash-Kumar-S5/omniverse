import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Sparkles, Clouds, Cloud } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Sanctum from "./Sanctum";
import VolumeCone from "./VolumeCone";
import Floor from "./Floor";
import ProjectArtefact from "./ProjectArtefact";

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

function PlinthFireAndMist() {
  const lightRef = useRef<THREE.PointLight>(null);
  const hearthLightRef = useRef<THREE.PointLight>(null);
  const section = useOmni((s) => s.section);
  const quality = useOmni((s) => s.quality);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lightRef.current) {
      // Warm flickering firelight at the central plinth
      const flicker =
        Math.sin(t * 8.5) * 0.45 +
        Math.sin(t * 19.3) * 0.25 +
        Math.cos(t * 31.7) * 0.15;
      lightRef.current.intensity = 3.6 + flicker;
    }
    if (hearthLightRef.current) {
      const flicker =
        Math.sin(t * 7.2) * 0.4 +
        Math.cos(t * 18.1) * 0.2;
      hearthLightRef.current.intensity = 3.2 + flicker;
    }
  });

  return (
    <group>
      {/* Central Plinth Fire: warm flickering point light and drifting sparks */}
      <group position={[0, 1.3, 0]}>
        <pointLight
          ref={lightRef}
          color="#ff7b24"
          intensity={3.6}
          distance={18}
          decay={1.2}
        />
        <pointLight
          color="#ff3e08"
          intensity={1.8}
          distance={6}
          decay={1.5}
        />
        {/* Floating embers and ash above the fire pit (<= 200 total) */}
        <Sparkles
          count={quality === "lite" ? 50 : 130}
          scale={[3.2, 5.0, 3.2]}
          position={[0, 1.6, 0]}
          color="#ff721a"
          speed={0.7}
          size={2.4}
          noise={[0.4, 1.2, 0.4]}
          opacity={0.8}
        />
      </group>

      {/* Chapter 4: Resting Hearth Fire in the open courtyard */}
      {section === "contact" && (
        <group position={[0.95, 2.2, 16.5]}>
          <pointLight
            ref={hearthLightRef}
            color="#ff6a18"
            intensity={3.2}
            distance={14}
            decay={1.2}
          />
          <Sparkles
            count={quality === "lite" ? 30 : 60}
            scale={[2.4, 3.8, 2.4]}
            position={[0, 0.8, 0]}
            color="#ff6010"
            speed={0.6}
            size={2.0}
            noise={[0.3, 0.8, 0.3]}
            opacity={0.75}
          />
        </group>
      )}

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
      <PlinthFireAndMist />
      {/* Fog precisely matching background (#060505) with seamless falloff */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Authored Brutalist Sanctum Architecture & Marble Bust with baked lightmaps */}
      <Sanctum />

      {/* Seamless ground plane matching background to eliminate any hard horizon */}
      <Floor />

      {/* Lit readable hero artefact per project beside the active brutalist slab */}
      <ProjectArtefact />

      {/* Volumetric sunbeam descending through the ceiling oculus onto the core */}
      <VolumeCone />
    </>
  );
}
