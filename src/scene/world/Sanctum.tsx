import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { SANCTUM_FILES } from "../../state/signal";

export default function Sanctum() {
  const quality = useOmni((s) => s.quality);
  const file = quality === "lite" ? SANCTUM_FILES.lite : SANCTUM_FILES.high;
  const { scene } = useGLTF(file, "/draco/");
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // Keep baked Cycles textures clean and unlit without shadow artifacts
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      }
    });
  }, [cloned]);

  return <primitive object={cloned} />;
}

useGLTF.preload(SANCTUM_FILES.high, "/draco/");
useGLTF.preload(SANCTUM_FILES.lite, "/draco/");
