import { Suspense, useMemo } from "react";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";

function ReflectorFloorMesh() {
  const quality = useOmni((s) => s.quality);
  const roughnessMap = useTexture("/assets/textures/concrete_floor_worn_001_rough_2k.jpg");

  useMemo(() => {
    if (roughnessMap) {
      roughnessMap.wrapS = THREE.RepeatWrapping;
      roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(8, 8);
    }
  }, [roughnessMap]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        color="#ffffff"
        roughness={0.62}
        metalness={0.18}
        roughnessMap={roughnessMap}
        blur={quality === "high" ? [300, 150] : [200, 100]}
        resolution={quality === "high" ? 512 : 256}
        mixBlur={0.85}
        mixStrength={2.6}
        mirror={0.88}
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
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#060505" roughness={0.94} metalness={0.04} />
    </mesh>
  );
}

export default function Floor() {
  const quality = useOmni((s) => s.quality);

  // MeshReflectorMaterial resolution 512 on HIGH, 256 on MEDIUM; plain on LITE
  if (quality === "lite") {
    return <FallbackFloor />;
  }

  return (
    <Suspense fallback={<FallbackFloor />}>
      <ReflectorFloorMesh />
    </Suspense>
  );
}
