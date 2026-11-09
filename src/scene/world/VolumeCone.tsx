import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
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

      {/* Subtle downward illumination through the ceiling oculus */}
      <spotLight
        position={[0, 8.8, 0]}
        target={targetRef.current}
        color="#fff5e8"
        intensity={quality === "high" ? 1.0 : 0.7}
        distance={24}
        angle={1.05}
        penumbra={0.98}
        decay={1.2}
      />

      {/* Floating warm motes within the moonbeam */}
      <Sparkles
        key={quality}
        position={[0, 3.8, 0]}
        count={quality === "high" ? 36 : 20}
        scale={[2.2, 5.8, 2.2]}
        size={quality === "high" ? 1.6 : 1.2}
        speed={0.12}
        color="#ff9a44"
        opacity={0.35}
      />
    </group>
  );
}
