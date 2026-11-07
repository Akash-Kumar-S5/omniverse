import { Suspense, useMemo } from "react";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";

function ReflectorFloorMesh() {
  const roughnessMap = useTexture("/assets/textures/concrete_floor_worn_001_rough_2k.jpg");

  useMemo(() => {
    if (roughnessMap) {
      roughnessMap.wrapS = THREE.RepeatWrapping;
      roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(6, 6);
    }
  }, [roughnessMap]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
      <planeGeometry args={[160, 160]} />
      <MeshReflectorMaterial
        color="#020305"
        roughness={0.65}
        metalness={0.15}
        roughnessMap={roughnessMap}
        blur={[300, 150]}
        resolution={512}
        mixBlur={0.9}
        mixStrength={0.5}
        mirror={0.4}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        depthToBlurRatioBias={0.25}
      />
    </mesh>
  );
}

function FallbackFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
      <planeGeometry args={[160, 160]} />
      <meshStandardMaterial color="#020305" roughness={0.94} metalness={0.04} />
    </mesh>
  );
}

export default function Floor() {
  const quality = useOmni((s) => s.quality);

  // MeshReflectorMaterial resolution 512 on HIGH only; OFF on medium/lite
  if (quality !== "high") {
    return <FallbackFloor />;
  }

  return (
    <Suspense fallback={<FallbackFloor />}>
      <ReflectorFloorMesh />
    </Suspense>
  );
}
