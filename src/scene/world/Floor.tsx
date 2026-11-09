import { Suspense, useMemo } from "react";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { TIERS } from "../../state/signal";

function ReflectorFloorMesh() {
  const quality = useOmni((s) => s.quality);
  const projects = useOmni((s) => s.section) === "projects";
  const roughnessMap = useTexture("/assets/textures/concrete_floor_worn_001_rough_1k.webp");

  useMemo(() => {
    if (roughnessMap) {
      roughnessMap.wrapS = THREE.RepeatWrapping;
      roughnessMap.wrapT = THREE.RepeatWrapping;
      roughnessMap.repeat.set(8, 8);
    }
  }, [roughnessMap]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        color="#ffffff"
        roughness={0.62}
        metalness={0.18}
        roughnessMap={roughnessMap}
        blur={quality === "high" ? [300, 150] : [200, 100]}
        resolution={quality === "high" ? 512 : 256}
        mixBlur={0.85}
        mixStrength={projects ? 0.6 : 2.6}   // r37: ch3 reflected the wall and frame edges into hot, banded patches; keep only a faint sheen there
        mirror={projects ? 0.45 : 0.88}
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#060505" roughness={0.94} metalness={0.04} />
    </mesh>
  );
}

export default function Floor() {
  const quality = useOmni((s) => s.quality);
  const projects = useOmni((s) => s.section) === "projects";

  // MeshReflectorMaterial on HIGH tier; plain matte #060505 floor on MEDIUM/LITE for 60fps
  // r37: and in ch3 on every tier: the mirror floor showed the wall and frame as grey banded slabs with a dark seam (HIGH tier only)
  if (!TIERS[quality].reflector || projects) {
    return <FallbackFloor />;
  }

  return (
    <Suspense fallback={<FallbackFloor />}>
      <ReflectorFloorMesh />
    </Suspense>
  );
}
