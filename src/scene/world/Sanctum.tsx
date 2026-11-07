import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { SANCTUM_FILES } from "../../state/signal";

export default function Sanctum() {
  const quality = useOmni((s) => s.quality);
  const file = quality === "lite" ? SANCTUM_FILES.lite : SANCTUM_FILES.high;
  const { scene } = useGLTF(file, "/draco/");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          // Blender-sanctum bake: render unlit with toneMapped=false because lighting and AgX are pre-baked
          mesh.material = new THREE.MeshBasicMaterial({
            map: mat.map ?? mat.emissiveMap,
            toneMapped: false,
          });
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload(SANCTUM_FILES.high, "/draco/");
useGLTF.preload(SANCTUM_FILES.lite, "/draco/");
