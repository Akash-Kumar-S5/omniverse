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
      {/* Volumetric shaft shining down from the oculus */}
      <SpotLight
        position={[0, 15, 0]}
        target={targetRef.current}
        color="#ede0cc"
        intensity={quality === "high" ? 3.6 : 2.4}
        distance={26}
        angle={0.42}
        attenuation={7.5}
        anglePower={4.5}
        volumetric
        opacity={0.32}
        radiusTop={0.5}
        radiusBottom={3.4}
      />
      {/* Floating dust motes inside the volumetric beam */}
      <Sparkles
        position={[0, 5, 0]}
        count={quality === "high" ? 45 : 20}
        scale={[4.2, 12, 4.2]}
        size={quality === "high" ? 2.2 : 1.6}
        speed={0.15}
        color="#eedcbe"
        opacity={0.36}
      />
    </group>
  );
}
