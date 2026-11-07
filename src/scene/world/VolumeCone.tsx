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
      <primitive object={targetRef.current} />
      {/* Volumetric sun shaft anchored at ceiling oculus, aimed directly at the core */}
      <SpotLight
        position={[1.8, 14, 0]}
        target={targetRef.current}
        color="#fff4e0"
        intensity={quality === "high" ? 7.5 : 4.8}
        distance={26}
        angle={0.65}
        attenuation={26}
        anglePower={2.8}
        volumetric
        opacity={1.35}
        radiusTop={0.9}
        radiusBottom={4.6}
      />
      {/* Floating dust motes within the volumetric beam */}
      <Sparkles
        position={[1.8, 5, 0]}
        count={quality === "high" ? 60 : 30}
        scale={[4.2, 11, 4.2]}
        size={quality === "high" ? 2.8 : 2.0}
        speed={0.18}
        color="#ffe8c2"
        opacity={0.65}
      />
    </group>
  );
}
