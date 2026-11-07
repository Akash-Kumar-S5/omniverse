import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { TIERS, signal } from "../../state/signal";

export default function VolumeCone() {
  const quality = useOmni((s) => s.quality);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  useFrame(() => {
    if (targetRef.current) {
      targetRef.current.position.set(signal.focus[0], signal.focus[1], signal.focus[2]);
      targetRef.current.updateMatrixWorld();
    }
  });

  if (!TIERS[quality].volumetrics) return null;

  return (
    <group>
      {/* Target object added to the scene hierarchy so Three.js updates its world position */}
      <primitive object={targetRef.current} />

      {/* Volumetric sunbeam descending through the oculus [0, 8.8, 0] directly onto the core [0, 2.3, 0] */}
      <SpotLight
        position={[0, 8.8, 0]}
        target={targetRef.current}
        color="#fff0d4"
        intensity={quality === "high" ? 8.5 : 6.0}
        distance={18}
        angle={0.65}
        attenuation={26}
        anglePower={1.2}
        volumetric
        opacity={2.4}
        radiusTop={0.8}
        radiusBottom={3.6}
      />

      {/* Floating dust motes within the volumetric beam */}
      <Sparkles
        position={[0, 4.5, 0]}
        count={quality === "high" ? 60 : 35}
        scale={[3.6, 8, 3.6]}
        size={quality === "high" ? 2.8 : 2.0}
        speed={0.16}
        color="#ffe8c2"
        opacity={0.65}
      />
    </group>
  );
}
